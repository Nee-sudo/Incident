import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import FlagMapCSS from './FlagMap.css' // Custom flag/thread styles
import { motion } from 'framer-motion'

// Fix default icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Sample data with flags (replace with backend)
const travelData = {
  origin: { name: "Lucknow", lat: 26.8467, lng: 80.9462, country: "India", flag: "https://flagcdn.com/w20/in.png" },
  destinations: [
    { name: "New York", country: "USA", lat: 40.7128, lng: -74.0060, flag: "https://flagcdn.com/w20/us.png" },
    { name: "London", country: "UK", lat: 51.5074, lng: -0.1278, flag: "https://flagcdn.com/w20/gb.png" },
    { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, flag: "https://flagcdn.com/w20/jp.png" },
    { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, flag: "https://flagcdn.com/w20/au.png" },
    { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, flag: "https://flagcdn.com/w20/fr.png" }
  ]
}

export default function FlagMap() {
  const allLocations = [travelData.origin, ...travelData.destinations]
  const paths = [
    ...travelData.destinations.map(dest => [[travelData.origin.lat, travelData.origin.lng], [dest.lat, dest.lng]]),
  ]

  const createFlagIcon = (flagUrl) => L.divIcon({
    className: 'custom-flag-marker',
    html: `
      <div class="flag-container">
        <div class="flag-circle">
          <img src="${flagUrl}" alt="" class="flag-img" />
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  })

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="glass rounded-3xl p-4 max-w-6xl mx-auto shadow-2xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-soft-white to-cyan-blue bg-clip-text text-transparent mb-4">
          🌍 Circular Flag Network
        </h2>
        <p className="text-xl text-muted-gray max-w-2xl mx-auto">
          Thread-like connections + circular flag markers
        </p>
      </div>
      
      <div className="h-[400px] md:h-[600px] rounded-2xl overflow-hidden">
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Thin thread paths */}
          {paths.map((path, index) => (
            <Polyline
              key={`path-${index}`}
              positions={path}
              pathOptions={{
                color: '#4A90E2',
                weight: 1.5,
                opacity: 0.6,
                dashArray: '4, 4'
              }}
              className="leaflet-path-thread"
            />
          ))}
          
          {/* Circular flag markers */}
          {allLocations.map((loc, index) => (
            <Marker 
              key={index}
              position={[loc.lat, loc.lng]}
              icon={createFlagIcon(loc.flag)}
            >
              <Popup>
                <div className="p-4 min-w-[200px]">
                  <h3 className="font-bold text-xl mb-2">{loc.name}</h3>
                  <p className="text-lg">{loc.country}</p>
                  <img src={loc.flag} alt={loc.country} className="w-12 h-8 mx-auto mt-2 rounded shadow-lg" />
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </motion.div>
  )
}

