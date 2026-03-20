import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { motion } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const BACKEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://fishonworldtour.onrender.com'

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl
// Custom flag icons - no default Leaflet markers used

export default function MapComponent() {
  const [locations, setLocations] = useState([])
  const [path, setPath] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/locations`)
        if (response.ok) {
          const data = await response.json()
          const ordered = data.reverse()
          setLocations(ordered)
          setPath(ordered.map(loc => [loc.lat, loc.lng]))
        }
      } catch (error) {
        console.error('Map load error:', error)
      }
    }
    
    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="glass rounded-3xl p-1 max-w-6xl mx-auto shadow-2xl"
    >
      <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
        <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-soft-white to-cyan-blue bg-clip-text text-transparent mb-4">
          🌍 Where Have I Been? (Live)
        </h2>
        <p className="text-xl text-muted-gray max-w-2xl mx-auto">
          Backend locations + travel paths (updates every 30s)
        </p>
      </motion.div>

      <div className="h-[400px] md:h-[600px] rounded-2xl overflow-hidden">
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Animated travel path */}
          {path.length > 1 && (
            <Polyline 
              positions={path} 
              pathOptions={{ 
                color: '#3b82f6', 
                weight: 4, 
                opacity: 0.8, 
                dashArray: '15 10' 
              }}
              eventHandlers={{
                click: () => alert('Full travel path clicked!')
              }}
            />
          )}

          {/* Live markers */}
          {locations.map((loc, index) => (
            <Marker key={index} position={[loc.lat, loc.lng]}>
              <Popup>
                <div className="min-w-[250px]">
                  <h3 className="font-bold text-xl mb-2">{loc.actualCity || 'City'}</h3>
                  <p className="text-lg mb-3">{loc.actualCountry}</p>
                  {loc.flagUrl && <img src={loc.flagUrl} alt={loc.actualCountry} className="w-16 rounded shadow-lg mx-auto" />}
                  {loc.intendedCountry && (
                    <p className="mt-2 text-sm text-gray-600">
                      Planned: {loc.intendedCity || ''} {loc.intendedCountry}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </motion.div>
  )
}

