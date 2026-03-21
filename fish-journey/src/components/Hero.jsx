import { motion } from 'framer-motion'

export default function Hero({ id }) {
  return (
    <section id={id} className="min-h-screen flex items-center justify-center text-center px-6 pt-20 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto"
      >
        <motion.img 
          src="/images/fish.png"
          alt="Cute fish with hat"
          className="w-64 md:w-80 mx-auto mb-8 animate-float drop-shadow-2xl"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 bg-gradient-to-r from-soft-white to-muted-gray bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          I Want to See
          <br />
          <span className="inline-block">
            <span className="bg-gradient-to-r from-accent-orange to-yellow-400 bg-clip-text text-transparent">the World</span>
            <span className="text-soft-white ml-1">🥺</span>
          </span>
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-muted-gray mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Follow the journey of a little fish with big dreams—swimming against the tide, chasing stars, 
          and proving that no ocean is too vast.
        </motion.p>

        <motion.a 
          href="#timer"
          className="btn-orange inline-block text-lg md:text-xl shadow-2xl"
          whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(249, 115, 22, 0.5)" }}
          whileTap={{ scale: 0.98 }}
        >
          Start the Journey ↓
        </motion.a>
      </motion.div>
    </section>
  )
}

