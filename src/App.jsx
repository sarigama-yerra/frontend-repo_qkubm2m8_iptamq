import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import ClubManager from './components/ClubManager'
import Schedule from './components/Schedule'
import Finance from './components/Finance'
import Announcements from './components/Announcements'

function App() {
  const [tab, setTab] = useState('club')

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient + blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-blue-100" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl"
        />
      </div>

      <Header current={tab} onChange={setTab} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <motion.section
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 backdrop-blur-lg shadow-xl"
        >
          <div className="relative p-8 md:p-10">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Run your entire club with a modern, unified workspace
            </h1>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Members, teams, schedules, payments, and communication — connected and streamlined so you can focus on the game.
            </p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { k: 'Clubs', v: 'Unlimited' },
                { k: 'Members', v: 'Real-time' },
                { k: 'Payments', v: 'Tracked' },
                { k: 'Announcements', v: 'Instant' },
              ].map((item) => (
                <div key={item.k} className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-4 text-center">
                  <div className="text-xs uppercase tracking-wider text-blue-600/70">{item.k}</div>
                  <div className="text-lg font-semibold">{item.v}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {tab === 'club' && <ClubManager />}
        {tab === 'schedule' && <Schedule />}
        {tab === 'finance' && <Finance />}
        {tab === 'announcements' && <Announcements />}
      </main>
    </div>
  )
}

export default App
