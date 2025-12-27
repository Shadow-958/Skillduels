const axios = require("axios");

const verifyAdmin = async () => {
    try {
        console.log("1. Attempting Admin Login...");
        const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
            email: "admin@skillduels.com",
            password: "adminpassword123"
        });

        const token = loginRes.data.token;
        console.log("Login Successful!");
        console.log("Token received.");

        console.log("\n2. Verifying Admin Status via /api/auth/me...");
        const meRes = await axios.get("http://localhost:5000/api/auth/me", {
            headers: { "x-auth-token": token }
        });

        const user = meRes.data.user;
        console.log("User Details:");
        console.log(`- Username: ${user.username}`);
        console.log(`- Email: ${user.email}`);
        console.log(`- isAdmin: ${user.isAdmin}`);

        if (user.isAdmin) {
            console.log("\nSUCCESS: User is recognized as Admin.");
        } else {
            console.log("\nFAILURE: User is NOT recognized as Admin.");
        }

    } catch (error) {
        console.error("Error verifying admin:", error.response ? error.response.data : error.message);
    }
};

verifyAdmin();
