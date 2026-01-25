import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import companyIcon from '../assets/images/company-icon.png'
import { FaBars, FaTimes } from 'react-icons/fa'

const PublicLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'News', id: 'news' },
    { label: 'About', id: 'about' },
    { label: 'Arwana', id: 'product' },
    { label: 'Archive', id: 'archive' }
  ]

  const handleScroll = (id) => {
    setIsOpen(false)
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <div className="min-h-screen flex flex-col text-white relative bg-black">

      <header className="border-b border-white/20 sticky top-0 z-50 backdrop-blur-sm bg-black/40">
        <div className="w-full mx-auto px-6 py-4 flex items-center justify-between">

          <button
            onClick={() => handleScroll('home')}
            className="flex items-center gap-2"
          >
            <img
              src={companyIcon}
              alt="Arowana Corp."
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-xl md:text-2xl">
              Arowana <span className="text-orange-500">Corp.</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScroll(item.id)}
                className="hover:text-orange-500 transition"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm">{user.name}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 border border-white/20 rounded-lg hover:text-orange-500 hover:border-orange-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium"
              >
                Login
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden bg-black border-b border-white/20">
            <nav className="flex flex-col px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleScroll(item.id)}
                  className="text-left hover:text-orange-500 transition py-2"
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t border-white/10 pt-4 mt-2">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <span className="text-sm text-gray-400">Hi, {user.name}</span>
                    <button
                      onClick={logout}
                      className="text-left py-2 hover:text-orange-500"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-4 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium"
                  >
                    Login
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-grow w-full">
        {children}
      </main>

      <footer className="bg-black text-gray-400 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">

          <div className="text-center mb-16">
            <p className="text-sm italic text-gray-300 max-w-3xl mx-auto">
              “Every milestone we achieve is a step toward a more sustainable and
              advanced future for Arowana cultivation.”
            </p>
            <p className="text-xs mt-3 text-gray-500">
              Proud of our journey, inspired for the future.
            </p>

            <div className="mt-6 h-px w-full bg-white/10" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">

            <div className="border border-white/15 rounded-2xl p-8 bg-white/5">
              <h4 className="text-white font-semibold mb-4">
                Our Location
              </h4>

              <p className="text-sm leading-relaxed">
                <span className="font-medium text-white">
                  PT Arwana Citra ikan hias Indonesia
                </span><br />
                Jl. Randu 5 No. 21,<br />
                Jakarta, Bekasi, Indonesia
              </p>

              <div className="mt-6 text-sm space-y-2">
                <p>
                  <span className="text-white">Email:</span> info@arwanacorp.id
                </p>
                <p>
                  <span className="text-white">Phone:</span> +62 812 3456 7890
                </p>
              </div>
            </div>

            <div className="border border-white/15 rounded-2xl overflow-hidden bg-white/5">
              <iframe
                title="Arowana Corp Location"
                src="https://www.google.com/maps?q=PT%20Arwana%20Citra%20Ikan%20Hias%20Indonesia&output=embed"
                className="w-full h-full min-h-[260px]"
                loading="lazy"
              />
            </div>

          </div>

          <div className="border border-white/15 rounded-2xl p-8 bg-gradient-to-r from-white/5 to-white/0 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-semibold text-orange-400 mb-2">
                Contact Us for Legal & Professional Assistance
              </h4>
              <p className="text-sm text-gray-300 max-w-xl">
                Providing professional management and smart solutions for every
                stage of premium Arowana cultivation.
              </p>
            </div>

            <a
              href="/contact"
              className="border border-orange-400 text-orange-400 px-6 py-3 rounded-lg hover:bg-orange-400 hover:text-black transition"
            >
              Contact Us →
            </a>
          </div>

        </div>

        <div className="border-t border-white/10 py-16">
          <div className="w-full px-6 lg:px-10 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">

            <div>
              <h5 className="text-white font-semibold mb-4">Useful Links</h5>
              <ul className="space-y-2">
                <li className="hover:text-orange-400 cursor-pointer">Home</li>
                <li className="hover:text-orange-400 cursor-pointer">About Us</li>
                <li className="hover:text-orange-400 cursor-pointer">Our Product</li>
                <li className="hover:text-orange-400 cursor-pointer">Archive</li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-4">Resources</h5>
              <ul className="space-y-2">
                <li className="hover:text-orange-400 cursor-pointer">Breeding</li>
                <li className="hover:text-orange-400 cursor-pointer">Arowana Info</li>
                <li className="hover:text-orange-400 cursor-pointer">Community</li>
                <li className="hover:text-orange-400 cursor-pointer">Events</li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-4">Insights</h5>
              <ul className="space-y-2">
                <li className="hover:text-orange-400 cursor-pointer">News</li>
                <li className="hover:text-orange-400 cursor-pointer">Updates</li>
                <li className="hover:text-orange-400 cursor-pointer">Technology</li>
                <li className="hover:text-orange-400 cursor-pointer">Sustainability</li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-4">
                Search What You Want to Know
              </h5>
              <p className="text-xs mb-3">
                Monitor our site regularly so you never miss our latest announcements
                and insights.
              </p>
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-400"
              />
            </div>

          </div>
        </div>

        <div className="border-t border-white/10 py-6">
          <div className="w-full px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">

            <p className="text-white font-semibold">
              Arowana Corp.
            </p>

            <div className="flex gap-6 text-xs text-gray-500">
              <span className="hover:text-orange-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-orange-400 cursor-pointer">Terms of Service</span>
              <span className="hover:text-orange-400 cursor-pointer">Cookies Policy</span>
            </div>

            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} All Rights Reserved
            </p>

          </div>
        </div>

      </footer>
    </div>
  )
}

export default PublicLayout
