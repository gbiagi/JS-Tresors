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

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })


    
    // Randomly occupy the gameBoard
    let counter = 0
    const totalCells = Object.keys(gameBoard).length * gameBoard["A"].length
    const maxOnes = 16

    while (counter < maxOnes) {
        let randomRow = String.fromCharCode(65 + Math.floor(Math.random() * Object.keys(gameBoard).length))
        let randomCol = Math.floor(Math.random() * gameBoard[randomRow].length)
        
        if (gameBoard[randomRow][randomCol] === 0) {
            gameBoard[randomRow][randomCol] = 1
            counter++
        }
    }

    //await writeData(person, path)
    //const json_data = await readData(path)

    //const path = await rl.question("Nom de l'arxiu a generar? ")


    rl.close() // Tancar la lectura 'readline'
}

main()