const express = require("express");
const connectdb = require("./config/database")
const User = require("./models/user")

const app = express();
app.post("/signup",async (req,res)=>{
    const user = new User({
        firstName :"virat",
        lastName :"kholi",
        emailId :"virat@gmail.com",
        password:"virat@123",
        gender:"male"
    })
    await user.save();
    res.send("data succefully save ");

})
connectdb().then(()=>{
    console.log("database connect succefuly")
    app.listen(7777,()=>{
        console.log("server is listing ");
    })
    }).catch((error) =>{
    console.log("error");
    })
