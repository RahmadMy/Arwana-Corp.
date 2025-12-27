import { Link } from 'react-router-dom'

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">403</h1>
        <p className="text-xl text-gray-400 mb-8">Anda tidak memiliki akses ke halaman ini</p>
        <Link
          to="/"
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg transition-colors inline-block"
        >
          Kembali ke Home
        </Link>
      </div>
    </div>
  )
}

export default Unauthorized

