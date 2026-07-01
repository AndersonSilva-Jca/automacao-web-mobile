*** Settings ***
Library     AppiumLibrary
Library     ../appGiro/resources/GeradorDataIda.py
Library     ../appGiro/resources/GeradorDataVolta.py
Resource    ../appGiro/resources/giro_base.resource
Library     ../libraries/GmailHelper.py
# Test Teardown    Close All Applications


*** Test Cases ***
Deve realizar a busca de passagens com sucesso
    Start session
    # Login
    Sleep    3s
    Log To Console    \nTela de Busca exibida com sucesso!
    Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@content-desc="Viagens"]    timeout=60s

    Click Element    xpath=//android.view.ViewGroup[@content-desc="Viagens"]

    Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@content-desc="Comprar Passagens"]    timeout=60s

    Click Element    xpath=//android.view.ViewGroup[@content-desc="Comprar Passagens"]
    Log To Console    \nComprar Passagens
    Wait Until Element Is Visible    xpath=//android.view.View[@resource-id="base-1ef336e756"]/android.view.View[1]/android.view.View[2]/android.view.View    timeout=90s
    Tratar Banner De Cookie Se Aparecer
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Encontre sua próxima viagem"]    timeout=120s
    Log To Console    \nEncontre sua próxima viagem com sucesso!
    Wait Until Element Is Visible    xpath=//android.widget.Button[@resource-id="search-button"]    timeout=120s

    Log To Console    \nBotão de buscar passagens visível...

    Click Element    xpath=//android.widget.EditText[@resource-id="input-departure"]
    # Click Element    xpath=//android.widget.EditText[@resource-id="input-departure"]
    Input Text
    ...    xpath=//android.widget.EditText[@resource-id="input-departure"]
    ...    São Paulo - Todos (SP)
    Sleep    3s
    Click Element    xpath=//android.view.View[@resource-id="São-Paulo---Todos-(SP)"]
    log To Console    \nCampo de origem preenchido...

    Sleep    2s

    Click Element    xpath=//android.widget.EditText[@resource-id="input-destination"]
    # Click Element    xpath=//android.widget.EditText[@resource-id="input-destination"]
    Input Text
    ...    xpath=//android.widget.EditText[@resource-id="input-destination"]
    ...    Rio de Janeiro - Todos (RJ)
    Sleep    3s
    Click Element    xpath=//android.view.View[@resource-id="Rio-De-Janeiro---Todos-(RJ)"]
    Log to Console    \nCampo de destino preenchido...



    Click Element    xpath=//android.widget.EditText[@resource-id="input-date"]
    Wait Until Element Is Visible    xpath=//android.view.View[@resource-id="ui-datepicker-div"]    timeout=60s

    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Data de ida"]    timeout=60s

    Log To Console    \nSeleção de data de ida...

    ${dia}    ${mes}    ${ano}=    obter_dia_aleatorio_ida

    Log To Console    \nData gerado pelo teste: ${dia}-${mes}-${ano}

    # Log apenas para você ver qual dia rodou no relatório do Robot
    Log To Console    \nData selecionado aleatório: ${dia}-${mes}-${ano}

    # # 4. Clica no dia dinâmico mantendo o índice [1] que seu app exige
    Click Element   new UiSelector().resourceId("calendar-${dia}-${mes}-${ano}")

    Sleep    2s

    Wait Until Element Is Visible   xpath=//android.widget.Button[@resource-id="search-button"]    timeout=60s
    Click Element   xpath=//android.widget.Button[@resource-id="search-button"]

    # Click Element    xpath=//android.widget.Button[@resource-id="btn-conf-datepicker"]

    # Wait Until Element Is Visible    xpath=//android.widget.Button[@resource-id="search-button"]    timeout=60s

    # Click Element    xpath=//android.widget.EditText[@resource-id="input-date-return"]

    # Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Data de volta"]    timeout=60s

    # ${dia}    ${mes}    ${ano}=    obter_dia_aleatorio_volta

    # Log To Console    \nData gerado pelo teste: ${dia}-${mes}-${ano}

    # # Log apenas para você ver qual dia rodou no relatório do Robot
    # Log To Console    \nData selecionado aleatório: ${dia}-${mes}-${ano}

    # # 4. Clica no dia dinâmico mantendo o índice [1] que seu app exige
    # Click Element    xpath=//android.view.View[@resource-id="calendar-${dia}-${mes}-${ano}"]

    # Wait Until Element Is Visible    xpath=//android.widget.Button[@resource-id="btn-conf-datepicker"]    timeout=60s

    # Click Element    xpath=//android.widget.Button[@resource-id="btn-conf-datepicker"]

    # Wait Until Element Is Visible    xpath=//android.widget.Button[@resource-id="search-button"]    timeout=60s

    # Click Element    xpath=//android.widget.Button[@resource-id="search-button"]

    # Wait Until Element Is Visible
    # ...    xpath=//android.widget.ListView[@resource-id="list-companies"]/android.view.View/android.view.View[2]/android.widget.ListView/android.view.View/android.view.View[2]
    # ...    timeout=120s

    # Log To Console    \nBusca de passagens realizada com sucesso!
    # Sleep    10s

    # Close session


