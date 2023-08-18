
class GameOfLife {
    constructor(options={}) {
        this.width = options.width || 20
        this.height = options.height || 10
        this.scale = options.scale || 10
        this.cells = [[]]
        this._temp = [[]]
        this.clear()
    }

    clear() {
        for (var y=0; y<this.height; y++) {
            this.cells[y] = []
            for (var x=0; x<this.width; x++) {
                this.cells[y][x] = { x, y, alive: false }
            }
        }
    }

    randomize(chance=10) {
        for (var row of this.cells) {
            for (var cell of row) {
                cell.alive = floor(random(1, chance)) == 1
            }
        }
    }

    draw(x, y, alive) {
        push()
        if (alive) {
            fill(color(255, 255, 255))
        } else {
            fill(color(50, 50, 50))
        }
        rect(x*this.scale, y*this.scale, this.scale)
        pop()
    }

    drawAll() {
        for (var row of this.cells) {
            for (var cell of row) {
                this.draw(cell.x, cell.y, cell.alive)
            }
        }
    }

    getCell(x, y) {
        if (this.cells[y] && this.cells[y][x]) {
            return this.cells[y][x]
        } else {
            return {x, y, alive: false} // Cells off the board are considered dead
        }
    }

    update(x, y) {
        let positions = {
            topleft: this.getCell(x-1, y-1),
            top: this.getCell(x, y-1),
            topright: this.getCell(x+1, y-1),
            left: this.getCell(x-1, y),
            right: this.getCell(x+1, y),
            bottomleft: this.getCell(x-1, y+1),
            bottom: this.getCell(x, y+1),
            bottomright: this.getCell(x+1, y+1)
        }
        let self = this.getCell(x, y)
        let alive = 0
        for (const cell of Object.values(positions)) {
            if (cell.alive) {
                alive ++
            }
        }
        let state = self.alive
        if (self.alive) {
            if (!(alive == 2 || alive == 3)) state = false
        } else {
            if (alive == 3) state = true
        }
        if (!this._temp[y]) this._temp[y] = []
        this._temp[y][x] = {x, y, alive: state}
    }

    iterate() {
        this._temp = [[]]
        for (var row of this.cells) {
            for (var cell of row) {
                this.update(cell.x, cell.y)
            }
        }
        this.cells = this._temp
    }
}
