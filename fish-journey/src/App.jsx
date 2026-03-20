import { useState, useEffect, useRef, Suspense } from 'react'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Timer from './components/Timer'
import FancyFlagMap from './components/FancyFlagMap'
import MapComponent from './components/Map'
import Leaderboard from './components/Leaderboard'
import Encouragement from './components/Encouragement'
import Goals from './components/Goals'
import Dream from './components/Dream'
import About from './components/About'

function App() {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'timer', 'map', 'leaderboard', 'encourage', 'goals', 'dream', 'about']
      for (let section of sections.reverse()) {
        const el = document.getElementById(section)
        if (el && el.getBoundingClientRect().top < 100) {
          setActiveSection(section)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Bubbles background */}
      <Bubbles />
      
      <Navbar activeSection={activeSection} />
      
      <main>
        <Hero id="home" />
        <Timer id="timer" />
        <section id="map" className="py-24">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-6"
          >
<FancyFlagMap />
          </motion.div>
        </section>
        <Leaderboard id="leaderboard" />
        <Encouragement id="encourage" />
        <Goals id="goals" />
        <Dream id="dream" />
        <About id="about" />
      </main>
    </div>
  )
}

const Bubbles = () => {
  return (
    <div className="bubbles">
      {Array.from({ length: 20 }).map((_, i) => (
        <div 
          key={i}
          className="bubble"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 60 + 20}px`,
            height: '20px',
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${Math.random() * 3 + 4}s`
          }}
        />
      ))}
    </div>
  )
}

export default App

