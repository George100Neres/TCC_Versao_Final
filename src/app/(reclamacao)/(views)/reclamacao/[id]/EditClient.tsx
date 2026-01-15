 'use client'

import React, { useRef } from 'react'
import MapComponent, { MapComponentRef } from '@/shared/components/map'
import { FormComponent } from './form'

type Props = { id: string; lat?: number; lng?: number }

export default function EditClient({ id, lat = -12.963308366330674, lng = -38.500841214385076 }: Props) {
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
          lat={lat}
          lng={lng}
          width="100%"
          height="100%"
          onLocationSelect={(lat, lng) => {
            console.log('Localização selecionada:', lat, lng)
          }}
        />
      </div>
      {/* FORM */}
      <div className=''>
        <FormComponent editingId={id} emit={handleEmit} />
      </div>
    </div>
  )
}
