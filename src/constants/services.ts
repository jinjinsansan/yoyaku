import { Service } from '../types';

export const SERVICES: Service[] = [
  {
    id: 'monthly',
    name: 'カウンセリング1ヶ月コース',
    description: '月4回のカウンセリングセッション（1回60分）',
    price: 44000,
    duration: 60,
    type: 'monthly'
  },
  {
    id: 'single',
    name: 'カウンセリング1回分',
    description: '単発のカウンセリングセッション（60分）',
    price: 11000,
    duration: 60,
    type: 'single'
  }
];

export const PAYMENT_METHODS = [
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'クレジットカード・デビットカード',
    icon: '💳'
  },
  {
    id: 'bank_transfer',
    name: '銀行振込',
    description: '指定口座への振込',
    icon: '🏦'
  }
] as const;