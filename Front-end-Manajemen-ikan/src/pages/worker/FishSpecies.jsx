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
    return <div className="text-center py-12 text-white">Memuat data...</div>
  }

  return (
    <div>
      <h1 className="text-5xl font-bold text-yellow-400 mb-8 uppercase">TYPES OF FISH</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {species.length > 0 ? (
          species.map((item) => (
            <div key={item.id} className="bg-black border-2 border-white rounded-lg p-6 flex flex-col h-full">
              <h3 className="text-white font-semibold text-xl mb-2">
                {item.namaVarietas || '-'}
              </h3>
              <p className="text-gray-400 text-sm mb-2">
                Nama Saint: {item.namaSaint || '-'}
              </p>
              <p className="text-gray-400 text-sm mb-2">
                Asal: {item.asal || '-'}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {item.deskripsi || '-'}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-12">
            Tidak ada data varietas ikan
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkerFishSpecies

