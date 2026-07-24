*** Settings ***
Library     AppiumLibrary
Library    ../appCometa/resources/GeradorDataIda.py
Library    ../appCometa/resources/GeradorDataVolta.py
Resource    ../appCometa/resources/base.resource
Library     ../libraries/GmailHelper.py
Test Teardown    Run Keywords
...    Run Keyword If Test Failed    Capturar Evidencia De Falha
...    AND    Close All Applications

*** Test Cases ***
Deve realizar o fluxo até o checkout de pagamento
    Start session
    Login
    
    Checkout
    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Buscar"]    timeout=60s
    # Log To Console    \n Elemento "Buscar" visível
    # Click Element    xpath=//android.widget.EditText[@resource-id="origin"]
    # Wait Until Element Is Visible    android=new UiSelector().resourceId("locationSearch")    timeout=60s
    # Input Text    android=new UiSelector().resourceId("locationSearch")    Sao Paulo (Rod. Tietê)
    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="São Paulo (Rod. Tietê) (SP)"]    timeout=60s
    # Click Element    xpath=//android.widget.TextView[@text="São Paulo (Rod. Tietê) (SP)"]
    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Destino"]    timeout=60s
    # Input Text    android=new UiSelector().resourceId("locationSearch")    Rio de Janeiro (Novo Rio) (RJ)
    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Rio de Janeiro (Novo Rio) (RJ)"]    timeout=60s
    # Click Element    xpath=//android.widget.TextView[@text="Rio de Janeiro (Novo Rio) (RJ)"]

    #  ${data_ida}=    obter_dia_aleatorio_ida
    # Log To Console    \nData gerada: ${data_ida}

    # Click Element   android=new UiSelector().className("android.widget.EditText").instance(0)
    # Input Text
    # ...    android=new UiSelector().className("android.widget.EditText").instance(0)
    # ...    ${data_ida}
    # log To Console    \nData de ida selecionada com sucesso!

    # Wait Until Element Is Visible
    # ...    xpath=//android.widget.TextView[@text="Data"]
    # ...    timeout=60s

    # Click Element    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    # Click Element    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    # Log To Console    message=Data confirmada
 
    # # Wait Until Element Is Visible
    # # ...    xpath=//android.widget.TextView[@text="Passageiro"]
    # # ...    timeout=60s
    #  Log To Console    message=confirmando passageiros
    # Click Element    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    # Log To Console    message=passageiros confirmado


    # Aguardar Elemento Com Retry    xpath=//android.widget.TextView[@text="Buscar"]

    # Log To Console    message=Buscar Passagens confirmado
    # Click Element    xpath=//android.widget.TextView[@text="Buscar"]
    # # Click Element    xpath=//android.widget.TextView[@text="Buscar"]

    # Wait Until Element Is Visible    android=new UiSelector().className("android.view.ViewGroup").instance(47)    timeout=60s

    # Swipe    start_x=503    start_y=2040    end_x=522    end_y=28    duration=1s

    # Click Element    xpath=//android.view.View

    # Tratar Banner De Horario Se Aparecer

    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Adicione um passageiro salvo"]    timeout=30s

    # Click Element    xpath=//android.widget.TextView[@text="Adicione um passageiro salvo"]

    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Quem é o passageiro?"]    timeout=30s

    # Click Element    xpath=//android.view.ViewGroup[@content-desc="A, Anderson Silva dos Santos, (Eu), Use seus dados de cadastro"]

    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Avançar"]    timeout=30s

    # Click Element    xpath=//android.widget.TextView[@text="Avançar"]

    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Passageiro 1"]    timeout=30s

    # Click Element    xpath=//android.view.ViewGroup[@content-desc="Passageiro 1, Anderson Silva dos Santos, Selecione o assento"]

    # Aguardar Elemento Com Retry    xpath=//android.widget.TextView[@text="Mapa de assentos"]    timeout=60s

    # Selecionar Assento Livre Aleatoriamente

    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Continuar "]    timeout=30s

    # Click Element    xpath=//android.widget.TextView[@text="Continuar "]

    # Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@content-desc="Aplicar"]/android.view.View   timeout=40s

    # Log To Console    message=Teste finalizado com sucesso

    # Close session

    # Start session
    # Login
    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Buscar"]    timeout=60s
    # Log To Console    \n Elemento "Buscar" visível
    # Click Element    xpath=//android.widget.EditText[@resource-id="origin"]
    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Origem"]    timeout=60s
    # Input Text    android=new UiSelector().resourceId("locationSearch")    Sao Paulo (Rod. Tietê)
    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="São Paulo (Rod. Tietê) (SP)"]    timeout=60s
    # Click Element    xpath=//android.widget.TextView[@text="São Paulo (Rod. Tietê) (SP)"]
    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Destino"]    timeout=60s
    # Input Text    android=new UiSelector().resourceId("locationSearch")    Rio de Janeiro (Novo Rio) (RJ)
    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Rio de Janeiro (Novo Rio) (RJ)"]    timeout=60s
    # Click Element    xpath=//android.widget.TextView[@text="Rio de Janeiro (Novo Rio) (RJ)"]

    #  ${data_ida}=    obter_dia_aleatorio_ida
    # Log To Console    \nData gerada: ${data_ida}

    # Click Element   android=new UiSelector().className("android.widget.EditText").instance(0)
    # Input Text
    # ...    android=new UiSelector().className("android.widget.EditText").instance(0)
    # ...    ${data_ida}
    # log To Console    \nData de ida selecionada com sucesso!

    # Wait Until Element Is Visible
    # ...    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    # ...    timeout=60s

    # Click Element    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View

    # Log To Console    message=Confirmando a busca de passagens com as datas
 
    # Wait Until Element Is Visible
    # ...    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    # ...    timeout=60s

    # Click Element    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View

    # Log To Console    message=Confirmando passageiros


    # Aguardar Elemento Com Retry    xpath=//android.widget.TextView[@text="Buscar"]

    # Click Element    xpath=//android.widget.TextView[@text="Buscar"]
    # Log To Console    message=Buscar Passagens confirmado

    # Wait Until Element Is Visible    xpath=/android=new UiSelector().className("android.view.ViewGroup").instance(47)    timeout=60s

    # Swipe    start_x=503    start_y=2040    end_x=522    end_y=28    duration=1s

    # Click Element    xpath=//android.view.View

    # Tratar Banner De Horario Se Aparecer

    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Adicione um passageiro salvo"]    timeout=30s

    # Click Element    xpath=//android.widget.TextView[@text="Adicione um passageiro salvo"]

    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Quem é o passageiro?"]    timeout=30s

    # Click Element    xpath=//android.view.ViewGroup[@content-desc="A, Anderson Silva dos Santos, (Eu), Use seus dados de cadastro"]

    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Avançar"]    timeout=30s

    # Click Element    xpath=//android.widget.TextView[@text="Avançar"]

    # Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@content-desc="Passageiro 1, Anderson Silva dos Santos, Selecione o assento"]    timeout=60s

    # Click Element    xpath=//android.view.ViewGroup[@content-desc="Passageiro 1, Anderson Silva dos Santos, Selecione o assento"]

    # Aguardar Elemento Com Retry    xpath=//android.widget.TextView[@text="Mapa de assentos"]

    # Selecionar Assento Livre Aleatoriamente

    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Continuar "]    timeout=30s

    # Click Element    xpath=//android.widget.TextView[@text="Continuar "]

    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Digite o CUPOM"]    timeout=40s

    # Log To Console    message=Teste finalizado com sucesso
    # Close session