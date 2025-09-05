'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export default function SetupPage() {
  const [formData, setFormData] = useState({
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    company: 'Test TV Network',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/setup/test-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Test user created successfully! You can now login with these credentials.');
        toast({
          title: 'Success',
          description: 'Test user created successfully',
        });
      } else {
        setMessage(data.error || 'Failed to create test user');
        toast({
          title: 'Error',
          description: data.error || 'Failed to create test user',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Setup error:', error);
      setMessage('An error occurred while creating test user');
      toast({
        title: 'Error',
        description: 'An error occurred while creating test user',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            EPG Manager Setup
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create a test user to get started
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Create Test User</CardTitle>
            <CardDescription>
              This will create a test user account for you to login and explore the EPG Manager
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                />
              </div>
            </CardContent>
            
            <div className="p-6 pt-0">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating User...' : 'Create Test User'}
              </Button>
              
              <div className="mt-4 text-center text-sm">
                <a href="/login" className="text-blue-600 hover:underline">
                  Go to Login Page
                </a>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}