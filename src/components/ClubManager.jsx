import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Card({ title, children, footer }) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold tracking-tight">{title}</h3>
        {footer}
      </div>
      {children}
    </div>
  )
}

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

  const inputBase = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50'
  const buttonBase = 'inline-flex items-center justify-center rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500/30'

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card title="Create Club" footer={<span className="text-xs text-gray-500">Basic details</span>}>
        <form onSubmit={createClub} className="space-y-2">
          <input className={inputBase} placeholder="Name" value={clubForm.name} onChange={e=>setClubForm(v=>({ ...v, name: e.target.value }))} />
          <input className={inputBase} placeholder="City" value={clubForm.city} onChange={e=>setClubForm(v=>({ ...v, city: e.target.value }))} />
          <button className={`${buttonBase} w-full bg-blue-600 text-white py-2 shadow hover:brightness-105`}>
            <Plus size={16} className="mr-1"/> Save
          </button>
        </form>
      </Card>

      <Card title="Create Team" footer={<span className="text-xs text-gray-500">Attach to a club</span>}>
        <form onSubmit={createTeam} className="space-y-2">
          <select className={inputBase} value={teamForm.club_id} onChange={e=>setTeamForm(v=>({ ...v, club_id: e.target.value }))}>
            <option value="">Select Club</option>
            {clubs.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input className={inputBase} placeholder="Team name" value={teamForm.name} onChange={e=>setTeamForm(v=>({ ...v, name: e.target.value }))} />
          <input className={inputBase} placeholder="Age group (e.g., U12)" value={teamForm.age_group} onChange={e=>setTeamForm(v=>({ ...v, age_group: e.target.value }))} />
          <button className={`${buttonBase} w-full bg-blue-600 text-white py-2 shadow hover:brightness-105`}>
            <Plus size={16} className="mr-1"/> Save
          </button>
        </form>
      </Card>

      <Card title="Add Member" footer={<span className="text-xs text-gray-500">Players, coaches, parents</span>}>
        <form onSubmit={createMember} className="space-y-2">
          <select className={inputBase} value={memberForm.club_id} onChange={e=>setMemberForm(v=>({ ...v, club_id: e.target.value }))}>
            <option value="">Select Club</option>
            {clubs.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input className={`${inputBase}`} placeholder="First name" value={memberForm.first_name} onChange={e=>setMemberForm(v=>({ ...v, first_name: e.target.value }))} />
            <input className={`${inputBase}`} placeholder="Last name" value={memberForm.last_name} onChange={e=>setMemberForm(v=>({ ...v, last_name: e.target.value }))} />
          </div>
          <select className={inputBase} value={memberForm.role} onChange={e=>setMemberForm(v=>({ ...v, role: e.target.value }))}>
            <option value="player">Player</option>
            <option value="coach">Coach</option>
            <option value="parent">Parent</option>
          </select>
          <button className={`${buttonBase} w-full bg-blue-600 text-white py-2 shadow hover:brightness-105`}>
            <Plus size={16} className="mr-1"/> Save
          </button>
        </form>
      </Card>

      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-3 rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur p-4 shadow-sm">
        <h3 className="font-semibold mb-3 tracking-tight">Overview</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl border border-gray-200 p-3 bg-gradient-to-br from-white to-gray-50">
            <h4 className="font-medium">Clubs</h4>
            <ul className="mt-2 space-y-1">
              {clubs.map(c => <li key={c._id} className="text-gray-700">{c.name} {c.city ? `- ${c.city}` : ''}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 p-3 bg-gradient-to-br from-white to-gray-50">
            <h4 className="font-medium">Teams</h4>
            <ul className="mt-2 space-y-1">
              {teams.map(t => <li key={t._id} className="text-gray-700">{t.name} ({t.age_group})</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 p-3 bg-gradient-to-br from-white to-gray-50">
            <h4 className="font-medium">Members</h4>
            <ul className="mt-2 space-y-1">
              {members.map(m => <li key={m._id} className="text-gray-700">{m.first_name} {m.last_name} — {m.role}</li>)}
            </ul>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
