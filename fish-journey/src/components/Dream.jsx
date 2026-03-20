import { motion } from 'framer-motion'

const dreamText = `Every fish is taught one thing: stay in the water. It is born, it swims, it survives, and eventually, it sinks into the depths, forgotten like all the others before it. But this fish dared to ask: 'What if I wasn't meant to stay here?'

While others were content with the ocean, this fish looked up at the night sky, where stars floated like impossible dreams. 'If birds can fly, why can't I? If humans can reach the moon, why should I stop at the shore?' To most, these thoughts were madness. But to the fish, they were a calling.

It doesn't just want to swim; it wants to defy what was said to be impossible. It wants to reach space, where no fish has ever gone before—not just to explore, but to prove that limits exist only for those who believe in them.

And isn't that the dream of every human, too? To break free from expectations, from the walls of routine, from the small ponds we're told to stay in? To escape the ordinary and touch something greater than ourselves?

This fish knows the truth: most creatures die without ever knowing what they were truly capable of. It refuses to be one of them.

Maybe it will reach the stars. Maybe it won't. But even if it falls, at least it dared to fly.`

export default function Dream({ id }) {
  return (
    <section id={id} className="py-32 px-6 relative overflow-hidden">
      {/* Subtle teal gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-blue/20 to-transparent" />
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-3xl relative z-10"
      >
        <motion.div className="text-center mb-20" whileInView={{ scale: 1.05 }}>
          <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-soft-white via-muted-gray to-teal-blue bg-clip-text text-transparent mb-8">
            🌟 Dream of This Fish
          </h2>
        </motion.div>

        <motion.div 
          className="glass rounded-3xl p-12 md:p-20 prose prose-invert max-w-none"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.01 }}
        >
          {dreamText.split('\n\n').map((paragraph, index) => (
            <motion.p 
              key={index}
              className="text-lg md:text-xl leading-relaxed mb-8 last:mb-0 text-soft-white/90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {paragraph}
            </motion.p>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
