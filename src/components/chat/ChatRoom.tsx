import React, { useEffect, useRef } from 'react';
import { MessageCircle, Users, Clock, AlertCircle } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../lib/utils';

interface ChatRoomProps {
  bookingId: string;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ bookingId }) => {
  const { user } = useAuth();
  const { chatRoom, messages, loading, error, sending, sendMessage, uploadFile } = useChat(bookingId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 新しいメッセージが追加されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MessageCircle className="w-8 h-8 animate-pulse text-indigo-600 mx-auto mb-2" />
          <p className="text-slate-600">チャットルームを準備中...</p>
        </div>
      </div>
    );
  }

  if (error || !chatRoom) {
    return (
      <Card className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          チャットルームにアクセスできません
        </h3>
        <p className="text-slate-600">
          {error || 'チャットルームの読み込みに失敗しました'}
        </p>
      </Card>
    );
  }

  const otherParticipant = chatRoom.booking.userId === user?.id 
    ? chatRoom.booking.counselor.user 
    : chatRoom.booking.user;

  return (
    <div className="flex flex-col h-full">
      {/* チャットヘッダー */}
      <div className="border-b border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center">
              {otherParticipant.avatar ? (
                <img
                  src={otherParticipant.avatar}
                  alt={otherParticipant.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <Users className="w-5 h-5 text-indigo-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">
                {otherParticipant.name}さんとのチャット
              </h3>
              <p className="text-sm text-slate-500">
                予約日: {formatDate(chatRoom.booking.scheduledAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={chatRoom.booking.status === 'confirmed' ? 'success' : 'default'}
              size="sm"
            >
              {chatRoom.booking.status === 'confirmed' ? '確定済み' : '予約中'}
            </Badge>
            {chatRoom.isActive && (
              <Badge variant="success" size="sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                オンライン
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-600 mb-2">
              チャットを始めましょう
            </h4>
            <p className="text-slate-500">
              最初のメッセージを送信してカウンセリングを開始してください
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwn={message.senderId === user?.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* メッセージ入力 */}
      <ChatInput
        onSendMessage={sendMessage}
        onUploadFile={uploadFile}
        disabled={!chatRoom.isActive}
        sending={sending}
      />

      {/* チャット無効時の通知 */}
      {!chatRoom.isActive && (
        <div className="bg-amber-50 border-t border-amber-200 p-3">
          <div className="flex items-center space-x-2 text-amber-700">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              このチャットルームは現在無効になっています
            </span>
          </div>
        </div>
      )}
    </div>
  );
};