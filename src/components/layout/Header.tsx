import React from 'react';
import { Heart, Menu, User, LogOut, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onMenuClick?: () => void;
  onAuthClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onAuthClick }) => {
  const { user, signOut, isAuthenticated } = useAuth();

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await signOut();
    } else {
      onAuthClick?.();
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">心理カウンセリング</h1>
              <p className="text-xs text-slate-500">あなたの心に寄り添います</p>
            </div>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => window.location.href = '/'}
              className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
            >
              ホーム
            </button>
            <button 
              onClick={() => window.location.href = '/counselors'}
              className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
            >
              カウンセラー
            </button>
            {isAuthenticated && (
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                マイページ
              </button>
            )}
            <button 
              onClick={() => {/* 料金セクションにスクロール */}}
              className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
            >
              料金
            </button>
            <button 
              onClick={() => {/* お問い合わせモーダル表示 */}}
              className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
            >
              お問い合わせ
            </button>
          </nav>

          {/* ユーザーアクション */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden md:flex"
              onClick={handleAuthAction}
            >
              {isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  ログアウト
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  ログイン
                </>
              )}
            </Button>
            <Button size="sm" className="hidden md:flex">
              <MessageCircle className="w-4 h-4 mr-2" />
              無料相談を始める
            </Button>
            
            {/* モバイルメニューボタン */}
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* ユーザー情報表示 */}
        {isAuthenticated && user && (
          <div className="border-t border-slate-200 px-4 py-2 bg-slate-50">
            <p className="text-sm text-slate-600">
              ようこそ、<span className="font-medium">{user.user_metadata?.name || user.email}</span>さん
            </p>
          </div>
        )}
      </div>
    </header>
  );
};

export { Header }