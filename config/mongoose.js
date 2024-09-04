const mongoose=require('mongoose');

require('dotenv').config();
mongoose.connect(process.env.MONGODB_URL);

const db=mongoose.connection;

db.on('Error', console.error.bind(console, 'Error in connecting to MongoDB'));

db.once('open', () => {
    console.log('Connected to Mongodb');
})

module.exports=db;
