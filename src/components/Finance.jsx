import { useEffect, useState } from 'react'

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

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Recurring Fee Setup</h3>
          <form onSubmit={createSetup} className="space-y-2">
            <input className="w-full border rounded px-3 py-2" placeholder="Club ID" value={setupForm.club_id} onChange={e=>setSetupForm(v=>({ ...v, club_id: e.target.value }))} />
            <select className="w-full border rounded px-3 py-2" value={setupForm.team_id} onChange={e=>setSetupForm(v=>({ ...v, team_id: e.target.value }))}>
              <option value="">Optional Team</option>
              {teams.map(t=> <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" className="border rounded px-3 py-2" placeholder="Amount" value={setupForm.amount} onChange={e=>setSetupForm(v=>({ ...v, amount: Number(e.target.value) }))} />
              <select className="border rounded px-3 py-2" value={setupForm.interval} onChange={e=>setSetupForm(v=>({ ...v, interval: e.target.value }))}>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <button className="w-full bg-blue-600 text-white rounded py-2">Save</button>
          </form>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Record Payment</h3>
          <form onSubmit={createPayment} className="space-y-2">
            <input className="w-full border rounded px-3 py-2" placeholder="Club ID" value={paymentForm.club_id} onChange={e=>setPaymentForm(v=>({ ...v, club_id: e.target.value }))} />
            <select className="w-full border rounded px-3 py-2" value={paymentForm.member_id} onChange={e=>setPaymentForm(v=>({ ...v, member_id: e.target.value }))}>
              <option value="">Select Member</option>
              {members.map(m=> <option key={m._id} value={m._id}>{m.first_name} {m.last_name}</option>)}
            </select>
            <div className="grid grid-cols-3 gap-2">
              <input type="number" className="border rounded px-3 py-2" placeholder="Amount" value={paymentForm.amount} onChange={e=>setPaymentForm(v=>({ ...v, amount: Number(e.target.value) }))} />
              <select className="border rounded px-3 py-2" value={paymentForm.currency} onChange={e=>setPaymentForm(v=>({ ...v, currency: e.target.value }))}>
                <option>EUR</option><option>USD</option><option>GBP</option>
              </select>
              <select className="border rounded px-3 py-2" value={paymentForm.status} onChange={e=>setPaymentForm(v=>({ ...v, status: e.target.value }))}>
                <option>pending</option><option>paid</option><option>failed</option>
              </select>
            </div>
            <button className="w-full bg-blue-600 text-white rounded py-2">Save</button>
          </form>
        </section>
      </div>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Finance Overview</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium">Setups</h4>
            <ul className="list-disc pl-5">
              {setups.map(s => <li key={s._id}>{s.interval} • {s.amount} {s.currency} {s.team_id ? `• team ${s.team_id}` : ''}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Payments</h4>
            <ul className="list-disc pl-5">
              {payments.map(p => <li key={p._id}>{p.amount} {p.currency} — {p.status}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Summary</h4>
            <div className="space-y-1">
              <input className="w-full border rounded px-3 py-2" placeholder="Enter Club ID to load summary" onBlur={(e)=>loadSummary(e.target.value)} />
              {summary && (
                <div className="text-sm bg-gray-50 p-2 rounded">
                  <div>Total Paid: {summary.total_paid}</div>
                  <div>Total Pending: {summary.total_pending}</div>
                  <div>Paid Count: {summary.paid_count}</div>
                  <div>Pending Count: {summary.pending_count}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
