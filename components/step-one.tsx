"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin } from "lucide-react"
import type { StepProps, GoogleMapsPrediction } from "@/types/booking"
import { useGoogleMaps } from "@/hooks/use-google-maps"

// Extend Window interface to include Google Maps
declare global {
  interface Window {
    google: any
  }
}

export default function StepOne({ formData, onUpdateFormData }: StepProps) {
  const [searchValue, setSearchValue] = useState(formData.address || "")
  const [predictions, setPredictions] = useState<GoogleMapsPrediction[]>([])
  const [showPredictions, setShowPredictions] = useState(false)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)
  const [autocompleteService, setAutocompleteService] = useState<any>(null)
  const [placesService, setPlacesService] = useState<any>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const addressInputRef = useRef<HTMLInputElement>(null)

  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyB_LDXpb58SXx4I4dp0UVhKb1mJGqkDn8w"
  const { isLoaded, loadError } = useGoogleMaps({
    apiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  })

  // Auto-focus the address input when component mounts
  useEffect(() => {
    if (addressInputRef.current) {
      addressInputRef.current.focus()
    }
  }, [])

  // Initialize map when Google Maps is loaded
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
        gestureHandling: "cooperative"
      }

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions)
      setMap(newMap)

      const autoCompleteService = new window.google.maps.places.AutocompleteService()
      const placesServiceInstance = new window.google.maps.places.PlacesService(newMap)

      setAutocompleteService(autoCompleteService)
      setPlacesService(placesServiceInstance)
    }
  }, [isLoaded, map])

  // Restore map location when there's an existing address
  useEffect(() => {
    if (formData.address && map && placesService && !marker) {
      const geocoder = new (window as any).google.maps.Geocoder()
      
      geocoder.geocode({ address: formData.address }, (results: any[], status: string) => {
        if (status === (window as any).google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location
          
          // Create marker for the existing address
          const newMarker = new (window as any).google.maps.Marker({
            position: location,
            map: map,
            title: formData.address,
          })
          setMarker(newMarker)

          // Update coordinates if not already set
          if (!formData.latitude || !formData.longitude) {
            onUpdateFormData("latitude", location.lat().toString())
            onUpdateFormData("longitude", location.lng().toString())
          }

          // Parse address components if not already set
          if (!formData.street || !formData.city || !formData.state || !formData.zipcode) {
            const addressComponents = parseAddressComponents(results[0])
            onUpdateFormData("street", addressComponents.street)
            onUpdateFormData("city", addressComponents.city)
            onUpdateFormData("state", addressComponents.state)
            onUpdateFormData("zipcode", addressComponents.zipcode)
          }

          // Center map on the location
          map.setCenter(location)
          map.setZoom(20)
        }
      })
    }
  }, [formData.address, map, placesService, marker, onUpdateFormData])

  // Cleanup marker on unmount
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

    autocompleteService.getPlacePredictions(request, (predictions: any[], status: string) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setPredictions(predictions.slice(0, 5))
        setShowPredictions(true)
      } else {
        setPredictions([])
        setShowPredictions(false)
      }
    })
  }

  const parseAddressComponents = (place: any) => {
    let street = ""
    let city = ""
    let state = ""
    let zipcode = ""

    if (place.address_components) {
      place.address_components.forEach((component: any) => {
        const types = component.types

        if (types.includes("street_number") || types.includes("route")) {
          street += component.long_name + " "
        }
        if (types.includes("locality")) {
          city = component.long_name
        }
        if (types.includes("administrative_area_level_1")) {
          state = component.short_name
        }
        if (types.includes("postal_code")) {
          zipcode = component.long_name
        }
      })
    }

    return { street: street.trim(), city, state, zipcode }
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
        onUpdateFormData("latitude", place.geometry.location.lat().toString())
        onUpdateFormData("longitude", place.geometry.location.lng().toString())
 
        map.setCenter(place.geometry.location)
        map.setZoom(20)

        setShowPredictions(false)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <MapPin className="mx-auto w-12 h-12 mb-4 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">What's your address?</h2>
        <p className="text-gray-600 mt-2">Search and select your location</p>
      </div>

      <div className="relative">
        <input
          ref={addressInputRef}
          type="text"
          value={searchValue}
          onChange={(e) => handleAddressSearch(e.target.value)}
          onFocus={() => searchValue && setShowPredictions(true)}
          placeholder="Enter your street address"
          className="w-full px-4 py-3 border-2 border-primary rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-lg"
          disabled={!isLoaded}
        />

        {showPredictions && predictions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {predictions.map((prediction) => (
              <div
                key={prediction.place_id}
                onClick={() => handleAddressSelect(prediction)}
                className="px-4 py-3 cursor-pointer border-b last:border-b-0 border-gray-100 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {prediction.structured_formatting.main_text}
                    </div>
                    <div className="text-xs text-gray-500">{prediction.structured_formatting.secondary_text}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg">
        <div ref={mapRef} className="w-full h-full bg-gray-200 flex items-center justify-center">
          {loadError ? (
            <div className="text-red-500 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p>Error loading map</p>
              <p className="text-sm">{loadError}</p>
            </div>
          ) : !isLoaded ? (
            <div className="text-gray-500 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p>Loading map...</p>
            </div>
          ) : null}
        </div>
      </div>

      {formData.address && (
        <div className="p-4 bg-primary/5 border border-primary/30 rounded-lg">
          <p className="text-sm text-primary">
            <MapPin className="inline w-4 h-4 mr-1" />
            Selected: {formData.address}
          </p>
        </div>
      )}
    </div>
  )
}
