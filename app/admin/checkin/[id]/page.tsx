import { prisma } from '@/lib/db';

export default async function CheckInPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const teamId = params.id;

  try {
    const team = await prisma.team.update({
      where: { id: teamId },
      data: { isPresent: true }
    });

    return (
      <main className="min-h-screen flex items-center justify-center bg-black p-4 font-mono text-green-400">
        <div className="bg-gray-950 p-6 border border-green-500/40 max-w-md w-full shadow-[0_0_30px_rgba(34,197,94,0.15)] relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50 animate-[ping_2s_ease-in-out_infinite]"></div>

          <div className="bg-green-500/10 border border-green-500 text-green-400 p-3 mb-6 text-center text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="animate-pulse">🟢</span> NODE VERIFIED
          </div>
          
          <h1 className="text-2xl font-black text-white uppercase mb-6 truncate">{team.teamName}</h1>
          
          <div className="space-y-3 text-sm">
            <div className="border border-gray-800 p-3 bg-black">
              <span className="block text-[10px] text-green-500/60 uppercase mb-1">Status</span>
              <span className="font-bold text-green-400">DATA SYNCED: PRESENT</span>
            </div>

            <div className="border border-gray-800 p-3 bg-black">
              <span className="block text-[10px] text-green-500/60 uppercase mb-1">Commander (Lead)</span>
              <span className="text-white">{team.leadName}</span>
              <span className="block text-gray-500 mt-1">{team.phoneNumber}</span>
            </div>

            <div className="border border-gray-800 p-3 bg-black">
              <span className="block text-[10px] text-green-500/60 uppercase mb-1">Unit Count</span>
              <span className="text-white">{team.memberCount} Members</span>
            </div>

            <div className="border border-gray-800 p-3 bg-black">
              <span className="block text-[10px] text-green-500/60 uppercase mb-1">GitHub Payload</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {team.githubUsernames.map((username) => (
                  <span key={username} className="bg-green-500/20 text-green-300 px-2 py-1 text-xs uppercase border border-green-500/30">
                    {username}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black p-4 font-mono">
        <div className="border border-red-500 text-red-500 p-6 max-w-md w-full text-center bg-red-950/20 uppercase tracking-widest text-sm font-bold">
          [!] ERR: INVALID NODE ID
        </div>
      </main>
    );
  }
}