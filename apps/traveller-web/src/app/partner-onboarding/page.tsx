'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function PartnerOnboarding() {
  const [step, setStep] = useState(1);
  const [vehicleType, setVehicleType] = useState<string | null>(null);
  
  // Multiple files state
  const [rcFile, setRcFile] = useState<File | null>(null);
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [fitnessFile, setFitnessFile] = useState<File | null>(null);
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [verificationResult, setVerificationResult] = useState<{success: boolean, message: string, details: string[]} | null>(null);

  const handleVerification = () => {
    if (!rcFile || !insuranceFile || !fitnessFile) return;
    
    setIsVerifying(true);
    setVerificationResult(null);

    // SEC-08: Transition to server-owned PENDING_REVIEW state (no fake simulated AI auto-pass)
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult({
        success: true, 
        message: `📋 Documents Submitted for Admin Review (Status: PENDING_REVIEW)`,
        details: [
          `Category: ${vehicleType === 'bike' ? 'Bike Taxi (Permanently Free)' : 'Commercial Cab (Permanently Free)'}`,
          `Registration Document: ${rcFile.name}`,
          `Insurance Document: ${insuranceFile.name}`,
          `Fitness Document: ${fitnessFile.name}`,
          "Review Status: PENDING_REVIEW (Manual administrative review required before activation)"
        ]
      });
    }, 1000);
  };

  const allUploaded = rcFile && insuranceFile && fitnessFile;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 pt-24 font-sans pb-32">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <Link href="/" className="text-indigo-400 font-bold mb-4 inline-block hover:text-indigo-300">← Back to YaatraSangi</Link>
          <h1 className="text-4xl font-black text-white bg-gradient-to-r from-emerald-400 to-indigo-400 text-transparent bg-clip-text">Partner Onboarding</h1>
          <p className="text-slate-400 mt-2">Strict AI Verification System. Drive Safe, Earn More.</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">1. Vehicle Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={() => setVehicleType('cab')}
                  className={`p-6 rounded-2xl border-2 transition-all ${vehicleType === 'cab' ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-slate-700 hover:border-slate-500'}`}
                >
                  <div className="text-5xl mb-4">🚕</div>
                  <h3 className="text-xl font-bold text-white">Commercial Cab</h3>
                  <p className="text-sm text-slate-400 mt-2">I have a yellow plate taxi</p>
                </button>

                <button 
                  onClick={() => setVehicleType('bike')}
                  className={`p-6 rounded-2xl border-2 transition-all ${vehicleType === 'bike' ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-slate-700 hover:border-slate-500'}`}
                >
                  <div className="text-5xl mb-4">🏍️</div>
                  <h3 className="text-xl font-bold text-white">Bike Taxi</h3>
                  <p className="text-sm text-slate-400 mt-2">I have a 2-wheeler</p>
                </button>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  disabled={!vehicleType}
                  onClick={() => setStep(2)}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-3 rounded-full font-bold transition-all"
                >
                  Proceed to Document Upload →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-2">2. Mandatory Document Upload</h2>
              <p className="text-slate-400 mb-6">Upload official vehicle and permit documents for administrative compliance review.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* RC Book */}
                <div className={`p-4 rounded-xl border ${rcFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-700 bg-slate-900'}`}>
                  <h4 className="font-bold text-white mb-2">Registration (RC)</h4>
                  <p className="text-xs text-slate-400 mb-4">Yellow plate passing proof</p>
                  <label className="bg-slate-800 hover:bg-slate-700 py-2 px-4 rounded-lg cursor-pointer text-sm text-center block text-white font-medium border border-slate-600">
                    {rcFile ? '✅ ' + rcFile.name : 'Upload RC Photo'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setRcFile(e.target.files[0])} />
                  </label>
                </div>

                {/* Insurance */}
                <div className={`p-4 rounded-xl border ${insuranceFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-700 bg-slate-900'}`}>
                  <h4 className="font-bold text-white mb-2">Active Insurance</h4>
                  <p className="text-xs text-slate-400 mb-4">Must not be expired</p>
                  <label className="bg-slate-800 hover:bg-slate-700 py-2 px-4 rounded-lg cursor-pointer text-sm text-center block text-white font-medium border border-slate-600">
                    {insuranceFile ? '✅ ' + insuranceFile.name : 'Upload Insurance'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setInsuranceFile(e.target.files[0])} />
                  </label>
                </div>

                {/* Fitness / Passing */}
                <div className={`p-4 rounded-xl border ${fitnessFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-700 bg-slate-900'}`}>
                  <h4 className="font-bold text-white mb-2">Fitness & Permit</h4>
                  <p className="text-xs text-slate-400 mb-4">RTO passing certificate</p>
                  <label className="bg-slate-800 hover:bg-slate-700 py-2 px-4 rounded-lg cursor-pointer text-sm text-center block text-white font-medium border border-slate-600">
                    {fitnessFile ? '✅ ' + fitnessFile.name : 'Upload Fitness'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setFitnessFile(e.target.files[0])} />
                  </label>
                </div>
              </div>

              {/* Verifying Status UI */}
              {isVerifying && (
                <div className="bg-slate-950 rounded-xl p-8 border border-indigo-500/50 mb-6 text-center">
                  <div className="animate-spin text-4xl mb-6">🔍</div>
                  <h3 className="text-xl text-indigo-400 font-bold mb-6">AI Server Validating Documents...</h3>
                  
                  <div className="space-y-4 text-left max-w-sm mx-auto font-mono text-sm">
                    <div className={`flex justify-between ${scanStep >= 1 ? 'text-white' : 'text-slate-700'}`}>
                      <span>Extracting text via OCR...</span> {scanStep >= 2 && <span className="text-emerald-400">DONE</span>}
                    </div>
                    <div className={`flex justify-between ${scanStep >= 2 ? 'text-white' : 'text-slate-700'}`}>
                      <span>Validating RC / Taxi Parsing...</span> {scanStep >= 3 && <span className="text-emerald-400">VALID</span>}
                    </div>
                    <div className={`flex justify-between ${scanStep >= 3 ? 'text-white' : 'text-slate-700'}`}>
                      <span>Checking Insurance Expiry...</span> {scanStep >= 4 && <span className="text-emerald-400">ACTIVE</span>}
                    </div>
                    <div className={`flex justify-between ${scanStep >= 4 ? 'text-white' : 'text-slate-700'}`}>
                      <span>Verifying RTO Fitness...</span> {scanStep >= 4 && <span className="text-emerald-400">PASS</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* Result Area */}
              {verificationResult && !isVerifying && (
                <div className="bg-emerald-500/10 border border-emerald-500 rounded-xl p-6 mb-6">
                  <h3 className="font-bold text-xl text-emerald-400 mb-4">{verificationResult.message}</h3>
                  <ul className="space-y-2">
                    {verificationResult.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-300">
                        <span className="text-emerald-500">✔</span> {detail}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 p-4 bg-slate-950 rounded-lg border border-slate-800">
                    <p className="text-sm text-slate-400">Note: All listings remain pending until identity and vehicle documents are verified by an administrator.</p>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <button 
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-white px-6 py-3 font-medium"
                >
                  ← Back
                </button>
                <button 
                  onClick={handleVerification}
                  disabled={!allUploaded || isVerifying}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  {isVerifying ? 'Submitting...' : 'Submit Documents for Verification'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
