const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const bcrypt= require('bcrypt')


const userSchema=new mongoose.Schema({
    fullName:{
        firstName:{
            type:String,
            required:true,
            minLength:[2,'First Name must be atleast of 3 Characters']
        },
        lastName:{
            type:String,
            minLength:[2,'Last Name must be atleast of 3 Characters']
        }
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    socketId:{
        type:String,
    }
})

userSchema.methods.generateAuthToken=()=>{
    const token=jwt.sign({_id:this._id},process.env.JWT_SECRET_KEY);
    return token;
}


userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.statics.hashPassword =async function(password){
    return await bcrypt.hash(password,11);
}


const userModel=mongoose.model('user',userSchema);

module.exports=userModel;