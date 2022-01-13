// Imports 
import { Light } from './lightClass.js'
import { levelCatalogue } from './gameLevels.js'
import { clickedPlusAdjacent, alertMessage } from './utils.js'

window.addEventListener("load",function() {
  setTimeout(function(){
      // This hides the address bar:
      window.scrollTo(0, 1);
  }, 0);
});

// body element - disable clicks while level refreshes
const body = document.querySelector('body')
// Access all clickable lights in the GUI
const gameSquares = document.querySelectorAll('.light')
const notificationBanner = document.querySelector('h2')
const resetBtn = document.querySelector('#reset-btn')
const hintBtn = document.querySelector('#hint-btn')
const limitDisplay = document.querySelector('#limit-display') 
const attemptDisplay = document.querySelector('#attempt-display') 
const clickDisplay = document.querySelector('#click-display') 
const levelDisplay = document.querySelector('#level-display') 
const scoreDisplay = document.querySelector('#score-display') 
const hintDisplay = document.querySelector('#hint-display')

// Variables for tracking state of game logic
let [activeLightCount, clickCount, currentLevel, attempts, hintsUsedCount] = [0, 0, 1, 1, 0]

const scoreState = {
  score: 0,
  calculateScore: function(clickCount, attempts) {
      this.score += 100 - 
      (1 * (clickCount - levelCatalogue[`${ currentLevel }`].minClicks)) -
      (5 * (attempts - 1)) -
      (20 * hintsUsedCount)
  }
}

// User notification messages
let winAlert = alertMessage('win')(3000)(notificationBanner)
let lossAlert = alertMessage('loss')(3000)(notificationBanner)
let hintAlert = alertMessage('hint')(3000)(notificationBanner)

// Adding on click functionalities to GUI elements
resetBtn.addEventListener('click', () => {
  clearBoard()
  loadBoard(currentLevel)
  updateDisplayAfterRestart()
})
hintBtn.addEventListener('click', () => showHint(currentLevel))
gameSquares.forEach(square => square.addEventListener('click', (square) => gameflow(square)))

// stores button objects for state tracking
// When accessing Lights & gameSquares, the syntax [id - 1] will always be used, as arrays are 0 based, but ids start at 1
const lightObjects = []
for (let i = 1; i < 26; i++){
  lightObjects.push(new Light(i, false))
}

// Loads board & updates displays at runtime
loadBoard(currentLevel)
updateDisplayAfterWin()


function loadBoard(level) {
  // reset clickCount, activeLightCount & re-enable mouse clicks
  clickCount = 0
  activeLightCount = 0
  mouseAction('enable')
  
  // populates gameboard with starting lights + sets activeLightCount accordingly
  const newBoardStartingCoords = levelCatalogue[`${level}`].startingCoords
  newBoardStartingCoords.forEach(coord => {
    lightObjects[coord - 1].toggleState()
    gameSquares[coord - 1].classList.toggle('active')
    activeLightCount += 1
  })
}


// Controls game logic flow
const gameflow = (square) => {
  clickCount++
  updateClickDisplay()
  const clickedId = parseInt(square.currentTarget.id)
  // identifies the clicked and adjacent squares to toggle
  const idsToToggle = clickedPlusAdjacent(clickedId)
  toggleSquares(idsToToggle)

  if (checkForWin(activeLightCount)) {
    const minClicks = levelCatalogue[`${ currentLevel }`].minClicks
    scoreState.calculateScore(clickCount, attempts)
    currentLevel++
    mouseAction('disable')
    if (clickCount === minClicks && attempts === 1 && hintsUsedCount === 0) {
      winAlert(`PERFECT SCORE!<br>Get ready for level ${currentLevel}`)
    } else {
      winAlert(`You Win!<br>Get ready for level ${currentLevel}`)
    }
    setTimeout(() => {
      startNewLevel()
      loadBoard(currentLevel)
      updateDisplayAfterWin()
    }, 3000)
  } else if (checkForLoss(clickCount)) {
    mouseAction('disable')
    lossAlert('Oops, you failed!')
    setTimeout(() => {
      clearBoard()
      loadBoard(currentLevel)
      updateDisplayAfterRestart()
    }, 3000)
  }
}


const toggleSquares = idsToToggle => {
  // gets index of each appropriate square and light to toggle - toggles them & modifies active light count
  idsToToggle.forEach(id => {
    const lightObj = lightObjects[id - 1]
    const squareToToggle = gameSquares[id - 1]

    lightObj.toggleState()
    squareToToggle.classList.toggle('active')
    activeLightCount = lightObj.changeVal(activeLightCount)
  })
}


// disable/enable mouse events according to display of win & loss alerts
function mouseAction(status) {
  body.style.pointerEvents = status === 'disable' ? "none" : "auto"
}


// only executes when user completes a level
const startNewLevel = () => {
  [attempts, hintsUsedCount ] = [1, 0]
}


// only executes when user loses or manually resets board
const clearBoard = () => {
  attempts++
  // Reset GUI and light objects to default state
  for (let i = 1; i < 26; i++){
    lightObjects[i - 1].isActive = false
    gameSquares[i - 1].classList.remove('active')
  }
}


const showHint = currentLevel => {
  // Only 2 hints allowed
  if (hintsUsedCount === 2) {
    hintAlert('You\'re only allowed 2 hints per level!')
    return
  }
  // HintId accesses coord values at each index [0, 1]. Only 2 hints available to user
  const hintId = levelCatalogue[`${currentLevel}`].hints[hintsUsedCount]
  gameSquares[hintId - 1].classList.add('hint')

  setTimeout(function() {
    gameSquares[hintId - 1].classList.remove('hint')
  }, 2500)
  hintsUsedCount++
  updateHintDisplay()
}


function updateClickDisplay() {
  clickDisplay.innerHTML = `Click Count:<br>${clickCount}`
}

function updateHintDisplay() {
  hintDisplay.innerHTML = `Hints Used:<br>${hintsUsedCount} / 2`
}


function updateDisplayAfterRestart() {
  updateClickDisplay()
  attemptDisplay.innerHTML = `Attempts:<br>${attempts}`
}


function updateDisplayAfterWin() {
  const minClicks = levelCatalogue[`${ currentLevel }`].minClicks
  const maxClicks = levelCatalogue[`${ currentLevel }`].maxClicks
  const totalLevels = Object.keys(levelCatalogue).length

  updateDisplayAfterRestart()
  updateHintDisplay()
  limitDisplay.innerHTML = `Min & Max<br>Clicks to Solve:<br>${minClicks} / ${maxClicks}`
  levelDisplay.innerHTML = `Level:<br>${currentLevel} / ${totalLevels}`
  scoreDisplay.innerHTML = `Score:<br>${scoreState.score}`
}


// User wins if no lights are active
const checkForWin = activeLightCount => activeLightCount == 0 ? true : false

// User loses if max clicks is reached
const checkForLoss = clickCount => clickCount === levelCatalogue[`${ currentLevel }`].maxClicks ? true : false
