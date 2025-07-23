import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ロゴ・会社情報 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">心理カウンセリング</h3>
                <p className="text-slate-300 text-sm">あなたの心に寄り添います</p>
              </div>
            </div>
            <p className="text-slate-300 mb-4 leading-relaxed">
              私たちは、一人ひとりの心の健康を大切にし、
              専門的なカウンセリングサービスを通じて、
              より良い人生をサポートします。
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-slate-300">
                <Phone className="w-4 h-4" />
                <span>03-1234-5678</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Mail className="w-4 h-4" />
                <span>info@counseling.jp</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <MapPin className="w-4 h-4" />
                <span>東京都渋谷区〇〇 1-2-3</span>
              </div>
            </div>
          </div>

          {/* サービス */}
          <div>
            <h4 className="font-semibold mb-4">サービス</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">個人カウンセリング</a></li>
              <li><a href="#" className="hover:text-white transition-colors">オンラインチャット</a></li>
              <li><a href="#" className="hover:text-white transition-colors">グループセッション</a></li>
              <li><a href="#" className="hover:text-white transition-colors">緊急サポート</a></li>
            </ul>
          </div>

          {/* サポート */}
          <div>
            <h4 className="font-semibold mb-4">サポート</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">よくある質問</a></li>
              <li><a href="#" className="hover:text-white transition-colors">お問い合わせ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">利用規約</a></li>
              <li><a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2025 心理カウンセリング. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};