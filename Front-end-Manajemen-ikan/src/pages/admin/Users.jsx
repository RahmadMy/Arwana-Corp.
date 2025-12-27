import { useState, useEffect } from 'react'
import { userService } from '../../services/userService'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'petugas', // default staff
    password: '',
  })

  /* ================= FETCH ================= */
  const fetchUsers = async () => {
    try {
      const res = await userService.getAll()
      setUsers(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  /* ================= MODAL ================= */
  const openAddModal = () => {
    setIsEdit(false)
    setSelectedId(null)
    setError('')
    setFormData({
      name: '',
      email: '',
      role: 'petugas', // default staff when adding user
      password: '',
    })
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setIsEdit(true)
    setSelectedId(item.id)
    setError('')
    setFormData({
      name: item.name || '',
      email: item.email || '',
      role: item.role ? item.role : 'petugas',
      password: '',
    })
    setShowModal(true)
  }

  /* ================= FORM ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
  
    if (!formData.name.trim()) return setError('Nama wajib diisi')
    if (!formData.email.trim()) return setError('Email wajib diisi')
    if (!formData.role) return setError('Role wajib dipilih')
    if (!isEdit && !formData.password) return setError('Password wajib diisi')
  
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      }
  
      // password hanya dikirim kalau ada
      if (!isEdit || formData.password) {
        payload.password = formData.password
      }
  
      if (isEdit) {
        await userService.update(selectedId, payload)
      } else {
        await userService.create(payload)
      }
  
      setShowModal(false)
      fetchUsers()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Gagal menyimpan data')
    }
  }
  

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus user ini?')) return
    try {
      await userService.delete(id)
      fetchUsers()
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
          Users
        </h1>

        <button
          onClick={openAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-black font-semibold px-6 py-3 rounded-lg"
        >
          + Add User
        </button>
      </div>

      {/* ===== GRID ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length > 0 ? (
          users.map((item) => (
            <div
              key={item.id}
              className="bg-black border-2 border-white rounded-lg p-6 flex flex-col h-full"
            >
              <div className="mb-4">
                <h3 className="text-white font-semibold text-xl mb-2">
                  {item.name}
                </h3>

                <p className="text-gray-400 text-sm mb-2">
                  Email: {item.email}
                </p>

                <span
                  className="inline-block px-3 py-1 rounded text-xs border border-blue-500 text-blue-400 bg-blue-500/20"
                >
                  {item.role === 'admin' ? 'Admin' : 'Staff'}
                </span>
              </div>

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
                  onClick={() => handleDelete(item.id)}
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
            Tidak ada data user
          </div>
        )}
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div
          key={isEdit ? selectedId : 'add'}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <div className="bg-black border border-gray-700 rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isEdit ? 'Edit User' : 'Add User'}
            </h2>

            {error && (
              <div className="mb-4 text-red-500 text-sm">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              autoComplete="off"
            >

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama"
                autoComplete="off"
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              />

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                autoComplete="new-email"
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
              >
                <option value="petugas">Staff (petugas)</option>
                <option value="admin">Admin</option>
              </select>

              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder={
                  isEdit
                    ? 'Password (kosongkan jika tidak diubah)'
                    : 'Password'
                }
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
    </div>
  )
}

export default AdminUsers 