"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  
  const [formData, setFormData] = useState({
    teamName: "",
    leadName: "",
    phoneNumber: "",
    pptLink: "",
    memberCount: 1,
    githubUsernames: [""],
  });

  const handleMemberCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value);
    const newGithubs = [...formData.githubUsernames];
    while (newGithubs.length < count) newGithubs.push("");
    newGithubs.length = count;
    setFormData({ ...formData, memberCount: count, githubUsernames: newGithubs });
  };

  const handleGithubChange = (index: number, value: string) => {
    const newGithubs = [...formData.githubUsernames];
    newGithubs[index] = value;
    setFormData({ ...formData, githubUsernames: newGithubs });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    
    if (result.success) {
      router.push(`/ticket/${result.teamId}`);
    } else {
      alert("Registration failed. This Team Name or Phone Number may already be registered.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center p-4 selection:bg-green-500 selection:text-black">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-2xl bg-gray-950/80 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)] rounded-2xl overflow-hidden backdrop-blur-md p-6 md:p-10">
        
        {/* Compact Header Replacing the Sidebar */}
        <div className="text-center mb-8 border-b border-green-500/20 pb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500 mb-2 tracking-tighter">
            BREAK-A-THON
          </h1>
          <p className="text-xs text-green-500/60 uppercase tracking-widest">Event Registration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className={activeStep === 1 ? "block animate-fade-in" : "hidden"}>
            <h2 className="text-xl mb-6 text-white font-bold flex items-center gap-3">
              <span className="text-green-500 text-sm bg-green-500/10 px-2 py-1 rounded">Step 1</span> 
              Team Details
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs text-green-500/70 mb-2 uppercase tracking-wider">Team Name *</label>
                <input required={activeStep === 1} name="teamName" value={formData.teamName} onChange={handleChange} type="text" className="w-full bg-black border border-gray-800 rounded-lg p-3 text-green-400 focus:outline-none focus:border-green-500 transition-all placeholder-gray-700" placeholder="e.g. Byte Builders" />
              </div>
              <div>
                <label className="block text-xs text-green-500/70 mb-2 uppercase tracking-wider">Project PPT Link</label>
                <input name="pptLink" value={formData.pptLink} onChange={handleChange} type="url" className="w-full bg-black border border-gray-800 rounded-lg p-3 text-green-400 focus:outline-none focus:border-green-500 transition-all placeholder-gray-700" placeholder="https://docs.google.com/..." />
                
                <div className="mt-3 p-3 bg-red-500/10 border-l-4 border-red-500 rounded-r-lg">
                  <p className="text-xs text-red-400 font-medium leading-relaxed">
                    ⚠️ <span className="font-bold">Required Exception:</span> Provide a presentation link here ONLY if your project was not submitted via the official Google Form.
                  </p>
                </div>
              </div>
            </div>
            <button type="button" onClick={() => setActiveStep(2)} className="mt-8 px-6 py-3 w-full bg-green-500/10 border border-green-500 text-green-400 rounded-lg hover:bg-green-500 hover:text-black transition-all font-bold">Next Step &rarr;</button>
          </div>

          <div className={activeStep === 2 ? "block animate-fade-in" : "hidden"}>
            <h2 className="text-xl mb-6 text-white font-bold flex items-center gap-3">
              <span className="text-green-500 text-sm bg-green-500/10 px-2 py-1 rounded">Step 2</span> 
              Team Lead Details
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs text-green-500/70 mb-2 uppercase tracking-wider">Lead Full Name *</label>
                <input required={activeStep === 2} name="leadName" value={formData.leadName} onChange={handleChange} type="text" className="w-full bg-black border border-gray-800 rounded-lg p-3 text-green-400 focus:outline-none focus:border-green-500 transition-all placeholder-gray-700" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs text-green-500/70 mb-2 uppercase tracking-wider">Phone Number *</label>
                <input required={activeStep === 2} name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} type="tel" className="w-full bg-black border border-gray-800 rounded-lg p-3 text-green-400 focus:outline-none focus:border-green-500 transition-all placeholder-gray-700" placeholder="+91..." />
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <button type="button" onClick={() => setActiveStep(1)} className="px-6 py-3 border border-gray-700 text-gray-400 rounded-lg hover:text-white transition-all">&larr; Back</button>
              <button type="button" onClick={() => setActiveStep(3)} className="flex-1 bg-green-500/10 border border-green-500 text-green-400 rounded-lg hover:bg-green-500 hover:text-black transition-all font-bold">Next Step &rarr;</button>
            </div>
          </div>

          <div className={activeStep === 3 ? "block animate-fade-in" : "hidden"}>
            <h2 className="text-xl mb-6 text-white font-bold flex items-center gap-3">
              <span className="text-green-500 text-sm bg-green-500/10 px-2 py-1 rounded">Step 3</span> 
              Team Members
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-green-500/70 mb-2 uppercase tracking-wider">Total Members *</label>
                <select value={formData.memberCount} onChange={handleMemberCountChange} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-green-400 focus:outline-none focus:border-green-500 transition-all cursor-pointer">
                  <option value={1}>1 Member (Solo)</option>
                  <option value={2}>2 Members</option>
                  <option value={3}>3 Members</option>
                  <option value={4}>4 Members</option>
                </select>
              </div>
              
              <div className="max-h-48 overflow-y-auto pr-2 space-y-4">
                {formData.githubUsernames.map((_, index) => (
                  <div key={index}>
                    <label className="block text-xs text-green-500/70 mb-1 uppercase tracking-wider">Member {index + 1} GitHub *</label>
                    <input required={activeStep === 3} type="text" value={formData.githubUsernames[index]} onChange={(e) => handleGithubChange(index, e.target.value)} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-green-400 focus:outline-none focus:border-green-500 transition-all placeholder-gray-700" placeholder="GitHub Username" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 flex gap-4">
              <button type="button" onClick={() => setActiveStep(2)} className="px-6 py-3 border border-gray-700 text-gray-400 rounded-lg hover:text-white transition-all">&larr; Back</button>
              <button disabled={loading} type="submit" className="flex-1 bg-green-500 text-black font-extrabold py-3 px-4 rounded-lg hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all disabled:opacity-50 uppercase tracking-widest">
                {loading ? "Processing..." : "Complete Registration"}
              </button>
            </div>
          </div>

        </form>
      </div>
    </main>
  );
}