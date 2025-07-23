import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Schedule } from '../types';

export const useSchedules = (counselorId?: string) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (counselorId) {
      fetchSchedules(counselorId);
    }
  }, [counselorId]);

  const fetchSchedules = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schedules')
        .select(`
          *,
          counselor:counselors(
            *,
            user:users(*)
          )
        `)
        .eq('counselor_id', id)
        .eq('is_available', true)
        .order('day_of_week');

      if (error) throw error;

      const formattedSchedules: Schedule[] = data.map(schedule => ({
        id: schedule.id,
        counselorId: schedule.counselor_id,
        counselor: {
          id: schedule.counselor.id,
          userId: schedule.counselor.user_id,
          user: {
            id: schedule.counselor.user.id,
            email: schedule.counselor.user.email,
            name: schedule.counselor.user.name,
            phone: schedule.counselor.user.phone,
            avatar: schedule.counselor.user.avatar,
            createdAt: new Date(schedule.counselor.user.created_at),
            updatedAt: new Date(schedule.counselor.user.updated_at)
          },
          profileImage: schedule.counselor.profile_image,
          bio: schedule.counselor.bio,
          specialties: schedule.counselor.specialties,
          profileUrl: schedule.counselor.profile_url,
          hourlyRate: schedule.counselor.hourly_rate,
          isActive: schedule.counselor.is_active,
          rating: schedule.counselor.rating,
          reviewCount: schedule.counselor.review_count,
          createdAt: new Date(schedule.counselor.created_at),
          updatedAt: new Date(schedule.counselor.updated_at)
        },
        dayOfWeek: schedule.day_of_week,
        startTime: schedule.start_time,
        endTime: schedule.end_time,
        isAvailable: schedule.is_available
      }));

      setSchedules(formattedSchedules);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { schedules, loading, error, refetch: () => counselorId && fetchSchedules(counselorId) };
};