import Link from 'next/link';
import { ArrowRight, FileText, CheckSquare, AlertTriangle, Calendar, BarChart3 } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
        <Logo />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/dashboard" className="hover:text-slate-900">Product</Link>
          <Link href="/dashboard/available" className="hover:text-slate-900">Features</Link>
          <Link href="/dashboard/tenders" className="hover:text-slate-900">Workflow</Link>
          <Link href="/dashboard/billing" className="hover:text-slate-900">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Sign In
          </Link>
          <Link 
            href="/dashboard" 
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2"
          >
            Analyze a Tender <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mb-8">
          <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">NEW</span>
          TenderLens 2.0 is now live
          <ArrowRight className="w-3 h-3 ml-1" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
          Read Less. <span className="text-indigo-600 italic">Understand More.</span> Win Better Tenders.
        </h1>
        
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          TenderLens AI turns complex RFP documents into actionable bid insights in seconds. Stop wading through hundreds of pages and start making strategic decisions.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/dashboard/analyze" 
            className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            Start Analyzing Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/dashboard" 
            className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl text-lg font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2"
          >
            Book a Demo <Calendar className="w-5 h-5 text-slate-400" />
          </Link>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-6">Trusted by Procurement Teams At</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale">
            {/* Placeholders for logos */}
            <span className="text-xl font-bold text-slate-800">AcmeCorp</span>
            <span className="text-xl font-bold text-slate-800 italic">GlobalTech</span>
            <span className="text-xl font-bold text-slate-800">Innova</span>
            <span className="text-xl font-bold text-slate-800">SysDev</span>
          </div>
        </div>
      </section>

      {/* Feature Demo Mockup */}
      <section className="px-4 pb-24 max-w-5xl mx-auto">
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
          <div className="bg-slate-100 px-4 py-3 flex items-center gap-2 border-b border-slate-200">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              <div className="w-3 h-3 rounded-full bg-slate-300"></div>
            </div>
            <div className="mx-auto bg-white px-4 py-1 rounded-md text-xs font-medium text-slate-500 border border-slate-200 flex items-center gap-2">
               app.tenderlens.ai/analysis/rfp-8492
            </div>
          </div>
          <div className="p-8 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 font-medium bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
                <FileText className="w-5 h-5" />
                RFP-8492: Cloud Infra
              </div>
              <div className="space-y-1">
                <div className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50/50 rounded-lg flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div> Executive Summary
                </div>
                <div className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2">
                   <CheckSquare className="w-4 h-4 text-slate-400" /> Eligibility
                </div>
                <div className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2">
                   <BarChart3 className="w-4 h-4 text-slate-400" /> Financials
                </div>
              </div>
            </div>
            <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Executive Summary</h3>
                <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Analysis Complete
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-6">Generated from 142 pages in 4.2 seconds.</p>
              
              <div className="relative pl-6 border-l-2 border-indigo-100 mb-8">
                <div className="absolute left-[-9px] top-0 text-indigo-200 text-4xl leading-none font-serif">&quot;</div>
                <p className="text-slate-700 leading-relaxed">
                  The buyer is seeking a comprehensive cloud infrastructure overhaul, migrating 80% of legacy on-premise systems to a secure, scalable hybrid environment within 18 months. Key emphasis is placed on <strong>SOC2 compliance</strong> and <strong>data sovereignty</strong> within the EU region.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                    <AlertTriangle className="w-4 h-4" /> Risk Factor
                  </div>
                  <p className="text-sm text-red-900/80">Stringent SLA penalty clauses identified in Section 4.2.</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-2">
                    <CheckSquare className="w-4 h-4" /> Match Score
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-emerald-700">87</span>
                    <span className="text-sm text-emerald-700/80">% fit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bottom CTA Block */}
      <section className="py-24 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
             <div className="bg-indigo-600 rounded-3xl p-12 text-white shadow-xl shadow-indigo-600/20">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to win more business?</h2>
                <p className="text-indigo-100 mb-8 text-lg">Join forward-thinking procurement teams who use TenderLens to bid smarter and faster.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-lg mx-auto">
                    <input type="email" placeholder="Enter your work email" className="px-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-white flex-1" />
                    <Link href="/dashboard" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-indigo-50 transition text-center">Get Started</Link>
                </div>
                <p className="mt-4 text-sm text-indigo-200">14-day free trial. No credit card required.</p>
             </div>
          </div>
      </section>
    </div>
  );
}
