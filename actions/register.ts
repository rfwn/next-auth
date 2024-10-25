"use server";
import * as z from 'zod';
import { RegisterSchema } from '@/schemas';
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db';
import { getUserByEmail } from '@/data/user';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const validatedFields = RegisterSchema.safeParse(values);
	if (!validatedFields.success) {
		return { error: "Some fields contain invalid information." }
	}

	const { email, password, name } = validatedFields.data;
	const hashedPassword = await bcrypt.hash(password, 10);

	const existingUser = await getUserByEmail(email);
	if (existingUser) {
		return { error: "It seems this email may already be associated with an account." }
	}

	await db.user.create({
		data: {
			email,
			name,
			password: hashedPassword
		}
	})

	await signIn("credentials", {
		email, password, redirectTo: DEFAULT_LOGIN_REDIRECT
	  })

	return { success: "Registered successfully." }
}