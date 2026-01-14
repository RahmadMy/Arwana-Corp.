import { useState, useEffect } from 'react'
import { fishHealthService } from '../../services/fishHealthService'
import { fishGrowthService } from '../../services/fishGrowthService'

const AdminFishHealth = () => {
  const [healths, setHealths] = useState([])
  const [growths, setGrowths] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const [formData, setFormData] = useState({
    tanggalPemerikasaan: '',
    kondisi: '',
    tindakan: '',
    deskripsi: '',
    fishGrowthId: '',
  })

  /* ================= FETCH ================= */
  const fetchHealths = async () => {
    try {
      const res = await fishHealthService.getAll()
      setHealths(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchGrowths = async () => {
    try {
      const res = await fishGrowthService.getAll()
      setGrowths(res.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchHealths()
    fetchGrowths()
  }, [])

  /* ================= MODAL ================= */
  const openAddModal = () => {
    setIsEdit(false)
    setSelectedId(null)
    setFormData({
      tanggalPemerikasaan: '',
      kondisi: '',
      tindakan: '',
      deskripsi: '',
      fishGrowthId: '',
    })
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setIsEdit(true)
    setSelectedId(item.id)
    setFormData({
      tanggalPemerikasaan: item.tanggalPemerikasaan || '',
      kondisi: item.kondisi || '',
      tindakan: item.tindakan || '',
      deskripsi: item.deskripsi || '',
      fishGrowthId: item.fishGrowthId || '',
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
        await fishHealthService.update(selectedId, formData)
      } else {
        await fishHealthService.create(formData)
      }
      setShowModal(false)
      fetchHealths()
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
      await fishHealthService.delete(deleteId)
      setShowDeleteModal(false)
      setDeleteId(null)
      fetchHealths()
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-yellow-400 uppercase">
          Fish Health
        </h1>

        <button
          onClick={openAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-black font-semibold px-6 py-3 rounded-lg w-full md:w-auto"
        >
          + Add Health Record
        </button>
      </div>

      {/* ===== GRID ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {healths.length > 0 ? (
          healths.map((item) => (
            <div
              key={item.id}
              className="bg-black border-2 border-white rounded-lg p-6 flex flex-col h-full"
            >
              <div className="mb-4">
                <h3 className="text-white font-semibold text-xl mb-2">
                  {item.growth?.slug || '-'}
                </h3>

                <p className="text-gray-400 text-sm mb-2">
                  Tanggal: {item.tanggalPemerikasaan}
                </p>

                <p className="text-gray-400 text-sm mb-2">
                  Kondisi: {item.kondisi}
                </p>

                <p className="text-gray-400 text-sm mb-2">
                  Tindakan: {item.tindakan}
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
                  className="text-white hover:text-orange-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>

                {/* DELETE */}
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
            Tidak ada data kesehatan ikan
          </div>
        )}
      </div>

      {/* ===== MODAL ADD / EDIT ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border border-gray-700 rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isEdit ? 'Edit Fish Health' : 'Add Fish Health'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="date"
                name="tanggalPemerikasaan"
                value={formData.tanggalPemerikasaan}
                onChange={handleChange}
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              />

              <select
                name="fishGrowthId"
                value={formData.fishGrowthId}
                onChange={handleChange}
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              >
                <option value="">Pilih Fish Growth</option>
                {growths.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.slug}
                  </option>
                ))}
              </select>

              <input
                name="kondisi"
                value={formData.kondisi}
                onChange={handleChange}
                placeholder="Kondisi"
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              />

              <input
                name="tindakan"
                value={formData.tindakan}
                onChange={handleChange}
                placeholder="Tindakan"
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
              Hapus Fish Health
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

export default AdminFishHealth
