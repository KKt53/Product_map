import { neon } from "@neondatabase/serverless"

// Neon接続設定
const sql = neon(
  process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_qXk2vSjNpfl0@ep-twilight-sound-a1u8bwyp-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
)

export { sql }

export type Store = {
  id: number
  latitude: number
  longitude: number
  store_name: string
  status: "健在" | "面影あり" | "面影なし"
  description: string
}

export type StorePhoto = {
  id: number
  store_name: string
  photo_url: string
}
