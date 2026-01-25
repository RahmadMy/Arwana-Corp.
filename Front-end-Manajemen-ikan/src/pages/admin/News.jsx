import { useState, useEffect } from 'react'
import { newsService } from '../../services/newsService'
import { useAuth } from '../../contexts/AuthContext'

const AdminNews = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    tanggal_publikasi: '',
    status: 'draft', // default
  })

  // Role check
  const { isAdmin } = useAuth()

  // DELETE MODAL STATE
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  /* ================= FETCH ================= */
  const fetchNews = async () => {
    try {
      const res = await newsService.getAll()
      setNews(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  /* ================= MODAL ================= */
  const openAddModal = () => {
    if (!isAdmin) return

    setIsEdit(false)
    setSelectedId(null)
    setFormData({
      title: '',
      description: '',
      image: '',
      tanggal_publikasi: '',
      status: 'draft',
    })

    setShowModal(true)
  }

  const openEditModal = (item) => {
    if (!isAdmin) return

    setIsEdit(true)
    setSelectedId(item.id)

    setFormData({
      title: item.title || '',
      description: item.description || '',
      image: item.image || '',
      tanggal_publikasi: item.tanggal_publikasi
        ? item.tanggal_publikasi.split('T')[0]
        : '',
      status: item.status || 'draft',
    })

    setShowModal(true)
  }

  /* ================= FORM ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAdmin) return

    try {
      if (isEdit) {
        await newsService.update(selectedId, formData)
      } else {
        await newsService.create(formData)
      }
      setShowModal(false)
      fetchNews()
    } catch (err) {
      console.error(err)
    }
  }

  /* ================= DELETE ================= */
  const openDeleteModal = (id) => {
    if (!isAdmin) return
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      await newsService.delete(deleteId)
      setShowDeleteModal(false)
      setDeleteId(null)
      fetchNews()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-white">Loading data...</div>
  }

  return (
    <div>

      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold text-yellow-400 uppercase">
          News
        </h1>

        {/* ADD NEWS → ADMIN ONLY */}
        {isAdmin && (
          <button
            onClick={openAddModal}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add News
          </button>
        )}
      </div>

      {/* ===== GRID ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.length > 0 ? (
          news.map((item) => (
            <div
              key={item.id}
              className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/10 flex flex-col"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

              {/* IMAGE */}
              <div className="relative h-48 overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 border-b border-gray-700">
                    <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${item.status === 'publish' ? 'bg-green-500 text-black' : 'bg-yellow-400 text-black'
                    }`}>
                    {item.status === 'publish' ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 font-mono">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {item.tanggal_publikasi ? (
                      new Date(item.tanggal_publikasi).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    ) : (
                      <span className="italic">Not Scheduled</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight hover:text-yellow-400 transition-colors cursor-pointer">
                    {item.title}
                  </h3>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                  {item.description}
                </p>

                {/* ACTION → ADMIN ONLY */}
                {isAdmin && (
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-800 mt-auto">
                    {/* EDIT */}
                    <button
                      onClick={() => openEditModal(item)}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 group-hover:bg-yellow-400 group-hover:text-black"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => openDeleteModal(item.id)}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete News"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-12">
            No news data available
          </div>
        )}
      </div>

      {/* ===== ADD/EDIT MODAL ===== */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border border-gray-700 rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isEdit ? 'Edit News' : 'Add News'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-500 text-sm mb-1 block">Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="News Title"
                  required
                  className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded focus:border-yellow-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-gray-500 text-sm mb-1 block">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="News Content..."
                  required
                  className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded focus:border-yellow-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-gray-500 text-sm mb-1 block">Image URL</label>
                <input
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded focus:border-yellow-400 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 text-sm mb-1 block">Publication Date</label>
                  <input
                    type="date"
                    name="tanggal_publikasi"
                    value={formData.tanggal_publikasi}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded focus:border-yellow-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-sm mb-1 block">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded focus:border-yellow-400 focus:outline-none transition-colors"
                  >
                    <option value="draft">Draft</option>
                    <option value="publish">Publish</option>
                  </select>
                </div>
              </div>

              {formData.image && (
                <div className="mt-2">
                  <p className="text-gray-500 text-xs mb-1">Image Preview:</p>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded border border-gray-700"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded shadow-lg shadow-yellow-400/20"
                >
                  Save News
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== DELETE MODAL ===== */}
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
              <h2 className="text-2xl font-bold text-white mb-2">Delete News?</h2>
              <p className="text-gray-400">
                Are you sure you want to delete this news? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all transform hover:scale-105 font-medium"
              >
                Delete News
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminNews
