/**
 * About CoastalConnect - Comprehensive Company Information
 * Founder: Aral Aldrin John D'Souza
 */

import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Heart,
  Users,
  Star,
  Award,
  Target,
  Eye,
  Rocket,
  Coffee,
  Camera,
  Code,
  Building,
  MessageCircle,
  Calendar,
  Gift,
  BookOpen,
  TrendingUp,
  Zap,
  Shield,
  ExternalLink
} from "lucide-react";

export default function AboutCoastalConnect() {
  const achievements = [
    {
      icon: <Camera className="h-6 w-6" />,
      number: "125+",
      title: "Episodes",
      description: "Featuring coastal changemakers and entrepreneurs"
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      number: "50+",
      title: "Startups Supported",
      description: "Through digital promotion and mentorship"
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      number: "25+",
      title: "Events Organized",
      description: "In India & UK promoting coastal culture"
    },
    {
      icon: <Gift className="h-6 w-6" />,
      number: "90+",
      title: "Ration Kits",
      description: "Distributed during COVID-19 pandemic"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      number: "20+",
      title: "Students Funded",
      description: "Education support for coastal youth"
    },
    {
      icon: <Users className="h-6 w-6" />,
      number: "10k+",
      title: "Lives Impacted",
      description: "Through our various initiatives"
    }
  ];

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Community First",
      description: "Every decision we make puts our coastal community at the center"
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Trust & Safety",
      description: "Verified services and secure transactions for peace of mind"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Innovation",
      description: "Using technology to preserve culture and boost local economy"
    },
    {
      icon: <Star className="h-8 w-8 text-purple-500" />,
      title: "Excellence",
      description: "Curating only the best experiences coastal Karnataka has to offer"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-500 to-red-600 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
                <Zap className="h-5 w-5 mr-2" />
                Currently in Testing Mode
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                About coastal<span className="text-orange-200">Connect</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
                "To You, From the Coast" - Bringing the heartbeat of coastal Karnataka to the world
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button 
                  size="lg" 
                  className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 text-lg font-medium"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Us
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 text-lg font-medium"
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Coastal Vibes
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                    <Code className="h-4 w-4 mr-2" />
                    Founder & Developer
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Meet Aral Aldrin John D'Souza
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Techie, Developer & Coastal Culture Champion
                  </p>
                </div>

                <div className="prose prose-lg text-gray-600">
                  <p>
                    Aral is a passionate developer and entrepreneur who built CoastalConnect from the ground up. 
                    As a techie with deep roots in coastal Karnataka, he recognized the need for a platform that 
                    could authentically showcase the region's rich culture, talented people, and growing businesses.
                  </p>
                  <p>
                    Through his media initiative "Coastal Vibes India," Aral has been documenting and promoting 
                    coastal stories for years. CoastalConnect is the natural evolution - a technology platform 
                    that empowers the community while preserving its cultural essence.
                  </p>
                </div>

                <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
                    Looking for Investors
                  </h3>
                  <p className="text-gray-700">
                    We're seeking passionate investors who believe in our mission to empower coastal communities 
                    through technology. Join us in building the future of authentic coastal tourism and 
                    community-driven commerce.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl p-8 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">AD</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Aral Aldrin John D'Souza
                  </h3>
                  <p className="text-orange-600 font-medium mb-4">Founder & CEO</p>
                  <p className="text-gray-600 mb-6">
                    "Technology should amplify culture, not replace it. CoastalConnect is our commitment 
                    to authentic growth."
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-center text-gray-700">
                      <Building className="h-4 w-4 mr-2" />
                      <span>Kemmannu, Coastal Karnataka</span>
                    </div>
                    <div className="flex items-center justify-center text-gray-700">
                      <Globe className="h-4 w-4 mr-2" />
                      <span>Coastal Vibes India</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Vision & Mission
              </h2>
              <p className="text-xl text-gray-600">
                Driving authentic growth while preserving coastal culture
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Vision */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-600 text-center leading-relaxed">
                    To bring the heartbeat of the coastal region to the world – through its vibrant culture, 
                    untold stories, local talents, and growing businesses.
                  </p>
                </CardContent>
              </Card>

              {/* Mission */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-600 text-center leading-relaxed">
                    To empower youth, entrepreneurs, and creatives by providing a platform that inspires, 
                    uplifts, and creates real impact in the community.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What We've Achieved
              </h2>
              <p className="text-xl text-gray-600">
                Continuing our impact journey, one story at a time
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {achievements.map((achievement, index) => (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
                      {achievement.icon}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {achievement.number}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600">
                      {achievement.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Get In Touch
              </h2>
              <p className="text-xl text-gray-600">
                Ready to join our coastal community? Let's connect!
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Email */}
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>coastalconnect@gmail.com</p>
                    <p>araldsouza20@gmail.com</p>
                  </div>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Phone className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Call / WhatsApp</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>+91 8105 003 858</p>
                    <p className="text-sm">Available 24/7</p>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Office</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>Kemmannu</p>
                    <p>Coastal Karnataka</p>
                  </div>
                </CardContent>
              </Card>

              {/* Website */}
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Globe className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Coastal Vibes</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>coastalvibes.in</p>
                    <p className="text-sm">Our media platform</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Experience Coastal Karnataka?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of travelers and locals connecting through authentic coastal experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-orange-500 hover:bg-orange-50 px-8 py-3 text-lg font-medium"
              >
                Explore Services
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3 text-lg font-medium"
              >
                Become a Partner
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
