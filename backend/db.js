const mongoose = require('mongoose')
const dotenv=require('dotenv')
dotenv.config();

function connectToDB(){
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("Connected to Database!")
    }).catch((error)=>{
        console.log("Error occured: ",error)
    })
}

module.exports=connectToDB;