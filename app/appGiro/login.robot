*** Settings ***
Library     AppiumLibrary
Library     ../appGiro/resources/GeradorDataIda.py
Library     ../appGiro/resources/GeradorDataVolta.py
# Test Teardown    Close All Applications
Resource    ../appGiro/resources/base.resource
Library     ../libraries/GmailHelper.py


*** Test Cases ***
Deve realizar o login com sucesso
    Start session
    Login

    # Close Application
