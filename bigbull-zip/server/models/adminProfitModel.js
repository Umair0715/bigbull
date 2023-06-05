const mongoose = require('mongoose');

const profitSchema = new mongoose.Schema({
    profitAmount : {
        type : Number,
        required : [true , 'profit amount is required.'] , 
        default : 2
    }
});

const AdminProfit = mongoose.model('AdminProfit' , profitSchema);
module.exports = AdminProfit;