// Ideas
// - Brown / White
// - Thick / Thin Fur coat
// - Long / Short teeth
// - Floppy / Short ears

class Rabbit {
    constructor() {
        this.genetics = {}
        this.position = {x: 0, y: 0}
        this.mate = null
    }

    set_trait(name, value) {
        this.genetics
    }
}

class Population {
    constructor() {
        this.generation = 0
        this.rabbits = []
    }

    add_trait(name) {

    }

    add_rabbit(genetics) {
        let rabbit = new Rabbit()
        rabbit.set_trait("heee", "d")
        this.rabbits.push(rabbit)
    }
}


let rabbit = new Rabbit()
console.log(rabbit.genetics)