const utilsD = require('./utils.js')

// checks if correct type
const checkifCorrectType = (data, arrOfValidTypes) => {
    const type = utilsD.getType(data);
    let error = "";
    let correctType = false;
    arrOfValidTypes.forEach(element => {
        if(element.startsWith(type)){
            correctType = true;
        }
    });

    if(!correctType){
        error = "Expected";
        arrOfValidTypes.forEach((element,idx) => {
            if(idx != 0){
                error += "Or"
            }
            let text = element.charAt(0).toUpperCase() + element.slice(1);
            error += text
        })
    }

   

    return error
}

module.exports = {checkifCorrectType};