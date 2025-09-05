import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            EPG Manager
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional Electronic Program Guide management system for TV channels and streaming services
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="px-8 py-3">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Sign Up
              </Button>
            </Link>
            <Link href="/setup">
              <Button variant="secondary" size="lg" className="px-8 py-3">
                Setup Demo
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📺 Channel Management
              </CardTitle>
              <CardDescription>
                Manage all your TV channels in one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Add and organize channels</li>
                <li>• Support for multiple languages</li>
                <li>• Channel categorization</li>
                <li>• Logo and metadata management</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📅 Schedule Management
              </CardTitle>
              <CardDescription>
                Create and manage program schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Drag-and-drop scheduling</li>
                <li>• Recurring program support</li>
                <li>• Real-time schedule updates</li>
                <li>• Conflict detection</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎬 Program Library
              </CardTitle>
              <CardDescription>
                Organize your program content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Program metadata management</li>
                <li>• Content categorization</li>
                <li>• Duration and rating tracking</li>
                <li>• Image and description support</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 Schedule Templates
              </CardTitle>
              <CardDescription>
                Save and reuse schedule patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Create weekly templates</li>
                <li>• Quick schedule copying</li>
                <li>• Template sharing</li>
                <li>• Bulk scheduling</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔄 Copy Features
              </CardTitle>
              <CardDescription>
                Efficient content duplication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Copy schedules between channels</li>
                <li>• Duplicate program entries</li>
                <li>• Batch operations</li>
                <li>• Smart time adjustments</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🌐 Multi-Language Support
              </CardTitle>
              <CardDescription>
                Perfect for Indian TV channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Hindi, Tamil, Telugu support</li>
                <li>• Regional language content</li>
                <li>• Language-based filtering</li>
                <li>• Cultural calendar integration</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Ready to streamline your EPG management?
          </h2>
          <Link href="/register">
            <Button size="lg" className="px-12 py-4 text-lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}