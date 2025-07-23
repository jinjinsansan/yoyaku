import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { CounselorsPage } from './pages/CounselorsPage';
import { CounselorDetailPage } from './pages/CounselorDetailPage';
import { BookingPage } from './pages/BookingPage';
import { PaymentPage } from './pages/PaymentPage';
import { ChatPage } from './pages/ChatPage';
import { DashboardPage } from './pages/DashboardPage';
import { CounselorDashboardPage } from './pages/CounselorDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/counselors" element={<CounselorsPage />} />
          <Route path="/counselors/:id" element={<CounselorDetailPage />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/payment/:id" element={<PaymentPage />} />
          <Route path="/chat/:bookingId" element={<ChatPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/counselor-dashboard" element={<CounselorDashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;