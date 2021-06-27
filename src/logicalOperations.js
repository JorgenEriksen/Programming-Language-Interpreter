const utilsC = require('./utils.js')

function and(x, y) {
    if(x !== "JBool True" && x !== "JInt 1" && x !== "JFloat 1"){
        return "JBool False"
    } else if(y !== "JBool True" && y != "JInt 1" && y != "JFloat 1"){
        return "JBool False"
    }
    return "JBool True"
 }

function or(x, y) {
    if(x == "JBool True" || x == "JInt 1" || x == "JFloat 1"){
        return "JBool True"
    } else if(y == "JBool True" || y == "JInt 1" || y == "JFloat 1"){
        return "JBool True"
    }
    return "JBool False"
}

function not(x) {
    if(x == "JBool True"){
        return "JBool False"
    } else if(x == "JBool False"){
        return "JBool True"
    }
}

module.exports = {and, or, not};