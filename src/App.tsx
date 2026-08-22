import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900">
      <h1 className="text-4xl font-bold mb-4">我的网站</h1>
      <p className="text-slate-600 mb-6">React + TypeScript + Vite + Tailwind CSS</p>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
      >
        点击 {count} 次
      </button>
    </div>
  )
}

export default App
