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
    constructor(grid, tiles, x, y) {
        this.grid = grid
        this.tile = undefined
        this.options = Object.assign([], tiles) || []
        this.x = x
        this.y = y
    }

    weightAdjusted() {
        let adjusted = []
        for (let tile of this.options) {
            let add = new Array(tile.weight).fill(tile)
            adjusted = adjusted.concat(add)
        }
        return adjusted
    }

    randomAssign() {
        let newTile = random(this.weightAdjusted()) // Pick a random tile out of options adjusting for their weight
        this.tile = newTile
    }

    update() {
        if (!this.tile) return // Requires cell to be collapsed
        let positions = [[this.x+1,this.y], [this.x-1, this.y], [this.x, this.y+1], [this.x, this.y-1]]
        for (const pair of positions) {
            let [x, y] = pair
            let neighbor = this.grid.getPos(x, y)
            if (neighbor) {
                console.log("New neighbor @", neighbor.x, " ", neighbor.y)
                console.log(neighbor.options)
                console.log(neighbor.options.length)
                for (const option of neighbor.options) {
                    for (const [k, v] of Object.entries(option.edges)) {
                        if (v != this.tile.edges[k]) {
                            let index = neighbor.options.indexOf(option)
                            if (index != -1) neighbor.options.splice(index, 1)
                            console.log(neighbor.options.length)
                        }
                    }
                }
            }
        }
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
                this.cells[y][x] = new Cell(this, this.tiles, x, y)
            }
        }
    }

    iterate() {
        // Find tile with lowest entropy.
        let current = []
        let entropy = Infinity
        for (const row of this.cells) {
            for (const cell of row) {
                console.log(cell.options.length)
                // Length of options = Entropy
                if (cell.options.length < entropy) {
                    entropy = cell.options.length
                    current.push(cell)
                } else if (cell.options.length == entropy) {
                    current = [cell]
                }
            }
        }
        console.log(entropy)
    }

    isCollapsed() {
        for (let y = 0; y < this.height; y++) {
            this.cells[y] = []
            for (let x = 0; x < this.width; x++) {
                if (this.cells[y][x].tile == undefined) {
                    return false
                }
            }
        }
        return true
    }

    beginCollapse() {
        let row = random(this.cells)
        let cell = random(row)
        cell.randomAssign()
        cell.update()
    }

    getPos(x, y) {
        if (y < 0 || y >= this.height || x < 0 || x >= this.width) return null
        return this.cells[y][x]
    }

    drawAll() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.cells[y][x].tile instanceof Tile) this.cells[y][x].tile.draw(x, y)
            }
        }
    }
}
