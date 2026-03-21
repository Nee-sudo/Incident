import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const menuItems = [
  { id: 'home', label: 'Home' },
  { id: 'journey', label: 'Journey' },
  { id: 'map', label: 'Map' },
  { id: 'goals', label: 'Goals' },
  { id: 'dream', label: 'Dream' },
  { id: 'about', label: 'About' }
]

export default function Navbar({ activeSection }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-lg ${scrolled ? 'glass backdrop-blur-xl shadow-xl/50' : 'glass shadow-md/50'}`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div 
          className="text-2xl font-bold flex items-center gap-2 text-soft-white"
          whileHover={{ scale: 1.05 }}
        >
          🐟 <span>The Fish's Journey</span>
        </motion.div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a 
                href={`#${item.id}`}
                className={`relative text-soft-white/80 hover:text-accent-orange font-medium transition-colors duration-300 pb-1 ${
                  activeSection === item.id ? 'text-accent-orange !opacity-100' : ''
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-orange to-cyan-blue rounded-full" />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-soft-white hover:text-accent-orange rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-orange"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </>
            ) : (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div 
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0, scaleY: isOpen ? 1 : 0.95 }}
        exit={{ opacity: 0, scaleY: 0.95 }}
        className="md:hidden fixed inset-0 z-40 flex flex-col bg-glass/95 backdrop-blur-2xl pt-20"
        style={{ top: 'var(--nav-height, 80px)' }}
      >
        {/* Backdrop overlay */}
        <div 
          className="absolute inset-0 -z-10"
          onClick={() => setIsOpen(false)}
        />
        <ul className="flex-1 flex flex-col items-center justify-center space-y-4 px-6 py-8 text-lg">
          {menuItems.map((item, index) => (
            <motion.li 
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <a 
                href={`#${item.id}`}
                className={`block py-3 px-6 text-soft-white/90 hover:text-accent-orange hover:bg-white/10 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 ${
                  activeSection === item.id ? 'text-accent-orange bg-gradient-to-r from-accent-orange/20 font-bold shadow-orange-500/25' : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.nav>
  )
}

