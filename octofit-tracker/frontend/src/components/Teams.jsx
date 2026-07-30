import { useEffect, useState } from 'react'

function normalizeCollection(payload) {
  if (Array.isArray(payload)) return payload
  if (payload && Array.isArray(payload.results)) return payload.results
  if (payload && Array.isArray(payload.items)) return payload.items
  if (payload && Array.isArray(payload.data)) return payload.data
  return []
}

function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const endpoint = import.meta.env.VITE_CODESPACE_NAME
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/'

  useEffect(() => {
    const controller = new AbortController()

    async function loadTeams() {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(endpoint, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        const payload = await response.json()
        setTeams(normalizeCollection(payload))
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Unable to load teams.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadTeams()
    return () => controller.abort()
  }, [endpoint])

  return (
    <section className="panel">
      <h2>Teams</h2>
      <p className="status-line">Endpoint: {endpoint}</p>
      {loading && <p>Loading teams...</p>}
      {!!error && <p className="error">{error}</p>}
      {!loading && !error && (
        <ul className="grid-list">
          {teams.map((team) => (
            <li key={team._id || team.id || team.name}>
              <strong>{team.name}</strong>
              <div>{team.motto || 'No motto yet'}</div>
              <div>Members: {team.members?.length ?? 0}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Teams
