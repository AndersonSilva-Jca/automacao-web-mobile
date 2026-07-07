*** Settings ***
Library     AppiumLibrary
Library     OperatingSystem
# Library    AppiumLibrary    screenshot_root_directory=${CURDIR}


*** Variables ***
${LOGIN}                ${EMPTY}
${SENHA}                ${EMPTY}
${GMAIL_USER}           ${EMPTY}
${GMAIL_APP_PASS}       ${EMPTY}


*** Keywords ***
Carregar Variaveis De Ambiente
    [Documentation]    Carrega o arquivo .env e cria as variáveis globais para o teste.
    Evaluate    __import__('dotenv').load_dotenv(dotenv_path='app/.env')

    # 1. Coleta os dados do sistema operacional (.env local ou CI)
    ${env_login}=    Get Environment Variable    LOGIN
    ${env_senha}=    Get Environment Variable    SENHA
    ${env_gmail_pass}=    Get Environment Variable    GMAIL_APP_PASS
    ${env_gmail_user}=    Get Environment Variable    GMAIL_USER

    # 2. Injeta os valores como GLOBAL
    Set Global Variable    ${LOGIN}    ${env_login}
    Set Global Variable    ${SENHA}    ${env_senha}
    Set Global Variable    ${GMAIL_USER}    ${env_gmail_user}
    Set Global Variable    ${GMAIL_APP_PASS}    ${env_gmail_pass}

Start session
    # 🌟 O SEGREDO ESTÁ AQUI: Chamando a Keyword para alimentar as variáveis ANTES de abrir o Appium
    Carregar Variaveis De Ambiente

    Open Application    http://127.0.0.1:4723
    ...    platformName=Android
    ...    appium:deviceName=emulator-5554
    ...    appium:automationName=UiAutomator2
    ...    appium:appPackage=br.com.viacaocometa.cometaapp
    ...    appium:appActivity=.MainActivity
    ...    appWaitDuration=60000
    ...    appium:noReset=${True}
    ...    appium:autoGrantPermissions=${True}
    ...    appium:ensureWebviewsHavePages=${True}
    ...    appium:clearDeviceLogs=${True}
    ...    appium:nativeWebScreenshot=${True}
    ...    appium:uiautomator2ServerLaunchTimeout=${120000}
    ...    appium:uiautomator2ServerInstallTimeout=${60000}
    ...    appium:adbExecTimeout=${60000}
    ...    appium:newCommandTimeout=${300}
    ...    appium:connectHardwareKeyboard=${True}
    ...    appium:socketConnectionTimeout=${90000}
    ...    appium:androidInstallTimeout= ${120000}

Login
    Sleep    3s
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Acesse sua conta"]    timeout=60s
    Log To Console    \n Assert Acesse sua conta
    Click Element    xpath=//android.widget.EditText[@resource-id="user"]
    Input Text    xpath=//android.widget.EditText[@resource-id="user"]    ${LOGIN}
    Input Password    xpath=//android.widget.EditText[@resource-id="password"]    ${SENHA}
    Click Element    xpath=//android.view.ViewGroup[@content-desc="Entrar"]/android.view.View
    Log To Console    \n Usuário logado com sucesso.

Close session
    Close Application


    ${cookie_visivel}=    Run Keyword And Return Status
    ...    Wait Until Element Is Visible
    ...    xpath=//android.app.AlertDialog[@resource-id="cookie-banner"]
    ...    timeout=60s
    IF    ${cookie_visivel}
        Log To Console    \n[INFO] Banner de cookie detectado. Aceitando...
        Click Element    xpath=//android.widget.Button[@resource-id="adopt-accept-all-button"]
    ELSE
        Log To Console    \n[INFO] Banner de cookie não apareceu. Seguindo o fluxo...
    END

Fechar modal do login
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Garanta AGORA até 55% OFF"]    timeout=120s

    Tap With Positions    1000ms    ${952, 186}
