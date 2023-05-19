// Wave Function Collapse - Made for p5.js

class Tile {
    constructor(options) {
        this.name = options.name || "Unnamed" // Not used in core functionality
        this.draw = options.draw || function(x, y) {} // Function to call to render this tile
        this.edges = options.edges || {up: 0, right: 0, down: 0, left: 0} // 0 is empty and 1 is full / touching edge
        this.weight = options.weight || 1 // Amount of repetitions to increase chance of this tile occuring
    }
}

class Cell {
    constructor(tile, tiles) {
        this.tile = tile || undefined
        this.options = tiles || []
    }

    totalWeights() {
        let total = 0
        for (let tile in this.options) {
            total += tile.weight
        }
        return total
    }

    randomAssign() {
        let id = floor(random(0, this.totalWeights())) // Random number between 0 and the sum of weights

    }
}

class WaveFunction {
    constructor(options) {
        this.cells = [[]] // 2D array of cells
        this.tiles = options.tiles || [ new Tile() ]
        this.width = options.width || 4
        this.height = options.height || 4
        this.resetCells()
    }

    resetCells() {
        for (let y = 0; y < this.height; y++) {
            this.cells[y] = []
            for (let x = 0; x < this.width; x++) {
                this.cells[y][x] = new Cell(this.tiles[0], this.tiles)
            }
        }
    }

    iterate() {
        let cell = random(this.cells)
        console.log(cell)
        let tile = random(this.tiles)
        console.log(tile)
        cell.tile = tile
    }

    isCollapsed() {
        
    }

    drawAll() {
        for (let row in this.cells) {
            for (let column in this.cells[row]) {
                this.cells[row][column].tile.draw(column, row)
            }
        }
    }
}
