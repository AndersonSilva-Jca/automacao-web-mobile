*** Settings ***
Library     AppiumLibrary
Library     ../appWemobi/resources/GeradorDataIda.py
Library     ../appWemobi/resources/GeradorDataVolta.py
# Test Teardown    Close All Applications
Resource    ../appWemobi/resources/appWemobi_base.resource


*** Test Cases ***
Deve realizar a busca de passagens com sucesso
    Start session

    Login

    Click Element    xpath=//android.widget.EditText[@resource-id="origin"]

    Wait Until Element Is Visible    //android.view.ViewGroup[@resource-id="originDestinationContainer"]    timeout=60s

    Tap With Positions    1s    ${274, 418}

    Input Text    android=new UiSelector().className("android.widget.EditText")    São Paulo - Todos (SP)

    Wait Until Element Is Visible
    ...    xpath=//android.view.ViewGroup[@content-desc="São Paulo - Todos (SP), Localidade de Grupo"]
    ...    timeout=15s

    Click Element    xpath=//android.view.ViewGroup[@content-desc="São Paulo - Todos (SP), Localidade de Grupo"]

    Click Element    xpath=//android.view.ViewGroup[@content-desc="São Paulo - Todos (SP), Localidade de Grupo"]

    Tap With Positions    1s    ${274, 418}

    Sleep    3s

    Input Text    android=new UiSelector().className("android.widget.EditText")    Rio de Janeiro - Todos (RJ)

    Wait Until Element Is Visible
    ...    xpath=//android.view.ViewGroup[@content-desc="Rio de Janeiro - Todos (RJ), Localidade de Grupo"]
    ...    timeout=15s

    Click Element    xpath=//android.view.ViewGroup[@content-desc="Rio de Janeiro - Todos (RJ), Localidade de Grupo"]

    Click Element    xpath=//android.view.ViewGroup[@content-desc="Rio de Janeiro - Todos (RJ), Localidade de Grupo"]

    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Data"]    timeout=15s

    Sleep    5s

    ${data_ida}=    obter_dia_aleatorio_ida
    Log To Console    \nData gerada: ${data_ida}
# retorna: 02/06/2026

    Input Text
    ...    xpath=//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.widget.EditText[1]
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

    Wait Until Element Is Visible
    ...    xpath=//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[6]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[24]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[13]
    ...    timeout=60s
    Log To Console    \nBusca realizada com sucesso!
