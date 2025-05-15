import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, Video, Users } from 'lucide-react';
import { z } from 'zod';
import MainLayout from '../../layouts/MainLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { signupSchema } from '../../lib/validation';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '' as 'creator' | 'actor' | ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    try {
      signupSchema.parse(formData);
      if (!formData.userType) {
        setErrors(prev => ({ ...prev, userType: 'Please select a user type' }));
        return false;
      }
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

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSignup = async (retryCount = 0): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            user_type: formData.userType
          }
        }
      });

      if (signUpError) {
        // Handle specific error cases
        if (signUpError.message.includes('User already registered')) {
          return {
            success: false,
            error: 'An account with this email already exists. Please sign in or reset your password.'
          };
        }

        // For database errors, attempt retry if within limits
        if (signUpError.message.includes('Database error') && retryCount < MAX_RETRIES) {
          await delay(RETRY_DELAY);
          return handleSignup(retryCount + 1);
        }

        throw signUpError;
      }

      if (data.user) {
        return { success: true };
      }

      return {
        success: false,
        error: 'Failed to create account. Please try again.'
      };
    } catch (err) {
      if (err instanceof Error) {
        return {
          success: false,
          error: err.message
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await handleSignup();

      if (!result.success) {
        setServerError(result.error || 'Failed to create account');
        return;
      }

      navigate('/signup-success', { 
        state: { 
          email: formData.email,
          requiresEmailConfirmation: true,
          userType: formData.userType
        }
      });
    } catch (err) {
      setServerError('An unexpected error occurred. Please try again later.');
      console.error('Signup error:', err);
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
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
              {/* User Type Selection */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                    formData.userType === 'creator'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-indigo-200'
                  }`}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, userType: 'creator' }));
                    if (errors.userType) {
                      setErrors(prev => ({ ...prev, userType: '' }));
                    }
                  }}
                >
                  <Users className="h-8 w-8 mb-2" />
                  <span className="font-medium">Content Creator</span>
                  <span className="text-xs text-gray-500 mt-1">Create video content</span>
                </button>

                <button
                  type="button"
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                    formData.userType === 'actor'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-indigo-200'
                  }`}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, userType: 'actor' }));
                    if (errors.userType) {
                      setErrors(prev => ({ ...prev, userType: '' }));
                    }
                  }}
                >
                  <Video className="h-8 w-8 mb-2" />
                  <span className="font-medium">Video Actor</span>
                  <span className="text-xs text-gray-500 mt-1">Perform in videos</span>
                </button>
              </div>
              {errors.userType && (
                <p className="text-sm text-red-600 mt-1">{errors.userType}</p>
              )}

              <Input
                id="name"
                name="name"
                type="text"
                label="Full name"
                required
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                icon={<User className="h-5 w-5 text-gray-400" />}
              />

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

              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={<Lock className="h-5 w-5 text-gray-400" />}
              />

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <Link to="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button type="submit" fullWidth isLoading={isLoading}>
                Create account
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Signup;