*** Settings ***
Library     AppiumLibrary
Library    ../app1001/resources/GeradorDataIda.py
Library    ../app1001/resources/GeradorDataVolta.py
Resource    ../app1001/resources/base.resource
Library     ../libraries/GmailHelper.py
# Test Teardown    Run Keywords
# ...    Run Keyword If Test Failed   
#  Capturar Evidencia De Falha
# ...    AND    Close All Applications
# robot -d app/logs/testes app/app1001/1001_checkout.robot

*** Test Cases ***
Deve realizar o fluxo até o checkout de pagamento
    Start session
    Login
    
    log To Console    \nTela de login exibida com sucesso!
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Buscar"]    timeout=60s
    Log To Console    \n Elemento "Buscar" visível
    Click Element    xpath=//android.widget.EditText[@resource-id="origin"]
    Wait Until Element Is Visible    android=new UiSelector().resourceId("locationSearch")    timeout=60s
    Sleep    1s
    log To Console    \nTela de busca exibida com sucesso!
    Input Text    locator=xpath=//android.widget.EditText[@resource-id="locationSearch"]    text=Rio de Janeiro (Todos) (RJ)
    Wait Until Element Is Visible    locator=xpath=//android.widget.TextView[@text="Rio de Janeiro (Todos) (RJ)"]    timeout=60s
    Sleep    500ms
    # Click Element    accessibility_id=Rio de Janeiro (Todos) (RJ), Terminal Rodoviário
    # Click Element    accessibility_id=Rio de Janeiro (Todos) (RJ), Terminal Rodoviário
    Click Element    locator=xpath=//android.widget.TextView[@text="Rio de Janeiro (Todos) (RJ)"]
    Click Element    locator=xpath=//android.widget.TextView[@text="Rio de Janeiro (Todos) (RJ)"]
    # Click Element    xpath=//android.widget.TextView[@text="São Paulo (Todos) (SP)"]
    log To Console    \nOrigem selecionado com sucesso!
    Sleep    1s
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Destino"]    timeout=60s
    Input Text    locator=xpath=//android.widget.EditText[@resource-id="locationSearch"]    text=Sao Paulo (Todos)
    Wait Until Element Is Visible    locator=xpath=//android.widget.TextView[@text="São Paulo (Todos) (SP)"]    timeout=60s
    Click Element    locator=xpath=//android.widget.TextView[@text="São Paulo (Todos) (SP)"]
    Click Element    locator=xpath=//android.widget.TextView[@text="São Paulo (Todos) (SP)"]
    # Click Element    xpath=//android.widget.TextView[@text="São Paulo (Rod. Todos) (SP)"]
    # Click Element    xpath=//android.widget.TextView[@text="São Paulo (Rod. Todos) (SP)"]
    log To Console    \nDestino selecionado com sucesso!
    Sleep    1s
    Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@resource-id="calendarComponentContainer"]    timeout=30


     ${data_ida}=    obter_dia_aleatorio_ida
    Log To Console    \nData gerada: ${data_ida}
    Click Element   android=new UiSelector().className("android.widget.EditText").instance(0)
    Input Text
    ...    android=new UiSelector().className("android.widget.EditText").instance(0)
    ...    ${data_ida}
    log To Console    \nData de ida selecionada com sucesso!
    Sleep    1s
    Wait Until Element Is Visible
    ...    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    ...    timeout=60s
    Click Element    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    Log To Console    \nData confirmada com sucesso
    Sleep    1s
    Wait Until Element Is Visible
    ...    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    ...    timeout=60s
    Aguardar Elemento Com Retry    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    Click Element    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    Log To Console    \nPassageiros confirmados com sucesso
    Sleep    1s
    # Aguardar Elemento Com Retry    xpath=//android.widget.TextView[@text="Buscar"]
    Click Element    xpath=//android.widget.TextView[@text="Buscar"]
    # Click Element    xpath=//android.widget.TextView[@text="Buscar"]
    Sleep    1s
    Wait Until Element Is Visible    android=new UiSelector().className("android.view.ViewGroup").instance(47)    timeout=90s
    Log To Console    \n Tela de Passagens Exibida com sucesso!

    Swipe    start_x=524    start_y=2141    end_x=554    end_y=1006    duration=1s
    Swipe    start_x=535    start_y=2097    end_x=556    end_y=960    duration=1s
    # Swipe    start_x=565    start_y=2113    end_x=556    end_y=1450    duration=1s
    # Swipe    start_x=489    start_y=1791    end_x=500    end_y=919    duration=1s




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

    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Digite o CUPOM"]    timeout=40s

    Log To Console    \nTeste finalizado com sucesso

    Close session
