import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user && user.email === 'goldbenchan@gmail.com';

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>管理者ダッシュボード</h1>
      <p>ここに管理機能を追加していきます。</p>
    </div>
  );
}; 