*** Settings ***
Library     AppiumLibrary
Library    ../app1001/resources/GeradorDataIda.py
Library    ../app1001/resources/GeradorDataVolta.py
Resource    ../app1001/resources/base.resource
Library     ../libraries/GmailHelper.py


*** Test Cases ***
Deve realizar o login com sucesso
    Start session
    Login
     Wait Until Element Is Visible    android=new UiSelector().className("android.view.ViewGroup").instance(13)
    Click Element
    ...    android=new UiSelector().className("android.view.ViewGroup").instance(13)
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@resource-id="name"]
    Log To Console    \nLogin realizado com sucesso!
    Log To Console    \nOlá, Anderson Silva
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Sair"]    timeout=15s
    Click Element    xpath=//android.widget.TextView[@text="Sair"]
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Digite seu CPF ou E-mail"]    timeout=60s
    Log To Console    \nUsuário deslogado com sucesso!