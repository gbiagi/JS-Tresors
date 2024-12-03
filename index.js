const fs = require('fs').promises
const readline = require('readline').promises

var puntuacio = 0
var tresors = 16
var tirades = 1

// Matriz donde se guardan las jugadas del usuario
gameBoard = {
    "A": [0, 0, 0, 0, 0, 0, 0, 0],
    "B": [0, 0, 0, 0, 0, 0, 0, 0],
    "C": [0, 0, 0, 0, 0, 0, 0, 0],
    "D": [0, 0, 0, 0, 0, 0, 0, 0],
    "E": [0, 0, 0, 0, 0, 0, 0, 0],
    "F": [0, 0, 0, 0, 0, 0, 0, 0]
}

// Matriz donde se guardan los datos del juego
userBoard = {
    "A": [0, 0, 0, 0, 0, 0, 0, 0],
    "B": [0, 0, 0, 0, 0, 0, 0, 0],
    "C": [0, 0, 0, 0, 0, 0, 0, 0],
    "D": [0, 0, 0, 0, 0, 0, 0, 0],
    "E": [0, 0, 0, 0, 0, 0, 0, 0],
    "F": [0, 0, 0, 0, 0, 0, 0, 0]
}

// Funció per escriure un objecte en un arxiu .json
async function writeData() {
    let = file_path = 'savegames/game.json'
    try {
        let txtData = {
            puntuacio: puntuacio,
            tresors: tresors,
            tirades: tirades,
            gameBoard: gameBoard,
            userBoard: userBoard
        };
        txtData = JSON.stringify(txtData, null, 2)
        await fs.writeFile(file_path, txtData, 'utf-8')
        console.log(`Dades escrites a ${file_path}`)
    } catch (error) {
        console.error("Error en escriure les dades:", error)
    }
}

// Funció per llegir un arxiu .json cap a un objecte
async function readData(file_path) {
    try {
        const txtData = await fs.readFile(file_path, 'utf-8')
        const data = JSON.parse(txtData)
        return data
    } catch (error) {
        console.error("Error en llegir les dades:", error)
    }
}

function printBoard(showCheat = false) {
    // Print the gameBoard
    let firstRow = ""
    for (let i = 0; i < 8; i++) {
        firstRow = firstRow + i + " "
    }
    if (showCheat) {
        firstRow = firstRow + '||   ' + firstRow
    }
    console.log("  " + firstRow)
    for (let key in gameBoard) {
        // Print the row in the same line
        let row = gameBoard[key]
        let rowStr = key + " " + row.join(' ')
        if (showCheat) {
            cheatRow = userBoard[key]
            rowStr = rowStr + " || " + key + " " + cheatRow.join(' ')
        }
        console.log(rowStr)
    }
}

function checkTreasure(row, col) {
    // Comprovar on es el tresor mes proper
    let minDistance = Infinity;
    let nearestTreasure = null;

    for (let r in userBoard) {
        for (let c = 0; c < userBoard[r].length; c++) {
            if (userBoard[r][c] === 1) {
                let distance = Math.abs(r.charCodeAt(0) - row.charCodeAt(0)) + Math.abs(c - col);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestTreasure = { row: r, col: c };
                }
            }
        }
    }

    if (nearestTreasure) {
        console.log(`El tresor més proper està a la fila ${nearestTreasure.row} i columna ${nearestTreasure.col}`);
    } else {
        console.log("No s'ha trobat cap tresor.");
    }
}

function checkMove(row, col) {
    if (userBoard[row][col] === 1) {
        gameBoard[row][col] = "X"
        puntuacio++
        tresors--
    } else {
        gameBoard[row][col] = "-"
        checkTreasure(row, col)
        tirades++
    }
}

function occupyBoard(board) {
    // Randomly occupy the gameBoard
    let counter = 0
    const totalCells = Object.keys(board).length * board["A"].length
    const maxOnes = tresors

    while (counter < maxOnes) {
        let randomRow = String.fromCharCode(65 + Math.floor(Math.random() * Object.keys(board).length))
        let randomCol = Math.floor(Math.random() * board[randomRow].length)

        if (board[randomRow][randomCol] === 0) {
            board[randomRow][randomCol] = 1
            counter++
        }
    }


}

async function main() {

    var showCheat = false
    occupyBoard(userBoard)

    while (true) {
        if (tirades > 32) {
            console.log("Has perdut")
            return
        }
        printBoard(showCheat)

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        switch (await rl.question("Escriu una comanda: ")) {
            case 'trampa':
                showCheat = !showCheat
                break
            case 'dt':
                let playerMove = await rl.question("Seleciona la fila i la columna: ")
                let row = playerMove[0].toUpperCase()
                let col = playerMove[1]
                checkMove(row, col)
                break
            case 'puntuacio':
                console.log('Puntuacio: ' + puntuacio + '/16')
                console.log('Tirades: ' + tirades + '/32')
                break
            case 'guardar':
                await writeData()
                break
            case 'carregar':
                let data = await readData('savegames/game.json')
                puntuacio = data.puntuacio
                tresors = data.tresors
                tirades = data.tirades
                gameBoard = data.gameBoard
                userBoard = data.userBoard
                console.log('Dades carregades')
                break
            case 'ajuda':
                console.log("Comandes disponibles: trampa, destapar, puntuacio, guardar, carregar, ajuda, sortir")
                break
            case 'sortir':
                return
        }
        rl.close() // Tancar la lectura 'readline'
    }
}

main()