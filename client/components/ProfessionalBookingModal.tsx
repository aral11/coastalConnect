import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import {
  Calendar,
  Users,
  CreditCard,
  CheckCircle,
  X,
  Star,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  Percent,
  Shield,
  Info,
  ArrowRight,
  Home,
  Car
} from 'lucide-react';

interface BookingService {
  id: number;
  name: string;
  type: 'homestay' | 'restaurant' | 'driver' | 'event' | 'creator';
  price: number;
  location: string;
  rating?: number;
  image?: string;
  description?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: BookingService | null;
}

type BookingStep = 'details' | 'timing' | 'contact' | 'payment' | 'confirmation';

export default function ProfessionalBookingModal({ isOpen, onClose, service }: BookingModalProps) {
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState<BookingStep>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  // Form data
  const [bookingData, setBookingData] = useState({
    // Common fields
    service_id: 0,
    service_type: 'homestay' as const,
    
    // Homestay specific
    check_in_date: '',
    check_out_date: '',
    guests: 2,
    rooms: 1,
    
    // Restaurant specific
    reservation_date: '',
    reservation_time: '',
    party_size: 2,
    
    // Driver specific
    pickup_date: '',
    pickup_time: '',
    pickup_location: '',
    dropoff_location: '',
    passengers: 2,
    
    // Contact details
    guest_name: user?.name || '',
    guest_email: user?.email || '',
    guest_phone: '',
    special_requests: '',
    
    // Payment
    total_amount: 0,
    coupon_code: '',
    discount_amount: 0,
    payment_method: 'test'
  });

  const [availableCoupons, setAvailableCoupons] = useState([]);

  useEffect(() => {
    if (service) {
      setBookingData(prev => ({
        ...prev,
        service_id: service.id,
        service_type: service.type,
        total_amount: service.price,
        guest_name: user?.name || '',
        guest_email: user?.email || ''
      }));
    }
  }, [service, user]);

  useEffect(() => {
    if (isOpen) {
      loadAvailableCoupons();
    }
  }, [isOpen]);

  const loadAvailableCoupons = async () => {
    try {
      const response = await fetch('/api/coupons/available');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAvailableCoupons(data.data.slice(0, 3)); // Show top 3 coupons
        }
      }
    } catch (error) {
      console.error('Error loading coupons:', error);
    }
  };

  const applyCoupon = async (couponCode: string) => {
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode,
          service_type: service?.type,
          amount: bookingData.total_amount
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBookingData(prev => ({
            ...prev,
            coupon_code: couponCode,
            discount_amount: data.data.discount_amount
          }));
        }
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
    }
  };

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 'details':
        if (service?.type === 'homestay') {
          return bookingData.check_in_date && bookingData.check_out_date && bookingData.guests > 0;
        } else if (service?.type === 'restaurant') {
          return bookingData.reservation_date && bookingData.reservation_time && bookingData.party_size > 0;
        } else if (service?.type === 'driver') {
          return bookingData.pickup_date && bookingData.pickup_time && bookingData.pickup_location && bookingData.dropoff_location;
        }
        return true;
      case 'timing':
        return true;
      case 'contact':
        return bookingData.guest_name && bookingData.guest_email && bookingData.guest_phone;
      case 'payment':
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!validateStep()) return;
    
    const steps: BookingStep[] = ['details', 'timing', 'contact', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: BookingStep[] = ['details', 'timing', 'contact', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmitBooking = async () => {
    if (!isAuthenticated) {
      // Store booking data and redirect to login
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (data.success) {
        setBookingReference(data.data.booking_reference);
        setBookingComplete(true);
        setCurrentStep('confirmation');
      } else {
        setError(data.message || 'Booking failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const baseAmount = service?.price || 0;
    const discountAmount = bookingData.discount_amount || 0;
    return Math.max(0, baseAmount - discountAmount);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'details':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
              
              {service?.type === 'homestay' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="check_in">Check-in Date</Label>
                      <Input
                        id="check_in"
                        type="date"
                        value={bookingData.check_in_date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setBookingData(prev => ({ ...prev, check_in_date: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="check_out">Check-out Date</Label>
                      <Input
                        id="check_out"
                        type="date"
                        value={bookingData.check_out_date}
                        min={bookingData.check_in_date || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setBookingData(prev => ({ ...prev, check_out_date: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="guests">Number of Guests</Label>
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        max="10"
                        value={bookingData.guests}
                        onChange={(e) => setBookingData(prev => ({ ...prev, guests: parseInt(e.target.value) || 1 }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="rooms">Number of Rooms</Label>
                      <Input
                        id="rooms"
                        type="number"
                        min="1"
                        max="5"
                        value={bookingData.rooms}
                        onChange={(e) => setBookingData(prev => ({ ...prev, rooms: parseInt(e.target.value) || 1 }))}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {service?.type === 'restaurant' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reservation_date">Reservation Date</Label>
                      <Input
                        id="reservation_date"
                        type="date"
                        value={bookingData.reservation_date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setBookingData(prev => ({ ...prev, reservation_date: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reservation_time">Reservation Time</Label>
                      <Input
                        id="reservation_time"
                        type="time"
                        value={bookingData.reservation_time}
                        onChange={(e) => setBookingData(prev => ({ ...prev, reservation_time: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="party_size">Party Size</Label>
                    <Input
                      id="party_size"
                      type="number"
                      min="1"
                      max="20"
                      value={bookingData.party_size}
                      onChange={(e) => setBookingData(prev => ({ ...prev, party_size: parseInt(e.target.value) || 1 }))}
                      required
                    />
                  </div>
                </div>
              )}

              {service?.type === 'driver' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pickup_date">Pickup Date</Label>
                      <Input
                        id="pickup_date"
                        type="date"
                        value={bookingData.pickup_date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setBookingData(prev => ({ ...prev, pickup_date: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pickup_time">Pickup Time</Label>
                      <Input
                        id="pickup_time"
                        type="time"
                        value={bookingData.pickup_time}
                        onChange={(e) => setBookingData(prev => ({ ...prev, pickup_time: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="pickup_location">Pickup Location</Label>
                    <Input
                      id="pickup_location"
                      value={bookingData.pickup_location}
                      onChange={(e) => setBookingData(prev => ({ ...prev, pickup_location: e.target.value }))}
                      placeholder="Enter pickup address"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dropoff_location">Drop-off Location</Label>
                    <Input
                      id="dropoff_location"
                      value={bookingData.dropoff_location}
                      onChange={(e) => setBookingData(prev => ({ ...prev, dropoff_location: e.target.value }))}
                      placeholder="Enter destination address"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="passengers">Number of Passengers</Label>
                    <Input
                      id="passengers"
                      type="number"
                      min="1"
                      max="8"
                      value={bookingData.passengers}
                      onChange={(e) => setBookingData(prev => ({ ...prev, passengers: parseInt(e.target.value) || 1 }))}
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="guest_name">Full Name</Label>
                  <Input
                    id="guest_name"
                    value={bookingData.guest_name}
                    onChange={(e) => setBookingData(prev => ({ ...prev, guest_name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="guest_email">Email Address</Label>
                  <Input
                    id="guest_email"
                    type="email"
                    value={bookingData.guest_email}
                    onChange={(e) => setBookingData(prev => ({ ...prev, guest_email: e.target.value }))}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="guest_phone">Phone Number</Label>
                  <Input
                    id="guest_phone"
                    type="tel"
                    value={bookingData.guest_phone}
                    onChange={(e) => setBookingData(prev => ({ ...prev, guest_phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="special_requests">Special Requests (Optional)</Label>
                  <Textarea
                    id="special_requests"
                    value={bookingData.special_requests}
                    onChange={(e) => setBookingData(prev => ({ ...prev, special_requests: e.target.value }))}
                    placeholder="Any special requirements or requests..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment & Offers</h3>
              
              {/* Available Coupons */}
              {availableCoupons.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Available Offers</h4>
                  <div className="space-y-2">
                    {availableCoupons.map((coupon: any) => (
                      <div key={coupon.id} className="flex items-center justify-between p-3 border border-orange-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Percent className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <div className="font-medium">{coupon.title}</div>
                            <div className="text-sm text-gray-600">{coupon.subtitle}</div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => applyCoupon(coupon.code)}
                          disabled={bookingData.coupon_code === coupon.code}
                        >
                          {bookingData.coupon_code === coupon.code ? 'Applied' : 'Apply'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Price Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Base Price</span>
                    <span>₹{service?.price || 0}</span>
                  </div>
                  
                  {bookingData.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({bookingData.coupon_code})</span>
                      <span>-₹{bookingData.discount_amount}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Test Payment Mode</span>
                </div>
                <p className="text-sm text-blue-700">
                  This is a demo booking. No actual payment will be processed.
                </p>
              </div>
            </div>
          </div>
        );

      case 'confirmation':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600">Your booking has been successfully created.</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="font-medium">Booking Reference:</span>
                    <span className="text-orange-600 font-semibold">{bookingReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Service:</span>
                    <span>{service?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Paid:</span>
                    <span className="text-green-600 font-semibold">₹{calculateTotal()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button onClick={() => window.location.href = '/dashboard'} className="w-full">
                View My Bookings
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full">
                Continue Exploring
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepNumber = (step: BookingStep): number => {
    const steps: BookingStep[] = ['details', 'timing', 'contact', 'payment', 'confirmation'];
    return steps.indexOf(step) + 1;
  };

  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              {service.type === 'homestay' ? <Home className="h-5 w-5 text-orange-600" /> : 
               service.type === 'driver' ? <Car className="h-5 w-5 text-orange-600" /> :
               <Calendar className="h-5 w-5 text-orange-600" />}
            </div>
            <div>
              <div className="text-lg font-semibold">{service.name}</div>
              <div className="text-sm text-gray-600 font-normal">{service.location}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        {!bookingComplete && (
          <div className="flex items-center justify-between mb-6">
            {['details', 'contact', 'payment'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  getStepNumber(currentStep) > index + 1 ? 'bg-green-500 text-white' :
                  getStepNumber(currentStep) === index + 1 ? 'bg-orange-500 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {getStepNumber(currentStep) > index + 1 ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    getStepNumber(currentStep) > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {renderStepContent()}

        {/* Action Buttons */}
        {!bookingComplete && (
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={currentStep === 'details' ? onClose : prevStep}
              disabled={loading}
            >
              {currentStep === 'details' ? 'Cancel' : 'Back'}
            </Button>

            <Button
              onClick={currentStep === 'payment' ? handleSubmitBooking : nextStep}
              disabled={!validateStep() || loading}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {loading ? 'Processing...' : 
               currentStep === 'payment' ? 'Confirm Booking' : 'Continue'}
              {currentStep !== 'payment' && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
