'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (token) {
    if (role === 'PATIENT') {
      router.replace('/public');
    } else if (role === 'ADMIN') {
      router.replace('/admin/dashboards');
    } else if (role === 'DOCTOR') {
      router.replace('/doctor/dashboards');
    } else {
      router.replace('/');
    }
  }
}, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (formErrors[e.target.name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [e.target.name]: undefined });
    }
  };

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!form.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Invalid email format';
    }
    if (!form.password) {
      errors.password = 'Password is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/api/auth/login', form);
      const { accessToken, user } = response.data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('role', user.role);

      if (user.role === 'PATIENT') {
        router.push('/public');
      } else if (user.role === 'ADMIN') {
        router.push('/admin/dashboards');
      } else if (user.role === 'DOCTOR') {
        router.push('/doctor/dashboards');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white p-8 rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-80 border border-white border-opacity-20">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Login</h1>
          <p className="text-gray-500 text-center mb-8">Sign in to continue to your account</p>
          
          <form onSubmit={handleLogin} noValidate>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                  formErrors.email 
                    ? 'border-red-400 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-purple-500 focus:ring-purple-200'
                }`}
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
              {formErrors.email && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {formErrors.email}
                </motion.p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                    formErrors.password 
                      ? 'border-red-400 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-purple-500 focus:ring-purple-200'
                  }`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-purple-600 focus:outline-none transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {formErrors.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {formErrors.password}
                </motion.p>
              )}
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-xl font-medium text-white shadow-md transition-all ${
                isSubmitting
                  ? 'bg-purple-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => router.push('/register')}
                className="text-purple-600 hover:text-purple-800 font-medium transition-colors focus:outline-none"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}