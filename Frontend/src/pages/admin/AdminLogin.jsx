import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { BRAND_IMAGE } from '../../utils/imageUrl';

export default function AdminLogin() {
  const { adminLogin, user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user && isAdmin) navigate('/admin', { replace: true });
  }, [authLoading, user, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(form.email, form.password);
      toast.success('Welcome to the admin dashboard');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="panel-dark w-full max-w-md rounded-xl p-6 sm:p-8">
        <img src={BRAND_IMAGE} alt="" className="mx-auto h-14 w-14 rounded-full border border-gold/30 object-cover" />
        <p className="section-eyebrow mt-4 text-center">Staff portal</p>
        <h1 className="page-title text-center">Admin sign in</h1>
        <p className="mt-2 text-center text-sm text-parchment/65">
          Manage products, orders, and delivery status.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="form-field">
            <span className="form-label">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-luxury w-full rounded-lg px-4 py-2.5"
            />
          </label>
          <label className="form-field">
            <span className="form-label">Password</span>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-luxury w-full rounded-lg px-4 py-2.5"
            />
          </label>
          <button type="submit" disabled={loading} className="btn-gold w-full rounded-full disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign in to dashboard'}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-parchment/65">
          New administrator?{' '}
          <Link to="/admin/register" className="text-gold hover:underline">Create admin account</Link>
        </p>
        <Link to="/" className="mt-3 block text-center text-xs text-parchment/50 hover:text-gold-light">
          Back to store
        </Link>
        <Link to="/login" className="mt-2 block text-center text-xs text-parchment/45 hover:text-gold-light">
          Customer login
        </Link>
      </div>
    </div>
  );
}
