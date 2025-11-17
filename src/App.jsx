import { useState } from 'react'
import Header from './components/Header'
import ClubManager from './components/ClubManager'
import Schedule from './components/Schedule'
import Finance from './components/Finance'
import Announcements from './components/Announcements'

function App() {
  const [tab, setTab] = useState('club')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      <Header current={tab} onChange={setTab} />

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        <section className="bg-blue-600 text-white rounded-xl p-6 shadow">
          <h1 className="text-2xl font-bold">Run your whole club from one app</h1>
          <p className="text-blue-50 mt-1">Members, teams, payments, and communication — all connected and automated.</p>
        </section>

        {tab === 'club' && <ClubManager />}
        {tab === 'schedule' && <Schedule />}
        {tab === 'finance' && <Finance />}
        {tab === 'announcements' && <Announcements />}
      </main>
    </div>
  )
}

export default App
