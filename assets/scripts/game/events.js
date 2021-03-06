const api = require('./api')
const ui = require('./ui')
const store = require('../store')

let currentPlayer = 'X'
let gameOver = false

const checkConditions = (currentPlayer) => {
  if (store.game.cells[0] === currentPlayer &&
    store.game.cells[1] === currentPlayer &&
    store.game.cells[2] === currentPlayer) return true
  else if (store.game.cells[3] === currentPlayer &&
    store.game.cells[4] === currentPlayer &&
    store.game.cells[5] === currentPlayer) return true
  else if (store.game.cells[6] === currentPlayer &&
    store.game.cells[7] === currentPlayer &&
    store.game.cells[8] === currentPlayer) return true
  else if (store.game.cells[0] === currentPlayer &&
    store.game.cells[3] === currentPlayer &&
    store.game.cells[6] === currentPlayer) return true
  else if (store.game.cells[1] === currentPlayer &&
    store.game.cells[4] === currentPlayer &&
    store.game.cells[7] === currentPlayer) return true
  else if (store.game.cells[2] === currentPlayer &&
    store.game.cells[5] === currentPlayer &&
    store.game.cells[8] === currentPlayer) return true
  else if (store.game.cells[0] === currentPlayer &&
    store.game.cells[4] === currentPlayer &&
    store.game.cells[8] === currentPlayer) return true
  else if (store.game.cells[2] === currentPlayer &&
    store.game.cells[4] === currentPlayer &&
    store.game.cells[6] === currentPlayer) return true
  else return false
}

const onCreateGame = e => {
  e.preventDefault()

  if (currentPlayer === 'O') currentPlayer = 'X'
  if (gameOver === true) gameOver = false

  api.createGame()
    .then(ui.createGameSuccess)
    .catch(ui.createGameFailure)
}

const onBoxClick = e => {
  e.preventDefault()
  const box = $(e.target)

  if (!box.text() && !gameOver) {
    api.updateGame(box.data('cellIndex'), currentPlayer, gameOver)
      .then(res => ui.updateGameSuccess(res, currentPlayer))
      .then(() => {
        if (checkConditions(currentPlayer)) {
          gameOver = true
          api.updateGame(box.data('cellIndex'), currentPlayer, gameOver)
            .then(res => ui.winGame(currentPlayer))
            .catch(ui.updateGameFailure)
        } else if (!store.game.cells.includes('')) {
          gameOver = true
          api.updateGame(box.data('cellIndex'), currentPlayer, gameOver)
            .then(res => ui.drawGame())
            .catch(ui.updateGameFailure)
        } else {
          currentPlayer = currentPlayer === 'O' ? 'X' : 'O'
        }
      })
      .catch(ui.updateGameFailure)
  }
}

const onGetGames = e => {
  e.preventDefault()

  api.getGames()
    .then(ui.getGamesSuccess)
    .catch(ui.getGamesFailure)
}

module.exports = {
  onCreateGame,
  onBoxClick,
  onGetGames
}