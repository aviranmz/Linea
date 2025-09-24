import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getJson, putJson } from '../lib/api'

type Entry = {
  id: string
  email: string
  status: string
  createdAt: string
}

export default function OwnerWaitlist() {
  const { eventId } = useParams<{ eventId: string }>()
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    if (!eventId) return
    setLoading(true)
    try {
      const res = await getJson<{ entries: Entry[] }>(`/api/owner/events/${eventId}/waitlist`)
      setEntries(res.entries || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [eventId])

  const update = async (id: string, status: string) => {
    await putJson(`/api/owner/waitlist/${id}`, { status })
    await load()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">Event Waitlist</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {entries.map((e) => (
                <tr key={e.id}>
                  <td className="px-4 py-2 text-sm text-gray-900">{e.email}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{e.status}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{new Date(e.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex gap-2">
                      <button className="btn btn-outline" onClick={() => update(e.id, 'APPROVED')}>Approve</button>
                      <button className="btn btn-outline" onClick={() => update(e.id, 'REJECTED')}>Reject</button>
                      <button className="btn btn-primary" onClick={() => update(e.id, 'ARRIVED')}>Mark Arrived</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


