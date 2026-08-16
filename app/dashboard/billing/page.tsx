'use client';

import { useState } from 'react';
import { CheckCircle2, Zap, Shield } from 'lucide-react';

type Currency = 'USD' | 'EUR' | 'INR';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  INR: '₹'
};

const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  INR: 83.5
};

const PLANS = [
  {
    name: 'Starter',
    description: 'Perfect for small businesses starting with public tenders.',
    basePrice: 0, // USD
    features: [
      '3 free AI tender analyses',
      'Daily tender matches',
      'Basic compliance checks',
      'Community support'
    ],
    buttonText: 'Current Plan',
    popular: false
  },
  {
    name: 'Pro',
    description: 'Advanced AI analysis for growing contracting teams.',
    basePrice: 49, // USD
    features: [
      'Unlimited AI tender analyses',
      'Priority tender matches',
      'Deep risk & compliance breakdowns',
      'Export reports to PDF/Word',
      'Email support'
    ],
    buttonText: 'Upgrade to Pro',
    popular: true
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for large organizations and agencies.',
    basePrice: 199, // USD
    features: [
      'Everything in Pro',
      'Custom API integrations',
      'Dedicated account manager',
      'Team collaboration tools',
      'SLA guarantee'
    ],
    buttonText: 'Contact Sales',
    popular: false
  }
];

export default function BillingPage() {
  const [currency, setCurrency] = useState<Currency>('USD');

  const convertPrice = (basePrice: number) => {
    if (basePrice === 0) return 0;
    const converted = basePrice * EXCHANGE_RATES[currency];
    // Custom rounding for cleaner price points based on currency
    if (currency === 'INR') {
      return Math.round(converted / 100) * 100 - 1; // e.g., 4099
    }
    if (currency === 'EUR') {
      return Math.round(converted);
    }
    return basePrice;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Billing & Plans</h1>
          <p className="text-slate-500">Manage your subscription and billing preferences.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
          {(['USD', 'EUR', 'INR'] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                currency === c 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        {PLANS.map((plan) => {
          const price = convertPrice(plan.basePrice);
          const symbol = CURRENCY_SYMBOLS[currency];
          
          return (
            <div 
              key={plan.name} 
              className={`relative bg-white rounded-3xl p-8 border ${
                plan.popular ? 'border-indigo-600 shadow-xl shadow-indigo-100' : 'border-slate-200 shadow-lg shadow-slate-100'
              } flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <Zap className="w-3 h-3" /> Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-500 text-sm h-10">{plan.description}</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-slate-900 tracking-tight">
                    {price === 0 ? 'Free' : `${symbol}${price.toLocaleString()}`}
                  </span>
                  {price !== 0 && <span className="text-slate-500 font-medium">/mo</span>}
                </div>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-3.5 rounded-xl font-bold transition-all ${
                  plan.popular 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' 
                    : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="mt-12 bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 shrink-0">
            <Shield className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">Secure Checkout</h4>
            <p className="text-slate-500 text-sm">All payments are processed securely via Stripe. Cancel anytime without hidden fees.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
