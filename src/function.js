let allFunctions = [];

class JFunction {
    funName;
    quotation;
    constructor(funName, quotation) {
        this.funName = funName;
        this.quotation = quotation;
    }
}

// gets value from quotation
const getValueFromQuotation = (funName) => {
    let quotation = "";
    allFunctions.forEach(fun => {
        if(fun.funName == funName) {
            quotation = fun.quotation;
        }
    })
    return quotation;
}

// checks if function exists
const doesFunctionExist = (funName) => {
    let found = false;
    allFunctions.forEach(fun=> {
        if(fun.funName == funName) {
            found = true;
        }
    })
    return found;
}

// creates new function
const createFunction = (funName, value) => {
    let newFun = new JFunction(funName, value)
    allFunctions.push(newFun);
}


module.exports = {createFunction, doesFunctionExist, getValueFromQuotation};