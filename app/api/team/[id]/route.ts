import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request, context: any) {
  try {
    // Next.js versions 15+ require awaiting params
    const params = await context.params;
    const teamId = params.id;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json({ team });
  } catch (error) {
    console.error("Failed to load ticket:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}