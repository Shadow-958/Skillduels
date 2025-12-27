const verifyRefreshToken = async () => {
    const baseUrl = "http://127.0.0.1:5000/api/auth";

    const post = async (endpoint, body, token = null) => {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["x-auth-token"] = token;

        const res = await fetch(`${baseUrl}${endpoint}`, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        });

        const data = await res.json();
        return { status: res.status, data };
    };

    try {
        console.log("1. Logging in as Admin...");
        const loginRes = await post("/login", {
            email: "admin@skillduels.com",
            password: "adminpassword123"
        });

        if (loginRes.status !== 200) throw new Error(`Login failed: ${loginRes.data.message}`);

        const { token, refreshToken } = loginRes.data;
        console.log("Login Successful!");
        console.log(`- Access Token: ${token.substring(0, 20)}...`);
        console.log(`- Refresh Token: ${refreshToken.substring(0, 20)}...`);

        console.log("\n2. Using Refresh Token to get new Access Token...");
        const refreshRes = await post("/refresh", { refreshToken });

        if (refreshRes.status !== 200) throw new Error(`Refresh failed: ${refreshRes.data.message}`);

        const newToken = refreshRes.data.token;
        console.log("Refresh Successful!");
        console.log(`- New Access Token: ${newToken.substring(0, 20)}...`);

        if (token !== newToken) {
            console.log("SUCCESS: New token is different from old token.");
        } else {
            console.log("WARNING: New token is same as old token (might be expected if not expired, but usually different).");
        }

        console.log("\n3. Logging out...");
        const logoutRes = await post("/logout", { refreshToken });
        if (logoutRes.status !== 200) throw new Error(`Logout failed: ${logoutRes.data.message}`);
        console.log("Logout Successful!");

        console.log("\n4. Trying to use invalidated Refresh Token...");
        const invalidRefreshRes = await post("/refresh", { refreshToken });

        if (invalidRefreshRes.status === 403) {
            console.log("SUCCESS: Refresh token correctly rejected (403 Forbidden).");
        } else {
            console.log(`FAILURE: Expected 403, got ${invalidRefreshRes.status}`);
        }

    } catch (error) {
        console.error("Error verifying refresh token:", error.message);
        if (error.cause) console.error("Cause:", error.cause);
    }
};

verifyRefreshToken();
