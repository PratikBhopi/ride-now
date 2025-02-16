const userModel=require('../models/user.model')
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
dotenv.config()
const blackListToken=require('../models/blacklistToken.model')
const captainModel = require('../models/captain.model')

module.exports.authUser=async(req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({messagee:'unauthorized'})
    }

    const isBlacklisted=await blackListToken.findOne({token:token});
    if(isBlacklisted){
        return res.status(404).json({message:'Unauthorized'})
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        const user=await userModel.findById(decoded.id);
        req.user=user
        return next();
    } catch (error) {
        return res.status(401).json({messagee:'unauthorized'})
    }
}

module.exports.authCaptain=async(req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if(!token){
        return res.status(401).json({messagee:'unauthorized'})
    }

    const isBlacklisted=await blackListToken.findOne({token:token});
    if(isBlacklisted){
        return res.status(404).json({message:'Unauthorized'})
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        const captain=await captainModel.findById(decoded.id);
        req.captain=captain
        return next();
    } catch (error) {
        return res.status(401).json({messagee:'unauthorized'})
    }
}