import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { motion, AnimatePresence } from 'framer-motion'

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export default function FancyFlagMap() {
  const [locations, setLocations] = useState([])
  const [origin, setOrigin] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [loading, setLoading] = useState(true)

  const BACKEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://fishonworldtour.onrender.com'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/locations`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        
        // Safe data handling - filter valid locations and add fallback flagUrl
        const validLocations = Array.isArray(data) ? data.map(loc => ({
          ...loc,
          flagUrl: loc.flagUrl || loc.flag || `https://flagcdn.com/w320/${(loc.actualCountry || 'un').toLowerCase()}.png`,
          name: loc.actualCity || loc.name || 'Location',
          country: loc.actualCountry || loc.country || 'Unknown',
          color: loc.color || '#4A90E2'
        })).filter(loc => loc.lat && loc.lng && loc.name) : []
        
        const homeBase = validLocations.find(loc => loc.name.toLowerCase().includes('lucknow')) || validLocations[0]
        
        setOrigin(homeBase || { lat: 26.8467, lng: 80.9462, name: 'Lucknow 🐟', country: 'India', flagUrl: 'https://flagcdn.com/w320/in.png', color: '#FF6B6B' })
        setLocations(validLocations)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching map data:', error)
        setOrigin({ lat: 26.8467, lng: 80.9462, name: 'Lucknow 🐟', country: 'India', flagUrl: 'https://flagcdn.com/w320/in.png', color: '#FF6B6B' })
        setLocations([
          { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, flagUrl: 'https://flagcdn.com/w320/us.png', color: '#4ECDC4' },
          { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, flagUrl: 'https://flagcdn.com/w320/gb.png', color: '#45B7D1' },
          { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, flagUrl: 'https://flagcdn.com/w320/jp.png', color: '#F9CA24' }
        ])
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Custom Flag Icon
  const createFlagIcon = (loc) => L.divIcon({
    className: 'custom-flag-marker',
    html: `
      <div class="flag-container" style="--flag-color: ${loc.color}">
        <div class="flag-ring"></div>
        <div class="flag-circle">
          <img src="${loc.flagUrl}" class="flag-img" onerror="this.src='https://flagcdn.com/w320/un.png'"/>
        </div>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  })

  if (loading) return <div className="text-center p-20 text-xl font-semibold text-gray-600">Loading your journey map...</div>

  return (
    <motion.div 
      className="glass rounded-3xl p-6 max-w-6xl mx-auto shadow-2xl relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <style>{`
        .flag-container { width: 42px; height: 42px; position: relative; display: flex; align-items: center; justify-content: center; }
        .flag-ring { width: 100%; height: 100%; border: 3px solid var(--flag-color); border-radius: 50%; position: absolute; opacity: 0.3; transition: all 0.4s ease; }
        .custom-flag-marker:hover .flag-ring { opacity: 1; transform: scale(1.2); animation: ringPulse 1.5s infinite; }
        @keyframes ringPulse { 0%, 100% { box-shadow: 0 0 0 var(--flag-color); } 50% { box-shadow: 0 0 15px var(--flag-color); } }
        .flag-circle { width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; overflow: hidden; z-index: 2; background: white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
        .flag-img { width: 100%; height: 100%; object-fit: cover; }
        .leaflet-path-thread { stroke-dasharray: 5, 5; animation: dashMove 30s linear infinite; }
        @keyframes dashMove { from { stroke-dashoffset: 10; } to { stroke-dashoffset: 0; } }
      `}</style>

      <div className="h-[600px] rounded-3xl overflow-hidden shadow-inner border border-white/20">
        <MapContainer center={[20, 0]} zoom={2.5} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

          {/* Lines from origin to destinations */}
          {origin && locations.filter(l => l !== origin).map((loc, idx) => (
            <Polyline
              key={`path-${idx}`}
              positions={[[origin.lat, origin.lng], [loc.lat, loc.lng]]}
              pathOptions={{ color: '#4A90E2', weight: 1.5, opacity: 0.3 }}
              className="leaflet-path-thread"
            />
          ))}

          {/* Markers */}
          {locations.map((loc, index) => (
            <Marker 
              key={`loc-${index}`}
              position={[loc.lat, loc.lng]}
              icon={createFlagIcon(loc)}
              eventHandlers={{
                mouseover: () => setHovered(loc.name),
                mouseout: () => setHovered(null)
              }}
            >
              <Popup>
                <div className="text-center font-bold p-2">
                  {loc.name}<br/>
                  <span className="text-gray-500 font-normal">{loc.country}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg z-[1000] border border-blue-100"
          >
            <span className="text-blue-600 font-bold">Visiting:</span> {hovered}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
