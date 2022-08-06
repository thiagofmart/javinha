var state = {board: [], currentGame: [], savedGames: []}


function readLocalStorage() {
  if (!window.localStorage) {
    return
  }
  var savedGamesFromLocalStorage = window.localStorage.getItem('saved-games')
  if (savedGamesFromLocalStorage) {
    state.savedGames = JSON.parse(savedGamesFromLocalStorage)
  }
}

function writeToLocalStorage() {
  window.localStorage.setItem('saved-games', JSON.stringify(state.savedGames))
}

function addNumberToGame(numberToAdd) {
  if (numberToAdd<1 || numberToAdd>60) {
    console.error('Número inválido', numberToAdd)
    return
  }
  if (state.currentGame.length>=6){
    console.error('O jogo já está finalizado.')
    return
  }
  if (isNumberInGame(numberToAdd)) {
    console.error('Este número já está no jogo.')
    return
  }
  state.currentGame.push(numberToAdd)
}

function isNumberInGame(numberToCheck) {
  return state.currentGame.includes(numberToCheck)
}

function removeNumberFromGame(numberToRemove) {
  var newGame = []
  for (var i = 0; i<state.currentGame.length; i++) {
    var currentNumber = state.currentGame[i]
    if (currentNumber != numberToRemove) {
      newGame.push(currentNumber)
    }
  }
  state.currentGame = newGame
}

function saveGame() {
  if (!isGameComplete()) {
    console.error('O jogo não está completo!')
    return
  }
  state.savedGames.push(state.currentGame)
  writeToLocalStorage(state.savedGames)
  newGame()
}

function isGameComplete() {
  return state.currentGame.length == 6
}

function resetGame() {
  state.currentGame = []
}

function  newGame() {
  resetGame()
  render()
}

function createBoard() {
  state.board = []
  for (var i = 1; i<=60; i++) {
    state.board.push(i)
  }
}

function render() {
  renderBoard()
  renderButtons()
  renderSavedGames()
  console.log(state.currentGame)
}

function renderBoard() {
  createBoard()
  var divBoard = document.querySelector('#megasena-board')
  divBoard.innerHTML = ''

  var ulNumbers = document.createElement('ul')
  ulNumbers.classList.add('numbers')
  for (var i = 0; i<state.board.length; i++) {
    var currentNumber = state.board[i]
    var liNumber = document.createElement('li')
    liNumber.textContent = currentNumber
    liNumber.classList.add('number')
    liNumber.addEventListener('click', handleNumberClick)
    if (isNumberInGame(currentNumber)) {
      liNumber.classList.add('selected-number')
    }
    ulNumbers.appendChild(liNumber)
  }
  divBoard.appendChild(ulNumbers)
}

function handleNumberClick(event) {
  var value = Number(event.currentTarget.textContent)
  if (isNumberInGame(value)) {
    removeNumberFromGame(value)
  } else {
    addNumberToGame(value)
  }
  render()
}

function renderButtons() {
  var divButtons = document.querySelector('#megasena-buttons')
  divButtons.innerHTML = ''
  var buttonNewGame = createNewGameButton()
  var buttonRandomGame = createRandomGameButton()
  var buttonSaveGame = createSaveGameButton()
  divButtons.appendChild(buttonNewGame)
  divButtons.appendChild(buttonRandomGame)
  divButtons.appendChild(buttonSaveGame)
}

function createRandomGameButton() {
  var button = document.createElement('button')
  button.textContent = 'Jogo Aleatório'
  button.addEventListener('click', randomGame)
  return button
}

function renderSavedGames() {
  var divSavedGames = document.querySelector('#megasena-saved-games')
  divSavedGames.innerHTML = ''
  if (state.savedGames.length===0) {
    divSavedGames.innerHTML = '<p>Nenhum jogo salvo</p>'
  } else {
    var ulSavedGames = document.createElement('ul')
    for (var i = 0; i<state.savedGames.length; i++) {
      var currentGame = state.savedGames[i]
      var liGame = document.createElement('li')
      liGame.textContent = currentGame.join(', ')
      ulSavedGames.appendChild(liGame)
    }
    divSavedGames.appendChild(ulSavedGames)
  }
}

function createNewGameButton() {
  var button = document.createElement('button')
  button.textContent = 'Novo Jogo'
  button.addEventListener('click', newGame)
  return button
}
function createSaveGameButton() {
  var button = document.createElement('button')
  button.textContent = 'Salvar Jogo'
  button.disabled = !isGameComplete()
  button.addEventListener('click', saveGame)
  return button
}
function randomGame() {
  resetGame()
  while (!isGameComplete()) {
    var randomNumber = Math.ceil(Math.random()*60)
    addNumberToGame(randomNumber)
  }
  render()
}
////////////////////////////////////////////////////////////////////////////////


function start() {
  var buttonCalculateImc = document.querySelector('#button-calculate-imc')
  buttonCalculateImc.addEventListener('click', handleIMCButtonClick, )

  var inputWeight = document.querySelector("#input-weight")
  var inputHeight = document.querySelector("#input-height")

  inputWeight.addEventListener('input', handleIMCButtonClick)
  inputHeight.addEventListener('input', handleIMCButtonClick)
  handleIMCButtonClick()
  readLocalStorage()
  render()
}


function handleIMCButtonClick() {
  var inputWeight = document.querySelector("#input-weight")
  var inputHeight = document.querySelector("#input-height")
  var imcResult = document.querySelector("#imc-result")
  var weight = Number(inputWeight.value)
  var height = Number(inputHeight.value)

  var imc = calcularImc(weight, height)

  var formattedImc = imc.toFixed(2).replace('.', ',')
  imcResult.textContent = formattedImc
  var analysis = analyse(imc)
  var analysis_div = document.querySelector('#analysis')
  if (analysis!=='Invalid') {
    analysis_div.innerHTML = `<p>Este valor considera que você está na faixa <strong>${analysis}</strong></p>`
  } else {
    analysis_div.innerHTML = ''
  }

}

function analyse(imc) {
  var analysis
  if (16<=imc && imc<17) {analysis = 'Muito abaixo do peso'}
  else if (17<=imc && imc<18.5) {analysis = 'Abaixo do peso'}
  else if (18.5<=imc && imc<25) {analysis = 'Peso normal'}
  else if (25<=imc && imc<30) {analysis = 'Acima do peso'}
  else if (30<=imc && imc<35) {analysis = 'Obesidade grau I'}
  else if (35<=imc && imc<40) {analysis = 'Obesidade grau II'}
  else if (40<=imc){analysis = 'Obesidade grau III'}
  else {analysis='Invalid'}
  return analysis
}

function calcularImc(weight, height) {
  return weight/(height*height)
}
start()
