const userModel=require('../models/user.model')
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
dotenv.config()
const bcrypt=require('bcrypt')

module.exports.authUser=async(req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({messagee:'unauthorized'})
    }

    try {
        console.log(token)
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        console.log(decoded)
        const user=await userModel.findById(decoded._id);
        console.log(_id)
        req.user=user
        return next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({messagee:'unauthorized'})
    }
}