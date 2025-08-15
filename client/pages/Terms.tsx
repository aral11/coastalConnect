import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Shield, Scale } from "lucide-react";
import { Link } from "react-router-dom";

export default function Terms() {
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
              <FileText className="h-16 w-16 mx-auto text-blue-500 mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
              <p className="text-lg text-gray-600">
                Last updated: January 2025
              </p>
            </div>
          </div>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-5 w-5 mr-2 text-blue-500" />
                CoastalConnect Terms of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing and using CoastalConnect ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service govern your use of our platform and services related to accommodation booking, restaurant discovery, transportation services, and event experiences in coastal Karnataka.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    CoastalConnect is a marketplace platform that connects travelers with:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Hotels, resorts, and homestay providers</li>
                    <li>Local restaurants and dining establishments</li>
                    <li>Transportation and driver services</li>
                    <li>Event organizers and experience providers</li>
                    <li>Content creators and photography services</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    To use certain features of our platform, you must create an account. You agree to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Provide accurate and complete information during registration</li>
                    <li>Keep your account credentials secure and confidential</li>
                    <li>Update your information to keep it current</li>
                    <li>Be responsible for all activities under your account</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Booking and Payments</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    When you make a booking through our platform:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>You enter into a direct contract with the service provider</li>
                    <li>All payments are processed securely through our payment partners</li>
                    <li>Cancellation and refund policies are set by individual service providers</li>
                    <li>You agree to pay all charges incurred under your account</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Service Provider Responsibilities</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Service providers on our platform agree to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Provide accurate descriptions of their services</li>
                    <li>Honor confirmed bookings and reservations</li>
                    <li>Maintain quality standards and safety measures</li>
                    <li>Comply with local laws and regulations</li>
                    <li>Respond promptly to customer inquiries</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Prohibited Use</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You may not use our platform to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Post false, misleading, or fraudulent content</li>
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Distribute spam, malware, or harmful content</li>
                    <li>Interfere with the platform's operation or security</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these terms by reference. We implement appropriate security measures to protect your personal data.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
                  <p className="text-gray-700 leading-relaxed">
                    CoastalConnect acts as an intermediary platform. We are not liable for the quality, safety, or legality of services provided by third-party vendors. Our liability is limited to the maximum extent permitted by law.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Dispute Resolution</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Any disputes arising from the use of our platform will be resolved through binding arbitration in accordance with Indian law. The courts of Karnataka shall have exclusive jurisdiction for any legal proceedings.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or platform notification. Continued use of the platform constitutes acceptance of modified terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <p className="text-gray-700 mb-4">
                      If you have any questions about these Terms of Service, please contact us:
                    </p>
                    <ul className="text-gray-700 space-y-2">
                      <li><strong>Email:</strong> legal@coastalconnect.in</li>
                      <li><strong>Phone:</strong> +91-8105003858</li>
                      <li><strong>Address:</strong> CoastalConnect, Udupi, Karnataka, India</li>
                    </ul>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="mt-8 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/privacy">
                <Button variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Policy
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
