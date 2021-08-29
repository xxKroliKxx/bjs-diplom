'use strict'

let currentUserID = null
let logoutBtn = new LogoutButton()
let ratesBoard = new RatesBoard()
let moneyManager = new MoneyManager()
let favoritesWidget = new FavoritesWidget()

let getStocks = function () {
    ApiConnector.getStocks((result) => {
        if (!result.success) return
        ratesBoard.clearTable()
        ratesBoard.fillTable(result.data)
    })
    setTimeout(getStocks, 60000)
}

let moneyCallback = function (result, message) {
    if (!result.success) {
        moneyManager.setMessage(false, result.error);
        return
    }
    moneyManager.setMessage(true, message)
    ProfileWidget.showProfile(result.data)
}

let favoritesCallback = function (result, message) {
    if (!result.success) {
        favoritesWidget.setMessage(false, result.error);
        return
    }
    favoritesWidget.setMessage(true, message);
    favoritesWidget.clearTable()
    favoritesWidget.fillTable(result.data)
    moneyManager.updateUsersList(result.data)
}

logoutBtn.action = (data) => {
    ApiConnector.logout((data) => {
        if (data.success) {
            location.reload()
        }
    })
}

moneyManager.addMoneyCallback = (d) => {
    ApiConnector.addMoney(d, (result) => {
        moneyCallback(result, 'Баланс успешно пополнен')
    })
}

moneyManager.conversionMoneyCallback = (d) => {
    ApiConnector.convertMoney(d, (result) => {
        moneyCallback(result, 'Конвертация прошла успешно')
    })
}

moneyManager.sendMoneyCallback = (d) => {
    ApiConnector.transferMoney(d, (result) => {
        moneyCallback(result, 'Перевод прошел успешно')
    })
}

favoritesWidget.addUserCallback = (d) => {
    ApiConnector.addUserToFavorites(d, (result) => {
        favoritesCallback(result, 'Пользователь успешно добавлен')
    })
}

favoritesWidget.removeUserCallback = (d) => {
    ApiConnector.removeUserFromFavorites(d, (result) => {
        favoritesCallback(result, 'Пользователь удален')
    })
}

ApiConnector.current((result) => {
    if (!result.success) return
    currentUserID = result.data.id
    ProfileWidget.showProfile(result.data)
})

ApiConnector.getFavorites((result) => {
    favoritesCallback(result)
})

getStocks()
