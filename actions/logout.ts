"use server";

import { signOut } from "@/auth"
import { getSession } from "next-auth/react";

export const logout = async () => {
  await signOut({ redirect: true, redirectTo: '/auth/login' });
  await getSession();
}