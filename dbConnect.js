//Import the mongoose module
var mongoose = require('mongoose');

function connectDb(){
    //Set up default mongoose connection
    mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

    if (mongoose.connection){
        console.log("Connection established with database!");
    }

    //Bind connection to error event (to get notification of connection errors)
    mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

module.exports = {
    connectDb
}

