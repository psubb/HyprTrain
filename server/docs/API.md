# HyprTrain API Documentation

This API powers the backend for the HyprTrain workout tracking app. All routes require authentication unless explicitly stated otherwise. JWTs must be passed via the `Authorization` header.

---

## Auth Routes

### `POST /register`

Registers a new user account.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response**
- `201 Created`
```json
{
  "message": "User Created",
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "timestamp"
  }
}
```

**Errors**
- `400 Bad Request`
- `409 Conflict`
- `500 Internal Server Error`

---

### `POST /login`

Authenticates a user and returns a token.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response**
- `200 OK`
```json
{
  "message": "Successful Login!",
  "accessToken": "JWT_TOKEN_HERE",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "timestamp"
  }
}
```

**Errors**
- `400 Bad Request`
- `401 Unauthorized`
- `500 Internal Server Error`

---

## Program Routes

> Requires Header: `Authorization: Bearer <JWT_TOKEN>`

### `POST /programs`

Creates a new program for the user.

**Request Body**
```json
{
  "name": "Push Pull Legs",
  "duration_weeks": 8
}
```

**Response**
- `201 Created`
```json
{
  "message": "Program created successfully",
  "program": {
    "id": "uuid",
    "name": "Push Pull Legs",
    "duration_weeks": 8
  }
}
```

**Errors**
- `401 Unauthorized`
- `400 Bad Request`

---

## Workout Day Routes

> Requires Header: `Authorization: Bearer <JWT_TOKEN>`

### `POST /programs/:id/workout-days`

Creates recurring workout days for a program.

**Request Body**
```json
{
  "daysOfWeek": [1, 3, 5],
  "durationWeeks": 8
}
```

**Response**
- `201 Created`
```json
{
  "message": "Workout days created succesfully",
  "workoutDays": [ ... ]
}
```

**Errors**
- `401 Unauthorized`
- `400 Bad Request`

---

## Workout Exercise Routes

> Requires Header: `Authorization: Bearer <JWT_TOKEN>`

### `POST /workout-days/:id/exercises`

Adds exercises to a workout day and auto-generates two default sets per exercise.

**Request Body**
```json
{
  "dayOfWeek": 1,
  "exercises": [
    {
      "exerciseId": "uuid-ex-1",
      "orderIndex": 0
    },
    {
      "exerciseId": "uuid-ex-2",
      "orderIndex": 1
    }
  ]
}
```

**Response**
- `201 Created`
```json
{
  "message": "Exercises inserted"
}
```

**Errors**
- `401 Unauthorized`
