import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const START_DATE = new Date('2025-04-01T00:00:00').getTime()

export default function Timer({ id }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now()
      const diff = now - START_DATE

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60 * 60)) / 1000)

      setTime({ days, hours, minutes, seconds })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  const timeBoxes = [
    { value: time.days.toString().padStart(3, '0'), label: 'Days' },
    { value: time.hours.toString().padStart(2, '0'), label: 'Hours' },
    { value: time.minutes.toString().padStart(2, '0'), label: 'Minutes' },
    { value: time.seconds.toString().padStart(2, '0'), label: 'Seconds' }
  ]

  return (
    <section id={id} className="py-24 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto max-w-6xl text-center"
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-soft-white via-accent-orange to-cyan-blue bg-clip-text text-transparent"
          whileInView={{ scale: 1.05 }}
        >
          🐟 The Journey So Far
        </motion.h2>
        
        <p className="text-xl md:text-2xl text-muted-gray mb-2 max-w-2xl mx-auto">
          It all began on April 01, 2025… and it's still going!
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto mt-16">
          {timeBoxes.map((box, index) => (
            <motion.div 
              key={box.label}
              className="glass p-8 md:p-10 rounded-3xl text-center group hover:border-cyan-blue/50 transition-all duration-500"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(6, 182, 212, 0.3)" }}
            >
              <motion.span 
                className="block text-4xl md:text-5xl lg:text-6xl font-black text-cyan-blue mb-3 group-hover:text-accent-orange transition-colors"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {box.value}
              </motion.span>
              <p className="text-sm uppercase tracking-widest text-muted-gray font-medium">
                {box.label}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p 
          className="text-xl md:text-2xl text-muted-gray mt-16 italic max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          "Every second counts in this journey… How far will I go?"
        </motion.p>
      </motion.div>
    </section>
  )
}

