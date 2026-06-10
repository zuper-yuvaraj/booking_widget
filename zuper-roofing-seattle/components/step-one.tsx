"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, CheckCircle, AlertTriangle, Zap } from "lucide-react"
import type { StepProps, Territory, GoogleMapsPrediction } from "@/types/booking"
import { useGoogleMaps } from "@/hooks/use-google-maps"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any
  }
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

const TERRITORIES: Territory[] = [
  { id: "west-spokane", name: "West Spokane" },
  { id: "nw-spokane", name: "North West Spokane" },
  { id: "ne-spokane", name: "North East Spokane" },
  { id: "mukilteo", name: "Mukilteo" },
  { id: "downtown-spokane", name: "Downtown Spokane" },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseAddressComponents(place: any) {
  let street = ""
  let city = ""
  let state = ""
  let zipcode = ""

  if (place.address_components) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    place.address_components.forEach((component: any) => {
      const types: string[] = component.types
      if (types.includes("street_number") || types.includes("route")) {
        street += component.long_name + " "
      }
      if (types.includes("locality")) city = component.long_name
      if (types.includes("administrative_area_level_1")) state = component.short_name
      if (types.includes("postal_code")) zipcode = component.long_name
    })
  }

  return { street: street.trim(), city, state, zipcode }
}

export default function StepOne({
  formData,
  onUpdateFormData,
  serviceAreaStatus = "idle",
  onCheckServiceArea,
}: StepProps) {
  const [searchValue, setSearchValue] = useState(formData.address || "")
  const [predictions, setPredictions] = useState<GoogleMapsPrediction[]>([])
  const [showPredictions, setShowPredictions] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [marker, setMarker] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [autocompleteService, setAutocompleteService] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [placesService, setPlacesService] = useState<any>(null)

  const mapRef = useRef<HTMLDivElement>(null)
  const addressInputRef = useRef<HTMLInputElement>(null)

  const { isLoaded, loadError } = useGoogleMaps({
    apiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  })

  useEffect(() => {
    addressInputRef.current?.focus()
  }, [])

  // Initialize map and Places services once Google Maps is loaded
  useEffect(() => {
    if (!isLoaded || map || !mapRef.current || !window.google) return

    const newMap = new window.google.maps.Map(mapRef.current, {
      zoom: 10,
      center: { lat: 47.6062, lng: -122.3321 },
      mapTypeId: "satellite",
      tilt: 0,
      heading: 0,
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      gestureHandling: "cooperative",
    })

    setMap(newMap)
    setAutocompleteService(new window.google.maps.places.AutocompleteService())
    setPlacesService(new window.google.maps.places.PlacesService(newMap))
  }, [isLoaded, map])

  // Restore map location when navigating back to this step
  useEffect(() => {
    if (!formData.address || !map || !placesService || marker) return

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address: formData.address }, (results: any[], status: string) => {
      if (status === window.google.maps.GeocoderStatus.OK && results?.[0]) {
        const location = results[0].geometry.location
        const newMarker = new window.google.maps.Marker({
          position: location,
          map,
          title: formData.address,
        })
        setMarker(newMarker)
        map.setCenter(location)
        map.setZoom(20)
      }
    })
  }, [formData.address, map, placesService, marker])

  // Cleanup marker on unmount
  useEffect(() => {
    return () => { if (marker) marker.setMap(null) }
  }, [marker])

  const handleAddressSearch = (value: string) => {
    setSearchValue(value)
    if (!value.trim() || !autocompleteService) {
      setPredictions([])
      setShowPredictions(false)
      return
    }
    autocompleteService.getPlacePredictions(
      { input: value, types: ["address"], componentRestrictions: { country: "us" } },
      (results: GoogleMapsPrediction[], status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          setPredictions(results.slice(0, 5))
          setShowPredictions(true)
        } else {
          setPredictions([])
          setShowPredictions(false)
        }
      }
    )
  }

  const handleAddressSelect = (prediction: GoogleMapsPrediction) => {
    if (!placesService) return
    placesService.getDetails(
      { placeId: prediction.place_id, fields: ["geometry", "formatted_address", "address_components"] },
      (place: any, status: string) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK) return

        if (marker) marker.setMap(null)
        const newMarker = new window.google.maps.Marker({
          position: place.geometry.location,
          map,
          title: place.formatted_address,
        })
        setMarker(newMarker)

        const { street, city, state, zipcode } = parseAddressComponents(place)
        const lat = place.geometry.location.lat().toString()
        const lng = place.geometry.location.lng().toString()

        setSearchValue(place.formatted_address)
        setShowPredictions(false)
        onUpdateFormData("address", place.formatted_address)
        onUpdateFormData("street", street)
        onUpdateFormData("city", city)
        onUpdateFormData("state", state)
        onUpdateFormData("zipcode", zipcode)
        onUpdateFormData("latitude", lat)
        onUpdateFormData("longitude", lng)

        map.setCenter(place.geometry.location)
        map.setZoom(20)

        if (onCheckServiceArea) {
          onCheckServiceArea(place.formatted_address, lat, lng, zipcode)
        }
      }
    )
  }

  return (
    <div>

      {/* HERO BANNER */}
      <div className="bg-gradient-to-br from-navy-dark via-navy to-navy-light px-6 pt-10 pb-16">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange rounded-full mb-5 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Get Your Free Roof Inspection
          </h1>
          <p className="text-slate-300 mb-6">
            Serving Seattle and surrounding areas â€” licensed, insured, and 5-star rated.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Licensed & Insured", "5-Star Rated", "Free Estimates"].map((badge) => (
              <div key={badge} className="flex items-center gap-1.5 text-sm text-white/90">
                <div className="w-4 h-4 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 -mt-8 space-y-6 max-w-3xl mx-auto">

        {/* ADDRESS CARD */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
          <label className="block text-sm font-semibold text-navy mb-3">
            Enter Your Property Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              ref={addressInputRef}
              type="text"
              value={searchValue}
              onChange={(e) => handleAddressSearch(e.target.value)}
              onFocus={() => predictions.length > 0 && setShowPredictions(true)}
              onBlur={() => setTimeout(() => setShowPredictions(false), 150)}
              placeholder="123 Main St, Seattle, WA"
              disabled={!isLoaded}
              className="w-full pl-10 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20 text-base transition-colors disabled:opacity-60"
            />

            {showPredictions && predictions.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                {predictions.map((prediction) => (
                  <div
                    key={prediction.place_id}
                    onMouseDown={() => handleAddressSelect(prediction)}
                    className="flex items-start gap-3 px-4 py-3 cursor-pointer border-b last:border-b-0 border-slate-50 hover:bg-orange/5 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-navy">
                        {prediction.structured_formatting.main_text}
                      </div>
                      <div className="text-xs text-slate-500">
                        {prediction.structured_formatting.secondary_text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ADDRESS SELECTED CHIP */}
          {formData.address && serviceAreaStatus !== "checking" && (
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
              <MapPin className="w-4 h-4 text-orange flex-shrink-0" />
              <span className="truncate">{formData.address}</span>
            </div>
          )}

          {/* SERVICE AREA FEEDBACK */}
          {serviceAreaStatus === "checking" && (
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2.5">
              <svg className="w-4 h-4 animate-spin text-orange flex-shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Checking coverage in your area...
            </div>
          )}

          {serviceAreaStatus === "serviced" && (
            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              Great news! We service your area.
            </div>
          )}

          {serviceAreaStatus === "not_serviced" && (
            <div className="mt-3 flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-3">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-medium">We don&apos;t currently service your area.</p>
                <p className="mt-0.5 text-amber-700">
                  We serve the greater Seattle area.{" "}
                  <a href="tel:+12065550000" className="underline font-medium hover:text-amber-900">
                    Call us at (206) 555-0000
                  </a>{" "}
                  to discuss your options.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* MAP */}
        <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 h-64">
          <div ref={mapRef} className="w-full h-full bg-slate-100 flex items-center justify-center">
            {loadError ? (
              <div className="text-red-500 text-center text-sm">
                <MapPin className="w-6 h-6 mx-auto mb-1" />
                Error loading map
              </div>
            ) : !isLoaded ? (
              <div className="text-slate-400 text-center text-sm">
                <MapPin className="w-6 h-6 mx-auto mb-1 animate-pulse" />
                Loading map...
              </div>
            ) : null}
          </div>
        </div>

        {/* AREAS WE SERVE */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-navy">Areas We Serve</h2>
            <div className="flex-1 h-px bg-orange/30" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TERRITORIES.map((territory) => (
              <div
                key={territory.id}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-orange/40 hover:shadow-sm transition-all"
              >
                <MapPin className="w-4 h-4 text-orange flex-shrink-0" />
                <span className="text-sm font-medium text-navy truncate">{territory.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* INSTANT ESTIMATOR COMING SOON */}
        <div className="relative bg-gradient-to-r from-orange/10 to-amber-50 border border-orange/30 rounded-2xl p-6 overflow-hidden">
          <span className="absolute top-3 right-3 bg-orange text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Coming Soon
          </span>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-orange/20 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-orange" />
            </div>
            <div>
              <h3 className="font-bold text-navy text-lg mb-1">Instant Roof Estimator</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Skip the guesswork: a roof estimate range. Fast, free, and no pushy follow-ups.
              </p>
            </div>
          </div>
        </div>

        <div className="pb-2" />
      </div>
    </div>
  )
}
