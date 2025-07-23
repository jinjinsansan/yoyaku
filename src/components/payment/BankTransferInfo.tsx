import React from 'react';
import { Copy, Building2, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../lib/utils';

interface BankTransferInfoProps {
  amount: number;
  bookingId: string;
  onConfirm: () => void;
}

export const BankTransferInfo: React.FC<BankTransferInfoProps> = ({
  amount,
  bookingId,
  onConfirm
}) => {
  const bankInfo = {
    bankName: 'みずほ銀行',
    branchName: '渋谷支店',
    accountType: '普通',
    accountNumber: '1234567',
    accountName: 'カ）シンリカウンセリング'
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: トースト通知を追加
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            銀行振込
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(amount)}
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg">
          <h4 className="font-semibold text-slate-800 mb-3">振込先情報</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">銀行名</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{bankInfo.bankName}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankInfo.bankName)}
                  className="p-1 h-auto"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">支店名</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{bankInfo.branchName}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankInfo.branchName)}
                  className="p-1 h-auto"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">口座種別</span>
              <span className="font-medium">{bankInfo.accountType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">口座番号</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{bankInfo.accountNumber}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankInfo.accountNumber)}
                  className="p-1 h-auto"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">口座名義</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{bankInfo.accountName}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankInfo.accountName)}
                  className="p-1 h-auto"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <h5 className="font-medium text-amber-800 mb-1">振込時の注意事項</h5>
              <ul className="text-amber-700 space-y-1">
                <li>• 振込名義人は予約者様のお名前でお願いします</li>
                <li>• 振込手数料はお客様負担となります</li>
                <li>• 振込確認後、予約が確定されます（通常1-2営業日）</li>
                <li>• 振込期限：予約日の3営業日前まで</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-600 mb-4">
            振込予約ID: <span className="font-mono font-medium">{bookingId.slice(-8)}</span>
          </p>
          <Button onClick={onConfirm} className="w-full">
            振込予約を確定する
          </Button>
        </div>
      </div>
    </Card>
  );
};