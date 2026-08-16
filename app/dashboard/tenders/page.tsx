'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { List, MoreHorizontal, Clock, CheckCircle2, AlertCircle, Building2, CreditCard, Calendar, Trash2, CheckCircle, Search } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { collection, query, getDocs, orderBy, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-error';

export default function MyTendersPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeTenders, setActiveTenders] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (tenderId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/tenders`, tenderId));
      setActiveTenders(prev => prev.filter(t => t.id !== tenderId));
    } catch (error) {
      console.error('Error deleting tender:', error);
      alert('Failed to delete tender');
    }
  };

  const handleMarkAsDone = async (tenderId: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, `users/${user.uid}/tenders`, tenderId), { 
        status: 'Done',
        updatedAt: serverTimestamp()
      });
      setActiveTenders(prev => prev.map(t => t.id === tenderId ? { ...t, status: 'Done' } : t));
    } catch (error) {
      console.error('Error updating tender:', error);
      alert('Failed to update tender status');
    }
  };

  const handleAnalyze = (tenderId: string) => {
    router.push(`/dashboard/analyze?tenderId=${tenderId}`);
  };

  useEffect(() => {
    let isMounted = true;
    if (authLoading) return;
    
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
        const q = query(collection(db, path), orderBy('updatedAt', 'desc'));
        const snapshot = await getDocs(q);
        
        setActiveTenders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        // Fallback if index is missing or query fails, just list without ordering
        try {
            const q = query(collection(db, `users/${user.uid}/tenders`));
            const snapshot = await getDocs(q);
            setActiveTenders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch(fallbackErr) {
            handleFirestoreError(fallbackErr, OperationType.LIST, `users/${user.uid}/tenders`);
        }
      } finally {
        setDataLoading(false);
      }
    };

    fetchTenders();
  }, [user, authLoading]);

  if (authLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Tenders</h1>
          <p className="text-slate-500">Manage all your active and past tender evaluations.</p>
        </div>
        <Link 
          href="/dashboard/available" 
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          Find Available Tenders
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
          <h2 className="text-lg font-bold text-slate-900">All Tenders</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {!user ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 mb-4">Please sign in to view your tracked tenders.</p>
            </div>
          ) : dataLoading ? (
            <div className="p-12 text-center text-slate-500">Loading your tracked tenders...</div>
          ) : activeTenders.length === 0 ? (
            <div className="p-12 text-center">
              <List className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No tracked tenders yet</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">You haven&apos;t tracked any tenders yet. Visit the Available Tenders board to browse real government contracts.</p>
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
                  tender.status === 'Done' ? 'bg-slate-100 border-slate-300 text-slate-800' :
                  tender.status === 'Ready to Bid' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                  tender.status === 'Analyzing' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                  tender.status === 'Risk Detected' ? 'bg-red-50 border-red-200 text-red-700' :
                  'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  {tender.status || 'Draft'}
                </div>
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === tender.id ? null : tender.id);
                    }} 
                    className="text-slate-400 hover:text-slate-600 p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition focus:opacity-100 rounded-md hover:bg-slate-100"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  
                  {openMenuId === tender.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenMenuId(null); }} 
                      />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50">
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAnalyze(tender.id); setOpenMenuId(null); }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Search className="w-4 h-4 text-slate-400" /> Analyze Tender
                        </button>
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMarkAsDone(tender.id); setOpenMenuId(null); }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4 text-slate-400" /> Mark as Done
                        </button>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(tender.id); setOpenMenuId(null); }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
