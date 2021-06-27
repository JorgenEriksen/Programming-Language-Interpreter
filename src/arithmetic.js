const utilsA = require('./utils.js')

const plus = (x, y) => {
    if (typeToWorkWith(x, y) === "JString") {
        return "JString " + utilsA.removeType(x) + utilsA.removeType(y)
    } else if (typeToWorkWith(x, y) === "JFloat") {
        return "JFloat " + (toDigit(x) + toDigit(y))
    } else if (typeToWorkWith(x, y) === "JInt") {
        return "JInt " + (toDigit(x) + toDigit(y))
    } 
    return "JError " + "Error message here"; // this should never happen, but it's there just in case so it's possible in case of an unforeseen bug
}

// minus
const minus  = (x, y) => {
    if (typeToWorkWith(x, y) === "JString") {
        return "JError " + "Error message here";
    } else if (typeToWorkWith(x, y) === "JFloat") {
        return "JFloat " + (toDigit(x) - toDigit(y))
    } else if (typeToWorkWith(x, y) === "JInt") {
        return "JInt " + (toDigit(x) - toDigit(y))
    }
    return "JError " + "Error message here"; // this should never happen, but it's there just in case so it's possible in case of an unforeseen bug

}

// multiplication
const mult = (x, y) => {
    if (typeToWorkWith(x, y) === "JString") {
        return "JError " + "Error message here";
    } else if (typeToWorkWith(x, y) === "JFloat") {
        return "JFloat " + (toDigit(x) * toDigit(y))
    } else if (typeToWorkWith(x, y) === "JInt") {
        return "JInt " + (toDigit(x) * toDigit(y))
    }
    return "JError " + "Error message here"; // this should never happen, but it's there just in case so it's possible in case of an unforeseen bug
}

// float division
const floatdiv = (x, y) => {
    if (typeToWorkWith(x, y) === "JInt" || typeToWorkWith(x, y) === "JFloat") {
        let val = (toDigit(x) / toDigit(y))
            return "JFloat " + val
    }
    return "JError " + "Error message here"; // this should never happen, but it's there just in case so it's possible in case of an unforeseen bug
}

// division
const div = (x, y) => {
    if (typeToWorkWith(x, y) === "JInt" || typeToWorkWith(x, y) === "JFloat") {
        let val = (toDigit(x) / toDigit(y))
        return "JInt " + Math.floor(val)
    }
    return "JError " + "Error message here"; // this should never happen, but it's there just in case so it's possible in case of an unforeseen bug
}

// modulo operation
const modulo = (x, y) => {
    let val = (toDigit(x) % toDigit(y))
    return "JInt " + Math.floor(val)
}

// if bigger than sign
const isBiggerThan = (x, y) => {
    let xVal = 0;
    let yVal = 0;
    if(x.startsWith("JString")){
        xVal = utilsA.removeType(x).length
    } else if(x.startsWith("JInt") || x.startsWith("JFloat")){
        xVal = toDigit(x)
    } else {
        return "JError " + "Error message here"; // this should never happen, but it's there just in case so it's possible in case of an unforeseen bug
    }

    if(y.startsWith("JString")){
        yVal = utilsA.removeType(y).length
    } else if(y.startsWith("JInt") || y.startsWith("JFloat")){
        yVal = toDigit(y)
    } else {
        return "JError " + "Error message here"; // this should never happen, but it's there just in case so it's possible in case of an unforeseen bug
    }

    let result = "" + (xVal > yVal)
    return "JBool " + utilsA.capitalizeString(result);
}

// if less than sign
const isLessThan = (x, y) => {
    let xVal = 0;
    let yVal = 0;
    if(x.startsWith("JString")){
        xVal = utilsA.removeType(x).length
    } else if(x.startsWith("JInt") || x.startsWith("JFloat")){
        xVal = toDigit(x)
    } else {
        return "JError " + "Error message here"; // this should never happen, but it's there just in case so it's possible in case of an unforeseen bug
    }

    if(y.startsWith("JString")){
        yVal = utilsA.removeType(y).length
    } else if(y.startsWith("JInt") || y.startsWith("JFloat")){
        yVal = toDigit(y)
    } else {
        return "JError " + "Error message here"; // this should never happen, but it's there just in case so it's possible in case of an unforeseen bug
    }

    let result = "" + (xVal < yVal)
    return "JBool " + utilsA.capitalizeString(result);
}

// returns true if equal
const isEqual = (x, y) => {
    let result = "" + (toDigit(x) == toDigit(y) || x == y)
    return "JBool " + utilsA.capitalizeString(result);
}

// converts internal varialbe to digit
const toDigit = (JInt) => {
    let val = utilsA.removeType(JInt)
    return parseFloat(val)
}

// finds out what type to work with, based on the pair of types
const typeToWorkWith = (x, y) => {
    if(x.startsWith("JString") || y.startsWith("JString")){
        return "JString";
    } else if(x.startsWith("JFloat") || y.startsWith("JFloat")) {
        return "JFloat";
    } else if(x.startsWith("JInt") || y.startsWith("JInt")) {
        return "JInt";
    }
}

// returns true if int
function isInt(n) {
    return n % 1 === 0;
 }


module.exports = {plus, minus, mult, floatdiv, div, modulo, isBiggerThan, isLessThan, isEqual};