'use client'
import MapComponent, { MapComponentRef } from '@/shared/components/map'
import { FormComponent } from './form'
import { useRef } from 'react'

export default function ReclamacaoForm() {
  const mapRef = useRef<MapComponentRef | null>(null)

  const handleEmit = (data: any) => {
    if (mapRef.current) {
      mapRef.current.setMarker(data.lat, data.lng)
    }
  }

  return (
    <div className="flex flex-col p-4 gap-4">
      {/* MAPA */}
      <div className='w-full h-96'>
        <MapComponent
          ref={mapRef}
          lat={-12.963308366330674}
          lng={-38.500841214385076}
          width="100%"
          height="100%"
          onLocationSelect={(lat, lng) => {
            console.log('Localização selecionada:', lat, lng)
          }}
        />
      </div>
      {/* FORM */}
      <div className=''>
        <FormComponent emit={handleEmit} />
      </div>
    </div>
  )
}
