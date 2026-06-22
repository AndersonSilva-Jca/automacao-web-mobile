*** Settings ***
Documentation     Suite de testes para automação mobile com tratamento condicional de 2FA por e-mail.
Library           AppiumLibrary
Library           OperatingSystem
Library           String
Library           ../../libraries/GmailHelper.py

*** Variables ***
${LOGIN}                ${EMPTY}
${SENHA}                ${EMPTY}
${GMAIL_USER}           ${EMPTY}
${GMAIL_APP_PASS}       ${EMPTY}
${REMETENTE_APP}        ${EMPTY}


*** Keywords ***
Carregar Variaveis De Ambiente
    [Documentation]    Carrega o arquivo .env e cria as variáveis globais para o teste.
    Evaluate    __import__('dotenv').load_dotenv(dotenv_path='app/.env')

    ${env_login}=           Get Environment Variable    LOGIN
    ${env_senha}=           Get Environment Variable    SENHA
    ${env_gmail_pass}=       Get Environment Variable    GMAIL_APP_PASS
    ${env_gmail_user}=       Get Environment Variable    GMAIL_USER
    ${env_remetente_app}=    Get Environment Variable    REMETENTE_APP

    Set Global Variable    ${LOGIN}            ${env_login}
    Set Global Variable    ${SENHA}            ${env_senha}
    Set Global Variable    ${GMAIL_USER}        ${env_gmail_user}
    Set Global Variable    ${GMAIL_APP_PASS}    ${env_gmail_pass}
    Set Global Variable    ${REMETENTE_APP}     ${env_remetente_app}

Start session


    Carregar Variaveis De Ambiente
    Open Application    http://127.0.0.1:4723
    ...    platformName=Android
    ...    appium:deviceName=emulator-5554
    ...    appium:automationName=UiAutomator2
    ...    browserName=Chrome
    ...    appium:ensureWebviewsHavePages=${True}
    ...    appium:noReset=${True}
    ...    appium:autoGrantPermissions=${True}
    ...    appium:clearDeviceLogs=${True}
    ...    appium:uiautomator2ServerLaunchTimeout=${90000}
    ...    appium:uiautomator2ServerInstallTimeout=${60000}
    ...    appium:adbExecTimeout=${60000}
    ...    appium:newCommandTimeout=${300}
    ...    appium:connectHardwareKeyboard=${True}

    Go To Url    https://www.outletdepassagens.com.br

Login
    Sleep    7s
