const express=require('express');
const cors=require('cors');
const bodyparser=require('body-parser');
const connectToDB = require('./db');
const app = express();


app.use(bodyparser)
app.use(cors())
connectToDB();

app.get('/',(req,res)=>res.send("Hello World"))

module.exports=app;