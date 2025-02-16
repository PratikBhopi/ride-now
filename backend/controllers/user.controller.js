const { validationResult } = require('express-validator')
const userService = require('../services/user.service');
const userModel = require('../models/user.model');
const blackListToken = require('../models/blacklistToken.model');
const jwt = require('jsonwebtoken');
const dotenv=require('dotenv')
dotenv.config();

module.exports.registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password } = req.body;

        const findUser = await userModel.findOne({ email: email })
        if (findUser) {
            return res.status(200).json({ message: "User exist." })
        }

        const hashedPassword = await userModel.hashPassword(password);
        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword
        })

        const token = user.generateAuthToken();
        res.cookie('token',token)
        return res.status(201).json({ token: token, uesr: user });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: "error occured" })
    }
}


module.exports.loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { password, email } = req.body;
        const user = await userModel.findOne({ email: email }).select('+password');
        if (!user) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        const checkPassword = await user.comparePassword(password);
        if (!checkPassword) {
            return res.status(401).json({ message: "incorrect password" })
        }

        const token = user.generateAuthToken();
        res.cookie('token',token);
        return res.status(200).json({ success: "ok", token: token });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: error })
    }
}


module.exports.getUserProfile= async (req,res)=>{
    return res.status(200).json({user:req.user})
}


module.exports.logoutUser=async(req,res)=>{
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
    const expiresAt = new Date(decoded.exp * 1000); // Convert to Date format
    await blackListToken.create({ token ,expiresAt});
    
    return res.status(200).json({message:'Logged Out'});
}