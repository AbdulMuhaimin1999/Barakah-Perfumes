import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container flex min-h-[60vh] items-center justify-center py-10">
      <div className="panel-dark w-full max-w-md rounded-xl p-6 sm:p-8">
        <p className="section-eyebrow">Customer account</p>
        <h1 className="page-title">Sign in</h1>
        <p className="mt-2 text-sm text-parchment/65">Access your orders and saved checkout details.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="form-field">
            <span className="form-label">Email</span>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5" />
          </label>
          <label className="form-field">
            <span className="form-label">Password</span>
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5" />
          </label>
          <button type="submit" disabled={loading} className="btn-gold w-full rounded-full disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-parchment/65">
          New customer? <Link to="/register" className="text-gold hover:underline">Create account</Link>
        </p>
        <p className="mt-3 text-center text-xs text-parchment/45">
          Staff member? <Link to="/admin/login" className="text-gold-light/80 hover:text-gold-light">Admin portal</Link>
        </p>
      </div>
    </div>
  );
}
