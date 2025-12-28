import { useState, useEffect } from 'react'
import { newsService } from '../../services/newsService'

const News = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newsService.getAll()

        // 🔒 HANYA TAMPILKAN BERITA PUBLISH
        const publishedNews = (response.data || []).filter(
          (item) => item.status === 'publish'
        )

        setNews(publishedNews)
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-white text-center">Memuat berita...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">
        Berita
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.length > 0 ? (
          news.map((item) => (
            <div
              key={item.id}
              className="relative h-80 rounded-xl overflow-hidden bg-black border border-gray-700"
              style={{
                backgroundImage: item.image
                  ? `url(${item.image.trim()})`
                  : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60"></div>

              {/* Content */}
              <div className="relative z-10 p-6 flex flex-col justify-end h-full">
                <h3 className="text-lg font-semibold text-white mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-gray-200 text-sm line-clamp-3 mb-3">
                  {item.description}
                </p>

                <p className="text-gray-400 text-xs">
                  {item.tanggal_publikasi ? (
                    new Date(item.tanggal_publikasi).toLocaleDateString(
                      'id-ID',
                      {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }
                    )
                  ) : (
                    <span className="italic">
                      Belum dipublikasikan
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-12">
            Belum ada berita tersedia
          </div>
        )}
      </div>
    </div>
  )
}

export default News
