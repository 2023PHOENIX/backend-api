const mongoose = require("mongoose");

async function ConnectionToDB() {

    try{

    const result = await mongoose.connect(process.env.mongoDB_URL,{
        dbName : 'demo'
    });
    console.log('connected to db');
    }catch(e){
        console.log("Error in connection",e.message);
    }
    return null;
}

module.exports = {
    ConnectionToDB
}