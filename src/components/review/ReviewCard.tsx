import React from 'react';
import { Star, User } from 'lucide-react';
import { Card } from '../ui/Card';
import { Review } from '../../types';
import { formatDate } from '../../lib/utils';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-slate-300'
        }`}
      />
    ));
  };

  return (
    <Card className="space-y-4">
      {/* ユーザー情報と評価 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center">
            {review.user.avatar ? (
              <img
                src={review.user.avatar}
                alt={review.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-indigo-600" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">
              {review.user.name}
            </h4>
            <p className="text-sm text-slate-500">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {renderStars(review.rating)}
        </div>
      </div>

      {/* レビューコメント */}
      <div className="prose prose-slate max-w-none">
        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
          {review.comment}
        </p>
      </div>
    </Card>
  );
};