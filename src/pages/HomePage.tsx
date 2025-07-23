import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, CreditCard, Users, Shield, Clock, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../lib/utils';
import { SERVICES } from '../constants/services';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-16">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 leading-tight">
              あなたの心に
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                寄り添う
              </span>
              <br />
              カウンセリング
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              専門的な心理カウンセラーとのオンラインチャットで、
              いつでもどこでも安心してご相談いただけます。
              あなたのペースで、心の健康をサポートします。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => navigate('/counselors')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                カウンセラーとチャット
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => navigate('/counselors')}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                カウンセラーを探す
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            選ばれる理由
          </h2>
          <p className="text-lg text-slate-600">
            私たちのサービスが多くの方に信頼される理由をご紹介します
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hover className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              専門カウンセラー
            </h3>
            <p className="text-slate-600 leading-relaxed">
              臨床心理士・公認心理師などの資格を持つ
              経験豊富なカウンセラーが対応します
            </p>
          </Card>

          <Card hover className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-cyan-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              24時間対応
            </h3>
            <p className="text-slate-600 leading-relaxed">
              いつでもご都合の良い時間に
              カウンセリングを受けることができます
            </p>
          </Card>

          <Card hover className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-violet-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              完全プライベート
            </h3>
            <p className="text-slate-600 leading-relaxed">
              厳格なセキュリティ対策により
              あなたのプライバシーを完全に保護します
            </p>
          </Card>
        </div>
      </section>

      {/* 料金プラン */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              料金プラン
            </h2>
            <p className="text-lg text-slate-600">
              あなたに最適なプランをお選びください
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {SERVICES.map((service) => (
              <Card key={service.id} className="relative">
                {service.type === 'monthly' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      おすすめ
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    {service.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-indigo-600">
                      {formatCurrency(service.price)}
                    </span>
                    {service.type === 'monthly' && (
                      <span className="text-slate-500 ml-2">/ 月</span>
                    )}
                  </div>
                  <p className="text-slate-600 mb-6">
                    {service.description}
                  </p>
                  <Button 
                    variant={service.type === 'monthly' ? 'primary' : 'outline'} 
                    className="w-full"
                    onClick={() => navigate('/counselors')}
                  >
                    このプランを選択
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA セクション */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 text-white">
          <div className="flex justify-center mb-6">
            <Heart className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            今すぐ始めませんか？
          </h2>
          <p className="text-xl mb-8 opacity-90">
            あなたの心の健康を第一に考えた、
            安心・安全なカウンセリングサービスです。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/counselors')}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              無料相談を始める
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-indigo-600"
              onClick={() => navigate('/counselors')}
            >
              詳しく見る
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};