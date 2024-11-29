const fs = require('fs').promises
const readline = require('readline').promises

// Create matrix for the gameBoard
gameBoard = {"A": [0, 0, 0, 0, 0, 0, 0, 0],
    "B": [0, 0, 0, 0, 0, 0, 0, 0],
    "C": [0, 0, 0, 0, 0, 0, 0, 0],
    "D": [0, 0, 0, 0, 0, 0, 0, 0],
    "E": [0, 0, 0, 0, 0, 0, 0, 0],
    "F": [0, 0, 0, 0, 0, 0, 0, 0]
}

userBoard = {"A": [0, 0, 0, 0, 0, 0, 0, 0],
    "B": [0, 0, 0, 0, 0, 0, 0, 0],
    "C": [0, 0, 0, 0, 0, 0, 0, 0],
    "D": [0, 0, 0, 0, 0, 0, 0, 0],
    "E": [0, 0, 0, 0, 0, 0, 0, 0],
    "F": [0, 0, 0, 0, 0, 0, 0, 0]
}

// Funció per escriure un objecte en un arxiu .json
async function writeData(obj, file_path) {
    try {
        const txtData = JSON.stringify(obj, null, 2)
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

function printBoard(board) {
    // Print the gameBoard
    let firstRow = ""
    for (let i = 0; i < 8;  i++){
        firstRow = firstRow + i + " "
    }
    console.log("  " + firstRow)
    for (let key in board) {
        // Print the row in the same line
        let row = board[key]
        let rowStr = key + " " + row.join(' ')
        console.log(rowStr)
    }
}

function checkMove(board, row, col) {
    if(board[row][col] === 1) {
        board[row][col] = "X"
    }
}

function occupyBoard(board) {
    // Randomly occupy the gameBoard
    let counter = 0
    const totalCells = Object.keys(board).length * board["A"].length
    const maxOnes = 16

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
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    occupyBoard(gameBoard)
    printBoard(gameBoard)

    //await writeData(person, path)
    //const json_data = await readData(path)
    while(true){
    const playerMove = await rl.question("Select Row&Col: ")
    let row = playerMove[0]
    let col = playerMove[1]

    checkMove(gameBoard)
    printBoard(gameBoard)
}

    rl.close() // Tancar la lectura 'readline'
}

main()