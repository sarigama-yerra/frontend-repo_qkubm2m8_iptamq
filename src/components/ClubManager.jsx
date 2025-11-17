import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ClubManager() {
  const [clubs, setClubs] = useState([])
  const [teams, setTeams] = useState([])
  const [members, setMembers] = useState([])

  const [clubForm, setClubForm] = useState({ name: '', city: '' })
  const [teamForm, setTeamForm] = useState({ club_id: '', name: '', age_group: '' })
  const [memberForm, setMemberForm] = useState({ club_id: '', first_name: '', last_name: '', role: 'player' })

  const loadAll = async () => {
    const [c, t, m] = await Promise.all([
      fetch(`${API}/clubs`).then(r => r.json()),
      fetch(`${API}/teams`).then(r => r.json()),
      fetch(`${API}/members`).then(r => r.json()),
    ])
    setClubs(c)
    setTeams(t)
    setMembers(m)
  }

  useEffect(() => { loadAll() }, [])

  const createClub = async (e) => {
    e.preventDefault()
    await fetch(`${API}/clubs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(clubForm) })
    setClubForm({ name: '', city: '' })
    loadAll()
  }

  const createTeam = async (e) => {
    e.preventDefault()
    await fetch(`${API}/teams`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(teamForm) })
    setTeamForm({ club_id: '', name: '', age_group: '' })
    loadAll()
  }

  const createMember = async (e) => {
    e.preventDefault()
    await fetch(`${API}/members`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(memberForm) })
    setMemberForm({ club_id: '', first_name: '', last_name: '', role: 'player' })
    loadAll()
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Create Club</h3>
        <form onSubmit={createClub} className="space-y-2">
          <input className="w-full border rounded px-3 py-2" placeholder="Name" value={clubForm.name} onChange={e=>setClubForm(v=>({ ...v, name: e.target.value }))} />
          <input className="w-full border rounded px-3 py-2" placeholder="City" value={clubForm.city} onChange={e=>setClubForm(v=>({ ...v, city: e.target.value }))} />
          <button className="w-full bg-blue-600 text-white rounded py-2">Save</button>
        </form>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Create Team</h3>
        <form onSubmit={createTeam} className="space-y-2">
          <select className="w-full border rounded px-3 py-2" value={teamForm.club_id} onChange={e=>setTeamForm(v=>({ ...v, club_id: e.target.value }))}>
            <option value="">Select Club</option>
            {clubs.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input className="w-full border rounded px-3 py-2" placeholder="Team name" value={teamForm.name} onChange={e=>setTeamForm(v=>({ ...v, name: e.target.value }))} />
          <input className="w-full border rounded px-3 py-2" placeholder="Age group (e.g., U12)" value={teamForm.age_group} onChange={e=>setTeamForm(v=>({ ...v, age_group: e.target.value }))} />
          <button className="w-full bg-blue-600 text-white rounded py-2">Save</button>
        </form>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Add Member</h3>
        <form onSubmit={createMember} className="space-y-2">
          <select className="w-full border rounded px-3 py-2" value={memberForm.club_id} onChange={e=>setMemberForm(v=>({ ...v, club_id: e.target.value }))}>
            <option value="">Select Club</option>
            {clubs.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input className="border rounded px-3 py-2" placeholder="First name" value={memberForm.first_name} onChange={e=>setMemberForm(v=>({ ...v, first_name: e.target.value }))} />
            <input className="border rounded px-3 py-2" placeholder="Last name" value={memberForm.last_name} onChange={e=>setMemberForm(v=>({ ...v, last_name: e.target.value }))} />
          </div>
          <select className="w-full border rounded px-3 py-2" value={memberForm.role} onChange={e=>setMemberForm(v=>({ ...v, role: e.target.value }))}>
            <option value="player">Player</option>
            <option value="coach">Coach</option>
            <option value="parent">Parent</option>
          </select>
          <button className="w-full bg-blue-600 text-white rounded py-2">Save</button>
        </form>
      </section>

      <section className="md:col-span-3 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Overview</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium">Clubs</h4>
            <ul className="list-disc pl-5">
              {clubs.map(c => <li key={c._id}>{c.name} {c.city ? `- ${c.city}` : ''}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Teams</h4>
            <ul className="list-disc pl-5">
              {teams.map(t => <li key={t._id}>{t.name} ({t.age_group})</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Members</h4>
            <ul className="list-disc pl-5">
              {members.map(m => <li key={m._id}>{m.first_name} {m.last_name} — {m.role}</li>)}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
