"use server";

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const admin = async () => {
	const role = await currentRole();

	if (role === UserRole.USER) {
		return { error: "Server action forbidden" }
	} else {
		return { success: "Server action allowed" }
	}
}