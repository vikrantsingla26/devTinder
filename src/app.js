const express = require("express");
const connectdb = require("./config/database")
const User = require("./models/user");


const app = express();
app.use(express.json())
app.post("/signup", async (req, res) => {

    try {
        const user = new User(req.body);
        await user.save();
        res.send("data succefully save ");
    }
    catch (error) {
        res.status(500).send(error.message);
    }

})
app.get("/user", async (req, res) => {
    try {
        const email = req.body.emailId;

        const user = await User.find({ emailId: email });

        if (user.length === 0) {
            return res.status(404).send("User not found");
        }

        res.send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get("/feed", async (req, res) => {
    try {
        const user = await User.find({});
        res.send(user)
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})
app.delete("/delete", async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findByIdAndDelete(userId)
        res.send(user);
    }
    catch (error) {
        res.status(500).send(error.message)
    }

})
app.patch("/user", async (req, res) => {
    try {
        const userId = req.body.userId
        const data = req.body
        const allowedupdate = ["userId","skills","password","age","firstName","lastName","photoUrl"]
        const isallowed = Object.keys(data).every((k)=>{
            return  allowedupdate.includes(k)
        })
        if(!isallowed){
            return  res.status(500).send("not allowed to change ")
        }
        if(data?.skills.length > 10){
            throw new Error("the number of skills are too much maximum limit is upto 10 ")
        }
        
        
        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "after",
            runValidators: true
        })
        res.send(user);
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})
connectdb().then(() => {
    console.log("database connect succefuly")
    app.listen(7777, () => {
        console.log("server is listing ");
    })
}).catch((error) => {
    console.log("error.message)");
})
