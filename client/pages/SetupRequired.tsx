/**
 * Setup Required Page - Shows when Supabase is not configured
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Database,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Settings,
  Key,
  Globe,
  ArrowRight,
  Copy,
  Eye
} from 'lucide-react';

export default function SetupRequired() {
  const [showEnvVars, setShowEnvVars] = React.useState(false);

  const envVarsToCopy = `# Supabase Configuration for Frontend
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# App Configuration  
VITE_APP_NAME=CoastalConnect
VITE_APP_URL=http://localhost:5173

# Analytics
VITE_ENABLE_ANALYTICS=true

# Development flags
VITE_DEBUG_MODE=true`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Database className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">CoastalConnect Setup</h1>
          </div>
          <p className="text-gray-600">Supabase configuration required to continue</p>
        </div>

        {/* Main Setup Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-orange-500" />
              <span>Database Setup Required</span>
            </CardTitle>
            <CardDescription>
              CoastalConnect requires Supabase for authentication and data. Follow these steps to get started.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Status Alert */}
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Supabase credentials not found. Please configure your environment variables.
              </AlertDescription>
            </Alert>

            {/* Setup Steps */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Setup Steps:</h3>
              
              {/* Step 1 */}
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-orange-50">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Create Supabase Project</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Go to supabase.com and create a new project
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Supabase
                  </Button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-blue-50">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Run Database Setup</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    In your Supabase SQL Editor, run the contents of <code>database/supabase.sql</code>
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    Creates tables, RLS policies, and storage buckets
                  </Badge>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-green-50">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Get API Credentials</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Copy your project URL and anon key from Settings > API
                  </p>
                  <div className="flex space-x-2 mt-2">
                    <Badge variant="outline">
                      <Key className="h-3 w-3 mr-1" />
                      Project URL
                    </Badge>
                    <Badge variant="outline">
                      <Key className="h-3 w-3 mr-1" />
                      Anon Key
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-purple-50">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Update Environment Variables</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Update your <code>.env.local</code> file with your Supabase credentials
                  </p>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Environment Variables:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowEnvVars(!showEnvVars)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {showEnvVars ? 'Hide' : 'Show'}
                      </Button>
                    </div>
                    
                    {showEnvVars && (
                      <div className="relative">
                        <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                          {envVarsToCopy}
                        </pre>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(envVarsToCopy)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">Quick Actions:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Create Supabase Project
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => window.open('/NETLIFY_DEPLOYMENT_GUIDE.md', '_blank')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Deployment Guide
                </Button>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-3">
                Check the deployment guide for detailed instructions and troubleshooting.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Complete database schema included</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Row Level Security (RLS) policies configured</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Real-time subscriptions ready</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Authentication & role-based access</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Once configured, refresh the page to see the modern CoastalConnect interface
          </p>
        </div>
      </div>
    </div>
  );
}