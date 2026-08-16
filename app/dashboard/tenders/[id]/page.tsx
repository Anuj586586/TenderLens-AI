import Link from 'next/link';
import { 
  ArrowLeft, 
  FileText, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle,
  FileSearch,
  Calendar,
  DollarSign,
  Download,
  Share2
} from 'lucide-react';

export default function TenderDetail() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
           <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition mb-4">
             <ArrowLeft className="w-4 h-4" /> Back to Dashboard
           </Link>
           <div className="flex items-center gap-3">
             <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">RFP-2024-89</span>
             <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Active</span>
           </div>
           <h1 className="text-3xl font-bold text-slate-900 mt-2">Construction of 120-Bed District Hospital</h1>
           <p className="text-slate-500 flex items-center gap-2">
             <span className="font-medium text-slate-700">Govt. of Maharashtra</span> • Health Infrastructure
           </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2.5 text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm">
            <Download className="w-5 h-5" />
          </button>
          <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-sm">
            Prepare Bid
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <div className="text-sm text-slate-500 mb-1 flex items-center gap-2">
             <DollarSign className="w-4 h-4" /> Estimated Value
           </div>
           <div className="text-2xl font-bold text-slate-900">₹45.5 Cr</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <div className="text-sm text-slate-500 mb-1 flex items-center gap-2">
             <Calendar className="w-4 h-4" /> Submission Deadline
           </div>
           <div className="text-2xl font-bold text-red-600">14 Nov 2024</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <div className="text-sm text-slate-500 mb-1 flex items-center gap-2">
             <CheckCircle className="w-4 h-4 text-emerald-500" /> Eligibility Match
           </div>
           <div className="text-2xl font-bold text-emerald-600">92%</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <div className="text-sm text-slate-500 mb-1 flex items-center gap-2">
             <AlertTriangle className="w-4 h-4 text-amber-500" /> High Risks Found
           </div>
           <div className="text-2xl font-bold text-amber-600">2 Issues</div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Left Column - Detailed Breakdown */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* AI Recommendation Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-start gap-4">
              <div className="mt-1 bg-emerald-100 p-2 rounded-full text-emerald-600">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-900 mb-1">AI Recommendation: STRONG FIT - PROCEED</h3>
                <p className="text-sm text-emerald-800/80 leading-relaxed">
                  Your company exceeds the financial turnover requirements by 40% and meets all technical past-experience criteria. The primary concern is the aggressive timeline which requires concurrent execution of phase 1 and 2.
                </p>
              </div>
            </div>

            {/* Eligibility Matrix */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                 <h3 className="font-bold text-slate-900">Qualification Matrix</h3>
               </div>
               <div className="divide-y divide-slate-100">
                  <div className="p-4 px-6 flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="text-sm font-semibold text-slate-900">Average Annual Turnover</h4>
                        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Meets</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">Required: ₹15 Cr/year for last 3 years</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-700 font-medium bg-slate-100 px-2 py-1 rounded">Our Profile: ₹22 Cr/year</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 px-6 flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="text-sm font-semibold text-slate-900">Similar Past Experience</h4>
                        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Meets</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">Required: 1 hospital project &gt; 100 beds</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-700 font-medium bg-slate-100 px-2 py-1 rounded">Match: City Gen Hospital (150 beds)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 px-6 flex items-start gap-4">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="text-sm font-semibold text-slate-900">ISO 13485 Certification</h4>
                        <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Partial</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">Required: Valid certification for medical device installation</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-700 font-medium bg-slate-100 px-2 py-1 rounded">Our Profile: Expiring in 2 months (Renewal pending)</span>
                      </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Document Readiness */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">Required Documents (3/8 Ready)</h3>
              <div className="space-y-3">
                 <div className="flex items-center justify-between p-3 border border-emerald-200 bg-emerald-50/30 rounded-lg">
                   <div className="flex items-center gap-3">
                     <FileText className="w-5 h-5 text-emerald-600" />
                     <span className="text-sm font-medium text-emerald-900">Audited Balance Sheets (Last 3 Yrs)</span>
                   </div>
                   <CheckCircle className="w-5 h-5 text-emerald-500" />
                 </div>
                 <div className="flex items-center justify-between p-3 border border-slate-200 bg-white rounded-lg opacity-60">
                   <div className="flex items-center gap-3">
                     <FileText className="w-5 h-5 text-slate-400" />
                     <span className="text-sm font-medium text-slate-700">Earnest Money Deposit (EMD) Receipt</span>
                   </div>
                   <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">Pending</span>
                 </div>
                 <div className="flex items-center justify-between p-3 border border-slate-200 bg-white rounded-lg opacity-60">
                   <div className="flex items-center gap-3">
                     <FileText className="w-5 h-5 text-slate-400" />
                     <span className="text-sm font-medium text-slate-700">Project Execution Plan (Methodology)</span>
                   </div>
                   <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">Pending</span>
                 </div>
              </div>
              <button className="w-full mt-4 border-2 border-dashed border-slate-300 rounded-lg py-4 text-sm font-medium text-indigo-600 hover:bg-slate-50 hover:border-indigo-300 transition">
                + Upload Missing Documents
              </button>
            </div>

         </div>

         {/* Right Column - Chat / Insights */}
         <div className="space-y-6">
            
            {/* Ask TenderLens Interface */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-[500px]">
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 rounded-t-xl flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900">Ask TenderLens</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 <div className="bg-slate-100 p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl text-sm text-slate-700 w-11/12">
                   Hi Arjun, I&apos;ve analyzed this 240-page RFP. What specific details would you like to know about?
                 </div>
                 
                 <div className="bg-indigo-600 p-3 rounded-tl-xl rounded-bl-xl rounded-br-xl text-sm text-white w-10/12 ml-auto shadow-sm">
                   What are the penalty clauses for delayed completion?
                 </div>

                 <div className="bg-slate-100 p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl text-sm text-slate-700 w-11/12">
                   <p className="mb-2"><strong>Liquidated Damages (Section 8.4, Page 52):</strong></p>
                   <p className="mb-2">If the contractor fails to complete the work within the stipulated 18 months, a penalty of <strong>0.5% of the contract value per week</strong> of delay will be levied.</p>
                   <p className="text-red-600 font-medium text-xs bg-red-50 p-1.5 rounded inline-block">Max penalty cap is 10% of total contract value.</p>
                 </div>
              </div>

              <div className="p-4 border-t border-slate-200 bg-white rounded-b-xl">
                 <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Ask about compliance, dates, risks..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                      <ArrowLeft className="w-4 h-4 transform rotate-180" />
                    </button>
                 </div>
                 <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                   <button className="whitespace-nowrap text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-200">Payment terms?</button>
                   <button className="whitespace-nowrap text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-200">Joint venture allowed?</button>
                 </div>
              </div>
            </div>

         </div>

      </div>
    </div>
  );
}

function SparklesIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>; }
