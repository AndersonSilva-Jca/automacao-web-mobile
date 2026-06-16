*** Settings ***
Library     AppiumLibrary
Library     OperatingSystem


*** Variables ***
${ENTRAR}       xpath=//android.widget.TextView[@text="Entrar"]


*** Keywords ***
Carregar Variaveis De Ambiente
    [Documentation]    Carrega o arquivo .env e cria as variáveis globais para o teste.
    Evaluate    __import__('dotenv').load_dotenv(dotenv_path='app/.env')

    # 1. Coleta os dados do sistema operacional (.env local ou CI)
    ${env_login2}=    Get Environment Variable    LOGIN2
    ${env_senha2}=    Get Environment Variable    SENHA2
    ${env_gmail_pass}=    Get Environment Variable    GMAIL_APP_PASS
    ${env_gmail_user}=    Get Environment Variable    GMAIL_USER

    # 2. Injeta os valores como GLOBAL
    Set Global Variable    $LOGIN2    ${env_login2}
    Set Global Variable    $SENHA2    ${env_senha2}
    Set Global Variable    $GMAIL_USER    ${env_gmail_user}
    Set Global Variable    $GMAIL_APP_PASS    ${env_gmail_pass}

Start session
    # 🌟 O SEGREDO ESTÁ AQUI: Chamando a Keyword para alimentar as variáveis ANTES de abrir o Appium
    Carregar Variaveis De Ambiente

    Open Application    http://127.0.0.1:4723
    ...    platformName=Android
    ...    appium:deviceName=emulator-5554
    ...    appium:automationName=UiAutomator2
    ...    appium:appPackage=com.everymind.clubegiro
    ...    appium:appActivity=.MainActivity
    # ...    appium:noReset=${True}
    ...    appium:autoGrantPermissions=${True}
    ...    appium:ensureWebviewsHavePages=${True}
    ...    appium:clearDeviceLogs=${True}
    ...    appium:nativeWebScreenshot=${True}
    ...    appium:uiautomator2ServerLaunchTimeout=${90000}
    ...    appium:uiautomator2ServerInstallTimeout=${60000}
    ...    appium:adbExecTimeout=${60000}
    ...    appium:newCommandTimeout=${300}
    ...    appium:connectHardwareKeyboard=${True}
    ...    appium:socketConnectionTimeout=${90000}

Login
    Sleep    7s
    Wait Until Element Is Visible    ${ENTRAR}    timeout=120s
    Click Element    ${ENTRAR}
    Wait Until Element Is Visible    xpath=//android.widget.EditText[@resource-id="email-input-login"]    timeout=60s
    Input Text    xpath=//android.widget.EditText[@resource-id="email-input-login"]    ${LOGIN2}
    Input Password    xpath=//android.widget.EditText[@resource-id="password-input-login"]    ${SENHA2}
    Wait Until Element Is Visible
    ...    xpath=//android.view.ViewGroup[@content-desc="ACESSAR"]/android.view.ViewGroup
    ...    timeout=60s
    Click Element    xpath=//android.view.ViewGroup[@content-desc="ACESSAR"]/android.view.ViewGroup
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Olá, ANDERSON"]    timeout=120s
    Log To Console    \nLogin realizado com sucesso! Olá, ANDERSON

Close session
    Close Application

Tratar Banner De Cookie Se Aparecer
    # 1. Verifica se o elemento aparece na tela em até 5 segundos
    # O Robot guarda True (se achou) ou False (se não achou) na variável
    ${cookie_visivel}=    Run Keyword And Return Status
    ...    Wait Until Element Is Visible
    ...    xpath=//android.app.AlertDialog[@resource-id="cookie-banner"]
    ...    timeout=60s

    # 2. Se a resposta for True, ele entra no bloco e clica para aceitar
    IF    ${cookie_visivel}
        Log To Console    \n[INFO] Banner de cookie detectado. Aceitando...
        Click Element    xpath=//android.widget.Button[@resource-id="adopt-accept-all-button"]
    ELSE
        Log To Console    \n[INFO] Banner de cookie não apareceu. Seguindo o fluxo...
    END

Fechar modal do login
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Garanta AGORA até 55% OFF"]    timeout=120s

    Tap With Positions    1000ms    ${952, 186}
