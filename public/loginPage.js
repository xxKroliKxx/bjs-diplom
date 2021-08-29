'use strict'


let userLoginForm = new UserForm()

userLoginForm.loginFormCallback = data => {
    ApiConnector.login(data, (data) => {
        if (!data.success) {
            userLoginForm.setLoginErrorMessage(data.error)
            return
        }
        location.reload()
    })
}

userLoginForm.registerFormCallback = data => {
    ApiConnector.register(data, (data) => {
            if (!data.success) {
                userLoginForm.setLoginErrorMessage(data.error)
                return
            }
            location.reload()
        }
    )
}

