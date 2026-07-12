const mongoose  = require ("mongoose")

const connectdb = async () =>{
    await mongoose.connect("mongodb+srv://vikrantsingla5_db_user:EXm60Z79ncMA1y5c@cluster0.ztbprpw.mongodb.net/devTinder");
}
module.exports = connectdb;
