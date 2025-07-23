/*
  # カウンセラーテーブルの作成

  1. 新しいテーブル
    - `counselors`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - usersテーブルとの関連
      - `profile_image` (text, optional) - プロフィール画像URL
      - `bio` (text) - 自己紹介
      - `specialties` (text array) - 専門分野
      - `profile_url` (text, optional) - 個人サイトURL
      - `hourly_rate` (integer) - 時給（円）
      - `is_active` (boolean) - アクティブ状態
      - `rating` (decimal) - 評価平均
      - `review_count` (integer) - レビュー数
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. セキュリティ
    - RLSを有効化
    - カウンセラーは自分のデータを編集可能
    - 一般ユーザーはアクティブなカウンセラーのみ閲覧可能
*/

CREATE TABLE IF NOT EXISTS counselors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  profile_image text,
  bio text NOT NULL DEFAULT '',
  specialties text[] DEFAULT '{}',
  profile_url text,
  hourly_rate integer NOT NULL DEFAULT 11000,
  is_active boolean DEFAULT true,
  rating decimal(3,2) DEFAULT 0.00,
  review_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLSを有効化
ALTER TABLE counselors ENABLE ROW LEVEL SECURITY;

-- 全ユーザーがアクティブなカウンセラーを閲覧可能
CREATE POLICY "Anyone can view active counselors"
  ON counselors
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- カウンセラーは自分のデータを編集可能
CREATE POLICY "Counselors can update own data"
  ON counselors
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- 管理者のみカウンセラーを作成可能（後で管理者ロールを追加）
CREATE POLICY "Authenticated users can insert counselor data"
  ON counselors
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 更新日時の自動更新
CREATE TRIGGER update_counselors_updated_at
  BEFORE UPDATE ON counselors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();