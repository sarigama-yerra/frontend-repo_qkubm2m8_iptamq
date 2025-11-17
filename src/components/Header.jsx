import { Megaphone, Calendar, Users, Wallet } from 'lucide-react'

export default function Header({ current, onChange }) {
  const tabs = [
    { id: 'club', label: 'Club', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
  ]

  return (
    <header className="bg-white/80 backdrop-blur sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-bold">Sports Club MVP</div>
        <nav className="flex gap-2">
          {tabs.map((t) => {
            const Icon = t.icon
            const active = current === t.id
            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className={
                  'inline-flex items-center gap-2 px-3 py-2 rounded-md transition ' +
                  (active
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-gray-100')
                }
              >
                <Icon size={18} />
                <span>{t.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
