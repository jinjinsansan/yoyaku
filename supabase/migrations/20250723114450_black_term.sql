/*
  # 決済テーブルの作成

  1. 新しいテーブル
    - `payments`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, foreign key) - 予約との関連
      - `amount` (integer) - 決済金額（円）
      - `method` (text) - 決済方法（paypal/bank_transfer）
      - `status` (text) - 決済状態（pending/completed/failed/refunded）
      - `transaction_id` (text, optional) - 外部決済システムのトランザクションID
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. セキュリティ
    - ユーザーは自分の決済情報のみ閲覧可能
    - カウンセラーは自分に関連する決済を閲覧可能
*/

CREATE TYPE payment_method AS ENUM ('paypal', 'bank_transfer');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  method payment_method NOT NULL,
  status payment_status DEFAULT 'pending',
  transaction_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLSを有効化
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分の決済情報を閲覧可能
CREATE POLICY "Users can view own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM bookings WHERE id = payments.booking_id
    )
  );

-- カウンセラーは自分に関連する決済を閲覧可能
CREATE POLICY "Counselors can view their payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT c.user_id 
      FROM counselors c 
      JOIN bookings b ON c.id = b.counselor_id 
      WHERE b.id = payments.booking_id
    )
  );

-- システムのみ決済レコードを作成・更新可能（後でサービスロール用のポリシーを追加）
CREATE POLICY "Service role can manage payments"
  ON payments
  FOR ALL
  TO service_role
  USING (true);

-- 更新日時の自動更新
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();