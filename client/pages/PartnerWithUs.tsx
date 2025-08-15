/**
 * Partner With Us - Join CoastalConnect
 * Modern registration and information page for potential partners
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase, trackEvent } from "@/lib/supabase";
import {
  MapPin,
  Star,
  Users,
  TrendingUp,
  Shield,
  Award,
  Phone,
  Mail,
  ChevronRight,
  Check,
  Zap,
  Crown,
  DollarSign,
  Calendar,
  Heart,
  Camera,
  Building,
  Car,
  UtensilsCrossed,
  PartyPopper,
  Home,
} from "lucide-react";

export default function PartnerWithUs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPartnerType, setSelectedPartnerType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    location: "",
    message: "",
  });

  const partnerTypes = [
    {
      id: "accommodation",
      title: "Hotels & Homestays",
      icon: <Home className="h-8 w-8" />,
      description: "List your property and welcome travelers",
      benefits: ["24/7 booking system", "Digital payment processing", "Guest management tools"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "restaurant",
      title: "Restaurants & Cafes",
      icon: <UtensilsCrossed className="h-8 w-8" />,
      description: "Showcase your culinary offerings",
      benefits: ["Online menu management", "Table booking system", "Customer reviews"],
      color: "from-orange-500 to-red-500",
    },
    {
      id: "transport",
      title: "Transport Services",
      icon: <Car className="h-8 w-8" />,
      description: "Offer reliable transportation",
      benefits: ["Route management", "Real-time tracking", "Secure payments"],
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "wellness",
      title: "Wellness & Spa",
      icon: <Heart className="h-8 w-8" />,
      description: "Provide relaxation and wellness services",
      benefits: ["Appointment scheduling", "Service packages", "Client management"],
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "events",
      title: "Event Services",
      icon: <PartyPopper className="h-8 w-8" />,
      description: "Organize memorable experiences",
      benefits: ["Event planning tools", "Vendor coordination", "Booking management"],
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "creator",
      title: "Content Creators",
      icon: <Camera className="h-8 w-8" />,
      description: "Showcase your creative talents",
      benefits: ["Portfolio showcase", "Booking calendar", "Client communication"],
      color: "from-indigo-500 to-purple-500",
    },
  ];

  const platformBenefits = [
    { icon: <Users className="h-6 w-6" />, title: "Growing Customer Base", description: "Access thousands of travelers" },
    { icon: <Shield className="h-6 w-6" />, title: "Secure Platform", description: "Safe and verified transactions" },
    { icon: <TrendingUp className="h-6 w-6" />, title: "Business Growth", description: "Analytics and insights" },
    { icon: <Star className="h-6 w-6" />, title: "Quality Assurance", description: "Verified reviews and ratings" },
    { icon: <Zap className="h-6 w-6" />, title: "Instant Bookings", description: "Real-time booking system" },
    { icon: <DollarSign className="h-6 w-6" />, title: "Competitive Rates", description: "Low commission fees" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Track partnership inquiry
      await trackEvent("partnership_inquiry", {
        partner_type: selectedPartnerType,
        business_name: formData.businessName,
        user_id: user?.id,
      });

      // Insert partnership inquiry into database
      const { error } = await supabase.from("partnership_inquiries").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        business_name: formData.businessName,
        business_type: selectedPartnerType,
        location: formData.location,
        message: formData.message,
        user_id: user?.id,
        status: "pending",
      });

      if (error) throw error;

      // Reset form and show success
      setFormData({
        name: "",
        email: "",
        phone: "",
        businessName: "",
        businessType: "",
        location: "",
        message: "",
      });
      setSelectedPartnerType("");
      
      alert("Thank you for your interest! We'll contact you within 24 hours.");
    } catch (error) {
      console.error("Error submitting partnership inquiry:", error);
      alert("Something went wrong. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="bg-orange-500 text-white border-0 px-6 py-2 text-sm font-semibold mb-6">
              <Crown className="h-4 w-4 mr-2" />
              Join Our Growing Network
            </Badge>
            
            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Partner with
              <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                CoastalConnect
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Join hundreds of successful partners and grow your business with Coastal Karnataka's leading platform for tourism and local services.
            </p>

            <div className="flex justify-center items-center space-x-12">
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900">500+</div>
                <div className="text-sm text-gray-600 font-medium">Active Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900">10K+</div>
                <div className="text-sm text-gray-600 font-medium">Monthly Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900">4.8</div>
                <div className="text-sm text-gray-600 font-medium flex items-center justify-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  Partner Rating
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Types */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                Choose Your Partnership
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Select the category that best fits your business and start growing with us
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partnerTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setSelectedPartnerType(type.id)}
                  className={`cursor-pointer rounded-3xl p-8 border-2 transition-all duration-300 transform hover:-translate-y-2 ${
                    selectedPartnerType === type.id
                      ? 'border-orange-500 shadow-2xl scale-105'
                      : 'border-gray-200 hover:border-orange-300 hover:shadow-xl'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${type.color} flex items-center justify-center text-white mb-6`}>
                    {type.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{type.title}</h3>
                  <p className="text-gray-600 mb-6">{type.description}</p>
                  
                  <ul className="space-y-2">
                    {type.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Benefits */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                Why Partner with Us?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join a platform that's designed to help your business thrive
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {platformBenefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 mb-6">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-600">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-3xl p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <Input
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Your business name"
                    required
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Type</label>
                  <select
                    name="businessType"
                    value={selectedPartnerType}
                    onChange={(e) => setSelectedPartnerType(e.target.value)}
                    required
                    className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select partnership type</option>
                    {partnerTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State"
                    required
                    className="h-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tell us about your business</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your business, services, and how you'd like to partner with us..."
                  rows={4}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !selectedPartnerType}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                ) : (
                  <>
                    Submit Partnership Application
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Need Help? Contact Us Directly</h3>
            <div className="flex justify-center items-center space-x-8">
              <a href="mailto:partners@coastalconnect.in" className="flex items-center text-orange-500 hover:text-orange-600 font-semibold">
                <Mail className="h-5 w-5 mr-2" />
                partners@coastalconnect.in
              </a>
              <a href="tel:+919876543210" className="flex items-center text-orange-500 hover:text-orange-600 font-semibold">
                <Phone className="h-5 w-5 mr-2" />
                +91 98765 43210
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
