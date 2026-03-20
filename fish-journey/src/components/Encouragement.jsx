import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const BACKEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://fishonworldtour.onrender.com'

export default function Encouragement({ id }) {
  const [message, setMessage] = useState('')
  const [comments, setComments] = useState([])
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.slice(0, 10)) // Show recent 10
      }
    } catch (error) {
      console.error('Comments error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (message.trim()) {
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json")
        const ipData = await ipResponse.json()
        
        const response = await fetch(`${BACKEND_URL}/api/comment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: message, ipAddress: ipData.ip })
        })

        if (response.ok) {
          setSubmitted(true)
          setTimeout(() => {
            setSubmitted(false)
            loadComments()
            setMessage('')
          }, 2000)
        }
      } catch (error) {
        console.error('Post error:', error)
      }
    }
  }

  return (
    <section id={id} className="py-24 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-2xl"
      >
        <motion.div className="text-center mb-16" whileInView={{ scale: 1.05 }}>
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-soft-white to-accent-orange bg-clip-text text-transparent mb-4">
            💬 Encourage the Fish
          </h2>
          <p className="text-xl text-muted-gray">
            Live comments from visitors worldwide
          </p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit}
          className="glass rounded-3xl p-10 md:p-12 shadow-2xl mb-12"
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your encouragement here..."
            className="w-full h-40 md:h-48 p-8 bg-white/5 backdrop-blur-xl border-2 border-white/20 rounded-2xl text-soft-white placeholder-muted-gray resize-none focus:border-cyan-blue focus:outline-none transition-all duration-300 text-lg"
            maxLength={500}
          />
          <motion.button
            type="submit"
            className="btn-blue w-full md:w-auto mt-8 font-bold text-lg py-5 px-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            disabled={submitted}
          >
            {submitted ? 'Sent! 🌟' : 'Send Message'}
          </motion.button>
        </motion.form>

        {/* Recent Comments */}
        <motion.div 
          className="glass rounded-2xl p-8 space-y-4 max-h-96 overflow-y-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <h3 className="font-bold text-2xl mb-4 text-cyan-blue">Recent Messages</h3>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <motion.div 
                key={index}
                className="flex gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                {comment.flagUrl && (
                  <img src={comment.flagUrl} alt={comment.country} className="w-8 h-6 rounded flex-shrink-0 mt-1" />
                )}
                <div>
                  <p className="font-medium">{comment.text}</p>
                  <small className="text-muted-gray">{new Date(comment.timestamp).toLocaleString()}</small>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-muted-gray text-center py-8 italic">Be the first to encourage the fish! 🐟</p>
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}

