*** Settings ***
Library             AppiumLibrary
Library             ../appWemobi/resources/GeradorDataIda.py
Library             ../appWemobi/resources/GeradorDataVolta.py
Resource            ../appWemobi/resources/wemobi_base.resource
Library             ../libraries/GmailHelper.py


*** Test Cases ***
Deve realizar o fluxo até o checkout de pagamento
    Start session
    Login
    # Wait Until Element Is Visible    xpath=//android.widget.EditText[@resource-id="user"]    timeout=240s
    # Log To Console    \nFazendo o Login...
    # Input Text    xpath=//android.widget.EditText[@resource-id="user"]    ${LOGIN}
    # Input Password    xpath=//android.widget.EditText[@resource-id="password"]    ${SENHA}
    # Wait Until Element Is Visible
    # ...    xpath=//android.view.ViewGroup[@content-desc="Entrar"]/android.view.View
    # ...    timeout=60s
    # Click Element    xpath=//android.view.ViewGroup[@content-desc="Entrar"]/android.view.View

    # Wait Until Element Is Visible
    # ...    xpath=//android.view.ViewGroup[@content-desc="Buscar"]/android.view.View    timeout=90s
    # Log To Console    \nTela de Busca exibida com sucesso!
    Wait Until Element Is Visible    xpath=//android.widget.EditText[@resource-id="origin"]    timeout=60s
    Click Element    xpath=//android.widget.EditText[@resource-id="origin"]
    log To Console    \nClicando no campo de origem...
    Wait Until Element Is Visible    xpath=//android.widget.EditText[@resource-id="locationSearch"]   timeout=60s
    Click Element    xpath=//android.widget.EditText[@resource-id="locationSearch"]
    Log To Console    \nClicando em origem...
    Input Text    android=new UiSelector().className("android.widget.EditText")    Sao Paulo - Todos (SP)
    Log To Console    \nDigitando origem...
    Click Element    xpath=//android.widget.TextView[@text="São Paulo - Todos (SP)"]

    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Destino"]    timeout=45s
 
    Input Text    android=new UiSelector().className("android.widget.EditText")    Rio de Janeiro - Todos (RJ)
    Log To Console    \nDigitando destino...

    Click Element    xpath=//android.widget.TextView[@text="Rio de Janeiro - Todos (RJ)"]

    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Data"]    timeout=60s


    ${data_ida}=    obter_dia_aleatorio_ida
    Log To Console    \nData gerada: ${data_ida}
# retorna: 02/06/2026

    Input Text
    ...    xpath=//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.EditText[1]
    ...    ${data_ida}
    log To Console    \nData de ida selecionada com sucesso!

    Wait Until Element Is Visible
    ...    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    ...    timeout=60s

    Click Element    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View

    Wait Until Element Is Visible
    ...    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    ...    timeout=60s

    Click Element    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View

    Wait Until Element Is Visible
    ...    xpath=//android.view.ViewGroup[@content-desc="Buscar"]/android.view.View
    ...    timeout=60s
    Click Element    xpath=//android.view.ViewGroup[@content-desc="Buscar"]/android.view.View
    log To Console    \nClicando em Buscar...

    Log To Console    \nBusca realizada com sucesso!

    Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@resource-id="routeServiceCardContainer"]    timeout=90s

    Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@resource-id="purchaseContainer"]   timeout=60s

    Swipe    start_x=562    start_y=1714    end_x=570    end_y=1005    duration=1s

    Wait Until Element Is Visible
    ...    xpath=//android.view.ViewGroup[@content-desc="Comprar"]/android.view.View
    ...    timeout=60s

    Click Element    xpath=//android.view.ViewGroup[@content-desc="Comprar"]/android.view.View
    Log To Console    \nClicando em Comprar...

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

  Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Anderson Silva dos Santos"]    timeout=60s

  Click Element    xpath=//android.widget.TextView[@text="Selecione o assento"]

  Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Assento aleatório"]    timeout=60s

  Click Element    xpath=//android.widget.TextView[@text="Assento aleatório"]

   Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Próximo passo"]    timeout=60s
  Click Element    xpath=//android.widget.TextView[@text="Próximo passo"]
  Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Você possui cupom de desconto?"]    timeout=60s

    Swipe    start_x=486    start_y=1635    end_x=488    end_y=664

    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="PIX"]    timeout=60s

    Log To Console    \nBusca de passagens realizada com sucesso!
  Close session


