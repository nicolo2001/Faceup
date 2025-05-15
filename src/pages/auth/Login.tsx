import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import MainLayout from '../../layouts/MainLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { loginSchema } from '../../lib/validation';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    if (failedAttempts >= 5) {
      setServerError('Too many failed attempts. Please try again later or reset your password.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error('Login error:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          setServerError('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setServerError('Please verify your email address before logging in. Check your inbox for the verification email.');
        } else {
          setServerError('An error occurred during login. Please try again.');
        }
        
        setFailedAttempts(prev => prev + 1);
        return;
      }

      if (data.user) {
        // Get user profile to determine redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .single();

        // Clear any stored failed attempts
        setFailedAttempts(0);

        // Determine redirect path
        const returnTo = location.state?.returnTo;
        if (returnTo) {
          navigate(returnTo);
        } else if (profile?.user_type === 'actor') {
          navigate('/actor/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setServerError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {serverError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                <p className="text-sm text-red-600">{serverError}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <Input
                id="email"
                name="email"
                type="email"
                label="Email address"
                required
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail className="h-5 w-5 text-gray-400" />}
              />

              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                required
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<Lock className="h-5 w-5 text-gray-400" />}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button type="submit" fullWidth isLoading={isLoading}>
                Sign in
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;