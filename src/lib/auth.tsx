import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  role: string;
  [key: string]: any;
}

export function getRoleFromToken(token: string): string | null {
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.role || null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

