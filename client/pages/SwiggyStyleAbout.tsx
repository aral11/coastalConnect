/**
 * CoastalConnect - About Page with Dynamic Founder Information
 * Modern Swiggy-style design with comprehensive company details
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase, trackEvent } from '@/lib/supabase';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  Users,
  TrendingUp,
  Heart,
  Star,
  Zap,
  Shield,
  Target,
  Rocket,
  CheckCircle,
  ExternalLink,
  Download,
  Share2,
  Calendar,
  Building,
  Code,
  Coffee,
  Lightbulb,
  ArrowRight,
  MessageCircle,
  Linkedin,
  Twitter,
  Instagram,
  Github,
  Play,
  Eye,
  Crown,
  Sparkles,
  Clock,
  DollarSign,
  Camera,
  Mountain,
} from 'lucide-react';

interface CompanyInfo {
  founder: {
    name: string;
    title: string;
    bio: string;
    image: string;
    experience: string;
    education: string;
    vision: string;
    socialLinks: {
      linkedin?: string;
      twitter?: string;
      github?: string;
      instagram?: string;
    };
  };
  company: {
    name: string;
    tagline: string;
    mission: string;
    vision: string;
    founded: string;
    headquarters: string;
    team_size: number;
    services_count: number;
    cities_covered: number;
    customers_served: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    date: string;
  }>;
  values: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    office_hours: string;
  };
  stats: {
    total_bookings: number;
    verified_partners: number;
    cities: number;
    rating: number;
  };
}

export default function SwiggyStyleAbout() {
  const { user } = useAuth();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('founder');

  useEffect(() => {
    loadCompanyInfo();
    trackPageView();
  }, []);

  const loadCompanyInfo = async () => {
    try {
      setLoading(true);
      
      // Try to load from Supabase, fallback to static data
      const { data, error } = await supabase
        .from('company_info')
        .select('*')
        .single();

      if (error || !data) {
        // Fallback to static founder information as requested
        setCompanyInfo({
          founder: {
            name: "Aral Aldrin John D'Souza",
            title: "Founder & CEO, CoastalConnect",
            bio: "A passionate developer and entrepreneur from the beautiful coastal region of Karnataka. Aral recognized the untapped potential of coastal tourism and the challenges faced by local service providers in reaching travelers. With a background in technology and deep love for his homeland, he created CoastalConnect to bridge the gap between authentic local experiences and modern travelers.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format",
            experience: "5+ years in Software Development, 3+ years in Tourism Industry",
            education: "Bachelor's in Computer Science, Specialized in Mobile & Web Development",
            vision: "To make coastal Karnataka the most accessible and authentic travel destination in India, while empowering local communities through technology and sustainable tourism practices.",
            socialLinks: {
              linkedin: "https://linkedin.com/in/aral-dsouza",
              twitter: "https://twitter.com/araldsouza",
              github: "https://github.com/araldsouza",
              instagram: "https://instagram.com/aral_dsouza",
            }
          },
          company: {
            name: "CoastalConnect",
            tagline: "Your Gateway to Coastal Bliss",
            mission: "To revolutionize coastal tourism by connecting travelers with authentic local experiences while empowering communities through technology and sustainable practices.",
            vision: "To become India's leading platform for coastal tourism, showcasing the rich culture, pristine beaches, and warm hospitality of Karnataka's coastline to the world.",
            founded: "2023",
            headquarters: "Udupi, Karnataka, India",
            team_size: 12,
            services_count: 250,
            cities_covered: 8,
            customers_served: 1500,
          },
          achievements: [
            {
              id: "1",
              title: "Platform Launch",
              description: "Successfully launched CoastalConnect platform with 50+ verified partners",
              icon: "🚀",
              date: "March 2023"
            },
            {
              id: "2", 
              title: "1000+ Happy Travelers",
              description: "Reached milestone of serving over 1000 satisfied customers",
              icon: "🎉",
              date: "August 2023"
            },
            {
              id: "3",
              title: "Tourism Award Recognition",
              description: "Recognized by Karnataka Tourism for innovative digital platform",
              icon: "🏆",
              date: "November 2023"
            },
            {
              id: "4",
              title: "Partner Network Expansion",
              description: "Expanded to 8 coastal cities with 250+ verified service providers",
              icon: "🌟",
              date: "January 2024"
            }
          ],
          values: [
            {
              id: "1",
              title: "Authenticity",
              description: "We showcase genuine local experiences and support traditional businesses",
              icon: "🏮"
            },
            {
              id: "2",
              title: "Sustainability",
              description: "Promoting responsible tourism that benefits local communities",
              icon: "🌱"
            },
            {
              id: "3",
              title: "Innovation",
              description: "Using cutting-edge technology to enhance travel experiences",
              icon: "💡"
            },
            {
              id: "4",
              title: "Trust",
              description: "Building transparent relationships with travelers and partners",
              icon: "🤝"
            }
          ],
          contact: {
            email: "hello@coastalconnect.in",
            phone: "+91-9876543210",
            whatsapp: "+91-9876543210",
            address: "Innovation Hub, Manipal University, Udupi - 576104, Karnataka, India",
            office_hours: "Monday - Saturday: 9:00 AM - 6:00 PM IST"
          },
          stats: {
            total_bookings: 2847,
            verified_partners: 250,
            cities: 8,
            rating: 4.8
          }
        });
      } else {
        setCompanyInfo(data);
      }
    } catch (error) {
      console.error('Error loading company info:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackPageView = async () => {
    try {
      await trackEvent('about_page_viewed', {
        user_id: user?.id,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('Failed to track page view:', error);
    }
  };

  const handleContactClick = async (type: string, value: string) => {
    try {
      await trackEvent('contact_clicked', {
        contact_type: type,
        user_id: user?.id,
      });

      if (type === 'email') {
        window.location.href = `mailto:${value}`;
      } else if (type === 'phone' || type === 'whatsapp') {
        window.location.href = `tel:${value}`;
      }
    } catch (error) {
      console.warn('Failed to track contact click:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Loading About Us</h3>
              <p className="text-gray-600">Fetching our story...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!companyInfo) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Not Available</h2>
            <p className="text-gray-600">Unable to load company information.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="bg-white/20 text-white border-white/30 mb-6 px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                About CoastalConnect
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                Connecting You to
                <span className="block text-yellow-200">Coastal Magic</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                {companyInfo.company.mission}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-black text-white">{companyInfo.stats.total_bookings.toLocaleString()}+</div>
                  <div className="text-white/80 text-sm">Happy Travelers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white">{companyInfo.stats.verified_partners}+</div>
                  <div className="text-white/80 text-sm">Verified Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white">{companyInfo.stats.cities}</div>
                  <div className="text-white/80 text-sm">Cities Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white">{companyInfo.stats.rating}</div>
                  <div className="text-white/80 text-sm flex items-center justify-center">
                    <Star className="h-4 w-4 fill-current mr-1" />
                    Average Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto">
              {[
                { id: 'founder', label: 'Meet the Founder', icon: Users },
                { id: 'story', label: 'Our Story', icon: Heart },
                { id: 'achievements', label: 'Achievements', icon: Award },
                { id: 'values', label: 'Our Values', icon: Target },
                { id: 'contact', label: 'Contact Us', icon: MessageCircle },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeSection === tab.id
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Founder Section */}
          {activeSection === 'founder' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Founder</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  The visionary behind CoastalConnect's mission to transform coastal tourism
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {companyInfo.founder.name}
                      </h3>
                      <p className="text-lg text-orange-500 font-semibold mb-4">
                        {companyInfo.founder.title}
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        {companyInfo.founder.bio}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Building className="h-5 w-5 text-orange-500 mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Experience</h4>
                          <p className="text-gray-600">{companyInfo.founder.experience}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Award className="h-5 w-5 text-orange-500 mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Education</h4>
                          <p className="text-gray-600">{companyInfo.founder.education}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Lightbulb className="h-5 w-5 text-orange-500 mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Vision</h4>
                          <p className="text-gray-600">{companyInfo.founder.vision}</p>
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex space-x-4 pt-6">
                      {companyInfo.founder.socialLinks.linkedin && (
                        <a
                          href={companyInfo.founder.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {companyInfo.founder.socialLinks.twitter && (
                        <a
                          href={companyInfo.founder.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {companyInfo.founder.socialLinks.github && (
                        <a
                          href={companyInfo.founder.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                      {companyInfo.founder.socialLinks.instagram && (
                        <a
                          href={companyInfo.founder.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-200 transition-colors"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                    </div>

                    {/* Investment CTA */}
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                        <Rocket className="h-5 w-5 mr-2 text-orange-500" />
                        Looking for Investors
                      </h4>
                      <p className="text-gray-700 mb-4">
                        Join us in revolutionizing coastal tourism! We're seeking passionate investors who believe in sustainable tourism and technology-driven solutions.
                      </p>
                      <Button 
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => handleContactClick('email', companyInfo.contact.email)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Connect with Aral
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="order-1 lg:order-2">
                  <div className="relative">
                    <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                      <img
                        src={companyInfo.founder.image}
                        alt={companyInfo.founder.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Floating Achievement Cards */}
                    <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Code className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Tech Founder</div>
                          <div className="text-sm text-gray-600">Building for the future</div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Mountain className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Coastal Native</div>
                          <div className="text-sm text-gray-600">Born in Karnataka</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Company Story Section */}
          {activeSection === 'story' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  How CoastalConnect came to life and our journey so far
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <Card className="p-8">
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                      <Heart className="h-8 w-8 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {companyInfo.company.mission}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-8">
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <Eye className="h-8 w-8 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {companyInfo.company.vision}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Company Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Company Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-green-500" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Founded</h4>
                    <p className="text-gray-600">{companyInfo.company.founded}</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MapPin className="h-8 w-8 text-purple-500" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Headquarters</h4>
                    <p className="text-gray-600">{companyInfo.company.headquarters}</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Team Size</h4>
                    <p className="text-gray-600">{companyInfo.company.team_size} members</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-orange-500" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Services</h4>
                    <p className="text-gray-600">{companyInfo.company.services_count}+ active</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Achievements Section */}
          {activeSection === 'achievements' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Achievements</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Milestones that mark our journey towards transforming coastal tourism
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {companyInfo.achievements.map((achievement) => (
                  <Card key={achievement.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{achievement.title}</h3>
                          <span className="text-sm text-gray-500">{achievement.date}</span>
                        </div>
                        <p className="text-gray-700">{achievement.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Values Section */}
          {activeSection === 'values' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  The principles that guide everything we do at CoastalConnect
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {companyInfo.values.map((value) => (
                  <Card key={value.id} className="p-8 text-center hover:shadow-lg transition-shadow">
                    <div className="text-6xl mb-6">{value.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{value.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Contact Section */}
          {activeSection === 'contact' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Ready to explore coastal Karnataka or partner with us? We'd love to hear from you!
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div className="space-y-8">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <Mail className="h-6 w-6 text-orange-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Email</h4>
                          <button
                            onClick={() => handleContactClick('email', companyInfo.contact.email)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {companyInfo.contact.email}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Phone className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Phone</h4>
                          <button
                            onClick={() => handleContactClick('phone', companyInfo.contact.phone)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {companyInfo.contact.phone}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <MessageCircle className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                          <button
                            onClick={() => handleContactClick('whatsapp', companyInfo.contact.whatsapp)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {companyInfo.contact.whatsapp}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Address</h4>
                          <p className="text-gray-600">{companyInfo.contact.address}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Clock className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Office Hours</h4>
                          <p className="text-gray-600">{companyInfo.contact.office_hours}</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white justify-start">
                        <MessageCircle className="h-4 w-4 mr-3" />
                        Start a Conversation
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-3" />
                        Download Company Profile
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="h-4 w-4 mr-3" />
                        Schedule a Meeting
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Share2 className="h-4 w-4 mr-3" />
                        Share Our Story
                      </Button>
                    </div>
                  </Card>
                </div>

                {/* Map/Image Placeholder */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Find Us</h3>
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                        <p className="text-gray-600">Interactive map coming soon</p>
                        <p className="text-sm text-gray-500">Udupi, Karnataka</p>
                      </div>
                    </div>
                  </Card>

                  {/* Investment CTA */}
                  <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                    <div className="text-center">
                      <Crown className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Partner with Us
                      </h3>
                      <p className="text-gray-700 mb-6">
                        Interested in investing or partnering with CoastalConnect? 
                        Let's build the future of coastal tourism together.
                      </p>
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Rocket className="h-4 w-4 mr-2" />
                        Explore Partnership
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
