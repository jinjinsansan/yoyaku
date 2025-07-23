import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../lib/utils';

interface PayPalPaymentProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

export const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  amount,
  onSuccess,
  onError
}) => {
  const paypalOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
    currency: 'JPY',
    intent: 'capture'
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            PayPal決済
          </h3>
          <p className="text-2xl font-bold text-indigo-600">
            {formatCurrency(amount)}
          </p>
        </div>

        <PayPalScriptProvider options={paypalOptions}>
          <PayPalButtons
            style={{
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'pay'
            }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: 'JPY',
                      value: amount.toString()
                    },
                    description: 'カウンセリングサービス'
                  }
                ]
              });
            }}
            onApprove={async (data, actions) => {
              try {
                const details = await actions.order!.capture();
                const transactionId = details.id;
                onSuccess(transactionId);
              } catch (error) {
                onError('決済の処理中にエラーが発生しました');
              }
            }}
            onError={(err) => {
              console.error('PayPal Error:', err);
              onError('PayPal決済でエラーが発生しました');
            }}
            onCancel={() => {
              onError('決済がキャンセルされました');
            }}
          />
        </PayPalScriptProvider>

        <div className="text-xs text-slate-500 text-center">
          <p>PayPalアカウントまたはクレジットカードで決済できます</p>
          <p>決済情報は暗号化されて安全に処理されます</p>
        </div>
      </div>
    </Card>
  );
};