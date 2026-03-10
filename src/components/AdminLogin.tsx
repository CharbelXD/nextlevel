import { useState } from 'react';
import { Lock } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);

    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-neutral-900 border-2 border-yellow-400 p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Lock className="h-8 w-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">Admin Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@yourgym.com"
              required
              className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2 focus:border-yellow-400 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-white font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              className="w-full bg-black border-2 border-gray-700 text-white px-4 py-2 focus:border-yellow-400 focus:outline-none transition-colors"
            />
          </div>

          {error && <div className="bg-red-900 text-red-200 px-4 py-2 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-bold py-2 hover:bg-yellow-500 transition-colors disabled:bg-gray-600"
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}