"use client"

import { useState, useEffect, useCallback } from "react"

interface UseGoogleMapsProps {
  apiKey: string
  libraries?: string[]
}

export function useGoogleMaps({ apiKey, libraries = ["places"] }: UseGoogleMapsProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const loadGoogleMaps = useCallback(() => {
    // Check if already loaded
    if ((window as any).google && (window as any).google.maps) {
      setIsLoaded(true)
      return Promise.resolve()
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      return new Promise<void>((resolve, reject) => {
        const checkLoaded = () => {
          if ((window as any).google && (window as any).google.maps) {
            setIsLoaded(true)
            resolve()
          } else {
            setTimeout(checkLoaded, 100)
          }
        }
        checkLoaded()
      })
    }

    // Load new script
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement("script")
      const callbackName = `googleMapsCallback_${Date.now()}`

      // Create callback
      ;(window as any)[callbackName] = () => {
        setIsLoaded(true)
        delete (window as any)[callbackName]
        resolve()
      }

      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(",")}&callback=${callbackName}`
      script.async = true
      script.defer = true

      script.onerror = () => {
        setLoadError("Failed to load Google Maps")
        delete (window as any)[callbackName]
        reject(new Error("Failed to load Google Maps"))
      }

      document.head.appendChild(script)
    })
  }, [apiKey, libraries])

  useEffect(() => {
    if (apiKey && apiKey !== "YOUR_API_KEY_HERE") {
      loadGoogleMaps().catch((error) => {
        console.error("Error loading Google Maps:", error)
        setLoadError(error.message)
      })
    }
  }, [apiKey, loadGoogleMaps])

  return { isLoaded, loadError, loadGoogleMaps }
}
