"use client";

import { QRCodeCanvas } from 'qrcode.react';

export default function TicketClient({ team, checkInUrl }: { team: any, checkInUrl: string }) {
  const downloadQR = () => {
    const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${team.teamName}-Ticket.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black p-4 font-mono">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
      
      <div className="relative z-10 bg-gray-950 border-2 border-green-500/50 shadow-[0_0_40px_rgba(34,197,94,0.2)] max-w-sm w-full p-6 flex flex-col items-center">
        
        <div className="w-full border-b border-green-500/30 pb-4 mb-6 text-center">
          <span className="bg-green-500 text-black text-xs font-bold px-3 py-1 uppercase tracking-widest mb-4 inline-block">Access Granted</span>
          <h1 className="text-3xl font-extrabold text-white tracking-wider uppercase truncate w-full">{team.teamName}</h1>
          <p className="text-green-500/80 text-sm mt-1">CMDR: {team.leadName}</p>
        </div>

        <div className="bg-white p-3 border-4 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)] mb-6">
          <QRCodeCanvas id="qr-canvas" value={checkInUrl} size={200} level="H" />
        </div>
        
        <div className="w-full space-y-2 text-sm text-gray-400 mb-6">
          <div className="flex justify-between border-b border-gray-800 pb-1">
            <span className="uppercase text-xs text-green-500/60">UID</span>
            <span className="text-white truncate max-w-[150px]">{team.id.split('-')[0]}</span>
          </div>
          <div className="flex justify-between border-b border-gray-800 pb-1">
            <span className="uppercase text-xs text-green-500/60">Crew Size</span>
            <span className="text-white">{team.memberCount} Units</span>
          </div>
        </div>

        <button onClick={downloadQR} className="w-full bg-green-500/10 hover:bg-green-500 hover:text-black text-green-400 border border-green-500 font-bold py-2 px-4 transition-all uppercase tracking-widest text-sm">
          Download Pass
        </button>
      </div>
    </main>
  );
}