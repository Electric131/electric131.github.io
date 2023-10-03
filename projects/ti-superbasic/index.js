
'use strict';

const TIBasic = new Blockly.Generator('TIBasic');
const Order = javascript.Order;

TIBasic.scrub_ = function (block, code, thisOnly) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    if (nextBlock && !thisOnly) {
        return code + "\n" + TIBasic.blockToCode(nextBlock);
    }
    return code;
};

TIBasic.finish = function (code) {
    Object.values(vars).reverse().forEach((val) => {
        code = `0->${val}\n` + code;
    });
    return `Send("CONNECT RV")\nSend("SET RV.GRID.ORIGIN")\nSend("SET RV.GYRO")\n0->A\n0->D\n` + code;
};

let workspace = null;
let vars = {};
const recurDepth = 5000;

class Builder {
    constructor(options) {
        this.clear();
        this.loadConfig(options);
    }

    clear() {
        this.current = [];
    }

    loadConfig(options) {
        this.options = {
            defaultEnding: "",
            defaultStart: "",
            defaultNeeded: true
        };
        for (const k of Object.keys(this.options)) {
            if (options[k]) { this.options[k] = options[k]; }
        }
    }

    build(text, options = {}) {
        if (typeof options.needed == "undefined") { options.needed = this.options.defaultNeeded; }
        if (typeof options.ending == "undefined") { options.ending = this.options.defaultEnding; }
        if (typeof options.start == "undefined") { options.start = this.options.defaultStart; }
        // Needed only adds start and ending if they are not the first or last element, respectively.
        this.current.push({ content: text, ending: options.ending, start: options.start, needed: options.needed });
    }

    finalize() {
        var final = [];
        var i = 0;
        this.current.forEach((val) => {
            i++;
            var add = val.start + val.content + val.ending;
            if (val.needed) {
                add = "";
                if (i == 1) { add = val.start; }
                add += val.content;
                if (i != this.current.length) { add += val.ending; }
            }
            final.push(add);
        });
        return final.join("");
    }
}

// Gets the ID of a variable
function getVar(name) {
    if (vars[name]) { return vars[name]; }
    // ABCD are exclusive to constants
    var letters = "EFHIJKLMNOPQSTUVWXYZ".split("");
    // Calculator is too limited, so it's only A-Z and I like nicer numbers (plus gives space for the constants)
    if (Object.keys(vars).length >= 20) { error("Variable limit reached! (20 Variables)"); }
    // Variable names "i____" are reserved for INTERNALS and NEVER accessible by user inputs.
    vars[name] = `${letters[Object.keys(vars).length]}`;
    return vars[name];
}

function start() {
    Blockly.common.defineBlocksWithJsonArray([{
        "type": "pause",
        "message0": "wait for %1 seconds",
        "args0": [
            {
                "type": "input_value",
                "name": "TIME",
                "check": "Number"
            }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Pauses execution for the given time.",
        "helpUrl": ""
    },
    {
        "type": "start",
        "message0": "start",
        "nextStatement": null,
        "colour": 60,
        "tooltip": "Where the program will begin execution.",
        "helpUrl": ""
    },
    {
        "type": "repeat_i",
        "message0": "for %1 in range %2 to %3 by %4 do %5",
        "args0": [
            {
                "type": "field_variable",
                "name": "VAR",
                "variable": "i"
            },
            {
                "type": "input_value",
                "name": "FROM",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "TO",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "BY",
                "check": "Number"
            },
            {
                "type": "input_statement",
                "name": "DO"
            }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Repeats between two values, counting by the other value and gives the current index number in the variable.",
        "helpUrl": ""
    },
    {
        "type": "repeat_while",
        "message0": "repeat %1 %2 %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "MODE",
                "options": [
                    [
                        "while",
                        "While"
                    ],
                    [
                        "until",
                        "Repeat"
                    ]
                ]
            },
            {
                "type": "input_value",
                "name": "BOOL",
                "check": "Boolean"
            },
            {
                "type": "input_statement",
                "name": "DO"
            }
        ],
        "inputsInline": false,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Repeats while or until a given condition is met.",
        "helpUrl": ""
    },
    {
        "type": "logic_compare",
        "message0": "%1 %2 %3",
        "args0": [
            {
                "type": "input_value",
                "name": "VAL1",
                "check": ["Number", "String"]
            },
            {
                "type": "field_dropdown",
                "name": "OP",
                "options": [
                    [
                        "==",
                        "="
                    ],
                    [
                        ">",
                        ">"
                    ],
                    [
                        "<",
                        "<"
                    ],
                    [
                        ">=",
                        ">="
                    ],
                    [
                        "<=",
                        "<="
                    ]
                ]
            },
            {
                "type": "input_value",
                "name": "VAL2",
                "check": ["Number", "String"]
            }
        ],
        "inputsInline": true,
        "output": "Boolean",
        "colour": 195,
        "tooltip": "Compares two numbers with the chosen comparator.",
        "helpUrl": ""
    },
    {
        "type": "math_operator",
        "message0": "%1 %2 %3",
        "args0": [
            {
                "type": "input_value",
                "name": "VAR1",
                "check": "Number"
            },
            {
                "type": "field_dropdown",
                "name": "OP",
                "options": [
                    [
                        "+",
                        "+"
                    ],
                    [
                        "-",
                        "-"
                    ],
                    [
                        "/",
                        "/"
                    ],
                    [
                        "*",
                        "*"
                    ],
                    [
                        "^",
                        "^"
                    ],
                    [
                        "mod",
                        "mod"
                    ]
                ]
            },
            {
                "type": "input_value",
                "name": "VAR2",
                "check": "Number"
            }
        ],
        "inputsInline": true,
        "output": "Number",
        "colour": 60,
        "tooltip": "Performs a mathematical operation on the given numbers.",
        "helpUrl": ""
    },
    {
        "type": "logic_not",
        "message0": "not %1",
        "args0": [
            {
                "type": "input_value",
                "name": "BOOL",
                "check": "Boolean"
            }
        ],
        "output": "Boolean",
        "colour": 195,
        "tooltip": "Inverts the given boolean.",
        "helpUrl": ""
    },
    {
        "type": "logic_boolcomp",
        "message0": "%1 %2 %3",
        "args0": [
            {
                "type": "input_value",
                "name": "VAR1",
                "check": "Boolean"
            },
            {
                "type": "field_dropdown",
                "name": "OP",
                "options": [
                    [
                        "and",
                        "and"
                    ],
                    [
                        "or",
                        "or"
                    ],
                    [
                        "xor",
                        "xor"
                    ]
                ]
            },
            {
                "type": "input_value",
                "name": "VAR2",
                "check": "Boolean"
            }
        ],
        "inputsInline": true,
        "output": "Boolean",
        "colour": 195,
        "tooltip": "Compares too boolean values with the chosen comparator.",
        "helpUrl": ""
    },
    {
        "type": "text_concat",
        "message0": "concat %1 with %2",
        "args0": [
            {
                "type": "input_value",
                "name": "VAL1"
            },
            {
                "type": "input_value",
                "name": "VAL2"
            }
        ],
        "inputsInline": true,
        "output": "String",
        "colour": 165,
        "tooltip": "Joins two values together into a string.",
        "helpUrl": ""
    },
    {
        "type": "disp",
        "message0": "display %1",
        "args0": [
            {
                "type": "input_value",
                "name": "TEXT"
            }
        ],
        "inputsInline": false,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 180,
        "tooltip": "Displays the given value to the user.",
        "helpUrl": ""
    },
    {
        "type": "input",
        "message0": "input into %1 with prompt %2",
        "args0": [
            {
                "type": "field_variable",
                "name": "VAR",
                "variable": "value"
            },
            {
                "type": "input_value",
                "name": "TEXT",
                "check": "String"
            }
        ],
        "inputsInline": false,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 180,
        "tooltip": "Displays a message and stores the result into the chosen variable.",
        "helpUrl": ""
    },
    {
        "type": "rover_move",
        "message0": "move %1 for %2 seconds",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "DIR",
                "options": [
                    [
                        "forward",
                        "FORWARD"
                    ],
                    [
                        "backward",
                        "BACKWARD"
                    ]
                ]
            },
            {
                "type": "input_value",
                "name": "TIME",
                "check": "Number"
            }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 225,
        "tooltip": "Tells the rover to move for a given amount of time. (Runs asyncronously)",
        "helpUrl": ""
    },
    {
        "type": "rover_turn",
        "message0": "turn %1 by %2 degrees",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "DIR",
                "options": [
                    [
                        "left",
                        "LEFT"
                    ],
                    [
                        "right",
                        "RIGHT"
                    ]
                ]
            },
            {
                "type": "input_value",
                "name": "DEG",
                "check": "Number"
            }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 225,
        "tooltip": "Tells the rover to turn a specified amount of degrees. (Runs asyncronously)",
        "helpUrl": ""
    },
    {
        "type": "color",
        "message0": "color %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "COLOR",
                "options": [
                    [
                        "Red (1)",
                        "1"
                    ],
                    [
                        "Green (2)",
                        "2"
                    ],
                    [
                        "Blue (3)",
                        "3"
                    ],
                    [
                        "Cyan (4)",
                        "4"
                    ],
                    [
                        "Magenta (5)",
                        "5"
                    ],
                    [
                        "Yellow (6)",
                        "6"
                    ],
                    [
                        "Black (7)",
                        "7"
                    ],
                    [
                        "White (8)",
                        "8"
                    ],
                    [
                        "Gray (9)",
                        "9"
                    ]
                ]
            }
        ],
        "inputsInline": true,
        "output": "Number",
        "colour": 330,
        "tooltip": "A color value, mainly used for rover direct color.",
        "helpUrl": ""
    },
    {
        "type": "rover_read",
        "message0": "read %1 and store into %2",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "TYPE",
                "options": [
                    [
                        "ranger",
                        "RANGER"
                    ],
                    [
                        "direct color",
                        "COLORINPUT"
                    ],
                    [
                        "raw color (red)",
                        "COLORINPUT.RED"
                    ],
                    [
                        "raw color (green)",
                        "COLORINPUT.GREEN"
                    ],
                    [
                        "raw color (blue)",
                        "COLORINPUT.BLUE"
                    ],
                    [
                        "raw color (gray)",
                        "COLORINPUT.GRAY"
                    ],
                    [
                        "gyroscope",
                        "GYRO"
                    ]
                ]
            },
            {
                "type": "field_variable",
                "name": "VAR",
                "variable": "sensor"
            }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 225,
        "tooltip": "Reads a sensor value from the rover at the current time and saves the result to the chosen variable.",
        "helpUrl": ""
    },
    {
        "type": "to_string",
        "message0": "toString %1",
        "args0": [
            {
                "type": "input_value",
                "name": "NUM",
                "check": "Number"
            }
        ],
        "inputsInline": true,
        "output": "String",
        "colour": 75,
        "tooltip": "Converts a number into a string.",
        "helpUrl": ""
    }]);
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
    load();
    TIBasic.forBlock['controls_if'] = function (block) {
        var builder = new Builder({ defaultEnding: "\n" });
        var innerCode = "";
        block.inputList.forEach((val) => {
            if (val.name.includes("IF")) {
                var cond = TIBasic.valueToCode(block, val.name, Order.NONE);
                if (val.name == "IF0") { builder.build(`If ${cond == "" ? "0" : cond}:Then`); }
                else { builder.build(`Else:If ${cond == "" ? "0" : cond}:Then`); }
            } else if (val.name.includes("DO")) { innerCode = TIBasic.statementToCode(block, val.name); builder.build(`${innerCode.length > 0 ? innerCode : ""}`, { ending: innerCode.length > 0 ? "\n" : "" }); }
            else if (val.name == "ELSE") { innerCode = TIBasic.statementToCode(block, val.name); builder.build(`Else\n${innerCode.length > 0 ? innerCode : ""}`, { ending: innerCode.length > 0 ? "\n" : "" }); }
        });
        builder.build("End", { needed: false, ending: "" });
        return builder.finalize();
    };
    TIBasic.forBlock['logic_compare'] = function (block) {
        return [`${TIBasic.valueToCode(block, "VAL1", Order.ATOMIC)}${block.getFieldValue("OP") || "="}${TIBasic.valueToCode(block, "VAL2", Order.ATOMIC)}`, Order.RELATIONAL];
    };
    TIBasic.forBlock['repeat_i'] = function (block) {
        var builder = new Builder({ defaultEnding: "\n" });
        builder.build(`D+1->D\nIf D=1:Then\n0->A\nEnd\nFor(${getVar(Blockly.Variables.getVariable(Blockly.getMainWorkspace(), block.getFieldValue("VAR")).name)},${TIBasic.valueToCode(block, "FROM", Order.ATOMIC) || 0},${TIBasic.valueToCode(block, "TO", Order.ATOMIC) || 0},${TIBasic.valueToCode(block, "BY", Order.ATOMIC) || 1})`);
        var innerCode = TIBasic.statementToCode(block, "DO");
        builder.build(`A+1->A\nIf A>${recurDepth}:Then\nStop\nEnd${innerCode.length > 0 ? "\n" + innerCode : ""}`);
        builder.build("End\nD-1->D", { needed: false, ending: "" });
        return builder.finalize();
    };
    TIBasic.forBlock['repeat_while'] = function (block) {
        var builder = new Builder({ defaultEnding: "\n" });
        var cond = TIBasic.valueToCode(block, "BOOL", Order.NONE);
        builder.build(`D+1->D\nIf D=1:Then\n0->A\nEnd\n${block.getFieldValue("MODE")} ${cond == null ? "0" : cond}`);
        var innerCode = TIBasic.statementToCode(block, "DO");
        builder.build(`A+1->A\nIf A>${recurDepth}:Then\nStop\nEnd${innerCode.length > 0 ? "\n" + innerCode : ""}`);
        builder.build("End\nD-1->D", { needed: false, ending: "" });
        return builder.finalize();
    };
    TIBasic.forBlock['math_number'] = function (block) {
        return [block.getFieldValue("NUM").toString(), Order.ATOMIC];
    };
    TIBasic.forBlock['logic_boolean'] = function (block) {
        return [block.getFieldValue("BOOL").toLowerCase(), Order.ATOMIC];
    };
    TIBasic.forBlock['logic_boolcomp'] = function (block) {
        var orders = {
            "or": Order.LOGICAL_OR,
            "and": Order.LOGICAL_AND,
            "xor": Order.BITWISE_XOR
        };
        var operation = block.getFieldValue("OP");
        return [`${TIBasic.valueToCode(block, "VAR1", Order.ATOMIC)} ${operation} ${TIBasic.valueToCode(block, "VAR2", Order.ATOMIC)}`, orders[operation]];
    };
    TIBasic.forBlock['logic_not'] = function (block) {
        return [`not ${TIBasic.valueToCode(block, "BOOL", Order.ATOMIC)}`, Order.LOGICAL_NOT];
    };
    TIBasic.forBlock['math_operator'] = function (block) {
        var orders = {
            "+": Order.ADDITION,
            "-": Order.SUBTRACTION,
            "*": Order.MULTIPLICATION,
            "/": Order.DIVISION,
            "^": Order.EXPONENTIATION,
            "mod": Order.MODULUS
        };
        var operator = block.getFieldValue("OP");
        if (operator != "mod") {
            return [`${TIBasic.valueToCode(block, "VAR1", Order.ATOMIC) || 0} ${operator} ${TIBasic.valueToCode(block, "VAR2", Order.ATOMIC) || 0}`, orders[operator]];
        } else {
            return [`mod(${TIBasic.valueToCode(block, "VAR1", Order.ATOMIC) || 0}, ${TIBasic.valueToCode(block, "VAR2", Order.ATOMIC) || 0})`, orders[operator]];
        }
    };
    TIBasic.forBlock['text'] = function (block) {
        return [`"${block.getFieldValue("TEXT").replace(/([\\\"])/gm, "\\$1}") || ''}"`, Order.ATOMIC];
    };
    TIBasic.forBlock['to_string'] = function (block) {
        return [`toString(${TIBasic.valueToCode(block, "NUM", Order.NONE)})`, Order.ATOMIC];
    };
    TIBasic.forBlock['color'] = function (block) {
        return [`${block.getFieldValue("COLOR") || 0}`, Order.ATOMIC];
    };
    TIBasic.forBlock['disp'] = function (block) {
        return `Disp ${TIBasic.valueToCode(block, "TEXT", Order.NONE)}`;
    };
    TIBasic.forBlock['pause'] = function (block) {
        return `Wait ${TIBasic.valueToCode(block, "TIME", Order.NONE)}`;
    };
    TIBasic.forBlock['input'] = function (block) {
        return `Input ${TIBasic.valueToCode(block, "TEXT", Order.NONE)}, ${getVar(Blockly.Variables.getVariable(Blockly.getMainWorkspace(), block.getFieldValue("VAR")).name)}`;
    };
    TIBasic.forBlock['text_concat'] = function (block) {
        return [`${TIBasic.valueToCode(block, "VAL1", Order.ATOMIC) || '""'} + ${TIBasic.valueToCode(block, "VAL2", Order.ATOMIC) || '""'}`, 7];
    };
    TIBasic.forBlock['rover_move'] = function (block) {
        return `Send("RV ${block.getFieldValue("DIR")} TIME "+toString(${TIBasic.valueToCode(block, "TIME", Order.NONE) || 0}))`;
    };
    TIBasic.forBlock['rover_turn'] = function (block) {
        return `Send("RV ${block.getFieldValue("DIR")} "+toString(${TIBasic.valueToCode(block, "DEG", Order.NONE) || 0}))`;
    };
    TIBasic.forBlock['logic_boolean'] = function (block) {
        return [`${block.getFieldValue("BOOL") == "TRUE" ? '1' : '0'}`, Order.ATOMIC];
    };
    TIBasic.forBlock['rover_read'] = function (block) {
        var variable = Blockly.Variables.getVariable(Blockly.getMainWorkspace(), block.getFieldValue("VAR"));
        var saveTypes = {
            "RANGER": "R",
            "COLORINPUT": "C",
            "COLORINPUT.RED": "R",
            "COLORINPUT.GREEN": "G",
            "COLORINPUT.BLUE": "B",
            "COLORINPUT.GRAY": "G",
            "GYRO": "G"
        };
        return `Send("READ RV.${block.getFieldValue("TYPE")}")\nGet(${saveTypes[block.getFieldValue("TYPE")]})\n${saveTypes[block.getFieldValue("TYPE")]}->${getVar(variable.name)}`;
    };
    TIBasic.forBlock['variables_set'] = function (block) {
        var variable = Blockly.Variables.getVariable(Blockly.getMainWorkspace(), block.getFieldValue("VAR"));
        return `${TIBasic.valueToCode(block, "VALUE", Order.NONE)}->${getVar(variable.name)}`;
    };
    TIBasic.forBlock['math_change'] = function (block) {
        var variable = Blockly.Variables.getVariable(Blockly.getMainWorkspace(), block.getFieldValue("VAR"));
        return `${TIBasic.valueToCode(block, "DELTA", Order.NONE)}+${getVar(variable.name)}->${getVar(variable.name)}`;
    };
    TIBasic.forBlock['variables_get'] = function (block) {
        var variable = Blockly.Variables.getVariable(Blockly.getMainWorkspace(), block.getFieldValue("VAR"));
        return [getVar(variable.name), Order.NONE];
    };
}

function debug() {
    var save = JSON.stringify(Blockly.serialization.workspaces.save(Blockly.getMainWorkspace()));
    console.log(save);
}

function save() {
    localStorage.setItem("tiSBRoverSave", JSON.stringify(Blockly.serialization.workspaces.save(Blockly.getMainWorkspace())));
}

function reset() {
    Blockly.serialization.workspaces.load(JSON.parse('{"blocks":{"languageVersion":0,"blocks":[{"type":"start","id":")ZtT1];8N}vN3OR.(71b","x":190,"y":50,"fields":{},"movable":false,"editable":false,"deletable":false}]}}'), Blockly.getMainWorkspace());
}

function load() {
    if (!localStorage.getItem("tiSBRoverSave") || JSON.parse(localStorage.getItem("tiSBRoverSave")).length == 0) {
        reset();
    } else {
        Blockly.serialization.workspaces.load(JSON.parse(localStorage.getItem("tiSBRoverSave")), Blockly.getMainWorkspace());
    }
}

function checkChanges() {
    if (!localStorage.getItem("tiSBRoverSave")) { return false; }
    if (localStorage.getItem("tiSBRoverSave") == JSON.stringify(Blockly.serialization.workspaces.save(Blockly.getMainWorkspace()))) {
        return undefined;
    }
    return false;
}

var headless = new Blockly.Workspace();

function convert() {
    headless.clear();
    vars = {};
    var json = Blockly.serialization.workspaces.save(Blockly.getMainWorkspace());
    // Reload the workspace to unselect any blocks
    Blockly.serialization.workspaces.load(json, Blockly.getMainWorkspace());
    try {
        var blocks = json.blocks.blocks;
        var topBlocks = blocks.slice();
        for (const block of topBlocks) {
            // Is the top block the start block
            if (block.type == "start" && typeof block.next == "object") {
                var temp = JSON.parse(JSON.stringify(json));
                temp.blocks.blocks = [block.next.block];
                Blockly.serialization.workspaces.load(temp, headless);
                var code = TIBasic.workspaceToCode(headless).replace(/^ +/gm, "");
                console.log(code);
                navigator.clipboard.writeText(code);
                setTimeout(alert, 50, "Converted code has been copied to your clipboard!");
                break; // There will only be one start block.
            }
        }
    } catch (error) {
        alert(error);
        console.error(error);
    }
    // var element = document.getElementById("download")
    // element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(btoa(JSON.stringify(Blockly.serialization.workspaces.save(Blockly.getMainWorkspace())))));
    // element.setAttribute('download', 'code.8xp');
    // element.click();
}

function downloadFile() {
    var element = document.getElementById("download");
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(btoa(JSON.stringify(Blockly.serialization.workspaces.save(Blockly.getMainWorkspace())))));
    element.setAttribute('download', 'save.tisb');
    element.click();
}

async function pickFile() {
    const [handler] = await showOpenFilePicker({
        excludeAcceptAllOption: true,
        types: [
            {
                description: "TI-SUPERBasic Files",
                accept: {
                    "text/plain": [".tisb"]
                }
            }
        ]
    });
    const file = await handler.getFile();
    const text = await file.text();
    Blockly.serialization.workspaces.load(JSON.parse(atob(text)), Blockly.getMainWorkspace());
}