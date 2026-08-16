'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  ArrowLeft, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  ChevronRight, 
  ChevronLeft,
  AlertTriangle,
  CheckCircle,
  FileText,
  MessageSquare,
  Loader2
} from 'lucide-react';

function DocumentContent() {
  const searchParams = useSearchParams();
  const tenderId = searchParams.get('tenderId');
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('insights');
  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(!!tenderId);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTender() {
      if (!tenderId || !user) return;
      try {
        const tenderRef = doc(db, `users/${user.uid}/tenders`, tenderId);
        const tenderSnap = await getDoc(tenderRef);
        if (tenderSnap.exists()) {
          setTender(tenderSnap.data());
        } else {
          setError('Tender not found.');
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to load tender data.');
      } finally {
        setLoading(false);
      }
    }
    fetchTender();
  }, [tenderId, user]);

  if (loading) {
    return <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>;
  }

  if (error) {
    return <div className="h-[calc(100vh-8rem)] flex items-center justify-center text-red-500">{error}</div>;
  }

  const analysis = tender?.analysis;
  const isDynamic = !!analysis;

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 pb-4">
      {/* Left Pane - Document Viewer */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
        {/* PDF Toolbar */}
        <div className="h-12 border-b border-slate-200 bg-slate-50 flex items-center justify-between px-4">
           <div className="text-sm font-medium text-slate-700 truncate w-64 flex items-center gap-2">
             <FileText className="w-4 h-4 text-red-500" />
             {isDynamic ? 'Tender_Metadata_Extract.pdf' : 'RFP_Hospital_Upgradation_V2.pdf'}
           </div>
           
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-2 py-1 shadow-sm">
               <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ZoomOut className="w-4 h-4" /></button>
               <span className="text-xs font-medium text-slate-600 w-10 text-center">100%</span>
               <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ZoomIn className="w-4 h-4" /></button>
             </div>
             
             <div className="flex items-center gap-2 text-sm text-slate-600">
               <button className="p-1 hover:bg-slate-200 rounded"><ChevronLeft className="w-4 h-4" /></button>
               <span>Page 1 / 1</span>
               <button className="p-1 hover:bg-slate-200 rounded"><ChevronRight className="w-4 h-4" /></button>
             </div>
           </div>
        </div>

        {/* PDF Content Area */}
        <div className="flex-1 bg-slate-200 p-8 overflow-y-auto flex justify-center">
           <div className="bg-white w-[800px] min-h-[1000px] shadow-lg p-16 font-serif text-slate-800 leading-relaxed space-y-6">
              <h2 className="text-2xl font-bold mb-8 text-center border-b pb-4">
                {isDynamic ? tender.title : 'SECTION 8: TERMS AND CONDITIONS'}
              </h2>
              
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Description</h3>
                <p>{isDynamic ? (tender.description || 'No description provided.') : 'The contractor shall be responsible for the end-to-end execution of the hospital upgradation project, encompassing civil works, electrical fittings, HVAC installation, and medical gas pipeline setup as per the specifications detailed in Annexure A.'}</p>
              </div>

              {isDynamic && tender.value && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Value</h3>
                  <p>{tender.value}</p>
                </div>
              )}

              {isDynamic && analysis && (
                <div className="space-y-4 mt-8 p-6 bg-slate-50 border border-slate-200 rounded-lg">
                  <h3 className="font-bold text-lg text-indigo-800 mb-2">AI Generated Scope Summary</h3>
                  <p className="text-slate-700">{analysis.scope}</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Right Pane - Analysis Panel */}
      <div className="w-[450px] bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden shrink-0">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('insights')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'insights' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            AI Insights
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'chat' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Ask Document
          </button>
        </div>

        {/* Panel Content */}
        {activeTab === 'insights' ? (
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
             
             {/* Key Extraction Group */}
             <div>
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Critical Risks Detected</h4>
               <div className="space-y-3">
                  {isDynamic && analysis?.risks ? (
                    analysis.risks.map((risk: any, i: number) => (
                      <div key={i} className="bg-red-50 border border-red-100 rounded-lg p-3 cursor-pointer hover:border-red-300 transition relative overflow-hidden group">
                         <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                         <div className="flex justify-between items-start mb-1 pl-2">
                           <span className="font-semibold text-red-900 text-sm">{risk.title}</span>
                         </div>
                         <p className="text-xs text-red-800/80 pl-2">{risk.description}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="bg-red-50 border border-red-100 rounded-lg p-3 cursor-pointer hover:border-red-300 transition relative overflow-hidden group">
                         <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                         <div className="flex justify-between items-start mb-1 pl-2">
                           <span className="font-semibold text-red-900 text-sm">Aggressive Penalty Clause</span>
                           <span className="text-xs text-red-600 bg-red-100 px-1.5 py-0.5 rounded font-medium">Page 52</span>
                         </div>
                         <p className="text-xs text-red-800/80 pl-2">0.5% per week delay penalty, capping at 10%. High risk given the 18-month timeline.</p>
                      </div>
                    </>
                  )}
               </div>
             </div>

             <div className="border-t border-slate-100 pt-5">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Compliance Requirements</h4>
               <div className="space-y-2">
                  {isDynamic && analysis?.compliance ? (
                    analysis.compliance.map((req: string, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg group cursor-pointer">
                         <div className="flex items-center gap-2">
                           <CheckCircle className="w-4 h-4 text-emerald-500" />
                           <span className="text-sm font-medium text-slate-700">{req}</span>
                         </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg group cursor-pointer">
                         <div className="flex items-center gap-2">
                           <CheckCircle className="w-4 h-4 text-emerald-500" />
                           <span className="text-sm font-medium text-slate-700">ISO 9001 Certification</span>
                         </div>
                         <span className="text-xs text-slate-400 group-hover:text-indigo-600 transition">View context →</span>
                      </div>
                    </>
                  )}
               </div>
             </div>

             {isDynamic && analysis?.paymentTerms && (
               <div className="border-t border-slate-100 pt-5">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Terms</h4>
                 <div className="space-y-2">
                    {analysis.paymentTerms.map((term: string, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg group cursor-pointer">
                         <div className="flex items-center gap-2">
                           <FileText className="w-4 h-4 text-indigo-500" />
                           <span className="text-sm font-medium text-slate-700">{term}</span>
                         </div>
                      </div>
                    ))}
                 </div>
               </div>
             )}
             
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 <div className="bg-slate-100 p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl text-sm text-slate-700 w-11/12">
                   I have loaded the {isDynamic ? 'tender details' : '240 pages of RFP_Hospital_Upgradation_V2.pdf'}. What would you like to search for?
                 </div>
              </div>
              <div className="p-4 border-t border-slate-200 bg-white">
                 <div className="relative">
                    <input 
                      type="text" 
                      placeholder="E.g. What are the payment terms?" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    <button onClick={() => alert('Search functionality coming soon')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function DocumentAnalysis() {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    }>
      <DocumentContent />
    </Suspense>
  );
}
