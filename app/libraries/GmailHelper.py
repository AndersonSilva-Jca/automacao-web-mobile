import imaplib
import email
import re
from email.header import decode_header

class GmailHelper:
    ROBOT_LIBRARY_SCOPE = 'GLOBAL'

    def buscar_codigo_2fa_gmail(self, usuario, senha_app):
        """
        Acessa o Gmail via IMAP, analisa os e-mails mais recentes
        e extrai de forma estável o token contendo 6 dígitos sequenciais.
        """
        print(f"🚀 [IMAP LOG] Iniciando busca estável do código 2FA para: {usuario}")
        codigo_encontrado = None
        
        try:
            # Estabelece conexão SSL segura com os servidores do Gmail
            mail = imaplib.IMAP4_SSL("imap.gmail.com", 993)
            mail.login(usuario, senha_app)
            
            # Abre a caixa de entrada principal
            mail.select("INBOX")
            
            # Executa uma busca por todas as mensagens para indexar os IDs numéricos
            status, mensagens = mail.search(None, "ALL")
            if status != "OK":
                print("❌ [IMAP LOG] Falha ao ler os registros de e-mail da Inbox.")
                return None
                
            lista_ids = mensagens[0].split()
            if not lista_ids:
                print("⚠️ [IMAP LOG] A caixa de entrada está totalmente vazia.")
                return None
                
            # Filtra cirurgicamente apenas os IDs das 3 últimas mensagens recebidas
            ultimos_ids = lista_ids[-3:]
            # Inverte o array para varrer cronologicamente do mais novo para o mais antigo
            ultimos_ids.reverse() 
            
            for email_id in ultimos_ids:
                status, dados_email = mail.fetch(email_id, "(RFC822)")
                if status != "OK":
                    continue
                    
                for resposta in dados_email:
                    if isinstance(resposta, tuple):
                        # Converte a resposta em um formato tratável de e-mail
                        msg = email.message_from_bytes(resposta[1])
                        
                        # Captura e decodifica o assunto da mensagem para fins de log
                        assunto, encoding = decode_header(msg["Subject"])[0]
                        if isinstance(assunto, bytes):
                            assunto = assunto.decode(encoding if encoding else "utf-8", errors="ignore")
                        print(f"📝 [IMAP LOG] Analisando e-mail recente - Assunto: \"{assunto}\"")
                        
                        # Mapeamento do corpo do texto (Multipart ou Texto Puro)
                        corpo_texto = ""
                        if msg.is_multipart():
                            for parte in msg.walk():
                                tipo_conteudo = parte.get_content_type()
                                if tipo_conteudo in ["text/plain", "text/html"]:
                                    try:
                                        corpo_texto += parte.get_payload(decode=True).decode("utf-8", errors="ignore")
                                    except:
                                        pass
                        else:
                            corpo_texto = msg.get_payload(decode=True).decode("utf-8", errors="ignore")
                        
                        # Expressão regular idêntica à do Cypress para extrair os 6 dígitos sequenciais
                        match = re.search(r'\b(\d{6})\b', corpo_texto)
                        if match:
                            codigo_encontrado = match.group(1)
                            print(f"🎯 [IMAP LOG] Código localizado com sucesso: {codigo_encontrado}")
                            break 
                            
                if codigo_encontrado:
                    break
                    
            # Desconexão limpa do protocolo
            mail.close()
            mail.logout()
            print("🔌 [IMAP LOG] Sessão encerrada.")
            
        except Exception as e:
            print(f"❌ [IMAP LOG] Erro controlado de protocolo: {str(e)}")
            
        return codigo_encontrado