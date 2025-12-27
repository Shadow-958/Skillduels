const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const createAdmin = async () => {
    try {
        const email = "admin@skillduels.com";
        const password = "adminpassword123";
        const username = "admin";

        let user = await User.findOne({ email });

        if (user) {
            console.log("Admin user already exists. Updating isAdmin status...");
            user.isAdmin = true;
            await user.save();
            console.log("User updated to Admin.");
        } else {
            console.log("Creating new Admin user...");
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            user = await User.create({
                username,
                email,
                passwordHash,
                isAdmin: true
            });
            console.log("Admin user created successfully.");
        }

        console.log("\nAdmin Credentials:");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        process.exit();
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();
