import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useBooking } from '../hooks/useBooking';
import { usePayments } from '../hooks/usePayments';
import { useAuth } from '../hooks/useAuth';
import { PaymentMethodSelector } from '../components/payment/PaymentMethodSelector';
import { PayPalPayment } from '../components/payment/PayPalPayment';
import { BankTransferInfo } from '../components/payment/BankTransferInfo';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PaymentMethod } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';

export const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { booking, loading: bookingLoading, error: bookingError } = useBooking(id!);
  const { createPayment, updatePaymentStatus } = usePayments();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayPalSuccess = async (transactionId: string) => {
    if (!booking) return;

    try {
      setPaymentLoading(true);
      const payment = await createPayment({
        bookingId: booking.id,
        amount: booking.amount,
        method: 'paypal',
        transactionId
      });

      await updatePaymentStatus(payment.id, 'completed', transactionId);
      setPaymentCompleted(true);
    } catch (err: any) {
      setError(err.message || '決済の処理中にエラーが発生しました');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePayPalError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleBankTransferConfirm = async () => {
    if (!booking) return;

    try {
      setPaymentLoading(true);
      await createPayment({
        bookingId: booking.id,
        amount: booking.amount,
        method: 'bank_transfer'
      });
      setPaymentCompleted(true);
    } catch (err: any) {
      setError(err.message || '振込予約の処理中にエラーが発生しました');
    } finally {
      setPaymentLoading(false);
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
            決済を行うにはログインが必要です。
          </p>
          <Button onClick={() => navigate('/counselors')}>
            ログインページに戻る
          </Button>
        </div>
      </div>
    );
  }

  if (bookingLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">予約情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (bookingError || !booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            予約が見つかりません
          </h2>
          <p className="text-slate-600 mb-6">
            {bookingError || '指定された予約は存在しないか、アクセス権限がありません。'}
          </p>
          <Button onClick={() => navigate('/counselors')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            カウンセラー一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  // 決済完了画面
  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <Card className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              {selectedMethod === 'paypal' ? '決済完了' : '振込予約完了'}
            </h2>
            <p className="text-slate-600 mb-6">
              {selectedMethod === 'paypal' 
                ? 'カウンセリングの予約と決済が完了しました。マイページからチャットを開始できます。'
                : '振込予約が完了しました。振込確認後、予約が確定されチャット機能をご利用いただけます。'
              }
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="w-full"
              >
                マイページで確認
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/counselors')}
                className="w-full"
              >
                カウンセラー一覧に戻る
              </Button>
            </div>
          </Card>
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
          onClick={() => navigate(`/booking/${booking.counselor.id}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          予約画面に戻る
        </Button>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* 予約内容確認 */}
          <Card>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">予約内容の確認</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">カウンセラー</span>
                <span className="font-medium">{booking.counselor.user.name}さん</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">サービス</span>
                <span className="font-medium">
                  {booking.serviceType === 'monthly' ? 'カウンセリング1ヶ月コース' : 'カウンセリング1回分'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">日時</span>
                <span className="font-medium">{formatDate(booking.scheduledAt)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-800 font-semibold">合計金額</span>
                <span className="text-xl font-bold text-indigo-600">
                  {formatCurrency(booking.amount)}
                </span>
              </div>
            </div>
          </Card>

          {/* 決済方法選択 */}
          {!selectedMethod && (
            <PaymentMethodSelector
              selectedMethod={selectedMethod}
              onMethodSelect={setSelectedMethod}
            />
          )}

          {/* PayPal決済 */}
          {selectedMethod === 'paypal' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">PayPal決済</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMethod(null)}
                >
                  変更
                </Button>
              </div>
              <PayPalPayment
                amount={booking.amount}
                onSuccess={handlePayPalSuccess}
                onError={handlePayPalError}
              />
            </div>
          )}

          {/* 銀行振込 */}
          {selectedMethod === 'bank_transfer' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">銀行振込</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMethod(null)}
                >
                  変更
                </Button>
              </div>
              <BankTransferInfo
                amount={booking.amount}
                bookingId={booking.id}
                onConfirm={handleBankTransferConfirm}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};