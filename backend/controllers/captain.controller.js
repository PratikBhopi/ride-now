const {validationResult}=require('express-validator');
const captainModel = require('../models/captain.model');
const blackListToken = require('../models/blacklistToken.model');
const captainService=require('../services/captain.service')
const jwt=require('jsonwebtoken')
module.exports.registerCaptain = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {email,password,vehicle,fullname}=req.body
        const findcaptain=await captainModel.findOne({email:email})
        if(findcaptain){
            return res.status(200).json({message:"Kindly Login"});
        }
        const hashedPassword=await captainModel.hashPassword(password);

        const captain = await captainService.createCaptain({fullname,email,hashedPassword,vehicle});

        const token = captain.generateAuthToken();
        console.log(token)
        res.cookie('token',token)
        return res.status(201).json({message:"captain created",token:token})

    } catch (error) {
        console.log(error);
        return res.status(400).json({message:'error occurred'});
    }
}

module.exports.loginCaptain=async(req,res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const{email,password}=req.body
        const captain=await captainModel.findOne({email:email}).select('+password')
        if(!captain){
            return res.status(404).json({message:"Captain doesn't exist"})
        }

        const checkPass = await captain.comparePassword(password);
        if(!checkPass) return res.status(401).json({message:"incorrect password"})

        const token=captain.generateAuthToken();
        res.cookie('token',token)
        return res.status(200).json({message:"logged in",token:token})
    } catch (error) {
        console.log(error)
        return res.status(400).json({error:error})
    }
}

module.exports.getProfile=async(req,res)=>{
    return res.status(200).json({captain:req.captain})
}


module.exports.logoutCaptain=async(req,res)=>{
    res.clearCookie('token');

    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
    const expiresAt=new Date(decoded.exp * 1000);
    await blackListToken.create({token,expiresAt});

    return res.status(200).json({message:"logged out"})

}