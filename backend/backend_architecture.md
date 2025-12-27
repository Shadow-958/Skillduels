# Backend Architecture & Implementation Guide
**Role:** Member 1 (Backend Lead)
**Project:** SkillDuels

This document outlines the backend architecture, database schemas, and API implementation designed to support the SkillDuels platform. It serves as a reference for Frontend Developers and other team members.

---

## 1. Database Architecture (MongoDB)

We use **Mongoose** for object modeling. The database is structured around the following core collections:

### 👤 Users Collection (`users`)
Stores player profiles, authentication data, and progress.
-   **`username`** (String): Unique display name.
-   **`email`** (String): Unique identifier for login.
-   **`passwordHash`** (String): Bcrypt hashed password.
-   **`xp`** (Number): Total experience points (Global Leaderboard).
-   **`weeklyXp`** (Number): XP earned this week (Weekly Leaderboard).
-   **`rank`** (String): Player rank (e.g., "Rookie", "Pro", "Master").
-   **`badges`** (Array): List of earned achievements.
-   **`isAdmin`** (Boolean): Flag for admin privileges.
-   **`refreshToken`** (String): Secure token for session management.

### ❓ Questions Collection (`questions`)
Stores the quiz content.
-   **`category`** (ObjectId): Reference to `Category`.
-   **`text`** (String): The question itself.
-   **`options`** (Array): List of options `{ id, text }`.
-   **`correctOptionId`** (Number): ID of the correct answer.
-   **`difficulty`** (String): "easy", "medium", "hard".

### 📂 Categories Collection (`categories`)
Organizes questions into topics.
-   **`name`** (String): e.g., "Mathematics", "Python".
-   **`description`** (String).

### ⚔️ Matches Collection (`matches`)
Tracks individual game sessions.
-   **`players`** (Array): List of users in the match.
-   **`category`** (ObjectId): The topic being played.
-   **`questions`** (Array): References to the 5 questions used in this match.
-   **`scores`** (Array): Tracks score per user.
-   **`state`** (String): "active", "finished".

---

## 2. Authentication System (JWT)

We implement a secure **Access Token + Refresh Token** strategy.

### Flow
1.  **Register/Login**: User receives two tokens:
    *   **`token`** (Access Token): Short-lived (15 mins). Used for API requests.
    *   **`refreshToken`**: Long-lived (7 days). Stored securely.
2.  **Accessing APIs**: Send `x-auth-token: <token>` in headers.
3.  **Token Expiry**: When the Access Token expires (401 Unauthorized), the frontend should call `/api/auth/refresh` with the `refreshToken` to get a new Access Token.
4.  **Logout**: Invalidates the `refreshToken` server-side.

---

## 3. API Endpoints Overview

### 🔐 Authentication (`/api/auth`)
-   `POST /register`: Create new account.
-   `POST /login`: Authenticate user.
-   `POST /refresh`: Get new Access Token.
-   `POST /logout`: End session.
-   `GET /me`: Get current user profile (XP, Rank, Badges).

### 📚 Quiz Management (`/api/categories`, `/api/questions`)
-   `GET /api/categories`: List all available topics.
-   `GET /api/questions/:categoryId`: (Admin/Internal) Fetch questions.
-   `POST /api/categories`: (Admin) Create new topic.
-   `POST /api/questions`: (Admin) Add new question.

### 🎮 Match & Gameplay (`/api/match`)
-   `POST /start`: Initiates a match. Returns `matchId` and 5 random questions.
-   `POST /submit`: Submits final score. **Automatically updates XP, Rank, and Badges.**

### 🏆 Leaderboards (`/api/leaderboard`)
-   `GET /global`: Top 10 players by total XP.
-   `GET /weekly`: Top 10 players by weekly XP.

---

## 4. Key Logic Implementations

### Leaderboard Calculation
Leaderboards are calculated dynamically using MongoDB queries.
-   **Global**: `User.find().sort({ xp: -1 }).limit(10)`
-   **Weekly**: `User.find().sort({ weeklyXp: -1 }).limit(10)`

### XP & Ranking System
When a score is submitted (`/api/match/submit`):
1.  Score is added to user's `xp` and `weeklyXp`.
2.  **Rank Update**:
    -   XP > 1000 → "Pro"
    -   XP > 5000 → "Master"
3.  **Badge Awarding**:
    -   "Novice" (100 XP)
    -   "Pro Gamer" (1000 XP)
    -   "Perfect Score" (50+ pts in one game)

---

## 5. Setup & Configuration

-   **Environment Variables**: Managed via `.env` (MONGO_URI, JWT_SECRET).
-   **Database Connection**: Uses Mongoose with connection pooling for efficiency (`config/db.js`).
-   **CORS**: Enabled for all origins to allow frontend development.

---

*This architecture ensures a scalable, secure, and feature-rich backend ready for frontend integration.*
