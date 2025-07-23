import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ServiceType } from '../../types';
import { SERVICES } from '../../constants/services';
import { formatCurrency } from '../../lib/utils';

interface ServiceSelectorProps {
  selectedService: ServiceType | null;
  onServiceSelect: (serviceType: ServiceType) => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedService,
  onServiceSelect
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">サービスを選択</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICES.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedService === service.type
                ? 'ring-2 ring-indigo-500 bg-indigo-50'
                : 'hover:shadow-lg'
            }`}
            onClick={() => onServiceSelect(service.type)}
          >
            <div className="relative">
              {service.type === 'monthly' && (
                <div className="absolute -top-2 -right-2">
                  <Badge variant="success" size="sm">おすすめ</Badge>
                </div>
              )}
              
              <div className="flex items-start space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  service.type === 'monthly' 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'bg-cyan-100 text-cyan-600'
                }`}>
                  {service.type === 'monthly' ? (
                    <Calendar className="w-6 h-6" />
                  ) : (
                    <Clock className="w-6 h-6" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 mb-1">
                    {service.name}
                  </h4>
                  <p className="text-sm text-slate-600 mb-2">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-indigo-600">
                      {formatCurrency(service.price)}
                    </span>
                    <span className="text-sm text-slate-500">
                      {service.duration}分
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};