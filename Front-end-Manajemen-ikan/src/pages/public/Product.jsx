import { useState, useEffect } from 'react'
import { fishSpeciesService } from '../../services/fishSpeciesService'

const Product = () => {
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
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-white text-center">Memuat produk...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Produk</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {species.length > 0 ? (
          species.map((item) => (
            <div key={item.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-2">{item.namaVarietas}</h3>
              {item.namaSaint && <p className="text-gray-400 text-sm mb-2 italic">{item.namaSaint}</p>}
              {item.asal && <p className="text-gray-300 text-sm mb-2">Asal: {item.asal}</p>}
              {item.deskripsi && <p className="text-gray-300 text-sm">{item.deskripsi}</p>}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400">
            Belum ada produk tersedia
          </div>
        )}
      </div>
    </div>
  )
}

export default Product

