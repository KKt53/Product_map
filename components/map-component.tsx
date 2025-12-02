"use client"

import { useEffect, useRef, useState } from "react"
import type { Store } from "@/lib/neon"

interface MapComponentProps {
  stores: Store[]
  onStoreClick: (store: Store) => void
}

export default function MapComponent({ stores, onStoreClick }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    // Leafletを動的にロード
    const loadLeaflet = async () => {
      if (typeof window !== "undefined") {
        const leaflet = await import("leaflet")
        setL(leaflet.default)

        // CSSも動的にロード
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }
    }

    loadLeaflet()
  }, [])

  useEffect(() => {
    if (L && mapRef.current && !map) {
      // 地図の初期化（東京中心）
      const newMap = L.map(mapRef.current).setView([35.6762, 139.6503], 11)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(newMap)

      setMap(newMap)
    }
  }, [L, map])

  // 状態に応じたマーカーアイコンを作成
  const createCustomIcon = (status: string) => {
    if (!L) return null

    let color = "#3B82F6" // デフォルト青色

    switch (status) {
      case "健在":
        color = "#3B82F6" // 青色
        break
      case "面影あり":
        color = "#EAB308" // 黄色
        break
      case "面影なし":
        color = "#EF4444" // 赤色
        break
    }

    // SVGマーカーを作成
    const svgIcon = `
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 41 12.5 41S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="${color}" stroke="#FFFFFF" strokeWidth="2"/>
        <circle cx="12.5" cy="12.5" r="6" fill="#FFFFFF"/>
      </svg>
    `

    return L.divIcon({
      html: svgIcon,
      className: "custom-marker",
      iconSize: [25, 41],
      iconAnchor: [12.5, 41],
      popupAnchor: [0, -41],
    })
  }

  useEffect(() => {
    if (map && L && stores.length > 0) {
      // 既存のマーカーをクリア
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer)
        }
      })

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            map.setView([latitude, longitude], 15)

            // 現在地マーカー（青丸など）
            L.circleMarker([latitude, longitude], {
              radius: 8,
              fillColor: "#007BFF",
              color: "#ffffff",
              weight: 2,
              opacity: 1,
              fillOpacity: 0.9,
            }).addTo(map).bindPopup("現在地")
          },
          (error) => {
            console.error("位置情報の取得に失敗しました:", error)
          }
        )
      }

      // 店舗マーカーを追加
      stores.forEach((store) => {
        const customIcon = createCustomIcon(store.status)

        const marker = L.marker([store.latitude, store.longitude], {
          icon: customIcon,
        })
          .addTo(map)
          .bindTooltip(`${store.store_name} (${store.status})`, {
            permanent: false,
            direction: "top",
            className: "custom-tooltip",
          })
          .on("click", () => onStoreClick(store))
      })
    }
  }, [map, L, stores, onStoreClick])

  return (
    <>
      <div ref={mapRef} className="w-full h-full min-h-[500px] rounded-lg border" style={{ zIndex: 1 }} />

      {/* 凡例を追加 */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span>健在</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span>面影あり</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span>面影なし</span>
        </div>
      </div>

      <style jsx global>{`
        .custom-marker {
          background: none !important;
          border: none !important;
        }
        
        .custom-tooltip {
          background: rgba(0, 0, 0, 0.8) !important;
          color: white !important;
          border: none !important;
          border-radius: 4px !important;
          padding: 4px 8px !important;
          font-size: 12px !important;
        }
        
        .custom-tooltip::before {
          border-top-color: rgba(0, 0, 0, 0.8) !important;
        }
      `}</style>
    </>
  )
}
