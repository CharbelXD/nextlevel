import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from './AdminPanel';
import { useAdmin } from '../context/AdminContext';

export default function AdminPanelPage() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-black" />;
  }

  if (!isAdmin) {
    return null;
  }

  return <AdminPanel />;
}