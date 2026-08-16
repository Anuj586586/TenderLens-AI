'use client';

import { useState, useEffect } from 'react';
import { Globe, Building2, CreditCard, Calendar, Plus } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firestore-error';

interface PublicTender {
  id: string;
  title: string;
  buyer: string;
  description: string;
  value: string;
  deadline: string;
  url?: string;
}

export default function AvailableTendersPage() {
  const { user } = useAuth();
  const [tenders, setTenders] = useState<PublicTender[]>([]);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState<Record<string, boolean>>({});
  const [region, setRegion] = useState('uk');
  const [category, setCategory] = useState('it');

  useEffect(() => {
    let isMounted = true;
    const fetchGovTenders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/tenders?region=${region}&category=${category}`);
        if (!response.ok) throw new Error('Failed to fetch from internal API proxy');
        const data = await response.json();
        
        if (isMounted) {
          setTenders(data.tenders || []);
        }
      } catch (err) {
        console.error("Error fetching live tenders:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchGovTenders();
    return () => { isMounted = false; };
  }, [region, category]);

  const handleTrackTender = async (tender: PublicTender) => {
    if (!user) {
      alert("Please sign in to track tenders.");
      return;
    }
    
    setTracking(prev => ({ ...prev, [tender.id]: true }));
    
    try {
      const safeTenderId = String(tender.id || 'unknown').replace(/[^a-zA-Z0-9_\-]/g, '_').substring(0, 128);
      if (!safeTenderId) throw new Error("Invalid tender ID");
      
      const docRef = doc(db, `users/${user.uid}/tenders`, safeTenderId);
      
      const { getDoc } = await import('firebase/firestore');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        alert('You are already tracking this tender!');
        setTracking(prev => ({ ...prev, [tender.id]: false }));
        return;
      }
      
      await setDoc(docRef, {
        title: String(tender.title || 'Untitled').substring(0, 200),
        buyer: String(tender.buyer || 'Unknown').substring(0, 100),
        value: String(tender.value || 'N/A').substring(0, 50),
        deadline: String(tender.deadline || 'N/A').substring(0, 50),
        status: 'Reviewing',
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      alert('Tender saved to your dashboard!');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/tenders`);
    } finally {
      setTracking(prev => ({ ...prev, [tender.id]: false }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Tender Matchmaker</h1>
          <p className="text-slate-500">AI-curated public sector tenders matched to your profile.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="category-select" className="text-sm font-medium text-slate-700">My Category:</label>
            <select 
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="it">IT & Technology</option>
              <option value="construction">Construction & Real Estate</option>
              <option value="marketing">Marketing & Media</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="region-select" className="text-sm font-medium text-slate-700">Sector:</label>
            <select 
              id="region-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none"
            >
              <option value="uk">United Kingdom (Contracts Finder)</option>
              <option value="usa">United States (Federal Awards)</option>
              <option value="india">India (Govt & World Bank)</option>
              <option value="global">Global (World Bank Projects)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" /> Best Matches for You
          </h2>
        </div>
        
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-medium flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p>Fetching real-time tenders...</p>
            </div>
          ) : tenders.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No tenders available at the moment. Please try again later.</div>
          ) : (
            tenders.map((tender) => (
              <div key={tender.id} className="p-6 hover:bg-slate-50 transition flex flex-col md:flex-row gap-6 md:items-start justify-between group">
                <div className="flex-1 space-y-3">
                  <h3 className="text-base font-semibold text-slate-900 transition">
                    {tender.url && tender.url !== '#' ? (
                      <a href={tender.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 hover:underline">
                        {tender.title}
                      </a>
                    ) : (
                      <span>{tender.title}</span>
                    )}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2">{tender.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pt-2">
                    <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-slate-400" /> {tender.buyer}</span>
                    <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-slate-400" /> {tender.value}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Deadline: {tender.deadline}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button 
                    onClick={() => handleTrackTender(tender)}
                    disabled={tracking[tender.id]}
                    className="flex items-center gap-2 bg-white border border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 hover:border-indigo-300 transition disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" /> 
                    {tracking[tender.id] ? 'Saving...' : 'Track Tender'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
