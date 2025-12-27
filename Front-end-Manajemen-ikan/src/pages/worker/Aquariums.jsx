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
    return <div className="text-center py-12 text-white">Memuat data...</div>
  }

  return (
    <div>
      <h1 className="text-5xl font-bold text-yellow-400 mb-8 uppercase">AQUARIUM</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aquariums.length > 0 ? (
          aquariums.map((aquarium) => (
            <div
              key={aquarium.id}
              className="bg-black border-2 border-white rounded-lg min-h-[200px] flex flex-col"
            >
              <div className="p-4 border-b border-white">
                <h3 className="text-white font-semibold text-lg">
                  {aquarium.namaAquarium}
                </h3>
              </div>
              <div className="flex-1 p-4 text-gray-400 text-sm space-y-1">
                <p>Lokasi: {aquarium.lokasi || '-'}</p>
                <p>Kapasitas: {aquarium.kapasitas || '-'}</p>
                <p>Ukuran: {aquarium.ukuran || '-'}</p>
                {aquarium.catatan && <p>{aquarium.catatan}</p>}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-12">
            Tidak ada data aquarium
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkerAquariums

