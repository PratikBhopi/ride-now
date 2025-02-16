const express=require('express');
const cors=require('cors');
const connectToDB = require('./db');
const app = express();
const cookieParser=require('cookie-parser')
const userRoutes=require('./routes/user.routes')
const captainRoutes=require('./routes/captain.routes')


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(cookieParser())
connectToDB();

app.use('/users',userRoutes)
app.use('/captain',captainRoutes)

app.get('/',(req,res)=>res.send("Hello World"))

module.exports=app;