
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const mainGoals = [
  "Meet its girlfriend 🐠❤️",
  "Meet Bill Gates 🤝💰", 
  "Meet Cristiano Ronaldo ⚽🏆",
  "Help its friends who are still in the ocean 🌊🐟",
  "Create its own empire 👑🏰"
]

const lifeGoals = [
"Get a high-paying job 💼 (But does money buy freedom or another set of chains?)",
  "Buy a house 🏡 (A place to call home, or just another golden cage?)",
  "Travel the world ✈️ (Running away from something, or searching for something?)",
  "Prove himself 💪 (To society, to family, or to his own reflection?)",
  "Find true happiness ☀️ (But does anyone really know what it is?)",
  "Break free from expectations 🔗 (Or accept them and live in comfort?)",
  "Build something that lasts 🏗️ (A legacy, or just an illusion of importance?)",
  "Understand life itself 🌌 (Is there an answer, or just more questions?)",
  "Learn to be alone 🧘‍♂️ (Because even in crowds, loneliness exists.)",
  "Earn respect without money 💎 (Can success exist without wealth?)",
  "Love without fear ❤️ (But is love ever without fear?)",
  "Accept failure 🚪 (Is it the end, or just another door?)",
  "Find purpose 🛤️ (Or does purpose find us?)",
  "Stop seeking validation 🛑 (Or do we all secretly crave it?)",
  "Be truly free 🦅 (What does freedom even mean?)",
  "Escape the system ⚙️ (Or find a way to bend it?)",
  "Master patience ⏳ (Or is patience just waiting for something that may never come?)",
  "Live without regrets 🎭 (Or are regrets proof that we truly lived?)",
  "Look at the stars and wonder ✨ (Is there more beyond this life?)"
]

export default function Goals({ id }) {
  const [showLifeGoals, setShowLifeGoals] = useState(false)
  const [completedGoals, setCompletedGoals] = useState([])

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('fishLifeGoals')
    if (saved) {
      setCompletedGoals(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage whenever changes
  React.useEffect(() => {
    localStorage.setItem('fishLifeGoals', JSON.stringify(completedGoals))
  }, [completedGoals])

  const toggleGoal = (index) => {
    setCompletedGoals(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const progress = (completedGoals.length / lifeGoals.length) * 100

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
              className="mt-12 max-w-4xl mx-auto"
            >
              {/* Progress Bar */}
              <motion.div 
                className="glass mb-8 p-6 rounded-2xl text-center"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent-orange/80 to-cyan-blue/80 rounded-2xl blur-sm" />
                <div className="relative">
                  <span className="font-bold text-soft-white text-lg">
                    {Math.round(progress)}% Complete ({completedGoals.length}/{lifeGoals.length})
                  </span>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 pointer-events-none">
                {lifeGoals.map((goal, index) => {
                  const isCompleted = completedGoals.includes(index)
                  return (
                    <motion.label
                      key={index}
                      className="glass p-6 rounded-2xl border-2 border-white/20 glass-hover flex items-start space-x-4 hover:border-accent-orange/50 group"
                      whileHover={{ scale: 1.02 }}
                      // Disabled for visitors: whileTap={{ scale: 0.98 }}
                      // Disabled for visitors: onClick={() => toggleGoal(index)}
                    >
                      <motion.div 
                        className="flex-shrink-0 w-8 h-8 rounded-xl border-2 border-white/30 flex items-center justify-center mt-1 bg-gradient-to-br from-accent-orange/20 to-cyan-blue/20 group-hover:border-accent-orange"
                        animate={{ scale: isCompleted ? 1.1 : 1 }}
                        transition={{ type: "spring" }}
                      >
                        <span className={`text-lg font-bold transition-colors ${isCompleted ? 'text-accent-orange animate-pulse' : 'text-muted-gray'}`}>
                          {isCompleted ? '☑' : '☐'}
                        </span>
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-lg transition-all ${isCompleted ? 'text-accent-orange/80 line-through' : 'text-soft-white'}`}>
                          {goal}
                        </h4>
                        <p className="text-muted-gray text-sm mt-1">Philosophical quest 🧠</p>
                      </div>
                    </motion.label>
                  )
                })}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}

