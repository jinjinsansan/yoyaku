import React, { useState } from 'react';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'bookings' | 'users' | 'counselors' | 'payments' | 'settings'>('stats');

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">管理者ダッシュボード</h1>
        <div className="mb-8 border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('stats')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'stats' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>売上統計</button>
            <button onClick={() => setActiveTab('bookings')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'bookings' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>予約状況</button>
            <button onClick={() => setActiveTab('users')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>ユーザー管理</button>
            <button onClick={() => setActiveTab('counselors')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'counselors' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>カウンセラー管理</button>
            <button onClick={() => setActiveTab('payments')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'payments' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>決済履歴</button>
            <button onClick={() => setActiveTab('settings')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>システム設定</button>
          </nav>
        </div>
        <div>
          {activeTab === 'stats' && (
            <div className="bg-white rounded-lg shadow p-6">売上統計セクション（今後実装）</div>
          )}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-lg shadow p-6">予約状況セクション（今後実装）</div>
          )}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow p-6">ユーザー管理セクション（今後実装）</div>
          )}
          {activeTab === 'counselors' && (
            <div className="bg-white rounded-lg shadow p-6">カウンセラー管理セクション（今後実装）</div>
          )}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-lg shadow p-6">決済履歴セクション（今後実装）</div>
          )}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow p-6">システム設定セクション（今後実装）</div>
          )}
        </div>
      </div>
    </div>
  );
}; 