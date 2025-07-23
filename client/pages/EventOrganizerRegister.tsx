import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  Award
} from 'lucide-react';

interface RegistrationForm {
  organization_name: string;
  contact_person: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address: string;
  city: string;
  pincode: string;
  organization_type: string;
  website_url: string;
  social_media_links: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
  registration_number: string;
  tax_id: string;
  specialization: string[];
}

export default function EventOrganizerRegister() {
  const [formData, setFormData] = useState<RegistrationForm>({
    organization_name: '',
    contact_person: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: 'Udupi',
    pincode: '',
    organization_type: '',
    website_url: '',
    social_media_links: {},
    registration_number: '',
    tax_id: '',
    specialization: []
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const organizationTypes = [
    { value: 'individual', label: 'Individual Organizer' },
    { value: 'ngo', label: 'Non-Governmental Organization (NGO)' },
    { value: 'government', label: 'Government Organization' },
    { value: 'private', label: 'Private Company' },
    { value: 'religious', label: 'Religious Organization' },
    { value: 'cultural', label: 'Cultural Organization' },
    { value: 'sports', label: 'Sports Organization' },
    { value: 'educational', label: 'Educational Institution' }
  ];

  const eventCategories = [
    'Kambala & Traditional Sports',
    'Cultural Festivals',
    'Religious Events',
    'Educational Workshops',
    'Sports Competitions',
    'Concerts & Entertainment',
    'Exhibitions & Markets',
    'Community Service',
    'Charity Events',
    'Business Conferences'
  ];

  const cities = ['Udupi', 'Manipal', 'Malpe', 'Kaup', 'Kundapur', 'Hebri'];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof RegistrationForm],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSpecializationToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(category)
        ? prev.specialization.filter(s => s !== category)
        : [...prev.specialization, category]
    }));
  };

  const validateStep1 = () => {
    return formData.organization_name && formData.contact_person && 
           formData.email && formData.phone && formData.organization_type;
  };

  const validateStep2 = () => {
    return formData.address && formData.city && formData.pincode &&
           formData.password && formData.confirmPassword &&
           formData.password === formData.confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/organizers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          specialization: formData.specialization.join(', ')
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your event organizer account has been created successfully. 
              Your account is pending verification by our admin team.
            </p>
            <div className="space-y-2 text-sm text-gray-500 mb-6">
              <p>• Check your email for confirmation</p>
              <p>• Verification usually takes 1-2 business days</p>
              <p>• You'll be notified once approved</p>
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => window.location.href = '/organizer-login'}
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Become an Event Organizer
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Join coastalConnect and organize amazing events in Udupi & Manipal
          </p>
          
          {/* Step Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="ml-2 font-medium">Organization Details</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="ml-2 font-medium">Contact & Security</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="ml-2 font-medium">Specialization</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              {step === 1 && <Building className="mr-2 h-5 w-5" />}
              {step === 2 && <MapPin className="mr-2 h-5 w-5" />}
              {step === 3 && <Award className="mr-2 h-5 w-5" />}
              {step === 1 && 'Organization Information'}
              {step === 2 && 'Contact Details & Security'}
              {step === 3 && 'Event Specialization'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Step 1: Organization Details */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="organization_name">Organization Name *</Label>
                      <Input
                        id="organization_name"
                        value={formData.organization_name}
                        onChange={(e) => handleInputChange('organization_name', e.target.value)}
                        placeholder="e.g., Udupi Cultural Society"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_person">Contact Person *</Label>
                      <Input
                        id="contact_person"
                        value={formData.contact_person}
                        onChange={(e) => handleInputChange('contact_person', e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="contact@organization.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 9876543210"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="organization_type">Organization Type *</Label>
                    <Select 
                      value={formData.organization_type} 
                      onValueChange={(value) => handleInputChange('organization_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizationTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="registration_number">Registration Number</Label>
                      <Input
                        id="registration_number"
                        value={formData.registration_number}
                        onChange={(e) => handleInputChange('registration_number', e.target.value)}
                        placeholder="Official registration number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tax_id">Tax ID / PAN</Label>
                      <Input
                        id="tax_id"
                        value={formData.tax_id}
                        onChange={(e) => handleInputChange('tax_id', e.target.value)}
                        placeholder="Tax identification number"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="website_url">Website URL</Label>
                    <Input
                      id="website_url"
                      value={formData.website_url}
                      onChange={(e) => handleInputChange('website_url', e.target.value)}
                      placeholder="https://yourorganization.com"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Contact & Security */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Complete address with landmarks"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Select 
                        value={formData.city} 
                        onValueChange={(value) => handleInputChange('city', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map(city => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="576101"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Minimum 8 characters"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Re-enter password"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Social Media Links</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          value={formData.social_media_links.instagram || ''}
                          onChange={(e) => handleInputChange('social_media_links.instagram', e.target.value)}
                          placeholder="@yourusername"
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          value={formData.social_media_links.facebook || ''}
                          onChange={(e) => handleInputChange('social_media_links.facebook', e.target.value)}
                          placeholder="Page URL"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Specialization */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Event Specialization</h3>
                    <p className="text-gray-600 mb-6">
                      Select the types of events you specialize in organizing. This helps us showcase your events to the right audience.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-3">
                      {eventCategories.map(category => (
                        <div
                          key={category}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.specialization.includes(category)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleSpecializationToggle(category)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{category}</span>
                            {formData.specialization.includes(category) && (
                              <CheckCircle className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {formData.specialization.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Selected specializations:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.specialization.map(spec => (
                            <Badge key={spec} variant="secondary">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Alert>
                    <Users className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Next Steps:</strong> After registration, our team will verify your organization details. 
                      Once approved, you can start creating and managing events on coastalConnect.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                  >
                    Previous
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button 
                    type="button"
                    className="ml-auto"
                    onClick={() => setStep(step + 1)}
                    disabled={
                      (step === 1 && !validateStep1()) ||
                      (step === 2 && !validateStep2())
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    className="ml-auto bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Registering...' : 'Complete Registration'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/organizer-login" className="text-blue-600 hover:underline">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
