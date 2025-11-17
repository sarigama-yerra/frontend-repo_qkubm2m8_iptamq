import { Megaphone, Calendar, Users, Wallet, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Header({ current, onChange }) {
  const tabs = [
    { id: 'club', label: 'Club', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
  ]

  return (
    <header className="sticky top-0 z-20">
      <div className="absolute inset-0 -z-10 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-white/70" />
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white grid place-items-center shadow-lg">
            <Sparkles size={18} />
          </div>
          <div className="text-lg md:text-xl font-black tracking-tight">Sports Club</div>
        </div>
        <nav className="flex gap-2">
          {tabs.map((t, i) => {
            const Icon = t.icon
            const active = current === t.id
            return (
              <motion.button
                key={t.id}
                onClick={() => onChange(t.id)}
                whileTap={{ scale: 0.98 }}
                className={
                  'inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition shadow-sm ' +
                  (active
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200')
                }
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{t.label}</span>
              </motion.button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
