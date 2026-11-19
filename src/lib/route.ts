import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

// Every API handler goes through here: 401 without a session, 500 (logged) on unexpected errors.
export function route<A extends unknown[]>(handler: (userId: string, ...args: A) => Promise<Response>) {
  return async (...args: A) => {
    const { userId } = await auth();
    if (!userId) return fail("No autorizado.", 401);
    try {
      return await handler(userId, ...args);
    } catch (e) {
      console.error(e);
      return fail("Error del servidor.", 500);
    }
  };
}
