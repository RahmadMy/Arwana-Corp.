import { useState, useEffect } from 'react'
import { feedService } from '../../services/feedService'

const AdminFeed = () => {
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  /* ===== DELETE MODAL STATE ===== */
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  /* ===== BLOCK DELETE MODAL (opsional) ===== */
  const [showBlockedModal, setShowBlockedModal] = useState(false)

  const [formData, setFormData] = useState({
    nama: '',
    stock: '',
    deskripsi: '',
  })

  /* ================= FETCH ================= */
  const fetchFeed = async () => {
    try {
      const res = await feedService.getAll()
      setFeed(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeed()
  }, [])

  /* ================= FORM ================= */
  const openAddModal = () => {
    setIsEdit(false)
    setFormData({
      nama: '',
      stock: '',
      deskripsi: '',
    })
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setIsEdit(true)
    setSelectedId(item.id)
    setFormData({
      nama: item.nama || '',
      stock: item.stock || '',
      deskripsi: item.deskripsi || '',
    })
    setShowModal(true)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isEdit) {
        await feedService.update(selectedId, formData)
      } else {
        await feedService.create(formData)
      }
      setShowModal(false)
      fetchFeed()
    } catch (err) {
      console.error(err)
    }
  }

  /* ================= DELETE ================= */
  const openDeleteModal = (item) => {
    // Jika feed sedang dipakai di growth (misal item.growthCount > 0), blokir
    if (item.growthCount && item.growthCount > 0) {
      setShowBlockedModal(true)
    } else {
      setDeleteId(item.id)
      setShowDeleteModal(true)
    }
  }

  const confirmDelete = async () => {
    try {
      await feedService.delete(deleteId)
      setShowDeleteModal(false)
      setDeleteId(null)
      fetchFeed()
    } catch (err) {
      console.error('Gagal hapus data:', err)
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
          Feed
        </h1>

        <button
          onClick={openAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-black font-semibold px-6 py-3 rounded-lg"
        >
          + Add Feed
        </button>
      </div>

      {/* ===== GRID ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feed.length > 0 ? (
          feed.map((item) => (
            <div
              key={item.id}
              className="bg-black border-2 border-white rounded-lg p-6 flex flex-col h-full"
            >
              <div className="mb-4">
                <h3 className="text-white font-semibold text-xl mb-2">
                  {item.nama}
                </h3>

                <p className="text-gray-400 text-sm mb-2">
                  Stok: {item.stock}
                </p>

                <p className="text-gray-400 text-sm">
                  {item.deskripsi}
                </p>
              </div>

              {/* ACTION */}
              <div className="flex justify-end gap-4 pt-4 mt-auto border-t border-white">
                {/* EDIT */}
                <button
                  onClick={() => openEditModal(item)}
                  className="text-white hover:text-orange-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>

                {/* DELETE */}
                <button
                  onClick={() => openDeleteModal(item)}
                  className="text-white hover:text-red-500 transition-colors"
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
            Tidak ada data pakan
          </div>
        )}
      </div>

      {/* ===== MODAL ADD / EDIT ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border border-gray-700 rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isEdit ? 'Edit Feed' : 'Add Feed'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Nama Pakan"
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              />

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stok"
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              />

              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                rows="3"
                placeholder="Deskripsi"
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
                  className="bg-orange-500 hover:bg-orange-600 text-black font-semibold px-6 py-2 rounded"
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
              Hapus Feed
            </h2>

            <p className="text-gray-300 mb-6">
              Apakah kamu yakin ingin menghapus feed ini?
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

      {/* ===== BLOCKED MODAL (jika feed sedang digunakan) ===== */}
      {showBlockedModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border border-gray-600 rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4">
              Tidak Bisa Dihapus
            </h2>

            <p className="text-gray-300 mb-6">
              Feed ini sedang digunakan dalam fish growth, sehingga tidak bisa dihapus.
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setShowBlockedModal(false)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminFeed
