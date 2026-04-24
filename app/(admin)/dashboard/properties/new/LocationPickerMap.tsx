"use client"

import { useEffect } from "react"
import L from "leaflet"
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet"

type LocationPickerMapProps = {
  latitude: number
  longitude: number
  onChange: (coords: { latitude: number; longitude: number }) => void
}

const markerIcon = L.divIcon({
  className: "",
  html: '<div class="grid size-9 place-items-center rounded-full border-4 border-white bg-black text-white shadow-lg shadow-black/30"><div class="size-2 rounded-full bg-white"></div></div>',
  iconAnchor: [18, 36],
  iconSize: [36, 36],
})

function MapClickHandler({ onChange }: Pick<LocationPickerMapProps, "onChange">) {
  useMapEvents({
    click(event) {
      onChange({
        latitude: Number(event.latlng.lat.toFixed(6)),
        longitude: Number(event.latlng.lng.toFixed(6)),
      })
    },
  })

  return null
}

function MapRecenter({
  latitude,
  longitude,
}: Pick<LocationPickerMapProps, "latitude" | "longitude">) {
  const map = useMap()

  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom(), { animate: true })
  }, [latitude, longitude, map])

  return null
}

export function LocationPickerMap({
  latitude,
  longitude,
  onChange,
}: LocationPickerMapProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        scrollWheelZoom
        className="h-[360px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onChange={onChange} />
        <MapRecenter latitude={latitude} longitude={longitude} />
        <Marker
          draggable
          icon={markerIcon}
          position={[latitude, longitude]}
          eventHandlers={{
            dragend(event) {
              const marker = event.target
              const position = marker.getLatLng()

              onChange({
                latitude: Number(position.lat.toFixed(6)),
                longitude: Number(position.lng.toFixed(6)),
              })
            },
          }}
        />
      </MapContainer>
    </div>
  )
}
