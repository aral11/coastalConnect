import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Home,
  ChefHat,
  Car,
  Calendar
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

interface VendorFormData {
  businessName: string;
  businessType: 'homestay' | 'restaurant' | 'driver' | 'event_services';
  businessDescription: string;
  businessAddress: string;
  city: string;
  state: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  businessLicense: string;
  gstNumber: string;
  panNumber: string;
  aadharNumber: string;
}

const businessTypes = [
  {
    value: 'homestay',
    label: 'Hotels & Homestays',
    icon: <Home className="h-6 w-6" />,
    description: 'Accommodation services, hotels, resorts, homestays'
  },
  {
    value: 'restaurant',
    label: 'Restaurants & Cafes',
    icon: <ChefHat className="h-6 w-6" />,
    description: 'Food & beverage services, restaurants, cafes, catering'
  },
  {
    value: 'driver',
    label: 'Transportation',
    icon: <Car className="h-6 w-6" />,
    description: 'Local transport, taxi services, tour operators'
  },
  {
    value: 'event_services',
    label: 'Event Services',
    icon: <Calendar className="h-6 w-6" />,
    description: 'Photography, decorations, event planning services'
  }
];

export default function VendorRegister() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<VendorFormData>({
    businessName: '',
    businessType: 'homestay',
    businessDescription: '',
    businessAddress: '',
    city: 'Udupi',
    state: 'Karnataka',
    contactPerson: user?.name || '',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || '',
    businessLicense: '',
    gstNumber: '',
    panNumber: '',
    aadharNumber: ''
  });

  const updateFormData = (field: keyof VendorFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.businessName && formData.businessType && formData.businessDescription;
      case 2:
        return formData.businessAddress && formData.city && formData.contactPerson && 
               formData.contactPhone && formData.contactEmail;
      case 3:
        return formData.businessLicense && formData.gstNumber && formData.panNumber;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep() && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setError('Please login to submit vendor application');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/vendor-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          business_name: formData.businessName,
          business_type: formData.businessType,
          business_description: formData.businessDescription,
          business_address: formData.businessAddress,
          city: formData.city,
          state: formData.state,
          contact_person: formData.contactPerson,
          contact_phone: formData.contactPhone,
          contact_email: formData.contactEmail,
          business_license: formData.businessLicense,
          gst_number: formData.gstNumber,
          pan_number: formData.panNumber,
          aadhar_number: formData.aadharNumber
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        throw new Error(data.message || 'Failed to submit application');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Login Required</h2>
              <p className="text-gray-600 mb-6">
                You need to be logged in to register as a vendor
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Login to Continue
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/signup')}
                  className="w-full"
                >
                  Create Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (success) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
              <p className="text-gray-600 mb-6">
                Your vendor application has been submitted successfully. Our team will review your 
                application and get back to you within 2-3 business days.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-800 space-y-1 text-left">
                  <li>• Our team will verify your business documents</li>
                  <li>• We may contact you for additional information</li>
                  <li>• Once approved, you'll get access to the vendor dashboard</li>
                  <li>• You can then start listing your services</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Return to Homepage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const renderBusinessTypeStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Information</h2>
        <p className="text-gray-600">Tell us about your business</p>
      </div>

      <div>
        <Label htmlFor="businessName">Business Name *</Label>
        <Input
          id="businessName"
          value={formData.businessName}
          onChange={(e) => updateFormData('businessName', e.target.value)}
          placeholder="Enter your business name"
        />
      </div>

      <div>
        <Label>Business Type *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {businessTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => updateFormData('businessType', type.value as any)}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                formData.businessType === type.value
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`${formData.businessType === type.value ? 'text-orange-600' : 'text-gray-400'}`}>
                  {type.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{type.label}</div>
                  <div className="text-sm text-gray-600">{type.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="businessDescription">Business Description *</Label>
        <Textarea
          id="businessDescription"
          value={formData.businessDescription}
          onChange={(e) => updateFormData('businessDescription', e.target.value)}
          placeholder="Describe your business, services offered, and what makes you unique"
          rows={4}
        />
      </div>
    </div>
  );

  const renderContactStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact & Location</h2>
        <p className="text-gray-600">Where can customers find you?</p>
      </div>

      <div>
        <Label htmlFor="businessAddress">Business Address *</Label>
        <Textarea
          id="businessAddress"
          value={formData.businessAddress}
          onChange={(e) => updateFormData('businessAddress', e.target.value)}
          placeholder="Enter complete business address"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => updateFormData('city', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => updateFormData('state', e.target.value)}
          />
        </div>
      </div>

      <Separator />

      <div>
        <Label htmlFor="contactPerson">Contact Person *</Label>
        <Input
          id="contactPerson"
          value={formData.contactPerson}
          onChange={(e) => updateFormData('contactPerson', e.target.value)}
          placeholder="Primary contact person name"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactPhone">Phone Number *</Label>
          <Input
            id="contactPhone"
            type="tel"
            value={formData.contactPhone}
            onChange={(e) => updateFormData('contactPhone', e.target.value)}
            placeholder="+91-9876543210"
          />
        </div>
        <div>
          <Label htmlFor="contactEmail">Email Address *</Label>
          <Input
            id="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={(e) => updateFormData('contactEmail', e.target.value)}
            placeholder="business@example.com"
          />
        </div>
      </div>
    </div>
  );

  const renderDocumentsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Documents</h2>
        <p className="text-gray-600">We need these details for verification</p>
      </div>

      <div>
        <Label htmlFor="businessLicense">Business License Number *</Label>
        <Input
          id="businessLicense"
          value={formData.businessLicense}
          onChange={(e) => updateFormData('businessLicense', e.target.value)}
          placeholder="Business license or shop act number"
        />
      </div>

      <div>
        <Label htmlFor="gstNumber">GST Number *</Label>
        <Input
          id="gstNumber"
          value={formData.gstNumber}
          onChange={(e) => updateFormData('gstNumber', e.target.value)}
          placeholder="22AAAAA0000A1Z5"
        />
      </div>

      <div>
        <Label htmlFor="panNumber">PAN Number *</Label>
        <Input
          id="panNumber"
          value={formData.panNumber}
          onChange={(e) => updateFormData('panNumber', e.target.value)}
          placeholder="ABCDE1234F"
        />
      </div>

      <div>
        <Label htmlFor="aadharNumber">Aadhar Number (Optional)</Label>
        <Input
          id="aadharNumber"
          value={formData.aadharNumber}
          onChange={(e) => updateFormData('aadharNumber', e.target.value)}
          placeholder="1234 5678 9012"
        />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <div className="text-sm text-yellow-800">
            <strong>Note:</strong> All information will be verified during the approval process. 
            Please ensure all details are accurate and up-to-date.
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Building2 className="h-6 w-6 text-orange-600" />
              <span>Become a Vendor</span>
            </CardTitle>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-between mt-6">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      currentStep > step ? 'bg-orange-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {currentStep === 1 && renderBusinessTypeStep()}
            {currentStep === 2 && renderContactStep()}
            {currentStep === 3 && renderDocumentsStep()}

            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={currentStep === 1 ? () => navigate('/') : prevStep}
                disabled={loading}
              >
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={nextStep}
                  disabled={!validateStep() || loading}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!validateStep() || loading}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
