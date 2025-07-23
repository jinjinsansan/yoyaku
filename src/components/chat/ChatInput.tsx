import React, { useState, useRef } from 'react';
import { Send, Paperclip, X, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface ChatInputProps {
  onSendMessage: (message: string, fileUrl?: string) => Promise<void>;
  onUploadFile: (file: File) => Promise<string>;
  disabled?: boolean;
  sending?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onUploadFile,
  disabled = false,
  sending = false
}) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!message.trim() && !selectedFile) || disabled || sending) return;

    try {
      let fileUrl: string | undefined;
      
      if (selectedFile) {
        setUploading(true);
        fileUrl = await onUploadFile(selectedFile);
      }
      
      await onSendMessage(message, fileUrl);
      
      // リセット
      setMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ファイルサイズチェック（10MB制限）
      if (file.size > 10 * 1024 * 1024) {
        alert('ファイルサイズは10MB以下にしてください');
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const canSend = (message.trim() || selectedFile) && !disabled && !sending && !uploading;

  return (
    <div className="border-t border-slate-200 bg-white p-4">
      {/* 選択されたファイルの表示 */}
      {selectedFile && (
        <div className="mb-3 flex items-center space-x-2 p-2 bg-slate-50 rounded-lg">
          <Paperclip className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-700 flex-1 truncate">
            {selectedFile.name}
          </span>
          <button
            onClick={removeSelectedFile}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        {/* ファイル選択ボタン */}
        <div className="flex-shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            className="p-2"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
        </div>
        
        {/* メッセージ入力 */}
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="メッセージを入力..."
            disabled={disabled || uploading}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>
        
        {/* 送信ボタン */}
        <div className="flex-shrink-0">
          <Button
            type="submit"
            disabled={!canSend}
            className="p-2"
          >
            {sending || uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </form>
      
      <div className="mt-2 text-xs text-slate-500">
        Enterで送信、Shift+Enterで改行
      </div>
    </div>
  );
};