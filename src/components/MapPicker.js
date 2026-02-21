'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

export default function MapPicker({ onLocationSelect }) {
    const mapRef = useRef(null)
    const markerRef = useRef(null)
    const [mapLoaded, setMapLoaded] = useState(false)
    const [error, setError] = useState(null)

    const initMap = () => {
        if (!window.google) return

        try {
            const defaultPos = { lat: 3.140853, lng: 101.693207 } // Kuala Lumpur default

            const map = new window.google.maps.Map(mapRef.current, {
                center: defaultPos,
                zoom: 13,
                disableDefaultUI: false,
                streetViewControl: false,
                mapTypeControl: false,
            })

            const marker = new window.google.maps.Marker({
                position: defaultPos,
                map: map,
                draggable: true,
                animation: window.google.maps.Animation.DROP,
            })
            markerRef.current = marker

            // Listen for drag end
            marker.addListener('dragend', () => {
                const pos = marker.getPosition()
                const lat = pos.lat()
                const lng = pos.lng()
                geocodePosition(lat, lng)
            })

            // Listen for map click
            map.addListener('click', (e) => {
                const lat = e.latLng.lat()
                const lng = e.latLng.lng()
                marker.setPosition({ lat, lng })
                geocodePosition(lat, lng)
            })

            // Try HTML5 geolocation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        }
                        map.setCenter(pos)
                        map.setZoom(17)
                        marker.setPosition(pos)
                        geocodePosition(pos.lat, pos.lng)
                    },
                    () => {
                        // Handle location error (use default)
                        geocodePosition(defaultPos.lat, defaultPos.lng)
                    }
                )
            } else {
                geocodePosition(defaultPos.lat, defaultPos.lng)
            }
        } catch (err) {
            console.error("Error initializing map:", err)
            setError("Failed to load map. Please try again.")
        }
    }

    const geocodePosition = (lat, lng) => {
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results[0]) {
                onLocationSelect({
                    lat,
                    lng,
                    address: results[0].formatted_address
                })
            } else {
                console.error('Geocoder failed due to: ' + status)
                // Fallback if geocoding fails, still pass lat/lng
                onLocationSelect({
                    lat,
                    lng,
                    address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
                })
            }
        })
    }

    return (
        <div className="w-full h-[300px] md:h-[400px] bg-gray-100 rounded-xl overflow-hidden relative">
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                onLoad={() => {
                    setMapLoaded(true)
                    initMap()
                }}
                strategy="lazyOnload"
            />
            <div ref={mapRef} className="w-full h-full" />
            {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
                    Loading Maps...
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500 p-4 text-center">
                    {error}
                </div>
            )}
        </div>
    )
}
