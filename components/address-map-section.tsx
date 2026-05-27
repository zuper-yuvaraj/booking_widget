"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin } from "lucide-react"
import type { FormData, GoogleMapsPrediction } from "@/types/booking"
import { useGoogleMaps } from "@/hooks/use-google-maps"

declare global {
  interface Window {
    google: any
  }
}

interface AddressMapSectionProps {
  address: string
  street: string
  city: string
  state: string
  zipcode: string
  latitude: string
  longitude: string
  onUpdateFormData: (field: keyof FormData, value: string) => void
}

const inputClass =
  "w-full px-3 py-2.5 rounded-lg bg-[#3d5c4d] border border-[#4a6b5a] text-[#fbfbe1] placeholder:text-[#fbfbe1]/50 focus:outline-none focus:ring-2 focus:ring-[#fbfbe1]/30 font-body text-sm"

export default function AddressMapSection({
  address,
  street,
  city,
  state,
  zipcode,
  latitude,
  longitude,
  onUpdateFormData,
}: AddressMapSectionProps) {
  const [searchValue, setSearchValue] = useState(address || "")
  const [predictions, setPredictions] = useState<GoogleMapsPrediction[]>([])
  const [showPredictions, setShowPredictions] = useState(false)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)
  const [autocompleteService, setAutocompleteService] = useState<any>(null)
  const [placesService, setPlacesService] = useState<any>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const addressInputRef = useRef<HTMLInputElement>(null)

  const GOOGLE_MAPS_API_KEY =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    "AIzaSyB_LDXpb58SXx4I4dp0UVhKb1mJGqkDn8w"
  const { isLoaded, loadError } = useGoogleMaps({
    apiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  })

  useEffect(() => {
    setSearchValue(address || "")
  }, [address])

  useEffect(() => {
    if (isLoaded && !map && mapRef.current && window.google) {
      const mapOptions = {
        zoom: 4,
        center: { lat: 39.8283, lng: -98.5795 },
        mapTypeId: "satellite",
        tilt: 0,
        heading: 0,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: "cooperative",
      }

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions)
      setMap(newMap)

      const autoCompleteService =
        new window.google.maps.places.AutocompleteService()
      const placesServiceInstance = new window.google.maps.places.PlacesService(
        newMap
      )

      setAutocompleteService(autoCompleteService)
      setPlacesService(placesServiceInstance)
    }
  }, [isLoaded, map])

  useEffect(() => {
    if (address && map && placesService && !marker) {
      const geocoder = new window.google.maps.Geocoder()

      geocoder.geocode({ address }, (results: any[], status: string) => {
        if (
          status === window.google.maps.GeocoderStatus.OK &&
          results &&
          results[0]
        ) {
          const location = results[0].geometry.location

          const newMarker = new window.google.maps.Marker({
            position: location,
            map: map,
            title: address,
          })
          setMarker(newMarker)

          if (!latitude || !longitude) {
            onUpdateFormData("latitude", location.lat().toString())
            onUpdateFormData("longitude", location.lng().toString())
          }

          if (!street || !city || !state || !zipcode) {
            const addressComponents = parseAddressComponents(results[0])
            onUpdateFormData("street", addressComponents.street)
            onUpdateFormData("city", addressComponents.city)
            onUpdateFormData("state", addressComponents.state)
            onUpdateFormData("zipcode", addressComponents.zipcode)
          }

          map.setCenter(location)
          map.setZoom(20)
        }
      })
    }
  }, [
    address,
    map,
    placesService,
    marker,
    latitude,
    longitude,
    street,
    city,
    state,
    zipcode,
    onUpdateFormData,
  ])

  useEffect(() => {
    return () => {
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [marker])

  const handleAddressSearch = (inputValue: string) => {
    setSearchValue(inputValue)

    if (!inputValue.trim() || !autocompleteService) {
      setPredictions([])
      setShowPredictions(false)
      return
    }

    const request = {
      input: inputValue,
      types: ["address"],
      componentRestrictions: { country: "us" },
    }

    autocompleteService.getPlacePredictions(
      request,
      (preds: any[], status: string) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          preds
        ) {
          setPredictions(preds.slice(0, 5))
          setShowPredictions(true)
        } else {
          setPredictions([])
          setShowPredictions(false)
        }
      }
    )
  }

  const parseAddressComponents = (place: any) => {
    let streetVal = ""
    let cityVal = ""
    let stateVal = ""
    let zipcodeVal = ""

    if (place.address_components) {
      place.address_components.forEach((component: any) => {
        const types = component.types

        if (types.includes("street_number") || types.includes("route")) {
          streetVal += component.long_name + " "
        }
        if (types.includes("locality")) {
          cityVal = component.long_name
        }
        if (types.includes("administrative_area_level_1")) {
          stateVal = component.short_name
        }
        if (types.includes("postal_code")) {
          zipcodeVal = component.long_name
        }
      })
    }

    return {
      street: streetVal.trim(),
      city: cityVal,
      state: stateVal,
      zipcode: zipcodeVal,
    }
  }

  const handleAddressSelect = (prediction: GoogleMapsPrediction) => {
    if (!placesService) return

    const request = {
      placeId: prediction.place_id,
      fields: ["geometry", "formatted_address", "address_components"],
    }

    placesService.getDetails(request, (place: any, status: string) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        if (marker) {
          marker.setMap(null)
        }

        const newMarker = new window.google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: place.formatted_address,
        })
        setMarker(newMarker)

        const addressComponents = parseAddressComponents(place)

        setSearchValue(place.formatted_address)
        onUpdateFormData("address", place.formatted_address)
        onUpdateFormData("street", addressComponents.street)
        onUpdateFormData("city", addressComponents.city)
        onUpdateFormData("state", addressComponents.state)
        onUpdateFormData("zipcode", addressComponents.zipcode)
        onUpdateFormData(
          "latitude",
          place.geometry.location.lat().toString()
        )
        onUpdateFormData(
          "longitude",
          place.geometry.location.lng().toString()
        )

        map.setCenter(place.geometry.location)
        map.setZoom(20)

        setShowPredictions(false)
      }
    })
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          ref={addressInputRef}
          type="text"
          value={searchValue}
          onChange={(e) => handleAddressSearch(e.target.value)}
          onFocus={() => searchValue && setShowPredictions(true)}
          placeholder="Enter your street address"
          className={inputClass}
          disabled={!isLoaded}
        />

        {showPredictions && predictions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-[#3d5c4d] border border-[#4a6b5a] rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {predictions.map((prediction) => (
              <div
                key={prediction.place_id}
                onClick={() => handleAddressSelect(prediction)}
                className="px-4 py-3 cursor-pointer border-b last:border-b-0 border-[#4a6b5a] hover:bg-[#4a6b5a] transition-colors"
              >
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-[#fbfbe1]/60 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-body text-[#fbfbe1]">
                      {prediction.structured_formatting.main_text}
                    </div>
                    <div className="text-xs font-body text-[#fbfbe1]/70">
                      {prediction.structured_formatting.secondary_text}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-64 w-full rounded-lg overflow-hidden border border-[#4a6b5a]">
        <div
          ref={mapRef}
          className="w-full h-full bg-[#3d5c4d] flex items-center justify-center"
        >
          {loadError ? (
            <div className="text-[#fbfbe1]/80 text-center font-body text-sm">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p>Error loading map</p>
            </div>
          ) : !isLoaded ? (
            <div className="text-[#fbfbe1]/70 text-center font-body text-sm">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p>Loading map...</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
