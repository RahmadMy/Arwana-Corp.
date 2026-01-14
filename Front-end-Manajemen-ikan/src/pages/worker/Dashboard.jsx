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
  FaChartLine,
  FaBoxOpen,
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
      <h1 className="text-3xl md:text-5xl font-bold text-yellow-400 mb-8 uppercase">
        Dashboard
      </h1>

      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Aquariums"
          value={stats.totalAquariums}
          icon={<FaWater />}
          color="from-cyan-500 to-blue-500"
        />
        <StatCard
          title="Fish Species"
          value={stats.totalSpecies}
          icon={<FaFish />}
          color="from-purple-500 to-pink-500"
        />
        <StatCard
          title="Growth Records"
          value={stats.totalGrowthRecords}
          icon={<FaChartLine />}
          color="from-yellow-400 to-orange-500"
        />
        <StatCard
          title="Healthy Fish"
          value={stats.healthyFish}
          icon={<FaHeartbeat />}
          color="from-green-500 to-emerald-500"
        />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Growth Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg shadow-yellow-400/5 relative overflow-hidden">
          {/* Top Divider */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500" />

          <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
            <FaChartLine className="text-yellow-400" /> Fish Growth Trend
          </h2>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#999', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" tick={{ fill: '#999', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                  itemStyle={{ color: '#FACC15' }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#FACC15"
                  strokeWidth={3}
                  dot={{ fill: '#FACC15', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg shadow-green-500/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600" />

          <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
            <FaHeartbeat className="text-green-500" /> Fish Health Status
          </h2>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthChart}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {healthChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ===== SUMMARY ===== */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-1 bg-gray-700" />
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <FaBoxOpen className="text-gray-400" /> System Summary
        </h2>
        <p className="text-gray-400 leading-relaxed">
          This dashboard displays a comprehensive overview of aquariums, fish species,
          growth trends, and health status of the Arowana fish to assist in data-driven management decisions.
        </p>
      </div>
    </div>
  )
}

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden group hover:border-gray-700 transition-all duration-300">
    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${color} rounded-bl-3xl`}>
      <div className="text-white text-3xl">{icon}</div>
    </div>

    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white text-xl mb-4 shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  </div>
)

export default WorkerDashboard
