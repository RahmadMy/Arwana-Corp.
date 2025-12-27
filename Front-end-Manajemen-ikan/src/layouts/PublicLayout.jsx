import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import companyIcon from '../assets/images/company-icon.png'

const PublicLayout = ({ children }) => {
  const { user, logout } = useAuth()

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'News', id: 'news' },
    { label: 'About', id: 'about' },
    { label: 'Product', id: 'product' },
    { label: 'Archive', id: 'archive' }
  ]

  const handleScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <div className="min-h-screen flex flex-col text-white relative bg-black">

      {/* ================= HEADER ================= */}
      <header className="border-b border-white/20 sticky top-0 z-50 backdrop-blur-sm bg-black/40">
        <div className="w-full mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => handleScroll('home')}
            className="flex items-center gap-2"
          >
            <img
              src={companyIcon}
              alt="Arowana Corp."
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-2xl">
              Arowana <span className="text-orange-500">Corp.</span>
            </span>
          </button>

          {/* Navigation */}
          <nav className="flex items-center gap-10">
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

          {/* Right Side */}
          <div className="flex items-center gap-4">
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
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* ================= FOOTER (TETAP PUNYA KAMU) ================= */}
      <footer className="bg-black text-gray-400 border-t border-white/10">
        {/* ================= CENTER CONTENT ================= */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">

          {/* QUOTE */}
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

          {/* LOCATION & MAP */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">

            {/* LOCATION */}
            <div className="border border-white/15 rounded-2xl p-8 bg-white/5">
              <h4 className="text-white font-semibold mb-4">
                Our Location
              </h4>

              <p className="text-sm leading-relaxed">
                <span className="font-medium text-white">
                  PT Budidaya Arowana Putra Perkasa
                </span><br />
                Jl. Sungai Arowana No. 21,<br />
                Pekanbaru, Riau, Indonesia
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

            {/* MAP */}
            <div className="border border-white/15 rounded-2xl overflow-hidden bg-white/5">
              <iframe
                title="Arowana Corp Location"
                src="https://www.google.com/maps?q=Pekanbaru%20Riau&output=embed"
                className="w-full h-full min-h-[260px]"
                loading="lazy"
              />
            </div>

          </div>

          {/* CTA BOX */}
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

        {/* ================= FULL WIDTH LINKS ================= */}
        <div className="border-t border-white/10 py-16">
          <div className="w-full px-6 lg:px-10 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">

            {/* USEFUL LINKS */}
            <div>
              <h5 className="text-white font-semibold mb-4">Useful Links</h5>
              <ul className="space-y-2">
                <li className="hover:text-orange-400 cursor-pointer">Home</li>
                <li className="hover:text-orange-400 cursor-pointer">About Us</li>
                <li className="hover:text-orange-400 cursor-pointer">Our Product</li>
                <li className="hover:text-orange-400 cursor-pointer">Archive</li>
              </ul>
            </div>

            {/* RESOURCES */}
            <div>
              <h5 className="text-white font-semibold mb-4">Resources</h5>
              <ul className="space-y-2">
                <li className="hover:text-orange-400 cursor-pointer">Breeding</li>
                <li className="hover:text-orange-400 cursor-pointer">Arowana Info</li>
                <li className="hover:text-orange-400 cursor-pointer">Community</li>
                <li className="hover:text-orange-400 cursor-pointer">Events</li>
              </ul>
            </div>

            {/* INSIGHTS */}
            <div>
              <h5 className="text-white font-semibold mb-4">Insights</h5>
              <ul className="space-y-2">
                <li className="hover:text-orange-400 cursor-pointer">News</li>
                <li className="hover:text-orange-400 cursor-pointer">Updates</li>
                <li className="hover:text-orange-400 cursor-pointer">Technology</li>
                <li className="hover:text-orange-400 cursor-pointer">Sustainability</li>
              </ul>
            </div>

            {/* SEARCH */}
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

        {/* ================= BOTTOM BAR ================= */}
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
