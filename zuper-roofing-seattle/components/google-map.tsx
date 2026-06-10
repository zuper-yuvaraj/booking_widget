"use client"

import { useEffect, useRef, useState } from "react"

interface Props {
  lat?: number
  lng?: number
}

const DEFAULT_LAT = 47.6062
const DEFAULT_LNG = -122.3321

export default function GoogleMap({ lat, lng }: Props) {
  const divRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null)
  const [ready, setReady] = useState(false)

  const hasPin = lat !== undefined && lng !== undefined
  const centerLat = lat ?? DEFAULT_LAT
  const centerLng = lng ?? DEFAULT_LNG

  useEffect(() => {
    const g = (window as any).google
    if (g?.maps) { setReady(true); return }

    const existing = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existing) {
      const t = setInterval(() => {
        if ((window as any).google?.maps) { clearInterval(t); setReady(true) }
      }, 100)
      return () => clearInterval(t)
    }

    const cb = `_gmReady_${Date.now()}`
    ;(window as any)[cb] = () => { delete (window as any)[cb]; setReady(true) }
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}&callback=${cb}`
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!ready || !divRef.current) return
    const gMaps = (window as any).google.maps

    if (!mapRef.current) {
      mapRef.current = new gMaps.Map(divRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom: hasPin ? 18 : 10,
        mapTypeId: hasPin ? "satellite" : "roadmap",
      })
    } else {
      mapRef.current.panTo({ lat: centerLat, lng: centerLng })
      mapRef.current.setZoom(hasPin ? 18 : 10)
      mapRef.current.setMapTypeId(hasPin ? "satellite" : "roadmap")
    }

    if (hasPin) {
      if (markerRef.current) {
        markerRef.current.setPosition({ lat: centerLat, lng: centerLng })
      } else {
        markerRef.current = new gMaps.Marker({
          position: { lat: centerLat, lng: centerLng },
          map: mapRef.current,
        })
      }
    } else if (markerRef.current) {
      markerRef.current.setMap(null)
      markerRef.current = null
    }
  }, [ready, centerLat, centerLng, hasPin])

  return <div ref={divRef} className="w-full h-full" />
}
