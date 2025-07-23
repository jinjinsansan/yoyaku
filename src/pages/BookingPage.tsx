import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useCounselor } from '../hooks/useCounselor';
import { useSchedules } from '../hooks/useSchedules';
import { useBookings } from '../hooks/useBookings';
import { useAuth } from '../hooks/useAuth';
import { BookingForm } from '../components/booking/BookingForm';
import { Button } from '../components/ui/Button';
import { ServiceType } from '../types';

export const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { counselor, loading: counselorLoading, error: counselorError } = useCounselor(id!);
  const { schedules, loading: schedulesLoading } = useSchedules(id);
  const { createBooking } = useBookings();
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loading = counselorLoading || schedulesLoading;

  const handleBookingSubmit = async (bookingData: {
    serviceType: ServiceType;
    scheduledAt: Date;
    amount: number;
    notes?: string;
  }) => {
    if (!counselor || !user) return;

    try {
      setBookingLoading(true);
      setError(null);

      const booking = await createBooking({
        counselorId: counselor.id,
        ...bookingData
      });

      // 予約成功後、決済ページに遷移
      navigate(`/payment/${booking.id}`);
    } catch (err: any) {
      setError(err.message || '予約の作成に失敗しました');
    } finally {
      setBookingLoading(false);
    }
  };

  // 認証チェック
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            ログインが必要です
          </h2>
          <p className="text-slate-600 mb-6">
            カウンセリングの予約にはログインが必要です。
            アカウントをお持ちでない場合は新規登録してください。
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/counselors')}
              className="w-full"
            >
              ログイン・新規登録
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/counselors')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              カウンセラー一覧に戻る
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">予約情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (counselorError || !counselor) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            カウンセラーが見つかりません
          </h2>
          <p className="text-slate-600 mb-6">
            {counselorError || '指定されたカウンセラーは存在しないか、現在利用できません。'}
          </p>
          <Button onClick={() => navigate('/counselors')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            カウンセラー一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            予約可能な時間がありません
          </h2>
          <p className="text-slate-600 mb-6">
            {counselor.user.name}さんは現在予約を受け付けていません。
            他のカウンセラーをお探しください。
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate(`/counselors/${counselor.id}`)}>
              カウンセラー詳細に戻る
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/counselors')}
            >
              他のカウンセラーを探す
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 戻るボタン */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/counselors/${counselor.id}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          カウンセラー詳細に戻る
        </Button>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 予約フォーム */}
        <BookingForm
          counselorName={counselor.user.name}
          schedules={schedules}
          onSubmit={handleBookingSubmit}
          loading={bookingLoading}
        />
      </div>
    </div>
  );
};