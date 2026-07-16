require("dotenv").config();
const express = require("express");
const {validateSignUpData} = require("./utils/validation")
const connectdb = require("./config/database")
const User = require("./models/user");
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middleware/auth")


const app = express();
app.use(express.json())
app.use(cookieParser())
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
        const token = await jwt.sign({_id:user._id},  process.env.JWT_SECRET)
res.cookie("token",token)
        res.send("Login successfully");
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get("/profile",userAuth, async (req, res) => {
    try {
        
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(401).send(error.message);
    }
});

const PORT = process.env.PORT;

connectdb().then(() => {
    console.log("Database connected successfully");

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}).catch((error) => {
    console.log(error.message);
});
