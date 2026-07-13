require("dotenv").config();
const express = require("express");
const {validateSignUpData} = require("./utils/validation")
const connectdb = require("./config/database")
const User = require("./models/user");
const bcrypt = require("bcrypt")

const app = express();
app.use(express.json())
app.post("/signup", async (req, res) => {

    try {
        validateSignUpData(req);
        const {password,firstName,lastName,emailId,age} = req.body;
        const passwordhash = await bcrypt.hash(password,10);
        const user  = new User({
            firstName,
            lastName,
            age:18,
            password :passwordhash,
            emailId
        })
        

        await user.save();
        res.send("data succefully save ");
    }
    catch (error) {
        res.status(500).send(error.message);
    }

})
app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });

        if (!user) {
            return res.status(400).send("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send("Invalid email or password");
        }

        res.send("Login successfully");
    } catch (error) {
        res.status(500).send(error.message);
    }
});
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
const PORT = process.env.PORT;

connectdb().then(() => {
    console.log("Database connected successfully");

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}).catch((error) => {
    console.log(error.message);
});
