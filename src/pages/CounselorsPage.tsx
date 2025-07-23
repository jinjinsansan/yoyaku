import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Loader2 } from 'lucide-react';
import { useCounselors } from '../hooks/useCounselors';
import { CounselorCard } from '../components/counselor/CounselorCard';
import { CounselorFilter } from '../components/counselor/CounselorFilter';
import { Counselor } from '../types';

export const CounselorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { counselors, loading, error } = useCounselors();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  // 利用可能な専門分野を取得
  const availableSpecialties = useMemo(() => {
    const specialties = new Set<string>();
    counselors.forEach(counselor => {
      counselor.specialties.forEach(specialty => specialties.add(specialty));
    });
    return Array.from(specialties).sort();
  }, [counselors]);

  // フィルタリングされたカウンセラー
  const filteredCounselors = useMemo(() => {
    return counselors.filter(counselor => {
      // 名前での検索
      const matchesSearch = counselor.user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // 専門分野での絞り込み
      const matchesSpecialties = selectedSpecialties.length === 0 ||
        selectedSpecialties.some(specialty => 
          counselor.specialties.includes(specialty)
        );

      return matchesSearch && matchesSpecialties;
    });
  }, [counselors, searchTerm, selectedSpecialties]);

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleCounselorSelect = (counselor: Counselor) => {
    navigate(`/counselors/${counselor.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">カウンセラー情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            エラーが発生しました
          </h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            カウンセラー一覧
          </h1>
          <p className="text-lg text-slate-600">
            あなたに最適なカウンセラーを見つけましょう
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* フィルター */}
          <div className="lg:col-span-1">
            <CounselorFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedSpecialties={selectedSpecialties}
              onSpecialtyToggle={handleSpecialtyToggle}
              availableSpecialties={availableSpecialties}
            />
          </div>

          {/* カウンセラー一覧 */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-slate-600">
                {filteredCounselors.length}名のカウンセラーが見つかりました
              </p>
            </div>

            {filteredCounselors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">
                  条件に合うカウンセラーが見つかりません
                </h3>
                <p className="text-slate-500">
                  検索条件を変更してお試しください
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCounselors.map((counselor) => (
                  <CounselorCard
                    key={counselor.id}
                    counselor={counselor}
                    onSelect={handleCounselorSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};