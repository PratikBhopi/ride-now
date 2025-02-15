const { validationResult } = require('express-validator')
const userService = require('../services/user.service');
const userModel = require('../models/user.model');


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

        return res.status(200).json({ success: "ok", token: token })


    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: error })
    }
}


module.exports.getUserProfile= async (req,res)=>{
    return res.status(200).json({user:req.user})
}