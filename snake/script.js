const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d");
const gameContainer = document.getElementsByClassName("game")[0]
const score = document.getElementById("score")

let gameState = [208]
const params = {
    isGameStarted: false,
    direction: 1,
    currentDirection: 1,
    fruit: 216,
    score: 0
}

const getDirection = (key) => {
    if (key === 37) return -1
    if (key === 38) return -20
    if (key === 39) return 1
    return 20
}

const draw = (a) => {
    ctx.fillRect((a % 20) * 60 + 10, Math.floor(a / 20) * 60 + 10, 50, 50)
}
const render = () => {
    ctx.beginPath();
    ctx.arc((params.fruit % 20) * 60 + 35, Math.floor(params.fruit / 20) * 60 + 35, 20, 0, 2 * Math.PI, false);
    ctx.fill();
    gameState.forEach((cell) => { draw(cell) })
}

const chooseNewFruit = () => {
    let newFruit
    do {
        newFruit = Math.floor(Math.random() * 400)
    } while (gameState.includes(newFruit))
    params.fruit = newFruit
}

const hasLost = (cell, direction) => {
    console.log(cell, direction)
    return (cell % 20 === 0 && direction === -1)
    || (cell % 20 === 19 && direction === 1)
    || (Math.floor(cell / 20) === 0 && direction === -20)
    || (Math.floor(cell / 20) === 19 && direction === 20)
}

let gameProcess
const process = () => {
    const newCell = gameState[gameState.length - 1] + params.direction
    if (hasLost(gameState[gameState.length -1], params.direction)) return endGame()
    if (gameState.includes(newCell)) return endGame()
    gameState.push(newCell)
    if (newCell === params.fruit) {
        params.score++
        score.innerHTML = `Score : ${params.score}` 
        chooseNewFruit()
    } else {
        gameState.shift()
    }
    params.currentDirection = params.direction
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    render() 
}

const startGame = () => {
    ctx.fillStyle = "#fefefe"
    params.isGameStarted = true
    gameContainer.classList.remove("paused")
    gameProcess = window.setInterval(process, 100) 
}
const endGame = () => {
    gameContainer.classList.add("paused")
    clearInterval(gameProcess)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameState = [208]
    params.direction = 1
    params.currentDirection = 1
    params.score = 0
    params.isGameStarted = false
}

const handleKeyPress = (e) => {
    if (e.keyCode < 37 || e.keyCode > 40) return
    if (!params.isGameStarted) startGame()
    if (getDirection(e.keyCode) === -params.currentDirection) return 
    params.direction = getDirection(e.keyCode)
}

document.addEventListener('keydown', (e) => (handleKeyPress(e)));