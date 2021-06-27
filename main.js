'use strict'

const fs = require('fs');
const readline = require('readline');
const lineReader = require('line-reader');
const arithmetic = require('./src/arithmetic.js')
const variable = require('./src/variable.js')
const func = require('./src/function.js')
const utils = require('./src/utils.js')
const parsing = require('./src/parsing.js')
const logicalOperations = require('./src/logicalOperations.js')
const error = require('./src/error.js')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// for each line in stdin
rl.on('line', (inputFromUser) => {
    if(repl){
        userInput = utils.splitString(inputFromUser); // string to tokens array
        if(!userInput) {
            return;
        }
        globalStack = runProgram(userInput, globalStack) // token parser and interpreter
        if(errorMessage !== "" || globalStack.length === 0 || globalStack.length > 1){
            process.stdout.write(errorMessage)
            errorMessage = "";
        } 
        utils.printStack(globalStack, showType)
        process.stdout.write("\n\n");
        process.stdout.write("bprog> ")
    } else {
        userInput = userInput.concat(utils.splitString(inputFromUser)); // string to tokens array
        userInput.push("* newline *") 
    }

});

// will run when stdin input is ended.
rl.on('close', () => {
    if(!repl){
        globalStack = runProgram(userInput, globalStack) // token parser and interpreter
        utils.printStack(globalStack, showType)
        if(globalStack.length === 0) {
            process.stdout.write("EmptyStack\n");
        } else if(globalStack.length > 1) {
            process.stdout.write("ProgramFinishedWithMultipleValuesOnStack\n");
        }
        process.stdout.write("\n\n");
    }
});

// token parser and interpreter
const runProgram = (input, gStack = []) => {
    let stack = tokenParser(input);
    stack = interpreter(gStack.concat(stack));
    return stack;
}

// check if already parsed literals
const checkIfParsedLiterals = (e) => {
    const allTypes = ["JInt", "JString", "JFloat", "JBool", "JVar"];
    let isParsed = false;
    allTypes.forEach(type => {
        if(e.startsWith(type)){
            isParsed = true
            return true;
        }
    })
    return isParsed
}

// check if already parsed program
const checkIfParsedProgram = (e) => {
    const allTypes = ["JOp"];
    let isParsed = false;
    allTypes.forEach(type => {
        if(e.startsWith(type)){
            isParsed = true
        }
    })
    return isParsed
}

// the token parser
const tokenParser = (tokens) => {
    let stack = []
    let skip = 0;
    tokens.every((e, idx) => {
        if(skip > 0){
            skip--;
            return true;
        } else if (e == "* newline *") { 
            return true;
        } else if (e == "") { 
            return true;
        } else if (checkIfParsedLiterals(e)) { 
            stack.push(e)
        } else if(checkIfParsedProgram(e)){  
            stack.push(e);
        } else if(e.startsWith("\" ") && e.endsWith(" \"")){ // if string
           let type = "JString " + utils.stringInputToStringVar(e);
           stack.push(type);
        } else if(!isNaN(e) && e.toString().indexOf('.') != -1) {
            let type = "JFloat " + e;
            stack.push(type);
        } else if (e.match(/^[0-9]+$/) != null) { // if number e.match(/^[0-9]+$/) != null
            let type = "JInt " + e;
            stack.push(type);
        } else if (e === "False" || e === "True") { // if bool
            let type = "JBool " + e;
            stack.push(type);
        } else if(e.startsWith("[") && e.endsWith("]")){ // if array
            stack.push(e)
        } else if(e === "pop") { 
            let type = "JOp OpPop";
            stack.push(type);
        } else if(e === "swap") {
            let type = "JOp OpSwap";
            stack.push(type);
        } else if(e === "dup") {
            let type = "JOp OpDup";
            stack.push(type);
        } else if(e === "+") {
            let type = "JOp OpAdd";
            stack.push(type);
        } else if(e === "-") {
            let type = "JOp OpSub";
            stack.push(type);
        } else if(e === "*") {
            let type = "JOp OpMult";
            stack.push(type);
        } else if(e === "/") {
            let type = "JOp OpFloatDiv";
            stack.push(type);
        } else if(e === "div") {
            let type = "JOp OpDiv";
            stack.push(type);
        } else if(e === "%") {
            let type = "JOp OpModulo";
            stack.push(type);
        } else if(e === "<") {
            let type = "JOp OpLess";
            stack.push(type);
        } else if(e === ">") {
            let type = "JOp OpBigger";
            stack.push(type);
        } else if(e === "==") {
            let type = "JOp OpEqual";
            stack.push(type);
        } else if(e === "&&") {
            let type = "JOp OpAnd";
            stack.push(type);
        } else if(e === "||") {
            let type = "JOp OpOr";
            stack.push(type);
        } else if(e === "not") {
            let type = "JOp OpNot";
            stack.push(type);
        } else if(e === ":=") {
            let type = "JOp OpVariable";
            stack.push(type);
        } else if(e === "parseInteger") {
            let type = "JOp OpParseInt";
            stack.push(type);
        } else if(e === "parseFloat") {
            let type = "JOp OpParseFloat";
            stack.push(type);
        } else if(e === "words") {
            let type = "JOp OpParseWords";
            stack.push(type);
        } else if(e === "head") {
            let type = "JOp OpHead";
            stack.push(type);
        } else if(e === "tail") {
            let type = "JOp OpTail";
            stack.push(type);
        } else if(e === "empty") {
            let type = "JOp OpEmpty";
            stack.push(type);
        } else if(e === "cons") {
            let type = "JOp OpCons";
            stack.push(type);
        } else if(e === "length") {
            let type = "JOp OpLength";
            stack.push(type);
        } else if(e === "map") {
            let type = "JOp OpMap";
            stack.push(type);
        } else if(e === "each") {
            let type = "JOp OpEach";
            stack.push(type);
        } else if(e === "append") {
            let type = "JOp OpAppend";
            stack.push(type);
        } else if(e === "foldl") {
            let type = "JOp OpFoldl";
            stack.push(type);
        } else if(e === "each") {
            let type = "JOp OpEach";
            stack.push(type);
        } else if(e === "times") {
            let type = "JOp OpTimes";
            stack.push(type);
        } else if(e === "loop") {
            let type = "JOp OpLoop";
            stack.push(type);
        } else if(e.startsWith("{ ") && e.endsWith(" }")) {
            stack.push(e);
        } else if(e === "exec") {
            let type = "JOp OpExec";
            stack.push(type);
        } else if(e === "fun") {
            let type = "JOp OpFun";
            stack.push(type);
        } else if(e === "if") {
            let type = "JOp OpIf";
            stack.push(type);
        } else if(e === "jumpinstack") {
            let type = "JOp OpJump";
            stack.push(type);
        } else if(e === "read") {
            let type = "JString ";
            let restOfTokens = tokens.slice(idx+1)
            restOfTokens.every((e, tokenIndex) => {
                if(e == "* newline *") {
                    return false;
                }
                if(tokenIndex != 0){
                    type += " ";
                }
                skip++;
                type += e;

                return true;
            })
            stack.push(type);
        } else if(e === "print") {
            let type = "JOp OpPrint";
            stack.push(type);
        } else { 
            if(e.trim() !== "") {
                let type = "JVar " + e;
                if(variable.doesVariableExist(type)) {
                    type = variable.getValueFromVariable(type)
                }
                stack.push(type) // variable
            } 
        }
        return true;
    })
    
    return stack
}

// the interpreter
const interpreter = (stack) => {
    let valStack = []
    while(stack.length > 0) {
        let input;
        let tokens;
        let res;
        let prog;
        let numberToPop = 2;
        let val = [];
        switch(stack[0]) {
            case "JOp OpPop":
                if(valStack.length < 1) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    numberToPop = 1;
                }
                break;
            case "JOp OpSwap":
                if(valStack.length < 2) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    val[0] = valStack[valStack.length-1];
                    val[1] = valStack[valStack.length-2];
                }
                break;
            case "JOp OpDup":
                if(valStack.length < 1) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    val[0] = valStack[valStack.length-1];
                    numberToPop = 0;
                }
                break;
            case "JOp OpAdd":
                if(valStack.length < 2) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JInt", "JFloat", "JString"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-2], ["JInt", "JFloat", "JString"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    val[0] = arithmetic.plus(valStack[valStack.length-2], valStack[valStack.length-1]);
                }
                break;
            case "JOp OpSub":
                if(valStack.length < 2) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JInt", "JFloat"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-2], ["JInt", "JFloat"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    val[0] = arithmetic.minus(valStack[valStack.length-2], valStack[valStack.length-1]);
                }
                break;
            case "JOp OpMult":
                if(valStack.length < 2) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JInt", "JFloat"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-2], ["JInt", "JFloat"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    val[0] = arithmetic.mult(valStack[valStack.length-2], valStack[valStack.length-1]);
                }
                break;
            case "JOp OpFloatDiv":
                if(valStack.length < 2) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JInt", "JFloat"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-2], ["JInt", "JFloat"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    val[0] = arithmetic.floatdiv(valStack[valStack.length-2], valStack[valStack.length-1]);
                }
                break;
            case "JOp OpDiv":
                if(valStack.length < 2) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JInt", "JFloat"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-2], ["JInt", "JFloat"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    val[0] = arithmetic.div(valStack[valStack.length-2], valStack[valStack.length-1]);
                }
                break;
            case "JOp OpModulo":
                if(valStack.length < 2) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JInt", "JFloat"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-2], ["JInt", "JFloat"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    val[0] = arithmetic.modulo(valStack[valStack.length-2], valStack[valStack.length-1]);
                }
                break;
            case "JOp OpLess":
                if(valStack.length < 2) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JInt", "JFloat", "JString"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-2], ["JInt", "JFloat", "JString"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    val[0] = arithmetic.isLessThan(valStack[valStack.length-2], valStack[valStack.length-1]);
                }
                break;
            case "JOp OpBigger":
                if(valStack.length < 2) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JInt", "JFloat", "JString"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-2], ["JInt", "JFloat", "JString"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    val[0] = arithmetic.isBiggerThan(valStack[valStack.length-2], valStack[valStack.length-1]);
                }
                break;
            case "JOp OpEqual":
                if(valStack.length < 2) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    val[0] = arithmetic.isEqual(valStack[valStack.length-2], valStack[valStack.length-1]);
                }
                break;
            case "JOp OpAnd":
                if(valStack.length < 2) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JBool"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-2], ["JBool"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    val[0] = logicalOperations.and(valStack[valStack.length-2], valStack[valStack.length-1]);
                }
                break;
            case "JOp OpOr":
                if(valStack.length < 2) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JBool"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-2], ["JBool"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    val[0] = logicalOperations.or(valStack[valStack.length-2], valStack[valStack.length-1]);
                }
                break;
            case "JOp OpNot":
                if(valStack.length < 1) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    val[0] = logicalOperations.not(valStack[valStack.length-1]);
                    numberToPop = 1;
                }
                break;
            case "JOp OpVariable":
                if(valStack.length < 2) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                errorMessage = error.checkifCorrectType(valStack[valStack.length-2], ["JVar"])
                if(errorMessage != "") { // if error
                    return valStack; // exits the interpreter
                }
                    variable.createVariable(valStack[valStack.length-2], valStack[valStack.length-1]);
                }
                break;
            case "JOp OpParseInt":
                if(valStack.length < 1) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JString"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    val[0] = parsing.parseJInt(valStack[valStack.length-1]);
                    numberToPop = 1
                }
                break;
            case "JOp OpParseFloat":
                if(valStack.length < 1) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JString"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    val[0] = parsing.parseJFloat(valStack[valStack.length-1]);
                    numberToPop = 1;
                }
                break;
            case "JOp OpParseWords":
                if(valStack.length < 1) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JString"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    val[0] = parsing.words(valStack[valStack.length-1]);
                    numberToPop = 1;
                }
                break;
            case "JOp OpHead":
                if(valStack.length < 1) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["array"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    input = utils.listToInput(valStack[valStack.length-1])
                    tokens = utils.splitString(input)
                    res = tokenParser(tokens)
                    val[0] = res[0];
                    numberToPop = 1;
                }
                break;
            case "JOp OpTail":
                if(valStack.length < 1) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["array"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    input = utils.listToInput(valStack[valStack.length-1])
                    tokens = utils.splitString(input)
                    val[0] = utils.createList(tokens.slice(1));
                    numberToPop = 1;
                }
                break;
            case "JOp OpEmpty":
                if(valStack.length < 1) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["array"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    input = utils.listToInput(valStack[valStack.length-1])
                    if(utils.isListInputEmpty(input)){
                        val[0] = "JBool True";
                    } else {
                        val[0] = "JBool False";
                    }
                    numberToPop = 1;
                }
                break;
            case "JOp OpCons":
                if(valStack.length < 2) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else { 
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["array"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }

                    input = utils.listToInput(valStack[valStack.length-1])
                    tokens = utils.splitString(input)
                    if (utils.getType(valStack[valStack.length-2]) === "array" || utils.getType(valStack[valStack.length-1]) === "quotation" ) {
                        tokens.unshift(valStack[valStack.length-2]);
                    } else {
                        tokens.unshift(utils.removeType(valStack[valStack.length-2]))
                    }
                    val[0] = utils.createList(tokens);
                    if(utils.isListInputEmpty(input)){
                        val[0] = val[0].substring(0, val[0].length - 3) + ']';
                    } 
                }
                break;
            case "JOp OpLength":
                if(valStack.length < 1) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    if(utils.getType(valStack[valStack.length-1]) === "array"){
                        input = utils.listToInput(valStack[valStack.length-1])
                        tokens = utils.splitString(input)
                        val[0] = parsing.digitToJInt(tokens.length);
                    } else if(utils.getType(valStack[valStack.length-1]) === "quotation") {
                        let prog = utils.splitString(utils.removeType(valStack[valStack.length-1]));
                        val[0] = parsing.digitToJInt(prog.length);
                    } else if (utils.getType(valStack[valStack.length-1]) === "JString") {
                        val[0] = parsing.digitToJInt(utils.removeType(valStack[valStack.length-1]).length);
                    } else {
                        errorMessage = "ExpectedArrayOrQuotationOrJString"
                        return;
                    }
                    numberToPop = 1;
                }
                break;
            case "JOp OpMap":
                if(valStack.length < 1) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["array"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    errorMessage = error.checkifCorrectType(stack[1], ["quotation"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    input = utils.listToInput(valStack[valStack.length-1])
                    tokens = utils.splitString(input)
                    prog = utils.splitString(utils.removeType(stack[1]));
                    let arr = [];
                    tokens.forEach(element => {
                        const p = runProgram([element].concat(prog))
                        arr.push(utils.removeType(p[0]))
                    });
                    numberToPop = 1;
                    stack.shift();
                    val[0] = utils.createList(arr);
                }
                break;
            case "JOp OpAppend":
                if(valStack.length < 2) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-2], ["array"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["array"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    input = utils.listToInput(valStack[valStack.length-1])
                    let listTokens = utils.splitString(input)
                    let input2 = utils.listToInput(valStack[valStack.length-2])
                    let listTokens2 = utils.splitString(input2)
                    val[0] = utils.createList(listTokens2.concat(listTokens))
                    if(utils.isListInputEmpty(input)){
                        val[0] = val[0].substring(0, val[0].length - 3) + ']';
                    } else if(utils.isListInputEmpty(input2)) {
                        val[0] = "[" + val[0].substring(3); 
                    }
                }
                break;
            case "JOp OpFoldl":
                if(valStack.length < 2) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-2], ["array"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JInt", "JFloat", "JString"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    let currentVal = utils.removeType(valStack[valStack.length-1]);
                    input = utils.listToInput(valStack[valStack.length-2])
                    tokens = utils.splitString(input)
                    tokens.forEach((element, idx) => {
                        const p = runProgram([currentVal, element, utils.removeType(stack[1])])
                        if(idx !== tokens.length-1){
                            currentVal = utils.removeType(p[0]);
                        } else {
                            currentVal = p[0];
                        }
                    });
                    val[0] = currentVal;
                    stack.splice(1, 1);
                }
                break;
            case "JOp OpEach":
                if(valStack.length < 1) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["array"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    errorMessage = error.checkifCorrectType(stack[1], ["quotation", "JOp"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    input = utils.listToInput(valStack[valStack.length-1])
                    prog = utils.splitString(utils.removeType(stack[1]));
                    tokens = utils.splitString(input)
                    tokens.forEach((element, idx) => {
                        const p = runProgram([element].concat(prog))
                        val[idx] = p[0];
                    });
                    stack.splice(1, 1);
                    numberToPop = 1;
                    //input = utils.listToInput(valStack[valStack.length-3])
                }
                break;
            case "JOp OpTimes":
                if(valStack.length < 1) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JInt"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    let number = utils.removeType(valStack[valStack.length-1]);
                    let value = stack[1];
                    stack.splice(0, 2);
                    for(let i = 0; i<number;  i++){
                        res = value;
                        if(utils.getType(value) === "quotation"){
                            prog = utils.splitString(utils.removeType(value));
                            res = runProgram(prog)[0];
                        }
                        stack.unshift(res);
                    }
                    stack.unshift("placeholder");
                    numberToPop = 1;
                }
                break;
            case "JOp OpLoop":
                if(valStack.length < 1) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    let stopLoop = false
                    //input = utils.splitString(utils.removeType(stack[1]));
                    let currentVal = valStack;
                    errorMessage = error.checkifCorrectType(stack[1], ["quotation"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    errorMessage = error.checkifCorrectType(stack[2], ["quotation"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    let breakQuotation = utils.splitString(utils.removeType(stack[1]));
                    let blockQuotation = utils.splitString(utils.removeType(stack[2]));

                    res = runProgram(currentVal.concat(breakQuotation))
                    stopLoop = parsing.parseJBoolToBool(res[res.length-1])
                    while(!stopLoop){
                        input = [...blockQuotation];
                        for(let i = currentVal.length-1; i >= 0; i--){
                            input.unshift(currentVal[i]);
                        }
                        currentVal = runProgram(input)

                        res = runProgram(currentVal.concat(breakQuotation))
                        stopLoop = parsing.parseJBoolToBool(res[res.length-1])
                    }
                    stack.splice(0, 2); // remove the breack and block quotation from stack

                    //val[i] = runProgram(input)[0];
                    valStack = currentVal;
                    numberToPop = 0;
                }
                break;
            case "JOp OpExec":
                if(valStack.length < 1) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["quotation"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    input = utils.splitString(utils.removeType(valStack[valStack.length-1]));
                    res = runProgram(input);
                    res.forEach(e => {
                        if(e.startsWith("JOp ") && e !== ""){
                            stack.push(e)
                        } else if(e !== ""){
                            val.push(e)
                        }
                    })
                    numberToPop = 1;
                }
                break;
            case "JOp OpFun":
                if(valStack.length < 2) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-2], ["JVar"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["quotation"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    func.createFunction(valStack[valStack.length-2], valStack[valStack.length-1]);
                }
                break;
            case "JOp OpIf":
                if(valStack.length < 1) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JBool"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    if(valStack[valStack.length-1] == "JBool True"){
                        input = utils.splitString(utils.removeType(stack[1]))
                    } else {
                        input = utils.splitString(utils.removeType(stack[2]))
                    }
                    res = runProgram(input);
                    let placeholder = [];
                    res.forEach(e => {
                        if(e.startsWith("JOp ")){
                            placeholder.push(e)
                        } else {
                            placeholder.push(e)
                        }
                    })
                    stack.splice(0, 3)
                    for(let i = placeholder.length-1; i>=0; i--){
                        stack.unshift(placeholder[i]);
                    }
                    stack.unshift("placeholder");
                    numberToPop = 1;
                }
                break;
            case "JOp OpJump":
                if(valStack.length < 2) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JInt"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    let index = parseInt(utils.removeType(valStack[valStack.length-1])) +1;
                    if(index > stack.length-1){
                        index = stack.length;
                    }
                    stack.splice(index, 0, valStack[valStack.length-2]);
                    numberToPop = 2;
                }
                break;
            case "JOp OpPrint":
                if(valStack.length < 1) {
                    val[0] = stack[0]
                    numberToPop = 0;
                } else {
                    errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JInt", "JFloat", "JString", "array"])
                    if(errorMessage != "") { // if error
                        return valStack; // exits the interpreter
                    }
                    utils.printStack([valStack[valStack.length-1]], showType);
                    numberToPop = 1;
                }
                break; 
            default:
                numberToPop = 0;
                if(variable.doesVariableExist(stack[0])) {
                    const variableValue = variable.getValueFromVariable(stack[0])
                    val[0] = variableValue;
                } else if(func.doesFunctionExist(stack[0])) {
                    prog = utils.splitString(utils.removeType(func.getValueFromQuotation(stack[0])));
                    prog = valStack.concat(prog)
                    res = runProgram(prog);
                    val = res;
                    numberToPop = valStack.length;
                } else {
                    val[0] = stack[0];
                }
                break;
        }
        for(let i=0; i<numberToPop; i++){
            valStack.pop();
        }
        stack.shift();
        val.forEach(v => {
            valStack.push(v);
        })
    }

    return valStack;
}


// main ( runs when the program starts)
let errorMessage = ""
let globalStack = [];
let userInput = [];
let preludeInput = [];
let userInputString = "";
let repl = false;
let showType = false;

// -showtype
var myArgs = process.argv.slice(2);
if(myArgs.includes("-showtype")){
    process.stdout.write("* shows types in stack *\n")
    showType = true;
}

// -repl
if(myArgs.includes("-repl")){
    process.stdout.write("* repl mode *\n")
    process.stdout.write("bprog> ")
    repl = true;
}

let prelude = fs.readFileSync('prelude.bprog', 'utf8');
userInputString = prelude.toString();
userInputString = userInputString.replace(/(\r\n|\n|\r)/gm, "");
preludeInput = utils.splitString(userInputString);
globalStack = runProgram(preludeInput, globalStack)