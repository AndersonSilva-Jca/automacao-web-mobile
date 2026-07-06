*** Settings ***
Library     AppiumLibrary
# Library    ../appCometa/resources/GeradorDataIda.py
# Library    ../appCometa/resources/GeradorDataVolta.py
Resource    ../app1001/resources/base.resource
Library     ../libraries/GmailHelper.py


*** Test Cases ***
Deve realizar o login com sucesso
    Start session
    Login
