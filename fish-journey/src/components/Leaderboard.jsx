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
      }
    }

    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id={id} className="py-24 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-5xl"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">🏆 Leaderboard</h2>
          <p className="text-xl text-muted-gray">See which countries have visited the fish the most!</p>
        </div>

        <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-white">Rank</th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-white">Country</th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-white">Flag</th>
                  <th className="py-4 px-6 text-right font-bold uppercase tracking-wider text-white">Visits</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="border-b border-white/10 hover:bg-white/10 transition-all"
                  >
                    <td className="py-4 px-6 font-bold text-xl text-white">
                      {index + 1}
                    </td>
                    <td className="py-4 px-6 font-mono uppercase font-bold text-lg text-white">
                      {entry.country}
                    </td>
                    <td className="py-4 px-6">
                      <img 
                        src={entry.flagUrl.replace('w320', 'w40')} 
                        alt={`${entry.country} Flag`}
                        className="w-10 h-auto rounded shadow-sm"
                        onError={(e) => { e.target.src = 'https://flagcdn.com/w40/xx.png' }}
                      />
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-2xl text-yellow-400">
                      {entry.visits}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

