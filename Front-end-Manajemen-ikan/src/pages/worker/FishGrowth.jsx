import { useEffect, useState } from 'react'
import { fishGrowthService } from '../../services/fishGrowthService'
import { fishSpeciesService } from '../../services/fishSpeciesService'
import { aquariumService } from '../../services/aquariumService'
import { fishHealthService } from '../../services/fishHealthService'
import { harvestService } from '../../services/harvestService'
import { feedingScheduleService } from '../../services/feedingScheduleService'
import { feedService } from '../../services/feedService'

const WorkerFishGrowth = () => {
  const [growth, setGrowth] = useState([])
  const [species, setSpecies] = useState([])
  const [aquariums, setAquariums] = useState([])
  const [loading, setLoading] = useState(true)

  // Detail Data States
  const [detailData, setDetailData] = useState(null)
  const [healths, setHealths] = useState([])
  const [harvests, setHarvests] = useState([])
  const [schedules, setSchedules] = useState([])
  const [feeds, setFeeds] = useState([])
  const [activeTab, setActiveTab] = useState('info')

  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

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

  // Sub-forms for Detail Modal
  const [healthForm, setHealthForm] = useState({
    tanggalPemerikasaan: '',
    kondisi: '',
    tindakan: '',
    deskripsi: '',
  })

  const [harvestForm, setHarvestForm] = useState({
    tanggalPanen: '',
    jumlah: '',
    tujuan: '',
  })

  const [feedingForm, setFeedingForm] = useState({
    feedId: '',
    jumlahPakan: '',
    waktuPemberian: '',
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

  const fetchFeeds = async () => {
    try {
      const res = await feedService.getAll()
      setFeeds(res.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchGrowth()
    fetchSpecies()
    fetchAquariums()
    fetchFeeds()
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
    // Legacy Edit Modal support if needed, but we are moving to Detail Edit
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

  /* ===== DETAIL & SUB-FEATURES ===== */
  const openDetailModal = async (item) => {
    setDetailData(item)
    // Populate form data for editing in the Info tab
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
    setSelectedId(item.id)
    setActiveTab('info')
    setShowDetailModal(true)

    // Fetch related data
    try {
      const [hRes, pRes, fRes] = await Promise.all([
        fishHealthService.getAll(),
        harvestService.getAll(),
        feedingScheduleService.getAll()
      ])

      // Filter locally for this fish growth ID (assuming API returns all)
      const healthsUnfiltered = hRes.data || []
      const harvestsUnfiltered = pRes.data || []
      const feedsUnfiltered = fRes.data || []

      setHealths(healthsUnfiltered.filter(x => x.fishGrowthId === item.id))
      setHarvests(harvestsUnfiltered.filter(x => x.fishGrowthId === item.id))
      setSchedules(feedsUnfiltered.filter(x => x.fishGrowthId === item.id))

    } catch (err) {
      console.error("Error fetching detail data:", err)
    }
  }

  const handleInfoUpdate = async (e) => {
    e.preventDefault()
    try {
      await fishGrowthService.update(selectedId, formData)
      fetchGrowth()
      // Optionally update detailData locally to reflect changes immediately in the header
      setDetailData({ ...detailData, ...formData })
      alert('Informasi berhasil diperbarui')
    } catch (err) {
      console.error(err)
    }
  }

  const handleHealthSubmit = async (e) => {
    e.preventDefault()
    if (!detailData) return
    try {
      await fishHealthService.create({
        ...healthForm,
        fishGrowthId: detailData.id
      })
      // Refresh local list
      const res = await fishHealthService.getAll()
      setHealths((res.data || []).filter(x => x.fishGrowthId === detailData.id))
      setHealthForm({ tanggalPemerikasaan: '', kondisi: '', tindakan: '', deskripsi: '' })
    } catch (err) {
      console.error(err)
    }
  }

  const handleHarvestSubmit = async (e) => {
    e.preventDefault()
    if (!detailData) return
    try {
      await harvestService.create({
        ...harvestForm,
        fishGrowthId: detailData.id
      })
      const res = await harvestService.getAll()
      setHarvests((res.data || []).filter(x => x.fishGrowthId === detailData.id))
      setHarvestForm({ tanggalPanen: '', jumlah: '', tujuan: '' })
    } catch (err) {
      console.error(err)
    }
  }

  const handleFeedingSubmit = async (e) => {
    e.preventDefault()
    if (!detailData) return
    try {
      await feedingScheduleService.create({
        ...feedingForm,
        fishGrowthId: detailData.id
      })
      const res = await feedingScheduleService.getAll()
      setSchedules((res.data || []).filter(x => x.fishGrowthId === detailData.id))
      setFeedingForm({ feedId: '', jumlahPakan: '', waktuPemberian: '' })
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
              className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/10 flex flex-col"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`inline-block px-2 py-1 mb-2 text-xs font-bold tracking-wider rounded-sm uppercase ${item.grade === 'PREMIUM' || item.grade === 'EXPORT' ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}>
                      {item.grade || 'NO GRADE'}
                    </span>
                    <h3 className="text-2xl font-bold text-white leading-tight">
                      {item.species?.namaVarietas || 'Unknown Species'}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Aquarium</span>
                    <span className="text-yellow-400 font-mono font-medium bg-yellow-400/10 px-2 py-1 rounded">
                      {item.aquarium?.namaAquarium || '-'}
                    </span>
                  </div>
                </div>

                {/* Key Stats Row */}
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-black/40 rounded-lg border border-gray-800/50">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Jumlah</span>
                    <p className="text-xl font-semibold text-white">{item.jumlah} <span className="text-sm font-normal text-gray-600">Ekor</span></p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Gender</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-2 h-2 rounded-full ${item.gender === 'male' ? 'bg-blue-500' : item.gender === 'female' ? 'bg-pink-500' : 'bg-gray-500'}`}></span>
                      <p className="text-white capitalize text-sm">{item.gender || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Purpose & Note */}
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-medium">{item.purpose || 'No Purpose'}</span>
                  </div>
                  {item.catatan && (
                    <p className="text-sm text-gray-500 line-clamp-2 italic pl-6 border-l-2 border-gray-800">
                      "{item.catatan}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-800 mt-auto">
                  {/* DETAIL / EDIT */}
                  <button
                    onClick={() => openDetailModal(item)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 group-hover:bg-yellow-400 group-hover:text-black"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Detail & Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => openDeleteModal(item.id)}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Hapus"
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
        ) : (
          <div className="col-span-full text-center text-gray-400 py-12">
            Tidak ada data pertumbuhan ikan
          </div>
        )}
      </div>

      {/* ===== MODAL ADD (STANDALONE) ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border border-gray-700 rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isEdit ? 'Edit Fish Growth' : 'Add Fish Growth'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* SELECT SPECIES */}
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

              {/* SELECT AQUARIUM */}
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

              {/* GENDER */}
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

              {/* GRADE */}
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

              {/* PURPOSE */}
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

      {/* ===== DETAIL MODAL (WITH TABS) ===== */}
      {showDetailModal && detailData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto py-10">
          <div className="bg-black border border-gray-700 rounded-xl w-full max-w-4xl p-6 relative">
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
              <span>Detail & Edit Fish Growth</span>
              <span className="text-sm font-normal text-gray-400 bg-gray-900 px-2 py-1 rounded">
                {detailData.species?.namaVarietas}
              </span>
            </h2>

            {/* TABS HEADER */}
            <div className="flex border-b border-gray-700 mb-6">
              {[
                { id: 'info', label: 'Informasi Umum' },
                { id: 'health', label: 'Kesehatan' },
                { id: 'feeding', label: 'Jadwal Pakan' },
                { id: 'harvest', label: 'Panen' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-semibold transition-colors border-b-2 ${activeTab === tab.id
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: INFO */}
            {activeTab === 'info' && (
              <form onSubmit={handleInfoUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* SPECIES */}
                  <div>
                    <label className="text-gray-500 text-sm mb-1 block">Jenis Ikan</label>
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
                  </div>

                  {/* AQUARIUM */}
                  <div>
                    <label className="text-gray-500 text-sm mb-1 block">Aquarium</label>
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
                  </div>

                  {/* TEXT INPUTS */}
                  {['jumlah', 'umur', 'ukuran'].map((field) => (
                    <div key={field}>
                      <label className="text-gray-500 text-sm mb-1 block capitalize">{field}</label>
                      <input
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        placeholder={field}
                        className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
                      />
                    </div>
                  ))}

                  {/* GENDER */}
                  <div>
                    <label className="text-gray-500 text-sm mb-1 block">Gender</label>
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
                  </div>

                  {/* GRADE */}
                  <div>
                    <label className="text-gray-500 text-sm mb-1 block">Grade</label>
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
                  </div>

                  {/* PURPOSE */}
                  <div>
                    <label className="text-gray-500 text-sm mb-1 block">Purpose</label>
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
                  </div>

                </div>

                {/* CATATAN */}
                <div>
                  <label className="text-gray-500 text-sm mb-1 block">Catatan</label>
                  <textarea
                    name="catatan"
                    value={formData.catatan}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Catatan"
                    className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            )}

            {/* TAB CONTENT: HEALTH */}
            {activeTab === 'health' && (
              <div className="space-y-6">
                {/* List */}
                <div className="bg-gray-900 rounded p-4 max-h-60 overflow-y-auto">
                  {healths.length > 0 ? (
                    <table className="w-full text-sm text-left text-gray-300">
                      <thead className="text-gray-500 uppercase text-xs border-b border-gray-700">
                        <tr>
                          <th className="py-2">Tanggal</th>
                          <th className="py-2">Kondisi</th>
                          <th className="py-2">Tindakan</th>
                          <th className="py-2">Deskripsi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {healths.map(h => (
                          <tr key={h.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800">
                            <td className="py-2">{h.tanggalPemerikasaan.slice(0, 10)}</td>
                            <td className="py-2 text-yellow-200">{h.kondisi}</td>
                            <td className="py-2">{h.tindakan}</td>
                            <td className="py-2 text-gray-400 truncate max-w-xs">{h.deskripsi}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center text-gray-500">Belum ada data kesehatan.</p>
                  )}
                </div>

                {/* Form Add */}
                <div className="bg-gray-900/50 p-4 rounded border border-gray-700">
                  <h4 className="text-yellow-400 font-semibold mb-3">Tambah Data Kesehatan</h4>
                  <form onSubmit={handleHealthSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="date"
                      required
                      className="bg-black border border-gray-600 rounded px-3 py-2 text-white"
                      value={healthForm.tanggalPemerikasaan}
                      onChange={e => setHealthForm({ ...healthForm, tanggalPemerikasaan: e.target.value })}
                    />
                    <input
                      placeholder="Kondisi"
                      required
                      className="bg-black border border-gray-600 rounded px-3 py-2 text-white"
                      value={healthForm.kondisi}
                      onChange={e => setHealthForm({ ...healthForm, kondisi: e.target.value })}
                    />
                    <input
                      placeholder="Tindakan"
                      className="bg-black border border-gray-600 rounded px-3 py-2 text-white"
                      value={healthForm.tindakan}
                      onChange={e => setHealthForm({ ...healthForm, tindakan: e.target.value })}
                    />
                    <input
                      placeholder="Deskripsi"
                      className="bg-black border border-gray-600 rounded px-3 py-2 text-white"
                      value={healthForm.deskripsi}
                      onChange={e => setHealthForm({ ...healthForm, deskripsi: e.target.value })}
                    />
                    <div className="md:col-span-2 flex justify-end">
                      <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-black px-4 py-2 rounded font-semibold text-sm">
                        + Simpan Kesehatan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB CONTENT: FEEDING */}
            {activeTab === 'feeding' && (
              <div className="space-y-6">
                {/* List */}
                <div className="bg-gray-900 rounded p-4 max-h-60 overflow-y-auto">
                  {schedules.length > 0 ? (
                    <table className="w-full text-sm text-left text-gray-300">
                      <thead className="text-gray-500 uppercase text-xs border-b border-gray-700">
                        <tr>
                          <th className="py-2">Pakan</th>
                          <th className="py-2">Waktu</th>
                          <th className="py-2">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedules.map(s => (
                          <tr key={s.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800">
                            <td className="py-2">{s.feed?.nama || '-'}</td>
                            <td className="py-2 text-yellow-200">{s.waktuPemberian.slice(0, 5)}</td>
                            <td className="py-2">{s.jumlahPakan}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center text-gray-500">Belum ada jadwal pakan.</p>
                  )}
                </div>

                {/* Form Add */}
                <div className="bg-gray-900/50 p-4 rounded border border-gray-700">
                  <h4 className="text-yellow-400 font-semibold mb-3">Tambah Jadwal Pakan</h4>
                  <form onSubmit={handleFeedingSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select
                      required
                      className="bg-black border border-gray-600 rounded px-3 py-2 text-white"
                      value={feedingForm.feedId}
                      onChange={e => setFeedingForm({ ...feedingForm, feedId: e.target.value })}
                    >
                      <option value="">-- Pilih Pakan --</option>
                      {feeds.map(f => (
                        <option key={f.id} value={f.id}>{f.nama}</option>
                      ))}
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        className="bg-black border border-gray-600 rounded px-3 py-2 text-white"
                        value={feedingForm.waktuPemberian ? feedingForm.waktuPemberian.split(':')[0] : ''}
                        onChange={e => {
                          const m = feedingForm.waktuPemberian ? feedingForm.waktuPemberian.split(':')[1] || '00' : '00';
                          setFeedingForm({ ...feedingForm, waktuPemberian: `${e.target.value}:${m}` });
                        }}
                        required
                      >
                        <option value="">Jam</option>
                        {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                      <select
                        className="bg-black border border-gray-600 rounded px-3 py-2 text-white"
                        value={feedingForm.waktuPemberian ? feedingForm.waktuPemberian.split(':')[1] : ''}
                        onChange={e => {
                          const h = feedingForm.waktuPemberian ? feedingForm.waktuPemberian.split(':')[0] || '00' : '00';
                          setFeedingForm({ ...feedingForm, waktuPemberian: `${h}:${e.target.value}` });
                        }}
                        required
                      >
                        <option value="">Menit</option>
                        {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <input
                      placeholder="Jumlah Pakan"
                      required
                      className="bg-black border border-gray-600 rounded px-3 py-2 text-white"
                      value={feedingForm.jumlahPakan}
                      onChange={e => setFeedingForm({ ...feedingForm, jumlahPakan: e.target.value })}
                    />
                    <div className="md:col-span-2 flex justify-end">
                      <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-black px-4 py-2 rounded font-semibold text-sm">
                        + Simpan Jadwal
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB CONTENT: HARVEST */}
            {activeTab === 'harvest' && (
              <div className="space-y-6">
                {/* List */}
                <div className="bg-gray-900 rounded p-4 max-h-60 overflow-y-auto">
                  {harvests.length > 0 ? (
                    <table className="w-full text-sm text-left text-gray-300">
                      <thead className="text-gray-500 uppercase text-xs border-b border-gray-700">
                        <tr>
                          <th className="py-2">Tanggal Panen</th>
                          <th className="py-2">Jumlah</th>
                          <th className="py-2">Tujuan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {harvests.map(h => (
                          <tr key={h.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800">
                            <td className="py-2">{h.tanggalPanen}</td>
                            <td className="py-2 text-yellow-200">{h.jumlah}</td>
                            <td className="py-2">{h.tujuan}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center text-gray-500">Belum ada data panen.</p>
                  )}
                </div>

                {/* Form Add */}
                <div className="bg-gray-900/50 p-4 rounded border border-gray-700">
                  <h4 className="text-yellow-400 font-semibold mb-3">Tambah Data Panen</h4>
                  <form onSubmit={handleHarvestSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="date"
                      required
                      className="bg-black border border-gray-600 rounded px-3 py-2 text-white"
                      value={harvestForm.tanggalPanen}
                      onChange={e => setHarvestForm({ ...harvestForm, tanggalPanen: e.target.value })}
                    />
                    <input
                      placeholder="Jumlah"
                      required
                      className="bg-black border border-gray-600 rounded px-3 py-2 text-white"
                      value={harvestForm.jumlah}
                      onChange={e => setHarvestForm({ ...harvestForm, jumlah: e.target.value })}
                    />
                    <input
                      placeholder="Tujuan"
                      className="bg-black border border-gray-600 rounded px-3 py-2 text-white"
                      value={harvestForm.tujuan}
                      onChange={e => setHarvestForm({ ...harvestForm, tujuan: e.target.value })}
                    />
                    <div className="md:col-span-2 flex justify-end">
                      <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-black px-4 py-2 rounded font-semibold text-sm">
                        + Simpan Panen
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-6 border-t border-gray-700 mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded"
              >
                Tutup
              </button>
            </div>
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
