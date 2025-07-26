import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft,
  Users,
  MapPin,
  Heart,
  Award,
  Compass,
  Shield,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

const teamMembers = [
  {
    name: 'Arjun Patel',
    role: 'Founder & CEO',
    image: '/placeholder.svg',
    description: 'Passionate about connecting travelers with authentic coastal experiences.'
  },
  {
    name: 'Priya Nair',
    role: 'Head of Operations',
    image: '/placeholder.svg',
    description: 'Ensures seamless experiences for both travelers and local service providers.'
  },
  {
    name: 'Vikram Rao',
    role: 'Technology Lead',
    image: '/placeholder.svg',
    description: 'Building innovative solutions to enhance the coastal travel experience.'
  },
  {
    name: 'Sneha Kamath',
    role: 'Community Manager',
    image: '/placeholder.svg',
    description: 'Fostering relationships with local creators and businesses.'
  }
];

const achievements = [
  { number: '10,000+', label: 'Happy Travelers', icon: Users },
  { number: '500+', label: 'Local Partners', icon: MapPin },
  { number: '50+', label: 'Coastal Destinations', icon: Compass },
  { number: '4.8', label: 'Average Rating', icon: Award }
];

export default function About() {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Page Header */}
        <PageHeader
          title="About Coastal Connect"
          subtitle="Connecting you with authentic coastal experiences across Karnataka"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'About Us', href: '/about' }
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

        <div className="container mx-auto px-4 py-8 space-y-12">
          {/* Our Story Section */}
          <section className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Born from a love for Karnataka's stunning coastline, Coastal Connect was created to bridge 
                the gap between travelers seeking authentic experiences and local communities offering 
                unique services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Heart className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h3>
                    <p className="text-gray-600">
                      To create meaningful connections between travelers and local communities while 
                      promoting sustainable tourism along Karnataka's beautiful coast.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Shield className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Values</h3>
                    <p className="text-gray-600">
                      Authenticity, sustainability, and community empowerment guide everything we do. 
                      We believe in responsible tourism that benefits everyone.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Compass className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Vision</h3>
                    <p className="text-gray-600">
                      To become the leading platform for coastal tourism in India, setting the standard 
                      for community-driven travel experiences.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Coastal Karnataka"
                  className="rounded-lg shadow-lg w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </section>

          {/* Achievements Section */}
          <section className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
              <p className="text-gray-600">Together, we're building something special</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    <achievement.icon className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{achievement.number}</div>
                  <div className="text-sm text-gray-600">{achievement.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're a passionate team of travel enthusiasts, tech experts, and community builders 
                working to transform coastal tourism.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="text-orange-600 font-medium">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-gray-600">Have questions? We'd love to hear from you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Phone className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600">+91 9876543210</p>
              </div>

              <div className="text-center">
                <Mail className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600">hello@coastalconnect.in</p>
              </div>

              <div className="text-center">
                <Calendar className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Office Hours</h3>
                <p className="text-gray-600">Mon-Fri: 9AM-6PM</p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link to="/contact">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Contact Us
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
