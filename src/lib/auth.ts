const KEY = "access_token";

// CRITICAL FIX: Load token from localStorage on module import
let token: string | null = localStorage.getItem(KEY);

export function loadToken() {
    token = localStorage.getItem(KEY);
    return token;
}

export function setToken(t: string | null) {
    token = t;
    if (t) {
        localStorage.setItem(KEY, t);
    } else {
        localStorage.removeItem(KEY);
    }
}

export function getToken() {
    // Fallback: Always check localStorage if token is null in memory
    if (!token) {
        token = localStorage.getItem(KEY);
    }
    return token;
}

export function removeToken() {
    setToken(null);
}
