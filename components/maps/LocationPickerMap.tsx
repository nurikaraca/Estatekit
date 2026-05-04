"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"

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

export function LocationPickerMap({
  latitude,
  longitude,
  onChange,
}: LocationPickerMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const onChangeRef = useRef(onChange)
  const initialLatitudeRef = useRef(latitude)
  const initialLongitudeRef = useRef(longitude)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return
    }

    const map = L.map(containerRef.current, {
      center: [initialLatitudeRef.current, initialLongitudeRef.current],
      scrollWheelZoom: true,
      zoom: 14,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    const marker = L.marker(
      [initialLatitudeRef.current, initialLongitudeRef.current],
      {
        draggable: true,
        icon: markerIcon,
      }
    ).addTo(map)

    map.on("click", (event) => {
      onChangeRef.current({
        latitude: Number(event.latlng.lat.toFixed(6)),
        longitude: Number(event.latlng.lng.toFixed(6)),
      })
    })

    marker.on("dragend", () => {
      const position = marker.getLatLng()

      onChangeRef.current({
        latitude: Number(position.lat.toFixed(6)),
        longitude: Number(position.lng.toFixed(6)),
      })
    })

    mapRef.current = map
    markerRef.current = marker

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const marker = markerRef.current

    if (!map || !marker) {
      return
    }

    const position = L.latLng(latitude, longitude)
    marker.setLatLng(position)
    map.setView(position, map.getZoom(), { animate: true })
  }, [latitude, longitude])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
      <div ref={containerRef} className="h-[360px] w-full" />
    </div>
  )
}
