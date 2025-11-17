import { useEffect, useState } from 'react'

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

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">New Announcement</h3>
        <form onSubmit={create} className="space-y-2">
          <input className="w-full border rounded px-3 py-2" placeholder="Club ID" value={form.club_id} onChange={e=>setForm(v=>({ ...v, club_id: e.target.value }))} />
          <select className="w-full border rounded px-3 py-2" value={form.team_id} onChange={e=>setForm(v=>({ ...v, team_id: e.target.value }))}>
            <option value="">Select Team (optional)</option>
            {teams.map(t=> <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <input className="w-full border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={e=>setForm(v=>({ ...v, title: e.target.value }))} />
          <textarea className="w-full border rounded px-3 py-2" rows={4} placeholder="Message" value={form.message} onChange={e=>setForm(v=>({ ...v, message: e.target.value }))} />
          <select className="w-full border rounded px-3 py-2" value={form.level} onChange={e=>setForm(v=>({ ...v, level: e.target.value }))}>
            <option>info</option><option>warning</option><option>urgent</option>
          </select>
          <button className="w-full bg-blue-600 text-white rounded py-2">Send</button>
        </form>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Recent</h3>
        <ul className="space-y-3">
          {ann.map(a => (
            <li key={a._id} className="border rounded p-3">
              <div className="text-sm uppercase tracking-wide text-gray-500">{a.level}</div>
              <div className="font-medium">{a.title}</div>
              <div className="text-sm text-gray-700">{a.message}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
