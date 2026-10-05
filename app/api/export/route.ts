import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Force dynamic so it always fetches the latest live data, not a cached version
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch all teams from the database
    const teams = await prisma.team.findMany();

    if (teams.length === 0) {
      return new NextResponse("No teams registered yet.", { status: 404 });
    }

    // 1. Create the CSV Header row
    const headers = [
      'Team ID', 
      'Team Name', 
      'Lead Name', 
      'Phone Number', 
      'Total Members', 
      'GitHub Usernames', 
      'PPT Link', 
      'Checked In (Present)'
    ];
    
    // 2. Map through each team and create their data row
    const rows = teams.map(team => [
      team.id,
      // We wrap text fields in quotes just in case someone typed a comma in their name
      `"${team.teamName}"`, 
      `"${team.leadName}"`,
      `"${team.phoneNumber}"`,
      team.memberCount,
      `"${team.githubUsernames.join(', ')}"`, 
      `"${team.pptLink || 'Not Provided'}"`,
      team.isPresent ? 'YES' : 'NO'
    ]);

    // 3. Combine headers and rows with newlines
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    // 4. Send the response as a downloadable file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="BreakAThon_Participants.csv"',
      },
    });

  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Failed to export data", { status: 500 });
  }
}