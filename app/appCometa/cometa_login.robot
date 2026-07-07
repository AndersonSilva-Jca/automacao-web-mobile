*** Settings ***
Library     AppiumLibrary
# Library    ../appCometa/resources/GeradorDataIda.py
# Library    ../appCometa/resources/GeradorDataVolta.py
Resource    ../appCometa/resources/base.resource
Library     ../libraries/GmailHelper.py


*** Test Cases ***
Deve realizar o login com sucesso
    Start session
    Login
    Sleep    3s
     Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Buscar"]    timeout=60s
    Click Element    android=new UiSelector().className("android.widget.ImageView").instance(0)
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@resource-id="name"]    timeout=60s
    Wait Until Element Is Visible    xpath=//android.view.ViewGroup[@content-desc="Sair"]    timeout=15s
    Click Element    xpath=//android.view.ViewGroup[@content-desc="Sair"]
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Acesse sua conta"]    timeout=60s
    Log To Console    \n Usuário deslogado com sucesso.
