import { deleteCookie, getCookie, setCookie } from "cookies-next";

export type AuthTokens = {
  accessToken: string | null;
  refreshToken?: string | null;
};

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Default secure cookie options for HTTP-only cookies
const defaultCookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const, // Changed from "strict" to "lax"
  path: "/",
  domain: undefined, // Let browser set default domain
};

/**
 * Set the access token in a secure HTTP-only cookie.
 * Access tokens are short-lived (1 hour).
 */
export async function setAccessToken(token: string): Promise<void> {
  await setCookie(ACCESS_TOKEN_KEY, token, {
    ...defaultCookieOptions,
    maxAge: 3600, // 1 hour
  });
}

/**
 * Get the access token from cookies.
 */
export async function getAccessToken(): Promise<string | undefined> {
  const value = await getCookie(ACCESS_TOKEN_KEY);
  return (value as string | undefined) ?? undefined;
}

/**
 * Remove the access token from cookies.
 */
export async function removeAccessToken(): Promise<void> {
  await deleteCookie(ACCESS_TOKEN_KEY);
}

/**
 * Set the refresh token in a secure HTTP-only cookie.
 * Refresh tokens are long-lived (7 days).
 */
export async function setRefreshToken(token: string): Promise<void> {
  await setCookie(REFRESH_TOKEN_KEY, token, {
    ...defaultCookieOptions,
    maxAge: 604800, // 7 days
  });
}

/**
 * Get the refresh token from cookies.
 */
export async function getRefreshToken(): Promise<string | undefined> {
  const value = await getCookie(REFRESH_TOKEN_KEY);
  return (value as string | undefined) ?? undefined;
}

/**
 * Remove the refresh token from cookies.
 */
export async function removeRefreshToken(): Promise<void> {
  await deleteCookie(REFRESH_TOKEN_KEY);
}

/**
 * Get both access and refresh tokens.
 */
export async function getTokens(): Promise<AuthTokens> {
  const [access, refresh] = await Promise.all([
    getAccessToken(),
    getRefreshToken(),
  ]);
  return {
    accessToken: access ?? null,
    refreshToken: refresh ?? null,
  };
}

/**
 * Set access and/or refresh tokens.
 */
export async function setTokens(tokens: AuthTokens): Promise<void> {
  const tasks: Promise<void>[] = [];
  if (typeof tokens.accessToken !== "undefined") {
    if (tokens.accessToken) {
      tasks.push(setAccessToken(tokens.accessToken));
    } else {
      tasks.push(removeAccessToken());
    }
  }
  if (typeof tokens.refreshToken !== "undefined") {
    if (tokens.refreshToken) {
      tasks.push(setRefreshToken(tokens.refreshToken));
    } else {
      tasks.push(removeRefreshToken());
    }
  }
  await Promise.all(tasks);
}

/**
 * Clear all authentication tokens.
 */
export async function clearTokens(): Promise<void> {
  await Promise.all([removeAccessToken(), removeRefreshToken()]);
}
