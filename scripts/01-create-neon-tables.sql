-- 店舗情報テーブル（データベース1）
DROP TABLE IF EXISTS stores;
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  store_name VARCHAR(255) NOT NULL,
  status VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 店舗写真テーブル（データベース2）
DROP TABLE IF EXISTS store_photos;
CREATE TABLE store_photos (
  id SERIAL PRIMARY KEY,
  store_name VARCHAR(255) NOT NULL,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスを作成
CREATE INDEX idx_stores_location ON stores(latitude, longitude);
CREATE INDEX idx_store_photos_name ON store_photos(store_name);

-- サンプルデータの挿入
INSERT INTO stores (latitude, longitude, store_name, status, description) VALUES
(35.6762, 139.6503, 'カフェ東京', '健在', '東京駅近くの素敵なカフェです。コーヒーと軽食を提供しています。'),
(35.6586, 139.7454, '渋谷レストラン', '健在', '渋谷の人気レストランです。イタリアン料理が自慢です。'),
(35.7090, 139.7319, '池袋ショップ', '面影あり', '池袋にあったショップです。建物は残っていますが営業していません。'),
(35.6895, 139.6917, '新宿カフェ', '健在', '新宿の落ち着いたカフェです。勉強や仕事にも最適です。'),
(35.6284, 139.7387, '恵比寿バー', '面影なし', '恵比寿にあったバーです。建物も取り壊されて跡形もありません。');

INSERT INTO store_photos (store_name, photo_url) VALUES
('カフェ東京', '/placeholder.svg?height=300&width=400&text=カフェ東京の外観'),
('カフェ東京', '/placeholder.svg?height=300&width=400&text=カフェ東京の内装'),
('渋谷レストラン', '/placeholder.svg?height=300&width=400&text=渋谷レストランの料理'),
('渋谷レストラン', '/placeholder.svg?height=300&width=400&text=渋谷レストランの店内'),
('池袋ショップ', '/placeholder.svg?height=300&width=400&text=池袋ショップの商品'),
('新宿カフェ', '/placeholder.svg?height=300&width=400&text=新宿カフェのコーヒー'),
('恵比寿バー', '/placeholder.svg?height=300&width=400&text=恵比寿バーのカウンター');
