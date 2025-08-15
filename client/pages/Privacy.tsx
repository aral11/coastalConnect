import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="text-center">
              <Shield className="h-16 w-16 mx-auto text-green-500 mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
              <p className="text-lg text-gray-600">
                Last updated: January 2025
              </p>
            </div>
          </div>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-green-500" />
                CoastalConnect Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We collect information to provide better services to our users. The types of information we collect include:
                  </p>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Personal Information</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Name and contact details</li>
                        <li>• Email address and phone number</li>
                        <li>• Profile picture and preferences</li>
                        <li>• Payment information</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2">Usage Information</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Booking and search history</li>
                        <li>• Device and browser information</li>
                        <li>• Location data (with permission)</li>
                        <li>• Interaction with our platform</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Provide and improve our platform services</li>
                    <li>Process bookings and facilitate payments</li>
                    <li>Send booking confirmations and important updates</li>
                    <li>Provide customer support and assistance</li>
                    <li>Personalize your experience and recommendations</li>
                    <li>Protect against fraud and unauthorized access</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We may share your information in the following circumstances:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-gray-900">With Service Providers</h4>
                      <p className="text-gray-700">We share necessary booking details with hotels, restaurants, and other service providers to fulfill your reservations.</p>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-gray-900">With Payment Processors</h4>
                      <p className="text-gray-700">Payment information is shared with secure payment gateways to process transactions.</p>
                    </div>
                    
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Legal Requirements</h4>
                      <p className="text-gray-700">We may disclose information when required by law or to protect our rights and safety.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We implement appropriate security measures to protect your personal information:
                  </p>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Lock className="h-8 w-8 mx-auto text-red-500 mb-2" />
                      <h4 className="font-semibold">Encryption</h4>
                      <p className="text-sm text-gray-600">All data transmission is encrypted using SSL/TLS</p>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Database className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                      <h4 className="font-semibold">Secure Storage</h4>
                      <p className="text-sm text-gray-600">Data stored in secure, monitored environments</p>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Shield className="h-8 w-8 mx-auto text-green-500 mb-2" />
                      <h4 className="font-semibold">Access Control</h4>
                      <p className="text-sm text-gray-600">Strict access controls and authentication</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights and Choices</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You have several rights regarding your personal information:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                    <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We use cookies and similar technologies to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Remember your preferences and settings</li>
                    <li>Improve platform performance and functionality</li>
                    <li>Analyze usage patterns and trends</li>
                    <li>Provide personalized content and recommendations</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    You can control cookie settings through your browser preferences.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We retain your personal information only as long as necessary to provide our services and comply with legal obligations. Account data is typically retained for 7 years after account closure, while booking records may be kept longer for tax and legal purposes.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Our platform is not intended for children under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our platform and sending a notification to your registered email address.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                  <div className="bg-green-50 rounded-lg p-6">
                    <p className="text-gray-700 mb-4">
                      If you have any questions about this Privacy Policy or our data practices, please contact us:
                    </p>
                    <ul className="text-gray-700 space-y-2">
                      <li><strong>Email:</strong> privacy@coastalconnect.in</li>
                      <li><strong>Phone:</strong> +91-8105003858</li>
                      <li><strong>Address:</strong> Data Protection Officer, CoastalConnect, Udupi, Karnataka, India</li>
                    </ul>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="mt-8 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/terms">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Terms of Service
                </Button>
              </Link>
              <Link to="/contact">
                <Button>Contact Support</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
