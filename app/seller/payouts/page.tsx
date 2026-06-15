'use client';

import { motion } from 'motion/react';
import { 
  IndianRupee, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Building2,
  TrendingUp,
  Wallet
} from 'lucide-react';

const mockPayouts = [
  { id: 'PO-2026-052', date: 'May 28, 2026', period: 'May 14 - May 27', amount: 45200, status: 'processing' },
  { id: 'PO-2026-051', date: 'May 14, 2026', period: 'Apr 30 - May 13', amount: 38500, status: 'completed' },
  { id: 'PO-2026-042', date: 'Apr 30, 2026', period: 'Apr 16 - Apr 29', amount: 52100, status: 'completed' },
  { id: 'PO-2026-041', date: 'Apr 16, 2026', period: 'Apr 02 - Apr 15', amount: 41000, status: 'completed' },
];

export default function SellerPayoutsPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-slate-900">Payouts & Balances</h1>
          <p className="text-slate-500 mt-1">Manage your earnings and view payout history</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
          <Calendar className="w-4 h-4" />
          Next Payout: Jun 11, 2026
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-emerald-500/20"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-10 -mr-10" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-emerald-100">
              <Wallet className="w-5 h-5" />
              <span className="font-bold text-sm uppercase tracking-wider">Next Payout</span>
            </div>
            <div className="flex items-baseline gap-1">
              <IndianRupee className="w-6 h-6" />
              <span className="text-4xl font-black tracking-tight">45,200</span>
            </div>
            <p className="text-emerald-100 text-sm">Processing for May 28, 2026</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-5 h-5" />
              <span className="font-bold text-sm uppercase tracking-wider">Pending Clearance</span>
            </div>
            <div className="flex items-baseline gap-1 text-slate-900">
              <IndianRupee className="w-6 h-6" />
              <span className="text-4xl font-black tracking-tight">12,450</span>
            </div>
            <p className="text-slate-400 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Waiting for return periods to end
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wider">Total Earned</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">YTD</span>
            </div>
            <div className="flex items-baseline gap-1 text-slate-900">
              <IndianRupee className="w-6 h-6" />
              <span className="text-4xl font-black tracking-tight">3,42,800</span>
            </div>
            <p className="text-emerald-500 font-bold text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +14% from last year
            </p>
          </div>
        </motion.div>
      </div>

      {/* Payout Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* History Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Payout History</h3>
              <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Payout ID</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Date</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Period</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Amount</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockPayouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{payout.id}</td>
                      <td className="p-4 text-slate-500">{payout.date}</td>
                      <td className="p-4 text-slate-500 text-sm">{payout.period}</td>
                      <td className="p-4 font-bold text-slate-900">₹{payout.amount.toLocaleString()}</td>
                      <td className="p-4">
                        {payout.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                            <Clock className="w-3.5 h-3.5" /> Processing
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bank Details & Schedule Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-slate-900">
              <Building2 className="w-6 h-6 text-emerald-500" />
              <h3 className="text-xl font-bold">Bank Details</h3>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Account Name</p>
              <p className="font-bold text-slate-900 mb-4">Green Thumb Nursery</p>
              
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Account Number</p>
              <p className="font-mono text-slate-900 mb-4">**** **** 5678</p>
              
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Bank Name</p>
              <p className="font-bold text-slate-900">HDFC Bank</p>
            </div>

            <button className="w-full py-3 text-sm font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              Update Bank Details
            </button>
          </div>

          <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 space-y-4">
            <h3 className="font-bold text-emerald-900">How Payouts Work</h3>
            <ul className="space-y-3 text-sm text-emerald-800">
              <li className="flex gap-2">
                <span className="font-black text-emerald-500">1.</span>
                <p>We process payouts on a <strong>bi-weekly</strong> schedule (every 14 days).</p>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-emerald-500">2.</span>
                <p>Funds become available for payout <strong>7 days</strong> after an order is successfully delivered to account for the return window.</p>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-emerald-500">3.</span>
                <p>Standard platform fees (12%) and payment gateway charges (2%) are automatically deducted before payout.</p>
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
