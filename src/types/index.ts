// ユーザー関連の型定義
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// カウンセラー関連の型定義
export interface Counselor {
  id: string;
  userId: string;
  user: User;
  profileImage?: string;
  bio: string;
  specialties: string[];
  profileUrl?: string;
  hourlyRate: number;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 予約関連の型定義
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type ServiceType = 'monthly' | 'single';

export interface Booking {
  id: string;
  userId: string;
  counselorId: string;
  user: User;
  counselor: Counselor;
  serviceType: ServiceType;
  scheduledAt: Date;
  status: BookingStatus;
  amount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 決済関連の型定義
export type PaymentMethod = 'paypal' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  bookingId: string;
  booking: Booking;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// チャット関連の型定義
export interface ChatRoom {
  id: string;
  bookingId: string;
  booking: Booking;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  sender: User;
  message: string;
  fileUrl?: string;
  createdAt: Date;
}

// スケジュール関連の型定義
export interface Schedule {
  id: string;
  counselorId: string;
  counselor: Counselor;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isAvailable: boolean;
}

// レビュー関連の型定義
export interface Review {
  id: string;
  userId: string;
  counselorId: string;
  bookingId: string;
  user: User;
  counselor: Counselor;
  rating: number;
  comment: string;
  createdAt: Date;
}

// 商品関連の型定義
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  type: ServiceType;
}

// API レスポンス型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ページネーション型
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}