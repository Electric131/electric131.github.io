
let images = []
let wfc
let scale = 20
let width = 68
let height = 35
// Keep 16 | 85 | 45
// 20 | 68 | 35 is fast and looks nice
function preload() {
    const imageList = ["plains", "forest", "dense_forest", "beach", "shallow_water", "intermediate_ocean", "deep_ocean"]
    for (const name of imageList) {
        images.push(loadImage(`assets/${name}.png`))
    }
}

function loadPreset(id) {
    const presets = {
        "forest": [
            new Tile({
                name: "Plains",
                draw: function(x, y) { render(0, x, y) },
                edges: {
                    up: ["plains", "forest"],
                    down: ["plains", "forest"],
                    left: ["plains", "forest"],
                    right: ["plains", "forest"]
                },
                type: "plains",
                weight: 30
            }),
            new Tile({
                name: "Forest",
                draw: function(x, y) { render(1, x, y) },
                edges: {
                    up: ["forest", "plains", "dense_forest"],
                    down: ["forest", "plains", "dense_forest"],
                    left: ["forest", "plains", "dense_forest"],
                    right: ["forest", "plains", "dense_forest"]
                },
                type: "forest",
                weight: 10
            }),
            new Tile({
                name: "Dense Forest",
                draw: function(x, y) { render(2, x, y) },
                edges: {
                    up: ["dense_forest", "forest"],
                    down: ["dense_forest", "forest"],
                    left: ["dense_forest", "forest"],
                    right: ["dense_forest", "forest"]
                },
                type: "dense_forest",
                weight: 10
            })
        ],
        "island": [
            new Tile({
                name: "Plains",
                draw: function(x, y) { render(0, x, y) },
                edges: {
                    up: ["plains", "forest", "beach"],
                    down: ["plains", "forest", "beach"],
                    left: ["plains", "forest", "beach"],
                    right: ["plains", "forest", "beach"]
                },
                type: "plains",
                weight: 20
            }),
            new Tile({
                name: "Forest",
                draw: function(x, y) { render(1, x, y) },
                edges: {
                    up: ["forest", "plains", "dense_forest"],
                    down: ["forest", "plains", "dense_forest"],
                    left: ["forest", "plains", "dense_forest"],
                    right: ["forest", "plains", "dense_forest"]
                },
                type: "forest",
                weight: 10
            }),
            new Tile({
                name: "Dense Forest",
                draw: function(x, y) { render(2, x, y) },
                edges: {
                    up: ["dense_forest", "forest"],
                    down: ["dense_forest", "forest"],
                    left: ["dense_forest", "forest"],
                    right: ["dense_forest", "forest"]
                },
                type: "dense_forest",
                weight: 5
            }),
            new Tile({
                name: "Beach",
                draw: function(x, y) { render(3, x, y) },
                edges: {
                    up: ["beach", "plains", "shallow_water"],
                    down: ["beach", "plains", "shallow_water"],
                    left: ["beach", "plains", "shallow_water"],
                    right: ["beach", "plains", "shallow_water"]
                },
                type: "beach",
                weight: 15
            }),
            new Tile({
                name: "Shallow Water",
                draw: function(x, y) { render(4, x, y) },
                edges: {
                    up: ["shallow_water", "intermediate_ocean", "beach"],
                    down: ["shallow_water", "intermediate_ocean", "beach"],
                    left: ["shallow_water", "intermediate_ocean", "beach"],
                    right: ["shallow_water", "intermediate_ocean", "beach"]
                },
                type: "shallow_water",
                weight: 15
            }),
            new Tile({
                name: "Intermediate Ocean",
                draw: function(x, y) { render(5, x, y) },
                edges: {
                    up: ["shallow_water", "intermediate_ocean", "deep_ocean"],
                    down: ["shallow_water", "intermediate_ocean", "deep_ocean"],
                    left: ["shallow_water", "intermediate_ocean", "deep_ocean"],
                    right: ["shallow_water", "intermediate_ocean", "deep_ocean"]
                },
                type: "intermediate_ocean",
                weight: 10
            }),
            new Tile({
                name: "Deep Ocean",
                draw: function(x, y) { render(6, x, y) },
                edges: {
                    up: ["intermediate_ocean", "deep_ocean"],
                    down: ["intermediate_ocean", "deep_ocean"],
                    left: ["intermediate_ocean", "deep_ocean"],
                    right: ["intermediate_ocean", "deep_ocean"]
                },
                type: "deep_ocean",
                weight: 10
            })
        ]
    }
    return presets[id]
}

function setup() {
    createCanvas(scale*width, scale*height)
    angleMode(DEGREES)
    noStroke()
    frameRate(120)
    wfc = new WaveFunction({
        tiles: loadPreset("island"),
        width: width,
        height: height
    })
    wfc.beginCollapse()
}

function render(index, x, y) {
    image(images[index], x*scale, y*scale, scale, scale, 0, 0, 16, 16)
}

function attempt() {
    if (!collapsed && wfc.iterate()) {
        console.log("Collapsed!")
        collapsed = true
    }
}

let collapsed = false
function draw() {
    background('#AAAAAA')
    for (var i = 0; i < parseInt(document.getElementById("speed").value); i++) {
        attempt()
    }
    wfc.drawAll()
}

function keyPressed(event) {
    if (event.key == "r") {
        wfc.resetCells()
        wfc.beginCollapse()
        collapsed = false
    }
}
