*** Settings ***
Library     AppiumLibrary
Library     OperatingSystem
Library             ../resources/GeradorDataIda.py
Library             ../resources/GeradorDataVolta.py


*** Variables ***
${ENTRAR}               id=user
${LOGIN2}               ${EMPTY}
${SENHA2}               ${EMPTY}
${MAIL_USERNAME}        ${EMPTY}
${GMAIL_APP_PASS}       ${EMPTY}


*** Keywords ***
Carregar Variaveis De Ambiente
    [Documentation]    Carrega o arquivo .env e cria as variáveis globais para o teste.
    Evaluate    __import__('dotenv').load_dotenv(dotenv_path='app/.env')

    ${env_login2}=    Get Environment Variable    LOGIN2
    ${env_senha2}=    Get Environment Variable    SENHA2
    ${env_mail_username}=    Get Environment Variable    MAIL_USERNAME

    Set Global Variable    ${LOGIN2}    ${env_login2}
    Set Global Variable    ${SENHA2}    ${env_senha2}
    Set Global Variable    ${MAIL_USERNAME}    ${env_mail_username}

Start session
    Carregar Variaveis De Ambiente
    Open Application    http://127.0.0.1:4723
    ...    platformName=Android
    ...    appium:deviceName=emulator-5554
    ...    appium:automationName=UiAutomator2
    ...    appium:appPackage=me.wemobi.wemobiapp
    ...    appium:appActivity=.MainActivity
    ...    appWaitDuration=50000
    # ...    appium:noReset=${True}
    ...    appium:disableWindowNotification=${True}
    ...    appium:autoGrantPermissions=${True}
    ...    appium:ensureWebviewsHavePages=${True}
    ...    appium:clearDeviceLogs=${True}
    ...    appium:nativeWebScreenshot=${True}
    ...    appium:uiautomator2ServerServerInstallTimeout=${60000}
    ...    appium:uiautomator2ServerLaunchTimeout=${90000}
    ...    appium:uiautomator2ServerInstallTimeout=${60000}
    ...    appium:adbExecTimeout=${60000}
    ...    appium:newCommandTimeout=${300}
    ...    appium:connectHardwareKeyboard=${True}
    ...    appium:socketConnectionTimeout=${90000}

Login
    
    Wait Until Element Is Visible    xpath=//android.widget.EditText[@resource-id="user"]    timeout=240s
    Log To Console    \nFazendo o Login...
    Input Text    xpath=//android.widget.EditText[@resource-id="user"]    ${LOGIN2}
    Input Password    xpath=//android.widget.EditText[@resource-id="password"]    ${SENHA2}
    Wait Until Element Is Visible
    ...    xpath=//android.view.ViewGroup[@content-desc="Entrar"]/android.view.View
    ...    timeout=60s
    Click Element    xpath=//android.view.ViewGroup[@content-desc="Entrar"]/android.view.View
    Wait Until Element Is Visible
    ...    xpath=//android.view.ViewGroup[@content-desc="Buscar"]/android.view.View    timeout=90s
    Log To Console    \nTela de Busca exibida com sucesso!

    
    # Click Element
    # ...    android=new UiSelector().className("android.widget.ImageView").instance(1)
    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@resource-id="name"]
    # Log To Console    \nLogin realizado com sucesso!
    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@resource-id="name"]
    # Log To Console    \nOlá, Anderson Silva
    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Sair"]    timeout=30s
    # Log To Console    \nClicando em Sair...
    # Click Element    xpath=//android.widget.TextView[@text="Sair"]
    # Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@content-desc="Viagens"]    timeout=60s

Selecionar origem e destino
    Wait Until Element Is Visible    locator=android=new UiSelector().resourceId("origin")    timeout=30s
    Click Element   locator=android=new UiSelector().resourceId("origin")    
    Wait Until Element Is Visible    locator=xpath=//android.widget.EditText[@resource-id="locationSearch"]    timeout=30s
    Input Text    locator=xpath=//android.widget.EditText[@resource-id="locationSearch"]    text=Sao Paulo
    Wait Until Element Is Visible    locator=android=new UiSelector().description("São Paulo - Todos (SP), Localidade de Grupo")    timeout=30s
    Click Element    locator=android=new UiSelector().description("São Paulo - Todos (SP), Localidade de Grupo")

    Wait Until Element Is Visible    locator=android=new UiSelector().text("Destino")    timeout=30s
    Input Text    locator=xpath=//android.widget.EditText[@resource-id="locationSearch"]    text=Rio de Janeiro
    Click Element    locator=android=new UiSelector().description("Rio de Janeiro - Todos (RJ), Localidade de Grupo")
    
    # Wait Until Element Is Visible    locator=new UiSelector().className("android.widget.EditText").instance(0)
    # Click Element    locator=android=new UiSelector().className("android.widget.EditText").instance(0)

Selecionar Ida e passageiro
    Wait Until Element Is Visible    locator=xpath=//android.widget.TextView[@text="Data"]    timeout=30s
        ${data_ida}=    obter_dia_aleatorio_ida
    Log To Console    \nData gerada: ${data_ida}

    Input Text    android=new UiSelector().className("android.widget.EditText").instance(0)    ${data_ida}
    log To Console    \nData de ida selecionada com sucesso!

    Wait Until Element Is Visible
    ...    locator=xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    ...    timeout=60s

    Click Element    locator=xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View

    Wait Until Element Is Visible
    ...    locator=xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    ...    timeout=60s

    Click Element    locator=xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View

    Wait Until Element Is Visible
    ...    locator=xpath=//android.view.ViewGroup[@content-desc="Buscar"]/android.view.View
    ...    timeout=60s
    Click Element    locator=xpath=//android.view.ViewGroup[@content-desc="Buscar"]/android.view.View
    log To Console    \nClicando em Buscar... 1

Selecionar passagens

    #  Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@resource-id="routeServiceCardContainer"]    timeout=90s

    # Wait Until Element Is Visible    locator=xpath=//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[6]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[24]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]   timeout=60s
    log To Console    \nClicando em Buscar... 2

    # Swipe    start_x=562    start_y=1714    end_x=570    end_y=1005    duration=1s

    Wait Until Element Is Visible    locator=xpath=//android.view.ViewGroup[@content-desc="Comprar"]/android.view.View    timeout=30s
    log To Console    \nClicando em Buscar... 3

    Click Element    locator=xpath=//android.view.ViewGroup[@content-desc="Comprar"]/android.view.View
    Log To Console    \nClicando em Comprar...
    Tratar Banner De Madrugada Se Aparecer

    Wait Until Element Is Visible
    ...    xpath=//android.widget.TextView[@text="Passageiro 1"]
    ...    timeout=60s

    Click Element    xpath=//android.widget.TextView[@text="Passageiro 1"]

    Click Element    xpath=//android.view.ViewGroup[@content-desc="+, Adicione um passageiro salvo"]

    Wait Until Element Is Visible   xpath=//android.widget.TextView[@text="Quem é o passageiro?"]    timeout=60s

    Click Element    xpath=//android.widget.TextView[@text="Anderson Silva dos Santos"]

    Swipe    start_x=525    start_y=1395    end_x=522    end_y=802

    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Avançar"]    timeout=60s

    Click Element    xpath=//android.widget.TextView[@text="Avançar"]

Selecionar Assento e finalizar

    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Selecione o assento"]    timeout=60s

    Click Element    xpath=//android.widget.TextView[@text="Selecione o assento"]

    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Assento aleatório"]    timeout=60s
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Assento aleatório"]    timeout=60s

    Click Element    xpath=//android.widget.TextView[@text="Assento aleatório"]

    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Próximo passo"]    timeout=60s
    # Click Element    xpath=//android.widget.TextView[@text="Próximo passo"]
    Click Element    xpath=//android.widget.TextView[@text="Próximo passo"]
    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Você possui cupom de desconto?"]    timeout=60s

    #   Swipe    start_x=486    start_y=1635    end_x=488    end_y=664

    #   Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="PIX"]    timeout=60s

      Log To Console    \nBusca de passagens realizada com sucesso!

  
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

Tratar Banner De Madrugada Se Aparecer
    # 1. Verifica se o elemento aparece na tela em até 5 segundos
    # O Robot guarda True (se achou) ou False (se não achou) na variável
    ${madrugada_visivel}=    Run Keyword And Return Status
    ...    Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@resource-id="modal"]/android.view.ViewGroup/android.view.ViewGroup[3]    timeout=15s

    # 2. Se a resposta for True, ele entra no bloco e clica para aceitar
    IF    ${madrugada_visivel}
        Log To Console    \n[INFO] Banner de madrugada detectado. Aceitando...
        Click Element    xpath=//android.widget.TextView[@text="Ok, entendi!"]
    ELSE
        Log To Console    \n[INFO] Banner de madrugada não apareceu. Seguindo o fluxo...
    END

Fechar modal do login
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Garanta AGORA até 55% OFF"]    timeout=120s

    Tap With Positions    1000ms    ${952, 186}

# Iniciar Gravacao Do Video
#     [Documentation]    Inicia a gravação da tela usando AppiumLibrary de forma segura
#     # O "Run Keyword And Ignore Error" garante que se o emulador não suportar a gravação, o teste CONTINUA rodando
#     Run Keyword And Ignore Error    Start Recording Screen

# Finalizar E Salvar Video
#     [Documentation]    Para a gravação e gera o arquivo video-execucao.mp4
#     Run Keyword And Ignore Error    Stop Recording Screen    filename=video-execucao

# Encerrar Sessao E Gravar Video
#     [Documentation]    Garante capturas de evidência e fecha o app
#     # Captura o print screen se o teste falhar (Isso gera a imagem no Allure!)
#     Run Keyword If Test Failed    Capture Page Screenshot
#     Finalizar E Salvar Video
#     Close session


# Start Recording Screen
#     [Arguments]    ${arg1}=${EMPTY}
#     # Start recording screen via AppiumLibrary if available; allow being called without args
#     Run Keyword And Ignore Error    Start Screen Recording


# Stop Recording Screen
#     [Arguments]    ${arg1}=${EMPTY}    ${filename}=${EMPTY}
#     # Stop recording screen and save file if supported
#     ${res}=    Run Keyword And Ignore Error    Stop Screen Recording
#     Run Keyword If    '${res[0]}' == 'PASS' and '${filename}' != ''    ${NONE}=    Set Variable    ${res}
#     ...    ELSE    Log To Console    \n[INFO] Stop Screen Recording not supported or failed: ${res}

Capturar Evidencia De Falha
    [Documentation]    Garante print mesmo se o app crashar ou a sessão cair
    ${status}    ${screenshot}=    Run Keyword And Ignore Error
    ...    Capture Page Screenshot    ${OUTPUT_DIR}${/}screenshots${/}falha-${TEST_NAME}-{index}.png
    Log To Console    \n[EVIDÊNCIA] ${screenshot}

Aguardar Elemento Com Retry
    [Arguments]    ${locator}    ${timeout}=30s    ${tentativas}=3
    [Documentation]    Reexecuta o wait em vez de confiar em cache de elemento
    FOR    ${i}    IN RANGE    ${tentativas}
        ${ok}=    Run Keyword And Return Status
        ...    Wait Until Element Is Visible    ${locator}    timeout=${timeout}
        IF    ${ok}    RETURN
        Log To Console    \n[RETRY] Tentativa ${i+1} falhou para ${locator}
        Sleep    1s
    END
    Wait Until Element Is Visible    ${locator}    timeout=${timeout}


