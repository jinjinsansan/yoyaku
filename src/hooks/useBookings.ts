import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Booking, BookingStatus, ServiceType } from '../types';
import { useAuth } from './useAuth';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedBookings: Booking[] = data.map(booking => ({
        id: booking.id,
        userId: booking.user_id,
        counselorId: booking.counselor_id,
        user: {
          id: booking.user.id,
          email: booking.user.email,
          name: booking.user.name,
          phone: booking.user.phone,
          avatar: booking.user.avatar,
          createdAt: new Date(booking.user.created_at),
          updatedAt: new Date(booking.user.updated_at)
        },
        counselor: {
          id: booking.counselor.id,
          userId: booking.counselor.user_id,
          user: {
            id: booking.counselor.user.id,
            email: booking.counselor.user.email,
            name: booking.counselor.user.name,
            phone: booking.counselor.user.phone,
            avatar: booking.counselor.user.avatar,
            createdAt: new Date(booking.counselor.user.created_at),
            updatedAt: new Date(booking.counselor.user.updated_at)
          },
          profileImage: booking.counselor.profile_image,
          bio: booking.counselor.bio,
          specialties: booking.counselor.specialties,
          profileUrl: booking.counselor.profile_url,
          hourlyRate: booking.counselor.hourly_rate,
          isActive: booking.counselor.is_active,
          rating: booking.counselor.rating,
          reviewCount: booking.counselor.review_count,
          createdAt: new Date(booking.counselor.created_at),
          updatedAt: new Date(booking.counselor.updated_at)
        },
        serviceType: booking.service_type as ServiceType,
        scheduledAt: new Date(booking.scheduled_at),
        status: booking.status as BookingStatus,
        amount: booking.amount,
        notes: booking.notes,
        createdAt: new Date(booking.created_at),
        updatedAt: new Date(booking.updated_at)
      }));

      setBookings(formattedBookings);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: {
    counselorId: string;
    serviceType: ServiceType;
    scheduledAt: Date;
    amount: number;
    notes?: string;
  }) => {
    if (!user) throw new Error('ログインが必要です');

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          counselor_id: bookingData.counselorId,
          service_type: bookingData.serviceType,
          scheduled_at: bookingData.scheduledAt.toISOString(),
          amount: bookingData.amount,
          notes: bookingData.notes,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      await fetchBookings(); // 一覧を再取得
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      await fetchBookings(); // 一覧を再取得
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBookingStatus,
    refetch: fetchBookings
  };
};