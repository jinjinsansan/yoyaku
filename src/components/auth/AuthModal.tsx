import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, User, Phone } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, {
          name: formData.name,
          phone: formData.phone || undefined
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isLogin ? 'ログイン' : '新規登録'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!isLogin && (
          <>
            <Input
              label="お名前"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              icon={<User className="w-5 h-5" />}
              required
            />
            <Input
              label="電話番号（任意）"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              icon={<Phone className="w-5 h-5" />}
            />
          </>
        )}

        <Input
          label="メールアドレス"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          icon={<Mail className="w-5 h-5" />}
          required
        />

        <Input
          label="パスワード"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          icon={<Lock className="w-5 h-5" />}
          required
        />

        <Button
          type="submit"
          className="w-full"
          loading={loading}
        >
          {isLogin ? 'ログイン' : '新規登録'}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:text-indigo-700 text-sm"
          >
            {isLogin ? '新規登録はこちら' : 'ログインはこちら'}
          </button>
        </div>
      </form>
    </Modal>
  );
};