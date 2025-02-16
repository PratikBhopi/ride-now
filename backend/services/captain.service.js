const captainModel = require("../models/captain.model")

module.exports.createCaptain=async({fullname,email,hashedPassword,vehicle})=>{
    if(!fullname.firstname || !fullname.lastname || !email || !hashedPassword || !vehicle.plate || !vehicle.color || !vehicle.capacity || !vehicle.vehicletype){
        throw new Error('Details Missing');
    }

    const captain=await captainModel.create({
        fullName:{
            firstName:fullname.firstname,
            lastName:fullname.lastname
        },
        email,
        password:hashedPassword,
        vehicle:{
            color:vehicle.color,
            capacity:vehicle.capacity,
            vehicleType:vehicle.vehicletype,
            plate:vehicle.plate
        }
    })
    return captain;
}