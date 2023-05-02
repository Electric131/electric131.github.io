//        Ideas
// - Brown / White fur       (Seen in dirt or snow)
// - Thick / Thin Fur coat   (Get too hot or too cold)
// - Long / Short teeth      (Can eat tougher food)
// - Floppy / Short ears     (No effect on rabbits)

// Shuffle an array
function shuffleArray(arr) {
    arr.sort(() => Math.random() - 0.5);
}

// Allow an array to remove a given value
function remove(array, value) {
    let index = array.indexOf(value)
    if (index > -1) {
        array.splice(index, 1)
    }
    return array
}

function moveCentered(element, x, y) {
    size = 20 // Grid size as a multiplier, ie. div width is 800; internal is 20; if x == 20, then 'left' should be 800
    element.style.top = ((10 + y) * size + 80).toString() + "px"
    element.style.left = ((20 + x) * size + 10).toString() + "px"
}

function updateRabbit(id, rabbit=None) {
    let rabbitZone = document.getElementById("rabbit-zone")
    // Not enough rabbits yet, add more
    while (rabbitZone.children.length <= id) {
        let rabbit = document.createElement("img")
        rabbit.src = "rabbit_white.png"
        rabbit.className = "rabbit"
        rabbit.style.userSelect = "none"
        rabbitZone.appendChild(rabbit)
    }
    if (rabbit.state == "dead") {
        rabbitZone.removeChild(rabbitZone.children[id])
    }
    return rabbitZone.children[id]
}

class Rabbit {
    constructor() {
        this.state = "alive"
        this.genetics = []
        this.traits = []
        this.position = { x: 0, y: 0 }
        this.population = null
        this.mate = null
        this.food = 0
        this.health = 100
        this.temperature = 0
        this.updates = 0
        this.target = { x: 0, y: 0 }
        this.wasAtTarget = false
    }

    // Set allele at specified index
    setGenetype(index, value) {
        this.genetics[index] = value
    }

    // Set singular trait and add to genetic string
    setTrait(name, value) {
        this.traits.push([name, value])
        this.genetics.push("11") // Add two dominant genes
    }

    // Set traits of rabbit given two arrays
    setTraits(names, values) {
        for (const i in names) {
            this.setTrait(names[i], values[i])
        }
    }

    // Get the correct index in traits for a given allele
    geneticIndex(index) {
        if (this.genetics[index].includes("1")) {
            return 0
        }
        return 1
    }

    // Generate a dictionary (object) of the phenotype
    phenotypeFormat() {
        let dict = {}
        for (const i in this.genetics) {
            dict[this.traits[i][0]] = this.traits[i][1][this.geneticIndex(i)]
        }
        return dict
    }

    // Generate an array of the phenotype
    phenotypeArray() {
        let array = []
        for (const i in this.genetics) {
            array.push(this.traits[i][1][this.geneticIndex(i)])
        }
        return array
    }

    // Returns an array of the phenotype with its name and value included
    phenotypeVisual() {
        let array = []
        for (const i in this.genetics) {
            array.push(`${this.traits[i][1][this.geneticIndex(i)]} ${this.traits[i][0]}`)
        }
        return array.join(", ")
    }

    // Find mate that is close enough
    findMate() {
        if (this.mate) return false
        let nearby = this.population.findNearby(this)
        shuffleArray(nearby)
        if (nearby.length > 0) {
            if (nearby[0].mate) return false // Sad because it has no mate D: (Also adds variety in less reproduction)
            nearby[0].mate = this
            this.mate = nearby[0]
            return this.mate
        }
        console.log("Unable to find mate!")
        return false
    }

    // Remove this rabbit from the population
    delete() {
        this.state = "dead"
        this.population.rabbits = remove(this.population.rabbits, this)
    }

    atTarget(maxDist=0.2) {
        return Math.sqrt((this.target.x - this.position.x) ** 2 + (this.target.y - this.position.y) ** 2) <= maxDist
    }

    setTarget(radius) {
        let angle = Math.random() * Math.PI * 2
        this.target = {
            x: this.position.x + Math.cos(angle) * radius,
            y: this.position.y + Math.sin(angle) * radius
        }
        this.wasAtTarget = false
    }

    move(dist) {
        if (this.atTarget()) return
        let dx = this.target.x - this.position.x
        let dy = this.target.y - this.position.y
        let angle = Math.atan2(dy, dx)
        let newPos = {
            x: this.position.x + Math.cos(angle) * dist,
            y: this.position.y + Math.sin(angle) * dist
        }
        if (!(newPos.x < this.population.bounds.top_left.x || newPos.x > this.population.bounds.bottom_right.x || newPos.y > this.population.bounds.top_left.y || newPos.y < this.population.bounds.bottom_right.y)) {
            this.position = newPos
        } else {
            this.target = this.position
        }
    }

    tryMove() {
        let atTarget = this.atTarget(0.3)
        if (atTarget && !this.wasAtTarget) {
            this.updates = 0
        }
        this.wasAtTarget = atTarget
        const moveChance = Math.floor(0.5 * ((1.05) ^ this.updates)) // Determines a number >= 0, rate on a scale of 0-10 chance.
        if (atTarget && (Math.random() * 9 + 1) < moveChance) {
            this.setTarget(Math.random() * 8)
        }
    }

    // Runs an update on this rabbit, changing position, health, temperature, ect.
    update(id=0) {
        this.updates += 1
        if (this.health <= 0) this.delete()
        this.tryMove()
        this.move(0.1)
        let element = updateRabbit(id, this)
        moveCentered(element, this.position.x, this.position.y)
        let phenotypes = this.phenotypeFormat()
        if (phenotypes["fur"] == "brown") { // Is brown
            element.src = "rabbit_brown.png"
        } else {
            element.src = "rabbit_white.png"
        }
    }
}

class Population {
    constructor(options) {
        this.generation = 0
        this.time = 0
        this.lastTime = 0
        this.startTime = Date.now()
        this.running = true
        this.endReason = null
        this.untilGeneration = 0
        this.generationDelay = options.generationDelay || 5000 // Time in ms between generations
        this.overpopulation = options.overpopulation || 500 // Max rabbits before overpopulation
        this.background = options.background || 0 // Background as dirt or snow
        this.rabbits = []
        this.traits = {
            "names": [],
            "values": []
        }
        this.bounds = options.bounds || {
            top_left: { x: -20, y: 10 },
            bottom_right: { x: 20, y: -10 }
        }
    }

    // Add a trait to the simulation
    addTrait(name, values) {
        this.traits.names.push(name)
        // Values should be the name in order of dominant / recessive.
        // Example of values (tuple): ["white", "brown"]
        this.traits.values.push(values)
    }

    // Any rabbit added will have the default genes of "11" (2 dominant alleles)
    addRabbit() {
        let rabbit = new Rabbit()
        rabbit.setTraits(this.traits.names, this.traits.values)
        rabbit.population = this
        this.rabbits.push(rabbit)
        return rabbit
    }

    // Fix an alle that is in the wrong format, only fixing "01" into "10" to place dominant first.
    repairAllele(allele) {
        if (allele == "01") {
            return "10"
        }
        return allele
    }

    // One allele is it's string as "11"/"10"/"00"
    mixAlleles(allele1, allele2) {
        let i1 = Math.floor(Math.random() * 2)
        let i2 = Math.floor(Math.random() * 2)
        return this.repairAllele(allele1[i1] + allele2[i2])
    }

    // Return point between two others
    lerp(pos1, pos2, amount=0.5) {
        let xdiff = pos2.x - pos1.x
        let ydiff = pos2.y - pos1.y
        return {
            x: pos1.x + xdiff * amount,
            y: pos1.y + ydiff * amount
        }
    }

    // Return a random offspring from two parents
    breed(rabbit1, rabbit2) {
        let newGenetics = []
        for (const i in rabbit1.genetics) {
            newGenetics.push(this.mixAlleles(rabbit1.genetics[i], rabbit2.genetics[i]))
        }
        let rabbit = this.addRabbit()
        rabbit.position = this.lerp(rabbit1.position, rabbit2.position)
        rabbit.target = rabbit.position
        rabbit.genetics = newGenetics
        return rabbit
    }

    // Find rabbits that are close to another rabbit
    findNearby(rabbit, radius=10) {
        return this.rabbits.filter((searchRabbit) => {
            return Math.sqrt((rabbit.position.x - searchRabbit.position.x) ** 2 + (rabbit.position.y - searchRabbit.position.y) ** 2) <= radius && rabbit != searchRabbit
        })
    }

    // Pick mates and breed into next generation
    nextGeneration() {
        if (this.rabbits.length > this.overpopulation) {
            alert("Overpopulation reached")
            this.running = false
            this.endReason = "overpopulation"
            return false
        }
        this.generation += 1
        let bred = []
        let breeding = [...this.rabbits]
        for (const rabbit of breeding) {
            rabbit.findMate()
        }
        while (breeding.length > 1) {
            shuffleArray(breeding)
            if (breeding[0].mate != null) {
                this.breed(breeding[0], breeding[0].mate)
                breeding = remove(breeding, breeding[0].mate)
                breeding[0].mate.mate = null
                breeding[0].mate = null
            }
            breeding = remove(breeding, breeding[0])
        }
        if (this.rabbits.length > this.overpopulation) {
            this.running = false
            this.endReason = "overpopulation"
            return false
        }
        return true
    }

    update() {
        this.time = Date.now() - this.startTime
        while (this.time - this.lastTime > 50) {
            this.lastTime += 50
            // Ensures this runs once per 50ms even if the last update was x seconds ago.
            this.untilGeneration += 50
            if (this.untilGeneration >= this.generationDelay) {
                this.untilGeneration = 0
                this.nextGeneration()
            }
            document.getElementById("population").innerHTML = `Rabbit Count: ${this.rabbits.length}/${this.overpopulation}`
            let i = 0
            for (const rabbit of this.rabbits) {
                rabbit.update(i) // Update rabbit data (ex. movement, health, or energy)
                i++
            }
        }
    }
}

let sim = new Population({
    overpopulation: 100,
    generationDelay: 5000,
    background: 0, // Default snowy background
})

sim.addTrait("fur", ["white", "brown"])
sim.addTrait("coat", ["thin", "thick"])
sim.addTrait("teeth", ["short", "long"])
sim.addTrait("ears", ["short", "floppy"])

let rabbit1 = sim.addRabbit()
let rabbit2 = sim.addRabbit()

rabbit1.genetics = ["10", "10", "10", "10"]
rabbit2.genetics = ["10", "10", "10", "10"]

// Update sim and cursorInfo
setInterval(() => {
    sim.update()
    cursorInfo(cursorPos.x, cursorPos.y)
}, 50)

// Draw
function drawCursorInfo(text, x, y, offset=0) {
    let cursorinfo = document.getElementById("cursorInfo")
    if (sim.background == 0) {
        // Dirt background
        cursorinfo.style.color = "white"
    } else {
        // Snow background
        cursorinfo.style.color = "black"
    }
    cursorinfo.style.left = (x + 10) + "px"
    cursorinfo.style.top = (y - offset - 40) + "px"
    cursorinfo.innerHTML = text
}

cursorPos = { x: 0, y: 0 }

// Cursor Info
function cursorInfo(x, y) {
    // Clear
    drawCursorInfo("", x, y)
    // Display rabbit genetics
    let element = document.elementFromPoint(x, y)
    if (element.parentElement.id == "rabbit-zone") { // Element is a rabbit
        let id = Array.from(element.parentElement.children).indexOf(element)
        drawCursorInfo(`${sim.rabbits[id].genetics.join("")}<br>${sim.rabbits[id].phenotypeVisual()}`, x, y)
    }
}

document.onmousemove = (event) => {
    cursorPos = {
        x: event.clientX,
        y: event.clientY
    }
    cursorInfo(event.clientX, event.clientY)
}


//// Notes
// Mark as 0 and 1, showing dominant or recessive (ex. 11 is AA 10 is Aa 00 is aa)
// In order to mix, we have to generate combinations of each genotype into rows and columns.
// Mixing: (An example with AaBbCC x AAbbcc) No need for swapping.
//                            \/       \/
// 0 and 1 method would use 101011 x 110000 genetics
// Mix 10 and 11:
//     1   0
//  1  11  10
//  1  11  10
// Result: half if 11, other half is 10. Pick random out of results.

// Bigger Mixing:
// Using full example, 101011 x 110000 (Requires swapping of alles):
//  101011 -> 111, 111, 101, 101, 011, 011, 001, 001
//  order of binary: 000, 001, 010, 011, 100, 101, 110, 111