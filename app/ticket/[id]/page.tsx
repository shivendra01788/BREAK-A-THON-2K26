import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import TicketClient from './TicketClient';
import { headers } from 'next/headers';

export default async function TicketPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const teamId = params.id;

  const team = await prisma.team.findUnique({
    where: { id: teamId }
  });

  if (!team) return notFound();

  // Dynamically grab your computer's IP/Host so mobile phones can scan it
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  
  // The exact URL the phone will open when scanning the QR code
  const checkInUrl = `http://${host}/admin/checkin/${team.id}`;

  return <TicketClient team={team} checkInUrl={checkInUrl} />;
}