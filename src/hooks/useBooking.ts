import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Booking, BookingStatus, ServiceType } from '../types';

export const useBooking = (bookingId: string) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      fetchBooking(bookingId);
    }
  }, [bookingId]);

  const fetchBooking = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user:users(*),
          counselor:counselors(
            *,
            user:users(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      const formattedBooking: Booking = {
        id: data.id,
        userId: data.user_id,
        counselorId: data.counselor_id,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          phone: data.user.phone,
          avatar: data.user.avatar,
          createdAt: new Date(data.user.created_at),
          updatedAt: new Date(data.user.updated_at)
        },
        counselor: {
          id: data.counselor.id,
          userId: data.counselor.user_id,
          user: {
            id: data.counselor.user.id,
            email: data.counselor.user.email,
            name: data.counselor.user.name,
            phone: data.counselor.user.phone,
            avatar: data.counselor.user.avatar,
            createdAt: new Date(data.counselor.user.created_at),
            updatedAt: new Date(data.counselor.user.updated_at)
          },
          profileImage: data.counselor.profile_image,
          bio: data.counselor.bio,
          specialties: data.counselor.specialties,
          profileUrl: data.counselor.profile_url,
          hourlyRate: data.counselor.hourly_rate,
          isActive: data.counselor.is_active,
          rating: data.counselor.rating,
          reviewCount: data.counselor.review_count,
          createdAt: new Date(data.counselor.created_at),
          updatedAt: new Date(data.counselor.updated_at)
        },
        serviceType: data.service_type as ServiceType,
        scheduledAt: new Date(data.scheduled_at),
        status: data.status as BookingStatus,
        amount: data.amount,
        notes: data.notes,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setBooking(formattedBooking);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { booking, loading, error, refetch: () => fetchBooking(bookingId) };
};