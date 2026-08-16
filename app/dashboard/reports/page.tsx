import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Reports</h1>
          <p className="text-slate-500">Analytics and insights into your tender pipeline.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Analytics Dashboard</h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          Detailed reporting on win rates, risk distributions, and sector focus will appear here once you process more documents.
        </p>
      </div>
    </div>
  );
}
