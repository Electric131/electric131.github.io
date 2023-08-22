// Wave Function Collapse - Made for p5.js

class Tile {
    constructor(options) {
        this.name = options.name || "Unnamed" // Not used in core functionality
        this.draw = options.draw || function(x, y) {} // Function to call to render this tile
        this.edges = options.edges || {up: 0, right: 0, down: 0, left: 0} // Singular type or list of types to allow
        this.weight = options.weight || 1 // Amount of repetitions to increase chance of this tile occuring
        this.type = options.type || 0 // Defines the types matched with "edges"
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

    getOppositeSide(sideName) {
        const names = [ "up", "right", "down", "left" ]
        return names[(names.indexOf(sideName) + 2) % 4]
    }

    checkValid(adj, check, side, value) {
        if (!adj.tile) return true // Requires adj cell to be collapsed
        let compA = value
        let compB = adj.tile.edges[this.getOppositeSide(side)]
        if (!Array.isArray(compA)) compA = [ compA ]
        if (!Array.isArray(compB)) compB = [ compB ]
        if (compA.includes(adj.tile.type) && compB.includes(check.type)) {
            return true
        }
        // if (edgeValue == this.tile.edges[edgeName]) return true
        return false
    }

    updateSelf() {
        let copy = Object.assign([], this.options)
        for (const option of copy) {
            for (const [side, value] of Object.entries(option.edges)) {
                let positions = [[this.x+1,this.y], [this.x-1, this.y], [this.x, this.y+1], [this.x, this.y-1]]
                // Repeat for positions up, down, left, and right
                for (const pair of positions) {
                    let [x, y] = pair
                    let neighbor = this.grid.getPos(x, y)
                    // Check if the neighbor is valid
                    if (neighbor) {
                        if (!this.checkValid(neighbor, option, side, value)) {
                            // If option is now invalid, remove option
                            let index = this.options.indexOf(option)
                            if (index != -1) this.options.splice(index, 1)
                        }
                    }
                }
            }
        }
        if (this.options.length == 0) {
            wfc.resetCells()
            wfc.beginCollapse()
            // throw Error("Cell collapsed to 0 options! This means something went wrong and we must restart or retrace our steps.")
        }
    }

    update() {
        if (!this.tile) return // Requires cell to be collapsed
        let positions = [[this.x+1,this.y], [this.x-1, this.y], [this.x, this.y+1], [this.x, this.y-1]]
        // Repeat for positions up, down, left, and right
        for (const pair of positions) {
            let [x, y] = pair
            let neighbor = this.grid.getPos(x, y)
            // Check if there is a neighbor
            if (neighbor) {
                // Tell the neighbor to update it's options
                neighbor.updateSelf()
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
                // Ignore collapsed cells
                if (cell.tile) continue
                // Length of options = Entropy
                if (cell.options.length == entropy) {
                    current.push(cell)
                } else if (cell.options.length < entropy) {
                    current = [cell]
                    entropy = cell.options.length
                }
            }
        }
        // Pick random if there are several with the lowest entropy
        if (current.length > 1) {
            current = random(current)
        } else if (current.length == 1) {
            current = current[0]
        } else {
            // Something has gone wrong and no cell was found.
            // This could also mean that all cells have been collapsed.
            if (this.isCollapsed()) return true
            throw new Error("No cell found.")
        }
        // Collapse the cell
        current.randomAssign()
        current.update()
        return false
    }

    isCollapsed() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (!this.cells[y][x].tile) {
                    return false
                }
            }
        }
        return true
    }

    beginCollapse() {
        let row = random(this.cells)
        let cell = random(row)
        // Force deep water for cooler islands :)
        let valid = false
        for (const option of cell.options) {
            if (option.type == "deep_ocean") {
                cell.tile = option
                valid = true
                break
            }
        }
        if (!valid) {
            cell.randomAssign()
        }
        cell.update()
    }

    getPos(x, y) {
        if (y < 0 || y >= this.height || x < 0 || x >= this.width) return null
        return this.cells[y][x]
    }

    drawAll() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.cells[y][x].tile instanceof Tile) {
                    this.cells[y][x].tile.draw(x, y)
                }
            }
        }
    }
}
