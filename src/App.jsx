import { useState } from 'react'
import Landing from './components/Landing'

function App() {
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [slug, setSlug] = useState('sample-project')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="relative max-w-6xl mx-auto p-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="Flames" className="w-10 h-10" />
            <h1 className="text-2xl font-bold">Masjid Fund Collection</h1>
          </div>
          <div className="flex items-center gap-2">
            <input value={slug} onChange={e=>setSlug(e.target.value)} placeholder="Project slug" className="bg-slate-800/60 rounded px-3 py-2" />
          </div>
        </header>

        <Landing slug={slug} backend={backend} />
      </div>
    </div>
  )
}

export default App
