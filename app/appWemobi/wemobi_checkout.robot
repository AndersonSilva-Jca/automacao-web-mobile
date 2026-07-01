*** Settings ***
Library             AppiumLibrary
Library             ../appWemobi/resources/GeradorDataIda.py
Library             ../appWemobi/resources/GeradorDataVolta.py
Resource            ../appWemobi/resources/wemobi_base.resource
Library             ../libraries/GmailHelper.py


*** Test Cases ***
Deve realizar a busca de passagens com sucesso
    Start session
    Login

    Click Element    xpath=//android.widget.EditText[@resource-id="origin"]

    Wait Until Element Is Visible    xpath=//android.widget.EditText[@resource-id="locationSearch"]    timeout=60s
    Click Element    xpath=//android.widget.EditText[@resource-id="locationSearch"]

    Tap With Positions    1s    ${274, 418}

    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Origem"]    timeout=45s

    Input Text    android=new UiSelector().className("android.widget.EditText")    São Paulo - Todos (SP)

    Wait Until Element Is Visible
    ...    xpath=//android.widget.TextView[@text="São Paulo - Todos (SP)"]
    ...    timeout=30s

    Click Element    xpath=//android.widget.TextView[@text="São Paulo - Todos (SP)"]

    Click Element    xpath=//android.widget.TextView[@text="São Paulo - Todos (SP)"]

    Tap With Positions    1s    ${274, 418}

    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Destino"]    timeout=45s
 

    Input Text    android=new UiSelector().className("android.widget.EditText")    Rio de Janeiro - Todos (RJ)

    Wait Until Element Is Visible
    ...    accessibility_id=Rio de Janeiro - Todos (RJ), Localidade de Grupo
    ...    timeout=15s

    Click Element    accessibility_id=Rio de Janeiro - Todos (RJ), Localidade de Grupo

    # Click Element    accessibility_id=Rio de Janeiro - Todos (RJ), Localidade de Grupo

    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Data"]    timeout=30s

    Sleep    5s

    ${data_ida}=    obter_dia_aleatorio_ida
    Log To Console    \nData gerada: ${data_ida}
# retorna: 02/06/2026

    Input Text
    ...    xpath=//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.EditText[1]
    ...    ${data_ida}

    Wait Until Element Is Visible
    ...    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    ...    timeout=15s

    Click Element    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View

    Wait Until Element Is Visible
    ...    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View
    ...    timeout=30s

    Click Element    xpath=//android.view.ViewGroup[@content-desc="Confirmar"]/android.view.View

    Wait Until Element Is Visible
    ...    xpath=//android.view.ViewGroup[@content-desc="Buscar"]/android.view.View
    ...    timeout=30s
    Click Element    xpath=//android.view.ViewGroup[@content-desc="Buscar"]/android.view.View

    Log To Console    \nBusca realizada com sucesso!

    Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@resource-id="routeServiceCardContainer"]    timeout=60s

    Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@resource-id="purchaseContainer"]   timeout=60s

    Swipe    start_x=562    start_y=1714    end_x=570    end_y=1005    duration=1s

    Wait Until Element Is Visible
    ...    xpath=//android.view.ViewGroup[@content-desc="Comprar"]/android.view.View
    ...    timeout=30s

    Click Element    xpath=//android.view.ViewGroup[@content-desc="Comprar"]/android.view.View

   Wait Until Element Is Visible
    ...    xpath=//android.widget.TextView[@text="Passageiro 1"]
    ...    timeout=30s

    Click Element    xpath=//android.widget.TextView[@text="Passageiro 1"]

    # //android.widget.TextView[@text="Adicione um passageiro salvo"]
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


   Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Anderson Silva dos Santos"]    timeout=60s

  Click Element    xpath=//android.widget.TextView[@text="Próximo passo"]
  Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Você possui cupom de desconto?"]    timeout=60s

    Swipe    start_x=486    start_y=1635    end_x=488    end_y=664

    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="PIX"]    timeout=60s

    Log To Console    \nBusca de passagens realizada com sucesso!

    Close session

