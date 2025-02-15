const userModel = require("../models/user.model")

module.exports.createUser=async({firstname,lastname,email,password})=>{
    if(!firstname || !email || !password){
        throw new Error("All fields are necessary")
    }

    const user=await userModel.create({
        fullName:{
        firstName:firstname,
        lastName:lastname},
        email,
        password
    })
    user.save();
    return user;
}
