*** Settings ***
Library     AppiumLibrary
# Library    ../appCometa/resources/GeradorDataIda.py
# Library    ../appCometa/resources/GeradorDataVolta.py
Resource    ../appCatarinense/resources/base.resource
Library     ../libraries/GmailHelper.py


*** Test Cases ***
Deve realizar o login com sucesso
    Start session
    Login
