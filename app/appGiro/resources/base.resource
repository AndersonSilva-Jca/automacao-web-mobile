*** Settings ***
Documentation     Suite de testes para automação mobile com tratamento condicional de 2FA por e-mail.
Library           AppiumLibrary
Library           OperatingSystem
Library           String
Library           ../../libraries/GmailHelper.py

*** Variables ***
${LOGIN2}               ${EMPTY}
${SENHA2}               ${EMPTY}
${GMAIL_USER}           ${EMPTY}
${GMAIL_APP_PASS}       ${EMPTY}
${REMETENTE_APP}        ${EMPTY}
${XPATH_TITULO_2FA}     xpath=//android.widget.TextView[@text="Verifique seu e-mail"]

*** Keywords ***
Carregar Variaveis De Ambiente
    [Documentation]    Carrega o arquivo .env e cria as variáveis globais para o teste.
    Evaluate    __import__('dotenv').load_dotenv(dotenv_path='app/.env')

    ${env_login2}=           Get Environment Variable    LOGIN2
    ${env_senha2}=           Get Environment Variable    SENHA2
    ${env_gmail_pass}=       Get Environment Variable    GMAIL_APP_PASS
    ${env_gmail_user}=       Get Environment Variable    GMAIL_USER
    ${env_remetente_app}=    Get Environment Variable    REMETENTE_APP

    Set Global Variable    ${LOGIN2}            ${env_login2}
    Set Global Variable    ${SENHA2}            ${env_senha2}
    Set Global Variable    ${GMAIL_USER}        ${env_gmail_user}
    Set Global Variable    ${GMAIL_APP_PASS}    ${env_gmail_pass}
    Set Global Variable    ${REMETENTE_APP}     ${env_remetente_app}

Start session
    [Documentation]    Inicializa o aplicativo configurando o ambiente previamente.
    Carregar Variaveis De Ambiente
    Open Application    http://127.0.0.1:4723
    ...    platformName=Android
    ...    appium:deviceName=emulator-5554
    ...    appium:automationName=UiAutomator2
    ...    appium:appPackage=com.everymind.clubegiro
    ...    appium:appActivity=.MainActivity
    ...    appWaitDuration=60000
    ...    appium:autoGrantPermissions=${True}
    ...    appium:ensureWebviewsHavePages=${True}
    ...    appium:clearDeviceLogs=${True}
    ...    appium:nativeWebScreenshot=${True}
    ...    appium:uiautomator2ServerLaunchTimeout=${120000}
    ...    appium:uiautomator2ServerInstallTimeout=${60000}
    ...    appium:adbExecTimeout=${60000}
    ...    appium:newCommandTimeout=${300}
    ...    appium:connectHardwareKeyboard=${True}

Executar Fluxo De Login Completo
    [Documentation]    Insere as credenciais, clica em acessar e despacha para verificação de 2FA.
    Wait Until Element Is Visible    accessibility_id=Entrar    timeout=60s
    Click Element    accessibility_id=Entrar
    Wait Until Element Is Visible    xpath=//android.widget.EditText[@resource-id="email-input-login"]    timeout=60s
    Input Text       xpath=//android.widget.EditText[@resource-id="email-input-login"]    ${LOGIN2}
    Input Password   xpath=//android.widget.EditText[@resource-id="password-input-login"]   ${SENHA2}
    
    Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@content-desc="ACESSAR"]/android.view.ViewGroup    timeout=120s
    Click Element    xpath=//android.view.ViewGroup[@content-desc="ACESSAR"]/android.view.ViewGroup
    
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Olá, ANDERSON"]    timeout=60s
    Log To Console    \n[SUCESSO] Login realizado com sucesso! Olá, ANDERSON

Tratar Fluxo De 2FA Se Necessario
    [Documentation]    Verifica dinamicamente se a tela de 2FA apareceu em até 15 segundos.
    ${status}=    Run Keyword And Return Status    Wait Until Element Is Visible    ${XPATH_TITULO_2FA}    timeout=30s
    
    IF    ${status}
        Log To Console    \n[INFO] Tela de 2FA detectada. Acessando caixa de e-mail...
        ${codigo_verificacao}=    Buscar Codigo 2FA No Email
        Log To Console    \n[INFO] Código capturado: ${codigo_verificacao}
        
        Inserir Codigo No Aplicativo    ${codigo_verificacao}
        
        Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Confirmar"]/..    timeout=30s
        Click Element                    xpath=//android.widget.TextView[@text="Confirmar"]/..
    ELSE
        Log To Console    \n[INFO] Tela de 2FA não foi apresentada após 15s. Verificando se já foi direto para a Home...
    END

Buscar Codigo 2FA No Email
    [Documentation]    Usa a segunda função do Python que filtra por remetente e e-mails não lidos.
    
    # Também é bom manter uma pequena espera para o e-mail chegar
    Sleep    5s
    
    # Chamando a segunda função do seu arquivo Python
    ${codigo}=    Obter Codigo Verificacao Do Gmail    ${GMAIL_USER}    ${GMAIL_APP_PASS}    ${REMETENTE_APP}
    RETURN        ${codigo}

Inserir Codigo No Aplicativo
    [Arguments]    ${codigo}
    [Documentation]    Identifica o input unificado do Android e insere o código completo.
    Wait Until Element Is Visible    android=new UiSelector().className("android.widget.EditText").instance(0)    timeout=30s
    
    ${d1}=    Get Substring    ${codigo}    0    1
    ${d2}=    Get Substring    ${codigo}    1    2
    ${d3}=    Get Substring    ${codigo}    2    3
    ${d4}=    Get Substring    ${codigo}    3    4
    ${d5}=    Get Substring    ${codigo}    4    5
    ${d6}=    Get Substring    ${codigo}    5    6

    Input Text    android=new UiSelector().className("android.widget.EditText").instance(0)    ${d1}
    Input Text    android=new UiSelector().className("android.widget.EditText").instance(1)    ${d2}
    Input Text    android=new UiSelector().className("android.widget.EditText").instance(2)    ${d3}
    Input Text    android=new UiSelector().className("android.widget.EditText").instance(3)    ${d4}
    Input Text    android=new UiSelector().className("android.widget.EditText").instance(4)    ${d5}
    Input Text    android=new UiSelector().className("android.widget.EditText").instance(5)    ${d6}

    Log To Console    \n[INFO] Código de 6 dígitos distribuído perfeitamente entre os inputs nativos.

Close session
    Close Application