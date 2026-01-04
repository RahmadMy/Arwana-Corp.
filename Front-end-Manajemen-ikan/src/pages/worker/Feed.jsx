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
    return <div className="text-center py-12 text-white">Loading data...</div>
  }

  return (
    <div>
      <h1 className="text-5xl font-bold text-yellow-400 mb-8 uppercase">FEED</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feeds.length > 0 ? (
          feeds.map((feed) => (
            <div
              key={feed.id}
              className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/10 flex flex-col"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

              {/* CONTENT */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    {feed.nama}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-bold uppercase rounded-sm ${feed.stock > 10 ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                    {feed.stock > 10 ? 'In Stock' : 'Low Stock'}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Stock Level</span>
                    <p className="text-3xl font-mono text-yellow-400 font-bold">{feed.stock} <span className="text-sm text-gray-500 font-normal">units</span></p>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Description</span>
                    <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                      {feed.deskripsi || 'No description provided.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-12 text-lg">
            No feed data found.
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkerFeed

