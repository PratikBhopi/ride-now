const mongoose=require('mongoose')


const blackListTokenSchema=mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true
    },
    expiresAt:{
        type:Date,
        required:true, 
        index:{
            expires:0 //ttl index
        }
    }
})
const blackListToken= new mongoose.model("blakcListTokens",blackListTokenSchema);
module.exports=blackListToken