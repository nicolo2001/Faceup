import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Mail } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/ui/Button';

const SignupSuccess: React.FC = () => {
  const location = useLocation();
  const { email, requiresEmailConfirmation, userType } = location.state || {};

  if (!email) {
    return <Navigate to="/signup" replace />;
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Account created successfully!
          </h2>
          
          {requiresEmailConfirmation ? (
            <>
              <div className="mt-4 text-center">
                <div className="flex justify-center mb-4">
                  <Mail className="h-8 w-8 text-indigo-600" />
                </div>
                <p className="text-sm text-gray-600">
                  We've sent a confirmation email to:
                </p>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {email}
                </p>
                <p className="mt-4 text-sm text-gray-600">
                  Please check your email and click the confirmation link to activate your account.
                </p>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  Didn't receive the email?{' '}
                  <button className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Resend confirmation email
                  </button>
                </p>
              </div>
            </>
          ) : (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {userType === 'actor' ? (
                  'Your account is ready to use. You can now complete your actor profile.'
                ) : (
                  'Your account is ready to use. You can now start browsing and hiring actors.'
                )}
              </p>
              <div className="mt-6">
                <Link 
                  to={userType === 'actor' ? '/become-actor' : '/search'}
                  className="w-full"
                >
                  <Button fullWidth>
                    {userType === 'actor' ? 'Complete Your Profile' : 'Browse Actors'}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SignupSuccess;