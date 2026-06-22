import imaplib
import quopri
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
    


def obter_codigo_verificacao_do_gmail(usuario, senha, remetente):
    # Conecta ao servidor IMAP do Gmail
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login(usuario, senha)
    mail.select("inbox")
    
    # Busca por e-mails não lidos vindos do remetente correto
    status, mensagens = mail.search(None, f'(UNSEEN FROM "{remetente}")')
    
    # Se não achar não lidos, busca os últimos e-mails num geral do remetente
    if not mensagens[0].split():
        status, mensagens = mail.search(None, f'(FROM "{remetente}")')
        
    id_lista = mensagens[0].split()
    if id_lista:
        latest_email_id = id_lista[-1] # Pega o e-mail mais recente
        status, dados = mail.fetch(latest_email_id, "(RFC822)")
        
        raw_email = dados[0][1]
        msg = email.message_from_bytes(raw_email)
        
        corpo = ""
        if msg.is_multipart():
            for parte in msg.walk():
                if parte.get_content_type() == "text/html":
                    corpo = parte.get_payload(decode=True)
                    break
        else:
            corpo = msg.get_payload(decode=True)
            
        # Decodifica de forma segura removendo os problemas de Quoted-Printable
        texto_limpo = quopri.decodestring(corpo).decode('utf-8', errors='ignore')
        
        # Encontra a primeira sequência de 6 números no corpo do e-mail
        codigo = re.search(r'\b\d{6}\b', texto_limpo)
        
        mail.close()
        mail.logout()
        
        if codigo:
            return codigo.group(0)
            
    mail.close()
    mail.logout()
    raise Exception(f"Código de 2FA não foi localizado no e-mail do remetente {remetente}")