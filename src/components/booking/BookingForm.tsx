import React, { useState } from 'react';
import { MessageSquare, Calendar, CreditCard } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { ServiceSelector } from './ServiceSelector';
import { DateTimeSelector } from './DateTimeSelector';
import { ServiceType, Schedule } from '../../types';
import { SERVICES } from '../../constants/services';
import { formatCurrency, formatDate } from '../../lib/utils';

interface BookingFormProps {
  counselorName: string;
  schedules: Schedule[];
  onSubmit: (bookingData: {
    serviceType: ServiceType;
    scheduledAt: Date;
    amount: number;
    notes?: string;
  }) => void;
  loading?: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  counselorName,
  schedules,
  onSubmit,
  loading = false
}) => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');

  const selectedServiceData = selectedService 
    ? SERVICES.find(s => s.type === selectedService)
    : null;

  const canSubmit = selectedService && selectedDateTime;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit || !selectedServiceData) return;

    onSubmit({
      serviceType: selectedService,
      scheduledAt: selectedDateTime,
      amount: selectedServiceData.price,
      notes: notes.trim() || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* カウンセラー情報 */}
      <Card className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              {counselorName}さんとのカウンセリング予約
            </h2>
            <p className="text-slate-600">
              以下の情報を入力して予約を完了してください
            </p>
          </div>
        </div>
      </Card>

      {/* サービス選択 */}
      <ServiceSelector
        selectedService={selectedService}
        onServiceSelect={setSelectedService}
      />

      {/* 日時選択 */}
      {selectedService && (
        <DateTimeSelector
          schedules={schedules}
          selectedDateTime={selectedDateTime}
          onDateTimeSelect={setSelectedDateTime}
        />
      )}

      {/* 相談内容・メモ */}
      {selectedDateTime && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">相談内容・メモ（任意）</h3>
          <Textarea
            placeholder="どのようなことでお悩みですか？事前にお聞かせいただくことで、より効果的なカウンセリングを提供できます。"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>
      )}

      {/* 予約確認・送信 */}
      {canSubmit && selectedServiceData && (
        <Card className="bg-slate-50 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">予約内容の確認</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">カウンセラー</span>
              <span className="font-medium">{counselorName}さん</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">サービス</span>
              <span className="font-medium">{selectedServiceData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">日時</span>
              <span className="font-medium">{formatDate(selectedDateTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">料金</span>
              <span className="font-bold text-indigo-600">
                {formatCurrency(selectedServiceData.price)}
              </span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-200">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              予約を確定する
            </Button>
            <p className="text-xs text-slate-500 mt-2 text-center">
              予約確定後、決済ページに移動します。決済完了後にチャット機能をご利用いただけます。
            </p>
          </div>
        </Card>
      )}
    </form>
  );
};