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
    return <div className="text-center py-12 text-white">Loading data...</div>
  }

  return (
    <div className="relative">

      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-bold text-yellow-400 uppercase">
          Aquariums
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
        {aquariums.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12 text-lg">
            No aquarium data found.
          </div>
        ) : (
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
                          <p className="text-gray-400 text-xs">{item.growth.umur} days</p>
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

                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-800">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 group-hover:bg-yellow-400 group-hover:text-black"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(item)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===== DELETE MODAL (DIUBAH) ===== */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
            {/* Red Accent Background */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-700" />

            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Delete Aquarium?</h2>
              <p className="text-gray-400">
                Are you sure you want to delete this aquarium? <br />
                <span className="text-red-400 text-sm">This action cannot be undone.</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors shadow-lg shadow-red-900/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== CANNOT DELETE MODAL ===== */}
      {showCannotDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500" />

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Action Denied</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  This aquarium is currently in use (contains active fish). Please empty the aquarium before deleting.
                </p>
                <button
                  onClick={() => setShowCannotDeleteModal(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL ADD / EDIT (MODERNIZED) ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {isEdit ? (
                  <>
                    <span className="text-yellow-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </span>
                    Edit Aquarium
                  </>
                ) : (
                  <>
                    <span className="text-green-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </span>
                    New Aquarium
                  </>
                )}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Aquarium Name</label>
                  <input
                    name="namaAquarium"
                    value={formData.namaAquarium}
                    onChange={handleChange}
                    placeholder="e.g. Tank A1"
                    required
                    className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all placeholder-gray-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</label>
                    <input
                      name="lokasi"
                      value={formData.lokasi}
                      onChange={handleChange}
                      placeholder="e.g. Zone 1"
                      required
                      className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Capacity (Liters)</label>
                    <input
                      name="kapasitas"
                      value={formData.kapasitas}
                      onChange={handleChange}
                      placeholder="e.g. 1000"
                      required
                      className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all placeholder-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Size (LxWxH)</label>
                  <input
                    name="ukuran"
                    value={formData.ukuran}
                    onChange={handleChange}
                    placeholder="e.g. 200x50x100 cm"
                    required
                    className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes</label>
                  <textarea
                    name="catatan"
                    value={formData.catatan}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Add notes..."
                    className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all placeholder-gray-600 resize-none"
                  />
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800 bg-black/20 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg transition-transform active:scale-95 shadow-lg shadow-yellow-400/10"
              >
                {isEdit ? 'Save Changes' : 'Create Aquarium'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminAquariums
