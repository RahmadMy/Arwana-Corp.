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

  /* ================= ROLE ================= */
  const { isAdmin } = useAuth()

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
  const handleDelete = async (id) => {
    if (!isAdmin) return
    if (!window.confirm('Yakin ingin menghapus berita ini?')) return
    try {
      await newsService.delete(id)
      fetchNews()
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
          News
        </h1>

        {/* ADD NEWS → ADMIN ONLY */}
        {isAdmin && (
          <button
            onClick={openAddModal}
            className="bg-orange-500 hover:bg-orange-600 text-black font-semibold px-6 py-3 rounded-lg"
          >
            + Add News
          </button>
        )}
      </div>

      {/* ===== GRID ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.length > 0 ? (
          news.map((item) => (
            <div
              key={item.id}
              className="bg-black border-2 border-white rounded-lg p-6 flex flex-col h-full"
            >
              {/* IMAGE */}
              <div className="mb-4">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded border border-gray-700"
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center border border-gray-700 rounded text-gray-500 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="mb-5">
                <h3 className="text-white font-semibold text-lg leading-snug mb-1">
                  {item.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md font-medium
                      ${
                        item.status === "publish"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }
                    `}
                  >
                    {item.status === "publish" ? "Published" : "Draft"}
                  </span>

                  <span className="text-gray-500">•</span>

                  {item.tanggal_publikasi ? (
                    <time dateTime={item.tanggal_publikasi}>
                      {new Date(item.tanggal_publikasi).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  ) : (
                    <span className="italic text-gray-500">
                      Belum dipublikasikan
                    </span>
                  )}

                </div>

                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>


              {/* ACTION → ADMIN ONLY */}
              {isAdmin && (
                <div className="flex justify-end gap-4 pt-4 mt-auto border-t border-white">
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

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(item.id)}
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
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-12">
            Tidak ada data berita
          </div>
        )}
      </div>

      {/* ===== MODAL → ADMIN ONLY ===== */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border border-gray-700 rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isEdit ? 'Edit News' : 'Add News'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                required
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Description"
                required
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              />

              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              />
              
              <input
                type="date"
                name="tanggal_publikasi"
                value={formData.tanggal_publikasi}
                onChange={handleChange}
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              >
                <option value="draft">Draft</option>
                <option value="publish">Publish</option>
              </select>

              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded border border-gray-700"
                />
              )}

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

    </div>
  )
}

export default AdminNews
