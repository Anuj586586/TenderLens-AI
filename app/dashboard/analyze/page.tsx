'use client';

import { Suspense, useState, useEffect } from 'react';
import { UploadCloud, File, AlertCircle, CheckCircle2, ArrowRight, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function AnalyzeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tenderId = searchParams.get('tenderId');
  const { user } = useAuth();

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(!!tenderId);
  const [error, setError] = useState<string | null>(null);
  
  const [analysisCount, setAnalysisCount] = useState<number | null>(null);
  const [isLimitReached, setIsLimitReached] = useState(false);

  useEffect(() => {
    async function checkUsage() {
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const count = userSnap.data().analysisCount || 0;
        setAnalysisCount(count);
        if (count >= 3) {
          setIsLimitReached(true);
        }
      } else {
        await setDoc(userRef, { analysisCount: 0 }, { merge: true });
        setAnalysisCount(0);
      }
    }
    checkUsage();
  }, [user]);

  useEffect(() => {
    async function performAnalysis() {
      if (!tenderId || !user || isLimitReached) {
        if (isLimitReached) setIsAnalyzing(false);
        return;
      }
      try {
        setIsAnalyzing(true);
        // Fetch tender from Firestore
        const tenderRef = doc(db, `users/${user.uid}/tenders`, tenderId);
        const tenderSnap = await getDoc(tenderRef);
        
        if (!tenderSnap.exists()) {
          setError('Tender not found');
          setIsAnalyzing(false);
          return;
        }

        const tenderData = tenderSnap.data();

        // Check if it's already analyzed
        if (tenderData.analysis) {
           router.push(`/dashboard/document?tenderId=${tenderId}`);
           return;
        }

        // Call our Gemini backend route
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: tenderData.title || tenderData.id,
            description: tenderData.description || '',
            tenderValue: tenderData.value || ''
          })
        });

        if (!res.ok) throw new Error('Analysis failed');
        const analysisData = await res.json();

        // Update the document with analysis results and change status to Reviewing
        await updateDoc(tenderRef, {
          analysis: analysisData,
          status: 'Reviewing',
          updatedAt: serverTimestamp()
        });

        // Increment user usage
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          analysisCount: increment(1)
        });

        router.push(`/dashboard/document?tenderId=${tenderId}`);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to analyze tender');
        setIsAnalyzing(false);
      }
    }

    if (tenderId && user && analysisCount !== null) {
      performAnalysis();
    }
  }, [tenderId, user, router, analysisCount, isLimitReached]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const simulateAnalysis = async () => {
    if (!file || !user) return;
    if (isLimitReached) return;
    
    setIsAnalyzing(true);
    
    // Increment usage
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      analysisCount: increment(1)
    });
    
    // Simulate API delay then route to document view
    setTimeout(() => {
      router.push('/dashboard/document');
    }, 2500);
  };

  if (isLimitReached) {
    return (
      <div className="max-w-3xl mx-auto mt-12">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xl shadow-slate-200/50">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">You've reached your free limit</h2>
          <p className="text-slate-600 text-lg mb-8 max-w-lg mx-auto">
            You have successfully analyzed 3 tenders using our free AI engine. Upgrade to Pro for unlimited AI risk analysis and compliance breakdowns.
          </p>
          <div className="flex items-center justify-center gap-4">
             <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
               Upgrade to Pro
             </button>
             <button onClick={() => router.push('/dashboard')} className="bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition">
               Back to Dashboard
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Analyze New Tender</h1>
        <p className="text-slate-500">Upload your RFP or tender document to instantly extract key requirements and risks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Upload Area */}
        <div className="md:col-span-2">
          <div 
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
              isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isAnalyzing && tenderId ? (
              <div className="py-12">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Tender Data...</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Connecting to AI engine to extract requirements, dates, and compliance risks automatically.</p>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
                  <UploadCloud className="w-10 h-10" />
                </div>
                
                {file ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3 text-slate-800 font-medium">
                      <File className="w-6 h-6 text-indigo-500" />
                      {file.name}
                    </div>
                    <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button 
                      onClick={simulateAnalysis}
                      disabled={isAnalyzing}
                      className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 mx-auto disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <>Analyzing Document <span className="animate-pulse">...</span></>
                      ) : (
                        <>Start Analysis <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                    <button onClick={() => setFile(null)} className="text-sm text-slate-500 hover:text-slate-700 mt-4 block mx-auto">
                      Remove file
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Drag &amp; Drop your document here</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                      Supports PDF, DOCX, and TXT files up to 50MB. We&apos;ll automatically structure the data.
                    </p>
                    <label className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition cursor-pointer shadow-sm">
                      Browse Files
                      <input type="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} accept=".pdf,.docx,.txt" />
                    </label>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Info Sidebar */}
        <div>
          <div className="bg-indigo-950 rounded-2xl p-6 text-white shadow-xl">
             <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
               <SparklesIcon className="w-5 h-5 text-indigo-400" /> What we extract
             </h3>
             
             <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-indigo-400" /></div>
                  <div>
                    <h4 className="font-semibold text-indigo-50 text-sm mb-1">Commercial Value & Dates</h4>
                    <p className="text-sm text-indigo-200/80 leading-relaxed">Budget, earnest money deposit, submission deadlines, and query cutoffs.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-indigo-400" /></div>
                  <div>
                    <h4 className="font-semibold text-indigo-50 text-sm mb-1">Eligibility Criteria</h4>
                    <p className="text-sm text-indigo-200/80 leading-relaxed">Revenue requirements, past experience, and mandatory certifications.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1"><AlertCircle className="w-5 h-5 text-amber-400" /></div>
                  <div>
                    <h4 className="font-semibold text-indigo-50 text-sm mb-1">Hidden Risks</h4>
                    <p className="text-sm text-indigo-200/80 leading-relaxed">SLA penalties, strict payment terms, and unusual legal clauses.</p>
                  </div>
                </div>
             </div>
             
             <div className="mt-8 pt-6 border-t border-indigo-800/50">
               <p className="text-xs text-indigo-300 text-center">
                 Your data is encrypted and securely processed. We do not use your documents to train public models.
               </p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Analysis Engine...</div>}>
      <AnalyzeContent />
    </Suspense>
  );
}

function SparklesIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>; }
