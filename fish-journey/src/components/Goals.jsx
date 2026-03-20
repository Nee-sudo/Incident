import { useState } from 'react'
import { motion } from 'framer-motion'

const mainGoals = [
  "Meet its girlfriend ❤️🐟",
  "Meet Bill Gates 💼💡",
  "Meet Cristiano Ronaldo ⚽🏆",
  "Help friends still in the ocean 🌊🐟",
  "Create its own empire 👑🔥"
]

const lifeGoals = [
  "Get a high-paying job 💼",
  "Buy a house 🏡", 
  "Travel the world ✈️",
  "Prove himself 💪",
  "Find true happiness ☀️"
  // Add more from specs
]

export default function Goals({ id }) {
  const [showLifeGoals, setShowLifeGoals] = useState(false)

  return (
    <section id={id} className="py-24 px-6 bg-gradient-to-b from-teal-blue/20 to-transparent">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-6xl"
      >
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-black bg-gradient-to-r from-soft-white to-accent-orange bg-clip-text text-transparent mb-4"
            whileInView={{ scale: 1.05 }}
          >
            🎯 Goals of the Fish
          </motion.h2>
          <p className="text-xl text-muted-gray max-w-2xl mx-auto">
            Big dreams, small fins—unstoppable ambition
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          {mainGoals.map((goal, index) => (
            <motion.div
              key={index}
              className="glass p-8 rounded-3xl text-center group hover:border-cyan-blue/50 glass-hover cursor-pointer"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-orange/20 to-cyan-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">{goal.split(' ')[0]}</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-soft-white">{goal}</h3>
              <p className="text-muted-gray text-sm">Dream big 🐟</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={() => setShowLifeGoals(!showLifeGoals)}
            className="glass px-12 py-6 rounded-2xl border-2 border-white/20 font-bold text-lg hover:border-accent-orange transition-all duration-300 hover:bg-accent-orange/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {showLifeGoals ? '← Back to Main Goals' : 'Life Goals & Deeper Questions ↓'}
          </motion.button>

          {showLifeGoals && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-12 max-w-3xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lifeGoals.map((goal, index) => (
                  <motion.div
                    key={index}
                    className="glass p-6 rounded-2xl border-l-4 border-accent-orange glass-hover"
                    whileHover={{ x: 10 }}
                  >
                    <h4 className="font-bold mb-2">{goal}</h4>
                    <p className="text-muted-gray text-sm">Philosophical quest 🧠</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}

