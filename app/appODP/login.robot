*** Settings ***
Library     AppiumLibrary
Resource    ../appODP/resources/base.resource


*** Test Cases ***
Deve realizar o login com sucesso
    Start session
    Login

    # Close Application
