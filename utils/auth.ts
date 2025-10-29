/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from "../lib/config";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(config.jwt.secret);
const EXPIRES_IN = config.jwt.expiresIn;

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createToken(
  payload: Record<string, any>,
  expiresIn = EXPIRES_IN
) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(config.session.cookieName)?.value;

  if (!token) return null;

  return await verifyToken(token);
}

export async function setSession(user: Record<string, any>) {
  const token = await createToken({
    id: user.id,
    // email: user.email,
    // name: user.name,
    role: user.role,
  });

  const cookieStore = await cookies();
  cookieStore.set(config.session.cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: config.session.timeout,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(config.session.cookieName);
}
