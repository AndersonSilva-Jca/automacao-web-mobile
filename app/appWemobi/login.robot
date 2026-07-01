*** Settings ***
Library             AppiumLibrary
Library             ../appWemobi/resources/GeradorDataIda.py
Library             ../appWemobi/resources/GeradorDataVolta.py
Resource            ../appWemobi/resources/appWemobi_base.resource
Library             ../libraries/GmailHelper.py
Test Teardown       Close All Applications



*** Test Cases ***
Deve realizar o login com sucesso
    
    Start session
    Login
    
    Close session
