# Cognito Backend API Documentation
## Complete Frontend Integration Guide

**Base URL:** `/cognito/api/v1`  
**WebSocket URL:** `ws://[host]/ws/lesson/{sessionId}?token={JWT_TOKEN}`

---

## Table of Contents
1. [Authentication Flow](#1-authentication-flow)
2. [User Management](#2-user-management)
3. [Class Management](#3-class-management)
4. [Lesson Session (WebSocket)](#4-lesson-session-websocket)
5. [YouTube Mode](#5-youtube-mode)
6. [PDF Mode](#6-pdf-mode)
7. [Data Models](#7-data-models)
8. [Error Handling](#8-error-handling)

---

# 1. Authentication Flow

All endpoints (except signup/login) require JWT token in header:
```
Authorization: Bearer {JWT_TOKEN}
```

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant BE as Backend
    participant Email as Email Service

    Note over FE,Email: SIGNUP FLOW
    FE->>BE: POST /signup {email, fullName, password}
    BE->>Email: Send OTP
    BE-->>FE: 200 "Otp Sent Successfully"
    FE->>BE: POST /verify-signup?otp=XXXXXX&email=user@email.com
    BE-->>FE: 200 {JWT_TOKEN}

    Note over FE,Email: LOGIN FLOW
    FE->>BE: POST /login {email, password}
    BE->>Email: Send OTP
    BE-->>FE: 200 "Otp Sent Successfully"
    FE->>BE: POST /verify-login?otp=XXXXXX&email=user@email.com
    BE-->>FE: 200 {JWT_TOKEN}
```

### 1.1 Signup
**`POST /signup`**

**Request Body:**
```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```
"Otp Sent Successfully"
```

---

### 1.2 Verify Signup
**`POST /verify-signup`**

**Query Parameters:**
| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `otp`     | String | ✅       | 8-digit OTP from email |
| `email`   | String | ✅       | User's email address |

**Response:** `200 OK`
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
> Returns JWT token as plain text

---

### 1.3 Login
**`POST /login`**

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```
"Otp Sent Successfully"
```

---

### 1.4 Verify Login
**`POST /verify-login`**

**Query Parameters:**
| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `otp`     | String | ✅       | 8-digit OTP from email |
| `email`   | String | ✅       | User's email address |

**Response:** `200 OK`
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 1.5 Reset Password
**`POST /resetPassword`**

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```
"Otp Sent Successfully"
```

---

### 1.6 Verify Reset Password
**`POST /verify-resetPassword`**

**Query Parameters:**
| Parameter     | Type   | Required | Description |
|---------------|--------|----------|-------------|
| `otp`         | String | ✅       | 8-digit OTP |
| `email`       | String | ✅       | User's email |
| `newPassword` | String | ✅       | New password |

**Response:** `200 OK`
```
"Password Reset Successfully"
```

---

# 2. User Management

### 2.1 Get Current User
**`GET /me`** 🔒 *Requires Auth*

**Response:** `200 OK`
```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "profilePicture": "https://...",
  "availableToken": 1000,
  "createdAt": "2026-01-15T10:30:00",
  "stats": {
    "currentStreak": 5,
    "totalMinutesSpent": 3600,
    "lessonsCompleted": 12,
    "globalRank": 156,
    "weeklyGoalHours": 10,
    "lastActiveAt": "2026-02-01T14:00:00"
  }
}
```

---

### 2.2 Update Profile
**`PUT /users/me`** 🔒 *Requires Auth*

**Request Body:**
```json
{
  "base64Image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "weeklyGoalHours": 15
}
```
> Both fields are optional

**base64Image Format:**
- Must include data URI prefix: `data:image/{type};base64,{data}`
- Supported types: `png`, `jpeg`, `jpg`, `gif`, `webp`

**Response:** `200 OK`
```
"Profile Updated Successfully"
```

---

# 3. Class Management

```mermaid
flowchart LR
    A[Create Class] --> B[Start Lesson]
    B --> C[WebSocket Session]
```

> **Note:** Lesson units are included in the `MyClass` response when creating a class. No separate endpoint needed.

### 3.1 Create Topic Class
**`POST /topic_class_creation`** 🔒 *Requires Auth*

Creates a new class based on a topic. AI generates syllabus automatically.

**Request Body:** Plain text (topic string)
```
"Introduction to Machine Learning"
```

**Response:** `200 OK`
```json
{
  "id": 123,
  "title": "Introduction to Machine Learning",
  "learningMode": "TOPIC_TUTOR",
  "classStatus": "ACTIVE",
  "classCompletionPercentage": 0.0,
  "lessons": 5,
  "lessonUnits": [
    {
      "unitType": "LESSON",
      "unitOrder": 0,
      "title": "What is Machine Learning?",
      "unitStatus": "NOT_STARTED",
      "lessonObjective": "Understand the fundamentals...",
      "createdAt": "2026-02-01T10:00:00"
    },
    {
      "unitType": "LESSON",
      "unitOrder": 1,
      "title": "Supervised Learning",
      "unitStatus": "NOT_STARTED",
      "lessonObjective": "Learn about supervised...",
      "createdAt": "2026-02-01T10:00:00"
    }
  ],
  "createdAt": "2026-02-01T10:00:00",
  "updatedAt": "2026-02-01T10:00:00"
}
```

**Errors:**
| Status | Message | Cause |
|--------|---------|-------|
| 400 | Class limit exceeded | User has 3 active classes |
| 409 | User not found | Invalid JWT |

---

### 3.2 Create YouTube Class
**`POST /youtube_class_creation`** 🔒 *Requires Auth*

Creates a class from YouTube video. Video is split into 10-minute lesson segments.

**Request Body:**
```json
{
  "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "videoDurationSeconds": 900
}
```

> ⚠️ **Important:** Frontend must detect video duration using YouTube IFrame API before sending.

**Response:** `200 OK`
```json
{
  "id": 456,
  "title": "YouTube: dQw4w9WgXcQ",
  "learningMode": "YOUTUBE_TUTOR",
  "classStatus": "ACTIVE",
  "classCompletionPercentage": 0.0,
  "lessons": 2,
  "youtubeLessonUnits": [
    {
      "unitOrder": 1,
      "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "startTimeSeconds": 0,
      "endTimeSeconds": 600,
      "title": "YouTube Lesson 1",
      "unitStatus": "NOT_STARTED"
    },
    {
      "unitOrder": 2,
      "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "startTimeSeconds": 600,
      "endTimeSeconds": 900,
      "title": "YouTube Lesson 2",
      "unitStatus": "NOT_STARTED"
    }
  ]
}
```

**Errors:**
| Status | Message | Cause |
|--------|---------|-------|
| 400 | Invalid YouTube URL | URL format not recognized |
| 400 | Video must be at least 1 minute | Duration < 60 seconds |
| 400 | Class limit exceeded | User has 3 active classes |

---

### 3.3 Create PDF Class
**`POST /pdf_class_creation`** 🔒 *Requires Auth*

Creates a class from uploaded PDF. PDF is split into 2-page chunks per lesson unit.

**Request:** `multipart/form-data`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | ✅ | PDF file to upload |

**Response:** `200 OK`
```json
{
  "id": 789,
  "title": "document.pdf",
  "learningMode": "PDF_TUTOR",
  "classStatus": "ACTIVE",
  "lessons": 5,
  "pdfLessonUnits": [
    { "unitOrder": 1, "title": "Pages 1-2", "unitStatus": "NOT_STARTED" },
    { "unitOrder": 2, "title": "Pages 3-4", "unitStatus": "NOT_STARTED" }
  ]
}
```

---

### 3.4 Get User's Classes
**`GET /classes`** 🔒 *Requires Auth*

**Response:** `200 OK`
```json
[
  {
    "id": 123,
    "title": "Introduction to Machine Learning",
    "learningMode": "TOPIC_TUTOR",
    "classStatus": "ACTIVE",
    "classCompletionPercentage": 40.0,
    "lessons": 5,
    "createdAt": "2026-02-01T10:00:00",
    "updatedAt": "2026-02-01T12:00:00"
  }
]
```

---

### 3.5 Get Recent Classes
**`GET /classes/recent`** 🔒 *Requires Auth*

Returns last 5 recently accessed classes.

**Response:** Same as 3.4

---

### 3.6 Start Lesson
**`POST /lessons/start`** 🔒 *Requires Auth*

Initializes a lesson session and returns session ID for WebSocket connection.

**Request Body:**
```json
{
  "classId": 123,
  "unitIndex": 0
}
```
> `unitIndex` is optional, defaults to `0` (first lesson)

**Response (Topic/PDF Mode):** `200 OK`
```json
{
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Response (YouTube Mode):** `200 OK`
```json
{
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "startTimeSeconds": 0,
  "endTimeSeconds": 600
}
```

> ⚠️ **Session Resumption:** If user already has active session for same class, returns existing `sessionId`.

**Errors:**
| Status | Message | Cause |
|--------|---------|-------|
| 400 | Invalid unit index | `unitIndex` out of range |
| 409 | Active session for different class | Must complete other session first |

---

# 4. Lesson Session (WebSocket)

## Connection

**URL:** `ws://[host]/ws/lesson/{sessionId}?token={JWT_TOKEN}`

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant WS as WebSocket
    participant AI as AI Engine

    FE->>WS: Connect with sessionId + JWT
    
    alt Steps Ready
        WS-->>FE: NEXT_STEP
        WS-->>FE: AUDIO_CHUNK (streaming)
        WS-->>FE: AUDIO_END
    else Steps Generating
        WS-->>FE: INITIALIZING
        AI->>WS: Steps Generated Event
        WS-->>FE: NEXT_STEP
    end

    loop Lesson Flow
        FE->>WS: STEP_COMPLETED
        WS-->>FE: NEXT_STEP / SESSION_COMPLETED
    end

    opt User Question
        FE->>WS: USER_QUESTION
        WS-->>FE: LOAD_INSTRUCTION
        AI->>WS: Clarification Generated
        WS-->>FE: CLARIFICATION_RESPONSE
    end
```

---

## 4.1 Messages FROM Frontend → Backend

### STEP_COMPLETED
Sent when user finishes current step.

```json
{
  "type": "STEP_COMPLETED",
  "data": {}
}
```

---

### USER_QUESTION
Ask clarification during lesson.

```json
{
  "type": "USER_QUESTION",
  "data": {
    "questionText": "Can you explain neural networks again?",
    "audioData": "base64EncodedAudio..."
  }
}
```
> `audioData` is optional (for voice questions)

---

### PING
Keep-alive heartbeat.

```json
{
  "type": "PING"
}
```

---

## 4.2 Messages FROM Backend → Frontend

### INITIALIZING
Lesson steps are being generated.

```json
{
  "type": "INITIALIZING",
  "message": "Preparing your lesson..."
}
```

---

### NEXT_STEP
Delivers lesson content.

```json
{
  "type": "NEXT_STEP",
  "step": {
    "stepType": "NORMAL",
    "stepPayload": {
      "textToSpeak": "Machine learning is a subset of AI...",
      "canvasHtmlContent": "<div class='lesson'>...</div>",
      "quizzesJson": [
        {
          "question": "What is supervised learning?",
          "options": [
            "Learning with labeled data",
            "Learning without data",
            "Learning with unlabeled data",
            "None of the above"
          ],
          "correctAnswerIndex": 0
        }
      ]
    }
  }
}
```

**Step Types:**
| Type | Description |
|------|-------------|
| `NORMAL` | Regular lesson step |
| `CLARIFICATION` | Response to user question |
| `CONCLUSION` | Final step of lesson |

---

### AUDIO_CHUNK
Streamed audio for text-to-speech.

```json
{
  "type": "AUDIO_CHUNK",
  "chunkIndex": 0,
  "audioData": "base64EncodedOggOpusData...",
  "isLast": false,
  "encoding": "ogg-opus"
}
```

> **Audio Handling:**
> - Chunks arrive in order (`chunkIndex`)
> - Buffer and play sequentially
> - `isLast: true` indicates final chunk

---

### AUDIO_END
All audio chunks delivered.

```json
{
  "type": "AUDIO_END",
  "totalChunks": 12
}
```

---

### AUDIO_ERROR
Audio generation failed.

```json
{
  "type": "AUDIO_ERROR",
  "message": "Failed to generate audio"
}
```

---

### LOAD_INSTRUCTION
Processing user question.

```json
{
  "type": "LOAD_INSTRUCTION",
  "message": "Generating answer..."
}
```

---

### CLARIFICATION_RESPONSE
Answer to user question (priority delivery).

```json
{
  "type": "CLARIFICATION_RESPONSE",
  "priority": true,
  "step": {
    "stepType": "CLARIFICATION",
    "stepPayload": {
      "textToSpeak": "Great question! Neural networks are...",
      "canvasHtmlContent": "<div class='clarification'>...</div>",
      "quizzesJson": null
    }
  }
}
```

---

### SESSION_COMPLETED
Lesson finished successfully.

```json
{
  "type": "SESSION_COMPLETED",
  "message": "Congratulations! You've completed the lesson.",
  "stats": {
    "totalStepsConsumed": 8,
    "durationSeconds": 1800
  }
}
```

---

### PONG
Response to PING.

```json
{
  "type": "PONG"
}
```

---

### ERROR
Something went wrong.

```json
{
  "type": "ERROR",
  "message": "Error description"
}
```

---

# 5. YouTube Mode

YouTube mode has a **different WebSocket flow**. Video plays until AI-specified pause points.

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant WS as WebSocket
    participant AI as AI Engine

    FE->>WS: Connect with sessionId + JWT
    WS-->>FE: YOUTUBE_STEP {pauseAtSeconds: 45}
    
    Note over FE: Play video until 45s
    Note over FE: Video pauses automatically
    
    FE->>WS: REQUEST_TTS {textToSpeak}
    WS-->>FE: AUDIO_CHUNK (streaming)
    WS-->>FE: AUDIO_END
    
    FE->>WS: YOUTUBE_STEP_COMPLETED
    WS-->>FE: YOUTUBE_STEP {pauseAtSeconds: 120}
    
    Note over FE,WS: ...repeat...
    
    WS-->>FE: YOUTUBE_LESSON_COMPLETED
```

## 5.1 YouTube Messages FROM Frontend → Backend

### YOUTUBE_STEP_COMPLETED
User finished viewing current step, request next.

```json
{
  "type": "YOUTUBE_STEP_COMPLETED"
}
```

---

### REQUEST_TTS
Request audio for current step (YouTube mode does NOT auto-stream audio).

```json
{
  "type": "REQUEST_TTS",
  "data": {
    "textToSpeak": "Notice how the presenter explains..."
  }
}
```

> ⚠️ **Important:** YouTube mode requires manual TTS request because audio should play AFTER video pauses, not during.

---

### USER_QUESTION
Same as Topic mode.

---

## 5.2 YouTube Messages FROM Backend → Frontend

### YOUTUBE_STEP
Pause video at specific timestamp.

```json
{
  "type": "YOUTUBE_STEP",
  "pauseAtSeconds": 45,
  "textToSpeak": "Notice how the presenter explains the concept...",
  "quizzesJson": "[{\"question\":\"What is X?\",\"options\":[\"A\",\"B\"]}]"
}
```

> **Frontend should:**
> 1. Play video until `pauseAtSeconds`
> 2. Pause video
> 3. Display explanation / quiz
> 4. Request TTS if needed
> 5. Send `YOUTUBE_STEP_COMPLETED` when done

---

### YOUTUBE_STEP_LOADING
Next step is being generated.

```json
{
  "type": "YOUTUBE_STEP_LOADING"
}
```

---

### YOUTUBE_LESSON_COMPLETED
Video segment lesson finished.

```json
{
  "type": "YOUTUBE_LESSON_COMPLETED",
  "sessionId": "abc123"
}
```

---

# 6. PDF Mode

PDF mode uses the **same WebSocket flow as Topic mode**. Steps are generated from PDF content.

| Message Type | PDF Mode | Topic Mode |
|--------------|----------|------------|
| Receive step | `NEXT_STEP` | `NEXT_STEP` |
| Complete step | `STEP_COMPLETED` | `STEP_COMPLETED` |
| Ask question | `USER_QUESTION` | `USER_QUESTION` |
| Auto TTS | ✅ Yes | ✅ Yes |
| Session end | `SESSION_COMPLETED` | `SESSION_COMPLETED` |

> PDF content is automatically passed to AI as context for each lesson unit.

---

# 7. Data Models

## 7.1 Enums

### LearningMode
```typescript
type LearningMode = "TOPIC_TUTOR" | "PDF_TUTOR" | "YOUTUBE_TUTOR";
```

### ClassStatus
```typescript
type ClassStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";
```

### UnitStatus
```typescript
type UnitStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
```

### UnitType
```typescript
type UnitType = "LESSON" | "QUIZ" | "RECAP";
```

### StepType
```typescript
type StepType = "NORMAL" | "CLARIFICATION" | "CONCLUSION";
```

---

## 7.2 TypeScript Interfaces

```typescript
interface MyClass {
  id: number;
  title: string;
  learningMode: LearningMode;
  classStatus: ClassStatus;
  classCompletionPercentage: number;
  lessons: number;
  lessonUnits?: LessonUnit[];
  youtubeLessonUnits?: YouTubeLessonUnit[];
  pdfLessonUnits?: PdfLessonUnit[];
  createdAt: string;
  updatedAt: string;
}

interface LessonUnit {
  unitType: UnitType;
  unitOrder: number;
  title: string;
  unitStatus: UnitStatus;
  lessonObjective: string;
  createdAt: string;
}

interface YouTubeLessonUnit {
  unitOrder: number;
  youtubeUrl: string;
  startTimeSeconds: number;
  endTimeSeconds: number;
  title: string;
  unitStatus: UnitStatus;
}

interface PdfLessonUnit {
  unitOrder: number;
  title: string;
  unitStatus: UnitStatus;
}

interface PlanStep {
  stepType: StepType;
  stepPayload: StepPayload;
}

interface StepPayload {
  textToSpeak: string;
  canvasHtmlContent: string | null;
  quizzesJson: QuizQuestion[] | null;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

interface UserDTO {
  email: string;
  fullName: string;
  profilePicture: string | null;
  availableToken: number;
  createdAt: string;
  stats: UserLearningStats;
}

interface UserLearningStats {
  currentStreak: number;
  totalMinutesSpent: number;
  lessonsCompleted: number;
  globalRank: number;
  weeklyGoalHours: number;
  lastActiveAt: string;
}

interface LessonStartRequest {
  classId: number;
  unitIndex?: number;
}

interface LessonStartResponse {
  sessionId: string;
  youtubeUrl?: string;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
}

interface WebSocketMessage {
  type: string;
  data?: Record<string, any>;
}

interface YouTubeStep {
  pauseAtSeconds: number;
  textToSpeak: string;
  quizzesJson: string;
}
```

---

# 8. Error Handling

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `400` | Bad Request (validation error, class limit, invalid index) |
| `401` | Unauthorized (missing/invalid token) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found |
| `409` | Conflict (active session for different class) |
| `500` | Internal Server Error |

## Error Response Format

```json
{
  "timestamp": "2026-02-03T21:44:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid unit index: 99",
  "path": "/cognito/api/v1/lessons/start"
}
```

## WebSocket Error Handling

```mermaid
flowchart TD
    A[WebSocket Message] --> B{Valid?}
    B -->|Yes| C[Process]
    B -->|No| D[Send ERROR]
    D --> E["{ type: 'ERROR', message: '...' }"]
```

---

# Complete Flow Diagram

```mermaid
flowchart TB
    subgraph Auth ["🔐 Authentication"]
        A1[Signup/Login] --> A2[Verify OTP]
        A2 --> A3[Get JWT Token]
    end

    subgraph Class ["📚 Class Management"]
        B1[Create Topic Class] --> B2[AI Generates Syllabus]
        B1a[Create YouTube Class] --> B2a[Split into 10-min Units]
        B1b[Create PDF Class] --> B2b[Split into 2-page Units]
        B2 --> B3[Class with Units Created]
        B2a --> B3
        B2b --> B3
    end

    subgraph Lesson ["🎓 Lesson Session"]
        C1[POST /lessons/start] --> C2[Get sessionId]
        C2 --> C3[Connect WebSocket]
        C3 --> C4{Learning Mode?}
        C4 -->|Topic/PDF| C5[NEXT_STEP + Auto Audio]
        C4 -->|YouTube| C6[YOUTUBE_STEP]
        C5 --> C7[STEP_COMPLETED]
        C6 --> C8[REQUEST_TTS → YOUTUBE_STEP_COMPLETED]
        C7 --> C9{More Steps?}
        C8 --> C9
        C9 -->|Yes| C4
        C9 -->|No| C10[SESSION_COMPLETED]
    end

    A3 --> B1
    A3 --> B1a
    A3 --> B1b
    B3 --> C1
```

---

## Quick Reference Card

| Action | Endpoint | Method |
|--------|----------|--------|
| Signup | `/signup` | POST |
| Verify Signup | `/verify-signup` | POST |
| Login | `/login` | POST |
| Verify Login | `/verify-login` | POST |
| Reset Password | `/resetPassword` | POST |
| Verify Reset | `/verify-resetPassword` | POST |
| Get Current User | `/me` | GET 🔒 |
| Update Profile | `/users/me` | PUT 🔒 |
| Create Topic Class | `/topic_class_creation` | POST 🔒 |
| Create YouTube Class | `/youtube_class_creation` | POST 🔒 |
| Create PDF Class | `/pdf_class_creation` | POST 🔒 |
| Get My Classes | `/classes` | GET 🔒 |
| Get Recent Classes | `/classes/recent` | GET 🔒 |
| Start Lesson | `/lessons/start` | POST 🔒 |
| **WebSocket** | `/ws/lesson/{sessionId}` | WS 🔒 |

🔒 = Requires `Authorization: Bearer {token}` header

---

*Documentation generated: February 3, 2026*  
*Backend Version: Spring Boot 3.5.9*
