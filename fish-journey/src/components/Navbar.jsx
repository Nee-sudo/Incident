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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass backdrop-blur-xl' : 'glass'}`}
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
          className="md:hidden text-2xl text-soft-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        className="md:hidden glass backdrop-blur-sm origin-top"
      >
        <ul className="py-4 px-6 space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a 
                href={`#${item.id}`}
                className={`block py-2 text-soft-white/80 hover:text-accent-orange transition-colors ${
                  activeSection === item.id ? 'text-accent-orange font-bold' : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.nav>
  )
}

