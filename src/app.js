const express = require("express");
const connectdb = require("./config/database")

const app = express();
app.use((req,res)=>{
    res.send("hello this is my first ");
})
connectdb().then(()=>{
    console.log("database connect succefuly")
    app.listen(3000,()=>{
        console.log("server is listing ");
    })
    }).catch(error =>{
    console.log("error");
    })
