import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ChatRoom, ChatMessage } from '../types';
import { useAuth } from './useAuth';

export const useChat = (bookingId?: string) => {
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (bookingId && user) {
      initializeChat(bookingId);
    }
    
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [bookingId, user]);

  const initializeChat = async (id: string) => {
    try {
      setLoading(true);
      
      // チャットルームを取得または作成
      let { data: existingRoom, error: roomError } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          booking:bookings(
            *,
            user:users(*),
            counselor:counselors(
              *,
              user:users(*)
            )
          )
        `)
        .eq('booking_id', id)
        .single();

      if (roomError && roomError.code !== 'PGRST116') {
        throw roomError;
      }

      // チャットルームが存在しない場合は作成
      if (!existingRoom) {
        const { data: newRoom, error: createError } = await supabase
          .from('chat_rooms')
          .insert({
            booking_id: id,
            is_active: true
          })
          .select(`
            *,
            booking:bookings(
              *,
              user:users(*),
              counselor:counselors(
                *,
                user:users(*)
              )
            )
          `)
          .single();

        if (createError) throw createError;
        existingRoom = newRoom;
      }

      const formattedRoom: ChatRoom = {
        id: existingRoom.id,
        bookingId: existingRoom.booking_id,
        booking: {
          id: existingRoom.booking.id,
          userId: existingRoom.booking.user_id,
          counselorId: existingRoom.booking.counselor_id,
          user: {
            id: existingRoom.booking.user.id,
            email: existingRoom.booking.user.email,
            name: existingRoom.booking.user.name,
            phone: existingRoom.booking.user.phone,
            avatar: existingRoom.booking.user.avatar,
            createdAt: new Date(existingRoom.booking.user.created_at),
            updatedAt: new Date(existingRoom.booking.user.updated_at)
          },
          counselor: {
            id: existingRoom.booking.counselor.id,
            userId: existingRoom.booking.counselor.user_id,
            user: {
              id: existingRoom.booking.counselor.user.id,
              email: existingRoom.booking.counselor.user.email,
              name: existingRoom.booking.counselor.user.name,
              phone: existingRoom.booking.counselor.user.phone,
              avatar: existingRoom.booking.counselor.user.avatar,
              createdAt: new Date(existingRoom.booking.counselor.user.created_at),
              updatedAt: new Date(existingRoom.booking.counselor.user.updated_at)
            },
            profileImage: existingRoom.booking.counselor.profile_image,
            bio: existingRoom.booking.counselor.bio,
            specialties: existingRoom.booking.counselor.specialties,
            profileUrl: existingRoom.booking.counselor.profile_url,
            hourlyRate: existingRoom.booking.counselor.hourly_rate,
            isActive: existingRoom.booking.counselor.is_active,
            rating: existingRoom.booking.counselor.rating,
            reviewCount: existingRoom.booking.counselor.review_count,
            createdAt: new Date(existingRoom.booking.counselor.created_at),
            updatedAt: new Date(existingRoom.booking.counselor.updated_at)
          },
          serviceType: existingRoom.booking.service_type,
          scheduledAt: new Date(existingRoom.booking.scheduled_at),
          status: existingRoom.booking.status,
          amount: existingRoom.booking.amount,
          notes: existingRoom.booking.notes,
          createdAt: new Date(existingRoom.booking.created_at),
          updatedAt: new Date(existingRoom.booking.updated_at)
        },
        isActive: existingRoom.is_active,
        createdAt: new Date(existingRoom.created_at),
        updatedAt: new Date(existingRoom.updated_at)
      };

      setChatRoom(formattedRoom);
      
      // メッセージを取得
      await fetchMessages(formattedRoom.id);
      
      // リアルタイム購読を開始
      subscribeToMessages(formattedRoom.id);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:users(*)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages: ChatMessage[] = data.map(message => ({
        id: message.id,
        roomId: message.room_id,
        senderId: message.sender_id,
        sender: {
          id: message.sender.id,
          email: message.sender.email,
          name: message.sender.name,
          phone: message.sender.phone,
          avatar: message.sender.avatar,
          createdAt: new Date(message.sender.created_at),
          updatedAt: new Date(message.sender.updated_at)
        },
        message: message.message,
        fileUrl: message.file_url,
        createdAt: new Date(message.created_at)
      }));

      setMessages(formattedMessages);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const subscribeToMessages = (roomId: string) => {
    subscriptionRef.current = supabase
      .channel(`chat_room_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        async (payload) => {
          // 新しいメッセージの詳細情報を取得
          const { data, error } = await supabase
            .from('chat_messages')
            .select(`
              *,
              sender:users(*)
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && data) {
            const newMessage: ChatMessage = {
              id: data.id,
              roomId: data.room_id,
              senderId: data.sender_id,
              sender: {
                id: data.sender.id,
                email: data.sender.email,
                name: data.sender.name,
                phone: data.sender.phone,
                avatar: data.sender.avatar,
                createdAt: new Date(data.sender.created_at),
                updatedAt: new Date(data.sender.updated_at)
              },
              message: data.message,
              fileUrl: data.file_url,
              createdAt: new Date(data.created_at)
            };

            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();
  };

  const sendMessage = async (messageText: string, fileUrl?: string) => {
    if (!chatRoom || !user || !messageText.trim()) return;

    try {
      setSending(true);
      
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: chatRoom.id,
          sender_id: user.id,
          message: messageText.trim(),
          file_url: fileUrl
        });

      if (error) throw error;
      
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setSending(false);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `chat-files/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('chat-files')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err: any) {
      throw new Error('ファイルのアップロードに失敗しました');
    }
  };

  return {
    chatRoom,
    messages,
    loading,
    error,
    sending,
    sendMessage,
    uploadFile,
    refetch: () => chatRoom && fetchMessages(chatRoom.id)
  };
};