*** Settings ***
Library             AppiumLibrary
Library             ../appWemobi/resources/GeradorDataIda.py
Library             ../appWemobi/resources/GeradorDataVolta.py
Resource            ../appWemobi/resources/appWemobi_base.resource
Library             ../libraries/GmailHelper.py
# Alterado para uma keyword personalizada que fecha a app e guarda o vídeo com segurança
Test Teardown       Encerrar Sessao E Gravar Video

*** Test Cases ***
Deve realizar o login com sucesso
    [Setup]       Iniciar Gravacao Do Video
    Start session
    Login
    # Nota: Removemos o "Close session" daqui porque o Test Teardown já o fará automaticamente, mesmo se o teste falhar a meio.