# Quick Reference Guide

## 🎬 YouTube Integration

### Using YouTube Duration Detection

```typescript
import { extractYouTubeVideoId, loadYouTubeAPI, getYouTubeDuration } from '@/lib/utils/youtube';
import { classService } from '@/lib/services/classService';

async function createYouTubeClass(youtubeUrl: string) {
    try {
        // 1. Load YouTube API
        await loadYouTubeAPI();
        
        // 2. Extract video ID
        const videoId = extractYouTubeVideoId(youtubeUrl);
        if (!videoId) {
            throw new Error('Invalid YouTube URL');
        }
        
        // 3. Get duration
        const duration = await getYouTubeDuration(videoId);
        
        // 4. Create class
        const newClass = await classService.createYoutubeClass(youtubeUrl, duration);
        
        return newClass;
    } catch (error) {
        console.error('Failed to create YouTube class:', error);
        throw error;
    }
}
```

---

## ✅ Zod Validation

### Using Validation Schemas

```typescript
import { SignupSchema, LoginSchema } from '@/lib/validation/schemas';

// Example 1: Validate signup data
function handleSignup(formData: unknown) {
    try {
        const validated = SignupSchema.parse(formData);
        // validated is now type-safe: { email: string, fullName: string, password: string }
        await authService.signup(validated);
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Handle validation errors
            console.error(error.errors);
        }
    }
}

// Example 2: Safe parse (doesn't throw)
function validateLogin(formData: unknown) {
    const result = LoginSchema.safeParse(formData);
    
    if (result.success) {
        // result.data is validated
        await authService.login(result.data);
    } else {
        // result.error contains validation errors
        console.error(result.error.errors);
    }
}
```

---

## 💬 WebSocket Clarification Flow

### Using Clarification in Components

```typescript
import { useLessonWebSocket } from '@/hooks/useLessonWebSocket';

function MyLessonComponent() {
    const {
        steps,
        sendMessage,
        clarificationResponse,
        isLoadingClarification,
        clearClarification,
    } = useLessonWebSocket(sessionId);
    
    // Send a question
    const askQuestion = (question: string) => {
        sendMessage('USER_QUESTION', { questionText: question });
    };
    
    // Display loading state
    if (isLoadingClarification) {
        return <div>AI is thinking...</div>;
    }
    
    // Display clarification response
    if (clarificationResponse) {
        return (
            <div>
                <p>{clarificationResponse.stepPayload.textToSpeak}</p>
                <button onClick={clearClarification}>Clear</button>
            </div>
        );
    }
    
    return <button onClick={() => askQuestion('Explain this')}>Ask Question</button>;
}
```

---

## 🔐 Authentication Flow

### Complete Auth Example

```typescript
import { useAuth } from '@/lib/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const { loginMutation } = useAuth();
    const navigate = useNavigate();
    
    const handleLogin = async (email: string, password: string) => {
        try {
            // This will:
            // 1. Call POST /login
            // 2. Send OTP to email
            // 3. Navigate to /verify-login?email=...
            await loginMutation.mutateAsync({ email, password });
        } catch (error) {
            console.error('Login failed:', error);
        }
    };
    
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleLogin(
                formData.get('email') as string,
                formData.get('password') as string
            );
        }}>
            <input name="email" type="email" required />
            <input name="password" type="password" required />
            <button type="submit">Login</button>
        </form>
    );
}
```

---

## 📚 Class Management

### Creating Classes

```typescript
import { classService } from '@/lib/services/classService';

// Topic Class
async function createTopicClass(topic: string) {
    const newClass = await classService.createTopicClass(topic);
    console.log('Created class:', newClass);
}

// YouTube Class (with duration detection)
async function createYouTubeClass(url: string) {
    await loadYouTubeAPI();
    const videoId = extractYouTubeVideoId(url);
    const duration = await getYouTubeDuration(videoId!);
    const newClass = await classService.createYoutubeClass(url, duration);
    console.log('Created YouTube class:', newClass);
}

// PDF Class
async function createPdfClass(file: File) {
    const newClass = await classService.createPdfClass(file);
    console.log('Created PDF class:', newClass);
}

// Get all classes
async function getMyClasses() {
    const classes = await classService.getClasses();
    console.log('My classes:', classes);
}

// Get recent classes
async function getRecentClasses() {
    const recent = await classService.getRecentClasses();
    console.log('Recent classes:', recent);
}
```

---

## 🎓 Starting a Lesson

### Lesson Session Flow

```typescript
import { classService } from '@/lib/services/classService';
import { useNavigate } from 'react-router-dom';

async function startLesson(classId: number, unitIndex: number = 0) {
    try {
        // 1. Start lesson and get session ID
        const { sessionId } = await classService.startLesson(classId, unitIndex);
        
        // 2. Navigate to lesson session
        navigate(`/lesson/${sessionId}`);
        
        // 3. WebSocket will auto-connect in LessonSession component
    } catch (error) {
        console.error('Failed to start lesson:', error);
    }
}
```

---

## 🔧 Environment Variables

Make sure these are set in your `.env` file:

```env
VITE_API_BASE_URL=https://ubiquitous-waffle-6qvpjpg6gwxhpw6-8080.app.github.dev/cognito/api/v1
VITE_WS_URL=wss://ubiquitous-waffle-6qvpjpg6gwxhpw6-8080.app.github.dev/ws/lesson/
```

---

## 🐛 Common Issues & Solutions

### Issue: "No auth token found for WS connection"
**Solution:** User is not authenticated. Redirect to login.

```typescript
const token = Cookies.get('auth_token');
if (!token) {
    navigate('/login');
}
```

### Issue: YouTube API not loading
**Solution:** Ensure `loadYouTubeAPI()` is called before using duration detection.

```typescript
await loadYouTubeAPI(); // Must be called first
const duration = await getYouTubeDuration(videoId);
```

### Issue: Validation errors not showing
**Solution:** Use `safeParse()` to handle errors gracefully.

```typescript
const result = SignupSchema.safeParse(formData);
if (!result.success) {
    // Show errors to user
    result.error.errors.forEach(err => {
        console.log(`${err.path}: ${err.message}`);
    });
}
```

---

## 📝 Type Safety

All services return properly typed data:

```typescript
// User type
const user: User = await authService.getCurrentUser();
console.log(user.email, user.stats.currentStreak);

// Class type
const myClass: Class = await classService.createTopicClass('AI Basics');
console.log(myClass.id, myClass.learningMode);

// Lesson step type
const step: LessonStep = steps[0];
console.log(step.stepType, step.stepPayload.textToSpeak);
```

---

## 🚀 Production Checklist

Before deploying:

- [ ] Update `VITE_API_BASE_URL` to production URL
- [ ] Update `VITE_WS_URL` to production WebSocket URL
- [ ] Test all authentication flows
- [ ] Test WebSocket connection and reconnection
- [ ] Test YouTube duration detection
- [ ] Test PDF upload
- [ ] Verify error handling and user feedback
- [ ] Run `npm run build` to check for build errors
- [ ] Test in production environment

---

## 📚 Additional Resources

- **Backend API Docs:** `FRONTEND_INTEGRATION_GUIDE.md`
- **Completion Report:** `INTEGRATION_COMPLETION_REPORT.md`
- **Type Definitions:** `src/lib/types/index.ts`
- **Validation Schemas:** `src/lib/validation/schemas.ts`
