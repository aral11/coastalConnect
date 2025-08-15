import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Shield, Users, BarChart3, Settings, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { user, hasRole } = useAuth();

  if (!hasRole("admin")) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You don't have administrator privileges to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-red-600">Administrator</span>
              </div>
            </div>
          </div>

          {/* Coming Soon Content */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-dashed border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <Users className="h-5 w-5 mr-2" />
                  User Management
                </CardTitle>
                <CardDescription>Manage users, vendors, and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <p className="text-orange-700 font-medium">Coming Soon</p>
                  <p className="text-sm text-orange-600">User management interface under development</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Analytics
                </CardTitle>
                <CardDescription>Platform statistics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-blue-700 font-medium">Coming Soon</p>
                  <p className="text-sm text-blue-600">Analytics dashboard in development</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Settings className="h-5 w-5 mr-2" />
                  System Settings
                </CardTitle>
                <CardDescription>Configure platform settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-green-700 font-medium">Coming Soon</p>
                  <p className="text-sm text-green-600">Settings panel coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Users className="h-6 w-6 mb-2" />
                    View Users
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    View Reports
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Settings className="h-6 w-6 mb-2" />
                    Settings
                  </Button>
                  <Link to="/services">
                    <Button variant="outline" className="h-20 flex-col w-full">
                      <Shield className="h-6 w-6 mb-2" />
                      Manage Services
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
