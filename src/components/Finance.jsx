import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Coins } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Finance() {
  const [setups, setSetups] = useState([])
  const [payments, setPayments] = useState([])
  const [teams, setTeams] = useState([])
  const [members, setMembers] = useState([])
  const [summary, setSummary] = useState(null)

  const [setupForm, setSetupForm] = useState({ club_id: '', team_id: '', amount: 25, interval: 'monthly', currency: 'EUR' })
  const [paymentForm, setPaymentForm] = useState({ club_id: '', member_id: '', amount: 25, currency: 'EUR', status: 'pending' })

  const load = async () => {
    const [s, p, t, m] = await Promise.all([
      fetch(`${API}/payment-setups`).then(r=>r.json()),
      fetch(`${API}/payments`).then(r=>r.json()),
      fetch(`${API}/teams`).then(r=>r.json()),
      fetch(`${API}/members`).then(r=>r.json()),
    ])
    setSetups(s); setPayments(p); setTeams(t); setMembers(m)
  }

  const loadSummary = async (clubId) => {
    if (!clubId) return setSummary(null)
    const data = await fetch(`${API}/finance/summary?club_id=${clubId}`).then(r=>r.json())
    setSummary(data)
  }

  useEffect(() => { load() }, [])

  const createSetup = async (e) => {
    e.preventDefault()
    await fetch(`${API}/payment-setups`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(setupForm) })
    setSetupForm({ club_id: '', team_id: '', amount: 25, interval: 'monthly', currency: 'EUR' })
    load()
  }

  const createPayment = async (e) => {
    e.preventDefault()
    await fetch(`${API}/payments`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(paymentForm) })
    setPaymentForm({ club_id: '', member_id: '', amount: 25, currency: 'EUR', status: 'pending' })
    load()
    loadSummary(paymentForm.club_id)
  }

  const inputBase = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50'
  const buttonBase = 'inline-flex items-center justify-center rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500/30'

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur p-4 shadow-sm">
          <h3 className="font-semibold mb-2 tracking-tight">Recurring Fee Setup</h3>
          <form onSubmit={createSetup} className="space-y-2">
            <input className={inputBase} placeholder="Club ID" value={setupForm.club_id} onChange={e=>setSetupForm(v=>({ ...v, club_id: e.target.value }))} />
            <select className={inputBase} value={setupForm.team_id} onChange={e=>setSetupForm(v=>({ ...v, team_id: e.target.value }))}>
              <option value="">Optional Team</option>
              {teams.map(t=> <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" className={inputBase} placeholder="Amount" value={setupForm.amount} onChange={e=>setSetupForm(v=>({ ...v, amount: Number(e.target.value) }))} />
              <select className={inputBase} value={setupForm.interval} onChange={e=>setSetupForm(v=>({ ...v, interval: e.target.value }))}>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <button className={`${buttonBase} w-full bg-blue-600 text-white py-2 shadow hover:brightness-105`}>Save</button>
          </form>
        </section>

        <section className="rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur p-4 shadow-sm">
          <h3 className="font-semibold mb-2 tracking-tight">Record Payment</h3>
          <form onSubmit={createPayment} className="space-y-2">
            <input className={inputBase} placeholder="Club ID" value={paymentForm.club_id} onChange={e=>setPaymentForm(v=>({ ...v, club_id: e.target.value }))} />
            <select className={inputBase} value={paymentForm.member_id} onChange={e=>setPaymentForm(v=>({ ...v, member_id: e.target.value }))}>
              <option value="">Select Member</option>
              {members.map(m=> <option key={m._id} value={m._id}>{m.first_name} {m.last_name}</option>)}
            </select>
            <div className="grid grid-cols-3 gap-2">
              <input type="number" className={inputBase} placeholder="Amount" value={paymentForm.amount} onChange={e=>setPaymentForm(v=>({ ...v, amount: Number(e.target.value) }))} />
              <select className={inputBase} value={paymentForm.currency} onChange={e=>setPaymentForm(v=>({ ...v, currency: e.target.value }))}>
                <option>EUR</option><option>USD</option><option>GBP</option>
              </select>
              <select className={inputBase} value={paymentForm.status} onChange={e=>setPaymentForm(v=>({ ...v, status: e.target.value }))}>
                <option>pending</option><option>paid</option><option>failed</option>
              </select>
            </div>
            <button className={`${buttonBase} w-full bg-blue-600 text-white py-2 shadow hover:brightness-105`}>Save</button>
          </form>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur p-4 shadow-sm">
        <h3 className="font-semibold mb-3 tracking-tight">Finance Overview</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl border border-gray-200 p-3 bg-gradient-to-br from-white to-gray-50">
            <h4 className="font-medium flex items-center gap-2"><Coins size={16} className="text-amber-600"/> Setups</h4>
            <ul className="mt-2 space-y-1">
              {setups.map(s => <li key={s._id}>{s.interval} • {s.amount} {s.currency} {s.team_id ? `• team ${s.team_id}` : ''}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 p-3 bg-gradient-to-br from-white to-gray-50">
            <h4 className="font-medium">Payments</h4>
            <ul className="mt-2 space-y-1">
              {payments.map(p => <li key={p._id} className="flex items-center justify-between"><span>{p.amount} {p.currency}</span><span className={`px-2 py-0.5 rounded text-xs ${p.status==='paid'?'bg-green-100 text-green-700':p.status==='pending'?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>{p.status}</span></li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 p-3 bg-gradient-to-br from-white to-gray-50">
            <h4 className="font-medium">Summary</h4>
            <div className="space-y-2 mt-2">
              <input className={inputBase} placeholder="Enter Club ID to load summary" onBlur={(e)=>loadSummary(e.target.value)} />
              {summary && (
                <div className="text-sm grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-green-50 p-2 flex items-center justify-between"><span>Total Paid</span><span className="font-semibold text-green-700">{summary.total_paid}</span></div>
                  <div className="rounded-lg bg-yellow-50 p-2 flex items-center justify-between"><span>Total Pending</span><span className="font-semibold text-yellow-700">{summary.total_pending}</span></div>
                  <div className="rounded-lg bg-green-50 p-2 flex items-center justify-between"><span>Paid Count</span><span className="font-semibold text-green-700">{summary.paid_count}</span></div>
                  <div className="rounded-lg bg-yellow-50 p-2 flex items-center justify-between"><span>Pending Count</span><span className="font-semibold text-yellow-700">{summary.pending_count}</span></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
