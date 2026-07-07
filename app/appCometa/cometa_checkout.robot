*** Settings ***
Library     AppiumLibrary
Library    ../appCometa/resources/GeradorDataIda.py
Library    ../appCometa/resources/GeradorDataVolta.py
Resource    ../appCometa/resources/base.resource
Library     ../libraries/GmailHelper.py


*** Test Cases ***
Deve realizar a busca de passagens com sucesso
    Start session
    Login
    Sleep    3s
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Buscar"]    timeout=60s
    Log To Console    \n Elemento "Buscar" visível
    Click Element    xpath=//android.widget.EditText[@resource-id="origin"]
    Input Text    xpath=//android.widget.EditText[@resource-id="origin"]    Sao Paulo
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="São Paulo (Rod. Tietê) (SP)"]
    Click Element    xpath=//android.widget.TextView[@text="São Paulo (Rod. Tietê) (SP)"]
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Destino"]
    Input Text    xpath=//android.widget.TextView[@text="Digite para buscar"]    Rio de Janeiro (Novo Rio) (RJ)
    Wait Until Element Is Visible    xpath=//android.widget.TextView[@text="Rio de Janeiro (Novo Rio) (RJ)"]
    Click Element    xpath=//android.widget.TextView[@text="Rio de Janeiro (Novo Rio) (RJ)"]
 
