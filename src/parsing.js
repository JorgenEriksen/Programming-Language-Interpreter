const utilsB = require('./utils.js')

const parseJInt = (int) => {
    return "JInt " + utilsB.removeType(int);
}

const parseJFloat = (float) => {
    return "JFloat " + utilsB.removeType(float);
}

const parseWords = (str) => {
    return  utilsB.removeType(str);
}

const digitToJInt = (digit) => {
    return "JInt " + digit;
}

const parseJBoolToBool = (b) => {
    if(b === "JBool True"){
        return true
    } else if(b === "JBool False") {
        return false
    }
    console.log("error in bool parsing. (This should never happen)")
}

const words = (str) => {
    let placeholder = utilsB.removeType(str);
    placeholder = placeholder.split(" ");
    placeholder = placeholder.map((word) => {
        return '" ' + word + ' "'
    })
    return utilsB.createList(placeholder);
}

module.exports = {parseJInt, parseJFloat, digitToJInt, words, parseJBoolToBool};