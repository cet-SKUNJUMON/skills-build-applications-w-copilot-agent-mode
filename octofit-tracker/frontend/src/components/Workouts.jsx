import { useEffect, useState } from 'react'

function normalizeCollection(payload) {
  if (Array.isArray(payload)) return payload
  if (payload && Array.isArray(payload.results)) return payload.results
  if (payload && Array.isArray(payload.items)) return payload.items
  if (payload && Array.isArray(payload.data)) return payload.data
  return []
}

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const endpoint = import.meta.env.VITE_CODESPACE_NAME
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/'

  useEffect(() => {
    const controller = new AbortController()

    async function loadWorkouts() {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(endpoint, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        const payload = await response.json()
        setWorkouts(normalizeCollection(payload))
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Unable to load workouts.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadWorkouts()
    return () => controller.abort()
  }, [endpoint])

  return (
    <section className="panel">
      <h2>Workouts</h2>
      <p className="status-line">Endpoint: {endpoint}</p>
      {loading && <p>Loading workouts...</p>}
      {!!error && <p className="error">{error}</p>}
      {!loading && !error && (
        <ul className="grid-list">
          {workouts.map((workout) => (
            <li key={workout._id || workout.id || workout.title}>
              <strong>{workout.title}</strong>
              <div>{workout.description}</div>
              <div>
                {workout.level} • {workout.duration} min • {workout.category}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Workouts
