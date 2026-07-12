const express = require("express");
const app = express();
app.use((req,res)=>{
    res.send("hello this is my first ");
})
app.listen(3000,()=>{
    console.log("server is listing ");
})