/*
  # スケジュールテーブルの作成

  1. 新しいテーブル
    - `schedules`
      - `id` (uuid, primary key)
      - `counselor_id` (uuid, foreign key) - カウンセラー
      - `day_of_week` (integer) - 曜日（0=日曜日, 1=月曜日, ..., 6=土曜日）
      - `start_time` (time) - 開始時間
      - `end_time` (time) - 終了時間
      - `is_available` (boolean) - 予約可能かどうか
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. セキュリティ
    - 全ユーザーがスケジュールを閲覧可能
    - カウンセラーは自分のスケジュールのみ編集可能
*/

CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  counselor_id uuid REFERENCES counselors(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- RLSを有効化
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- 全ユーザーがスケジュールを閲覧可能
CREATE POLICY "Anyone can view schedules"
  ON schedules
  FOR SELECT
  TO authenticated
  USING (true);

-- カウンセラーは自分のスケジュールを管理可能
CREATE POLICY "Counselors can manage own schedules"
  ON schedules
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM counselors WHERE id = schedules.counselor_id
    )
  );

-- 更新日時の自動更新
CREATE TRIGGER update_schedules_updated_at
  BEFORE UPDATE ON schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();