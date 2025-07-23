import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MessageCircle, 
  CreditCard, 
  User, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Loader2,
  Edit
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBookings } from '../hooks/useBookings';
import { usePayments } from '../hooks/usePayments';
import { useReviews } from '../hooks/useReviews';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ReviewForm } from '../components/review/ReviewForm';
import { formatCurrency, formatDate } from '../lib/utils';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { bookings, loading: bookingsLoading } = useBookings();
  const { payments, loading: paymentsLoading } = usePayments();
  const { createReview } = useReviews();
  const [activeTab, setActiveTab] = useState<'bookings' | 'payments' | 'profile'>('bookings');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

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
            マイページを表示するにはログインが必要です。
          </p>
          <Button onClick={() => navigate('/counselors')}>
            ログインページに戻る
          </Button>
        </div>
      </div>
    );
  }

  const loading = bookingsLoading || paymentsLoading;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">確定済み</Badge>;
      case 'pending':
        return <Badge variant="warning">保留中</Badge>;
      case 'completed':
        return <Badge variant="info">完了</Badge>;
      case 'cancelled':
        return <Badge variant="error">キャンセル</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">完了</Badge>;
      case 'pending':
        return <Badge variant="warning">処理中</Badge>;
      case 'failed':
        return <Badge variant="error">失敗</Badge>;
      case 'refunded':
        return <Badge variant="info">返金済み</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!selectedBooking) return;

    try {
      setReviewLoading(true);
      await createReview({
        counselorId: selectedBooking.counselor.id,
        bookingId: selectedBooking.id,
        rating,
        comment
      });
      setReviewModalOpen(false);
      setSelectedBooking(null);
      // 予約一覧を再取得（レビュー済みフラグの更新のため）
      // 実際の実装では、bookingsにreview情報を含めるか、別途管理する必要があります
    } catch (err: any) {
      throw new Error(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            マイページ
          </h1>
          <p className="text-lg text-slate-600">
            ようこそ、{user?.user_metadata?.name || user?.email}さん
          </p>
        </div>

        {/* タブナビゲーション */}
        <div className="mb-8">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                予約履歴
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payments'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-4 h-4 inline mr-2" />
                決済履歴
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                プロフィール
              </button>
            </nav>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-slate-600">データを読み込み中...</p>
            </div>
          </div>
        ) : (
          <>
            {/* 予約履歴タブ */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800">予約履歴</h2>
                  <Button onClick={() => navigate('/counselors')}>
                    新しい予約を作成
                  </Button>
                </div>

                {bookings.length === 0 ? (
                  <Card className="text-center py-12">
                    <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">
                      予約がありません
                    </h3>
                    <p className="text-slate-500 mb-6">
                      カウンセラーを選んで最初の予約を作成しましょう
                    </p>
                    <Button onClick={() => navigate('/counselors')}>
                      カウンセラーを探す
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {bookings.map((booking) => (
                      <Card key={booking.id} hover>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-slate-800">
                                {booking.counselor.user.name}さんとのカウンセリング
                              </h3>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="space-y-1 text-sm text-slate-600">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                <span>{formatDate(booking.scheduledAt)}</span>
                              </div>
                              <div className="flex items-center">
                                <CreditCard className="w-4 h-4 mr-2" />
                                <span>{formatCurrency(booking.amount)}</span>
                              </div>
                              <div>
                                <span className="font-medium">サービス: </span>
                                {booking.serviceType === 'monthly' ? 'カウンセリング1ヶ月コース' : 'カウンセリング1回分'}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                            {booking.status === 'confirmed' && (
                              <Button
                                size="sm"
                                onClick={() => navigate(`/chat/${booking.id}`)}
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                チャット
                              </Button>
                            )}
                            {booking.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/payment/${booking.id}`)}
                              >
                                <CreditCard className="w-4 h-4 mr-2" />
                                決済へ
                              </Button>
                            )}
                            {booking.status === 'completed' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setReviewModalOpen(true);
                                }}
                              >
                                <Star className="w-4 h-4 mr-2" />
                                レビュー
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/counselors/${booking.counselor.id}`)}
                            >
                              詳細を見る
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 決済履歴タブ */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800">決済履歴</h2>

                {payments.length === 0 ? (
                  <Card className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">
                      決済履歴がありません
                    </h3>
                    <p className="text-slate-500">
                      予約を作成すると決済履歴が表示されます
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {payments.map((payment) => (
                      <Card key={payment.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-slate-800">
                                {payment.booking.counselor.user.name}さんへの決済
                              </h3>
                              {getPaymentStatusBadge(payment.status)}
                            </div>
                            <div className="space-y-1 text-sm text-slate-600">
                              <div>
                                <span className="font-medium">金額: </span>
                                {formatCurrency(payment.amount)}
                              </div>
                              <div>
                                <span className="font-medium">決済方法: </span>
                                {payment.method === 'paypal' ? 'PayPal' : '銀行振込'}
                              </div>
                              <div>
                                <span className="font-medium">決済日: </span>
                                {formatDate(payment.createdAt)}
                              </div>
                              {payment.transactionId && (
                                <div>
                                  <span className="font-medium">取引ID: </span>
                                  <span className="font-mono text-xs">{payment.transactionId}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-indigo-600">
                              {formatCurrency(payment.amount)}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* プロフィールタブ */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800">プロフィール</h2>
                
                <Card>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">
                          {user?.user_metadata?.name || 'ユーザー'}
                        </h3>
                        <p className="text-slate-600">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          メールアドレス
                        </label>
                        <p className="text-slate-800">{user?.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          登録日
                        </label>
                        <p className="text-slate-800">
                          {user?.created_at ? formatDate(new Date(user.created_at)) : '不明'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <h4 className="text-md font-semibold text-slate-800 mb-3">統計情報</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-slate-50 rounded-lg">
                          <div className="text-2xl font-bold text-indigo-600">{bookings.length}</div>
                          <div className="text-sm text-slate-600">総予約数</div>
                        </div>
                        <div className="text-center p-4 bg-slate-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {bookings.filter(b => b.status === 'completed').length}
                          </div>
                          <div className="text-sm text-slate-600">完了したセッション</div>
                        </div>
                        <div className="text-center p-4 bg-slate-50 rounded-lg">
                          <div className="text-2xl font-bold text-cyan-600">
                            {payments.filter(p => p.status === 'completed').length}
                          </div>
                          <div className="text-sm text-slate-600">完了した決済</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}

        {/* レビューモーダル */}
        <Modal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedBooking(null);
          }}
          title="レビューを投稿"
          size="md"
        >
          {selectedBooking && (
            <ReviewForm
              counselorName={selectedBooking.counselor.user.name}
              onSubmit={handleReviewSubmit}
              loading={reviewLoading}
            />
          )}
        </Modal>
      </div>
    </div>
  );
};