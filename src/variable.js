const parsingA = require('./parsing.js')

let allVariables = [];

class JVar {
    varName;
    value;
    constructor(varName, value) {
        this.varName = varName;
        this.value = value;
    }
}

// checks if variable exists
const doesVariableExist = (varname) => {
    let found = false;
    allVariables.forEach(variable => {
        if(variable.varName == varname) {
            found = true;
        }
    })
    return found;
}

// gets value from variable
const getValueFromVariable = (varname) => {
    let varValue = "";
    allVariables.forEach(variable => {
        if(variable.varName == varname) {
            varValue = variable.value;
        }
    })
    return varValue;
}

// never used
const editValueOnVariable = (varname, value) => { 
    allVariables = allVariables.map(v => {
        if(v.varName == varname) {
            let placeholder = v;
            v.value = value
            return placeholder;
        }
        return v;
    })
}

// creates new variable
const createVariable = (varname, value) => {
    let newVar = new JVar(varname, value)
    allVariables.push(newVar);

}

module.exports = {createVariable, doesVariableExist, getValueFromVariable};