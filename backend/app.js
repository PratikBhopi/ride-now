const express=require('express');
const cors=require('cors');
const bodyparser=require('body-parser');
const app = express();

app.use(bodyparser)
app.use(cors())

app.get('/',(req,res)=>res.send("Hello World"))

module.exports=app;