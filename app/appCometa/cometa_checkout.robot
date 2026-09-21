*** Settings ***
Library     AppiumLibrary
Library    ../appCometa/resources/GeradorDataIda.py
Library    ../appCometa/resources/GeradorDataVolta.py
Resource    ../appCometa/resources/base.resource
Library     ../libraries/GmailHelper.py
# Test Teardown    Run Keywords
# ...    Run Keyword If Test Failed    Capturar Evidencia De Falha
# ...    AND    Close All Applications

# robot -d app/logs/testes app/appCometa/Cometa_checkout.robot

*** Test Cases ***
Deve realizar o fluxo até o checkout de pagamento
    Start session
    # Login
    Checkout
   