/**
 * Modern Service Detail Page - Swiggy/Zomato Style
 * 100% Supabase-driven with real-time booking
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase, trackEvent, SupabaseService, SupabaseReview } from '@/lib/supabase';
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Calendar as CalendarIcon,
  Heart,
  Share2,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Camera,
  Wifi,
  Car,
  Coffee,
  Shield,
  Award,
  TrendingUp,
  Zap,
  ThumbsUp,
  Flag,
  Send,
  CreditCard,
  Smartphone
} from 'lucide-react';

interface BookingFormData {
  date: Date | undefined;
  time: string;
  guests: number;
  specialRequests: string;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
}

export default function ModernServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();

  // Service data state
  const [service, setService] = useState<SupabaseService | null>(null);
  const [reviews, setReviews] = useState<SupabaseReview[]>([]);
  const [relatedServices, setRelatedServices] = useState<SupabaseService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [selectedImage, setSelectedImage] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Booking state
  const [bookingData, setBookingData] = useState<BookingFormData>({
    date: undefined,
    time: '',
    guests: 1,
    specialRequests: '',
    customerInfo: {
      name: user?.user_metadata?.full_name || '',
      phone: user?.user_metadata?.phone || '',
      email: user?.email || ''
    }
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Review state
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    title: ''
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Load service data
  useEffect(() => {
    if (id) {
      loadServiceData();
      checkIfFavorited();
    }
  }, [id, user]);

  const loadServiceData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load service details
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select(`
          *,
          vendor:vendors(
            id,
            business_name,
            contact_person,
            phone,
            email,
            address,
            profile_image_url,
            verified
          )
        `)
        .eq('id', id)
        .eq('status', 'active')
        .single();

      if (serviceError) throw serviceError;
      if (!serviceData) throw new Error('Service not found');

      setService(serviceData);

      // Load reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          *,
          user:users(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('service_id', id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(20);

      if (reviewsError) throw reviewsError;
      setReviews(reviewsData || []);

      // Load related services (same category)
      const { data: relatedData, error: relatedError } = await supabase
        .from('services')
        .select('*')
        .eq('category', serviceData.category)
        .neq('id', id)
        .eq('status', 'active')
        .limit(4);

      if (relatedError) throw relatedError;
      setRelatedServices(relatedData || []);

      // Track page view
      await trackEvent('service_viewed', {
        service_id: id,
        service_name: serviceData.name,
        category: serviceData.category,
        timestamp: new Date().toISOString()
      });

    } catch (err: any) {
      console.error('Error loading service:', err);
      setError(err.message || 'Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorited = async () => {
    if (!user || !id) return;

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('service_id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setIsFavorited(!!data);
    } catch (err) {
      console.error('Error checking favorite status:', err);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      if (isFavorited) {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('service_id', id);
      } else {
        await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            service_id: id,
            created_at: new Date().toISOString()
          });
      }

      setIsFavorited(!isFavorited);
      
      await trackEvent('service_favorite_toggled', {
        service_id: id,
        action: isFavorited ? 'removed' : 'added',
        timestamp: new Date().toISOString()
      });

    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleBookingSubmit = async () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!bookingData.date || !bookingData.time) {
      setError('Please select date and time for your booking');
      return;
    }

    try {
      setIsBooking(true);
      setError(null);

      const bookingDateTime = new Date(bookingData.date);
      const [hours, minutes] = bookingData.time.split(':');
      bookingDateTime.setHours(parseInt(hours), parseInt(minutes));

      const booking = {
        user_id: user.id,
        service_id: id,
        vendor_id: service?.vendor_id,
        booking_date: bookingDateTime.toISOString(),
        guests: bookingData.guests,
        total_price: service?.price || 0,
        special_requests: bookingData.specialRequests,
        customer_name: bookingData.customerInfo.name,
        customer_phone: bookingData.customerInfo.phone,
        customer_email: bookingData.customerInfo.email,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert(booking)
        .select()
        .single();

      if (error) throw error;

      // Track booking event
      await trackEvent('booking_created', {
        booking_id: data.id,
        service_id: id,
        vendor_id: service?.vendor_id,
        amount: service?.price || 0,
        timestamp: new Date().toISOString()
      });

      setBookingSuccess(true);
      setIsBookingOpen(false);

      // Show success message and redirect to bookings page
      setTimeout(() => {
        navigate('/dashboard?tab=bookings');
      }, 2000);

    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to create booking');
    } finally {
      setIsBooking(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!newReview.comment.trim()) {
      setError('Please write a review comment');
      return;
    }

    try {
      setIsSubmittingReview(true);
      setError(null);

      const review = {
        user_id: user.id,
        service_id: id,
        vendor_id: service?.vendor_id,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('reviews')
        .insert(review);

      if (error) throw error;

      // Track review event
      await trackEvent('review_submitted', {
        service_id: id,
        rating: newReview.rating,
        timestamp: new Date().toISOString()
      });

      setNewReview({ rating: 5, comment: '', title: '' });
      setIsReviewOpen(false);
      
      // Reload reviews
      await loadServiceData();

    } catch (err: any) {
      console.error('Review error:', err);
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service?.name,
          text: service?.description,
          url: window.location.href
        });
        
        await trackEvent('service_shared', {
          service_id: id,
          method: 'native',
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      
      await trackEvent('service_shared', {
        service_id: id,
        method: 'clipboard',
        timestamp: new Date().toISOString()
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold">Service Not Found</h2>
              <p className="text-gray-600">{error}</p>
              <Button onClick={() => navigate('/services')} className="w-full">
                Browse All Services
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!service) return null;

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const images = service.images?.length > 0 ? service.images : ['/placeholder.svg'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteToggle}
                className={isFavorited ? 'text-red-500' : 'text-gray-600'}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {bookingSuccess && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Booking submitted successfully! Redirecting to your bookings...
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Image Gallery */}
        <Card className="overflow-hidden">
          <div className="relative">
            <div className="aspect-video bg-gray-200 relative overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4">
                <div className="flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === selectedImage ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {service.featured && (
                <Badge className="absolute top-4 left-4 bg-orange-500">
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Info */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{service.name}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                        <span className="font-medium">{averageRating.toFixed(1)}</span>
                        <span className="ml-1">({reviews.length} reviews)</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {service.location}
                      </div>
                      <Badge variant="secondary">{service.category}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">
                      ₹{service.price}
                    </div>
                    <div className="text-sm text-gray-600">per {service.price_unit || 'service'}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
                
                {service.amenities && service.amenities.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs for Details */}
            <Card>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                  <TabsTrigger value="vendor">Vendor Info</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Duration</h4>
                        <p className="text-gray-600">{service.duration || 'Contact vendor'}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Capacity</h4>
                        <p className="text-gray-600">{service.max_guests || 'No limit'} people</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Cancellation</h4>
                        <p className="text-gray-600">Free cancellation 24 hours before</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Payment</h4>
                        <p className="text-gray-600">Pay at venue or online</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Customer Reviews</h3>
                      {user && (
                        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Write Review</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Write a Review</DialogTitle>
                              <DialogDescription>
                                Share your experience with {service.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Rating</label>
                                <div className="flex items-center space-x-2 mt-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                      className={`${
                                        star <= newReview.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                      }`}
                                    >
                                      <Star className="h-6 w-6" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Title (optional)</label>
                                <Input
                                  value={newReview.title}
                                  onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                                  placeholder="Great experience!"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Review</label>
                                <Textarea
                                  value={newReview.comment}
                                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                  placeholder="Tell others about your experience..."
                                  className="mt-1"
                                  rows={4}
                                />
                              </div>
                              <Button
                                onClick={handleReviewSubmit}
                                disabled={isSubmittingReview || !newReview.comment.trim()}
                                className="w-full"
                              >
                                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {reviews.length > 0 ? (
                        reviews.map((review) => (
                          <div key={review.id} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-start space-x-3">
                              <Avatar>
                                <AvatarImage src={review.user?.avatar_url} />
                                <AvatarFallback>
                                  {review.user?.full_name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium">{review.user?.full_name || 'Anonymous'}</span>
                                  <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {new Date(review.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                {review.title && (
                                  <h4 className="font-medium mb-1">{review.title}</h4>
                                )}
                                <p className="text-gray-700">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="vendor" className="p-6">
                  {service.vendor && (
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={service.vendor.profile_image_url} />
                          <AvatarFallback>
                            {service.vendor.business_name?.charAt(0) || 'V'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold">{service.vendor.business_name}</h3>
                            {service.vendor.verified && (
                              <Badge className="bg-green-100 text-green-800">
                                <Shield className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600">{service.vendor.contact_person}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{service.vendor.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{service.vendor.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 md:col-span-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{service.vendor.address}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Book This Service</span>
                  <Badge variant="secondary">Available</Badge>
                </CardTitle>
                <CardDescription>
                  Reserve your spot today
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">₹{service.price}</div>
                  <div className="text-sm text-gray-600">per {service.price_unit || 'service'}</div>
                </div>

                <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full h-12 bg-orange-500 hover:bg-orange-600">
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Book {service.name}</DialogTitle>
                      <DialogDescription>
                        Fill in the details to make your reservation
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Select Date</label>
                        <Calendar
                          mode="single"
                          selected={bookingData.date}
                          onSelect={(date) => setBookingData(prev => ({ ...prev, date }))}
                          disabled={(date) => date < new Date()}
                          className="rounded-md border mt-1"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Select Time</label>
                        <Select
                          value={bookingData.time}
                          onValueChange={(value) => setBookingData(prev => ({ ...prev, time: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Choose time slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Number of Guests</label>
                        <Select
                          value={bookingData.guests.toString()}
                          onValueChange={(value) => setBookingData(prev => ({ ...prev, guests: parseInt(value) }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                              <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Guest' : 'Guests'}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Special Requests (Optional)</label>
                        <Textarea
                          value={bookingData.specialRequests}
                          onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                          placeholder="Any special requirements..."
                          className="mt-1"
                          rows={3}
                        />
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-medium">Total Amount</span>
                          <span className="text-xl font-bold text-orange-600">
                            ₹{(service.price * bookingData.guests).toLocaleString()}
                          </span>
                        </div>
                        
                        <Button
                          onClick={handleBookingSubmit}
                          disabled={isBooking || !bookingData.date || !bookingData.time}
                          className="w-full"
                        >
                          {isBooking ? 'Processing...' : 'Confirm Booking'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="text-center text-sm text-gray-600 space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Free cancellation</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span>Secure booking</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1" onClick={() => navigate(`/vendor/${service.vendor_id}`)}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Related Services */}
            {relatedServices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Similar Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedServices.map((relatedService) => (
                    <Link
                      key={relatedService.id}
                      to={`/services/${relatedService.id}`}
                      className="block group"
                    >
                      <div className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <img
                          src={relatedService.images?.[0] || '/placeholder.svg'}
                          alt={relatedService.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium group-hover:text-orange-600 transition-colors truncate">
                            {relatedService.name}
                          </h4>
                          <p className="text-sm text-gray-600 truncate">{relatedService.location}</p>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-gray-600 ml-1">
                                {relatedService.rating || 4.5}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-orange-600">
                              ₹{relatedService.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
