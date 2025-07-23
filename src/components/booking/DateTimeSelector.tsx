import React, { useState, useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Schedule } from '../../types';

interface DateTimeSelectorProps {
  schedules: Schedule[];
  selectedDateTime: Date | null;
  onDateTimeSelect: (dateTime: Date) => void;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  schedules,
  selectedDateTime,
  onDateTimeSelect
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  // 今日から2週間後までの日付を生成
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // その日の曜日に対応するスケジュールがあるかチェック
      const dayOfWeek = date.getDay();
      const hasSchedule = schedules.some(schedule => schedule.dayOfWeek === dayOfWeek);
      
      if (hasSchedule) {
        dates.push({
          date: date.toISOString().split('T')[0],
          dayOfWeek,
          displayDate: date.toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric',
            weekday: 'short'
          })
        });
      }
    }
    
    return dates;
  }, [schedules]);

  // 選択された日付の利用可能時間を生成
  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];
    
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();
    const daySchedules = schedules.filter(schedule => schedule.dayOfWeek === dayOfWeek);
    
    const times = [];
    
    daySchedules.forEach(schedule => {
      const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
      const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
      
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;
      
      // 60分間隔で時間スロットを生成
      for (let time = startTime; time < endTime; time += 60) {
        const hour = Math.floor(time / 60);
        const minute = time % 60;
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        times.push({
          time: timeString,
          dateTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute)
        });
      }
    });
    
    return times;
  }, [selectedDate, schedules]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (dateTime: Date) => {
    onDateTimeSelect(dateTime);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800">日時を選択</h3>
      
      {/* 日付選択 */}
      <div>
        <h4 className="text-md font-medium text-slate-700 mb-3 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          日付を選択
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {availableDates.map((dateInfo) => (
            <Button
              key={dateInfo.date}
              variant={selectedDate === dateInfo.date ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleDateSelect(dateInfo.date)}
              className="text-xs"
            >
              {dateInfo.displayDate}
            </Button>
          ))}
        </div>
      </div>

      {/* 時間選択 */}
      {selectedDate && (
        <div>
          <h4 className="text-md font-medium text-slate-700 mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            時間を選択
          </h4>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {availableTimes.map((timeInfo) => (
              <Button
                key={timeInfo.time}
                variant={
                  selectedDateTime && 
                  selectedDateTime.getTime() === timeInfo.dateTime.getTime() 
                    ? 'primary' 
                    : 'outline'
                }
                size="sm"
                onClick={() => handleTimeSelect(timeInfo.dateTime)}
                className="text-sm"
              >
                {timeInfo.time}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 選択された日時の確認 */}
      {selectedDateTime && (
        <Card className="bg-indigo-50 border border-indigo-200">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span className="font-medium text-indigo-800">
              選択された日時: {selectedDateTime.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};