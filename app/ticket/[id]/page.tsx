"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";

export default function TicketPage() {
  const params = useParams();
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const ticketRef = useRef<HTMLDivElement>(null);

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

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    
    try {
      const dataUrl = await toPng(ticketRef.current, {
        backgroundColor: '#050505',
        pixelRatio: 2, 
        cacheBust: true,
      });
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `BreakAThon_Pass_${teamData.teamName.replace(/\s+/g, '_')}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
      alert("Failed to download the image. Please take a screenshot of your pass!");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono">Loading Pass Data...</div>;
  if (!teamData) return <div className="min-h-screen flex items-center justify-center bg-black text-red-500 font-mono">Pass not found.</div>;

  // The full URL that will be encoded into the QR code
  const ticketUrl = `https://break-a-thon-2-k26-qglk.vercel.app/admin/checkin/${teamData.id}`;

  return (
    <main className="min-h-screen bg-black text-green-400 font-mono flex flex-col items-center justify-center p-4 selection:bg-green-500 selection:text-black">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* The Actual Pass (Target for Download) */}
      <div 
        ref={ticketRef} 
        className="relative z-10 max-w-sm w-full bg-gray-950/90 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.15)] overflow-hidden border border-green-500/50 backdrop-blur-md"
      >
        <div className="bg-green-500/10 border-b border-green-500/30 p-6 text-center">
          <p className="text-green-500/70 text-xs font-semibold uppercase tracking-widest mb-1">Official Tech Pass</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500">
            BREAK-A-THON
          </h1>
        </div>

        <div className="p-8 flex flex-col items-center">
          <div className="w-full text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">{teamData.teamName}</h2>
            
            <div className="bg-black/80 border border-green-500/30 rounded-lg p-3 inline-block text-left w-full shadow-inner">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Team Leader</p>
              <p className="text-green-300 text-sm font-medium mb-3">{teamData.leadName}</p>
              
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Contact Sequence</p>
              <p className="text-green-300 text-sm font-medium">{teamData.phoneNumber}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.3)] mb-6 inline-block border-2 border-green-500">
            {/* Using QRCodeCanvas and Full URL for perfect scanning */}
            <QRCodeCanvas value={ticketUrl} size={180} level="H" marginSize={2} />
          </div>

          <div className="w-full grid grid-cols-2 gap-4 border-t border-b border-green-500/30 py-4 mb-6">
            <div className="text-center">
              <p className="text-[10px] text-green-500/70 uppercase font-semibold tracking-wider">Members</p>
              <p className="text-lg font-bold text-gray-200">{teamData.memberCount}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-green-500/70 uppercase font-semibold tracking-wider">Auth ID</p>
              <p className="text-sm font-bold text-gray-200 mt-1 truncate px-2">{teamData.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center w-full">
            <p className="text-xs text-red-400 font-bold tracking-widest mb-1">
              ⚠ MANDATORY GATE PASS
            </p>
            <p className="text-[10px] text-red-400/80 uppercase">
              Valid for single-entry scan. Venue access will be strictly denied without this pass.
            </p>
          </div>
        </div>
      </div>

      <button 
        onClick={handleDownload} 
        className="mt-6 relative z-10 max-w-sm w-full px-8 py-4 bg-green-500 text-black font-extrabold rounded-xl hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all uppercase tracking-widest flex items-center justify-center gap-3"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M222,152v56a14,14,0,0,1-14,14H48a14,14,0,0,1-14-14V152a6,6,0,0,1,12,0v56a2,2,0,0,0,2,2H208a2,2,0,0,0,2-2V152a6,6,0,0,1,12,0Zm-98.24,5.76a6,6,0,0,0,8.48,0l40-40a6,6,0,0,0-8.48-8.48L134,139.06V32a6,6,0,0,0-12,0V139.06l-29.76-29.78a6,6,0,0,0-8.48,8.48Z"></path></svg>
        Download Pass
      </button>

    </main>
  );
}