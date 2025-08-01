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

### `GET /programs/active`

Returns the currently active program for the authenticated user.

**Authentication:** Required  
**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response**

- `200 OK`

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Push Pull Legs",
  "duration_weeks": 8,
  "is_active": true,
  "created_at": "2025-07-30T00:00:00.000Z"
}
```

**Errors**

- `401 Unauthorized`
- `500 Internal Server Error`

### `GET /programs/:id/active-day`

Fetches the currently active workout day for a given program.

**Authentication:** Required  
**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**URL Params**

- `id` (string): UUID of the program

**Response**

- `200 OK`
```json
{
  "id": "uuid",
  "program_id": "uuid",
  "day_of_week": 1,
  "week_number": 2,
  "is_completed": false,
  "is_active": true
}
```

**Errors**

- `401 Unauthorized`
- `404 Not Found` – No active day found for the specified program
- `500 Internal Server Error`

### `GET /workout-days/:id/log`

Returns the full logging structure for a workout day, including exercises, sets, logs, and notes.

**Authentication:** Required  
**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**URL Params**

- `id` (string): UUID of the workout day

**Response**

- `200 OK`
```json
{
  "id": "uuid",
  "week_number": 2,
  "day_of_week": 1,
  "daily_note": "optional note",
  "exercises": [
    {
      "id": "workout_exercise_id",
      "exercise_id": "uuid",
      "name": "Bench Press",
      "order_index": 0,
      "note": "optional note",
      "sets": [
        {
          "id": "exercise_set_id",
          "set_number": 1,
          "log": {
            "reps": 10,
            "weight": 135,
            "rpe": 7.5,
            "completed": true
          },
          "previous_log": {
            "reps": 9,
            "weight": 130,
            "rpe": 7.0,
            "completed": true
          }
        }
      ]
    }
  ]
}
```

**Errors**

- `401 Unauthorized`
- `404 Not Found` – Workout day not found or doesn't belong to user
- `500 Internal Server Error`


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

---

## Exercise Routes

> Requires Header: `Authorization: Bearer <JWT_TOKEN>`

### `POST /exercises`

Creates a new custom exercise for the authenticated user.

**Request Body**

```json
{
  "exerciseName": "Incline Dumbbell Press",
  "muscleGroupId": "38ab4249-0091-4c2e-ba2c-3bc6a22a196f"
}
```

**Response**

- `201 Created`

```json
{
  "id": "uuid",
  "name": "Incline Dumbbell Press",
  "muscle_group_id": "38ab4249-0091-4c2e-ba2c-3bc6a22a196f",
  "user_id": "uuid",
  "is_default": false,
  "is_deleted": false
}
```

**Errors**

- `400 Bad Request` – Exercise name is empty or already exists
- `401 Unauthorized`

### `DELETE /exercises/:id`

Soft-deletes a custom exercise owned by the authenticated user.

**URL Params**

- `id` (string): UUID of the exercise to delete

**Response**

- `200 OK`

```json
{
  "id": "uuid",
  "name": "Incline Dumbbell Press",
  "muscle_group_id": "38ab4249-0091-4c2e-ba2c-3bc6a22a196f",
  "user_id": "uuid",
  "is_default": false,
  "is_deleted": true
}
```

**Errors**

- `400 Bad Request` – Exercise not found or already deleted
- `401 Unauthorized`

### `GET /exercises/custom`

Returns all active (non-deleted) custom exercises for the authenticated user.

**Authentication:** Required\
**Content-Type:** `application/json`\
**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Response**

- `200 OK`

```json
[
  {
    "id": "a26e0c43-43c5-45cb-a8ad-c1c96a7ac8fc",
    "name": "Incline Dumbbell Press",
    "muscle_group_id": "38ab4249-0091-4c2e-ba2c-3bc6a22a196f",
    "user_id": "user-uuid",
    "is_default": false,
    "is_deleted": false
  },
  {
    "id": "b82c143b-93af-4d11-a91e-b2f5a01c9a99",
    "name": "Bent Over Row",
    "muscle_group_id": "d10b6a62-193e-4b5b-a9ef-1741ac6d2a6e",
    "user_id": "user-uuid",
    "is_default": false,
    "is_deleted": false
  }
]
```

**Errors**

- `401 Unauthorized`
- `500 Internal Server Error`

### `GET /exercises?muscle_group_id=...`

Fetches all exercises (default + custom) for a given muscle group. Only exercises that are not deleted will be returned.

**Authentication:** Required  
**Query Params:**

- `muscle_group_id` (UUID): The muscle group ID to filter exercises by

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response**

- `200 OK`

```json
[
  {
    "id": "uuid",
    "name": "Bench Press",
    "muscle_group_id": "uuid",
    "user_id": null,
    "is_default": true,
    "is_deleted": false
  },
  {
    "id": "uuid",
    "name": "Incline Dumbbell Press",
    "muscle_group_id": "uuid",
    "user_id": "user-uuid",
    "is_default": false,
    "is_deleted": false
  }
]
```

**Errors**

- `400 Bad Request` – Missing or invalid muscle_group_id
- `401 Unauthorized`
- `500 Internal Server Error`
