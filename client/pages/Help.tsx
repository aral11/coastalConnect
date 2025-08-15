import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail,
  ChevronRight,
  Book,
  CreditCard,
  MapPin,
  Calendar,
  Shield,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

const faqCategories = [
  {
    title: "Bookings & Reservations",
    icon: <Calendar className="h-6 w-6" />,
    color: "bg-blue-100 text-blue-600",
    faqs: [
      {
        question: "How do I make a booking?",
        answer: "You can make a booking by browsing our services, selecting your preferred option, and clicking 'Book Now'. Follow the booking flow to complete your reservation."
      },
      {
        question: "Can I cancel or modify my booking?",
        answer: "Cancellation and modification policies vary by service provider. Please check the specific terms when booking or contact customer support."
      },
      {
        question: "How do I get booking confirmation?",
        answer: "You'll receive a confirmation email immediately after booking. You can also view your bookings in your dashboard."
      }
    ]
  },
  {
    title: "Payments & Billing",
    icon: <CreditCard className="h-6 w-6" />,
    color: "bg-green-100 text-green-600",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, debit cards, net banking, UPI, and digital wallets through our secure payment gateway."
      },
      {
        question: "Is my payment information secure?",
        answer: "Yes, all payments are processed through secure, encrypted channels. We don't store your payment information."
      },
      {
        question: "Can I get a refund?",
        answer: "Refund policies depend on the service provider and booking terms. Please contact support for assistance with refund requests."
      }
    ]
  },
  {
    title: "Account & Profile",
    icon: <Shield className="h-6 w-6" />,
    color: "bg-purple-100 text-purple-600",
    faqs: [
      {
        question: "How do I create an account?",
        answer: "Click 'Sign Up' in the top navigation, fill in your details, and verify your email address to activate your account."
      },
      {
        question: "I forgot my password",
        answer: "Use the 'Forgot Password' link on the login page to reset your password via email."
      },
      {
        question: "How do I update my profile?",
        answer: "Go to your dashboard and click on profile settings to update your personal information."
      }
    ]
  }
];

const quickHelp = [
  {
    title: "Contact Support",
    description: "Get help from our customer service team",
    icon: <MessageCircle className="h-8 w-8" />,
    action: "Chat Now",
    href: "/contact",
    color: "bg-blue-500 hover:bg-blue-600"
  },
  {
    title: "Call Us",
    description: "Speak directly with our support team",
    icon: <Phone className="h-8 w-8" />,
    action: "Call +91-8105003858",
    href: "tel:+918105003858",
    color: "bg-green-500 hover:bg-green-600"
  },
  {
    title: "Email Support",
    description: "Send us your questions via email",
    icon: <Mail className="h-8 w-8" />,
    action: "Email Us",
    href: "mailto:support@coastalconnect.in",
    color: "bg-orange-500 hover:bg-orange-600"
  }
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(
      faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }));

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-xl text-gray-600 mb-8">
              Find answers to common questions or get in touch with our support team
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>

          {/* Quick Help */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {quickHelp.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${item.color} text-white rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  {item.href.startsWith('http') || item.href.startsWith('tel:') || item.href.startsWith('mailto:') ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      <Button className={item.color}>{item.action}</Button>
                    </a>
                  ) : (
                    <Link to={item.href}>
                      <Button className={item.color}>{item.action}</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Categories */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            {filteredFAQs.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedCategory(selectedCategory === categoryIndex ? null : categoryIndex)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center`}>
                        {category.icon}
                      </div>
                      <div>
                        <CardTitle>{category.title}</CardTitle>
                        <CardDescription>{category.faqs.length} questions</CardDescription>
                      </div>
                    </div>
                    <ChevronRight 
                      className={`h-5 w-5 transform transition-transform ${
                        selectedCategory === categoryIndex ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                </CardHeader>
                
                {selectedCategory === categoryIndex && (
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {category.faqs.map((faq, faqIndex) => (
                        <div key={faqIndex} className="border-l-4 border-blue-200 pl-4">
                          <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Still Need Help */}
          <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-8 text-center">
              <HelpCircle className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Our support team is here to help you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg">Contact Support</Button>
                </Link>
                <Link to="/visit-udupi-guide">
                  <Button variant="outline" size="lg">
                    <Book className="h-4 w-4 mr-2" />
                    Visit Udupi Guide
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
