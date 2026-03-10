import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLogin from '../components/AdminLogin';
import { useAdmin } from '../context/AdminContext';

export default function AdminLoginPage() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-black" />;
  }

  return <AdminLogin />;
}