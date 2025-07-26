import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Store,
  IndianRupee,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  Shield
} from 'lucide-react';

interface VendorFormData {
  businessName: string;
  ownerName: string;
  category: string;
  subcategory: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  aadharNumber: string;
  gstNumber: string;
  subscriptionPlan: 'monthly' | 'annual';
}

// Service categories will be loaded dynamically from server

export default function VendorRegister() {
  const [formData, setFormData] = useState<VendorFormData>({
    businessName: '',
    ownerName: '',
    category: '',
    subcategory: '',
    description: '',
    address: '',
    city: 'udupi',
    phone: '',
    email: '',
    website: '',
    aadharNumber: '',
    gstNumber: '',
    subscriptionPlan: 'annual'
  });
  
  const [documents, setDocuments] = useState({
    aadharFront: null as File | null,
    aadharBack: null as File | null,
    businessProof: null as File | null,
    gstCertificate: null as File | null
  });
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serviceCategories, setServiceCategories] = useState<any>({});
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    fetchServiceCategories();
  }, []);

  const fetchServiceCategories = async () => {
    try {
      const response = await fetch('/api/vendors/categories');
      const data = await response.json();

      if (data.success && data.data) {
        setServiceCategories(data.data);
      } else {
        // Fallback categories in case API fails
        setServiceCategories({
          'eateries': {
            label: 'Eateries',
            subcategories: ['Restaurant', 'Cafe', 'Bar', 'Fast Food', 'Catering', 'Sweet Shop', 'Bakery']
          },
          'arts-history': {
            label: 'Arts & History',
            subcategories: ['Museum', 'Heritage Site', 'Art Gallery', 'Cultural Center', 'Traditional Crafts']
          },
          'beauty-wellness': {
            label: 'Beauty & Wellness',
            subcategories: ['Salon', 'Spa', 'Gym', 'Ayurveda Center', 'Yoga Studio', 'Massage Center']
          },
          'nightlife': {
            label: 'Nightlife',
            subcategories: ['Bar', 'Pub', 'Club', 'Lounge', 'Live Music Venue']
          },
          'shopping': {
            label: 'Shopping',
            subcategories: ['Market', 'Store', 'Boutique', 'Handicrafts', 'Electronics', 'Clothing']
          },
          'entertainment': {
            label: 'Entertainment',
            subcategories: ['Cinema', 'Gaming Zone', 'Sports Complex', 'Water Sports', 'Adventure Sports']
          },
          'event-management': {
            label: 'Event Management',
            subcategories: ['Wedding Planner', 'Corporate Events', 'Party Planning', 'Catering Services']
          },
          'transportation': {
            label: 'Transportation',
            subcategories: ['Taxi Service', 'Car Rental', 'Bike Rental', 'Auto Rickshaw', 'Bus Service']
          },
          'other-services': {
            label: 'Other Services',
            subcategories: ['Plumber', 'Electrician', 'Carpenter', 'Home Cleaning', 'Repair Services', 'IT Services']
          }
        });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Use fallback categories
      setServiceCategories({
        'eateries': { label: 'Eateries', subcategories: ['Restaurant', 'Cafe', 'Bar'] },
        'beauty-wellness': { label: 'Beauty & Wellness', subcategories: ['Salon', 'Spa', 'Gym'] },
        'other-services': { label: 'Other Services', subcategories: ['Repair Services', 'IT Services'] }
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (field: keyof VendorFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: keyof typeof documents, file: File | null) => {
    setDocuments(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setSubmitted(true);
  };

  const selectedCategory = serviceCategories[formData.category as keyof typeof serviceCategories];

  // Calculate subscription pricing based on registration timing
  const calculateSubscriptionPrice = () => {
    const launchDate = new Date('2024-01-01'); // Platform launch date
    const currentDate = new Date();
    const registrationDate = new Date();

    // First month after launch (January 2024): ₹99/month
    // After first month: ₹199/month
    const monthsSinceLaunch = (currentDate.getFullYear() - launchDate.getFullYear()) * 12 +
                             (currentDate.getMonth() - launchDate.getMonth());

    const isFirstMonth = monthsSinceLaunch === 0;

    if (formData.subscriptionPlan === 'monthly') {
      return isFirstMonth ? 99 : 199;
    } else {
      // Annual plan: Always ₹199 (special pricing)
      return 199;
    }
  };

  const subscriptionPrice = calculateSubscriptionPrice();
  const isLaunchOffer = subscriptionPrice === 99;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Registration Submitted!</CardTitle>
            <CardDescription>
              Your vendor registration has been submitted successfully. Our admin team will verify your documents and approve your account within 24-48 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center text-blue-800 mb-2">
                <Clock className="h-4 w-4 mr-2" />
                <span className="font-medium">What's Next?</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Document verification (24-48 hours)</li>
                <li>• Admin approval notification via email</li>
                <li>• Payment link for subscription</li>
                <li>• Account activation</li>
              </ul>
            </div>
            <Link to="/">
              <Button className="w-full btn-coastal">
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-coastal-500 to-ocean-600 text-white">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center mb-6">
            <div className="bg-white/20 rounded-lg p-4 mr-6">
              <Store className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Vendor Registration</h1>
              <p className="text-xl text-white/90">Join coastalConnect - Udupi & Manipal's trusted platform</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">₹99</div>
              <div className="text-sm opacity-90">Monthly Plan</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">₹199</div>
              <div className="text-sm opacity-90">Annual Plan (Save ₹989!)</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm font-medium">Admin Verified</div>
              <div className="text-xs opacity-90">Quick approval process</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-coastal-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-coastal-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-coastal-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-coastal-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-coastal-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && 'Business Information'}
                {step === 2 && 'Document Upload'}
                {step === 3 && 'Review & Payment'}
              </CardTitle>
              <CardDescription>
                {step === 1 && 'Tell us about your business and select your category'}
                {step === 2 && 'Upload required documents for verification'}
                {step === 3 && 'Review your information and complete registration'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        placeholder="Enter your business name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ownerName">Owner Name *</Label>
                      <Input
                        id="ownerName"
                        value={formData.ownerName}
                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                        placeholder="Enter owner's full name"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Business Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(serviceCategories).map(([key, category]) => (
                            <SelectItem key={key} value={key}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subcategory">Subcategory *</Label>
                      <Select 
                        value={formData.subcategory} 
                        onValueChange={(value) => handleInputChange('subcategory', value)}
                        disabled={!selectedCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCategory?.subcategories.map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Business Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your business, services, and specialties"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="udupi">Udupi</SelectItem>
                          <SelectItem value="manipal">Manipal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Complete Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter complete business address"
                      rows={2}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="Enter website URL"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center text-blue-800 mb-2">
                      <Shield className="h-4 w-4 mr-2" />
                      <span className="font-medium">Required Documents</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Upload clear, readable copies of all required documents for verification.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="aadharNumber">Aadhar Number *</Label>
                      <Input
                        id="aadharNumber"
                        value={formData.aadharNumber}
                        onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                        placeholder="Enter Aadhar number"
                        maxLength={12}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gstNumber">GST Number (if applicable)</Label>
                      <Input
                        id="gstNumber"
                        value={formData.gstNumber}
                        onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                        placeholder="Enter GST number"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Aadhar Card Front *</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => handleFileUpload('aadharFront', e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Aadhar Card Back *</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => handleFileUpload('aadharBack', e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Business Registration/License *</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Shop license, trade license, or business registration</p>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => handleFileUpload('businessProof', e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-4">Business Summary</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Business Name:</span>
                        <div className="font-medium">{formData.businessName}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <div className="font-medium">{selectedCategory?.label} - {formData.subcategory}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <div className="font-medium">{formData.city === 'udupi' ? 'Udupi' : 'Manipal'}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <div className="font-medium">{formData.phone}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Select Subscription Plan *</Label>
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          formData.subscriptionPlan === 'monthly' ? 'border-coastal-500 bg-coastal-50' : 'border-gray-200'
                        }`}
                        onClick={() => handleInputChange('subscriptionPlan', 'monthly')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">Launch Offer</span>
                          <span className="text-2xl font-bold text-coastal-600">₹99</span>
                        </div>
                        <p className="text-sm text-gray-600">First month special price</p>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs mt-1">
                          Limited Time
                        </Badge>
                      </div>
                      
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          formData.subscriptionPlan === 'annual' ? 'border-coastal-500 bg-coastal-50' : 'border-gray-200'
                        }`}
                        onClick={() => handleInputChange('subscriptionPlan', 'annual')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">Regular Price</span>
                          <span className="text-2xl font-bold text-coastal-600">₹199</span>
                        </div>
                        <p className="text-sm text-gray-600">After first month</p>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs mt-1">
                          Annual Billing
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center text-yellow-800 mb-2">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span className="font-medium">Payment Process</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      After admin approval, you'll receive a payment link via email to complete your subscription.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    Previous
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button 
                    className="btn-coastal ml-auto" 
                    onClick={() => setStep(step + 1)}
                    disabled={
                      (step === 1 && (!formData.businessName || !formData.category || !formData.phone)) ||
                      (step === 2 && (!formData.aadharNumber))
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    className="btn-coastal ml-auto" 
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Registration'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
