import { useEffect, useState } from 'react'
import { fishGrowthService } from '../../services/fishGrowthService'
import { fishSpeciesService } from '../../services/fishSpeciesService'
import { aquariumService } from '../../services/aquariumService'

const WorkerFishGrowth = () => {
  const [growth, setGrowth] = useState([])
  const [species, setSpecies] = useState([])
  const [aquariums, setAquariums] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  /* ===== DELETE MODAL STATE ===== */
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const [formData, setFormData] = useState({
    speciesId: '',
    aquariumId: '',
    jumlah: '',
    umur: '',
    ukuran: '',
    catatan: '',
    gender: '',
    grade: '',
    purpose: '',
  })

  /* ================= FETCH ================= */
  const fetchGrowth = async () => {
    try {
      const res = await fishGrowthService.getAll()
      setGrowth(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSpecies = async () => {
    try {
      const res = await fishSpeciesService.getAll()
      setSpecies(res.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchAquariums = async () => {
    try {
      const res = await aquariumService.getAll()
      setAquariums(res.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchGrowth()
    fetchSpecies()
    fetchAquariums()
  }, [])

  /* ================= MODAL ================= */
  const openAddModal = () => {
    setIsEdit(false)
    setSelectedId(null)
    setFormData({
      speciesId: '',
      aquariumId: '',
      jumlah: '',
      umur: '',
      ukuran: '',
      catatan: '',
      gender: '',
      grade: '',
      purpose: '',
    })
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setIsEdit(true)
    setSelectedId(item.id)
    setFormData({
      speciesId: item.speciesId || '',
      aquariumId: item.aquariumId || '',
      jumlah: item.jumlah || '',
      umur: item.umur || '',
      ukuran: item.ukuran || '',
      catatan: item.catatan || '',
      gender: item.gender || '',
      grade: item.grade || '',
      purpose: item.purpose || '',
    })
    setShowModal(true)
  }

  /* ================= FORM ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isEdit) {
        await fishGrowthService.update(selectedId, formData)
      } else {
        await fishGrowthService.create(formData)
      }
      setShowModal(false)
      fetchGrowth()
    } catch (err) {
      console.error(err)
    }
  }

  /* ================= DELETE ================= */
  const openDeleteModal = (id) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      await fishGrowthService.delete(deleteId)
      setShowDeleteModal(false)
      setDeleteId(null)
      fetchGrowth()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-white">Memuat data...</div>
  }

  return (
    <div>

      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold text-yellow-400 uppercase">
          Fish Growth
        </h1>

        <button
          onClick={openAddModal}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg"
        >
          + Add Fish Growth
        </button>
      </div>

      {/* ===== GRID ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {growth.length > 0 ? (
          growth.map((item) => (
            <div
              key={item.id}
              className="bg-black border-2 border-white rounded-lg p-6 flex flex-col"
            >
              <h3 className="text-white font-semibold text-xl mb-1">
                {item.species?.namaVarietas || '-'}
              </h3>
              <p className="text-gray-500 text-sm mb-3">
                Aquarium: {item.aquarium?.namaAquarium || '-'}
              </p>

              <p className="text-gray-400 text-sm mb-1">Jumlah: {item.jumlah}</p>
              <p className="text-gray-400 text-sm mb-1">Umur: {item.umur}</p>
              <p className="text-gray-400 text-sm mb-1">Ukuran: {item.ukuran}</p>
              <p className="text-gray-400 text-sm mb-1">Gender: {item.gender || '-'}</p>
              <p className="text-gray-400 text-sm mb-1">Grade: {item.grade || '-'}</p>
              <p className="text-gray-400 text-sm mb-1">Purpose: {item.purpose || '-'}</p>
              <p className="text-gray-400 text-sm mb-4">Catatan: {item.catatan}</p>

              <div className="flex justify-end gap-4 pt-4 mt-auto border-t border-white">
                <button
                  onClick={() => openEditModal(item)}
                  className="text-white hover:text-orange-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => openDeleteModal(item.id)}
                  className="text-white hover:text-red-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-12">
            Tidak ada data pertumbuhan ikan
          </div>
        )}
      </div>

      {/* ===== MODAL ADD / EDIT ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border border-gray-700 rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isEdit ? 'Edit Fish Growth' : 'Add Fish Growth'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <select
                name="speciesId"
                value={formData.speciesId}
                onChange={handleChange}
                required
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              >
                <option value="">-- Pilih Jenis Ikan --</option>
                {species.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.namaVarietas}
                  </option>
                ))}
              </select>

              <select
                name="aquariumId"
                value={formData.aquariumId}
                onChange={handleChange}
                required
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              >
                <option value="">-- Pilih Aquarium --</option>
                {aquariums.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.namaAquarium}
                  </option>
                ))}
              </select>

              {['jumlah', 'umur', 'ukuran'].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field}
                  className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
                />
              ))}

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              >
                <option value="">-- Gender (optional) --</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              >
                <option value="">-- Grade (optional) --</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="PREMIUM">PREMIUM</option>
                <option value="EXPORT">EXPORT</option>
              </select>

              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              >
                <option value="">-- Purpose (optional) --</option>
                <option value="JUAL">JUAL</option>
                <option value="BREEDING">BREEDING</option>
                <option value="KONTES">KONTES</option>
                <option value="DISPLAY">DISPLAY</option>
                <option value="EXPORT">EXPORT</option>
              </select>

              <textarea
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
                rows="3"
                placeholder="Catatan"
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== DELETE MODAL ===== */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border border-gray-600 rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4">
              Hapus Fish Growth
            </h2>

            <p className="text-gray-300 mb-6">
              Apakah kamu yakin ingin menghapus data ini?
              <span className="text-yellow-400 font-semibold">
                {' '}Tindakan ini tidak bisa dibatalkan.
              </span>
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-white"
              >
                Batal
              </button>

              <button
                onClick={confirmDelete}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default WorkerFishGrowth
