# Cognito

An AI-powered educational platform for self-directed learners, featuring interactive learning modes, an AI tutor named Ajibade, and comprehensive progress tracking.

## ✨ Features

### 🎓 Learning Modes
- **Topic Tutor** - AI generates personalized lessons on any topic you want to learn
- **YouTube Tutor** - Transform any YouTube video into an interactive learning experience with AI-guided explanations
- **PDF Tutor** - Upload documents and get AI-powered summaries, explanations, and interactive lessons

### 🤖 AI-Powered Learning
- **Ajibade AI Tutor** - Your personal AI learning assistant available during lessons
- **Real-time Clarifications** - Ask questions during lessons and get instant AI responses
- **Interactive Whiteboard** - Visual learning with AI-generated content
- **Adaptive Quizzes** - AI-generated quizzes tailored to your learning progress

### 📊 Progress Tracking
- **Learning Streaks** - Track your daily learning consistency
- **Time Analytics** - Monitor total minutes spent learning
- **Completion Tracking** - See your progress across all classes
- **Global Ranking** - Compare your progress with other learners
- **Weekly Goals** - Set and track weekly learning hour targets

### 🎨 User Experience
- **Theme System** - Light, Dark, and System-adaptive themes
- **Responsive Design** - Seamless experience across all devices
- **Real-time Updates** - WebSocket-powered live lesson sessions
- **Toast Notifications** - Elegant feedback for all actions

## 🛠️ Tech Stack

### Frontend
- **React 19** + **TypeScript** - Modern React with full type safety
- **Vite 5** - Lightning-fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework with Lightning CSS engine
- **Framer Motion 11** - Smooth animations and transitions

### State Management & Data
- **Zustand** - Lightweight state management
- **@tanstack/react-query** - Server state management and caching
- **Zod** - Runtime type validation
- **js-cookie** - Cookie management for authentication

### Routing & Navigation
- **React Router 6** - Client-side routing

### UI & Icons
- **Lucide React** - Beautiful, consistent icon set
- **tailwindcss-animate** - Pre-built animation utilities

### Communication
- **HTTP** - HTTP client for API requests
- **WebSocket** - Real-time bidirectional communication for lessons

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Cognito

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URLs
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://your-backend-url.com/cognito/api/v1
VITE_WS_URL=wss://your-backend-url.com/ws/lesson/
```

### Development

```bash
# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Atomic UI components (Button, Card, Input, Avatar, etc.)
│   ├── layout/          # Layout components (Header, AppLayout)
│   ├── features/        # Feature-specific components
│   │   ├── ajibade/     # AI tutor chat interface
│   │   └── lesson/      # Lesson-related components
│   ├── shared/          # Shared reusable components
│   ├── providers/       # Context providers (ThemeProvider)
│   └── dialog/          # Dialog/Modal components
├── config/              # App configuration
│   └── routes.tsx       # Centralized route definitions
├── hooks/               # Custom React hooks
│   ├── useLessonWebSocket.ts  # WebSocket connection for lessons
│   └── useTheme.ts      # Theme management hook
├── lib/
│   ├── services/        # API service layer
│   │   ├── apiClient.ts      # HTTP client with interceptors
│   │   ├── authService.ts    # Authentication endpoints
│   │   └── classService.ts   # Class management endpoints
│   ├── store/           # Zustand stores
│   │   ├── authStore.ts      # Authentication state
│   │   └── toastStore.ts     # Toast notifications state
│   ├── hooks/           # Business logic hooks
│   │   └── useAuth.ts        # Authentication mutations
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   │   └── youtube.ts        # YouTube API utilities
│   ├── validation/      # Zod validation schemas
│   └── constants.ts     # App-wide constants
├── pages/               # Route page components
│   ├── Landing.tsx           # Landing page
│   ├── Login.tsx             # Login page
│   ├── Signup.tsx            # Signup page
│   ├── VerifyOtp.tsx         # OTP verification
│   ├── ForgotPassword.tsx    # Password reset
│   ├── Dashboard.tsx         # Main dashboard
│   ├── Classes.tsx           # Classes overview
│   ├── Settings.tsx          # User settings
│   └── teach-me/             # Topic tutor pages
│       ├── SessionSetup.tsx  # Create new class
│       ├── LessonUnitsList.tsx  # Class curriculum
│       └── LessonSession.tsx    # Active lesson session
└── styles/              # Global styles and CSS

```

## 🗺️ Routes

All routes are centrally configured in `src/config/routes.tsx` with lazy loading for optimal performance.

| Path | Description | Auth Required |
|------|-------------|---------------|
| `/` | Landing page | No |
| `/login` | User login | No |
| `/signup` | User registration | No |
| `/verify-otp` | OTP verification | No |
| `/forgot-password` | Password reset | No |
| `/dashboard` | Main dashboard | Yes |
| `/classes` | All classes | Yes |
| `/teach-me` | Create topic class | Yes |
| `/teach-me/class/units` | View class units | Yes |
| `/teach-me/session/:sessionId` | Active lesson session | Yes |
| `*` | 404 Not Found page | No |
| `/settings` | User settings | Yes |

## 🔐 Authentication Flow

1. **Signup** → Email verification with OTP → Auto-login
2. **Login** → Email verification with OTP → Dashboard
3. **Password Reset** → OTP verification → Set new password → Login

All authentication uses JWT tokens stored in HTTP-only cookies.

## 🎓 Learning Flow

1. **Create Class** - Choose Topic, YouTube, or PDF mode
2. **View Curriculum** - See AI-generated lesson units
3. **Start Lesson** - Begin interactive learning session
4. **Interact with Ajibade** - Ask questions, get clarifications
5. **Complete Quizzes** - Test your understanding
6. **Track Progress** - Monitor your learning journey

## 📡 API Integration

The frontend integrates with a RESTful API and WebSocket server:

- **REST API**: Authentication, class management, user profile
- **WebSocket**: Real-time lesson sessions with AI tutor

See `FRONTEND_INTEGRATION_GUIDE.md` for complete API documentation.

## 🧪 Validation

All API requests are validated using Zod schemas before sending to ensure type safety and data integrity.

See `src/lib/validation/schemas.ts` for all validation schemas.


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT
