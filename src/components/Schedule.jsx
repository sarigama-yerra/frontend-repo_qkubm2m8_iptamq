import { useEffect, useState } from 'react'

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

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Create Event</h3>
        <form onSubmit={createEvent} className="space-y-2">
          <select className="w-full border rounded px-3 py-2" value={form.club_id} onChange={e=>setForm(v=>({ ...v, club_id: e.target.value }))}>
            <option value="">Select Club (optional)</option>
          </select>
          <select className="w-full border rounded px-3 py-2" value={form.team_id} onChange={e=>setForm(v=>({ ...v, team_id: e.target.value }))}>
            <option value="">Select Team</option>
            {teams.map(t=> <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <select className="border rounded px-3 py-2" value={form.type} onChange={e=>setForm(v=>({ ...v, type: e.target.value }))}>
              <option value="training">Training</option>
              <option value="match">Match</option>
            </select>
            <input className="border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={e=>setForm(v=>({ ...v, title: e.target.value }))} />
          </div>
          <input type="datetime-local" className="w-full border rounded px-3 py-2" value={form.start_time} onChange={e=>setForm(v=>({ ...v, start_time: e.target.value }))} />
          <input type="datetime-local" className="w-full border rounded px-3 py-2" value={form.end_time} onChange={e=>setForm(v=>({ ...v, end_time: e.target.value }))} />
          <input className="w-full border rounded px-3 py-2" placeholder="Location" value={form.location} onChange={e=>setForm(v=>({ ...v, location: e.target.value }))} />
          <button className="w-full bg-blue-600 text-white rounded py-2">Save</button>
        </form>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Upcoming Events</h3>
        <ul className="divide-y">
          {events.map(ev => (
            <li key={ev._id} className="py-3">
              <div className="font-medium">{ev.title} • {ev.type}</div>
              <div className="text-sm text-gray-600">{new Date(ev.start_time).toLocaleString()} → {new Date(ev.end_time).toLocaleString()}</div>
              {ev.location && <div className="text-sm">{ev.location}</div>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
