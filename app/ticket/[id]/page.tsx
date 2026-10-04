"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

export default function TicketPage() {
  const params = useParams();
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`/api/team/${params.id}`);
        const data = await res.json();
        setTeamData(data.team);
      } catch (error) {
        console.error("Failed to load ticket");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [params.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono">Loading Pass...</div>;
  if (!teamData) return <div className="min-h-screen flex items-center justify-center bg-black text-red-500 font-mono">Pass not found.</div>;

  return (
    <main className="min-h-screen bg-black text-gray-200 font-sans flex items-center justify-center p-4">
      {/* Background glowing orbs to match landing page */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-sm w-full bg-gray-950 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.15)] overflow-hidden border border-green-500/30">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-900/40 to-black border-b border-green-500/30 p-6 text-center">
          <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-1">Official Event Pass</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">BREAK-A-THON</h1>
        </div>

        {/* Ticket Body */}
        <div className="p-8 flex flex-col items-center">
          <div className="w-full text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">{teamData.teamName}</h2>
            <p className="text-gray-400 text-sm">Lead: <span className="text-gray-200 font-medium">{teamData.leadName}</span></p>
          </div>

          {/* QR Code with White Background for scanning reliability */}
          <div className="bg-white p-4 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] mb-6 inline-block">
            <QRCodeSVG value={teamData.id} size={180} level="H" />
          </div>

          <div className="w-full grid grid-cols-2 gap-4 border-t border-b border-gray-800 py-4 mb-6">
            <div className="text-center">
              <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Members</p>
              <p className="text-lg font-bold text-gray-200">{teamData.memberCount}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Pass ID</p>
              <p className="text-sm font-bold text-gray-200 mt-1 truncate px-2">{teamData.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>

          {/* Mandatory Disclaimer */}
          <div className="bg-red-950/30 border border-red-500/20 rounded-lg p-4 text-center w-full">
            <p className="text-sm text-red-400 font-semibold mb-1 flex items-center justify-center gap-2">
              ⚠️ Mandatory Pass
            </p>
            <p className="text-[11px] text-red-400/80 leading-relaxed">
              No entries will be allowed at the venue without presenting this pass. Please screenshot or download this page.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}