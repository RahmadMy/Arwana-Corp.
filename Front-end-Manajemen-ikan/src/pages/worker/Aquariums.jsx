import { useState, useEffect } from 'react'
import { aquariumService } from '../../services/aquariumService'

const WorkerAquariums = () => {
  const [aquariums, setAquariums] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAquariums = async () => {
      try {
        const response = await aquariumService.getAll()
        setAquariums(response.data || [])
      } catch (error) {
        console.error('Error fetching aquariums:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAquariums()
  }, [])

  if (loading) {
    return <div className="text-center py-12 text-white">Loading data...</div>
  }

  return (
    <div>
      <h1 className="text-5xl font-bold text-yellow-400 mb-8 uppercase">AQUARIUM</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aquariums.length > 0 ? (
          aquariums.map((item) => (
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
                    {item.namaAquarium}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-bold uppercase rounded-sm ${item.growth ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-gray-800 text-gray-500 border border-gray-700'}`}>
                    {item.growth ? 'Active' : 'Empty'}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Location</span>
                    <p className="text-gray-300 font-medium">{item.lokasi || '-'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Capacity</span>
                      <p className="text-white font-mono">{item.kapasitas} <span className="text-xs text-gray-600">Liters</span></p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Size</span>
                      <p className="text-white font-mono">{item.ukuran || '-'}</p>
                    </div>
                  </div>

                  {item.growth && (
                    <div className="bg-yellow-400/5 rounded-lg p-3 border border-yellow-400/20">
                      <p className="text-xs text-yellow-500 uppercase tracking-wide mb-1">Current Batch</p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-white text-sm font-medium">Batch #{item.growth.id}</p>
                          <p className="text-gray-400 text-xs">{item.growth.umur} hari</p>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-400 text-lg font-bold">{item.growth.jumlah}</p>
                          <p className="text-gray-500 text-[10px] uppercase">Fish</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* NOTE */}
                {item.catatan && (
                  <p className="text-sm text-gray-500 italic mb-6 pl-3 border-l-2 border-gray-800">
                    "{item.catatan}"
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-12 text-lg">
            No aquarium data found.
          </div>
        )}
      </div>



    </div>
  )
}

export default WorkerAquariums
