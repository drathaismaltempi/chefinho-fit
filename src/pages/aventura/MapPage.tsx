import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMapStore } from '../../store/useMapStore'
import { usePointsStore } from '../../store/usePointsStore'
import { spawnFoodItems } from '../../services/foodSpawner'
import type { MapFoodItem } from '../../types'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { useNavigate } from 'react-router-dom'

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl: '', iconUrl: '', shadowUrl: '' })

function foodIcon(item: MapFoodItem) {
  return L.divIcon({
    className: '',
    html: `<div style="font-size:2rem;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));cursor:pointer;animation:bounce 1s infinite alternate;">${item.emoji}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  })
}

const MINI_CHALLENGES = [
  'Pule 5 vezes no lugar! 🦘',
  'Corra no lugar por 10 segundos! 🏃',
  'Dê 10 polichinelos! 💪',
  'Gire 3 vezes para a direita! 🌀',
  'Agache e levante 5 vezes! 🦵',
]

export function MapPage() {
  const navigate = useNavigate()
  const { food_items, setFoodItems, captureItem, player_lat, player_lng, setPosition } = useMapStore()
  const { addPoints } = usePointsStore()
  const [captured, setCaptured] = useState<MapFoodItem | null>(null)
  const [challenge, setChallenge] = useState<string | null>(null)
  const [pendingChaos, setPendingChaos] = useState<MapFoodItem | null>(null)
  const [gpsError, setGpsError] = useState(false)

  useEffect(() => {
    if (food_items.filter(f => !f.captured).length < 5) {
      setFoodItems(spawnFoodItems(player_lat, player_lng))
    }
    // Try GPS
    navigator.geolocation?.getCurrentPosition(
      pos => { setPosition(pos.coords.latitude, pos.coords.longitude) },
      () => setGpsError(true)
    )
  }, [])

  const handleCapture = (item: MapFoodItem) => {
    if (item.captured) return
    const card = captureItem(item.id)
    if (!card) return
    if (item.is_chaos) {
      const ch = MINI_CHALLENGES[Math.floor(Math.random() * MINI_CHALLENGES.length)]
      setChallenge(ch)
      setPendingChaos(item)
    } else {
      addPoints(5)
      setCaptured(item)
      setTimeout(() => setCaptured(null), 2000)
    }
  }

  const handleChallengeComplete = () => {
    addPoints(2)
    setChallenge(null)
    setPendingChaos(null)
  }

  const handleChallengeSkip = () => {
    addPoints(-3)
    setChallenge(null)
    setPendingChaos(null)
  }

  const active = food_items.filter(f => !f.captured)

  return (
    <div className="flex flex-col h-screen relative">
      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[player_lat, player_lng]}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
          {active.map(item => (
            <Marker key={item.id} position={[item.lat, item.lng]} icon={foodIcon(item)}
              eventHandlers={{ click: () => handleCapture(item) }}>
              <Popup>
                <div className="text-center">
                  <p className="text-2xl">{item.emoji}</p>
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.is_chaos ? '⚠️ Alimento do Caos' : '✨ Toque para capturar!'}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* GPS badge */}
        {gpsError && (
          <div className="absolute top-2 left-2 z-20 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-body">
            📍 Modo simulado (GPS indisponível)
          </div>
        )}

        {/* Capture animation */}
        <AnimatePresence>
          {captured && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
              initial={{ scale: 0, opacity: 1 }} animate={{ scale: 1.5, opacity: 0 }}
              exit={{}} transition={{ duration: 0.8 }}>
              <div className="flex flex-col items-center">
                <span className="text-6xl">{captured.emoji}</span>
                <span className="font-title font-bold text-verde text-xl mt-2">+5 pts!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Panel */}
      <div className="bg-white px-4 py-3 border-t border-gray-100 pb-24">
        <div className="flex items-center justify-between mb-2">
          <p className="font-title font-bold text-gray-800">🗺️ Mapa do Reino Vita</p>
          <Badge color="verde">{active.length} alimentos por aí</Badge>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setFoodItems(spawnFoodItems(player_lat, player_lng))}>
            🔄 Explorar
          </Button>
          <Button size="sm" onClick={() => navigate('/aventura/batalha')}>
            ⚔️ Batalhar
          </Button>
          <Button size="sm" variant="ghost" onClick={() => navigate('/aventura/cozinha')}>
            🍳 Cozinha
          </Button>
        </div>
      </div>

      {/* Mini Challenge Modal */}
      <Modal open={!!challenge} onClose={handleChallengeSkip} title="⚠️ Alimento do Caos!">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-5xl">{pendingChaos?.emoji ?? '🍟'}</p>
          <p className="font-body text-gray-700">O Chef do Caos apareceu! Complete o desafio para neutralizar:</p>
          <Card className="bg-amarelo border-0">
            <p className="font-title font-bold text-lg text-gray-800">{challenge}</p>
          </Card>
          <Button onClick={handleChallengeComplete} variant="secondary">Concluí o desafio! (+2 pts)</Button>
          <button onClick={handleChallengeSkip} className="text-xs text-gray-400 underline">Pular (–3 pts)</button>
        </div>
      </Modal>
    </div>
  )
}
