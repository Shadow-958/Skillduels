const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const checkUser = async () => {
    try {
        const userId = "6939153f12fb26663c6a2ac1"; // ID from the token provided by user
        console.log(`Checking user with ID: ${userId}`);

        const user = await User.findById(userId);

        if (user) {
            console.log("User Found:");
            console.log(`- Username: ${user.username}`);
            console.log(`- Email: ${user.email}`);
            console.log(`- isAdmin: ${user.isAdmin}`);
        } else {
            console.log("User NOT found in database.");
        }

        process.exit();
    } catch (error) {
        console.error("Error checking user:", error);
        process.exit(1);
    }
};

checkUser();
