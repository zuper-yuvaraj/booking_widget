"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Search, MapPinOff, Loader2, CheckCircle2 } from "lucide-react"
import type { StepProps, GoogleMapsPrediction } from "@/types/booking"
import { useGoogleMaps } from "@/hooks/use-google-maps"
import { SERVICE_AREA_WEBHOOK } from "@/configs"
import { useQueryParams } from "@/hooks/query-params.hooks"

declare global {
  interface Window { google: any }
}

const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

export default function StepOne({ formData, onUpdateFormData }: StepProps) {
  const [searchValue, setSearchValue]         = useState(formData.address || "")
  const [predictions, setPredictions]         = useState<GoogleMapsPrediction[]>([])
  const [showPredictions, setShowPredictions] = useState(false)
  const [map, setMap]                         = useState<any>(null)
  const [marker, setMarker]                   = useState<any>(null)
  const [autocompleteService, setAutocomplete] = useState<any>(null)
  const [placesService, setPlacesService]     = useState<any>(null)

  // Service-area check state
  const [isCheckingArea, setIsCheckingArea]   = useState(false)
  const [pendingAddress, setPendingAddress]   = useState("")   // address being verified
  const [outOfArea, setOutOfArea]             = useState(false)
  const [areaErrorMsg, setAreaErrorMsg]       = useState("")

  const mapRef          = useRef<HTMLDivElement>(null)
  const addressInputRef = useRef<HTMLInputElement>(null)

  const { isLoaded, loadError } = useGoogleMaps({ apiKey: GOOGLE_MAPS_API_KEY, libraries: ["places"] })
  const searchParams = useQueryParams()
  const COMPANY_UID  = searchParams.get("company_uid") || ""

  useEffect(() => { addressInputRef.current?.focus() }, [])

  // Init Google Maps
  useEffect(() => {
    if (isLoaded && !map && mapRef.current && window.google) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        zoom: 4, center: { lat: 39.8283, lng: -98.5795 },
        mapTypeId: "satellite", tilt: 0, heading: 0,
        disableDefaultUI: true, zoomControl: true,
        mapTypeControl: false, streetViewControl: false,
        fullscreenControl: false, gestureHandling: "cooperative",
      })
      setMap(newMap)
      setAutocomplete(new window.google.maps.places.AutocompleteService())
      setPlacesService(new window.google.maps.places.PlacesService(newMap))
    }
  }, [isLoaded, map])

  // Restore map pin when coming back to step 1
  useEffect(() => {
    if (formData.address && map && placesService && !marker) {
      const geocoder = new (window as any).google.maps.Geocoder()
      geocoder.geocode({ address: formData.address }, (results: any[], status: string) => {
        if (status === (window as any).google.maps.GeocoderStatus.OK && results?.[0]) {
          const loc = results[0].geometry.location
          setMarker(new (window as any).google.maps.Marker({ position: loc, map, title: formData.address }))
          map.setCenter(loc); map.setZoom(20)
        }
      })
    }
  }, [formData.address, map, placesService, marker, onUpdateFormData])

  useEffect(() => () => { marker?.setMap(null) }, [marker])

  /* â”€â”€ Autocomplete search â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const handleAddressSearch = (val: string) => {
    setSearchValue(val)
    if (!val.trim() || !autocompleteService) {
      setPredictions([]); setShowPredictions(false); return
    }
    autocompleteService.getPlacePredictions(
      { input: val, types: ["address"], componentRestrictions: { country: "us" } },
      (preds: any[], status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && preds) {
          setPredictions(preds.slice(0, 5)); setShowPredictions(true)
        } else { setPredictions([]); setShowPredictions(false) }
      }
    )
  }

  const parseAddressComponents = (place: any) => {
    let street = "", city = "", state = "", zipcode = ""
    place.address_components?.forEach((c: any) => {
      const t = c.types
      if (t.includes("street_number") || t.includes("route")) street += c.long_name + " "
      if (t.includes("locality"))                    city    = c.long_name
      if (t.includes("administrative_area_level_1")) state   = c.short_name
      if (t.includes("postal_code"))                 zipcode = c.long_name
    })
    return { street: street.trim(), city, state, zipcode }
  }

  /* â”€â”€ Service-area check â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  // Returns true if serviceable (or on network error to avoid blocking user)
  const checkServiceArea = async (
    address: string,
    latitude: string,
    longitude: string,
    zipcode: string,
  ): Promise<boolean> => {
    setIsCheckingArea(true)
    try {
      const res = await fetch(`${SERVICE_AREA_WEBHOOK}?company_uid=${COMPANY_UID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, latitude, longitude, zipcode, company_uid: COMPANY_UID }),
      })

      const data = await res.json().catch(() => ({}))

      // Primary success signal from the API
      const isSuccess = data?.type === "success" && !!data?.data?.matched_territory

      // Existing out-of-area fallbacks retained as safety net
      const isOutOfArea =
        !isSuccess && (
          data?.success === false ||
          data?.type === "out_of_area" ||
          data?.serviceable === false ||
          (typeof data?.message === "string" && /out.of.area|not.service|outside/i.test(data.message))
        )

      if (isOutOfArea || !isSuccess) {
        setAreaErrorMsg(data?.message || "")
        setOutOfArea(true)
        return false
      }

      // Extract team UIDs from matched territory teams array
      const teams: { team_uid: string }[] =
        data.data.matched_territory.territory.teams ?? []
      const teamUids = teams.map((t: { team_uid: string }) => t.team_uid).filter(Boolean)

      // Commit to formData BEFORE returning true
      onUpdateFormData("teamUids", teamUids)

      return true
    } catch {
      // Network error â€” allow the flow to continue
      return true
    } finally {
      setIsCheckingArea(false)
    }
  }

  /* â”€â”€ Address selection from dropdown â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const handleAddressSelect = (prediction: GoogleMapsPrediction) => {
    if (!placesService) return
    setShowPredictions(false)

    placesService.getDetails(
      { placeId: prediction.place_id, fields: ["geometry", "formatted_address", "address_components"] },
      async (place: any, status: string) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK) return

        // Update the map immediately for visual feedback
        marker?.setMap(null)
        const newMarker = new window.google.maps.Marker({
          position: place.geometry.location, map, title: place.formatted_address,
        })
        setMarker(newMarker)
        map.setCenter(place.geometry.location); map.setZoom(20)

        // Parse all fields locally â€” don't commit to formData yet
        const c   = parseAddressComponents(place)
        const lat = place.geometry.location.lat().toString()
        const lng = place.geometry.location.lng().toString()
        const addr = place.formatted_address

        setSearchValue(addr)
        setPendingAddress(addr)   // show the "Checkingâ€¦" badge

        // Run service-area check FIRST
        const serviceable = await checkServiceArea(addr, lat, lng, c.zipcode)

        if (serviceable) {
          // Only now commit to formData â€” this enables the Continue button
          onUpdateFormData("address",   addr)
          onUpdateFormData("street",    c.street)
          onUpdateFormData("city",      c.city)
          onUpdateFormData("state",     c.state)
          onUpdateFormData("zipcode",   c.zipcode)
          onUpdateFormData("latitude",  lat)
          onUpdateFormData("longitude", lng)
        } else {
          // Clear pending display
          setPendingAddress("")
        }
      }
    )
  }

  /* â”€â”€ Dismiss out-of-area modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const handleDismiss = () => {
    setOutOfArea(false)
    setAreaErrorMsg("")
    setPendingAddress("")
    setSearchValue("")
    marker?.setMap(null); setMarker(null)
    map?.setCenter({ lat: 39.8283, lng: -98.5795 }); map?.setZoom(4)
    setTimeout(() => addressInputRef.current?.focus(), 50)
  }

  /* â”€â”€ Derived display state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const showChecking  = isCheckingArea && !!pendingAddress
  const showConfirmed = !isCheckingArea && !!formData.address

  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     RENDER
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  return (
    <>
      {/* Out-of-area modal */}
      {outOfArea && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(10, 20, 15, 0.60)", backdropFilter: "blur(6px)" }}
        >
          <div
            className="max-w-sm w-full rounded-2xl p-7 text-center animate-scale-in"
            style={{ background: "white", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}
          >
            <div
              className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: "hsl(18, 65%, 96%)" }}
            >
              <MapPinOff className="w-8 h-8" style={{ color: "var(--brand-terra)" }} />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2" style={{ color: "hsl(220,15%,12%)" }}>
              Outside Our Service Area
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "hsl(220,10%,50%)" }}>
              {areaErrorMsg ||
                "Unfortunately, we don't currently service this location. Please try a different address."}
            </p>
            <button onClick={handleDismiss} className="btn-terra w-full py-3 rounded-full text-sm">
              Try a Different Address
            </button>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Header */}
        <div className="text-center mb-6">
          <div
            className="mx-auto w-14 h-14 mb-4 rounded-full flex items-center justify-center"
            style={{ background: "var(--brand-forest-light)" }}
          >
            <MapPin className="w-6 h-6" style={{ color: "var(--brand-forest)" }} />
          </div>
          <h2 className="font-heading text-2xl font-semibold" style={{ color: "hsl(220,15%,14%)" }}>
            What's your service address?
          </h2>
          <p className="text-sm mt-2" style={{ color: "hsl(220,10%,52%)" }}>
            We'll use this to find the right team for your area
          </p>
        </div>

        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            {isCheckingArea ? (
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--brand-forest)" }} />
            ) : (
              <Search className="w-4 h-4" style={{ color: "var(--brand-forest-mid)" }} />
            )}
          </div>
          <input
            ref={addressInputRef}
            type="text"
            value={searchValue}
            onChange={(e) => handleAddressSearch(e.target.value)}
            onFocus={() => searchValue && predictions.length > 0 && setShowPredictions(true)}
            placeholder="Enter your street address"
            disabled={!isLoaded || isCheckingArea}
            className="input-forest text-base"
            style={{ paddingLeft: "2.75rem" }}
          />

          {showPredictions && predictions.length > 0 && !isCheckingArea && (
            <div
              className="absolute z-20 w-full mt-2 rounded-xl overflow-hidden"
              style={{
                background: "white",
                border: "1.5px solid hsl(40, 20%, 88%)",
                boxShadow: "0 8px 24px rgba(46,96,78,0.12)",
              }}
            >
              {predictions.map((p) => (
                <div
                  key={p.place_id}
                  onClick={() => handleAddressSelect(p)}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
                  style={{ borderBottom: "1px solid hsl(40, 18%, 94%)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--brand-forest-light)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--brand-forest-mid)" }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "hsl(220,15%,14%)" }}>
                      {p.structured_formatting.main_text}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "hsl(220,10%,55%)" }}>
                      {p.structured_formatting.secondary_text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <div
          className="h-80 w-full rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 2px 12px rgba(46,96,78,0.10)" }}
        >
          <div
            ref={mapRef}
            className="w-full h-full flex items-center justify-center"
            style={{ background: "var(--brand-cream-dark)" }}
          >
            {loadError ? (
              <div className="text-center" style={{ color: "hsl(0,60%,52%)" }}>
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Error loading map</p>
              </div>
            ) : !isLoaded ? (
              <div className="text-center" style={{ color: "hsl(220,10%,60%)" }}>
                <div className="w-8 h-8 mx-auto mb-2 rounded-full skeleton" />
                <p className="text-sm">Loading mapâ€¦</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Status badge */}
        {showChecking && (
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
            style={{
              background: "hsl(45, 22%, 94%)",
              border: "1.5px solid hsl(40, 20%, 85%)",
            }}
          >
            <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" style={{ color: "var(--brand-forest)" }} />
            <div className="min-w-0">
              <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--brand-forest)" }}>
                Checking service areaâ€¦
              </p>
              <p className="text-xs truncate" style={{ color: "hsl(220,10%,52%)" }}>
                {pendingAddress}
              </p>
            </div>
          </div>
        )}

        {showConfirmed && (
          <div
            className="flex items-start gap-2.5 px-4 py-3 rounded-xl animate-scale-in"
            style={{
              background: "var(--brand-forest-light)",
              border: "1.5px solid hsl(158, 30%, 82%)",
            }}
          >
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--brand-forest)" }} />
            <div className="min-w-0">
              <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--brand-forest)" }}>
                Address confirmed â€” we service this area!
              </p>
              <p className="text-xs truncate" style={{ color: "var(--brand-forest-mid)" }}>
                {formData.address}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
