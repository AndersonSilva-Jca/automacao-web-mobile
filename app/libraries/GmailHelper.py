import imaplib
import quopri
import email
import re
import time
from email.header import decode_header


class GmailHelper:
    ROBOT_LIBRARY_SCOPE = 'GLOBAL'

    def _conectar(self, usuario, senha):
        mail = imaplib.IMAP4_SSL("imap.gmail.com", 993)
        mail.login(usuario, senha)
        return mail

    def _desconectar(self, mail):
        try:
            mail.close()
            mail.logout()
        except Exception:
            pass

    # ------------------------------------------------------------------
    # KEYWORD 1 — Chamar ANTES de clicar ACESSAR
    # Retorna o ID IMAP do último e-mail do remetente agora.
    # Se não houver nenhum retorna "0".
    # ------------------------------------------------------------------
    def obter_id_ultimo_email_do_remetente(self, usuario, senha, remetente):
        """
        Fotografa o estado atual da caixa de entrada ANTES do login.
        Qualquer e-mail com ID maior que o retornado aqui é garantidamente
        novo — gerado por esta sessão de teste.
        """
        print(f"📸 [IMAP] Capturando âncora para '{remetente}'...")
        mail = self._conectar(usuario, senha)
        try:
            mail.select("INBOX")
            status, msgs = mail.search(None, f'(FROM "{remetente}")')
            id_lista = msgs[0].split() if (status == "OK" and msgs[0]) else []
            ancora = id_lista[-1].decode() if id_lista else "0"
            print(f"📸 [IMAP] Âncora = {ancora}  ({len(id_lista)} e-mail(s) pré-existente(s))")
            return ancora
        finally:
            self._desconectar(mail)

    # ------------------------------------------------------------------
    # KEYWORD 2 — Chamar APÓS clicar ACESSAR
    # Aguarda um e-mail com ID > id_anterior e extrai o código.
    # Se o código devolvido tiver sido inválido no app, passa
    # ignorar_codigo e a função espera o PRÓXIMO e-mail diferente.
    # ------------------------------------------------------------------
    def obter_codigo_verificacao_do_gmail(
        self,
        usuario,
        senha,
        remetente,
        ignorar_codigo=None,
        id_anterior="0",
        max_tentativas=20,
        espera=4,
    ):
        """
        Parâmetros
        ----------
        id_anterior    : ID âncora capturado antes do ACESSAR (string).
                         Só aceita e-mails com ID ESTRITAMENTE MAIOR.
        ignorar_codigo : código que o app rejeitou — aguarda e-mail novo
                         com código diferente.
        max_tentativas : polling até 20 × 4 s = 80 s por padrão.
        """
        ancora       = int(id_anterior) if str(id_anterior).strip().isdigit() else 0
        max_tent     = int(max_tentativas)
        espera_s     = int(espera)
        ignorar      = str(ignorar_codigo).strip() if ignorar_codigo else None
        id_ja_lido   = ancora          # avança quando ignorar_codigo bate

        print(f"🚀 [IMAP] Aguardando e-mail de '{remetente}' com ID > {ancora}...")
        if ignorar:
            print(f"⚠️  [IMAP] Código a ignorar: {ignorar}")

        mail = self._conectar(usuario, senha)
        try:
            for tent in range(1, max_tent + 1):
                mail.select("INBOX")          # força refresh
                status, msgs = mail.search(None, f'(FROM "{remetente}")')
                id_lista = msgs[0].split() if (status == "OK" and msgs[0]) else []

                # Filtra IDs maiores que id_ja_lido (começa em âncora,
                # avança quando um código inválido é descartado)
                novos = [i for i in id_lista if int(i) > id_ja_lido]

                if not novos:
                    print(
                        f"⏳ [IMAP] {tent}/{max_tent} — aguardando novo e-mail "
                        f"(referência atual: {id_ja_lido})..."
                    )
                    time.sleep(espera_s)
                    continue

                email_id = novos[-1]          # mais recente dos novos
                print(f"📬 [IMAP] Novo e-mail encontrado: ID={email_id.decode()}")

                # Baixa o e-mail
                status, dados = mail.fetch(email_id, "(RFC822)")
                if status != "OK" or not dados or dados[0] is None:
                    print("❌ [IMAP] Falha ao baixar o e-mail.")
                    time.sleep(espera_s)
                    continue

                msg = email.message_from_bytes(dados[0][1])

                # Log do assunto
                raw_subj, enc = decode_header(msg.get("Subject", ""))[0]
                assunto = (
                    raw_subj.decode(enc or "utf-8", errors="ignore")
                    if isinstance(raw_subj, bytes) else raw_subj
                )
                print(f"📝 [IMAP] Assunto: \"{assunto}\"")

                # Extrai corpo (HTML → plain)
                corpo = b""
                if msg.is_multipart():
                    for parte in msg.walk():
                        if parte.get_content_type() == "text/html":
                            corpo = parte.get_payload(decode=True) or b""
                            break
                    if not corpo:
                        for parte in msg.walk():
                            if parte.get_content_type() == "text/plain":
                                corpo = parte.get_payload(decode=True) or b""
                                break
                else:
                    corpo = msg.get_payload(decode=True) or b""

                texto = quopri.decodestring(corpo).decode("utf-8", errors="ignore")

                # ── Estratégia 1: número de 6 dígitos isolado entre tags HTML ──
                # Corresponde ao padrão do e-mail: <div ...> 983091 </div>
                # Ignora números embutidos em URLs, classes CSS, atributos, etc.
                codigo = None
                match_html = re.search(r'>\s*(\d{6})\s*<', texto)
                if match_html:
                    codigo = match_html.group(1)
                    print(f"✅ [IMAP] Código extraído via tag HTML: {codigo}")

                # ── Estratégia 2: último número de 6 dígitos no texto puro ────
                # Remove todas as tags HTML e busca o último 6-dígitos encontrado.
                # "Último" porque o código fica no corpo, e URLs/IDs ficam antes.
                if not codigo:
                    texto_puro = re.sub(r'<[^>]+>', ' ', texto)
                    todos = re.findall(r'\b\d{6}\b', texto_puro)
                    if todos:
                        # Log de todos os candidatos para diagnóstico
                        print(f"🔍 [IMAP] Candidatos encontrados no texto puro: {todos}")
                        codigo = todos[-1]
                        print(f"✅ [IMAP] Código extraído (último candidato): {codigo}")

                if not codigo:
                    print("⚠️  [IMAP] Código de 6 dígitos não encontrado no corpo.")
                    time.sleep(espera_s)
                    continue

                # Código é o mesmo que foi inválido? Avança a referência e espera
                # o PRÓXIMO e-mail (não fica preso no mesmo)
                if ignorar and codigo == ignorar:
                    print(
                        f"⚠️  [IMAP] Código {codigo} é o mesmo inválido. "
                        f"Avançando referência para ID={email_id.decode()} e aguardando novo e-mail..."
                    )
                    id_ja_lido = int(email_id)   # <── CORREÇÃO DO BUG
                    time.sleep(espera_s)
                    continue

                print(f"🎯 [IMAP] Código válido extraído: {codigo}  (ID={email_id.decode()})")
                return codigo

        finally:
            self._desconectar(mail)

        raise Exception(
            f"Nenhum e-mail novo de '{remetente}' chegou após "
            f"{max_tent} tentativas (~{max_tent * espera_s}s)."
        )