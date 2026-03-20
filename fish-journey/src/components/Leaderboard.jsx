import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const BACKEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://fishonworldtour.onrender.com'

export default function Leaderboard({ id }) {
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/leaderboard`)
        if (response.ok) {
          const data = await response.json()
          setLeaderboard(data)
        }
      } catch (error) {
        console.error('Leaderboard error:', error)
        setLeaderboard([{ country: 'Loading...', visits: 0 }])
      }
    }

    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id={id} className="py-24 px-6 bg-gradient-to-b from-teal-blue/30 to-transparent">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-5xl"
      >
        <motion.div className="text-center mb-16" whileInView={{ scale: 1.05 }}>
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-accent-orange to-cyan-blue bg-clip-text text-transparent mb-4">
            🏆 Leaderboard
          </h2>
          <p className="text-xl text-muted-gray max-w-2xl mx-auto">
            Live visits from backend database
          </p>
        </motion.div>

        <motion.div 
          className="glass rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-6 px-4 text-left text-lg font-bold text-cyan-blue uppercase tracking-wider">Rank</th>
                  <th className="py-6 px-4 text-left text-lg font-bold text-cyan-blue uppercase tracking-wider">Country</th>
                  <th className="py-6 px-4 text-center text-lg font-bold text-cyan-blue uppercase tracking-wider">Flag</th>
                  <th className="py-6 px-4 text-right text-lg font-bold text-cyan-blue uppercase tracking-wider">Visits</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-6 px-4 font-bold text-2xl text-soft-white group-hover:text-accent-orange">
                      #{index + 1}
                    </td>
                    <td className="py-6 px-4 font-semibold text-xl text-soft-white">
                      {entry.country || 'Unknown'}
                    </td>
                    <td className="py-6 px-4 text-3xl">
                      <span className="animate-pulse">{entry.flag || '🌍'}</span>
                    </td>
                    <td className="py-6 px-4 text-right font-bold text-2xl bg-gradient-to-r from-accent-orange to-yellow-400 bg-clip-text text-transparent">
                      {entry.visits?.toLocaleString() || 0}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

