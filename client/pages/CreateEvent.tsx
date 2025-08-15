import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Image,
  Globe,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Save,
  Send,
} from "lucide-react";

interface EventForm {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  location: string;
  detailed_address: string;
  venue_name: string;
  venue_capacity: number | "";
  event_date: string;
  start_time: string;
  end_time: string;
  is_multi_day: boolean;
  end_date: string;
  entry_fee: number | "";
  is_free: boolean;
  registration_required: boolean;
  registration_url: string;
  registration_deadline: string;
  max_attendees: number | "";
  image_url: string;
  contact_phone: string;
  contact_email: string;
  website_url: string;
  requirements: string;
  amenities: string;
  accessibility_info: string;
  cancellation_policy: string;
  tags: string;
  age_restrictions: string;
  languages: string;
  certificates_provided: boolean;
  weather_dependency: boolean;
  backup_plan: string;
  live_streaming: boolean;
  recording_allowed: boolean;
}

export default function CreateEvent() {
  const [formData, setFormData] = useState<EventForm>({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    location: "",
    detailed_address: "",
    venue_name: "",
    venue_capacity: "",
    event_date: "",
    start_time: "",
    end_time: "",
    is_multi_day: false,
    end_date: "",
    entry_fee: "",
    is_free: true,
    registration_required: false,
    registration_url: "",
    registration_deadline: "",
    max_attendees: "",
    image_url: "",
    contact_phone: "",
    contact_email: "",
    website_url: "",
    requirements: "",
    amenities: "",
    accessibility_info: "",
    cancellation_policy: "",
    tags: "",
    age_restrictions: "",
    languages: "",
    certificates_provided: false,
    weather_dependency: false,
    backup_plan: "",
    live_streaming: false,
    recording_allowed: true,
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    { value: "kambala", label: "Kambala & Traditional Sports" },
    { value: "festival", label: "Festival" },
    { value: "cultural", label: "Cultural Event" },
    { value: "religious", label: "Religious Event" },
    { value: "sports", label: "Sports Competition" },
    { value: "educational", label: "Educational Workshop" },
    { value: "workshop", label: "Workshop/Training" },
    { value: "conference", label: "Conference/Seminar" },
    { value: "concert", label: "Concert/Performance" },
    { value: "exhibition", label: "Exhibition/Market" },
    { value: "competition", label: "Competition" },
    { value: "community", label: "Community Event" },
    { value: "charity", label: "Charity Event" },
    { value: "other", label: "Other" },
  ];

  const locations = [
    { value: "udupi", label: "Udupi" },
    { value: "manipal", label: "Manipal" },
    { value: "malpe", label: "Malpe" },
    { value: "kaup", label: "Kaup" },
    { value: "other", label: "Other Location" },
  ];

  const handleInputChange = (field: keyof EventForm, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep1 = () => {
    return (
      formData.title &&
      formData.description &&
      formData.category &&
      formData.location &&
      formData.detailed_address
    );
  };

  const validateStep2 = () => {
    return (
      formData.event_date &&
      formData.start_time &&
      formData.end_time &&
      formData.contact_phone &&
      formData.contact_email
    );
  };

  const handleSubmit = async (submitForApproval = false) => {
    setLoading(true);
    setError("");

    try {
      // Check if user is authenticated and has proper role
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      // Check if user has event_organizer role
      const { data: userProfile } = await supabase
        .from("users")
        .select("role, vendor_status")
        .eq("id", user.id)
        .single();

      if (userProfile?.role !== "event_organizer") {
        setError(
          "Only verified event organizers can create events. Please register as an event organizer first.",
        );
        return;
      }

      if (userProfile?.vendor_status !== "approved") {
        setError(
          "Your organizer account must be approved before creating events. Please contact support.",
        );
        return;
      }

      const response = await fetch("/api/organizers/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        if (submitForApproval) {
          // Submit for approval immediately
          const submitResponse = await fetch(
            `/api/organizers/events/${data.data.id}/submit`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (submitResponse.ok) {
            setSuccess(true);
          }
        } else {
          setSuccess(true);
        }
      } else {
        setError(data.message || "Failed to create event");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Event Created Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your event has been created and is ready for review.
            </p>
            <div className="space-y-2">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => (window.location.href = "/organizer-dashboard")}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => (window.location.href = "/organizer/events")}
              >
                Manage Events
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => (window.location.href = "/organizer-dashboard")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Event
              </h1>
            </div>
            <Badge variant="secondary">Step {step} of 3</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                1
              </div>
              <span className="ml-2 font-medium">Basic Details</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div
              className={`flex items-center ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                2
              </div>
              <span className="ml-2 font-medium">Date & Contact</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div
              className={`flex items-center ${step >= 3 ? "text-blue-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                3
              </div>
              <span className="ml-2 font-medium">Additional Info</span>
            </div>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>
              {step === 1 && "Event Basic Information"}
              {step === 2 && "Date, Time & Contact Details"}
              {step === 3 && "Additional Information & Settings"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Basic Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Event Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe your event in detail"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category">Event Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Input
                      id="subcategory"
                      value={formData.subcategory}
                      onChange={(e) =>
                        handleInputChange("subcategory", e.target.value)
                      }
                      placeholder="e.g., Dance, Music, Art"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Select
                      value={formData.location}
                      onValueChange={(value) =>
                        handleInputChange("location", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc.value} value={loc.value}>
                            {loc.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="venue_name">Venue Name</Label>
                    <Input
                      id="venue_name"
                      value={formData.venue_name}
                      onChange={(e) =>
                        handleInputChange("venue_name", e.target.value)
                      }
                      placeholder="Name of the venue"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="detailed_address">Detailed Address *</Label>
                  <Textarea
                    id="detailed_address"
                    value={formData.detailed_address}
                    onChange={(e) =>
                      handleInputChange("detailed_address", e.target.value)
                    }
                    placeholder="Complete address with landmarks"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="venue_capacity">Venue Capacity</Label>
                    <Input
                      id="venue_capacity"
                      type="number"
                      value={formData.venue_capacity}
                      onChange={(e) =>
                        handleInputChange(
                          "venue_capacity",
                          parseInt(e.target.value) || "",
                        )
                      }
                      placeholder="Maximum capacity"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image_url">Event Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) =>
                        handleInputChange("image_url", e.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Date & Contact */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="event_date">Event Date *</Label>
                    <Input
                      id="event_date"
                      type="date"
                      value={formData.event_date}
                      onChange={(e) =>
                        handleInputChange("event_date", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="start_time">Start Time *</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) =>
                        handleInputChange("start_time", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_time">End Time *</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={formData.end_time}
                      onChange={(e) =>
                        handleInputChange("end_time", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_multi_day"
                    checked={formData.is_multi_day}
                    onCheckedChange={(checked) =>
                      handleInputChange("is_multi_day", checked)
                    }
                  />
                  <Label htmlFor="is_multi_day">
                    This is a multi-day event
                  </Label>
                </div>

                {formData.is_multi_day && (
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        handleInputChange("end_date", e.target.value)
                      }
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_free"
                      checked={formData.is_free}
                      onCheckedChange={(checked) =>
                        handleInputChange("is_free", checked)
                      }
                    />
                    <Label htmlFor="is_free">This is a free event</Label>
                  </div>

                  {!formData.is_free && (
                    <div>
                      <Label htmlFor="entry_fee">Entry Fee (₹)</Label>
                      <Input
                        id="entry_fee"
                        type="number"
                        value={formData.entry_fee}
                        onChange={(e) =>
                          handleInputChange(
                            "entry_fee",
                            parseInt(e.target.value) || "",
                          )
                        }
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="registration_required"
                      checked={formData.registration_required}
                      onCheckedChange={(checked) =>
                        handleInputChange("registration_required", checked)
                      }
                    />
                    <Label htmlFor="registration_required">
                      Registration required
                    </Label>
                  </div>

                  {formData.registration_required && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="registration_url">
                          Registration URL
                        </Label>
                        <Input
                          id="registration_url"
                          value={formData.registration_url}
                          onChange={(e) =>
                            handleInputChange(
                              "registration_url",
                              e.target.value,
                            )
                          }
                          placeholder="https://forms.google.com/..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="max_attendees">Max Attendees</Label>
                        <Input
                          id="max_attendees"
                          type="number"
                          value={formData.max_attendees}
                          onChange={(e) =>
                            handleInputChange(
                              "max_attendees",
                              parseInt(e.target.value) || "",
                            )
                          }
                          placeholder="Unlimited"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="contact_phone">Contact Phone *</Label>
                    <Input
                      id="contact_phone"
                      value={formData.contact_phone}
                      onChange={(e) =>
                        handleInputChange("contact_phone", e.target.value)
                      }
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_email">Contact Email *</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) =>
                        handleInputChange("contact_email", e.target.value)
                      }
                      placeholder="contact@event.com"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Additional Information */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="requirements">
                    Requirements for Attendees
                  </Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) =>
                      handleInputChange("requirements", e.target.value)
                    }
                    placeholder="What should attendees bring or know?"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="amenities">Amenities Provided</Label>
                  <Textarea
                    id="amenities"
                    value={formData.amenities}
                    onChange={(e) =>
                      handleInputChange("amenities", e.target.value)
                    }
                    placeholder="Parking, food, WiFi, etc."
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) =>
                        handleInputChange("tags", e.target.value)
                      }
                      placeholder="cultural, music, dance, family"
                    />
                  </div>
                  <div>
                    <Label htmlFor="languages">Languages</Label>
                    <Input
                      id="languages"
                      value={formData.languages}
                      onChange={(e) =>
                        handleInputChange("languages", e.target.value)
                      }
                      placeholder="Kannada, English, Hindi"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Event Options</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="certificates_provided"
                        checked={formData.certificates_provided}
                        onCheckedChange={(checked) =>
                          handleInputChange("certificates_provided", checked)
                        }
                      />
                      <Label htmlFor="certificates_provided">
                        Certificates provided
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="weather_dependency"
                        checked={formData.weather_dependency}
                        onCheckedChange={(checked) =>
                          handleInputChange("weather_dependency", checked)
                        }
                      />
                      <Label htmlFor="weather_dependency">
                        Weather dependent
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="live_streaming"
                        checked={formData.live_streaming}
                        onCheckedChange={(checked) =>
                          handleInputChange("live_streaming", checked)
                        }
                      />
                      <Label htmlFor="live_streaming">
                        Live streaming available
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="recording_allowed"
                        checked={formData.recording_allowed}
                        onCheckedChange={(checked) =>
                          handleInputChange("recording_allowed", checked)
                        }
                      />
                      <Label htmlFor="recording_allowed">
                        Recording allowed
                      </Label>
                    </div>
                  </div>
                </div>

                {formData.weather_dependency && (
                  <div>
                    <Label htmlFor="backup_plan">Backup Plan</Label>
                    <Textarea
                      id="backup_plan"
                      value={formData.backup_plan}
                      onChange={(e) =>
                        handleInputChange("backup_plan", e.target.value)
                      }
                      placeholder="What happens if weather doesn't cooperate?"
                      rows={3}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="cancellation_policy">
                    Cancellation Policy
                  </Label>
                  <Textarea
                    id="cancellation_policy"
                    value={formData.cancellation_policy}
                    onChange={(e) =>
                      handleInputChange("cancellation_policy", e.target.value)
                    }
                    placeholder="Your event cancellation and refund policy"
                    rows={3}
                  />
                </div>
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
                <div className="ml-auto space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSubmit(false)}
                    disabled={loading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleSubmit(true)}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Create & Submit for Approval
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
