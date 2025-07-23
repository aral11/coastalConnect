import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Anchor,
  ArrowLeft,
  Construction,
  Home
} from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function PlaceholderPage({ 
  title, 
  description, 
  icon = <Construction className="h-16 w-16 text-coastal-400" />
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-coastal-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-coastal-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fa92c07345b2448db8df3322125c3b3e6%2Fd353be6a54374bebb7d9c1f516095097?format=webp&width=800"
                alt="coastalConnect"
                className="logo-brand h-10"
              />
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/hotels" className="text-gray-600 hover:text-coastal-600 transition-colors">Hotels</Link>
              <Link to="/drivers" className="text-gray-600 hover:text-coastal-600 transition-colors">Drivers</Link>
              <Link to="/about" className="text-gray-600 hover:text-coastal-600 transition-colors">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-coastal-600 transition-colors">Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-coastal-600 hover:text-coastal-700">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="btn-coastal">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="card-coastal max-w-lg text-center p-8">
          <CardHeader>
            <div className="flex justify-center mb-4">
              {icon}
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">{title}</CardTitle>
            <CardDescription className="text-lg mt-4">
              {description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-gray-600">
              This page is part of our upcoming features. We're working hard to bring you 
              the best coastal experience platform. Stay tuned for updates!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="btn-coastal min-w-[140px]">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
              <Link to="/" className="sm:order-first">
                <Button variant="outline" className="border-coastal-300 text-coastal-600 hover:bg-coastal-50 min-w-[140px]">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
