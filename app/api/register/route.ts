import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teamName, leadName, phoneNumber, memberCount, githubUsernames, pptLink } = body;

    const team = await prisma.team.create({
      data: {
        teamName,
        leadName, 
        phoneNumber,
        memberCount: parseInt(memberCount.toString()),
        githubUsernames, 
        pptLink: pptLink || null, 
      },
    });

    return NextResponse.json({ success: true, teamId: team.id });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to register team" }, { status: 500 });
  }
}