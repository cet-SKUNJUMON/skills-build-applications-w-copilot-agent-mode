import { useEffect, useState } from 'react'

function normalizeCollection(payload) {
  if (Array.isArray(payload)) return payload
  if (payload && Array.isArray(payload.results)) return payload.results
  if (payload && Array.isArray(payload.items)) return payload.items
  if (payload && Array.isArray(payload.data)) return payload.data
  return []
}

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const endpoint = import.meta.env.VITE_CODESPACE_NAME
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/'

  useEffect(() => {
    const controller = new AbortController()

    async function loadUsers() {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(endpoint, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        const payload = await response.json()
        setUsers(normalizeCollection(payload))
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Unable to load users.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
    return () => controller.abort()
  }, [endpoint])

  return (
    <section className="panel">
      <h2>Users</h2>
      <p className="status-line">Endpoint: {endpoint}</p>
      {loading && <p>Loading users...</p>}
      {!!error && <p className="error">{error}</p>}
      {!loading && !error && (
        <ul className="grid-list">
          {users.map((user) => (
            <li key={user._id || user.id || user.email}>
              <strong>{user.name}</strong>
              <div>Email: {user.email}</div>
              <div>Grade: {user.grade}</div>
              <div>Level: {user.fitnessLevel}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Users
