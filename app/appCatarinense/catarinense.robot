*** Settings ***
Library     AppiumLibrary
Library    ../appCatarinense/resources/GeradorDataIda.py
Library    ../appCatarinense/resources/GeradorDataVolta.py
Resource    ../appCatarinense/resources/base.resource
Library     ../libraries/GmailHelper.py
Documentation    Suite da Catarinense
Test Teardown    Run Keyword If Test Failed    Capture Page Screenshot    filename=catarinense_{index}.png

*** Test Cases ***
Catarinense - Deve realizar o login com sucesso
    Start session
    Login
      Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Buscar"]    timeout=60s
    Log To Console    \n Logado
    Click Element    android=new UiSelector().className("android.widget.ImageView").instance(0)
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@resource-id="name"]    timeout=60s
    Log To Console    \n Olá Usuário.
    Log To Console    \n Usuário logado com sucesso.
    Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@content-desc="Sair"]    timeout=15s
    Click Element    xpath=//android.view.ViewGroup[@content-desc="Sair"]
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Acesse sua conta"]    timeout=60s
    Log To Console    \n Usuário deslogado com sucesso.
