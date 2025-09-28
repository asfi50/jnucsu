"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Chrome } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Add your login logic here
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Login data:", { ...formData, rememberMe });
      // Handle successful login - redirect to dashboard
      // router.push('/dashboard') or window.location.href = '/dashboard'
    } catch (error) {
      console.error("Login error:", error);
      // Handle login error - show error message
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Add Google OAuth logic here
    console.log("Google login clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}

      {/* Hero Section */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back to JnU<span className="text-orange-500">CSU</span>
            </h1>
            <p className="text-gray-600">Sign in to your leader account and manage your profile</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">Access your leadership dashboard</p>
          </div>

          {/* Google Login Button */}
          <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center space-x-2 border border-gray-300 hover:border-gray-400 text-gray-700 py-2.5 px-4 rounded-lg transition-colors mb-6">
            <Chrome className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors" placeholder="Enter your email" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input id="password" name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors" placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input id="remember" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <Link href="/auth/forgot-password" className="text-sm text-orange-600 hover:text-orange-700">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/auth/leader/signup" className="text-orange-600 hover:text-orange-700 font-medium">
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">Sign in to access your leadership dashboard, manage your profile, and connect with the JnUCSU community.</p>
        </div>

        {/* Security Notice */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0">
              <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-800">Secure Login</h4>
              <p className="text-sm text-blue-600 mt-1">Your credentials are encrypted and securely transmitted. We never store your password in plain text.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
