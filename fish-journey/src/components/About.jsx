import { motion } from 'framer-motion'

const aboutText = `This fish doesn't believe in borders. It thinks beyond limits, beyond oceans, beyond the ordinary. One day, it realized something strange—while it had fins to swim freely, it was still trapped, not by walls, but by invisible boundaries set by those who never dared to leave.

At first, it wondered—was it wrong to question? Was it foolish to believe there was something more? The other fish called it naive. They told it to accept its place, to swim in safe circles, to follow the currents already mapped out by generations before. But how could it? How could it silence the voice inside that whispered: 'There's more than this.'

It wasn't just curiosity—it was a feeling deeper than that. A realization that comfort can be a cage, that security often comes at the cost of dreams, that most fears are just illusions woven by those too afraid to try.

The fish had a choice. It could stay and be safe, like the rest. Or it could take the risk, leave the familiar behind, and venture into the unknown—not knowing if it would find success, failure, or simply get lost forever. But what is worse? Dying in the ocean you know or disappearing into one you don't?

So, the fish swam away—not because it knew the answers, but because it was willing to find them. Not because it wasn't afraid, but because fear was no longer a good enough reason to stay. The moment it left, it felt something it had never felt before: it was alive.

Who sent this fish on its journey? Maybe someone who questions everything. Maybe someone who refuses to settle. Maybe someone who sees the world not for what it is, but for what it could be. Or maybe… it's you, the one reading this now.

Because in the end, the fish isn't just a fish. It's a symbol of those who dare to leave, those who dare to dream, those who dare to wonder: What else is out there?

There's more behind these words. Stay tuned—you will soon get to know the real story of this fish. 🐟`

export default function About({ id }) {
  return (
    <section id={id} className="py-32 px-6 pb-32">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-4xl"
      >
        <motion.div className="text-center mb-20" whileInView={{ scale: 1.05 }}>
          <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-soft-white to-muted-gray bg-clip-text text-transparent mb-8">
            📜 About the Fish
          </h2>
        </motion.div>

        <motion.article 
          className="glass rounded-3xl p-12 md:p-20 prose prose-invert max-w-none"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          {aboutText.split('\n\n').map((paragraph, index) => (
            <motion.p 
              key={index}
              className="text-lg md:text-xl leading-relaxed mb-10 last:mb-0 text-soft-white/90"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
            >
              {paragraph}
            </motion.p>
          ))}
        </motion.article>
      </motion.div>
    </section>
  )
}

