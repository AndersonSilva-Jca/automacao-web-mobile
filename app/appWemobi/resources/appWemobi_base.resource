*** Settings ***
Library     AppiumLibrary
Library     OperatingSystem
# Library    AppiumLibrary    screenshot_root_directory=${CURDIR}/../../public


*** Variables ***
${ENTRAR}               id=user
${LOGIN}                ${EMPTY}
${SENHA}                ${EMPTY}
${MAIL_USERNAME}        ${EMPTY}
${GMAIL_APP_PASS}       ${EMPTY}


*** Keywords ***
Carregar Variaveis De Ambiente
    [Documentation]    Carrega o arquivo .env e cria as variáveis globais para o teste.
    Evaluate    __import__('dotenv').load_dotenv(dotenv_path='app/.env')

    # 1. Coleta os dados do sistema operacional (.env local ou CI)
    ${env_login}=    Get Environment Variable    LOGIN
    ${env_senha}=    Get Environment Variable    SENHA
    ${env_mail_username}=    Get Environment Variable    MAIL_USERNAME

    # 2. Injeta os valores como GLOBAL
    Set Global Variable    ${LOGIN}    ${env_login}
    Set Global Variable    ${SENHA}    ${env_senha}
    Set Global Variable    ${MAIL_USERNAME}    ${env_mail_username}

Start session
    # 🌟 O SEGREDO ESTÁ AQUI: Chamando a Keyword para alimentar as variáveis ANTES de abrir o Appium
    Carregar Variaveis De Ambiente
    Open Application    http://127.0.0.1:4723
    ...    platformName=Android
    ...    appium:deviceName=emulator-5554
    ...    appium:automationName=UiAutomator2
    ...    appium:appPackage=me.wemobi.wemobiapp
    ...    appium:appActivity=.MainActivity
    ...    appWaitDuration=50000
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
    Wait Until Element Is Visible    xpath=//android.widget.EditText[@resource-id="user"]    timeout=240s
    Log To Console    \nFazendo o Login...
    Input Text    xpath=//android.widget.EditText[@resource-id="user"]    ${LOGIN}
    Input Password    xpath=//android.widget.EditText[@resource-id="password"]    ${SENHA}
    Wait Until Element Is Visible
    ...    xpath=//android.view.ViewGroup[@content-desc="Entrar"]/android.view.View
    ...    timeout=60s
    Click Element    xpath=//android.view.ViewGroup[@content-desc="Entrar"]/android.view.View
    Sleep    5s
    Wait Until Element Is Visible
    ...    xpath=//android.view.ViewGroup[@content-desc="Buscar"]/android.view.View    timeout=90s
    Log To Console    \nTela de Busca exibida com sucesso!
    Click Element
    ...    android=new UiSelector().className("android.widget.ImageView").instance(1)
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@resource-id="name"]
    Log To Console    \nLogin realizado com sucesso!
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@resource-id="name"]
    Log To Console    \nOlá, Anderson Silva
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Sair"]    timeout=30s
    Log To Console    \nClicando em Sair...
    Click Element    xpath=//android.widget.TextView[@text="Sair"]
    # Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@content-desc="Viagens"]    timeout=60s

Close session
    Close Application

Tratar Banner De Cookie Se Aparecer
    # 1. Verifica se o elemento aparece na tela em até 5 segundos
    # O Robot guarda True (se achou) ou False (se não achou) na variável
    ${cookie_visivel}=    Run Keyword And Return Status
    ...    Wait Until Element Is Visible    xpath=//android.app.Dialog[@resource-id="cookie-banner"]    timeout=60s

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

Iniciar Gravacao Do Video
    [Documentation]    Inicia a gravação da tela do emulador
    Start Recording Screen

Finalizar E Salvar Video
    [Documentation]    Para a gravação e gera o arquivo video-execucao.mp4
    Stop Recording Screen    filename=video-execucao

Encerrar Sessao E Gravar Video
    [Documentation]    Garante capturas de evidência e fecha o app
    Run Keyword If Test Failed    Capture Page Screenshot
    Finalizar E Salvar Video
    Close session