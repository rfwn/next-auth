"use server"

import { compare, hash } from 'bcryptjs';
import * as z from 'zod'
import { db } from '@/lib/db'
import { currentUser } from '@/lib/auth'
import { getUserByEmail, getUserById } from '@/data/user'
import { SettingsSchema } from '@/schemas'
import { revalidatePath } from 'next/cache';

export const settings = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: "Unauthorized" }
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized (db)" }
  }

  if(user.isOAuth){
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
  }

  if(values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if(existingUser) {
      return { error: "Email already in use"}
    }
  }

  if(values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await compare(values.password, dbUser.password);
    if(!passwordsMatch) {
      return { error: "Incorrect password"}
    }
    const hashedPassword = await hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: { ...values }
  });

  revalidatePath('/settings');

  return { success: "Updated settings" };
}
