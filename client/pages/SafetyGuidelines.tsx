import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Shield,
  AlertTriangle,
  CheckCircle,
  Phone,
  MapPin,
  Camera,
  Car,
  Waves,
  Mountain,
  UtensilsCrossed,
  Building,
  Heart,
  Users,
  Clock,
  FileText,
  Download,
  ExternalLink
} from 'lucide-react';

const safetyCategories = [
  {
    id: 'general',
    title: 'General Safety',
    icon: Shield,
    color: 'blue',
    guidelines: [
      'Always carry a valid government-issued photo ID',
      'Keep emergency contact numbers saved in your phone',
      'Share your travel itinerary with family or friends',
      'Keep copies of important documents in a separate location',
      'Carry sufficient cash as ATMs may not be available in remote areas',
      'Stay hydrated and carry a first aid kit',
      'Follow local customs and dress codes'
    ]
  },
  {
    id: 'accommodation',
    title: 'Homestay Safety',
    icon: Building,
    color: 'green',
    guidelines: [
      'Verify homestay credentials and reviews before booking',
      'Check fire safety measures and emergency exits',
      'Ensure rooms have proper locks and security',
      'Keep valuables in provided safe or locked luggage',
      'Report any safety concerns to the host immediately',
      'Respect house rules and local customs',
      'Keep emergency contact numbers handy'
    ]
  },
  {
    id: 'transportation',
    title: 'Transportation Safety',
    icon: Car,
    color: 'orange',
    guidelines: [
      'Use only verified and registered drivers/vehicles',
      'Check driver credentials and vehicle registration',
      'Always wear seatbelts and helmets when required',
      'Avoid traveling during heavy rains or bad weather',
      'Share ride details with family/friends',
      'Keep driver contact information accessible',
      'Carry emergency roadside assistance numbers'
    ]
  },
  {
    id: 'beach',
    title: 'Beach & Water Safety',
    icon: Waves,
    color: 'cyan',
    guidelines: [
      'Never swim alone; always have a buddy',
      'Follow lifeguard instructions and warning flags',
      'Stay within designated swimming areas',
      'Be aware of tides, currents, and weather conditions',
      'Apply sunscreen regularly and stay hydrated',
      'Avoid consuming alcohol before swimming',
      'Learn basic water safety and rescue techniques'
    ]
  },
  {
    id: 'trekking',
    title: 'Trekking & Adventure',
    icon: Mountain,
    color: 'purple',
    guidelines: [
      'Inform others about your trekking plans and expected return',
      'Use proper trekking gear and equipment',
      'Carry GPS device or download offline maps',
      'Check weather conditions before starting',
      'Trek in groups; avoid solo adventures',
      'Carry sufficient water, food, and emergency supplies',
      'Know your limits and turn back if conditions worsen'
    ]
  },
  {
    id: 'food',
    title: 'Food Safety',
    icon: UtensilsCrossed,
    color: 'red',
    guidelines: [
      'Choose restaurants with good hygiene standards',
      'Drink bottled or properly purified water',
      'Avoid street food if you have a sensitive stomach',
      'Check food temperature and freshness',
      'Wash hands before eating',
      'Carry basic medications for stomach upset',
      'Inform restaurants about any food allergies'
    ]
  }
];

const emergencyContacts = [
  {
    service: 'Police',
    number: '100',
    description: 'For law enforcement emergencies'
  },
  {
    service: 'Fire Department',
    number: '101',
    description: 'For fire emergencies'
  },
  {
    service: 'Ambulance',
    number: '108',
    description: 'For medical emergencies'
  },
  {
    service: 'Tourist Helpline',
    number: '1363',
    description: 'For tourist assistance'
  },
  {
    service: 'Coastal Connect Support',
    number: '+91 9876543210',
    description: '24/7 support for our customers'
  }
];

const importantTips = [
  {
    title: 'Weather Awareness',
    description: 'Check weather forecasts and monsoon updates before traveling',
    icon: AlertTriangle
  },
  {
    title: 'Local Customs',
    description: 'Respect local traditions, especially when visiting religious places',
    icon: Heart
  },
  {
    title: 'Group Travel',
    description: 'Travel in groups when possible, especially at night',
    icon: Users
  },
  {
    title: 'Time Management',
    description: 'Plan activities during daylight hours when possible',
    icon: Clock
  }
];

export default function SafetyGuidelines() {
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'border-blue-200 bg-blue-50',
      green: 'border-green-200 bg-green-50',
      orange: 'border-orange-200 bg-orange-50',
      cyan: 'border-cyan-200 bg-cyan-50',
      purple: 'border-purple-200 bg-purple-50',
      red: 'border-red-200 bg-red-50'
    };
    return colorMap[color as keyof typeof colorMap] || 'border-gray-200 bg-gray-50';
  };

  const getIconColor = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
      cyan: 'text-cyan-600',
      purple: 'text-purple-600',
      red: 'text-red-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'text-gray-600';
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Page Header */}
        <PageHeader
          title="Safety Guidelines"
          subtitle="Essential safety information for your coastal Karnataka travels"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Safety Guidelines', href: '/safety' }
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

        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Important Alert */}
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Important:</strong> Always prioritize your safety while traveling. If you encounter any emergency, 
              contact local authorities immediately and inform our support team at +91 9876543210.
            </AlertDescription>
          </Alert>

          {/* Quick Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {importantTips.map((tip, index) => (
              <Card key={index} className="border-2 border-gray-200 hover:border-orange-300 transition-colors">
                <CardContent className="p-6 text-center">
                  <tip.icon className="h-10 w-10 text-orange-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Safety Categories */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Detailed Safety Guidelines</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Follow these comprehensive guidelines to ensure a safe and enjoyable experience 
                during your coastal Karnataka travels.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {safetyCategories.map((category) => (
                <Card key={category.id} className={`border-2 ${getColorClasses(category.color)}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <category.icon className={`h-6 w-6 ${getIconColor(category.color)}`} />
                      <span>{category.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.guidelines.map((guideline, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <Phone className="h-6 w-6" />
                <span>Emergency Contacts</span>
              </CardTitle>
              <CardDescription className="text-red-700">
                Save these numbers in your phone before traveling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{contact.service}</h4>
                      <Badge variant="outline" className="border-red-500 text-red-600">
                        Emergency
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-red-600 mb-2">{contact.number}</p>
                    <p className="text-sm text-gray-600">{contact.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weather and Seasonal Safety */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                <span>Seasonal Safety Considerations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Monsoon Season (June - September)</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Heavy rains can cause flooding and landslides</li>
                    <li>• Avoid trekking and water activities</li>
                    <li>• Road conditions may be poor</li>
                    <li>• Carry waterproof gear</li>
                    <li>• Check weather updates regularly</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Winter Season (December - February)</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Pleasant weather for most activities</li>
                    <li>• Perfect for beach visits and trekking</li>
                    <li>• Carry light woolens for early mornings</li>
                    <li>• Ideal time for photography</li>
                    <li>• Popular season - book accommodations early</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reporting and Support */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-blue-500" />
                  <span>Report Safety Issues</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  If you encounter any safety concerns or issues during your trip, please report them immediately.
                </p>
                <div className="space-y-3">
                  <Link to="/report-issue">
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Report Safety Issue
                    </Button>
                  </Link>
                  <Link to="/support">
                    <Button variant="outline" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-6 w-6 text-green-500" />
                  <span>Safety Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Download offline maps and emergency guides for your trip.
                </p>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Download Offline Maps
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Emergency Guide PDF
                    <Download className="h-4 w-4 ml-auto" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Camera className="h-4 w-4 mr-2" />
                    Local Guidelines
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Final Message */}
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-800 mb-4">Stay Safe, Travel Smart</h3>
              <p className="text-green-700 mb-6 max-w-2xl mx-auto">
                Following these safety guidelines will help ensure you have a memorable and secure experience 
                exploring the beautiful coastal regions of Karnataka. Your safety is our top priority.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Get More Information
                  </Button>
                </Link>
                <Link to="/help">
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                    Visit Help Center
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
