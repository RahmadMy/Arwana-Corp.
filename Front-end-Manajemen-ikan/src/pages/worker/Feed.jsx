import { useState, useEffect } from 'react'
import { feedService } from '../../services/feedService'

const WorkerFeed = () => {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await feedService.getAll()
        setFeeds(response.data || [])
      } catch (error) {
        console.error('Error fetching feeds:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeeds()
  }, [])

  if (loading) {
    return <div className="text-center py-12 text-white">Memuat data...</div>
  }

  return (
    <div>
      <h1 className="text-5xl font-bold text-yellow-400 mb-8 uppercase">FEED</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feeds.length > 0 ? (
          feeds.map((feed) => (
            <div key={feed.id} className="bg-black border-2 border-white rounded-lg p-6 flex flex-col h-full">
              <h3 className="text-white font-semibold text-xl mb-2">
                {feed.nama || '-'}
              </h3>
              <p className="text-gray-400 text-sm mb-2">
                Stock: {feed.stock || '-'}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {feed.deskripsi || '-'}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-12">
            Tidak ada data pakan
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkerFeed

