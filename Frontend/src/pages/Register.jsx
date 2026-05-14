import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container flex min-h-[60vh] items-center justify-center py-10">
      <div className="panel-dark w-full max-w-md rounded-xl p-6 sm:p-8">
        <p className="section-eyebrow">Join Barakah Scents</p>
        <h1 className="page-title">Create account</h1>
        <p className="mt-2 text-sm text-parchment/65">Register to track orders and checkout faster.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="form-field">
            <span className="form-label">Full name</span>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5" />
          </label>
          <label className="form-field">
            <span className="form-label">Email</span>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5" />
          </label>
          <label className="form-field">
            <span className="form-label">Password</span>
            <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5" />
          </label>
          <button type="submit" disabled={loading} className="btn-gold w-full rounded-full disabled:opacity-50">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-parchment/65">
          Already registered? <Link to="/login" className="text-gold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
