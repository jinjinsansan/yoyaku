import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';

interface ReviewFormProps {
  counselorName: string;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  loading?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  counselorName,
  onSubmit,
  loading = false
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('評価を選択してください');
      return;
    }
    
    if (!comment.trim()) {
      setError('コメントを入力してください');
      return;
    }

    try {
      setError('');
      await onSubmit(rating, comment.trim());
      // フォームリセット
      setRating(0);
      setComment('');
    } catch (err: any) {
      setError(err.message || 'レビューの投稿に失敗しました');
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= (hoveredRating || rating);
      
      return (
        <button
          key={index}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none transition-colors"
        >
          <Star
            className={`w-8 h-8 ${
              isActive
                ? 'text-yellow-400 fill-current'
                : 'text-slate-300 hover:text-yellow-300'
            }`}
          />
        </button>
      );
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            {counselorName}さんのカウンセリングはいかがでしたか？
          </h3>
          <p className="text-slate-600">
            あなたの体験を他の方と共有してください
          </p>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* 星評価 */}
        <div className="text-center">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            評価を選択してください
          </label>
          <div className="flex justify-center space-x-1 mb-2">
            {renderStars()}
          </div>
          {rating > 0 && (
            <p className="text-sm text-slate-600">
              {rating === 1 && '不満'}
              {rating === 2 && 'やや不満'}
              {rating === 3 && '普通'}
              {rating === 4 && '満足'}
              {rating === 5 && '大変満足'}
            </p>
          )}
        </div>

        {/* コメント入力 */}
        <Textarea
          label="レビューコメント"
          placeholder="カウンセリングの感想や、他の方へのアドバイスなどをお聞かせください..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          helperText="具体的な感想を書いていただくと、他の方の参考になります"
        />

        {/* 送信ボタン */}
        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={rating === 0 || !comment.trim()}
        >
          <Send className="w-4 h-4 mr-2" />
          レビューを投稿
        </Button>
      </form>
    </Card>
  );
};