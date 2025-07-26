import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  ArrowLeft,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Book,
  HelpCircle,
  User,
  CreditCard,
  MapPin,
  Shield,
  FileText
} from 'lucide-react';

const faqCategories = [
  {
    id: 'booking',
    title: 'Booking & Reservations',
    icon: Book,
    faqs: [
      {
        question: 'How do I make a booking?',
        answer: 'You can make a booking by browsing our services, selecting your preferred option, choosing dates, and completing the payment process. You\'ll receive a confirmation email with all the details.'
      },
      {
        question: 'Can I modify or cancel my booking?',
        answer: 'Yes, you can modify or cancel your booking up to 24 hours before the service date. Log into your account and go to "My Bookings" to make changes.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. All payments are processed securely.'
      },
      {
        question: 'Do I get a booking confirmation?',
        answer: 'Yes, you\'ll receive an instant booking confirmation via email and SMS with all the details including service provider contact information.'
      }
    ]
  },
  {
    id: 'account',
    title: 'Account & Profile',
    icon: User,
    faqs: [
      {
        question: 'How do I create an account?',
        answer: 'Click on "Sign Up" and provide your name, email, and phone number. You\'ll receive a verification code to activate your account.'
      },
      {
        question: 'I forgot my password',
        answer: 'Click on "Forgot Password" on the login page and enter your email. We\'ll send you a reset link to create a new password.'
      },
      {
        question: 'How do I update my profile information?',
        answer: 'Log into your account and go to "Profile Settings" where you can update your personal information, contact details, and preferences.'
      },
      {
        question: 'Can I delete my account?',
        answer: 'Yes, you can delete your account by contacting our support team. Please note that this action cannot be undone.'
      }
    ]
  },
  {
    id: 'payment',
    title: 'Payments & Refunds',
    icon: CreditCard,
    faqs: [
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, we use industry-standard encryption and secure payment gateways. We don\'t store your payment information on our servers.'
      },
      {
        question: 'How do refunds work?',
        answer: 'Refunds are processed according to our cancellation policy. Approved refunds typically take 5-7 business days to reflect in your account.'
      },
      {
        question: 'What if I\'m charged incorrectly?',
        answer: 'Contact our support team immediately with your booking details. We\'ll investigate and resolve any billing discrepancies promptly.'
      },
      {
        question: 'Can I get a receipt for my booking?',
        answer: 'Yes, you can download invoices and receipts from your account dashboard under "My Bookings".'
      }
    ]
  },
  {
    id: 'services',
    title: 'Services & Locations',
    icon: MapPin,
    faqs: [
      {
        question: 'What areas do you cover?',
        answer: 'We cover major coastal destinations in Karnataka including Mangalore, Udupi, Karwar, Gokarna, and surrounding areas.'
      },
      {
        question: 'How do I find services in my area?',
        answer: 'Use our location filter on the homepage or browse by category. You can also search for specific services or locations.'
      },
      {
        question: 'Are all service providers verified?',
        answer: 'Yes, all our service providers go through a verification process including background checks and quality assessments.'
      },
      {
        question: 'What if I\'m not satisfied with a service?',
        answer: 'Contact us within 24 hours of your experience. We\'ll work with you and the service provider to resolve any issues.'
      }
    ]
  }
];

const quickActions = [
  {
    title: 'Contact Support',
    description: 'Speak with our support team',
    icon: MessageCircle,
    action: '/contact',
    color: 'bg-blue-500'
  },
  {
    title: 'Call Us',
    description: '+91 9876543210',
    icon: Phone,
    action: 'tel:+919876543210',
    color: 'bg-green-500'
  },
  {
    title: 'Email Support',
    description: 'hello@coastalconnect.in',
    icon: Mail,
    action: 'mailto:hello@coastalconnect.in',
    color: 'bg-orange-500'
  },
  {
    title: 'Safety Guidelines',
    description: 'Travel safety tips',
    icon: Shield,
    action: '/safety',
    color: 'bg-purple-500'
  }
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Page Header */}
        <PageHeader
          title="Help Center"
          subtitle="Find answers to common questions and get the support you need"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Help Center', href: '/help' }
          ]}
        />

        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.action}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* FAQ Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {faqCategories.map((category) => (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all ${
                  selectedCategory === category.id 
                    ? 'ring-2 ring-orange-500 bg-orange-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
              >
                <CardContent className="p-6 text-center">
                  <category.icon className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900">{category.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {category.faqs.length} questions
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Content */}
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or browse our categories above.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredFAQs.map((category) => (
                  <Card key={category.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <category.icon className="h-5 w-5 text-orange-500" />
                        <span>{category.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="space-y-2">
                        {category.faqs.map((faq, index) => (
                          <AccordionItem key={index} value={`${category.id}-${index}`}>
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Still Need Help */}
          <Card className="max-w-2xl mx-auto mt-12 bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Still need help?</h3>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Contact Support
                  </Button>
                </Link>
                <Link to="/feedback">
                  <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                    <FileText className="h-4 w-4 mr-2" />
                    Submit Feedback
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
