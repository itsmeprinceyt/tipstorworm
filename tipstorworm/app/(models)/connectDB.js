const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();
const password = encodeURIComponent(process.env.DATABASE_URL_PASSWORD); //if the password contains special characters it needs to be decoded. so this will decode the password and then it will store the decoded password in that variable
const uri = process.env.DATABASE_URL1+password+process.env.DATABASE_URL2; // using mongoDB connection string along with login credentials to connect to mongoDB atlas

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log("Already connected to MongoDB");
        return;
    }
    try {
        await mongoose.connect(uri);
        mongoose.Promise = global.Promise;
        console.log(`Database has been connected successfully and ready to use.`)
    } catch (error) {
        console.log(error)
    }
}
module.exports = connectDB;