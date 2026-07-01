*** Settings ***
Documentation     Suíte de testes focada no cenário de login da aplicação Clube Giro.
Library           AppiumLibrary
Library           ../appGiro/resources/GeradorDataIda.py
Library           ../appGiro/resources/GeradorDataVolta.py
Library           ../libraries/GmailHelper.py
Library           String
Library           ImapLibrary
Resource          ../appGiro/resources/giro_base.resource

Test Setup        Start session

*** Test Cases ***
Deve Realizar O Login Com Sucesso Tratando 2FA Se Solicitado
    [Tags]    smoke    login
    Login
    Click Element    xpath=//android.widget.TextView[@text="Menu"]
    Wait Until Element Is Visible
    ...    xpath=//android.widget.TextView[@text="Olá, ANDERSON"]    timeout=60s
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Acessar minha conta"]    timeout=20s
    Swipe    start_x=545    start_y=2280    end_x=559    end_y=78    duration=1s
    Swipe    start_x=556    start_y=1995    end_x=553    end_y=542    duration=1s
    Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@content-desc="Sair do app"]    timeout=30s
    Click Element    xpath=//android.view.ViewGroup[@content-desc="Sair do app"]
    Wait Until Element Is Visible    xpath=//android.widget.Button[@resource-id="android:id/button1"]    timeout=15s
    Click Element    xpath=//android.widget.Button[@resource-id="android:id/button1"]
    Log To Console    \nSaindo do App Giro.
    Wait Until Element Is Visible    accessibility_id=Entrar    timeout=60s
    Close session