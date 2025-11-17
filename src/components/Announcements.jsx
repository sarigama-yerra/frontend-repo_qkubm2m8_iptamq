import { useEffect, useState } from 'react'
import { Megaphone, AlertTriangle } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Announcements() {
  const [ann, setAnn] = useState([])
  const [teams, setTeams] = useState([])
  const [form, setForm] = useState({ club_id: '', team_id: '', title: '', message: '', level: 'info' })

  const load = async () => {
    const [a, t] = await Promise.all([
      fetch(`${API}/announcements`).then(r=>r.json()),
      fetch(`${API}/teams`).then(r=>r.json()),
    ])
    setAnn(a); setTeams(t)
  }

  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault()
    await fetch(`${API}/announcements`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
    setForm({ club_id: '', team_id: '', title: '', message: '', level: 'info' })
    load()
  }

  const inputBase = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50'

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur p-4 shadow-sm">
        <h3 className="font-semibold mb-2 tracking-tight">New Announcement</h3>
        <form onSubmit={create} className="space-y-2">
          <input className={inputBase} placeholder="Club ID" value={form.club_id} onChange={e=>setForm(v=>({ ...v, club_id: e.target.value }))} />
          <select className={inputBase} value={form.team_id} onChange={e=>setForm(v=>({ ...v, team_id: e.target.value }))}>
            <option value="">Select Team (optional)</option>
            {teams.map(t=> <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <input className={inputBase} placeholder="Title" value={form.title} onChange={e=>setForm(v=>({ ...v, title: e.target.value }))} />
          <textarea className={inputBase} rows={4} placeholder="Message" value={form.message} onChange={e=>setForm(v=>({ ...v, message: e.target.value }))} />
          <select className={inputBase} value={form.level} onChange={e=>setForm(v=>({ ...v, level: e.target.value }))}>
            <option>info</option><option>warning</option><option>urgent</option>
          </select>
          <button className="w-full bg-blue-600 text-white rounded-xl py-2 shadow hover:brightness-105 inline-flex items-center justify-center gap-2">
            <Megaphone size={16}/> Send
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur p-4 shadow-sm">
        <h3 className="font-semibold mb-2 tracking-tight">Recent</h3>
        <ul className="space-y-3">
          {ann.map(a => (
            <li key={a._id} className={`border rounded-xl p-3 ${a.level==='urgent'?'border-red-200 bg-red-50':a.level==='warning'?'border-amber-200 bg-amber-50':'border-gray-200 bg-white'}`}>
              <div className="text-xs uppercase tracking-wide text-gray-500">{a.level}</div>
              <div className="font-medium">{a.title}</div>
              <div className="text-sm text-gray-700">{a.message}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
