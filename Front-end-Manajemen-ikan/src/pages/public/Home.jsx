import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { newsService } from "../../services/newsService"
import { fishSpeciesService } from "../../services/fishSpeciesService"

import arowanaBg from "../../assets/images/arowana-bg.jpg"
import ikan from "../../assets/images/ikan.jpg"
import gedung from "../../assets/images/gedung.jpg"
import tambak from "../../assets/images/tambak.jpg"
import aqua from "../../assets/images/aqua.jpg"

/* ================= ICON WRAPPER ================= */
const IconWrapper = ({ children }) => (
  <div className="mb-4 inline-flex rounded-lg bg-white/10 p-3">
    {children}
  </div>
)

/* ================= ICONS ================= */
const icons = {
  stock: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  growth: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
        d="M13 7h8v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  schedule: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  health: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  security: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622z" />
    </svg>
  ),
  dashboard: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
        d="M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
}

/* ================= FEATURES ================= */
const features = [
  {
    icon: "stock",
    title: "Arowana Stock Management",
    desc: "Monitor and manage premium Arowana inventory in real time with accurate and up-to-date stock records."
  },
  {
    icon: "growth",
    title: "Growth Performance Analytics",
    desc: "Analyze fish growth patterns using reliable historical data to support informed operational decisions."
  },
  {
    icon: "schedule",
    title: "Feeding and Harvest Scheduling",
    desc: "Plan and automate feeding routines and harvest schedules to ensure optimal growth and efficiency."
  },
  {
    icon: "health",
    title: "Fish Health Monitoring",
    desc: "Detect potential health issues at an early stage through continuous monitoring and data tracking."
  },
  {
    icon: "security",
    title: "Secure System Architecture",
    desc: "Ensure data protection through authentication mechanisms and encrypted system infrastructure."
  },
  {
    icon: "dashboard",
    title: "Responsive Management Dashboard",
    desc: "Access a modern and responsive dashboard optimized for desktop, tablet, and mobile devices."
  }
]


/* ================= PAGE ================= */
export default function Home() {
  const [news, setNews] = useState([])
  const [loadingNews, setLoadingNews] = useState(true)
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newsService.getPublished()
        setNews(response.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingNews(false)
      }
    }
    fetchNews()
  }, [])
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fishSpeciesService.getAll()
        setProducts(res.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingProducts(false)
      }
    }
  
    fetchProducts()
  }, [])
    
  return (
    <div className="bg-black text-white">

      {/* ================= HOME ================= */}
      <section id="home" className="relative isolate overflow-hidden h-[100vh] ">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center "
          style={{ backgroundImage: `url(${arowanaBg})` }}
        />
        <div className="absolute inset-0 bg-black/70" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-10 h-full flex items-center">
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 w-full items-center">
          
            {/* LEFT SIDE – Text Content (lebih besar) */}
            <div className="lg:col-span-3">
              <h1 className="text-6xl font-bold text-white">
                Arowana <span className="text-orange-500">Corp.</span>
              </h1>

              <p className="mt-4 text-orange-400 font-semibold text-xl">
                Smart Management System
              </p>

              <p className="mt-6 text-white/80 leading-relaxed max-w-2xl">
                Smart Management System is an integrated digital platform designed
                to streamline, automate, and optimize organizational management
                processes through the use of modern information technology. This
                system provides a centralized environment that enables institutions
                to manage data, operations, and decision-making processes efficiently,
                accurately, and in real time.
              </p>

              <Link
                to="/login"
                className="inline-block mt-8 border border-white/30 px-8 py-3 hover:bg-white/10 transition rounded-lg"
              >
                Get Started →
              </Link>
            </div>

            {/* RIGHT SIDE – Images (lebih kecil) */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <img
                src={ikan}
                alt="Dashboard Preview"
                className="rounded-xl shadow-lg object-cover"
              />

              <div className="grid grid-cols-2 gap-4">
                <img
                  src={ikan}
                  alt="System Feature"
                  className="rounded-xl shadow-lg object-cover"
                />
                <img
                  src={arowanaBg}
                  alt="Analytics"
                  className="rounded-xl shadow-lg object-cover"
                />
              </div>
            </div>

          </div>
        </div>
         {/* 🔽 GRADIENT TRANSITION TO FEATURES */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#000000]" />
      </section>
      {/* ================= FEATURES (MASIH HOME) ================= */}
      <section className="pt-10">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold">Feature</h2>
            <p className="text-orange-400 mt-2 ">
            Powerful features designed to streamline operations, enhance efficiency, and support data-driven aquaculture management.
            </p>
          </div>
        <div className="max-w-7xl mx-auto px-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = icons[f.icon]
            return (
              <div key={i} className="border border-gray-800 p-6 rounded-2xl bg-white/5">
                <IconWrapper>
                  <Icon className="w-8 h-8" />
                </IconWrapper>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-300 text-sm">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ================= NEWS ================= */}
      <section id="news" className="py-20">
        <div className="max-w-7xl mx-auto px-10">

          {/* Section Title */}
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold">News & Updates</h2>
            <p className="text-orange-400 mt-2 ">
              Latest updates, insights, and activities from Arowana Corp.
            </p>
          </div>

          {loadingNews ? (
            <p>Loading news...</p>
          ) : (
            <>
              {/* HERO NEWS */}
              {news[0] && (
                <div
                  className="relative h-[420px] rounded-2xl overflow-hidden mb-10 bg-cover bg-center"
                  style={{ backgroundImage: `url(${news[0].image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  <div className="relative z-10 p-10 h-full flex flex-col justify-end max-w-3xl">
                    <h3 className="text-3xl font-bold mb-3">
                      {news[0].title}
                    </h3>
                    <p className="text-gray-300 line-clamp-3">
                      {news[0].description}
                    </p>
                    <span className="text-sm text-gray-400 mt-3">
                      {new Date(news[0].createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </div>
              )}

              {/* OTHER NEWS */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {news.slice(1).map((item) => (
                  <div
                    key={item.id}
                    className="group relative h-64 rounded-xl overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                  >
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition" />

                    <div className="relative z-10 p-5 flex flex-col justify-end h-full">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {item.description}
                      </p>
                      <span className="text-xs text-gray-400 mt-2">
                        {new Date(item.tanggal_publikasi).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      {/* ================= ABOUT ================= */}
      <section id="about" className="py-20">
            <div className="max-w-7xl mx-auto px-10">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">
                    About Arowana Corp.
                  </h2>

                  <p className="text-orange-400 font-semibold mb-6">
                    Professional Arowana Breeding & Smart Aquaculture Management
                  </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                {/* LEFT – About Text (Top Aligned & Justified) */}
                <div className="lg:col-span-3">
                  <h2 className="text-3xl font-semibold mb-2 text-white">
                    About Us
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4 text-justify">
                    Established in 2013, Arowana Corp. is a professional aquaculture company
                    specializing in the breeding, cultivation, and management of premium
                    Arowana fish. Since its inception, the company has been committed to
                    delivering high-quality ornamental fish through responsible aquaculture
                    practices, precision breeding, and strict quality control standards.
                  </p>

                  <p className="text-gray-300 leading-relaxed mb-4 text-justify">
                    What began as a dedicated breeding facility has grown into a modern
                    aquaculture enterprise, serving both domestic and international markets.
                    Over the years, Arowana Corp. has continuously refined its breeding
                    methodologies, cultivation environments, and operational workflows to meet
                    the evolving demands of the global ornamental fish industry.
                  </p>

                  <p className="text-gray-300 leading-relaxed mb-4 text-justify">
                    To support scalability and operational excellence, Arowana Corp. has
                    implemented an integrated Smart Management System that enables real-time
                    monitoring of stock levels, growth performance, fish health, and feeding
                    schedules. This system allows management teams to make accurate,
                    data-driven decisions while maintaining optimal conditions across all
                    stages of cultivation.
                  </p>

                  <p className="text-gray-300 leading-relaxed mb-4 text-justify">
                    By combining professional aquaculture expertise with smart technology, the
                    company ensures operational efficiency, data accuracy, and long-term
                    sustainability. This technology-driven approach not only enhances
                    productivity.
                  </p>

                {/* VISION */}
                <div className="mb-5">
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    Our Vision
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-justify">
                    To become a trusted and globally recognized leader in premium Arowana
                    aquaculture, driven by innovation, sustainability, and uncompromising
                    quality standards.
                  </p>
                </div>

                {/* MISSION */}
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    Our Mission
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1.5 text-justify">
                    <li>Deliver premium Arowana through ethical and sustainable aquaculture</li>
                    <li>Utilize smart technology to enable efficient and data-driven operations</li>
                    <li>Continuously enhance breeding standards to meet global market demands</li>
                    <li>Build long-term partnerships based on trust transparency and consistent quality</li>
                  </ul>
                </div>
              </div>

          {/* RIGHT – Company Images */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <img
              src={gedung}
              alt="Arowana Breeding Facility"
              className="shadow-lg object-cover"
            />

            <div className="grid grid-cols-2 gap-4 h-35">
              <img
                src={tambak}
                alt="Premium Arowana Tanks"
                className="w-full h-full shadow-lg object-cover"
              />
              <img
                src={aqua}
                alt="Arowana Quality Inspection"
                className="w-full h-full shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* Our Fish*/}
    <section
      id="product"
      className="relative py-24"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white">
            Our Arwana
          </h2>
          <p className="mt-4 text-orange-400 max-w-2xl mx-auto">
            We offer premium Arowana products cultivated through sustainable
            aquaculture and managed with our Smart Management System to ensure
            superior quality, health, and performance.
          </p>
        </div>

        {/* PRODUCT GRID */}
        {loadingProducts ? (
          <p className="text-center text-gray-400">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">
            No products available
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((item) => (
              <div
                key={item.id}
                className="group border border-white/10 rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 transition"
              >
                {/* IMAGE */}
                <div className="h-56 overflow-hidden">
                  <img
                    src={item.image || ikan}
                    alt={item.namaVarietas}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.namaVarietas}
                  </h3>

                  <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">
                    {item.deskripsi ||
                      "Premium Arowana bred under controlled environments with smart aquaculture systems."}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-orange-400 font-semibold text-sm">
                      {item.asal || "Premium Selection"}
                    </span>

                    <button className="text-sm text-white border border-white/20 px-4 py-2 rounded-lg hover:border-orange-400 hover:text-orange-400 transition">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 text-center">
          <a
            href="/product"
            className="inline-block border border-orange-400 text-orange-400 px-10 py-4 rounded-xl hover:bg-orange-400 hover:text-black transition"
          >
            Explore All Products →
          </a>
        </div>

      </div>
    </section>

          
    <section id="archive" className="py-24">
      <div className="max-w-7xl mx-auto px-10">
        
        {/* SECTION HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Our Achievements & Archives
          </h2>
          <p className="text-orange-400 max-w-2xl mx-auto">
            A record of milestones, growth, and excellence achieved through
            professional Arowana aquaculture and smart management systems.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {[
            { value: "12+", label: "Years Experience" },
            { value: "25K+", label: "Arowana Bred" },
            { value: "18", label: "International Awards" },
            { value: "40+", label: "Global Partners" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-[#121212] border border-white/10 rounded-xl p-6 text-center hover:border-orange-400 transition"
            >
              <h3 className="text-4xl font-bold text-orange-400 mb-2">
                {item.value}
              </h3>
              <p className="text-gray-300 text-sm uppercase tracking-wide">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* TIMELINE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* LEFT */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-6">
              Key Milestones
            </h3>

            <div className="space-y-6">
              {[
                {
                  year: "2013",
                  title: "Company Founded",
                  desc: "Established as a premium Arowana breeding facility with ethical aquaculture principles.",
                },
                {
                  year: "2017",
                  title: "First International Export",
                  desc: "Successfully exported certified Arowana fish to Southeast Asia markets.",
                },
                {
                  year: "2020",
                  title: "Smart Management System",
                  desc: "Implemented real-time monitoring for stock, growth, and fish health.",
                },
                {
                  year: "2024",
                  title: "Global Recognition",
                  desc: "Received multiple international awards for quality and sustainability.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex gap-6 bg-[#121212] border border-white/10 rounded-xl p-6"
                >
                  <span className="text-orange-400 font-bold text-lg">
                    {item.year}
                  </span>
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-semibold text-white mb-6">
              Why It Matters
            </h3>

            <p className="text-gray-300 leading-relaxed mb-6 text-justify">
              Every achievement reflects our commitment to quality, innovation, and
              sustainability. Our archives document continuous improvement,
              operational transparency, and long-term value for partners and
              clients.
            </p>

            <p className="text-gray-300 leading-relaxed text-justify">
              By combining professional breeding expertise with smart aquaculture
              technology, Arowana Corp. ensures consistent excellence across all
              stages of production and global distribution.
            </p>
          </div>
        </div>

      </div>
    </section>
    </div>
  )
}
