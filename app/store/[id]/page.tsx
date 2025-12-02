"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin } from "lucide-react"
import { sql, type Store, type StorePhoto } from "@/lib/neon"
import Image from "next/image"

export default function StoreDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [store, setStore] = useState<Store | null>(null)
  const [photos, setPhotos] = useState<StorePhoto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchStoreDetails(Number(params.id))
    }
  }, [params.id])

  const fetchStoreDetails = async (storeId: number) => {
    try {
      // 店舗情報を取得
      const storeData = await sql`SELECT * FROM stores WHERE id = ${storeId}`

      if (storeData.length === 0) {
        throw new Error("Store not found")
      }

      const store = storeData[0] as Store
      setStore(store)

      // 店舗写真を取得
      const photoData = await sql`SELECT * FROM store_photos WHERE store_name = ${store.store_name}`
      setPhotos(photoData as StorePhoto[])
    } catch (error) {
      console.error("Error fetching store details:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "健在":
        return "bg-blue-100 text-blue-800"
      case "面影あり":
        return "bg-yellow-100 text-yellow-800"
      case "面影なし":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">読み込み中...</div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">店舗が見つかりません</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2 mr-4">
              <ArrowLeft className="w-4 h-4" />
              戻る
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">店舗詳細</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{store.store_name}</CardTitle>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    緯度: {store.latitude}, 経度: {store.longitude}
                  </span>
                </div>
              </div>
              <Badge className={getStatusColor(store.status)}>{store.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">説明</h3>
              <p className="text-gray-700 leading-relaxed">{store.description}</p>
            </div>

            {photos.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">写真</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={photo.photo_url || "/placeholder.svg"}
                        alt={`${store.store_name}の写真`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
