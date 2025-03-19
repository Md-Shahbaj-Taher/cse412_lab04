// Initialize variables
const puzzleContainer = document.getElementById('puzzle-container');
const sizeSelector = document.getElementById('size-selector');
const applySizeButton = document.getElementById('apply-size');
let gridSize = 4; // Default size is 4x4 for a 15-puzzle
let puzzleArray = [];

// Generate a shuffled puzzle array
function generatePuzzle(size) {
    const totalTiles = size * size;
    let tiles = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);
    tiles.push(''); // Empty space

    // Shuffle the tiles (Fisher-Yates algorithm)
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    puzzleArray = []; // Reset puzzle array
    for (let i = 0; i < size; i++) {
        puzzleArray.push(tiles.slice(i * size, (i + 1) * size));
    }
}

// Render the puzzle on the webpage
function renderPuzzle() {
    puzzleContainer.innerHTML = '';
    puzzleContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    puzzleContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    puzzleArray.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            const tileElement = document.createElement('div');
            tileElement.className = 'tile';
            tileElement.dataset.row = rowIndex;
            tileElement.dataset.col = colIndex;
            tileElement.innerText = tile;

            if (tile === '') {
                tileElement.classList.add('empty');
            }

            tileElement.addEventListener('click', () => moveTile(rowIndex, colIndex));
            puzzleContainer.appendChild(tileElement);
        });
    });
}

// Check if a move is legal
function isLegalMove(emptyRow, emptyCol, row, col) {
    return (
        (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
        (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
}

// Move a tile if the move is legal
function moveTile(row, col) {
    const emptyTile = findEmptyTile();
    const emptyRow = emptyTile.row;
    const emptyCol = emptyTile.col;

    if (isLegalMove(emptyRow, emptyCol, row, col)) {
        // Swap the tiles
        [puzzleArray[emptyRow][emptyCol], puzzleArray[row][col]] =
            [puzzleArray[row][col], puzzleArray[emptyRow][emptyCol]];

        renderPuzzle();
        if (isPuzzleSolved()) {
            alert('Congratulations! You solved the puzzle!');
        }
    }
}

// Find the empty tile's position
function findEmptyTile() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (puzzleArray[row][col] === '') {
                return { row, col };
            }
        }
    }
}

// Check if the puzzle is solved
function isPuzzleSolved() {
    let count = 1;
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (row === gridSize - 1 && col === gridSize - 1) {
                return puzzleArray[row][col] === '';
            }
            if (puzzleArray[row][col] !== count) {
                return false;
            }
            count++;
        }
    }
}

// Initialize the puzzle
function initializePuzzle(size) {
    gridSize = size;
    generatePuzzle(gridSize);
    renderPuzzle();
}

// Event listener for applying size selection
applySizeButton.addEventListener('click', () => {
    const newSize = parseInt(sizeSelector.value, 10);
    initializePuzzle(newSize);
});

// Example: Initialize the puzzle on page load with default size
window.onload = () => {
    initializePuzzle(gridSize);
};
