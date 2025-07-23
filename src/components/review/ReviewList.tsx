import React from 'react';
import { Star, MessageSquare, Loader2 } from 'lucide-react';
import { ReviewCard } from './ReviewCard';
import { Card } from '../ui/Card';
import { Review } from '../../types';

interface ReviewListProps {
  reviews: Review[];
  loading?: boolean;
  error?: string | null;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto mb-2" />
          <p className="text-slate-600">レビューを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center py-8">
        <MessageSquare className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          レビューの読み込みに失敗しました
        </h3>
        <p className="text-slate-600">{error}</p>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card className="text-center py-12">
        <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-600 mb-2">
          まだレビューがありません
        </h3>
        <p className="text-slate-500">
          最初のレビューを投稿してみませんか？
        </p>
      </Card>
    );
  }

  // 評価の統計を計算
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingCounts = Array.from({ length: 5 }, (_, i) => 
    reviews.filter(review => review.rating === 5 - i).length
  );

  return (
    <div className="space-y-6">
      {/* 評価サマリー */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${
                      index < Math.round(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-slate-600">
                {reviews.length}件のレビュー
              </div>
            </div>
          </div>
          
          {/* 評価分布 */}
          <div className="flex-1 max-w-sm">
            {ratingCounts.map((count, index) => {
              const rating = 5 - index;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-2 mb-1">
                  <span className="text-sm text-slate-600 w-8">
                    {rating}★
                  </span>
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-600 w-8">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* レビュー一覧 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">
          レビュー一覧
        </h3>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};