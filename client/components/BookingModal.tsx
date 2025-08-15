import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  CreditCard,
  IndianRupee,
  Users,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase, trackEvent } from "@/lib/supabase";

interface Homestay {
  id: number;
  name: string;
  location: string;
  price_per_night?: number;
  image_url?: string;
}

interface BookingModalProps {
  homestay: Homestay;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess?: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BookingModal({
  homestay,
  isOpen,
  onClose,
  onBookingSuccess,
}: BookingModalProps) {
  const { user, session, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState(user?.name || "");
  const [guestPhone, setGuestPhone] = useState(user?.phone || "");
  const [guestEmail, setGuestEmail] = useState(user?.email || "");
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate || !homestay.price_per_night) return 0;
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return nights * homestay.price_per_night;
  };

  const handleBooking = async () => {
    if (
      !checkInDate ||
      !checkOutDate ||
      !guestName ||
      !guestPhone ||
      !guestEmail
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      if (!isAuthenticated || !session) {
        alert("Please login to make a booking");
        window.location.href = "/login";
        return;
      }

      // Create booking
      const bookingResponse = await fetch("/api/bookings/homestay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          homestay_id: homestay.id,
          check_in_date: checkInDate.toISOString(),
          check_out_date: checkOutDate.toISOString(),
          guests,
          guest_name: guestName,
          guest_phone: guestPhone,
          guest_email: guestEmail,
          special_requests: specialRequests,
        }),
      });

      const bookingData = await bookingResponse.json();

      if (!bookingData.success) {
        throw new Error(bookingData.message);
      }

      // Proceed to payment
      handlePayment(bookingData.data);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (bookingData: any) => {
    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => processPayment(bookingData);
      document.body.appendChild(script);
    } else {
      processPayment(bookingData);
    }
  };

  const processPayment = (bookingData: any) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
      amount: bookingData.payment_intent.amount * 100, // Amount in paise
      currency: "INR",
      name: "coastalConnect",
      description: `Homestay Booking - ${homestay.name}`,
      order_id: bookingData.payment_intent.id,
      handler: async function (response: any) {
        try {
          // Confirm payment on server
          const confirmResponse = await fetch("/api/bookings/confirm-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              booking_id: bookingData.booking.id,
              booking_type: "homestay",
            }),
          });

          const confirmData = await confirmResponse.json();

          if (confirmData.success) {
            // Trigger real-time stats update
            const event = new CustomEvent("booking-confirmed", {
              detail: {
                id: bookingData.booking.id,
                type: "homestay",
                amount: bookingData.booking.total_amount,
              },
            });
            window.dispatchEvent(event);

            alert(
              "Booking confirmed! You will receive SMS confirmation shortly.",
            );
            onClose();
            setStep(1);
            // Reset form
            setCheckInDate(undefined);
            setCheckOutDate(undefined);
            setGuests(1);
            setGuestName("");
            setGuestPhone("");
            setGuestEmail("");
            setSpecialRequests("");
          } else {
            throw new Error(confirmData.message);
          }
        } catch (error) {
          console.error("Payment confirmation error:", error);
          alert("Payment confirmation failed. Please contact support.");
        }
      },
      prefill: {
        name: guestName,
        email: guestEmail,
        contact: guestPhone,
      },
      theme: {
        color: "#2D5A5A",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const resetAndClose = () => {
    setStep(1);
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
    setGuests(1);
    setGuestName("");
    setGuestPhone("");
    setGuestEmail("");
    setSpecialRequests("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-coastal-600" />
            Book {homestay.name}
          </DialogTitle>
          <DialogDescription>
            Complete your booking in{" "}
            {step === 1 ? "Step 1: Dates & Guests" : "Step 2: Guest Details"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Check-in Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkInDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkInDate ? format(checkInDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkInDate}
                      onSelect={setCheckInDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Check-out Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkOutDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOutDate
                        ? format(checkOutDate, "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkOutDate}
                      onSelect={setCheckOutDate}
                      disabled={(date) => date <= (checkInDate || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="guests">Number of Guests *</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Users className="h-4 w-4 text-gray-400" />
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max="10"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                  className="flex-1"
                />
              </div>
            </div>

            {checkInDate && checkOutDate && homestay.price_per_night && (
              <div className="bg-coastal-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>Total Amount:</span>
                  <span className="font-bold text-coastal-600 flex items-center">
                    <IndianRupee className="h-4 w-4" />
                    {calculateTotal()}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {Math.ceil(
                    (checkOutDate.getTime() - checkInDate.getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}{" "}
                  nights × ₹{homestay.price_per_night}
                </div>
              </div>
            )}

            <Button
              onClick={() => setStep(2)}
              className="w-full btn-coastal"
              disabled={!checkInDate || !checkOutDate}
            >
              Continue to Guest Details
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="guestName">Full Name *</Label>
              <Input
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Enter full name"
              />
            </div>

            <div>
              <Label htmlFor="guestPhone">Phone Number *</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Phone className="h-4 w-4 text-gray-400" />
                <Input
                  id="guestPhone"
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+91 98456 78901"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="guestEmail">Email Address *</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Mail className="h-4 w-4 text-gray-400" />
                <Input
                  id="guestEmail"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="specialRequests">
                Special Requests (Optional)
              </Label>
              <Textarea
                id="specialRequests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any special requirements or requests..."
                rows={3}
              />
            </div>

            <div className="bg-coastal-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Total Amount:</span>
                <span className="font-bold text-coastal-600 flex items-center">
                  <IndianRupee className="h-4 w-4" />
                  {calculateTotal()}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleBooking}
                className="flex-1 btn-coastal"
                disabled={loading || !guestName || !guestPhone || !guestEmail}
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay & Book
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
