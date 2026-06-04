import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const STATUS_CONFIG = {
  todo:        { label: 'A faire',  color: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'En cours', color: 'bg-amber-100 text-amber-700' },
  done:        { label: 'Termine',  color: 'bg-green-100 text-green-700' },
}

export default function Dashboard() {
  const { logout } = useAuth()
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks/')
      setTasks(res.data)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    const res = await api.post('/tasks/', { title, status: 'todo' })
    setTasks([...tasks, res.data])
    setTitle('')
  }

  const updateStatus = async (id, status) => {
    const res = await api.put(`/tasks/${id}`, { status })
    setTasks(tasks.map(t => t.id === id ? res.data : t))
  }

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`)
    setTasks(tasks.filter(t => t.id !== id))
  }

  const counts = {
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-gray-900">Task Manager</h1>
        <button onClick={logout}
          className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 transition">
          Deconnexion
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <div key={key} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="text-2xl font-extrabold text-gray-900">{counts[key]}</div>
              <div className="text-xs text-gray-500 mt-1">{cfg.label}</div>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        <form onSubmit={createTask} className="flex gap-3 mb-6">
          <input
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition"
            placeholder="Nouvelle tache..."
            value={title} onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 rounded-xl text-sm transition">
            Ajouter
          </button>
        </form>

        {/* Liste */}
        {loading ? (
          <p className="text-center text-gray-400 py-8">Chargement...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-400 py-8">Aucune tache. Cree-en une !</p>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id}
                className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_CONFIG[task.status].color}`}>
                    {STATUS_CONFIG[task.status].label}
                  </span>
                  <span className="text-sm font-medium text-gray-800">{task.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {task.status !== 'done' && (
                    <button
                      onClick={() => updateStatus(task.id, task.status === 'todo' ? 'in_progress' : 'done')}
                      className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:border-blue-400 hover:text-blue-600 transition">
                      {task.status === 'todo' ? 'Demarrer' : 'Terminer'}
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:border-red-400 hover:text-red-500 transition">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
