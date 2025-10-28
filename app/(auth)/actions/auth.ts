"use server";

import connectDB from "@/lib/mongodb";
import users from "@/models/users";
import { hashPassword, setSession } from "@/utils/auth";
import { redirect } from "next/navigation";

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { message: "Name, email, and password are required" };
  }

  await connectDB();
  const existingUser = await users.findOne({ email });

  if (existingUser) {
    return { message: "User already exists" };
  }

  const hashedPassword = await hashPassword(password);
  const user = await users.create({
    name,
    email,
    password: hashedPassword,
    role: "guest",
  });

  await setSession(user);

  redirect("/dashboard");
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log(email, password);
}
