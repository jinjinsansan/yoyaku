import React from 'react';
import { Star, Clock, Users, ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Counselor } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface CounselorCardProps {
  counselor: Counselor;
  onSelect?: (counselor: Counselor) => void;
}

export const CounselorCard: React.FC<CounselorCardProps> = ({ counselor, onSelect }) => {
  return (
    <Card hover className="h-full">
      <div className="flex flex-col h-full">
        {/* プロフィール画像とヘッダー */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
            {counselor.profileImage ? (
              <img 
                src={counselor.profileImage} 
                alt={counselor.user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <Users className="w-8 h-8 text-indigo-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-800 truncate">
              {counselor.user.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-slate-600 ml-1">
                  {counselor.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-slate-500">
                ({counselor.reviewCount}件)
              </span>
            </div>
            <div className="flex items-center mt-1 text-sm text-slate-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatCurrency(counselor.hourlyRate)}/時間</span>
            </div>
          </div>
        </div>

        {/* 専門分野 */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {counselor.specialties.slice(0, 3).map((specialty, index) => (
              <Badge key={index} variant="info" size="sm">
                {specialty}
              </Badge>
            ))}
            {counselor.specialties.length > 3 && (
              <Badge variant="default" size="sm">
                +{counselor.specialties.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* 自己紹介 */}
        <div className="flex-1 mb-4">
          <p className="text-sm text-slate-600 line-clamp-3">
            {counselor.bio}
          </p>
        </div>

        {/* アクション */}
        <div className="flex flex-col space-y-2">
          <Button 
            onClick={() => onSelect?.(counselor)}
            className="w-full"
          >
            詳細を見る
          </Button>
          {counselor.profileUrl && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(counselor.profileUrl, '_blank')}
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              プロフィールサイト
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};