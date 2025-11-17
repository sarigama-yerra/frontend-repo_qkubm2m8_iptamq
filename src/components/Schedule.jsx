import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, MapPin } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Schedule() {
  const [events, setEvents] = useState([])
  const [teams, setTeams] = useState([])
  const [form, setForm] = useState({ club_id: '', team_id: '', type: 'training', title: '', start_time: '', end_time: '', location: '' })

  const load = async () => {
    const [e, t] = await Promise.all([
      fetch(`${API}/events`).then(r=>r.json()),
      fetch(`${API}/teams`).then(r=>r.json()),
    ])
    setEvents(e)
    setTeams(t)
  }

  useEffect(() => { load() }, [])

  const createEvent = async (e) => {
    e.preventDefault()
    const payload = { ...form, start_time: new Date(form.start_time).toISOString(), end_time: new Date(form.end_time).toISOString() }
    await fetch(`${API}/events`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    setForm({ club_id: '', team_id: '', type: 'training', title: '', start_time: '', end_time: '', location: '' })
    load()
  }

  const inputBase = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50'
  const buttonBase = 'inline-flex items-center justify-center rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500/30'

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur p-4 shadow-sm">
        <h3 className="font-semibold mb-2 tracking-tight">Create Event</h3>
        <form onSubmit={createEvent} className="space-y-2">
          <select className={inputBase} value={form.club_id} onChange={e=>setForm(v=>({ ...v, club_id: e.target.value }))}>
            <option value="">Select Club (optional)</option>
          </select>
          <select className={inputBase} value={form.team_id} onChange={e=>setForm(v=>({ ...v, team_id: e.target.value }))}>
            <option value="">Select Team</option>
            {teams.map(t=> <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <select className={inputBase} value={form.type} onChange={e=>setForm(v=>({ ...v, type: e.target.value }))}>
              <option value="training">Training</option>
              <option value="match">Match</option>
            </select>
            <input className={inputBase} placeholder="Title" value={form.title} onChange={e=>setForm(v=>({ ...v, title: e.target.value }))} />
          </div>
          <input type="datetime-local" className={inputBase} value={form.start_time} onChange={e=>setForm(v=>({ ...v, start_time: e.target.value }))} />
          <input type="datetime-local" className={inputBase} value={form.end_time} onChange={e=>setForm(v=>({ ...v, end_time: e.target.value }))} />
          <input className={inputBase} placeholder="Location" value={form.location} onChange={e=>setForm(v=>({ ...v, location: e.target.value }))} />
          <button className={`${buttonBase} w-full bg-blue-600 text-white py-2 shadow hover:brightness-105`}>Save</button>
        </form>
      </section>

      <section className="rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur p-4 shadow-sm">
        <h3 className="font-semibold mb-2 tracking-tight">Upcoming Events</h3>
        <ul className="divide-y">
          {events.map(ev => (
            <li key={ev._id} className="py-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="text-blue-600" size={18} />
                <div className="font-medium">{ev.title} • {ev.type}</div>
              </div>
              <div className="text-sm text-gray-600 mt-0.5">{new Date(ev.start_time).toLocaleString()} → {new Date(ev.end_time).toLocaleString()}</div>
              {ev.location && (
                <div className="text-sm text-gray-700 mt-0.5 inline-flex items-center gap-1">
                  <MapPin size={14} /> {ev.location}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
