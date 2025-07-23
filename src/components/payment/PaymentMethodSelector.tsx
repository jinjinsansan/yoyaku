import React from 'react';
import { CreditCard, Building2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { PaymentMethod } from '../../types';
import { PAYMENT_METHODS } from '../../constants/services';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onMethodSelect: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodSelect
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">決済方法を選択</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PAYMENT_METHODS.map((method) => (
          <Card
            key={method.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedMethod === method.id
                ? 'ring-2 ring-indigo-500 bg-indigo-50'
                : 'hover:shadow-lg'
            }`}
            onClick={() => onMethodSelect(method.id as PaymentMethod)}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                {method.id === 'paypal' ? (
                  <CreditCard className="w-6 h-6 text-blue-600" />
                ) : (
                  <Building2 className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 mb-1">
                  {method.name}
                </h4>
                <p className="text-sm text-slate-600">
                  {method.description}
                </p>
              </div>
              <div className="text-2xl">
                {method.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};