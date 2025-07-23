import React from 'react';
import { Download, FileText, Image as ImageIcon } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types';
import { formatTime } from '../../lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
  isOwn: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwn }) => {
  const isImage = message.fileUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(message.fileUrl);
  const isFile = message.fileUrl && !isImage;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* 送信者名（自分以外の場合） */}
        {!isOwn && (
          <div className="text-xs text-slate-500 mb-1 px-3">
            {message.sender.name}
          </div>
        )}
        
        {/* メッセージバブル */}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-indigo-500 text-white rounded-br-md'
              : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md'
          }`}
        >
          {/* テキストメッセージ */}
          {message.message && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.message}
            </p>
          )}
          
          {/* 画像ファイル */}
          {isImage && (
            <div className="mt-2">
              <img
                src={message.fileUrl}
                alt="共有画像"
                className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(message.fileUrl, '_blank')}
              />
            </div>
          )}
          
          {/* その他のファイル */}
          {isFile && (
            <div className="mt-2 flex items-center space-x-2 p-2 bg-slate-50 rounded-lg">
              <FileText className="w-5 h-5 text-slate-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  添付ファイル
                </p>
              </div>
              <button
                onClick={() => window.open(message.fileUrl, '_blank')}
                className="p-1 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        {/* 送信時刻 */}
        <div className={`text-xs text-slate-400 mt-1 px-3 ${isOwn ? 'text-right' : 'text-left'}`}>
          {formatTime(message.createdAt)}
        </div>
      </div>
      
      {/* アバター */}
      <div className={`w-8 h-8 rounded-full flex-shrink-0 ${isOwn ? 'order-1 mr-2' : 'order-2 ml-2'}`}>
        {message.sender.avatar ? (
          <img
            src={message.sender.avatar}
            alt={message.sender.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
            isOwn 
              ? 'bg-indigo-100 text-indigo-600' 
              : 'bg-slate-100 text-slate-600'
          }`}>
            {message.sender.name.charAt(0)}
          </div>
        )}
      </div>
    </div>
  );
};