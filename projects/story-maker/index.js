'use strict'

let workspace = null
var waitHandler = null

// Formats a string to be safe
function safeGet(value) {
    var newVal = value.replace(/([\"\\])/g, "\\$1")
    return newVal
}

function checkVar(varName) {
    var check = varName.replace(/([A-Za-z\d_.])+/g, "")
    if (check.length > 0) throw new Error("Variable name contains invalid characters. Variables can only contain letters, numbers, as well as '.' and '_'.")
    return true
}

function start() {
    Blockly.common.defineBlocksWithJsonArray([{
        "type": "goto",
        "message0": "goto %1",
        "args0": [
            {
                "type": "field_input",
                "name": "NAME",
                "text": ""
            }
        ],
        "previousStatement": null,
        "colour": 210,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "label",
        "message0": "label %1",
        "args0": [
            {
                "type": "field_input",
                "name": "LABEL",
                "text": ""
            }
        ],
        "nextStatement": null,
        "colour": 210,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "ending",
        "message0": "ending title: %1 description: %2",
        "args0": [
            {
                "type": "field_input",
                "name": "TITLE",
                "text": ""
            },
            {
                "type": "field_input",
                "name": "DESC",
                "text": ""
            }
        ],
        "previousStatement": null,
        "colour": 105,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "choice",
        "message0": "choice %1 %2 %3",
        "args0": [
            {
                "type": "field_input",
                "name": "TEXT",
                "text": ""
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "CODE"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 105,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "wait",
        "message0": "wait %1",
        "args0": [
            {
                "type": "field_number",
                "name": "TIME",
                "value": 0,
                "min": 0,
                "precision": 0.01
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 210,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "increment",
        "message0": "%1 += %2",
        "args0": [
            {
                "type": "field_input",
                "name": "NAME",
                "text": ""
            },
            {
                "type": "field_number",
                "name": "AMOUNT",
                "value": 0,
                "precision": 0.01
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 60,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "decrement",
        "message0": "%1 -= %2",
        "args0": [
            {
                "type": "field_input",
                "name": "NAME",
                "text": ""
            },
            {
                "type": "field_number",
                "name": "AMOUNT",
                "value": 0,
                "precision": 0.01
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 60,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "set",
        "message0": "%1 = %2",
        "args0": [
            {
                "type": "field_input",
                "name": "NAME",
                "text": ""
            },
            {
                "type": "field_number",
                "name": "VALUE",
                "value": 0,
                "precision": 0.01
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 60,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "choose",
        "message0": "choose",
        "previousStatement": null,
        "colour": 105,
        "tooltip": "Present the current choice list to the user",
        "helpUrl": ""
    },
    {
        "type": "typewrite",
        "message0": "typewrite %1 at %2 seconds per character %3 Instant: %4",
        "args0": [
            {
                "type": "field_input",
                "name": "TEXT",
                "text": ""
            },
            {
                "type": "field_number",
                "name": "SPEED",
                "value": 0.05,
                "min": 0.01,
                "max": 10,
                "precision": 0.01
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "field_checkbox",
                "name": "INSTANT",
                "checked": false
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 105,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "if",
        "message0": "if var %1 %2 %3 then %4 %5",
        "args0": [
            {
                "type": "field_input",
                "name": "VARA",
                "text": ""
            },
            {
                "type": "field_dropdown",
                "name": "COMPARATOR",
                "options": [
                    [
                        "is greater than",
                        ">"
                    ],
                    [
                        "is equal to",
                        "=="
                    ],
                    [
                        "is less than",
                        "<"
                    ],
                    [
                        "is greater than or equal to",
                        ">="
                    ],
                    [
                        "is not equal to",
                        "!="
                    ],
                    [
                        "is less than or equal to",
                        "<="
                    ]
                ]
            },
            {
                "type": "field_input",
                "name": "VARB",
                "text": ""
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "IF"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 15,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "ifelse",
        "message0": "if var %1 %2 %3 then %4 %5 else %6 %7",
        "args0": [
            {
                "type": "field_input",
                "name": "VARA",
                "text": ""
            },
            {
                "type": "field_dropdown",
                "name": "COMPARATOR",
                "options": [
                    [
                        "is greater than",
                        ">"
                    ],
                    [
                        "is equal to",
                        "=="
                    ],
                    [
                        "is less than",
                        "<"
                    ],
                    [
                        "is greater than or equal to",
                        ">="
                    ],
                    [
                        "is not equal to",
                        "!="
                    ],
                    [
                        "is less than or equal to",
                        "<="
                    ]
                ]
            },
            {
                "type": "field_input",
                "name": "VARB",
                "text": ""
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "IF"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "ELSE"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 15,
        "tooltip": "",
        "helpUrl": ""
    }
    ]);
    // Create main workspace.
    workspace = Blockly.inject('blocklyDiv', {
        toolbox: document.getElementById('toolbox'),
        scrollbars: true,
        move: {
            scrollbars: {
                horizontal: true,
                vertical: true
            },
            drag: true,
            wheel: false
        },
        trashcan: true,
        zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2,
            pinch: true
        },
        grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
            snap: true
        },
        renderer: "thrasos"
    });
    load()
    javascript.javascriptGenerator.forBlock['goto'] = function (block) {
        return `API_goto("${safeGet(block.getFieldValue('NAME'))}"); return true; `
    }
    javascript.javascriptGenerator.forBlock['ending'] = function (block) {
        return `API_ending("${safeGet(block.getFieldValue('TITLE'))}", "${safeGet(block.getFieldValue('DESC'))}"); return true; `
    }
    javascript.javascriptGenerator.forBlock['choice'] = function (block) {
        return `API_addChoice("${safeGet(block.getFieldValue('TEXT'))}", "${safeGet(javascript.javascriptGenerator.statementToCode(block, 'CODE').trim())}"); `
    }
    javascript.javascriptGenerator.forBlock['wait'] = function (block) {
        return `if (await API_pause(${block.getFieldValue('TIME')})) return false; `
    }
    javascript.javascriptGenerator.forBlock['increment'] = function (block) {
        checkVar(block.getFieldValue('NAME'))
        return `if (typeof ${safeGet(block.getFieldValue('NAME'))} == "undefined") { var ${safeGet(block.getFieldValue('NAME'))} = 0 }; ${safeGet(block.getFieldValue('NAME'))} += ${block.getFieldValue('AMOUNT')}; `
    }
    javascript.javascriptGenerator.forBlock['decrement'] = function (block) {
        checkVar(block.getFieldValue('NAME'))
        return `if (typeof ${safeGet(block.getFieldValue('NAME'))} == "undefined") { var ${safeGet(block.getFieldValue('NAME'))} = 0 }; ${safeGet(block.getFieldValue('NAME'))} -= ${block.getFieldValue('AMOUNT')}; `
    }
    javascript.javascriptGenerator.forBlock['set'] = function (block) {
        checkVar(block.getFieldValue('NAME'))
        return `var ${safeGet(block.getFieldValue('NAME'))} = ${block.getFieldValue('VALUE')}; `
    }
    javascript.javascriptGenerator.forBlock['typewrite'] = function (block) {
        return `if (await API_typewrite("${safeGet(block.getFieldValue('TEXT'))}", ${block.getFieldValue('SPEED')}, ${block.getFieldValue('INSTANT') == "TRUE"})) return false; `
    }
    javascript.javascriptGenerator.forBlock['choose'] = function (block) {
        return `API_loadChoices(); `
    }
    javascript.javascriptGenerator.forBlock['if'] = function (block) {
        checkVar(block.getFieldValue('VARA'))
        checkVar(block.getFieldValue('VARB'))
        if (block.getFieldValue('VARA').length == 0 || block.getFieldValue('VARB').length == 0) throw new Error("If block requires two variable names to compare.")
        return `if (typeof ${safeGet(block.getFieldValue('VARA'))} == "undefined") { var ${safeGet(block.getFieldValue('VARA'))} = 0 }; if (typeof ${safeGet(block.getFieldValue('VARB'))} == "undefined") { var ${safeGet(block.getFieldValue('VARB'))} = 0 }; if (${safeGet(block.getFieldValue('VARA'))} ${block.getFieldValue('COMPARATOR')} ${safeGet(block.getFieldValue('VARB'))}) { ${javascript.javascriptGenerator.statementToCode(block, 'IF').trim()} }; `
    }
    javascript.javascriptGenerator.forBlock['ifelse'] = function (block) {
        checkVar(block.getFieldValue('VARA'))
        checkVar(block.getFieldValue('VARB'))
        if (block.getFieldValue('VARA').length == 0 || block.getFieldValue('VARB').length == 0) throw new Error("If block requires two variable names to compare.")
        return `if (typeof ${safeGet(block.getFieldValue('VARA'))} == "undefined") { var ${safeGet(block.getFieldValue('VARA'))} = 0 }; if (typeof ${safeGet(block.getFieldValue('VARB'))} == "undefined") { var ${safeGet(block.getFieldValue('VARB'))} = 0 }; if (${safeGet(block.getFieldValue('VARA'))} ${block.getFieldValue('COMPARATOR')} ${safeGet(block.getFieldValue('VARB'))}) { ${javascript.javascriptGenerator.statementToCode(block, 'IF').trim()} } else { ${javascript.javascriptGenerator.statementToCode(block, 'ELSE').trim()} }; `
    }
}

function save() {
    localStorage.setItem("storyMakerSave", JSON.stringify(Blockly.serialization.workspaces.save(Blockly.getMainWorkspace())))
}

function reset() {
    Blockly.serialization.workspaces.load(JSON.parse('{"blocks":{"languageVersion":0,"blocks":[{"type":"label","id":")ZtT1];8N}vN3OR.(71b","x":190,"y":50,"fields":{"LABEL":"start"},"movable":false,"editable":false,"deletable":false}]}}'), Blockly.getMainWorkspace())
}

function load() {
    if (!localStorage.getItem("storyMakerSave") || JSON.parse(localStorage.getItem("storyMakerSave")).length == 0) {
        reset()
    } else {
        Blockly.serialization.workspaces.load(JSON.parse(localStorage.getItem("storyMakerSave")), Blockly.getMainWorkspace());
    }
}

function checkChanges() {
    if (!localStorage.getItem("storyMakerSave")) { return false }
    if (localStorage.getItem("storyMakerSave") == JSON.stringify(Blockly.serialization.workspaces.save(Blockly.getMainWorkspace()))) {
        return undefined
    }
    return false
}

var headless = new Blockly.Workspace()

function run() {
    document.getElementById("run").style.visibility = 'visible'
    document.getElementById("buttonBar").style.visibility = 'hidden'
    document.getElementById("blocklyDiv").style.visibility = 'hidden'
    choices = []
    labels = {}
    headless.clear()
    document.getElementById("ending-title").innerHTML = ""
    document.getElementById("typewriter-show").innerHTML = ""
    document.getElementById("choices").innerHTML = ""
    var json = Blockly.serialization.workspaces.save(Blockly.getMainWorkspace())
    // Reload the workspace to unselect any blocks
    Blockly.serialization.workspaces.load(json, Blockly.getMainWorkspace());
    try {
        var blocks = json.blocks.blocks
        var topBlocks = blocks.slice()
        for (const block of topBlocks) {
            // Is the top block a label
            if (block.type == "label" && block.fields.LABEL != "" && typeof block.next == "object") {
                var temp = JSON.parse(JSON.stringify(json))
                temp.blocks.blocks = [block.next.block]
                Blockly.serialization.workspaces.load(temp, headless)
                API_defLabel(block.fields.LABEL, javascript.javascriptGenerator.workspaceToCode(headless))
            }
        }
        API_goto("start")
        // eval("(async () => {" + code + "})()")
        // eval(javascript.javascriptGenerator.workspaceToCode(Blockly.getMainWorkspace()))
    } catch (error) {
        alert(error)
        console.error(error)
        stopCode()
    }
}

function downloadFile() {
    var element = document.getElementById("download")
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(btoa(JSON.stringify(Blockly.serialization.workspaces.save(Blockly.getMainWorkspace())))));
    element.setAttribute('download', 'save.story');
    element.click();
}

async function pickFile() {
    const [handler] = await showOpenFilePicker({
        excludeAcceptAllOption: true,
        types: [
            {
                description: "Story Files",
                accept: {
                    "text/plain": [".story"]
                }
            }
        ]
    })
    const file = await handler.getFile()
    const text = await file.text()
    Blockly.serialization.workspaces.load(JSON.parse(atob(text)), Blockly.getMainWorkspace());
}

function stopCode() {
    document.getElementById("run").style.visibility = 'hidden'
    document.getElementById("buttonBar").style.visibility = 'visible'
    document.getElementById("blocklyDiv").style.visibility = 'visible'
    if (waitHandler) {
        waitHandler(false) // Tell the wait handler that the last check failed
    }
    waitHandler = null
}

const delay = ms => new Promise(res => setTimeout(res, ms));

// API Calls
var choices = []
var labels = {}
function API_defLabel(name, inner) {
    if (Object.keys(labels).includes(name)) {
        throw new Error(`Label '${name}' already exists.`)
    }
    // Inner is assumed to be the code to run when this label is called.
    labels[name] = inner
}

function API_clearChoices() {
    choices.length = 0
}

function API_addChoice(text, code) {
    choices.push({ text, code })
}

function API_ending(title, description) {
    document.getElementById("ending-title").innerHTML = title
    document.getElementById("typewriter-show").innerHTML = description
}

async function API_typewrite(text, speed, isInstant) {
    document.getElementById("typewriter-show").innerHTML = ""
    if (isInstant) { document.getElementById("typewriter-show").innerHTML = text; return false }
    for (const char of text.split("")) {
        document.getElementById("typewriter-show").innerHTML = document.getElementById("typewriter-show").innerHTML + char
        var res = await Promise.race([delay(speed * 1000), stopCheck()]) // Wait x seconds or until the program is stopped
        if (res == false) {
            return true
        }
    }
    return false
}

function stopCheck() {
    return new Promise(res => {
        waitHandler = res
    })
}

async function API_pause(secs) {
    // Will return true if the delay was haulted by the program stopping
    var res = await Promise.race([delay(secs * 1000), stopCheck()]) // Wait x seconds or until the program is stopped
    if (res == false) {
        return true
    }
    return false
}

function API_goto(name) {
    if (!Object.keys(labels).includes(name)) {
        throw new Error(`Unknown label name '${name}'`)
    }
    console.log(`Running Code: ${labels[name]}`)
    eval("(async () => {" + labels[name] + "})()")
}

function API_clickChoice(id) {
    if (!(choices[id] && choices[id].code)) {
        return false // Signal a failure
    }
    var code = choices[id].code
    API_clearChoices()
    eval("(async () => {" + code + "})()")
    return true
}

function API_clearChoices() {
    document.getElementById("choices").innerHTML = ""
    choices = []
}

function API_loadChoices() {
    var i = 0
    for (var choice of choices) {
        var button = document.createElement("button")
        button.style = "height:22px; width:20%; overflow:hidden"
        button.innerHTML = choice.text
        button.setAttribute("name", i)
        button.onclick = function () {
            API_clickChoice(this.name)
        }
        document.getElementById("choices").appendChild(button)
        i++
    }
}
