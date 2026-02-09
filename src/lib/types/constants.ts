export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  NIGHT_VISION: 'night-vision',
} as const;

export type Theme = (typeof THEME)[keyof typeof THEME];

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1440,
} as const;

export const LEARNING_MODES = {
  YOUTUBE: 'youtube',
  PDF: 'pdf',
  TEACH_ME: 'teach-me',
} as const;

export type LearningMode = (typeof LEARNING_MODES)[keyof typeof LEARNING_MODES];

export const APP_CONFIG = {
  name: 'Cognito',
  description: 'AI-powered educational platform for self-directed learners',
  maxMessageLength: 500,
  chatScrollBehavior: 'smooth' as ScrollBehavior,
} as const;

export const AJIBADE_AVATAR = '/vite.svg';
