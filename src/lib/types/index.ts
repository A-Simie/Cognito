


export interface UserStats {
  currentStreak: number;
  totalMinutesSpent: number;
  lessonsCompleted: number;
  globalRank: number;
  weeklyGoalHours: number;
  lastActiveAt: string;
}

export interface User {
  email: string;
  fullName: string;
  profilePicture?: string;
  availableToken: number;
  createdAt: string;
  stats: UserStats;
}

export interface AuthResponse {
  token: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  fullName: string;
  password: string;
}

export interface OtpRequest {
  otp: string;
  email: string;
}

export interface LessonUnit {
  id: string; // Added ID
  unitType?: string;
  unitOrder: number;
  title: string;
  unitStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  lessonObjective?: string;
  youtubeUrl?: string;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
  createdAt?: string;
}

export interface Class {
  id: number;
  title: string;
  learningMode: 'TOPIC_TUTOR' | 'YOUTUBE_TUTOR' | 'PDF_TUTOR';
  classStatus: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  classCompletionPercentage: number;
  lessons: number;
  createdAt: string;
  updatedAt: string;
  youtubeLessonUnits?: LessonUnit[];
  lessonUnits?: LessonUnit[];
  pdfLessonUnits?: LessonUnit[];
}
