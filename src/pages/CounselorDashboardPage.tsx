import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCounselor } from '../hooks/useCounselor';
import { useSchedules } from '../hooks/useSchedules';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { formatCurrency, formatDate } from '../lib/utils';

export const CounselorDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'schedule' | 'bookings' | 'clients' | 'revenue'>('profile');
  const { user, isAuthenticated } = useAuth();
  const { counselor, loading, error, refetch } = useCounselor(user?.id || '');

  // プロフィール編集用state
  const [profileImage, setProfileImage] = useState('');
  const [bio, setBio] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [profileUrl, setProfileUrl] = useState('');
  const [hourlyRate, setHourlyRate] = useState(11000);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [specialtyInput, setSpecialtyInput] = useState('');

  // スケジュール管理用
  const { schedules, loading: schedulesLoading, error: schedulesError, refetch: refetchSchedules } = useSchedules(counselor?.id);
  const [newDayOfWeek, setNewDayOfWeek] = useState(0);
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('18:00');
  const [adding, setAdding] = useState(false);
  const [addMsg, setAddMsg] = useState('');

  // 予約管理用
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState('');
  const fetchBookings = async () => {
    if (!counselor) return;
    setBookingsLoading(true);
    setBookingsError('');
    const { data, error } = await supabase
      .from('bookings')
      .select(`*, user:users(*), counselor:counselors(*, user:users(*))`)
      .eq('counselor_id', counselor.id)
      .order('scheduled_at', { ascending: false });
    setBookingsLoading(false);
    if (error) {
      setBookingsError(error.message);
    } else {
      setBookings(data || []);
    }
  };
  useEffect(() => { fetchBookings(); }, [counselor]);

  // ステータス変更
  const handleUpdateStatus = async (id: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    fetchBookings();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge variant="success">確定</Badge>;
      case 'pending': return <Badge variant="warning">保留</Badge>;
      case 'completed': return <Badge variant="info">完了</Badge>;
      case 'cancelled': return <Badge variant="error">キャンセル</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  useEffect(() => {
    if (counselor) {
      setProfileImage(counselor.profileImage || '');
      setBio(counselor.bio || '');
      setSpecialties(counselor.specialties || []);
      setProfileUrl(counselor.profileUrl || '');
      setHourlyRate(counselor.hourlyRate || 11000);
    }
  }, [counselor]);

  // プロフィール保存
  const handleSaveProfile = async () => {
    if (!counselor) return;
    setSaving(true);
    setSaveMsg('');
    const { error } = await supabase
      .from('counselors')
      .update({
        profile_image: profileImage,
        bio,
        specialties,
        profile_url: profileUrl,
        hourly_rate: hourlyRate
      })
      .eq('id', counselor.id);
    setSaving(false);
    if (error) {
      setSaveMsg('保存に失敗しました: ' + error.message);
    } else {
      setSaveMsg('プロフィールを保存しました');
      refetch();
    }
  };

  // 専門分野追加
  const handleAddSpecialty = () => {
    if (specialtyInput && !specialties.includes(specialtyInput)) {
      setSpecialties([...specialties, specialtyInput]);
      setSpecialtyInput('');
    }
  };
  // 専門分野削除
  const handleRemoveSpecialty = (s: string) => {
    setSpecialties(specialties.filter(item => item !== s));
  };

  // スケジュール追加
  const handleAddSchedule = async () => {
    if (!counselor) return;
    setAdding(true);
    setAddMsg('');
    const { error } = await supabase.from('schedules').insert({
      counselor_id: counselor.id,
      day_of_week: newDayOfWeek,
      start_time: newStartTime,
      end_time: newEndTime,
      is_available: true
    });
    setAdding(false);
    if (error) {
      setAddMsg('追加に失敗しました: ' + error.message);
    } else {
      setAddMsg('追加しました');
      refetchSchedules();
    }
  };

  // スケジュール削除
  const handleDeleteSchedule = async (id: string) => {
    await supabase.from('schedules').delete().eq('id', id);
    refetchSchedules();
  };

  // スケジュール有効/無効切替
  const handleToggleAvailable = async (id: string, isAvailable: boolean) => {
    await supabase.from('schedules').update({ is_available: !isAvailable }).eq('id', id);
    refetchSchedules();
  };

  // クライアント管理用
  const [clientNotes, setClientNotes] = useState<{ [userId: string]: string }>({});
  // クライアントごとのメモをlocalStorageから復元
  useEffect(() => {
    const saved = localStorage.getItem('counselor_client_notes');
    if (saved) setClientNotes(JSON.parse(saved));
  }, []);
  // メモ保存時にlocalStorageへ
  const saveClientNotes = (notes: { [userId: string]: string }) => {
    setClientNotes(notes);
    localStorage.setItem('counselor_client_notes', JSON.stringify(notes));
  };
  // クライアントごとに予約をグループ化
  const clients = bookings.reduce((acc: any, booking: any) => {
    if (!booking.user) return acc;
    if (!acc[booking.user.id]) acc[booking.user.id] = { user: booking.user, sessions: [] };
    acc[booking.user.id].sessions.push(booking);
    return acc;
  }, {});

  // 収益レポート用
  const [revenueSummary, setRevenueSummary] = useState<any[]>([]);
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [revenueCount, setRevenueCount] = useState(0);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [revenueError, setRevenueError] = useState('');
  const fetchRevenue = async () => {
    if (!counselor) return;
    setRevenueLoading(true);
    setRevenueError('');
    // 完了した決済のみ集計
    const { data, error } = await supabase
      .from('payments')
      .select(`*, booking:bookings(*)`)
      .eq('status', 'completed')
      .eq('booking.counselor_id', counselor.id);
    setRevenueLoading(false);
    if (error) {
      setRevenueError(error.message);
      setRevenueSummary([]);
      setRevenueTotal(0);
      setRevenueCount(0);
    } else {
      // 月別集計
      const summary: { [key: string]: { total: number; count: number } } = {};
      let total = 0;
      let count = 0;
      (data || []).forEach((p: any) => {
        const date = new Date(p.created_at);
        const ym = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (!summary[ym]) summary[ym] = { total: 0, count: 0 };
        summary[ym].total += p.amount;
        summary[ym].count += 1;
        total += p.amount;
        count += 1;
      });
      setRevenueSummary(Object.entries(summary).map(([month, v]) => ({ month, ...v })).sort((a, b) => a.month.localeCompare(b.month)));
      setRevenueTotal(total);
      setRevenueCount(count);
    }
  };
  useEffect(() => { fetchRevenue(); }, [counselor]);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">カウンセラーダッシュボード</h1>
        <div className="mb-8 border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('profile')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>プロフィール編集</button>
            <button onClick={() => setActiveTab('schedule')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'schedule' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>スケジュール管理</button>
            <button onClick={() => setActiveTab('bookings')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'bookings' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>予約管理</button>
            <button onClick={() => setActiveTab('clients')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'clients' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>クライアント管理</button>
            <button onClick={() => setActiveTab('revenue')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'revenue' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>収益レポート</button>
          </nav>
        </div>
        <div>
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">プロフィール編集</h2>
              {loading ? (
                <div>読み込み中...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSaveProfile(); }}>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">プロフィール画像URL</label>
                    <Input value={profileImage} onChange={e => setProfileImage(e.target.value)} placeholder="画像URL" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">自己紹介</label>
                    <Textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder="自己紹介文" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">専門分野</label>
                    <div className="flex gap-2 mb-2">
                      <Input value={specialtyInput} onChange={e => setSpecialtyInput(e.target.value)} placeholder="専門分野を追加" />
                      <Button type="button" onClick={handleAddSpecialty}>追加</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {specialties.map(s => (
                        <Badge key={s} variant="info" className="cursor-pointer" onClick={() => handleRemoveSpecialty(s)}>{s} ×</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">プロフィールURL</label>
                    <Input value={profileUrl} onChange={e => setProfileUrl(e.target.value)} placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">時給（円）</label>
                    <Input type="number" value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))} min={0} />
                  </div>
                  <div className="flex gap-4 items-center">
                    <Button type="submit" disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
                    {saveMsg && <span className="text-green-600 text-sm">{saveMsg}</span>}
                  </div>
                </form>
              )}
            </div>
          )}
          {activeTab === 'schedule' && (
            <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">スケジュール管理</h2>
              {schedulesLoading ? (
                <div>読み込み中...</div>
              ) : schedulesError ? (
                <div className="text-red-500">{schedulesError}</div>
              ) : (
                <>
                  <table className="w-full mb-4 text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2">曜日</th>
                        <th>開始</th>
                        <th>終了</th>
                        <th>有効</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules.map(s => (
                        <tr key={s.id} className="border-b">
                          <td className="py-2">{['日','月','火','水','木','金','土'][s.dayOfWeek]}</td>
                          <td>{s.startTime}</td>
                          <td>{s.endTime}</td>
                          <td>
                            <Button size="sm" variant={s.isAvailable ? 'primary' : 'outline'} onClick={() => handleToggleAvailable(s.id, s.isAvailable)}>
                              {s.isAvailable ? '有効' : '無効'}
                            </Button>
                          </td>
                          <td>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteSchedule(s.id)}>削除</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mb-2 font-semibold">新しいスケジュール枠を追加</div>
                  <div className="flex gap-2 items-center mb-2">
                    <select value={newDayOfWeek} onChange={e => setNewDayOfWeek(Number(e.target.value))} className="border rounded px-2 py-1">
                      {[0,1,2,3,4,5,6].map(d => <option key={d} value={d}>{['日','月','火','水','木','金','土'][d]}</option>)}
                    </select>
                    <input type="time" value={newStartTime} onChange={e => setNewStartTime(e.target.value)} className="border rounded px-2 py-1" />
                    <span>〜</span>
                    <input type="time" value={newEndTime} onChange={e => setNewEndTime(e.target.value)} className="border rounded px-2 py-1" />
                    <Button size="sm" onClick={handleAddSchedule} disabled={adding}>{adding ? '追加中...' : '追加'}</Button>
                    {addMsg && <span className="text-green-600 text-xs">{addMsg}</span>}
                  </div>
                </>
              )}
            </div>
          )}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">予約管理</h2>
              {bookingsLoading ? (
                <div>読み込み中...</div>
              ) : bookingsError ? (
                <div className="text-red-500">{bookingsError}</div>
              ) : (
                <>
                  {bookings.length === 0 ? (
                    <div>予約がありません</div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map(booking => (
                        <Card key={booking.id}>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-slate-800">
                                  {booking.user?.name || booking.user?.email} さん
                                </h3>
                                {getStatusBadge(booking.status)}
                              </div>
                              <div className="space-y-1 text-sm text-slate-600">
                                <div>日時: {formatDate(booking.scheduled_at)}</div>
                                <div>サービス: {booking.service_type === 'monthly' ? '1ヶ月コース' : '1回分'}</div>
                                <div>金額: {formatCurrency(booking.amount)}</div>
                                {booking.notes && <div>メモ: {booking.notes}</div>}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 mt-4 sm:mt-0">
                              {booking.status === 'pending' && (
                                <Button size="sm" onClick={() => handleUpdateStatus(booking.id, 'confirmed')}>確定</Button>
                              )}
                              {booking.status === 'confirmed' && (
                                <Button size="sm" onClick={() => handleUpdateStatus(booking.id, 'completed')}>完了</Button>
                              )}
                              {booking.status !== 'cancelled' && (
                                <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(booking.id, 'cancelled')}>キャンセル</Button>
                              )}
                              <Button size="sm" variant="outline" onClick={() => window.open(`/chat/${booking.id}`, '_blank')}>チャット</Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {activeTab === 'clients' && (
            <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">クライアント管理</h2>
              {Object.keys(clients).length === 0 ? (
                <div>クライアントがいません</div>
              ) : (
                <div className="space-y-8">
                  {Object.values(clients).map((client: any) => (
                    <Card key={client.user.id}>
                      <div className="mb-2">
                        <span className="font-semibold text-slate-800">{client.user.name || client.user.email}</span>
                        <span className="ml-2 text-slate-500 text-xs">{client.user.email}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-slate-700">セッション履歴:</span>
                        <ul className="list-disc ml-6 text-sm">
                          {client.sessions.map((s: any) => (
                            <li key={s.id}>
                              {formatDate(s.scheduled_at)} / {s.service_type === 'monthly' ? '1ヶ月コース' : '1回分'} / {getStatusBadge(s.status)}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">クライアントメモ（非公開）</label>
                        <Textarea
                          value={clientNotes[client.user.id] || ''}
                          onChange={e => {
                            const notes = { ...clientNotes, [client.user.id]: e.target.value };
                            saveClientNotes(notes);
                          }}
                          rows={3}
                          placeholder="このクライアントに関するメモを記入（例：相談傾向、注意点など）"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'revenue' && (
            <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">収益レポート</h2>
              {revenueLoading ? (
                <div>読み込み中...</div>
              ) : revenueError ? (
                <div className="text-red-500">{revenueError}</div>
              ) : (
                <>
                  <div className="mb-4">合計売上: <span className="font-bold text-indigo-600">{formatCurrency(revenueTotal)}</span> / 件数: <span className="font-bold">{revenueCount}</span></div>
                  <table className="w-full text-sm mb-4">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2">月</th>
                        <th>売上</th>
                        <th>件数</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueSummary.map((row: any) => (
                        <tr key={row.month} className="border-b">
                          <td className="py-2">{row.month}</td>
                          <td>{formatCurrency(row.total)}</td>
                          <td>{row.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-slate-500">※グラフ表示は今後拡張予定</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 