var ID = require("nodejs-unique-numeric-id-generator")
const User = require('../models/userModel');

 async function generateReferralCode (count) {
    let docCount = count + 1;
    if(docCount <= 100000000 ){
       return docCount.toString().padStart(8, '0')
    }else if(docCount > 100000000) {
        return docCount.toString().padStart(10, '0')
    }
}

module.exports = generateReferralCode;









//prev method
// function generateReferralCode() {
//     const randomNum1 = Math.floor(Math.random() * 10) + 1
//     const randomNum2 = Math.floor(Math.random() * 10) + 1;
//     let code = ID.generate(new Date().toJSON());
//     if(code.toString().length < 6){
//         return generateReferralCode() ;
//     }
//     return code + randomNum1 + randomNum2
// }