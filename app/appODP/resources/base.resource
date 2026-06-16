*** Settings ***
Library     AppiumLibrary


*** Variables ***
${ENTRAR}       xpath=//android.widget.TextView[@text="Entrar"]
${EMAIL}        anderson.ssantos@jcatlm.com.br
${SENHA}        AndJca26


*** Keywords ***
Start session
    Open Application    http://127.0.0.1:4723
    ...    platformName=Android
    ...    appium:deviceName=emulator-5554
    ...    appium:automationName=UiAutomator2
    ...    browserName=Chrome
    ...    appium:ensureWebviewsHavePages=${True}
    ...    appium:noReset=${True}
    ...    appium:autoGrantPermissions=${True}
    ...    appium:clearDeviceLogs=${True}
    ...    appium:uiautomator2ServerLaunchTimeout=${90000}
    ...    appium:uiautomator2ServerInstallTimeout=${60000}
    ...    appium:adbExecTimeout=${60000}
    ...    appium:newCommandTimeout=${300}
    ...    appium:connectHardwareKeyboard=${True}

    Go To Url    https://www.outletdepassagens.com.br

Login
    Sleep    7s
