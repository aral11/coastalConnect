import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeft,
  MessageCircle,
  Star,
  Send,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Award,
  TrendingUp,
  Users,
  Lightbulb,
  Bug,
  Smile,
  Meh,
  Frown
} from 'lucide-react';

interface FeedbackForm {
  name: string;
  email: string;
  phone: string;
  feedbackType: string;
  serviceUsed: string;
  overallRating: number;
  experienceRating: {
    booking: number;
    service: number;
    communication: number;
    value: number;
  };
  wouldRecommend: string;
  improvementAreas: string[];
  positiveAspects: string;
  suggestions: string;
  additionalComments: string;
}

const feedbackTypes = [
  { value: 'general', label: 'General Feedback', icon: MessageCircle },
  { value: 'service', label: 'Service Experience', icon: Star },
  { value: 'suggestion', label: 'Suggestion/Idea', icon: Lightbulb },
  { value: 'complaint', label: 'Complaint/Issue', icon: ThumbsDown },
  { value: 'compliment', label: 'Compliment/Praise', icon: ThumbsUp },
  { value: 'bug', label: 'Website/App Issue', icon: Bug }
];

const servicesUsed = [
  'Homestays',
  'Eateries/Restaurants',
  'Transportation/Drivers',
  'Local Creators',
  'Event Management',
  'Beauty & Wellness',
  'Arts & History Tours',
  'Other Services',
  'Multiple Services'
];

const improvementOptions = [
  'Booking Process',
  'Customer Service',
  'Website/App Experience',
  'Service Quality',
  'Communication',
  'Pricing',
  'Variety of Options',
  'Response Time',
  'Mobile Experience',
  'Payment Process'
];

export default function Feedback() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FeedbackForm>({
    name: '',
    email: '',
    phone: '',
    feedbackType: '',
    serviceUsed: '',
    overallRating: 0,
    experienceRating: {
      booking: 0,
      service: 0,
      communication: 0,
      value: 0
    },
    wouldRecommend: '',
    improvementAreas: [],
    positiveAspects: '',
    suggestions: '',
    additionalComments: ''
  });

  const handleInputChange = (field: keyof FeedbackForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRatingChange = (category: string, rating: number) => {
    if (category === 'overall') {
      setFormData(prev => ({ ...prev, overallRating: rating }));
    } else {
      setFormData(prev => ({
        ...prev,
        experienceRating: {
          ...prev.experienceRating,
          [category]: rating
        }
      }));
    }
  };

  const handleImprovementChange = (area: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      improvementAreas: checked
        ? [...prev.improvementAreas, area]
        : prev.improvementAreas.filter(item => item !== area)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Feedback Submitted!",
          description: "Thank you for your valuable feedback. We appreciate your input!",
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          feedbackType: '',
          serviceUsed: '',
          overallRating: 0,
          experienceRating: {
            booking: 0,
            service: 0,
            communication: 0,
            value: 0
          },
          wouldRecommend: '',
          improvementAreas: [],
          positiveAspects: '',
          suggestions: '',
          additionalComments: ''
        });
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, label }: { rating: number; onRatingChange: (rating: number) => void; label: string }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`p-1 rounded transition-colors ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
            }`}
          >
            <Star className={`h-6 w-6 ${star <= rating ? 'fill-current' : ''}`} />
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600">
        {rating === 0 && 'No rating'}
        {rating === 1 && 'Poor'}
        {rating === 2 && 'Fair'}
        {rating === 3 && 'Good'}
        {rating === 4 && 'Very Good'}
        {rating === 5 && 'Excellent'}
      </p>
    </div>
  );

  const getOverallMood = () => {
    if (formData.overallRating <= 2) return <Frown className="h-12 w-12 text-red-500" />;
    if (formData.overallRating <= 3) return <Meh className="h-12 w-12 text-yellow-500" />;
    if (formData.overallRating >= 4) return <Smile className="h-12 w-12 text-green-500" />;
    return <MessageCircle className="h-12 w-12 text-gray-400" />;
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Page Header */}
        <PageHeader
          title="Share Your Feedback"
          subtitle="Help us improve by sharing your experience and suggestions"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Feedback', href: '/feedback' }
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
          {/* Feedback Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Award className="h-10 w-10 text-orange-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">4.8</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">2,547</div>
                <div className="text-sm text-gray-600">Reviews Received</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <TrendingUp className="h-10 w-10 text-green-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">96%</div>
                <div className="text-sm text-gray-600">Would Recommend</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Heart className="h-10 w-10 text-red-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">89%</div>
                <div className="text-sm text-gray-600">Customer Satisfaction</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feedback Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-orange-500" />
                    <span>Feedback Form</span>
                  </CardTitle>
                  <CardDescription>
                    Your feedback helps us improve our services and create better experiences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 9876543210"
                      />
                    </div>

                    {/* Feedback Type */}
                    <div className="space-y-2">
                      <Label>Feedback Type *</Label>
                      <Select value={formData.feedbackType} onValueChange={(value) => handleInputChange('feedbackType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select feedback type" />
                        </SelectTrigger>
                        <SelectContent>
                          {feedbackTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Service Used */}
                    <div className="space-y-2">
                      <Label>Service Used</Label>
                      <Select value={formData.serviceUsed} onValueChange={(value) => handleInputChange('serviceUsed', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service you used" />
                        </SelectTrigger>
                        <SelectContent>
                          {servicesUsed.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Overall Rating */}
                    <StarRating
                      rating={formData.overallRating}
                      onRatingChange={(rating) => handleRatingChange('overall', rating)}
                      label="Overall Experience *"
                    />

                    {/* Detailed Ratings */}
                    <div className="space-y-4">
                      <Label>Rate Your Experience</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StarRating
                          rating={formData.experienceRating.booking}
                          onRatingChange={(rating) => handleRatingChange('booking', rating)}
                          label="Booking Process"
                        />
                        <StarRating
                          rating={formData.experienceRating.service}
                          onRatingChange={(rating) => handleRatingChange('service', rating)}
                          label="Service Quality"
                        />
                        <StarRating
                          rating={formData.experienceRating.communication}
                          onRatingChange={(rating) => handleRatingChange('communication', rating)}
                          label="Communication"
                        />
                        <StarRating
                          rating={formData.experienceRating.value}
                          onRatingChange={(rating) => handleRatingChange('value', rating)}
                          label="Value for Money"
                        />
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="space-y-3">
                      <Label>Would you recommend CoastalConnect to others? *</Label>
                      <RadioGroup value={formData.wouldRecommend} onValueChange={(value) => handleInputChange('wouldRecommend', value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="definitely" id="definitely" />
                          <Label htmlFor="definitely">Definitely</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="probably" id="probably" />
                          <Label htmlFor="probably">Probably</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="maybe" id="maybe" />
                          <Label htmlFor="maybe">Maybe</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="probably-not" id="probably-not" />
                          <Label htmlFor="probably-not">Probably Not</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="definitely-not" id="definitely-not" />
                          <Label htmlFor="definitely-not">Definitely Not</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Improvement Areas */}
                    <div className="space-y-3">
                      <Label>Areas for Improvement (Select all that apply)</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {improvementOptions.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={option}
                              checked={formData.improvementAreas.includes(option)}
                              onCheckedChange={(checked) => handleImprovementChange(option, checked as boolean)}
                            />
                            <Label htmlFor={option} className="text-sm">{option}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Text Feedback */}
                    <div className="space-y-2">
                      <Label htmlFor="positiveAspects">What did you like most about your experience?</Label>
                      <Textarea
                        id="positiveAspects"
                        value={formData.positiveAspects}
                        onChange={(e) => handleInputChange('positiveAspects', e.target.value)}
                        placeholder="Tell us what made your experience great..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="suggestions">Suggestions for Improvement</Label>
                      <Textarea
                        id="suggestions"
                        value={formData.suggestions}
                        onChange={(e) => handleInputChange('suggestions', e.target.value)}
                        placeholder="How can we make your experience better?"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalComments">Additional Comments</Label>
                      <Textarea
                        id="additionalComments"
                        value={formData.additionalComments}
                        onChange={(e) => handleInputChange('additionalComments', e.target.value)}
                        placeholder="Any other feedback you'd like to share?"
                        rows={4}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="h-4 w-4 mr-2" />
                          Submit Feedback
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Mood Indicator */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Experience</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  {getOverallMood()}
                  <p className="text-gray-600 mt-2">
                    {formData.overallRating === 0 && 'How was your experience?'}
                    {formData.overallRating <= 2 && 'We\'re sorry to hear that'}
                    {formData.overallRating === 3 && 'Thank you for your feedback'}
                    {formData.overallRating >= 4 && 'We\'re glad you enjoyed it!'}
                  </p>
                </CardContent>
              </Card>

              {/* Why Feedback Matters */}
              <Card>
                <CardHeader>
                  <CardTitle>Why Your Feedback Matters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Improve Services</p>
                      <p className="text-sm text-gray-600">Help us enhance our offerings</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Help Others</p>
                      <p className="text-sm text-gray-600">Guide future travelers</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Heart className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Build Community</p>
                      <p className="text-sm text-gray-600">Strengthen our coastal community</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/support" className="flex items-center space-x-2 text-orange-600 hover:text-orange-700">
                    <MessageCircle className="h-4 w-4" />
                    <span>Contact Support</span>
                  </Link>
                  <Link to="/help" className="flex items-center space-x-2 text-orange-600 hover:text-orange-700">
                    <Star className="h-4 w-4" />
                    <span>Help Center</span>
                  </Link>
                  <Link to="/contact" className="flex items-center space-x-2 text-orange-600 hover:text-orange-700">
                    <Send className="h-4 w-4" />
                    <span>Contact Us</span>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
