import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, AlertCircle } from 'lucide-react';
import { ChatRoom } from '../components/chat/ChatRoom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export const ChatPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
            チャット機能を利用するにはログインが必要です。
          </p>
          <Button onClick={() => navigate('/counselors')}>
            ログインページに戻る
          </Button>
        </div>
      </div>
    );
  }

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <MessageCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            無効なチャットルーム
          </h2>
          <p className="text-slate-600 mb-6">
            指定されたチャットルームが見つかりません。
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            マイページに戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              戻る
            </Button>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-indigo-600" />
              <h1 className="text-lg font-semibold text-slate-800">
                カウンセリングチャット
              </h1>
            </div>
          </div>
        </div>

        {/* チャットルーム */}
        <div className="h-[calc(100vh-80px)]">
          <ChatRoom bookingId={bookingId} />
        </div>
      </div>
    </div>
  );
};