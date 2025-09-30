'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { useToast } from '@/components/ui/ToastProvider';
import { useAuth } from '@/lib/contexts/AuthContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const { showToast } = useToast();
  const { resetPassword } = useAuth();

  const validateForm = () => {
    const newErrors: { email?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const success = await resetPassword(email);
      
      if (success) {
        setEmailSent(true);
        showToast({
          type: 'success',
          title: 'Reset Email Sent!',
          message: 'Check your email for reset instructions.'
        });
      } else {
        showToast({
          type: 'error',
          title: 'Reset Failed',
          message: 'Unable to send reset email. Please try again.'
        });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      showToast({
        type: 'error',
        title: 'Reset Failed',
        message: 'Something went wrong. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {!emailSent ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="bg-orange-500 text-white font-bold text-xl px-3 py-1 rounded">
                      JnU
                    </div>
                    <span className="font-semibold text-gray-900 text-xl">CSU</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                  <p className="text-gray-600">
                    Enter your email address and we&apos;ll send you instructions to reset your password.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    icon={<Mail className="w-4 h-4" />}
                  />

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? <Loader size="sm" /> : 'Send Reset Instructions'}
                  </Button>
                </form>

                {/* Back to login */}
                <div className="mt-6 text-center">
                  <Link 
                    href="/auth/login" 
                    className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="bg-orange-500 text-white font-bold text-xl px-3 py-1 rounded">
                      JnU
                    </div>
                    <span className="font-semibold text-gray-900 text-xl">CSU</span>
                  </div>
                  
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                  <p className="text-gray-600 mb-6">
                    We&apos;ve sent password reset instructions to{' '}
                    <span className="font-medium text-gray-900">{email}</span>
                  </p>
                  
                  <div className="space-y-4">
                    <Button
                      onClick={() => {
                        setEmailSent(false);
                        setEmail('');
                      }}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      Send Another Email
                    </Button>
                    
                    <Link href="/auth/login">
                      <Button variant="outline" className="w-full" size="lg">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Help text */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Having trouble?{' '}
            <Link 
              href="/contact" 
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;