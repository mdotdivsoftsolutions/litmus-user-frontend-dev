/**
 * The session lives in httpOnly cookies that JS cannot read, so a localStorage flag records
 * whether this browser has signed in. Without it, anonymous visitors would call /auth/me and
 * /auth/refresh-token on every page load and get two 401s each time.
 */
const AUTH_HINT_KEY = "litmus_auth_active";

export const hasAuthHint = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(AUTH_HINT_KEY) === "1";
  } catch {
    return false;
  }
};

export const setAuthHint = (): void => {
  try {
    localStorage.setItem(AUTH_HINT_KEY, "1");
  } catch {
    // Storage blocked (private mode): the user just has to sign in again next visit.
  }
};

export const clearAuthHint = (): void => {
  try {
    localStorage.removeItem(AUTH_HINT_KEY);
  } catch {
    // ignore
  }
};
