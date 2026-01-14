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
  const [deleteType, setDeleteType] = useState('growth') // 'growth', 'health', 'feeding', 'harvest'

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

  // State for sub-feature editing
  const [editingHealthId, setEditingHealthId] = useState(null)
  const [editingHarvestId, setEditingHarvestId] = useState(null)
  const [editingFeedingId, setEditingFeedingId] = useState(null)

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
      alert('Information successfully updated')
    } catch (err) {
      console.error(err)
    }
  }

  // Helper for single-record view
  const currentHealth = healths.find(h => h.fishGrowthId === detailData?.id)
  const currentFeeding = schedules.find(s => s.fishGrowthId === detailData?.id)
  const currentHarvest = harvests.find(h => h.fishGrowthId === detailData?.id)

  const handleHealthSubmit = async (e) => {
    e.preventDefault()
    if (!detailData) return
    try {
      if (currentHealth) {
        await fishHealthService.update(currentHealth.id, {
          ...healthForm,
          fishGrowthId: parseInt(detailData.id)
        })
      } else {
        await fishHealthService.create({
          ...healthForm,
          fishGrowthId: parseInt(detailData.id)
        })
      }

      const res = await fishHealthService.getAll()
      setHealths((res.data || []).filter(x => x.fishGrowthId === detailData.id))
      setEditingHealthId(null)
    } catch (err) {
      console.error(err)
    }
  }

  // Auto-fill form
  useEffect(() => {
    if (editingHealthId && currentHealth) {
      setHealthForm({
        tanggalPemerikasaan: currentHealth.tanggalPemerikasaan ? currentHealth.tanggalPemerikasaan.slice(0, 10) : '',
        kondisi: currentHealth.kondisi,
        tindakan: currentHealth.tindakan,
        deskripsi: currentHealth.deskripsi
      })
    }
  }, [editingHealthId, currentHealth])

  const startEditHealth = () => {
    setEditingHealthId(true)
  }

  const deleteHealth = async () => {
    if (!currentHealth) return
    openDeleteModal(currentHealth.id, 'health')
  }

  // Auto-fill form
  useEffect(() => {
    if (editingHarvestId && currentHarvest) {
      setHarvestForm({
        tanggalPanen: currentHarvest.tanggalPanen ? currentHarvest.tanggalPanen.slice(0, 10) : '',
        jumlah: currentHarvest.jumlah,
        tujuan: currentHarvest.tujuan
      })
    }
  }, [editingHarvestId, currentHarvest])

  const handleHarvestSubmit = async (e) => {
    e.preventDefault()
    if (!detailData) return
    try {
      if (currentHarvest) {
        await harvestService.update(currentHarvest.id, {
          ...harvestForm,
          fishGrowthId: parseInt(detailData.id)
        })
      } else {
        await harvestService.create({
          ...harvestForm,
          fishGrowthId: parseInt(detailData.id)
        })
      }

      const res = await harvestService.getAll()
      setHarvests((res.data || []).filter(x => x.fishGrowthId === detailData.id))
      setEditingHarvestId(null)
    } catch (err) {
      console.error(err)
    }
  }

  const startEditHarvest = () => {
    setEditingHarvestId(true)
  }

  const deleteHarvest = async () => {
    if (!currentHarvest) return
    openDeleteModal(currentHarvest.id, 'harvest')
  }

  // Auto-fill form
  useEffect(() => {
    if (editingFeedingId && currentFeeding) {
      setFeedingForm({
        feedId: currentFeeding.feedId,
        jumlahPakan: currentFeeding.jumlahPakan,
        waktuPemberian: currentFeeding.waktuPemberian
      })
    }
  }, [editingFeedingId, currentFeeding])

  const handleFeedingSubmit = async (e) => {
    e.preventDefault()
    if (!detailData) return
    try {
      if (currentFeeding) {
        await feedingScheduleService.update(currentFeeding.id, {
          ...feedingForm,
          fishGrowthId: parseInt(detailData.id)
        })
      } else {
        await feedingScheduleService.create({
          ...feedingForm,
          fishGrowthId: parseInt(detailData.id)
        })
      }

      const res = await feedingScheduleService.getAll()
      setSchedules((res.data || []).filter(x => x.fishGrowthId === detailData.id))
      setEditingFeedingId(null)
    } catch (err) {
      console.error(err)
    }
  }

  const startEditFeeding = () => {
    setEditingFeedingId(true)
  }

  const deleteFeeding = async () => {
    if (!currentFeeding) return
    openDeleteModal(currentFeeding.id, 'feeding')
  }

  /* ================= DELETE ================= */
  /* ================= DELETE ================= */
  const openDeleteModal = (id, type = 'growth') => {
    setDeleteId(id)
    setDeleteType(type)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      if (deleteType === 'growth') {
        await fishGrowthService.delete(deleteId)
        fetchGrowth()
      } else if (deleteType === 'health') {
        await fishHealthService.delete(deleteId)
        setHealths([])
        setEditingHealthId(null)
        setHealthForm({ tanggalPemerikasaan: '', kondisi: '', tindakan: '', deskripsi: '' })
      } else if (deleteType === 'feeding') {
        await feedingScheduleService.delete(deleteId)
        setSchedules([])
        setEditingFeedingId(null)
        setFeedingForm({ feedId: '', jumlahPakan: '', waktuPemberian: '' })
      } else if (deleteType === 'harvest') {
        await harvestService.delete(deleteId)
        setHarvests([])
        setEditingHarvestId(null)
        setHarvestForm({ tanggalPanen: '', jumlah: '', tujuan: '' })
      }

      setShowDeleteModal(false)
      setDeleteId(null)
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
            No fish growth data found
          </div>
        )}
      </div>

      {/* ===== MODAL ADD (STANDALONE) - MODERNIZED ===== */}
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
                    Edit Fish Growth
                  </>
                ) : (
                  <>
                    <span className="text-green-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </span>
                    New Fish Growth
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

              {/* SPECIES & AQUARIUM ROW */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Species</label>
                  <select
                    name="speciesId"
                    value={formData.speciesId}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all placeholder-gray-600 appearance-none"
                  >
                    <option value="">-- Select --</option>
                    {species.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.namaVarietas}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Aquarium</label>
                  <select
                    name="aquariumId"
                    value={formData.aquariumId}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all placeholder-gray-600 appearance-none"
                  >
                    <option value="">-- Select --</option>
                    {aquariums.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.namaAquarium}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* STATS ROW 1 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Quantity</label>
                  <input
                    name="jumlah"
                    value={formData.jumlah}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Age (Days)</label>
                  <input
                    name="umur"
                    value={formData.umur}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Size (cm)</label>
                  <input
                    name="ukuran"
                    value={formData.ukuran}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                  />
                </div>
              </div>

              {/* STATS ROW 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all appearance-none"
                  >
                    <option value="">-- Optional --</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Grade</label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all appearance-none"
                  >
                    <option value="">-- Optional --</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="EXPORT">Export</option>
                  </select>
                </div>
              </div>

              {/* PURPOSE */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Purpose</label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all appearance-none"
                >
                  <option value="">-- Select Purpose --</option>
                  <option value="JUAL">Sale</option>
                  <option value="BREEDING">Breeding</option>
                  <option value="KONTES">Contest</option>
                  <option value="DISPLAY">Display</option>
                  <option value="EXPORT">Export</option>
                </select>
              </div>

              {/* NOTES */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes</label>
                <textarea
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Additional notes..."
                  className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all resize-none"
                />
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
                {isEdit ? 'Save Changes' : 'Create Record'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ===== DELETE MODAL (MODERNIZED) ===== */}
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
              <h2 className="text-2xl font-bold text-white mb-2">
                {deleteType === 'growth' ? 'Delete Record?' :
                  deleteType === 'health' ? 'Delete Health Record?' :
                    deleteType === 'feeding' ? 'Delete Feeding Schedule?' :
                      'Delete Harvest Record?'}
              </h2>
              <p className="text-gray-400">
                Are you sure you want to delete this {deleteType === 'growth' ? 'fish growth record' : deleteType === 'health' ? 'health record' : deleteType === 'feeding' ? 'feeding schedule' : 'harvest record'}? <br />
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

      {/* ===== DETAIL MODAL (WITH TABS) ===== */}
      {showDetailModal && detailData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/20 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/10 text-yellow-400 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Record Details</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    ID: <span className="font-mono text-yellow-400">{detailData.id}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span className="text-gray-400">{detailData.species?.namaVarietas}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6">

              {/* TABS HEADER */}
              <div className="flex border-b border-gray-700 mb-6">
                {[
                  { id: 'info', label: 'General Info' },
                  { id: 'health', label: 'Health' },
                  { id: 'feeding', label: 'Feeding Schedule' },
                  { id: 'harvest', label: 'Harvest' }
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
                      <label className="text-gray-500 text-sm mb-1 block">Species</label>
                      <select
                        name="speciesId"
                        value={formData.speciesId}
                        onChange={handleChange}
                        required
                        className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
                      >
                        <option value="">-- Select Species --</option>
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
                        <option value="">-- Select Aquarium --</option>
                        {aquariums.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.namaAquarium}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* QUANTITY */}
                    <div>
                      <label className="text-gray-500 text-sm mb-1 block">Quantity</label>
                      <input
                        name="jumlah"
                        value={formData.jumlah}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
                      />
                    </div>

                    {/* AGE */}
                    <div>
                      <label className="text-gray-500 text-sm mb-1 block">Age (Days)</label>
                      <input
                        name="umur"
                        value={formData.umur}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
                      />
                    </div>

                    {/* SIZE */}
                    <div>
                      <label className="text-gray-500 text-sm mb-1 block">Size (cm)</label>
                      <input
                        name="ukuran"
                        value={formData.ukuran}
                        onChange={handleChange}
                        placeholder="0.0"
                        className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded"
                      />
                    </div>

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
                    <label className="text-gray-500 text-sm mb-1 block">Note</label>
                    <textarea
                      name="catatan"
                      value={formData.catatan}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Note"
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
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {/* TAB CONTENT: HEALTH */}
              {activeTab === 'health' && (
                <div className="space-y-6">

                  {/* 1. Detail View */}
                  {currentHealth && !editingHealthId && (
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-bold text-yellow-400 mb-1">Health Record</h4>
                          <p className="text-gray-400 text-sm">Last updated: {currentHealth.tanggalPemerikasaan ? new Date(currentHealth.tanggalPemerikasaan).toLocaleDateString() : '-'}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={startEditHealth} className="px-4 py-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black rounded-lg font-semibold transition-colors">
                            Edit
                          </button>
                          <button onClick={deleteHealth} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-semibold transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-black/30 p-3 rounded-lg border border-gray-800">
                          <span className="block text-gray-500 mb-1">Condition</span>
                          <span className="block text-white font-medium">{currentHealth.kondisi}</span>
                        </div>
                        <div className="bg-black/30 p-3 rounded-lg border border-gray-800">
                          <span className="block text-gray-500 mb-1">Action</span>
                          <span className="block text-white font-medium">{currentHealth.tindakan}</span>
                        </div>
                        <div className="col-span-2 bg-black/30 p-3 rounded-lg border border-gray-800">
                          <span className="block text-gray-500 mb-1">Description</span>
                          <span className="block text-gray-300">{currentHealth.deskripsi || '-'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Form Add/Edit */}
                  {(!currentHealth || editingHealthId) && (
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                      <h4 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
                        {currentHealth ? (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Edit Health Record
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Add Health Record
                          </>
                        )}
                      </h4>
                      <form onSubmit={handleHealthSubmit} className="space-y-4">

                        {/* DATE */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Check Date</label>
                          <input
                            type="date"
                            required
                            className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded focus:border-yellow-400 focus:outline-none transition-colors"
                            value={healthForm.tanggalPemerikasaan}
                            onChange={e => setHealthForm({ ...healthForm, tanggalPemerikasaan: e.target.value })}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* CONDITION */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Condition</label>
                            <input
                              placeholder="e.g. Healthy, Sick, Injured"
                              className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded focus:border-yellow-400 focus:outline-none transition-colors"
                              value={healthForm.kondisi}
                              onChange={e => setHealthForm({ ...healthForm, kondisi: e.target.value })}
                            />
                          </div>

                          {/* ACTION */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Action / Treatment</label>
                            <input
                              placeholder="e.g. Quarantine, Medication"
                              className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded focus:border-yellow-400 focus:outline-none transition-colors"
                              value={healthForm.tindakan}
                              onChange={e => setHealthForm({ ...healthForm, tindakan: e.target.value })}
                            />
                          </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                          <textarea
                            placeholder="Detailed observation notes..."
                            rows="3"
                            className="w-full bg-black border border-gray-600 text-white px-4 py-2 rounded focus:border-yellow-400 focus:outline-none transition-colors"
                            value={healthForm.deskripsi}
                            onChange={e => setHealthForm({ ...healthForm, deskripsi: e.target.value })}
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          {currentHealth && (
                            <button
                              type="button"
                              onClick={() => setEditingHealthId(null)}
                              className="text-gray-400 hover:text-white px-4 py-2 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                          <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded font-bold shadow-lg shadow-yellow-400/10 transition-transform active:scale-95">
                            {currentHealth ? 'Update Record' : 'Save Record'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: FEEDING */}
              {activeTab === 'feeding' && (
                <div className="space-y-6">

                  {/* 1. Detail View */}
                  {currentFeeding && !editingFeedingId && (
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-bold text-yellow-400 mb-1">Feeding Schedule</h4>
                          <p className="text-gray-400 text-sm">Assigned Feed: {currentFeeding.feed?.nama || '-'}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={startEditFeeding} className="px-4 py-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black rounded-lg font-semibold transition-colors">
                            Edit
                          </button>
                          <button onClick={deleteFeeding} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-semibold transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-black/30 p-3 rounded-lg border border-gray-800">
                          <span className="block text-gray-500 mb-1">Time</span>
                          <span className="block text-white font-medium text-lg">{currentFeeding.waktuPemberian ? currentFeeding.waktuPemberian.slice(0, 5) : '-'}</span>
                        </div>
                        <div className="bg-black/30 p-3 rounded-lg border border-gray-800">
                          <span className="block text-gray-500 mb-1">Amount</span>
                          <span className="block text-white font-medium text-lg">{currentFeeding.jumlahPakan}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Form Add/Edit */}
                  {(!currentFeeding || editingFeedingId) && (
                    <div className="bg-gray-900/50 p-4 rounded border border-gray-700">
                      <h4 className="text-yellow-400 font-semibold mb-3">
                        {currentFeeding ? 'Edit Feeding Schedule' : 'Add Feeding Schedule'}
                      </h4>
                      <form onSubmit={handleFeedingSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <select
                          required
                          className="bg-black border border-gray-600 rounded px-3 py-2 text-white"
                          value={feedingForm.feedId}
                          onChange={e => setFeedingForm({ ...feedingForm, feedId: e.target.value })}
                        >
                          <option value="">-- Select Feed --</option>
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
                            <option value="">Hours</option>
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
                            <option value="">Minutes</option>
                            {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                        <input
                          placeholder="feed amount"
                          required
                          className="bg-black border border-gray-600 rounded px-3 py-2 text-white"
                          value={feedingForm.jumlahPakan}
                          onChange={e => setFeedingForm({ ...feedingForm, jumlahPakan: e.target.value })}
                        />
                        <div className="md:col-span-2 flex justify-end gap-2">
                          {currentFeeding && (
                            <button
                              type="button"
                              onClick={() => setEditingFeedingId(null)}
                              className="text-gray-400 hover:text-white px-4 py-2"
                            >
                              Cancel
                            </button>
                          )}
                          <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-black px-4 py-2 rounded font-semibold text-sm">
                            {currentFeeding ? 'Update Schedule' : '+ Save Schedule'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: HARVEST */}
              {activeTab === 'harvest' && (
                <div className="space-y-6">

                  {/* 1. Detail View */}
                  {currentHarvest && !editingHarvestId && (
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-bold text-yellow-400 mb-1">Harvest Record</h4>
                          <p className="text-gray-400 text-sm">Date: {currentHarvest.tanggalPanen ? new Date(currentHarvest.tanggalPanen).toLocaleDateString() : '-'}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={startEditHarvest} className="px-4 py-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black rounded-lg font-semibold transition-colors">
                            Edit
                          </button>
                          <button onClick={deleteHarvest} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-semibold transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-black/30 p-3 rounded-lg border border-gray-800">
                          <span className="block text-gray-500 mb-1">Amount</span>
                          <span className="block text-white font-medium text-lg">{currentHarvest.jumlah}</span>
                        </div>
                        <div className="bg-black/30 p-3 rounded-lg border border-gray-800">
                          <span className="block text-gray-500 mb-1">Purpose</span>
                          <span className="block text-white font-medium text-lg">{currentHarvest.tujuan}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Form Add/Edit */}
                  {(!currentHarvest || editingHarvestId) && (
                    <div className="bg-gray-900/50 p-4 rounded border border-gray-700">
                      <h4 className="text-yellow-400 font-semibold mb-3">
                        {currentHarvest ? 'Edit Harvest Record' : 'Add Harvest Record'}
                      </h4>
                      <form onSubmit={handleHarvestSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="date"
                          required
                          className="bg-black border border-gray-600 rounded px-3 py-2 text-white"
                          value={harvestForm.tanggalPanen}
                          onChange={e => setHarvestForm({ ...harvestForm, tanggalPanen: e.target.value })}
                        />
                        <input
                          placeholder="Amount"
                          required
                          className="bg-black border border-gray-600 rounded px-3 py-2 text-white"
                          value={harvestForm.jumlah}
                          onChange={e => setHarvestForm({ ...harvestForm, jumlah: e.target.value })}
                        />
                        <input
                          placeholder="Purpose"
                          className="bg-black border border-gray-600 rounded px-3 py-2 text-white"
                          value={harvestForm.tujuan}
                          onChange={e => setHarvestForm({ ...harvestForm, tujuan: e.target.value })}
                        />
                        <div className="md:col-span-2 flex justify-end gap-2">
                          {currentHarvest && (
                            <button
                              type="button"
                              onClick={() => setEditingHarvestId(null)}
                              className="text-gray-400 hover:text-white px-4 py-2"
                            >
                              Cancel
                            </button>
                          )}
                          <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-black px-4 py-2 rounded font-semibold text-sm">
                            {currentHarvest ? 'Update Harvest' : '+ Save Harvest'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-gray-700 mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE MODAL ===== */}
      {/* ===== DELETE MODAL (MODERNIZED) ===== */}


    </div>
  )
}

export default WorkerFishGrowth
