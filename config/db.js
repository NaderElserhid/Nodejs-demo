const mongoose = require("mongoose");

async function coonectToDB(){
    try{
    await mongoose.connect(process.env.MONG_URI);
         console.log("Connected to MongoDB...")
    }catch (err){
        console.log("Could not connect to MongoDB",err);
    }
}

module.exports = coonectToDB;