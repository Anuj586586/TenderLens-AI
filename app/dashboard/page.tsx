'use client';

import Link from 'next/link';
import { 
  Briefcase, 
  Target, 
  Calendar, 
  Sparkles, 
  ArrowRight,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Newspaper,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-error';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [activeTenders, setActiveTenders] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!user) {
      if (isMounted) {
        setTimeout(() => {
          if (isMounted) {
            setActiveTenders([]);
            setDataLoading(false);
          }
        }, 0);
      }
      return;
    }


    const fetchTenders = async () => {
      try {
        const path = `users/${user.uid}/tenders`;
        const q = query(collection(db, path));
        const snapshot = await getDocs(q);
        
        setActiveTenders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/tenders`);
      } finally {
        setDataLoading(false);
      }
    };

    const fetchNews = async () => {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        if (data.blogs && isMounted) {
          setNews(data.blogs);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        if (isMounted) setNewsLoading(false);
      }
    };

    fetchTenders();
    fetchNews();
    
    return () => { isMounted = false; };
  }, [user]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Good morning{user ? `, ${user.displayName?.split(' ')[0]}` : ''}.</h1>
          <p className="text-slate-500">Here&apos;s what&apos;s happening with your tenders today.</p>
        </div>
        <Link 
          href="/dashboard/analyze" 
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2"
        >
          Analyze New Tender <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-slate-600">Active Opportunities</h3>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{activeTenders.length}</div>
            <p className="text-sm text-emerald-600 flex items-center gap-1 font-medium">
               +2 this week
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-slate-600">Avg. Match Score</h3>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {activeTenders.length > 0 
                ? Math.round(activeTenders.reduce((acc, curr) => acc + (curr.match || 0), 0) / activeTenders.length) 
                : 0}%
            </div>
            <p className="text-sm text-emerald-600 flex items-center gap-1 font-medium">
               +5% from last month
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Newspaper className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-slate-600">Latest Market Updates</h3>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{news.length > 0 ? news.length : 'Live'}</div>
            <p className="text-sm text-indigo-600 flex items-center gap-1 font-medium">
               Real-time industry insights
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* AI Banner */}
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4">
               <Sparkles className="w-48 h-48" />
             </div>
             <div className="relative z-10">
               <div className="flex items-center gap-2 text-indigo-200 text-sm font-medium mb-3 uppercase tracking-wider">
                 <Sparkles className="w-4 h-4" /> AI Insights
               </div>
               <h3 className="text-xl font-bold mb-2">3 Tenders require your attention</h3>
               <p className="text-indigo-100 max-w-lg mb-6 leading-relaxed">
                 We found new compliance risks in the Pune Smart City RFP and identified 2 highly-matching tenders published today in the healthcare sector.
               </p>
               <button className="bg-white text-indigo-900 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition shadow-sm">
                 Review Insights
               </button>
             </div>
          </div>

          {/* Active Tenders List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Recent Tenders</h2>
              <Link href="/dashboard/tenders" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                View all
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {dataLoading ? (
                <div className="p-8 text-center text-slate-500">Loading tenders...</div>
              ) : activeTenders.length === 0 ? (
                <div className="p-12 text-center">
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No tracked tenders</h3>
                  <p className="text-slate-500 mb-4">Visit the Available Tenders board to browse real government contracts.</p>
                  <Link href="/dashboard/available" className="text-indigo-600 font-medium hover:text-indigo-700">Browse Available Tenders &rarr;</Link>
                </div>
              ) : activeTenders.map((tender) => (
                <div key={tender.id} className="p-6 hover:bg-slate-50 transition flex items-center justify-between group">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">
                      {(tender.match || 0) >= 80 ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (tender.match || 0) < 50 ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <Link href={`/dashboard/tenders/${tender.id}`} className="text-base font-semibold text-slate-900 hover:text-indigo-600 transition block mb-1">
                        {tender.title}
                      </Link>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {tender.buyer}</span>
                        <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> {tender.value || 'N/A'}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {tender.deadline || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 ml-4">
                    <div className="text-right hidden md:block">
                      <div className="text-sm font-bold text-slate-900">{tender.match || 0}%</div>
                      <div className="text-xs text-slate-500">Match</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      tender.status === 'Ready to Bid' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                      tender.status === 'Analyzing' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                      tender.status === 'Risk Detected' ? 'bg-red-50 border-red-200 text-red-700' :
                      'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      {tender.status || 'Draft'}
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 p-1 opacity-0 group-hover:opacity-100 transition">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
              <div className="p-6 border-b border-slate-100 bg-white z-10 shrink-0">
                <h3 className="font-bold text-slate-900 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <Newspaper className="w-5 h-5 text-indigo-600" /> Live Industry News
                   </div>
                   <Link href="/dashboard/blogs" className="text-xs text-indigo-600 font-medium hover:underline">
                     View All
                   </Link>
                </h3>
              </div>
              
              <div className="flex-1 relative overflow-hidden bg-slate-50 group">
                {newsLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                    <span className="text-sm">Fetching news...</span>
                  </div>
                ) : news.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                    No recent news found.
                  </div>
                ) : (
                  <div className="absolute inset-x-0 top-0 animate-scroll-up group-hover:[animation-play-state:paused] pt-4 px-4 pb-4">
                    {/* Duplicate the array to make the scroll seamless */}
                    {[...news, ...news].map((item, index) => (
                      <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4">
                         <div className="text-xs font-bold text-indigo-600 mb-1">{item.category}</div>
                         <a href={item.url} target="_blank" rel="noopener noreferrer" className="block text-sm font-semibold text-slate-900 hover:text-indigo-600 mb-2 line-clamp-2">
                           {item.title}
                         </a>
                         <div className="text-xs text-slate-500 flex items-center justify-between mt-3">
                           <span>{item.date}</span>
                           <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                             Read <ExternalLink className="w-3 h-3" />
                           </a>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Fade Overlays to hide sharp cutoffs */}
                <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none z-10" />
                <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-10" />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

function Building2(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>; }
function CreditCard(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>; }
