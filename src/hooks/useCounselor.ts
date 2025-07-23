import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Counselor } from '../types';

export const useCounselor = (id: string) => {
  const [counselor, setCounselor] = useState<Counselor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCounselor(id);
    }
  }, [id]);

  const fetchCounselor = async (counselorId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('counselors')
        .select(`
          *,
          user:users(*),
          schedules(*)
        `)
        .eq('id', counselorId)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      const formattedCounselor: Counselor = {
        id: data.id,
        userId: data.user_id,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          phone: data.user.phone,
          avatar: data.user.avatar,
          createdAt: new Date(data.user.created_at),
          updatedAt: new Date(data.user.updated_at)
        },
        profileImage: data.profile_image,
        bio: data.bio,
        specialties: data.specialties,
        profileUrl: data.profile_url,
        hourlyRate: data.hourly_rate,
        isActive: data.is_active,
        rating: data.rating,
        reviewCount: data.review_count,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setCounselor(formattedCounselor);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { counselor, loading, error, refetch: () => fetchCounselor(id) };
};