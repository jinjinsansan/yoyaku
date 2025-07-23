/*
  # チャット関連テーブルの作成

  1. 新しいテーブル
    - `chat_rooms` - チャットルーム
      - `id` (uuid, primary key)
      - `booking_id` (uuid, foreign key) - 予約との関連
      - `is_active` (boolean) - アクティブ状態
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `chat_messages` - チャットメッセージ
      - `id` (uuid, primary key)
      - `room_id` (uuid, foreign key) - チャットルーム
      - `sender_id` (uuid, foreign key) - 送信者
      - `message` (text) - メッセージ内容
      - `file_url` (text, optional) - 添付ファイルURL
      - `created_at` (timestamp)

  2. セキュリティ
    - チャット参加者のみアクセス可能
    - メッセージの送信者と受信者のみ閲覧可能
*/

CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  message text NOT NULL,
  file_url text,
  created_at timestamptz DEFAULT now()
);

-- RLSを有効化
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- チャットルーム: 予約の当事者のみアクセス可能
CREATE POLICY "Booking participants can access chat rooms"
  ON chat_rooms
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT b.user_id FROM bookings b WHERE b.id = chat_rooms.booking_id
      UNION
      SELECT c.user_id FROM bookings b 
      JOIN counselors c ON b.counselor_id = c.id 
      WHERE b.id = chat_rooms.booking_id
    )
  );

-- チャットメッセージ: ルーム参加者のみアクセス可能
CREATE POLICY "Room participants can access messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT b.user_id FROM chat_rooms cr
      JOIN bookings b ON cr.booking_id = b.id
      WHERE cr.id = chat_messages.room_id
      UNION
      SELECT c.user_id FROM chat_rooms cr
      JOIN bookings b ON cr.booking_id = b.id
      JOIN counselors c ON b.counselor_id = c.id
      WHERE cr.id = chat_messages.room_id
    )
  );

-- メッセージ送信: ルーム参加者のみ可能
CREATE POLICY "Room participants can send messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (
      SELECT b.user_id FROM chat_rooms cr
      JOIN bookings b ON cr.booking_id = b.id
      WHERE cr.id = chat_messages.room_id
      UNION
      SELECT c.user_id FROM chat_rooms cr
      JOIN bookings b ON cr.booking_id = b.id
      JOIN counselors c ON b.counselor_id = c.id
      WHERE cr.id = chat_messages.room_id
    )
  );

-- 更新日時の自動更新
CREATE TRIGGER update_chat_rooms_updated_at
  BEFORE UPDATE ON chat_rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();