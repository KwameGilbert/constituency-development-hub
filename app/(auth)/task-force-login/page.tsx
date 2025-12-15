'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Shield, 
  Users,
  CheckCircle,
  AlertTriangle 
} from 'lucide-react';

export default function TaskForceLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation
      if (formData.email === 'admin@taskforce.gov.gh' && formData.password === 'admin123') {
        // Redirect to task force dashboard main page
        router.push('/task-force-dashboard/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="h-screen overflow-hidden flex">
      {/* Right side - Branding/Information */}
      <div className="hidden lg:flex lg:w-3/5 xl:w-3/5 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="w-full pr-8">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-white/20 bg-opacity-20 rounded-full mr-4">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Task Force Portal</h1>
                <p className="text-purple-200">Assessment & Management System</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-6">
              Streamline Constituency Issue Assessment and Community Development Initiatives
            </h2>
            <p className="text-lg text-purple-100 mb-8">
              Efficiently manage, assess, and track constituency development issues with our comprehensive task force management system designed for modern governance and community engagement.
            </p>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-300 mr-3" />
                <span>Centralized Issue Tracking and Management</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-300 mr-3" />
                <span>Advanced Assessment and Evaluation Tools</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-300 mr-3" />
                <span>Comprehensive Analytics and Reporting</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-300 mr-3" />
                <span>Team Performance and Progress Tracking</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute bottom-0 right-0 opacity-10">
          <svg width="404" height="404" fill="none" viewBox="0 0 404 404">
            <defs>
              <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" fill="currentColor"/>
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#pattern)"/>
          </svg>
        </div>
      </div>

      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 pt-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-purple-100 rounded-full">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Task Force Portal</h2>
            <p className="mt-2 text-gray-600">
              Sign in to access the Assessment Dashboard
            </p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Enter your task force credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <button 
                    type="button"
                    className="text-sm text-purple-600 hover:text-purple-500"
                    onClick={() => alert('Contact your system administrator to reset your password.')}
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Access Dashboard'}
                </Button>

                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600">
                    Need access?{' '}
                    <button
                      type="button"
                      onClick={() => alert('Contact your system administrator for account access.')}
                      className="text-purple-600 hover:text-purple-500 font-medium"
                    >
                      Contact Administrator
                    </button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          {/* <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-xs font-medium text-blue-900 mb-2">Demo Credentials</p>
                <div className="space-y-1 text-xs text-blue-800">
                  <p>Email: admin@taskforce.gov.gh</p>
                  <p>Password: admin123</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}