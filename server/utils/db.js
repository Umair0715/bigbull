const mongoose = require('mongoose');

const DB = 'mongodb://bigbull:RqUg7$Ba2!20@97.74.92.191:27017/bigbull';
// const DB = process.env.DATABASE_URI;

const connectDB = () => {
   mongoose.connect(DB , {
      useNewUrlParser : true , 
      useUnifiedTopology : true 
   })
   .then(() => console.log('Database connected.'))
   .catch(err => console.log(`Database connection failed. ${err}`))
}
module.exports = connectDB ;
