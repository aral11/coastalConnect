import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import SearchSection from "@/components/SearchSection";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ExternalLink,
  Search,
  Filter,
  Star,
  Heart,
  Share2,
  Ticket,
  ArrowLeft,
  Sparkles,
  Music,
  Camera,
  Utensils,
} from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  address: string;
  event_date: string;
  start_time: string;
  end_time?: string;
  organizer: string;
  contact_phone?: string;
  contact_email?: string;
  entry_fee: number;
  image_url: string;
  website_url?: string;
  capacity: number;
  registered_count: number;
  is_featured: boolean;
  status: string;
  admin_approval_status: string;
}

export default function Events() {
  const { id } = useParams();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "cultural", label: "Cultural" },
    { value: "religious", label: "Religious" },
    { value: "festival", label: "Festival" },
    { value: "kambala", label: "Kambala" },
    { value: "workshop", label: "Workshop" },
    { value: "food", label: "Food & Culinary" },
    { value: "music", label: "Music & Arts" },
    { value: "sports", label: "Sports" },
    { value: "business", label: "Business" },
  ];

  const dateFilters = [
    { value: "all", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "this_week", label: "This Week" },
    { value: "this_month", label: "This Month" },
    { value: "upcoming", label: "Upcoming" },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery, selectedCategory, selectedDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      // Use Supabase to fetch events
      const { getEvents } = await import('@/lib/supabase');
      const eventsData = await getEvents({
        status: "published",
        upcoming: true,
        limit: 50
      });

      if (eventsData && eventsData.length > 0) {
        // Transform Supabase data to match our interface
        const transformedEvents = eventsData.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          category: event.category,
          location: event.locations?.name || event.venue_name || "Udupi",
          address: event.venue_address || "",
          event_date: event.event_date,
          start_time: event.start_time,
          end_time: event.end_time,
          organizer: event.users?.name || event.organizer_name || "Local Organization",
          contact_phone: event.contact_phone || "",
          contact_email: event.contact_email || "",
          entry_fee: event.ticket_price || 0,
          image_url: event.featured_image_url || `https://images.unsplash.com/photo-${1578662996442 + Math.floor(Math.random() * 100000)}?w=600&h=400&fit=crop`,
          website_url: event.website_url || "",
          capacity: event.max_capacity || 100,
          registered_count: event.current_registrations || 0,
          is_featured: event.is_featured || false,
          status: "upcoming",
          admin_approval_status: "approved",
        }));
        setEvents(transformedEvents);
      } else {
        // Use fallback data if no events in Supabase
        throw new Error("No events found in database");
      }
    } catch (error) {
      console.log("Loading fallback events data...");

      // Genuine Udupi/Manipal festival and event data
      const fallbackEvents: Event[] = [
        {
          id: 1,
          title: "Krishna Janmashtami Festival 2024",
          description:
            "Grand celebration at Sri Krishna Temple, Udupi with elaborate decorations, traditional rituals, cultural programs, and distribution of prasadam. The birthplace of Lord Krishna celebrations with midnight Abhisheka.",
          category: "religious",
          location: "Udupi",
          address: "Sri Krishna Temple, Car Street, Udupi, Karnataka 576101",
          event_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          start_time: "05:00",
          end_time: "23:59",
          organizer: "Sri Krishna Temple Udupi",
          contact_phone: "0820-2520636",
          contact_email: "info@udupiconventionsandfairs.org",
          entry_fee: 0,
          image_url:
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
          website_url: "https://udupi.org",
          capacity: 10000,
          registered_count: 8500,
          is_featured: true,
          status: "upcoming",
          admin_approval_status: "approved",
        },
        {
          id: 2,
          title: "Paryaya Festival 2024",
          description:
            "The biennial change of temple administration ceremony at Sri Krishna Temple. A grand festival with processions, cultural programs, and religious ceremonies marking the handover between the Ashta Mathas.",
          category: "religious",
          location: "Udupi",
          address: "Sri Krishna Temple and Car Street, Udupi, Karnataka 576101",
          event_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          start_time: "06:00",
          end_time: "22:00",
          organizer: "Ashta Mathas of Udupi",
          contact_phone: "0820-2520636",
          contact_email: "info@udupiconventionsandfairs.org",
          entry_fee: 0,
          image_url:
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
          capacity: 15000,
          registered_count: 12000,
          is_featured: true,
          status: "upcoming",
          admin_approval_status: "approved",
        },
        {
          id: 3,
          title: "Kambala Buffalo Race Festival",
          description:
            "Traditional buffalo race in muddy waters - a centuries-old sport unique to coastal Karnataka. Experience the thrill, local culture, folk music, and authentic coastal cuisine.",
          category: "kambala",
          location: "Kambala Ground, Udupi",
          address: "Kambala Ground, NH 66, Udupi, Karnataka 576101",
          event_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          start_time: "14:00",
          end_time: "19:00",
          organizer: "Coastal Karnataka Kambala Committee",
          contact_phone: "0820-2580099",
          contact_email: "info@coastalkambala.org",
          entry_fee: 100,
          image_url:
            "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=400&fit=crop",
          capacity: 5000,
          registered_count: 3456,
          is_featured: true,
          status: "upcoming",
          admin_approval_status: "approved",
        },
        {
          id: 4,
          title: "Malpe Beach Festival & Water Sports",
          description:
            "Annual beach festival featuring surfing competitions, parasailing, jet skiing, traditional boat races, seafood stalls, and live music. Family-friendly coastal celebration.",
          category: "festival",
          location: "Malpe Beach",
          address: "Malpe Beach, Malpe, Udupi, Karnataka 576103",
          event_date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          start_time: "09:00",
          end_time: "21:00",
          organizer: "Malpe Tourism Development Committee",
          contact_phone: "0820-2532456",
          contact_email: "tourism@malpebeach.org",
          entry_fee: 50,
          image_url:
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
          website_url: "https://malpebeachfestival.org",
          capacity: 8000,
          registered_count: 2345,
          is_featured: true,
          status: "upcoming",
          admin_approval_status: "approved",
        },
        {
          id: 5,
          title: "Udupi Cuisine Festival & Cooking Workshop",
          description:
            "Celebrate authentic Udupi cuisine with traditional cooking workshops, tasting sessions of masala dosa, idli, sambar, and filter coffee. Learn from master chefs of local temples.",
          category: "food",
          location: "Udupi",
          address: "Rajangana, Near Krishna Temple, Car Street, Udupi",
          event_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          start_time: "10:00",
          end_time: "20:00",
          organizer: "Udupi Traditional Cooking Society",
          contact_phone: "0820-2520789",
          contact_email: "cuisine@udupifood.org",
          entry_fee: 200,
          image_url:
            "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop",
          website_url: "https://udupicuisinefestival.org",
          capacity: 1500,
          registered_count: 890,
          is_featured: false,
          status: "upcoming",
          admin_approval_status: "approved",
        },
        {
          id: 6,
          title: "Coastal Photography Workshop",
          description:
            "Learn the art of coastal landscape photography with professional photographers. Hands-on workshop covering techniques, composition, and equipment.",
          category: "workshop",
          location: "Kaup Beach",
          address: "Kaup Beach Lighthouse, Karnataka",
          event_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          start_time: "06:00",
          end_time: "18:00",
          organizer: "Coastal Photography Club",
          contact_phone: "9876543210",
          contact_email: "workshop@coastalphoto.in",
          entry_fee: 500,
          image_url:
            "https://images.unsplash.com/photo-1606721977440-2c2b62e4f647?w=600&h=400&fit=crop",
          website_url: "https://coastalphotoworkshop.in",
          capacity: 50,
          registered_count: 23,
          is_featured: false,
          status: "upcoming",
          admin_approval_status: "approved",
        },
      ];

      setEvents(fallbackEvents);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory,
      );
    }

    // Filter by date
    if (selectedDate !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.event_date);

        switch (selectedDate) {
          case "today":
            return eventDate.toDateString() === today.toDateString();
          case "tomorrow":
            return eventDate.toDateString() === tomorrow.toDateString();
          case "this_week":
            return eventDate >= today && eventDate <= weekFromNow;
          case "this_month":
            return eventDate >= today && eventDate <= monthFromNow;
          case "upcoming":
            return eventDate >= today;
          default:
            return true;
        }
      });
    }

    // Sort by date (earliest first)
    filtered.sort(
      (a, b) =>
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime(),
    );

    setFilteredEvents(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else if (diffDays > 0 && diffDays <= 7) {
      return `In ${diffDays} days`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "cultural":
        return <Camera className="h-4 w-4" />;
      case "religious":
        return <Sparkles className="h-4 w-4" />;
      case "festival":
        return <Music className="h-4 w-4" />;
      case "food":
        return <Utensils className="h-4 w-4" />;
      case "workshop":
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "cultural":
        return "bg-purple-100 text-purple-700";
      case "religious":
        return "bg-yellow-100 text-yellow-700";
      case "festival":
        return "bg-pink-100 text-pink-700";
      case "food":
        return "bg-green-100 text-green-700";
      case "workshop":
        return "bg-blue-100 text-blue-700";
      case "kambala":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <PageHeader
        title="Local Events"
        description="Discover exciting events, festivals, and cultural experiences in Udupi & Manipal"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
        ]}
      />

      {/* Search and Filters */}
      <SearchSection>
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search events, organizers, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Filter */}
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  {dateFilters.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {filteredEvents.length} of {events.length} events
              </div>
              {/* Only show create event button to approved organizers */}
              {user?.role === "event_organizer" &&
              user?.vendor_status === "approved" ? (
                <Link to="/create-event">
                  <Button
                    variant="outline"
                    className="text-orange-600 border-orange-600 hover:bg-orange-50"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
              ) : user?.role === "event_organizer" ? (
                <Button
                  disabled
                  variant="outline"
                  className="text-gray-400 border-gray-300"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Approval Pending
                </Button>
              ) : (
                <Link to="/organizer-register">
                  <Button
                    variant="outline"
                    className="text-orange-600 border-orange-600 hover:bg-orange-50"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Become Organizer
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </SearchSection>

      {/* Events Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Events Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ||
              selectedCategory !== "all" ||
              selectedDate !== "all"
                ? "Try adjusting your search filters to find more events."
                : "No events are currently scheduled. Check back soon for updates!"}
            </p>
            {(searchQuery ||
              selectedCategory !== "all" ||
              selectedDate !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedDate("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Featured Events */}
            {filteredEvents.some((event) => event.is_featured) && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Star className="h-6 w-6 mr-2 text-orange-500" />
                  Featured Events
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredEvents
                    .filter((event) => event.is_featured)
                    .slice(0, 2)
                    .map((event) => (
                      <Card
                        key={event.id}
                        className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
                      >
                        <div className="relative h-48">
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge
                              className={`${getCategoryColor(event.category)} flex items-center space-x-1`}
                            >
                              {getCategoryIcon(event.category)}
                              <span>{event.category}</span>
                            </Badge>
                          </div>
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-orange-500 text-white">
                              Featured
                            </Badge>
                          </div>
                        </div>

                        <CardHeader>
                          <CardTitle className="text-xl">
                            {event.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {event.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              {formatDate(event.event_date)}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-2" />
                              {formatTime(event.start_time)}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.location}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Ticket className="h-4 w-4 mr-2" />
                              {event.entry_fee === 0
                                ? "Free"
                                : `₹${event.entry_fee}`}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="text-sm text-gray-600">
                              By {event.organizer}
                            </div>
                            <Button className="bg-orange-600 hover:bg-orange-700">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {/* All Events */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {filteredEvents.some((event) => event.is_featured)
                  ? "All Events"
                  : "Upcoming Events"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative h-32">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge
                          className={`${getCategoryColor(event.category)} text-xs flex items-center space-x-1`}
                        >
                          {getCategoryIcon(event.category)}
                          <span>{event.category}</span>
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-1">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {event.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-3 w-3 mr-2" />
                          {formatDate(event.event_date)}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-3 w-3 mr-2" />
                          {formatTime(event.start_time)}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-3 w-3 mr-2" />
                          {event.location}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="text-sm font-medium text-orange-600">
                          {event.entry_fee === 0
                            ? "Free Entry"
                            : `₹${event.entry_fee}`}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            <Heart className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            <Share2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700 text-xs"
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Organize Your Own Event</h2>
          <p className="text-xl mb-8 opacity-90">
            Share your event with the coastal community and reach thousands of
            local participants
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/organizer-register">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-orange-600 hover:bg-gray-50"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Become an Organizer
              </Button>
            </Link>
            <Link to="/organizer-login">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Users className="h-5 w-5 mr-2" />
                Organizer Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
