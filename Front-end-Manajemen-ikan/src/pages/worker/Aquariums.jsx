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
    aquariums.map((item) => (
      <div
        key={item.id}
        className="bg-black border-2 border-white rounded-xl shadow-md hover:shadow-yellow-400 transition-shadow duration-300 min-h-[220px] flex flex-col overflow-hidden"
      >
        {/* TITLE */}
        <div className="p-4 border-b border-white">
          <h3 className="text-yellow-400 font-bold text-lg tracking-wide">
            {item.namaAquarium}
          </h3>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-4 text-gray-300 text-sm space-y-2">
          <p>
            <span className="font-semibold text-yellow-400">Lokasi:</span> {item.lokasi || '-'}
          </p>
          <p>
            <span className="font-semibold text-yellow-400">Kapasitas:</span> {item.kapasitas || '-'}
          </p>
          <p>
            <span className="font-semibold text-yellow-400">Ukuran:</span> {item.ukuran || '-'}
          </p>
          {item.catatan && (
            <p>
              <span className="font-semibold text-yellow-400">Catatan:</span> {item.catatan}
            </p>
          )}

          {/* FISH GROWTH */}
          {item.growth ? (
            <div className="mt-3 p-3 border border-yellow-400 rounded text-yellow-400 text-xs bg-black/20">
              <p><span className="font-semibold">Fish Growth ID:</span> {item.growth.id}</p>
              <p><span className="font-semibold">Jumlah Ikan:</span> {item.growth.jumlah}</p>
              <p><span className="font-semibold">Umur:</span> {item.growth.umur} hari</p>
              <p><span className="font-semibold">Ukuran Ikan:</span> {item.growth.ukuran}</p>
            </div>
          ) : (
            <p className="mt-3 text-xs text-gray-500 italic">
              Tidak ada ikan di aquarium ini
            </p>
          )}
        </div>
      </div>
    ))
  ) : (
    <div className="col-span-full text-center text-gray-400 py-12 text-lg">
      Tidak ada data aquarium
    </div>
  )}
</div>


    </div>
  )
}

export default WorkerAquariums
