// split the string into tokens
const splitString = (inputFromUser) => {
    let input = [];
    let runLoop = true;
    let restOfInput = inputFromUser;
    let counter = 0;
    let dept = 0;
    let currentFront = "";
    let currentBack = ""
    let specialChars = [{
            front: "[",
            back: "]"
        },
        {
            front: "{",
            back: "}"
        },
        {
            front: '"',
            back: '"'
        }
    ]

    // loops through the whole input
    while (runLoop == true) {
        let currentChar = restOfInput[counter];
        if (currentChar === " " && dept == 0) { // if space and not in dept
            input.push(restOfInput.substr(0, counter))
            restOfInput = restOfInput.substr(counter + 1)
            counter = -1;
        } else if (currentBack === currentChar) { // if going up from dept
            dept--;
            if (dept === 0) { // if not in dept
                currentFront = "";
                currentBack = "";
            }
        } else if (specialChars.map(e => e.front).includes(currentChar) && (currentFront === "" || currentFront === currentChar)) { // if going in dept (ignore spaces)
            currentFront = currentChar;
            specialChars.forEach(e => {
                if (e.front === currentFront) {
                    currentBack = e.back;
                }
            })
            dept++;
        }

        if (counter >= restOfInput.length) { // if at the last character
            input.push(restOfInput);
            runLoop = false;
        }
        counter++;
    }
    return input;
}

// gets the value of a string
const stringInputToStringVar = (stringInput) => {
    let placeholder = stringInput.substring(2, stringInput.length - 2);
    return placeholder;
}

// list to input/tokens
const listToInput = (list) => {
    let placeholder = list.substring(2, list.length - 2);
    return placeholder;
}

// creates and list (internal array)
const createList = (arr) => {
    let list = "[ "
    arr.forEach(e => {
        list += (e + " ")
    });
    list += "]"
    return list
}

// makes the first letter in a string uppercase
const capitalizeString = (str) => {
    let res = str.charAt(0).toUpperCase() + str.slice(1)
    return res
}

// gets the internal type
const getType = (str) => {
    let firstWord = str.split(" ")[0]
    if (firstWord == "[") {
        return "array"
    } else if (firstWord == "{") {
        return "quotation"
    }
    return str.split(" ")[0]
}

// checks if list input is empty
const isListInputEmpty = (input) => {
    input = input.split(' ').join('')
    if (input.length > 0) {
        return false
    } else {
        return true
    }
}

// pairs of token and internal program code
const pairs = [{
        token: "pop",
        program: "JOp OpPop"
    },
    {
        token: "swap",
        program: "JOp OpSwap"
    },
    {
        token: "dup",
        program: "JOp OpDup"
    },
    {
        token: "+",
        program: "JOp OpAdd"
    },
    {
        token: "-",
        program: "JOp OpSub"
    },
    {
        token: "*",
        program: "JOp OpMult"
    },
    {
        token: "div",
        program: "JOp OpDiv"
    },
    {
        token: "/",
        program: "JOp FloatDiv"
    },
    {
        token: "div",
        program: "JOp OpDiv"
    },
    {
        token: "token: <",
        program: "JOp OpLess"
    },
    {
        token: ">",
        program: "JOp OpBigger"
    },
    {
        token: "==",
        program: "JOp OpEqual"
    },
    {
        token: "&&",
        program: "JOp OpAnd"
    },
    {
        token: "||",
        program: "JOp OpOr"
    },
    {
        token: "not",
        program: "JOp OpNot"
    },
    {
        token: ":=",
        program: "JOp OpVariable"
    },
    {
        token: "parseInteger",
        program: "JOp OpParseInt"
    },
    {
        token: "parseFloat",
        program: "JOp OpParseFloat"
    },
    {
        token: "words",
        program: "JOp OpParseWords"
    },
    {
        token: "head",
        program: "JOp OpHead"
    },
    {
        token: "tail",
        program: "JOp OpTail"
    },
    {
        token: "empty",
        program: "JOp OpEmpty"
    },
    {
        token: "cons",
        program: "JOp OpCons"
    },
    {
        token: "length",
        program: "JOp OpLength"
    }
]

// removes the internal type
const removeType = (str) => {
    let returnValue = ""
    if (str.startsWith("\" ") && str.endsWith(" \"") || (str.startsWith("{ ") && str.endsWith(" }"))) {
        returnValue = str.substring(2, str.length - 2);
    } else if (str.startsWith("JOp ")) {
        pairs.forEach(pair => {
            if (pair.program === str) {
                returnValue = pair.token
            }
        })
    }

    if (returnValue !== "") {
        return returnValue
    }
    if(str.startsWith("JFloat ") && !str.includes(".")){
        let placeholder = str.substr(str.indexOf(' ') + 1);
        placeholder += ".0"
        return placeholder;
    } 
    return str.substr(str.indexOf(' ') + 1);
}

// prints the stack
const printStack = (stack, showType) => {
    if (stack.length === 1) { // if one element on the stack
        if (showType) {
            process.stdout.write(stack.toString())
        } else {
            stack.forEach((element, idx) => {
                if (element.startsWith("[ ") && element.endsWith(" ]") || element.startsWith("{ ") && element.endsWith(" }")) {
                    process.stdout.write(element)
                } else {
                    process.stdout.write(removeType(element))
                }
                if (idx != stack.length - 1) {
                    process.stdout.write(",")
                }
            });
        }
    } else { // if not one element on the stack
        process.stdout.write("[")
        if (showType) {
            process.stdout.write(stack.toString())
        } else {         
            stack.forEach((element, idx) => {
                if (element.startsWith("[ ") && element.endsWith(" ]")) {
                    process.stdout.write(element)
                } else {
                    process.stdout.write(removeType(element))
                }
                if (idx != stack.length - 1) {
                    process.stdout.write(",")
                }
            });
        }
        process.stdout.write("]\n")
    }

}

module.exports = {
    getType,
    capitalizeString,
    createList,
    listToInput,
    removeType,
    stringInputToStringVar,
    splitString,
    isListInputEmpty,
    printStack
};