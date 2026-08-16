'use client';

import { Settings, Shield, Bell } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-500">Configure your account preferences.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Settings className="w-5 h-5 text-slate-400" /> General
            </h2>
            <p className="text-sm text-slate-500">Update your basic profile information.</p>
          </div>
          <div className="md:w-2/3 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
              <input type="text" defaultValue="Arjun" className="w-full max-w-md bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" defaultValue="arjun@example.com" disabled className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-500 cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Bell className="w-5 h-5 text-slate-400" /> Notifications
            </h2>
            <p className="text-sm text-slate-500">Manage how we contact you.</p>
          </div>
          <div className="md:w-2/3 space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
              <span className="text-sm text-slate-700">Email me when a new tender matches my profile</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
              <span className="text-sm text-slate-700">Email me 48 hours before a submission deadline</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
              <span className="text-sm text-slate-700">Send weekly digest of tender activity</span>
            </label>
          </div>
        </div>

      </div>
      
      <div className="flex justify-end">
        <button onClick={() => alert('Settings saved successfully')} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}
