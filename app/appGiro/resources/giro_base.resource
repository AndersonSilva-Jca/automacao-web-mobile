*** Settings ***
Documentation     Suite de testes — automação mobile com tratamento condicional de 2FA por e-mail.
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
${ULTIMO_EMAIL_ID}      0

${XPATH_TITULO_2FA}         xpath=//android.widget.TextView[@text="Verifique seu e-mail"]
${XPATH_BTN_CONFIRMAR}      xpath=//android.widget.TextView[@text="Confirmar"]/..
${XPATH_CODIGO_INVALIDO}    xpath=//android.widget.TextView[@text="Código inválido. Tente novamente."]

*** Keywords ***
# ─────────────────────────────────────────────────────────────────────────────
Carregar Variaveis De Ambiente
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

# ─────────────────────────────────────────────────────────────────────────────
Start session
    Carregar Variaveis De Ambiente
    Open Application    http://127.0.0.1:4723
    ...    platformName=Android
    ...    appium:deviceName=emulator-5554
    ...    appium:automationName=UiAutomator2
    ...    appium:appPackage=com.everymind.clubegiro
    ...    appium:appActivity=.MainActivity
    ...    appWaitDuration=60000
    # ...    appium:noReset=${True}
    ...    appium:autoGrantPermissions=${True}
    ...    appium:ensureWebviewsHavePages=${True}
    ...    appium:clearDeviceLogs=${True}
    ...    appium:nativeWebScreenshot=${True}
    ...    appium:uiautomator2ServerLaunchTimeout=${120000}
    ...    appium:uiautomator2ServerInstallTimeout=${60000}
    ...    appium:adbExecTimeout=${60000}
    ...    appium:newCommandTimeout=${300}
    ...    appium:connectHardwareKeyboard=${True}

# ─────────────────────────────────────────────────────────────────────────────
Login
    [Documentation]
    ...    Preenche credenciais e clica ACESSAR.
    ...    ► Antes de clicar: fotografa o ID do último e-mail (âncora).
    ...    ► Após clicar: verifica 2FA usando apenas e-mails com ID > âncora.
    Sleep    7s
    Wait Until Element Is Visible    accessibility_id=Entrar    timeout=240s
     Log To Console    \nFazendo o Login...
    Click Element                    accessibility_id=Entrar

    Wait Until Element Is Visible
    ...    xpath=//android.widget.EditText[@resource-id="email-input-login"]    timeout=60s
    Input Text
    ...    xpath=//android.widget.EditText[@resource-id="email-input-login"]    ${LOGIN2}
    Input Password
    ...    xpath=//android.widget.EditText[@resource-id="password-input-login"]    ${SENHA2}

    # ── Fotografa âncora ANTES de clicar ACESSAR ─────────────────────────────
    # ${id_ancora}=    Obter Id Ultimo Email Do Remetente
    # ...    ${GMAIL_USER}    ${GMAIL_APP_PASS}    ${REMETENTE_APP}
    # Set Global Variable    ${ULTIMO_EMAIL_ID}    ${id_ancora}
    # Log To Console    \n[2FA] Âncora definida: ID=${id_ancora} — só e-mails com ID maior serão lidos

    Wait Until Element Is Visible
    ...    xpath=//android.view.ViewGroup[@content-desc="ACESSAR"]/android.view.ViewGroup    timeout=120s
    Click Element
    ...    xpath=//android.view.ViewGroup[@content-desc="ACESSAR"]/android.view.ViewGroup

    Tratar Fluxo De 2FA Se Necessario

    Log To Console    \n[SUCESSO] Login realizado com sucesso!
# ─────────────────────────────────────────────────────────────────────────────
Tratar Fluxo De 2FA Se Necessario
    [Documentation]
    ...    Aguarda até 45s pelo modal de 2FA.
    ...    SE aparecer → insere código com até 3 tentativas de retry.
    ...    SE não aparecer → login foi direto, sem 2FA.

    ${modal}=    Run Keyword And Return Status
    ...    Wait Until Element Is Visible    ${XPATH_TITULO_2FA}    timeout=45s

    IF    ${modal}
        Log To Console    \n[2FA] Modal detectado. Buscando código no Gmail...
        ${codigo_invalido}=    Set Variable    ${EMPTY}

        FOR    ${tentativa}    IN RANGE    1    4
            Log To Console    \n[2FA] Tentativa ${tentativa}/3...

            ${codigo}=    Obter Codigo Verificacao Do Gmail
            ...    ${GMAIL_USER}
            ...    ${GMAIL_APP_PASS}
            ...    ${REMETENTE_APP}
            ...    ignorar_codigo=${codigo_invalido}
            ...    id_anterior=${ULTIMO_EMAIL_ID}

            Log To Console    \n[2FA] Código capturado: ${codigo}

            Inserir Codigo No Aplicativo    ${codigo}

            Wait Until Element Is Visible    ${XPATH_BTN_CONFIRMAR}    timeout=45s
            Click Element                    ${XPATH_BTN_CONFIRMAR}

            Sleep    3s

            ${invalido}=    Run Keyword And Return Status
            ...    Element Should Be Visible    ${XPATH_CODIGO_INVALIDO}

            IF    ${invalido}
                Log To Console    \n[2FA] Código ${codigo} rejeitado pelo app. Buscando novo e-mail...
                ${codigo_invalido}=    Set Variable    ${codigo}
                Limpar Campos Do Codigo 2FA
            ELSE
                Log To Console    \n[2FA] Código ${codigo} aceito na tentativa ${tentativa}!
                BREAK
            END
        END
    ELSE
        Log To Console    \n[2FA] Modal não apareceu — login direto sem 2FA.
    END

# ─────────────────────────────────────────────────────────────────────────────
Inserir Codigo No Aplicativo
    [Arguments]    ${codigo}
    Wait Until Element Is Visible
    ...    android=new UiSelector().className("android.widget.EditText").instance(0)    timeout=45s

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

    Log To Console    \n[2FA] Código ${codigo} inserido nos 6 inputs.
    Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@content-desc="Continuar"]    timeout=45s
    Click Element    xpath=//android.view.ViewGroup[@content-desc="Continuar"]

# ─────────────────────────────────────────────────────────────────────────────
Limpar Campos Do Codigo 2FA
    FOR    ${i}    IN RANGE    0    6
        ${loc}=    Set Variable
        ...    android=new UiSelector().className("android.widget.EditText").instance(${i})
        ${ok}=    Run Keyword And Return Status    Element Should Be Visible    ${loc}
        IF    ${ok}    Clear Text    ${loc}
    END
    Log To Console    \n[2FA] Campos limpos para nova tentativa.

# ─────────────────────────────────────────────────────────────────────────────

Tratar Banner De Cookie Se Aparecer
    # 1. Verifica se o elemento aparece na tela em até 5 segundos
    # O Robot guarda True (se achou) ou False (se não achou) na variável
    ${cookie_visivel}=    Run Keyword And Return Status
    ...    Wait Until Element Is Visible    xpath=//android.app.Dialog[@resource-id="cookie-banner"]    timeout=30s

    # 2. Se a resposta for True, ele entra no bloco e clica para aceitar
    IF    ${cookie_visivel}
        Log To Console    \n[INFO] Banner de cookie detectado. Aceitando...
        Click Element    xpath=//android.widget.Button[@resource-id="adopt-accept-all-button"]
    ELSE
        Log To Console    \n[INFO] Banner de cookie não apareceu. Seguindo o fluxo...
    END

Tratar Banner De Login Se Aparecer
    # 1. Verifica se o elemento aparece na tela em até 5 segundos
    # O Robot guarda True (se achou) ou False (se não achou) na variável
    ${cookie_visivel}=    Run Keyword And Return Status
    ...    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Compre agora!"]    timeout=30s

    # 2. Se a resposta for True, ele entra no bloco e clica para aceitar
    IF    ${cookie_visivel}
        Log To Console    \n[INFO] Banner de Login detectado. Aceitando...
        Click Element    xpath=//android.widget.Button[@content-desc="Fechar"]
    ELSE
        Log To Console    \n[INFO] Banner de Login não apareceu. Seguindo o fluxo...
    END
Close session
    Close Application
