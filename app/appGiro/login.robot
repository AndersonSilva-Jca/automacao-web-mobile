*** Settings ***
Library             AppiumLibrary
Library             ../appGiro/resources/GeradorDataIda.py
Library             ../appGiro/resources/GeradorDataVolta.py
Resource            ../appGiro/resources/base.resource
Library             ../libraries/GmailHelper.py

Test Teardown       Close All Applications


*** Test Cases ***
Deve realizar o login com sucesso
    Start session
    Login
