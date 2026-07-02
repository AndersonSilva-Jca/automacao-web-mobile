*** Settings ***
Library             AppiumLibrary
Library             ../appWemobi/resources/GeradorDataIda.py
Library             ../appWemobi/resources/GeradorDataVolta.py
Resource            ../appWemobi/resources/wemobi_base.resource
Library             ../libraries/GmailHelper.py
# Alterado para uma keyword personalizada que fecha a app e guarda o vídeo com segurança
Test Teardown       Encerrar Sessao E Gravar Video

*** Test Cases ***
Deve realizar o login com sucesso
    # [Setup]       Iniciar Gravacao Do Video
    Start session
    Login
        Click Element
    ...    android=new UiSelector().className("android.widget.ImageView").instance(1)
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@resource-id="name"]
    Log To Console    \nLogin realizado com sucesso!
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@resource-id="name"]
    Log To Console    \nOlá, Anderson Silva
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Sair"]    timeout=30s
    Log To Console    \nClicando em Sair...
    Click Element    xpath=//android.widget.TextView[@text="Sair"]
    Close session
