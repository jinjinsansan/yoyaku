/*
  # 予約テーブルの作成

  1. 新しいテーブル
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - 予約者
      - `counselor_id` (uuid, foreign key) - カウンセラー
      - `service_type` (text) - サービス種別（monthly/single）
      - `scheduled_at` (timestamp) - 予約日時
      - `status` (text) - 予約状態（pending/confirmed/completed/cancelled）
      - `amount` (integer) - 料金（円）
      - `notes` (text, optional) - 相談内容・メモ
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. セキュリティ
    - ユーザーは自分の予約のみ閲覧・作成可能
    - カウンセラーは自分宛の予約を閲覧・更新可能
*/

CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE service_type AS ENUM ('monthly', 'single');

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  counselor_id uuid REFERENCES counselors(id) ON DELETE CASCADE,
  service_type service_type NOT NULL,
  scheduled_at timestamptz NOT NULL,
  status booking_status DEFAULT 'pending',
  amount integer NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLSを有効化
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分の予約を閲覧可能
CREATE POLICY "Users can view own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- カウンセラーは自分宛の予約を閲覧可能
CREATE POLICY "Counselors can view their bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM counselors WHERE id = bookings.counselor_id
    )
  );

-- ユーザーは予約を作成可能
CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分の予約をキャンセル可能
CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- カウンセラーは自分宛の予約状態を更新可能
CREATE POLICY "Counselors can update their booking status"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM counselors WHERE id = bookings.counselor_id
    )
  );

-- 更新日時の自動更新
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();