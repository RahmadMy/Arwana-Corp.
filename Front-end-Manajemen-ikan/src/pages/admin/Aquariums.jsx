import { useEffect, useState } from 'react'
import { aquariumService } from '../../services/aquariumService'

const AdminAquariums = () => {
  const [aquariums, setAquariums] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  /* ===== DELETE MODAL STATE (BARU) ===== */
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  /* ===== CANNOT DELETE MODAL STATE (BARU) ===== */
  const [showCannotDeleteModal, setShowCannotDeleteModal] = useState(false)

  const [formData, setFormData] = useState({
    namaAquarium: '',
    lokasi: '',
    kapasitas: '',
    ukuran: '',
    catatan: '',
  })

  /* ================= FETCH ================= */
  const fetchAquariums = async () => {
    try {
      const res = await aquariumService.getAll()
      setAquariums(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAquariums()
  }, [])

  /* ================= MODAL ================= */
  const openAddModal = () => {
    setIsEdit(false)
    setSelectedId(null)
    setFormData({
      namaAquarium: '',
      lokasi: '',
      kapasitas: '',
      ukuran: '',
      catatan: '',
    })
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setIsEdit(true)
    setSelectedId(item.id)
    setFormData({
      namaAquarium: item.namaAquarium,
      lokasi: item.lokasi,
      kapasitas: item.kapasitas,
      ukuran: item.ukuran,
      catatan: item.catatan,
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
        await aquariumService.update(selectedId, formData)
      } else {
        await aquariumService.create(formData)
      }
      setShowModal(false)
      fetchAquariums()
    } catch (err) {
      console.error(err)
    }
  }

  /* ================= DELETE (DIUBAH) ================= */
  const openDeleteModal = (item) => {
    if (item.growth) {
      // Jika ada ikan, tampilkan modal info tidak bisa hapus
      setDeleteId(null)
      setShowCannotDeleteModal(true)
    } else {
      setDeleteId(item.id)
      setShowDeleteModal(true)
    }
  }

  const confirmDelete = async () => {
    try {
      await aquariumService.delete(deleteId)
      setShowDeleteModal(false)
      setDeleteId(null)
      fetchAquariums()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-white">Memuat data...</div>
  }

  return (
    <div className="relative">

      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-bold text-yellow-400 uppercase">
          Aquarium
        </h1>

        <button
          onClick={openAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-black font-semibold px-6 py-3 rounded-lg"
        >
          + Add Aquarium
        </button>
      </div>

      {/* ===== GRID ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aquariums.map((item) => (
          <div
            key={item.id}
            className="bg-black border-2 border-white rounded-lg min-h-[200px] flex flex-col"
          >
            {/* TITLE */}
            <div className="p-4 border-b border-white">
              <h3 className="text-white font-semibold text-lg">
                {item.namaAquarium}
              </h3>
            </div>

            {/* CONTENT */}
            <div className="flex-1 p-4 text-gray-400 text-sm space-y-1">
              <p>Lokasi: {item.lokasi}</p>
              <p>Kapasitas: {item.kapasitas}</p>
              <p>Ukuran: {item.ukuran}</p>
              <p>{item.catatan}</p>

              {/* ===== FISH GROWTH (TAMBAHAN SAJA) ===== */}
              {item.growth ? (
                <div className="mt-2 p-2 border border-yellow-400 rounded text-yellow-400 text-xs">
                  <p>Fish Growth ID: {item.growth.id}</p>
                  <p>Jumlah Ikan: {item.growth.jumlah}</p>
                  <p>Umur: {item.growth.umur} hari</p>
                  <p>Ukuran Ikan: {item.growth.ukuran}</p>
                </div>
              ) : (
                <p className="mt-2 text-xs text-gray-500 italic">
                  Tidak ada ikan di aquarium ini
                </p>
              )}
            </div>

            {/* ACTION */}
            <div className="p-4 border-t border-white flex justify-end gap-4">
              {/* EDIT */}
              <button
                onClick={() => openEditModal(item)}
                className="text-white hover:text-orange-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                    m-1.414-9.414a2 2 0 112.828 2.828
                    L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>

              {/* DELETE (DIUBAH) */}
              <button
                onClick={() => openDeleteModal(item)}
                className="text-white hover:text-red-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862
                    a2 2 0 01-1.995-1.858L5 7
                    m5 4v6m4-6v6
                    m1-10V4a1 1 0 00-1-1h-4
                    a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== DELETE MODAL (BARU) ===== */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border border-gray-600 rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4">
              Hapus Aquarium
            </h2>

            <p className="text-gray-300 mb-6">
              Apakah kamu yakin ingin menghapus aquarium ini?
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

      {/* ===== CANNOT DELETE MODAL ===== */}
      {showCannotDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border border-gray-600 rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4">
              Tidak Bisa Hapus Aquarium
            </h2>

            <p className="text-gray-300 mb-6">
              Aquarium ini memiliki ikan / pertumbuhan ikan di dalamnya.
              <span className="text-yellow-400 font-semibold">
                {' '}Tindakan hapus diblokir.
              </span>
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setShowCannotDeleteModal(false)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded"
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL ADD / EDIT (TIDAK DIUBAH) ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border border-gray-600 rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isEdit ? 'Edit Aquarium' : 'Add Aquarium'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: 'namaAquarium', placeholder: 'Nama Aquarium' },
                { name: 'lokasi', placeholder: 'Lokasi Aquarium' },
                { name: 'kapasitas', placeholder: 'Kapasitas (liter)' },
                { name: 'ukuran', placeholder: 'Ukuran Aquarium (P x L x T)' },
              ].map((field) => (
                <input
                  key={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
                />
              ))}

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

    </div>
  )
}

export default AdminAquariums
