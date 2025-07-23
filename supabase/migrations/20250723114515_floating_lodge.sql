/*
  # レビューテーブルの作成

  1. 新しいテーブル
    - `reviews`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - レビュー投稿者
      - `counselor_id` (uuid, foreign key) - 対象カウンセラー
      - `booking_id` (uuid, foreign key) - 対象予約
      - `rating` (integer) - 評価（1-5）
      - `comment` (text) - コメント
      - `created_at` (timestamp)

  2. セキュリティ
    - 全ユーザーがレビューを閲覧可能
    - ユーザーは完了した予約に対してのみレビュー投稿可能
    - 1つの予約に対して1つのレビューのみ
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  counselor_id uuid REFERENCES counselors(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(booking_id) -- 1つの予約に対して1つのレビューのみ
);

-- RLSを有効化
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 全ユーザーがレビューを閲覧可能
CREATE POLICY "Anyone can view reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

-- ユーザーは完了した自分の予約に対してレビュー投稿可能
CREATE POLICY "Users can create reviews for completed bookings"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = reviews.booking_id 
      AND user_id = auth.uid() 
      AND status = 'completed'
    )
  );

-- レビュー投稿後のカウンセラー評価更新トリガー
CREATE OR REPLACE FUNCTION update_counselor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE counselors SET
    rating = (
      SELECT AVG(rating)::decimal(3,2) 
      FROM reviews 
      WHERE counselor_id = NEW.counselor_id
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE counselor_id = NEW.counselor_id
    )
  WHERE id = NEW.counselor_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_counselor_rating_trigger
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_counselor_rating();