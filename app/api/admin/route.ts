import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET() {
	await delay(1000);
	try {
		const role = await currentRole();

		if (role === UserRole.ADMIN) {
			return NextResponse.json({ message: "Access granted" }, { status: 200 });
		}

		return NextResponse.json({ message: "Access denied" }, { status: 403 });
	} catch (error) {
		console.error('Error retrieving role:', error);
		return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
	}
}
