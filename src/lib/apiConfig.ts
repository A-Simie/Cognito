/**
 * API Configuration
 * Toggle between Mock and Real API for development/testing
 */

// Feature flag for API mode
// Reads from environment variable, defaults to FALSE (real backend)
// Set VITE_USE_MOCK=true to enable mock mode for testing
export const USE_MOCK_BACKEND = import.meta.env.VITE_USE_MOCK === 'true';

// Check if in development mode
export const isDevelopment = import.meta.env.DEV;

// Log current mode in development
if (isDevelopment) {
    console.log(`🔧 API Mode: ${USE_MOCK_BACKEND ? '🎭 MOCK' : '🌐 REAL'}`);
}
