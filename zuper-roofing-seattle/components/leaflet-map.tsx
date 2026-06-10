"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix Leaflet's broken default icon paths in bundled environments
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const ESRI_SATELLITE =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lng], 18, { duration: 1.2 })
  }, [lat, lng, map])
  return null
}

interface LeafletMapProps {
  lat?: number
  lng?: number
}

export default function LeafletMap({ lat, lng }: LeafletMapProps) {
  const hasLocation = lat !== undefined && lng !== undefined
  return (
    <MapContainer
      center={hasLocation ? [lat, lng] : [47.6062, -122.3321]}
      zoom={hasLocation ? 18 : 10}
      style={{ width: "100%", height: "100%" }}
      zoomControl
      attributionControl={false}
      scrollWheelZoom={false}
    >
      <TileLayer url={ESRI_SATELLITE} />
      {hasLocation && (
        <>
          <Marker position={[lat, lng]} />
          <FlyTo lat={lat} lng={lng} />
        </>
      )}
    </MapContainer>
  )
}
