import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface CounselorFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedSpecialties: string[];
  onSpecialtyToggle: (specialty: string) => void;
  availableSpecialties: string[];
}

export const CounselorFilter: React.FC<CounselorFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedSpecialties,
  onSpecialtyToggle,
  availableSpecialties
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div className="flex items-center space-x-2">
        <Filter className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-800">絞り込み</h3>
      </div>

      {/* 検索 */}
      <Input
        placeholder="カウンセラー名で検索..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        icon={<Search className="w-5 h-5" />}
      />

      {/* 専門分野フィルター */}
      <div>
        <h4 className="text-sm font-medium text-slate-700 mb-3">専門分野</h4>
        <div className="flex flex-wrap gap-2">
          {availableSpecialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => onSpecialtyToggle(specialty)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedSpecialties.includes(specialty)
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* 選択中のフィルターをクリア */}
      {(searchTerm || selectedSpecialties.length > 0) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onSearchChange('');
            selectedSpecialties.forEach(specialty => onSpecialtyToggle(specialty));
          }}
          className="w-full"
        >
          フィルターをクリア
        </Button>
      )}
    </div>
  );
};