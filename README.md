# SkillDuels Backend API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
- **Register**: `POST /auth/register`
  - Body: `{ "username": "test", "email": "test@test.com", "password": "password" }`
- **Login**: `POST /auth/login`
  - Body: `{ "email": "test@test.com", "password": "password" }`
  - Returns: `{ "token": "jwt_token" }`

## Categories & Questions
- **Get Categories**: `GET /categories`
- **Create Category**: `POST /categories` (Admin only)
- **Get Questions by Category**: `GET /questions/:categoryId`
- **Create Question**: `POST /questions` (Admin only)

## Match & Gameplay
- **Start Match**: `POST /match/start`
  - Header: `Authorization: Bearer <token>`
  - Body: `{ "categoryId": "category_id" }`
  - Returns: `{ "matchId": "...", "questions": [...] }`
- **Submit Score**: `POST /match/submit`
  - Header: `Authorization: Bearer <token>`
  - Body: `{ "matchId": "...", "score": 50 }`

## Leaderboard
- **Global**: `GET /leaderboard/global`
- **Weekly**: `GET /leaderboard/weekly`

## Socket.io Events
- **Connection**: Connect to `http://localhost:5000`
- **Join Match**: `emit("join_match", { matchId, userId })`
- **Submit Answer**: `emit("submit_answer", { matchId, userId, questionId, isCorrect })`
- **Score Update**: `on("score_update", { userId, isCorrect })`
