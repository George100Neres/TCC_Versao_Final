'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'

interface MapComponentProps {
  lat?: number
  lng?: number
  width?: number | string
  height?: number | string
  zoom?: number
  onLocationSelect?: (lat: number, lng: number) => void
  className?: string
}

export interface MapComponentRef {
  setMarker: (lat: number, lng: number) => void
  getMap: () => any
}

const MapComponent = forwardRef<MapComponentRef, MapComponentProps>(({
  lat = -12.963308366330674, // Salvador, BA como padrão
  lng = -38.500841214385076,
  width = 500,
  height = 500,
  zoom = 13,
  onLocationSelect,
  className = '',
}, ref) => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<any>(null)
  const LRef = useRef<any>(null)

  useImperativeHandle(ref, () => ({
    setMarker: (lat: number, lng: number) => {
      setPointOnMap(lat, lng)
    },
    getMap: () => mapInstanceRef.current
  }))

  const setPointOnMap = (lat: number, lng: number) => {
    if (!mapInstanceRef.current || !LRef.current) return

    // Remove marcadores anteriores
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof LRef.current.Marker) {
        mapInstanceRef.current.removeLayer(layer)
      }
    })

    // Define nova posição e adiciona marcador
    mapInstanceRef.current.setView([lat, lng], 20)
    LRef.current.marker([lat, lng]).addTo(mapInstanceRef.current)
  }

  useEffect(() => {
    let mounted = true
    if (!mapRef.current) return

    ;(async () => {
      try {
        // Importações dinâmicas do Leaflet
        const Lmod = await import('leaflet')
        LRef.current = Lmod.default ?? Lmod

        const markerIcon2x = (await import('leaflet/dist/images/marker-icon-2x.png')).default
        const markerIcon = (await import('leaflet/dist/images/marker-icon.png')).default
        const markerShadow = (await import('leaflet/dist/images/marker-shadow.png')).default

        if (!mounted || mapInstanceRef.current) return

        // Configurar ícones do marcador
        LRef.current.Icon.Default.mergeOptions({
          iconRetinaUrl: markerIcon2x,
          iconUrl: markerIcon,
          shadowUrl: markerShadow
        })

        // Criar mapa
        const map = LRef.current.map(mapRef.current!).setView([lat, lng], zoom)

        // Adicionar camada de tiles
        LRef.current.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)

        // Adicionar marcador inicial
        LRef.current.marker([lat, lng]).addTo(map)

        // Configurar evento de clique
        map.on('click', (e: any) => {
          const lat = Number(e.latlng.lat)
          const lng = Number(e.latlng.lng)

          // Remove marcadores anteriores
          map.eachLayer((layer: any) => {
            if (layer instanceof LRef.current.Marker) {
              map.removeLayer(layer)
            }
          })

          // Adiciona novo marcador
          LRef.current.marker([lat, lng]).addTo(map)

          // Callback para componente pai
          if (onLocationSelect) {
            onLocationSelect(lat, lng)
          }
        })

        mapInstanceRef.current = map
      } catch (error) {
        console.error('Erro ao carregar mapa:', error)
      }
    })()

    return () => {
      mounted = false
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [lat, lng, zoom, onLocationSelect])

  // useEffect para redimensionar o mapa quando o container muda
  useEffect(() => {
    if (mapInstanceRef.current) {
      // Pequeno delay para garantir que o DOM foi atualizado
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize()
      }, 100)
    }
  }, [width, height])

  return (
    <div
      className={className}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      <div className="w-full h-full rounded-md overflow-hidden border border-gray-200">
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </div>
  )
})

MapComponent.displayName = 'MapComponent'

export default MapComponent
