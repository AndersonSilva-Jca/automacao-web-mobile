*** Settings ***
Documentation     Suíte de testes focada no cenário de login da aplicação Clube Giro.
Library           AppiumLibrary
Library           ../appGiro/resources/GeradorDataIda.py
Library           ../appGiro/resources/GeradorDataVolta.py
Library           ../libraries/GmailHelper.py
Library           String
Library           ImapLibrary
Resource          ../appGiro/resources/base.resource

Test Setup        Start session
# Test Teardown     Close session

*** Test Cases ***
Deve Realizar O Login Com Sucesso Tratando 2FA Se Solicitado
    [Tags]    smoke    login
    Executar Fluxo De Login Completo