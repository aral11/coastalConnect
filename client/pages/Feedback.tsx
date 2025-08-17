import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { submitGuideFeedback } from "../lib/supabase";
import { useToast } from "../hooks/use-toast";
import {
  MessageSquare,
  Users,
  MapPin,
  Calendar,
  Car,
  Utensils,
} from "lucide-react";

const Feedback: React.FC = () => {
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    message: "",
    want_all_in_one: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedbackData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please enter your name to submit feedback.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await submitGuideFeedback(feedbackData);

      toast({
        title: "Thanks! Your input helps shape CoastalConnect.",
        description: "We'll consider your feedback for future updates.",
      });

      setFeedbackData({
        name: "",
        email: "",
        message: "",
        want_all_in_one: false,
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Unable to submit feedback. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Help Shape CoastalConnect
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your feedback is invaluable in helping us create the perfect
            platform for Udupi & Manipal visitors and locals alike.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feedback Form */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-orange-500" />
                Share Your Thoughts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <Input
                    type="text"
                    value={feedbackData.name}
                    onChange={(e) =>
                      setFeedbackData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                    placeholder="Your full name"
                    className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (optional)
                  </label>
                  <Input
                    type="email"
                    value={feedbackData.email}
                    onChange={(e) =>
                      setFeedbackData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="your.email@example.com"
                    className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll only use this to follow up on your feedback if needed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What features would you like to see?
                  </label>
                  <textarea
                    value={feedbackData.message}
                    onChange={(e) =>
                      setFeedbackData((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Tell us about features you'd love to see, improvements to the current guide, or any other suggestions..."
                  />
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="want_all_in_one"
                      checked={feedbackData.want_all_in_one}
                      onChange={(e) =>
                        setFeedbackData((prev) => ({
                          ...prev,
                          want_all_in_one: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 mt-0.5"
                    />
                    <div>
                      <label
                        htmlFor="want_all_in_one"
                        className="text-sm font-medium text-orange-900"
                      >
                        Yes—bring everything into one platform!
                      </label>
                      <p className="text-xs text-orange-700 mt-1">
                        I want bookings, festivals, driver booking, event
                        management, and more all in one place.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* What We're Planning */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  What We're Planning for Phase 2
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Online Bookings
                    </h4>
                    <p className="text-sm text-gray-600">
                      Book hotels, restaurants, and experiences directly through
                      the platform
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Festival Management
                    </h4>
                    <p className="text-sm text-gray-600">
                      Complete event organization tools for local festivals and
                      celebrations
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Car className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Driver Booking
                    </h4>
                    <p className="text-sm text-gray-600">
                      Connect with verified local drivers for tours and
                      transportation
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Utensils className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Food Delivery
                    </h4>
                    <p className="text-sm text-gray-600">
                      Order from local restaurants with delivery to hotels and
                      hostels
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Interactive Maps
                    </h4>
                    <p className="text-sm text-gray-600">
                      Detailed maps with walking routes, public transport, and
                      attractions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-r from-orange-50 to-cyan-50">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Your Voice Matters!
                </h3>
                <p className="text-gray-700 text-sm">
                  Every piece of feedback helps us prioritize features and build
                  exactly what Udupi & Manipal needs. Whether you're a visitor,
                  local resident, or business owner, we want to hear from you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 text-center">
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Want to Chat Directly?
              </h3>
              <p className="text-gray-600 mb-4">
                We love talking to our users! Reach out if you have questions,
                suggestions, or just want to say hello.
              </p>
              <div className="flex justify-center space-x-6 text-sm text-gray-600">
                <a
                  href="mailto:hello@coastalconnect.in"
                  className="hover:text-orange-600 transition-colors"
                >
                  hello@coastalconnect.in
                </a>
                <span>•</span>
                <a
                  href="tel:+918202520187"
                  className="hover:text-orange-600 transition-colors"
                >
                  +91 820 252 0187
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
