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
    totalGrowthRecords: 0,
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

        const totalGrowthRecords = growths.data?.length || 0
        const healthyFish = healths.data?.filter(h => h.kondisi === 'Sehat').length || 0

        // Growth chart
        const growthData = growths.data?.map((g, i) => ({
          name: `Record ${i + 1}`,
          amount: g.jumlah || 0
        })) || []

        // Health chart
        const healthData = [
          { name: 'Healthy', value: healthyFish },
          { name: 'Unhealthy', value: (healths.data?.length || 0) - healthyFish }
        ]

        setStats({
          totalAquariums: aquariums.data?.length || 0,
          totalSpecies: species.data?.length || 0,
          totalGrowthRecords,
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
    return <div className="text-center py-12 text-white">Loading data...</div>
  }

  return (
    <div>
      <h1 className="text-5xl font-bold text-yellow-400 mb-8 uppercase">
        Dashboard
      </h1>

      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Aquariums"
          value={stats.totalAquariums}
          icon={<FaWater />}
        />
        <StatCard
          title="Fish Species"
          value={stats.totalSpecies}
          icon={<FaFish />}
        />
        <StatCard
          title="Total Growth Records"
          value={stats.totalGrowthRecords}
          icon={<FaChartLine />}
        />
        <StatCard
          title="Healthy Fish"
          value={stats.healthyFish}
          icon={<FaHeartbeat />}
        />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Growth Chart */}
        <div className="bg-black border-2 border-white rounded-lg p-6">
          <h2 className="text-white font-semibold mb-4">
            Fish Growth Chart
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#FACC15"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Health Chart */}
        <div className="bg-black border-2 border-white rounded-lg p-6">
          <h2 className="text-white font-semibold mb-4">
            Fish Health Status
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
          System Summary
        </h2>
        <p className="text-gray-400">
          This dashboard displays an overview of aquariums, fish species,
          growth records, and fish health status, providing a visual summary
          to assist in management decisions.
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
