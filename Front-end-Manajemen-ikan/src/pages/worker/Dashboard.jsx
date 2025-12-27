import { useState, useEffect } from 'react'
import {
  aquariumService,
} from '../../services/aquariumService'
import { fishSpeciesService } from '../../services/fishSpeciesService'
import { fishGrowthService } from '../../services/fishGrowthService'
import { fishHealthService } from '../../services/fishHealthService'

import {
  FaWater,
  FaFish,
  FaHeartbeat,
  FaChartLine
} from 'react-icons/fa'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const COLORS = ['#FACC15', '#22C55E', '#EF4444']

const WorkerDashboard = () => {
  const [stats, setStats] = useState({
    totalAquariums: 0,
    totalSpecies: 0,
    totalFish: 0,
    healthyFish: 0
  })
  const [growthChart, setGrowthChart] = useState([])
  const [healthChart, setHealthChart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [aquariums, species, growths, healths] = await Promise.all([
          aquariumService.getAll().catch(() => ({ data: [] })),
          fishSpeciesService.getAll().catch(() => ({ data: [] })),
          fishGrowthService.getAll().catch(() => ({ data: [] })),
          fishHealthService.getAll().catch(() => ({ data: [] }))
        ])

        const totalFish =
          growths.data?.reduce((sum, g) => sum + (g.jumlah || 0), 0) || 0

        const healthyFish =
          healths.data?.filter(h => h.kondisi === 'Sehat').length || 0

        // Grafik pertumbuhan
        const growthData =
          growths.data?.map((g, i) => ({
            name: `Data ${i + 1}`,
            jumlah: g.jumlah || 0
          })) || []

        // Grafik kesehatan
        const healthData = [
          { name: 'Sehat', value: healthyFish },
          { name: 'Tidak Sehat', value: (healths.data?.length || 0) - healthyFish }
        ]

        setStats({
          totalAquariums: aquariums.data?.length || 0,
          totalSpecies: species.data?.length || 0,
          totalFish,
          healthyFish
        })
        setGrowthChart(growthData)
        setHealthChart(healthData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="text-center py-12 text-white">Memuat data...</div>
  }

  return (
    <div>
      <h1 className="text-5xl font-bold text-yellow-400 mb-8 uppercase">
        Dashboard
      </h1>

      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Akuarium"
          value={stats.totalAquariums}
          icon={<FaWater />}
        />
        <StatCard
          title="Varietas Ikan"
          value={stats.totalSpecies}
          icon={<FaFish />}
        />
        <StatCard
          title="Total Ikan"
          value={stats.totalFish}
          icon={<FaChartLine />}
        />
        <StatCard
          title="Ikan Sehat"
          value={stats.healthyFish}
          icon={<FaHeartbeat />}
        />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Growth Chart */}
        <div className="bg-black border-2 border-white rounded-lg p-6">
          <h2 className="text-white font-semibold mb-4">
            Grafik Pertumbuhan Ikan
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="jumlah"
                stroke="#FACC15"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Health Chart */}
        <div className="bg-black border-2 border-white rounded-lg p-6">
          <h2 className="text-white font-semibold mb-4">
            Kondisi Kesehatan Ikan
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={healthChart}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {healthChart.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== SUMMARY ===== */}
      <div className="bg-black border-2 border-white rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-2">
          Ringkasan Sistem
        </h2>
        <p className="text-gray-400">
          Dashboard ini menampilkan ringkasan data akuarium, varietas ikan,
          pertumbuhan, dan kondisi kesehatan ikan arwana secara visual
          untuk membantu pengambilan keputusan manajemen.
        </p>
      </div>
    </div>
  )
}

const StatCard = ({ title, value, icon }) => (
  <div className="bg-black border-2 border-white rounded-lg p-6 flex items-center justify-between">
    <div>
      <h3 className="text-gray-400 text-sm font-semibold mb-1">{title}</h3>
      <p className="text-3xl font-bold text-yellow-400">{value}</p>
    </div>
    <div className="text-yellow-400 text-4xl">{icon}</div>
  </div>
)

export default WorkerDashboard

