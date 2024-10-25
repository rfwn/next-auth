"use server";
import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { getSession } from 'next-auth/react';
export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Some fields contain invalid information." }
  }

  const { email, password } = validatedFields.data;
  try {
    await signIn("credentials", {
      email, password, redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT, redirect: true,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." }
        default:
          return { error: "Something went wrong." }
      }
    }
    throw error;
  }

  return { success: "Logged in successfully. Redirecting..." }
}