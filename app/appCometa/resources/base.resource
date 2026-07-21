*** Settings ***
Library     AppiumLibrary
Library     OperatingSystem
Library    Collections
Library    ../appCometa/resources/GeradorDataIda.py
Library    ../appCometa/resources/GeradorDataVolta.py
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
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Acesse sua conta"]    timeout=60s
    Log To Console    \n Assert Acesse sua conta
    Click Element    xpath=//android.widget.EditText[@resource-id="user"]
    Input Text    xpath=//android.widget.EditText[@resource-id="user"]    ${LOGIN}
    Input Password    xpath=//android.widget.EditText[@resource-id="password"]    ${SENHA}
    Click Element    xpath=//android.view.ViewGroup[@content-desc="Entrar"]/android.view.View
    Log To Console    \n Usuário logado com sucesso.
    ${cookie_visivel}=    Run Keyword And Return Status
    ...    Wait Until Element Is Visible
    ...    xpath=//android.app.AlertDialog[@resource-id="cookie-banner"]
    ...    timeout=30s
    IF    ${cookie_visivel}
        Log To Console    \n[INFO] Banner de cookie detectado. Aceitando...
        Click Element    xpath=//android.widget.Button[@resource-id="adopt-accept-all-button"]
    ELSE
        Log To Console    \n[INFO] Banner de cookie não apareceu. Seguindo o fluxo...
    END
Checkout
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Buscar"]    timeout=60s
    Log To Console    \n Elemento "Buscar" visível
    Click Element    xpath=//android.widget.EditText[@resource-id="origin"]
    Wait Until Element Is Visible    android=new UiSelector().resourceId("locationSearch")    timeout=60s
    Input Text    android=new UiSelector().resourceId("locationSearch")    Sao Paulo (Rod. Tietê)
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="São Paulo (Rod. Tietê) (SP)"]    timeout=60s
    Click Element    xpath=//android.widget.TextView[@text="São Paulo (Rod. Tietê) (SP)"]
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Destino"]    timeout=60s
    Input Text    android=new UiSelector().resourceId("locationSearch")    Rio de Janeiro (Novo Rio) (RJ)
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Rio de Janeiro (Novo Rio) (RJ)"]    timeout=60s
    Click Element    xpath=//android.widget.TextView[@text="Rio de Janeiro (Novo Rio) (RJ)"]

     ${data_ida}=    obter_dia_aleatorio_ida
    Log To Console    \nData gerada: ${data_ida}

    Click Element   android=new UiSelector().className("android.widget.EditText").instance(0)
    Input Text
    ...    android=new UiSelector().className("android.widget.EditText").instance(0)
    ...    ${data_ida}
    log To Console    \nData de ida selecionada com sucesso!

    Wait Until Element Is Visible
    ...    xpath=//android.widget.TextView[@text="Data"]
    ...    timeout=60s

    Click Element    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    Click Element    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    Log To Console    message=Data confirmada
 
    # Wait Until Element Is Visible
    # ...    xpath=//android.widget.TextView[@text="Passageiro"]
    # ...    timeout=60s
     Log To Console    message=confirmando passageiros
    Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    Click Element    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    Log To Console    message=passageiros confirmado


    Aguardar Elemento Com Retry    xpath=//android.widget.TextView[@text="Buscar"]

    Log To Console    message=Buscar Passagens confirmado
    Click Element    xpath=//android.widget.TextView[@text="Buscar"]
    # Click Element    xpath=//android.widget.TextView[@text="Buscar"]

    Wait Until Element Is Visible    android=new UiSelector().className("android.view.ViewGroup").instance(47)    timeout=60s

    Swipe    start_x=503    start_y=2040    end_x=522    end_y=28    duration=1s

    Click Element    xpath=//android.view.View

    Tratar Banner De Horario Se Aparecer

    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Adicione um passageiro salvo"]    timeout=30s

    Click Element    xpath=//android.widget.TextView[@text="Adicione um passageiro salvo"]

    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Quem é o passageiro?"]    timeout=30s

    Click Element    xpath=//android.view.ViewGroup[@content-desc="A, Anderson Silva dos Santos, (Eu), Use seus dados de cadastro"]

    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Avançar"]    timeout=30s

    Click Element    xpath=//android.widget.TextView[@text="Avançar"]

    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Passageiro 1"]    timeout=30s

    Click Element    xpath=//android.view.ViewGroup[@content-desc="Passageiro 1, Anderson Silva dos Santos, Selecione o assento"]

    Aguardar Elemento Com Retry    xpath=//android.widget.TextView[@text="Mapa de assentos"]    timeout=60s

    Selecionar Assento Livre Aleatoriamente

    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Continuar "]    timeout=30s

    Click Element    xpath=//android.widget.TextView[@text="Continuar "]

    Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@content-desc="Aplicar"]/android.view.View   timeout=40s

    Log To Console    message=Teste finalizado com sucesso

Fechar modal do login
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Garanta AGORA até 55% OFF"]    timeout=120s

    Tap With Positions    1000ms    ${952, 186}

Tratar Banner De Horario Se Aparecer
    # 1. Verifica se o elemento aparece na tela em até 5 segundos
    # O Robot guarda True (se achou) ou False (se não achou) na variável
    ${horario_visivel}=    Run Keyword And Return Status
    ...    Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@resource-id="modal"]/android.view.ViewGroup/android.view.ViewGroup[3]    timeout=30s

    # 2. Se a resposta for True, ele entra no bloco e clica para aceitar
    IF    ${horario_visivel}
        Log To Console    \n[INFO] Banner de horario de viagem detectado. Aceitando...
        Click Element    xpath=//android.widget.TextView[@text="Ok, entendi!"]
    ELSE
        Log To Console    \n[INFO] Banner de Horário de viagem não apareceu. Seguindo o fluxo...
    END

Selecionar Assento Livre Aleatoriamente
    # 1. XPath para capturar todos os TextViews que representam assentos livres (números de 2 dígitos)
    # Filtramos para pegar textos que não sejam "X", "Livre", "Ocupado", "Selecionado" ou o nome do passageiro
    ${locator_todos_livres}    Set Variable    xpath=//android.widget.TextView[@text!="X" and @text!="Livre" and @text!="Ocupado" and @text!="Selecionado" and string-length(@text) = 2]

    # Aguarda a tela carregar os assentos
    Wait Until Element Is Visible    ${locator_todos_livres}    timeout=15s

    # 2. Captura todos os elementos que combinam com o XPath acima
    ${elementos}    Get Webelements    ${locator_todos_livres}

    # Criamos uma lista vazia para guardar apenas os números dos assentos livres
    ${lista_assentos_livres}    Create List

    # Loop para ler o texto de cada elemento encontrado e adicionar na nossa lista
    FOR    ${elemento}    IN    @{elementos}
    ${texto}    Get Text    ${elemento}
    Append To List    ${lista_assentos_livres}    ${texto}
    END

    # Exibe no log todos os assentos que estavam disponíveis para o clique
    Log To Console    \nAssentos livres encontrados na tela: ${lista_assentos_livres}

    # 3. Sorteia um assento aleatório da lista usando Python (random.choice)
    ${assento_sorteado}    Evaluate    random.choice(${lista_assentos_livres})    modules=random

    # 4. Clica no assento que foi sorteado
    Click Element    xpath=//android.widget.TextView[@text="${assento_sorteado}"]
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Continuar "]    timeout=30s
    Log To Console    👉 Assento sorteado para o teste: ${assento_sorteado}
    
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
    Click Element    ${locator}

Close session
    Close Application