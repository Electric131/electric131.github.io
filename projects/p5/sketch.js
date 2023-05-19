
let car
let car2
let userInputs = [0, 0]

let wfc

function setup() {
    createCanvas(1200, 600)
    angleMode(DEGREES)
    noStroke()
    frameRate(60)
    wfc = new WaveFunction({
        tiles: [
            new Tile({
                name: "Blank",
                draw: function(x, y) {
                    fill(color("#0000BB"))
                    rect(x * 40, y * 40, 32, 32)
                },
                edges: {
                    up: 0,
                    right: 0,
                    down: 0,
                    left: 0
                }
            }),
            new Tile({
                name: "Straight-Horizontal",
                draw: function(x, y) { drawTrack(x, y, 'straight', 90) },
                edges: {
                    up: 0,
                    right: 1,
                    down: 0,
                    left: 1
                }
            }),
            new Tile({
                name: "Straight-Vertical",
                draw: function(x, y) { drawTrack(x, y, 'straight', 0) },
                edges: {
                    up: 1,
                    right: 0,
                    down: 1,
                    left: 0
                }
            }),
            new Tile({
                name: "Turn-1",
                draw: function(x, y) { drawTrack(x, y, 'turn', 0) },
                edges: {
                    up: 0,
                    right: 1,
                    down: 1,
                    left: 0
                }
            }),
            new Tile({
                name: "Turn-2",
                draw: function(x, y) { drawTrack(x, y, 'turn', 90) },
                edges: {
                    up: 0,
                    right: 0,
                    down: 1,
                    left: 1
                }
            }),
            new Tile({
                name: "Turn-3",
                draw: function(x, y) { drawTrack(x, y, 'turn', 180) },
                edges: {
                    up: 1,
                    right: 0,
                    down: 0,
                    left: 1
                }
            }),
            new Tile({
                name: "Turn-4",
                draw: function(x, y) { drawTrack(x, y, 'turn', 270) },
                edges: {
                    up: 1,
                    right: 1,
                    down: 0,
                    left: 0
                }
            })
        ]
    })
    car = new Car()
    car2 = new Car()
    car.position = { x: 200, y: 200 }
    car2.position = { x: 150, y: 150 }
}

function drawTrack(mapx, mapy, type="straight", rotation=0) {
    scale = 128
    halfScale = scale / 2
    doubleScale = scale * 2
    push()
    translate((mapx + 0.5) * scale, (mapy + 0.5) * scale)
    rotate(rotation)
    rectMode(CENTER)
    switch (type) {
        case "turn":
            push()
            fill(color('#00AA00'))
            rect(0, 0, scale, scale)
            fill(color('#505050'))
            arc(halfScale, halfScale, doubleScale * 0.9, doubleScale * 0.9, 180, 270)
            fill(color('#00AA00'))
            arc(halfScale, halfScale, doubleScale * 0.1, doubleScale * 0.1, 180, 270)
            pop()
            break
        case "straight":
            push()
            fill(color('#00AA00'))
            rect(0, 0, scale, scale)
            fill(color('#505050'))
            rect(0, 0, scale, scale * 0.8)
            pop()
            break
    }
    pop()
}

class Car {
    constructor() {
        this.position = { x: 0, y: 0 }
        this.velocity = { x: 0, y: 0 }
        this.acceleration = { x: 0, y: 0 }
        this.direction = 0
        this.speed = 0.08
        this.reverseSpeed = 0.23
        this.turnSpeed = 3
        this.turnFactor = 0.2
        this.accelerationFriction = 0.86
        this.velocityFriction = 0.92
    }

    // Inputs should be an array (length 2) consisting of WS and AD of either -1 or 1 values.
    // ex. [-1, 0] would be just holding S and [1, 1] would be holding W and A
    update(inputs) {
        let speed = this.speed
        let reversed = false
        if (inputs[0] == -1) {
            speed = this.speed * this.reverseSpeed
            reversed = true
        }
        this.direction += inputs[1] * (this.turnSpeed * (mag(this.velocity.x, this.velocity.y) * this.turnFactor) * (reversed ? -1 : 1))
        this.direction %= 360
        if (this.direction < 0) this.direction += 360
        let radians = (this.direction - 90) * (Math.PI / 180)
        this.acceleration.x += Math.cos(radians) * inputs[0] * speed
        this.acceleration.y += Math.sin(radians) * inputs[0] * speed
        this.acceleration.x *= this.accelerationFriction
        this.acceleration.y *= this.accelerationFriction
        this.velocity.x += this.acceleration.x
        this.velocity.y += this.acceleration.y
        this.velocity.x *= this.velocityFriction
        this.velocity.y *= this.velocityFriction
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.position.x > width) this.position.x = width
        if (this.position.x < 0) this.position.x = 0
        if (this.position.y > height) this.position.y = height
        if (this.position.y < 0) this.position.y = 0
        this.draw()
    }

    draw() {
        push()
        fill(color('#FF2222'))
        translate(this.position.x - 0.5, this.position.y - 0.5)
        rotate(this.direction)
        rectMode(CENTER)
        rect(0, 0, 10, 20)
        pop()
    }
}

function draw() {
    userInputs[0] = (keyIsDown(UP_ARROW) || keyIsDown(87)) - (keyIsDown(DOWN_ARROW) || keyIsDown(83))
    userInputs[1] = (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) - (keyIsDown(LEFT_ARROW) || keyIsDown(65))
    background('#00AA00')
    drawTrack(0, 0, 'turn', 0)
    drawTrack(0, 1, 'turn', 270)
    car.update(userInputs)
    car2.update([0, 0])
    // wfc.drawAll()
}

function keyPressed() {
    if (keyCode == 32) {
        wfc.iterate()
    }
}
