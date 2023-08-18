
let gol
let paused = true
let step = false
function setup() {
    createCanvas(15 * 90, 15 * 50);
    frameRate(10)
    gol = new GameOfLife({ scale: 15, width: 90, height: 50 })
    gol.randomize()
}

function draw() {
    background(220);
    gol.drawAll()
    if (!paused || step) {
        step = false
        gol.iterate()
    }
}

function keyPressed(event) {
    switch (event.key) {
        case " ":
            paused = !paused
            break
        case "s":
            step = true
            break
        case "c":
            gol.clear()
            break
        case "e":
            encode()
            break
        case "l":
            decode(prompt("Enter your save string:"))
            break
    }
}

function mousePressed(event) {
    if (!fullscreen()) {
        fullscreen(true)
    }
    let x = floor(mouseX / gol.scale)
    let y = floor(mouseY / gol.scale)
    if (x <= 89 && x >= 0 && y <= 49 && y >= 0 && paused) {
        gol.cells[y][x].alive = !gol.cells[y][x].alive
    }
}

function encode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    var i = 0
    var cur = 0
    var string = ""
    try {
        for (const row of gol.cells) {
            for (const cell of row) {
                cur += cell.alive * (32 >> i)
                i++
                if (i > 5) {
                    string += chars[cur]
                    i = 0
                    cur = 0
                }
            }
        }
        prompt("Copy your save string. CTRL+C then ENTER", string)
    } catch (err){
        console.log(err)
    }
}

function decode(saveCode) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    let x = -1
    let y = 0
    try {
        gol.clear()
        for (const char of saveCode.split("")) {
            let index = chars.indexOf(char)
            if (index != -1) {
                for (const c of index.toString(2).padStart(6, "0").split("")) {
                    x++
                    if (x >= gol.width) {
                        x = 0
                        y++
                    }
                    if (y >= gol.height) {
                        console.log("Loading went outside of bounds")
                        return
                    }
                    gol.cells[y][x].alive = parseInt(c)
                }
            }
        }
    } catch (err){
        console.log(err)
    }
}
