import { useState, useEffect } from 'react'
import { fishSpeciesService } from '../../services/fishSpeciesService'

const WorkerFishSpecies = () => {
  const [species, setSpecies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await fishSpeciesService.getAll()
        setSpecies(response.data || [])
      } catch (error) {
        console.error('Error fetching species:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSpecies()
  }, [])

  if (loading) {
    return <div className="text-center py-12 text-white">Loading data...</div>
  }

  return (
    <div>
      <h1 className="text-5xl font-bold text-yellow-400 mb-8 uppercase">TYPES OF FISH</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {species.length > 0 ? (
          species.map((item) => (
            <div
              key={item.id}
              className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/10 flex flex-col"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

              {/* CONTENT */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    {item.namaVarietas}
                  </h3>
                  <span className="px-2 py-1 text-xs font-bold uppercase rounded-sm bg-gray-800 text-gray-500 border border-gray-700">
                    {item.asal || 'Unknown'}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Scientific Name</span>
                    <p className="text-yellow-400 font-mono italic">{item.namaSaint}</p>
                  </div>

                  {/* Description */}
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Description</span>
                    <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-12">
            No fish species data found.
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkerFishSpecies

