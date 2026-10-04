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
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Sidebar */}
        <div className="md:w-1/3 bg-blue-600 p-8 text-white flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight">
            BREAK-A-THON
          </h1>
          <p className="text-blue-200 text-sm mb-8 uppercase tracking-wider font-semibold">Event Registration</p>
          
          <nav className="space-y-3">
            <button type="button" onClick={() => setActiveStep(1)} className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium ${activeStep === 1 ? 'bg-white text-blue-600 shadow-md' : 'text-blue-100 hover:bg-blue-700'}`}>
              <span className="text-xs opacity-70 block mb-1">Step 1</span> Team Details
            </button>
            <button type="button" onClick={() => setActiveStep(2)} className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium ${activeStep === 2 ? 'bg-white text-blue-600 shadow-md' : 'text-blue-100 hover:bg-blue-700'}`}>
              <span className="text-xs opacity-70 block mb-1">Step 2</span> Team Lead
            </button>
            <button type="button" onClick={() => setActiveStep(3)} className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium ${activeStep === 3 ? 'bg-white text-blue-600 shadow-md' : 'text-blue-100 hover:bg-blue-700'}`}>
              <span className="text-xs opacity-70 block mb-1">Step 3</span> Team Members
            </button>
          </nav>
        </div>

        {/* Right Form Area */}
        <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center min-h-[500px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1 */}
            <div className={activeStep === 1 ? "block animate-fade-in" : "hidden"}>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Team Details</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Team Name *</label>
                  <input required={activeStep === 1} name="teamName" value={formData.teamName} onChange={handleChange} type="text" className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400" placeholder="e.g. Code Crafters" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Project Presentation (PPT) Link</label>
                  <input name="pptLink" value={formData.pptLink} onChange={handleChange} type="url" className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400" placeholder="https://docs.google.com/presentation/..." />
                  <p className="mt-2 text-sm text-red-600 font-medium bg-red-50 p-3 rounded-md border border-red-100">
                    * Note: For those who have not submitted their project in the Google Form provided by us, it is compulsory to fill out this PPT link.
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setActiveStep(2)} className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md w-full md:w-auto">Next Step &rarr;</button>
            </div>

            {/* Step 2 */}
            <div className={activeStep === 2 ? "block animate-fade-in" : "hidden"}>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Team Lead Details</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lead Full Name *</label>
                  <input required={activeStep === 2} name="leadName" value={formData.leadName} onChange={handleChange} type="text" className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                  <input required={activeStep === 2} name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} type="tel" className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400" placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <button type="button" onClick={() => setActiveStep(1)} className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all">&larr; Back</button>
                <button type="button" onClick={() => setActiveStep(3)} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md">Next Step &rarr;</button>
              </div>
            </div>

            {/* Step 3 */}
            <div className={activeStep === 3 ? "block animate-fade-in" : "hidden"}>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Team Members</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Total Number of Members *</label>
                  <select value={formData.memberCount} onChange={handleMemberCountChange} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer">
                    <option value={1}>1 Member (Solo)</option>
                    <option value={2}>2 Members</option>
                    <option value={3}>3 Members</option>
                    <option value={4}>4 Members</option>
                  </select>
                </div>
                
                <div className="max-h-56 overflow-y-auto pr-2 space-y-4">
                  {formData.githubUsernames.map((_, index) => (
                    <div key={index}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Member {index + 1} GitHub Username *</label>
                      <input required={activeStep === 3} type="text" value={formData.githubUsernames[index]} onChange={(e) => handleGithubChange(index, e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400" placeholder={`Member ${index + 1} GitHub`} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <button type="button" onClick={() => setActiveStep(2)} className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all">&larr; Back</button>
                <button disabled={loading} type="submit" className="flex-1 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 shadow-lg transition-all disabled:opacity-50">
                  {loading ? "Processing..." : "Complete Registration"}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}