/**
 * Visit Udupi Guide - Comprehensive tourist guide with festivals, seasons, and attractions
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/Layout";
import { supabase, trackEvent } from "@/lib/supabase";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import {
  Calendar,
  MapPin,
  Clock,
  Sun,
  CloudRain,
  Snowflake,
  Leaf,
  Download,
  Star,
  Camera,
  Info,
  Navigation,
  Heart,
  Users,
  FileText,
  ExternalLink,
} from "lucide-react";

interface Festival {
  id: string;
  name: string;
  description: string;
  festival_date?: string;
  festival_month?: number;
  location_id?: string;
  venue?: string;
  category: string;
  significance: string;
  primary_image_url?: string;
  locations?: { name: string; type: string };
}

interface Season {
  id: string;
  name: string;
  months: string;
  weather: string;
  temperature_range: string;
  ideal_for: string[];
  pros: string[];
  cons: string[];
  rainfall: string;
}

interface Attraction {
  id: string;
  name: string;
  type: string;
  description: string;
  location: string;
  best_time_to_visit: string;
  duration: string;
  entry_fee: string;
  highlights: string[];
  nearby_attractions: string[];
  rating: number;
  image_url?: string;
}

interface GuideData {
  festivals: Festival[];
  seasons: Season[];
  attractions: Attraction[];
}

export default function VisitUdupiGuide() {
  const { user } = useAuth();
  const [guideData, setGuideData] = useState<GuideData>({
    festivals: [],
    seasons: [],
    attractions: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    loadGuideData();
  }, []);

  const loadGuideData = async () => {
    try {
      setLoading(true);

      // Load guide data from Supabase
      const [festivalsResponse, seasonsResponse, attractionsResponse] =
        await Promise.all([
          supabase
            .from("festivals")
            .select("*")
            .eq("location", "Udupi")
            .eq("is_active", true)
            .order("date"),

          supabase
            .from("seasons")
            .select("*")
            .eq("location", "Udupi")
            .order("season_order"),

          supabase
            .from("attractions")
            .select("*")
            .eq("location", "Udupi")
            .eq("is_active", true)
            .order("rating", { ascending: false }),
        ]);

      // Use dynamic data if available, otherwise use fallback
      const festivals = festivalsResponse.data || getDefaultFestivals();
      const seasons = seasonsResponse.data || getDefaultSeasons();
      const attractions = attractionsResponse.data || getDefaultAttractions();

      setGuideData({ festivals, seasons, attractions });

      // Track guide view
      try {
        await trackEvent("guide_viewed", {
          user_id: user?.id,
          guide_type: "udupi_visitor_guide",
        });
      } catch (error) {
        console.warn("Failed to track guide view:", error);
      }
    } catch (error) {
      console.error("Error loading guide data:", error);
      // Use fallback data on error
      setGuideData({
        festivals: getDefaultFestivals(),
        seasons: getDefaultSeasons(),
        attractions: getDefaultAttractions(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Track PDF download
      await trackEvent("guide_pdf_download", {
        user_id: user?.id,
        guide_type: "udupi_visitor_guide",
      });

      // Generate professional HTML content for PDF
      const htmlContent = generateProfessionalPDFContent();

      // Open in new window for printing as PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Wait for content to load then trigger print
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 500);
      } else {
        // Fallback: create downloadable HTML file
        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Visit-Udupi-CoastalConnect-Guide.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading guide:", error);
    }
  };

  const generateProfessionalPDFContent = (): string => {
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visit Udupi - CoastalConnect Guide</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #374151;
            background: #ffffff;
        }

        .page {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            background: white;
            min-height: 297mm;
        }

        .cover-page {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #f97316 0%, #dc2626 100%);
            color: white;
            text-align: center;
            page-break-after: always;
        }

        .logo {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            letter-spacing: -0.025em;
        }

        .cover-title {
            font-size: 4rem;
            font-weight: 700;
            margin: 2rem 0;
            line-height: 1.1;
        }

        .cover-subtitle {
            font-size: 1.5rem;
            font-weight: 300;
            margin-bottom: 3rem;
            opacity: 0.9;
        }

        .cover-image {
            width: 100%;
            max-width: 600px;
            height: 300px;
            object-fit: cover;
            border-radius: 1rem;
            margin: 2rem 0;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .cover-footer {
            position: absolute;
            bottom: 2rem;
            font-size: 1rem;
            opacity: 0.8;
        }

        .section {
            page-break-before: always;
            padding: 2rem 0;
        }

        .section-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #f97316;
            margin-bottom: 1.5rem;
            border-bottom: 3px solid #f97316;
            padding-bottom: 0.5rem;
        }

        .section-intro {
            font-size: 1.2rem;
            color: #6b7280;
            margin-bottom: 2rem;
            line-height: 1.7;
        }

        .item {
            margin-bottom: 2rem;
            padding: 1.5rem;
            border: 1px solid #e5e7eb;
            border-radius: 1rem;
            background: #f9fafb;
        }

        .item-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 0.75rem;
        }

        .item-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }

        .meta-item {
            background: #f97316;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
        }

        .item-description {
            color: #4b5563;
            line-height: 1.7;
            margin-bottom: 1rem;
        }

        .highlights {
            background: #fef3c7;
            border: 1px solid #fbbf24;
            border-radius: 0.5rem;
            padding: 1rem;
            margin: 1rem 0;
        }

        .highlights-title {
            font-weight: 600;
            color: #92400e;
            margin-bottom: 0.5rem;
        }

        .highlights-list {
            list-style: none;
            padding: 0;
        }

        .highlights-list li {
            position: relative;
            padding-left: 1.5rem;
            margin-bottom: 0.25rem;
            color: #78350f;
        }

        .highlights-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #16a34a;
            font-weight: 600;
        }

        .footer {
            margin-top: 3rem;
            padding: 2rem;
            background: #f3f4f6;
            border-radius: 1rem;
            text-align: center;
        }

        .footer-logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: #f97316;
            margin-bottom: 0.5rem;
        }

        .footer-text {
            color: #6b7280;
            font-size: 0.875rem;
        }

        @media print {
            .page { margin: 0; padding: 15mm; }
            .section { page-break-before: always; }
            .cover-page { page-break-after: always; }
        }
    </style>
</head>
<body>
    <!-- Cover Page -->
    <div class="cover-page">
        <div class="logo">CoastalConnect</div>
        <h1 class="cover-title">Visit Udupi</h1>
        <p class="cover-subtitle">Your Complete Guide to Coastal Karnataka</p>
        <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=300&fit=crop"
             alt="Udupi Krishna Temple" class="cover-image">
        <div class="cover-footer">
            Generated on ${currentDate} | coastalconnect.in
        </div>
    </div>

    <!-- Festivals Section -->
    <div class="page">
        <div class="section">
            <h2 class="section-title">🎭 Festivals & Celebrations</h2>
            <p class="section-intro">
                Udupi is a land of vibrant festivals and spiritual celebrations. From the grandeur of Krishna Janmashtami
                to the unique tradition of Paryaya, each festival offers a glimpse into the rich cultural heritage of coastal Karnataka.
            </p>

            ${guideData.festivals.map(festival => `
                <div class="item">
                    <h3 class="item-title">${festival.name}</h3>
                    <div class="item-meta">
                        <span class="meta-item">📅 ${festival.date}</span>
                        <span class="meta-item">📍 ${festival.location}</span>
                        <span class="meta-item">🎯 ${festival.type}</span>
                    </div>
                    <p class="item-description">${festival.description}</p>
                    <div class="highlights">
                        <div class="highlights-title">Cultural Significance:</div>
                        <p>${festival.significance}</p>
                    </div>
                    ${festival.best_viewing_spots?.length ? `
                        <div class="highlights">
                            <div class="highlights-title">Best Viewing Spots:</div>
                            <ul class="highlights-list">
                                ${festival.best_viewing_spots.map(spot => `<li>${spot}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    </div>

    <!-- Seasons Section -->
    <div class="page">
        <div class="section">
            <h2 class="section-title">🌤️ Best Time to Visit</h2>
            <p class="section-intro">
                Plan your visit to Udupi according to the seasons. Each season offers unique experiences,
                from the festival-rich winter months to the lush green monsoon period.
            </p>

            ${guideData.seasons.map(season => `
                <div class="item">
                    <h3 class="item-title">${season.name}</h3>
                    <div class="item-meta">
                        <span class="meta-item">📅 ${season.months}</span>
                        <span class="meta-item">🌡️ ${season.temperature_range}</span>
                        <span class="meta-item">🌧️ ${season.rainfall}</span>
                    </div>
                    <p class="item-description">${season.weather}</p>
                    <div class="highlights">
                        <div class="highlights-title">Ideal For:</div>
                        <ul class="highlights-list">
                            ${season.ideal_for.map(activity => `<li>${activity}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="highlights">
                        <div class="highlights-title">Advantages:</div>
                        <ul class="highlights-list">
                            ${season.pros.map(pro => `<li>${pro}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    <!-- Attractions Section -->
    <div class="page">
        <div class="section">
            <h2 class="section-title">🏛️ Must-Visit Attractions</h2>
            <p class="section-intro">
                Discover the spiritual, cultural, and natural wonders of Udupi. From ancient temples to pristine beaches,
                these attractions showcase the best of coastal Karnataka.
            </p>

            ${guideData.attractions.map(attraction => `
                <div class="item">
                    <h3 class="item-title">${attraction.name}</h3>
                    <div class="item-meta">
                        <span class="meta-item">📍 ${attraction.location}</span>
                        <span class="meta-item">🏷️ ${attraction.type}</span>
                        <span class="meta-item">⭐ ${attraction.rating}/5</span>
                    </div>
                    <p class="item-description">${attraction.description}</p>
                    <div class="highlights">
                        <div class="highlights-title">Duration & Entry:</div>
                        <p><strong>Duration:</strong> ${attraction.duration} | <strong>Entry Fee:</strong> ${attraction.entry_fee}</p>
                        <p><strong>Best Time to Visit:</strong> ${attraction.best_time_to_visit}</p>
                    </div>
                    ${attraction.highlights?.length ? `
                        <div class="highlights">
                            <div class="highlights-title">Highlights:</div>
                            <ul class="highlights-list">
                                ${attraction.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${attraction.nearby_attractions?.length ? `
                        <div class="highlights">
                            <div class="highlights-title">Nearby Attractions:</div>
                            <p>${attraction.nearby_attractions.join(', ')}</p>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    </div>

    <!-- Cultural Insights Section -->
    <div class="page">
        <div class="section">
            <h2 class="section-title">🎯 Cultural Insights</h2>
            <p class="section-intro">
                Understanding the local culture enhances your experience in Udupi. Here are essential insights
                into traditions, customs, and way of life in this spiritual town.
            </p>

            <div class="item">
                <h3 class="item-title">Dvaita Philosophy Tradition</h3>
                <div class="item-meta">
                    <span class="meta-item">🏷️ Philosophy</span>
                </div>
                <p class="item-description">Udupi is the birthplace of Dvaita philosophy founded by Sri Madhvacharya. The eight Mathas (monasteries) continue this 700-year-old tradition of learning and worship.</p>
                <div class="highlights">
                    <div class="highlights-title">Practical Tips:</div>
                    <ul class="highlights-list">
                        <li>Dress modestly when visiting temples</li>
                        <li>Remove shoes before entering temple premises</li>
                        <li>Photography may be restricted inside temples</li>
                        <li>Maintain silence and respect during prayer times</li>
                    </ul>
                </div>
            </div>

            <div class="item">
                <h3 class="item-title">Local Customs & Etiquette</h3>
                <div class="item-meta">
                    <span class="meta-item">🏷️ Social Customs</span>
                </div>
                <p class="item-description">Udupi has a strong tradition of hospitality and spiritual living. Understanding local customs helps visitors connect better with the community.</p>
                <div class="highlights">
                    <div class="highlights-title">Practical Tips:</div>
                    <ul class="highlights-list">
                        <li>Greet with 'Namaste' with palms joined</li>
                        <li>Use right hand for giving/receiving items</li>
                        <li>Accept prasadam (temple offerings) with both hands</li>
                        <li>Respect local festivals and processions</li>
                    </ul>
                </div>
            </div>

            <div class="item">
                <h3 class="item-title">Vegetarian Food Culture</h3>
                <div class="item-meta">
                    <span class="meta-item">🏷️ Culinary Tradition</span>
                </div>
                <p class="item-description">Udupi is synonymous with pure vegetarian cuisine. The temple traditions have influenced the entire region's food culture, making it a vegetarian paradise.</p>
                <div class="highlights">
                    <div class="highlights-title">Practical Tips:</div>
                    <ul class="highlights-list">
                        <li>Most restaurants are strictly vegetarian</li>
                        <li>Try the famous temple prasadam</li>
                        <li>Meals are traditionally served on banana leaves</li>
                        <li>Don't waste food - it's considered disrespectful</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- Local Cuisine Section -->
    <div class="page">
        <div class="section">
            <h2 class="section-title">🍽️ Local Cuisine</h2>
            <p class="section-intro">
                Udupi cuisine is world-renowned for its vegetarian delicacies and temple food traditions.
                Discover the authentic flavors that have made this town a culinary destination.
            </p>

            <div class="item">
                <h3 class="item-title">Udupi Sambar</h3>
                <div class="item-meta">
                    <span class="meta-item">🏷️ Main Course</span>
                    <span class="meta-item">🌶️ Medium</span>
                    <span class="meta-item">💰 ₹30-50</span>
                </div>
                <p class="item-description">The world-famous tangy lentil curry that originated in Udupi. Made with vegetables, tamarind, and a special blend of spices.</p>
                <div class="highlights">
                    <div class="highlights-title">Best Places to Try:</div>
                    <ul class="highlights-list">
                        <li>Woodlands Restaurant</li>
                        <li>Mitra Samaj</li>
                        <li>Sri Krishna Bhavan</li>
                        <li>Hotel Udupi Residency</li>
                    </ul>
                </div>
            </div>

            <div class="item">
                <h3 class="item-title">Masala Dosa</h3>
                <div class="item-meta">
                    <span class="meta-item">🏷️ Breakfast</span>
                    <span class="meta-item">🌶️ Mild</span>
                    <span class="meta-item">💰 ₹40-80</span>
                </div>
                <p class="item-description">Crispy rice crepe filled with spiced potato curry, served with coconut chutney and sambar. An Udupi breakfast staple.</p>
                <div class="highlights">
                    <div class="highlights-title">Best Places to Try:</div>
                    <ul class="highlights-list">
                        <li>Woodlands Restaurant</li>
                        <li>Geetha Darshini</li>
                        <li>Hotel Janatha</li>
                        <li>Malpe Sea View Restaurant</li>
                    </ul>
                </div>
            </div>

            <div class="item">
                <h3 class="item-title">Goli Baje</h3>
                <div class="item-meta">
                    <span class="meta-item">🏷️ Snack</span>
                    <span class="meta-item">🌶️ Mild</span>
                    <span class="meta-item">💰 ₹20-30</span>
                </div>
                <p class="item-description">Deep-fried flour dumplings with a crispy exterior and soft interior, perfect with tea or coffee. A local favorite.</p>
                <div class="highlights">
                    <div class="highlights-title">Best Places to Try:</div>
                    <ul class="highlights-list">
                        <li>Local tea stalls</li>
                        <li>Thindlu stalls</li>
                        <li>Hotel Udupi Residency</li>
                        <li>Mitra Samaj</li>
                    </ul>
                </div>
            </div>

            <div class="item">
                <h3 class="item-title">Fish Curry Rice (Coastal Special)</h3>
                <div class="item-meta">
                    <span class="meta-item">🏷️ Main Course</span>
                    <span class="meta-item">🌶️ Medium-Hot</span>
                    <span class="meta-item">💰 ₹150-250</span>
                </div>
                <p class="item-description">Fresh coastal fish cooked in coconut-based curry with traditional spices, served with steamed rice. A regional specialty.</p>
                <div class="highlights">
                    <div class="highlights-title">Best Places to Try:</div>
                    <ul class="highlights-list">
                        <li>Malpe Sea View Restaurant</li>
                        <li>Paradise Isle Beach Resort</li>
                        <li>Local coastal restaurants</li>
                        <li>Fisherman's Wharf</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="page">
        <div class="footer">
            <div class="footer-logo">CoastalConnect</div>
            <p class="footer-text">
                Your trusted companion for exploring coastal Karnataka<br>
                Visit us at coastalconnect.in for bookings and updates<br>
                Generated on ${currentDate}
            </p>
        </div>
    </div>
</body>
</html>
    `;
  };

  const generatePDFContent = (): string => {
    let content = `UDUPI VISITOR GUIDE\n\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

    content += `FESTIVALS:\n`;
    guideData.festivals.forEach((festival) => {
      content += `- ${festival.name} (${festival.date})\n`;
      content += `  Location: ${festival.location}\n`;
      content += `  ${festival.description}\n\n`;
    });

    content += `\nBEST SEASONS TO VISIT:\n`;
    guideData.seasons.forEach((season) => {
      content += `- ${season.name} (${season.months})\n`;
      content += `  Weather: ${season.weather}\n`;
      content += `  Temperature: ${season.temperature_range}\n`;
      content += `  Ideal for: ${season.ideal_for.join(", ")}\n\n`;
    });

    content += `\nTOP ATTRACTIONS:\n`;
    guideData.attractions.forEach((attraction) => {
      content += `- ${attraction.name} (${attraction.type})\n`;
      content += `  Best time: ${attraction.best_time_to_visit}\n`;
      content += `  Duration: ${attraction.duration}\n`;
      content += `  Entry fee: ${attraction.entry_fee}\n`;
      content += `  ${attraction.description}\n\n`;
    });

    return content;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Udupi Guide...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Visit Udupi Guide
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-orange-100">
                Your complete guide to experiencing the cultural heart of
                coastal Karnataka
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={handleDownloadPDF}
                  className="bg-white text-orange-600 hover:bg-orange-50"
                  size="lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download PDF Guide
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-orange-600"
                  size="lg"
                  onClick={() => setActiveSection("attractions")}
                >
                  <Navigation className="h-5 w-5 mr-2" />
                  Explore Attractions
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="bg-white shadow-sm sticky top-0 z-20">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide">
              {[
                { id: "overview", label: "Overview", icon: Info },
                { id: "festivals", label: "Festivals", icon: Calendar },
                { id: "seasons", label: "Best Seasons", icon: Sun },
                { id: "attractions", label: "Attractions", icon: MapPin },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`flex items-center px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeSection === id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-600 hover:text-orange-600"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                      <Heart className="h-6 w-6 mr-3 text-red-500" />
                      Welcome to Udupi
                    </CardTitle>
                    <CardDescription>
                      Discover the spiritual and cultural hub of coastal
                      Karnataka
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      Udupi is a sacred city renowned for the famous Krishna
                      Temple, delicious vegetarian cuisine, and rich cultural
                      heritage. Home to the Dvaita philosophy and traditional
                      art forms, Udupi offers a perfect blend of spirituality,
                      culture, and coastal beauty.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                        <h3 className="font-semibold">Rich Festivals</h3>
                        <p className="text-sm text-gray-600">
                          Kambala, Paryaya, Krishna Janmashtami
                        </p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Leaf className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <h3 className="font-semibold">
                          Year-round Destination
                        </h3>
                        <p className="text-sm text-gray-600">
                          Pleasant climate throughout the year
                        </p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <h3 className="font-semibold">Cultural Heritage</h3>
                        <p className="text-sm text-gray-600">
                          Ancient temples and traditions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Festivals Section */}
            {activeSection === "festivals" && (
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Festivals & Cultural Events
                  </h2>
                  <p className="text-xl text-gray-600">
                    Experience the vibrant cultural celebrations of Udupi
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guideData.festivals.map((festival) => (
                    <Card
                      key={festival.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                          {festival.name}
                        </CardTitle>
                        <CardDescription>
                          {festival.date} • {festival.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">
                          {festival.description}
                        </p>
                        <div className="space-y-2">
                          <Badge variant="secondary">{festival.type}</Badge>
                          <p className="text-sm text-gray-600">
                            <strong>Significance:</strong>{" "}
                            {festival.significance}
                          </p>
                          {festival.best_viewing_spots.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Best viewing spots:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {festival.best_viewing_spots.map(
                                  (spot, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {spot}
                                    </Badge>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Seasons Section */}
            {activeSection === "seasons" && (
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Best Time to Visit
                  </h2>
                  <p className="text-xl text-gray-600">
                    Plan your visit according to weather and activities
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {guideData.seasons.map((season) => (
                    <Card
                      key={season.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center text-xl">
                          {season.name === "Winter" && (
                            <Snowflake className="h-6 w-6 mr-3 text-blue-500" />
                          )}
                          {season.name === "Summer" && (
                            <Sun className="h-6 w-6 mr-3 text-yellow-500" />
                          )}
                          {season.name === "Monsoon" && (
                            <CloudRain className="h-6 w-6 mr-3 text-gray-500" />
                          )}
                          {season.name === "Post-Monsoon" && (
                            <Leaf className="h-6 w-6 mr-3 text-green-500" />
                          )}
                          {season.name}
                        </CardTitle>
                        <CardDescription>{season.months}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="font-medium text-gray-800">
                            {season.weather}
                          </p>
                          <p className="text-sm text-gray-600">
                            Temperature: {season.temperature_range}
                          </p>
                          <p className="text-sm text-gray-600">
                            Rainfall: {season.rainfall}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-green-700 mb-2">
                            Ideal for:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {season.ideal_for.map((activity, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-green-100 text-green-800"
                              >
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-green-700 mb-2">
                              Pros:
                            </h4>
                            <ul className="text-sm space-y-1">
                              {season.pros.map((pro, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-green-500 mr-1">•</span>
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-red-700 mb-2">
                              Cons:
                            </h4>
                            <ul className="text-sm space-y-1">
                              {season.cons.map((con, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-red-500 mr-1">•</span>
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Attractions Section */}
            {activeSection === "attractions" && (
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Top Attractions
                  </h2>
                  <p className="text-xl text-gray-600">
                    Must-visit places and experiences in Udupi
                  </p>
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                  {guideData.attractions.map((attraction) => (
                    <Card
                      key={attraction.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center">
                              <Camera className="h-5 w-5 mr-2 text-orange-500" />
                              {attraction.name}
                            </CardTitle>
                            <CardDescription>
                              {attraction.type} • {attraction.location}
                            </CardDescription>
                          </div>
                          <div className="flex items-center bg-orange-50 px-2 py-1 rounded-lg">
                            <Star className="h-4 w-4 text-orange-500 mr-1" />
                            <span className="text-sm font-medium text-orange-700">
                              {attraction.rating}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-700">
                          {attraction.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-800">
                              Best time to visit:
                            </p>
                            <p className="text-gray-600">
                              {attraction.best_time_to_visit}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              Duration:
                            </p>
                            <p className="text-gray-600">
                              {attraction.duration}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              Entry fee:
                            </p>
                            <p className="text-gray-600">
                              {attraction.entry_fee}
                            </p>
                          </div>
                        </div>

                        {attraction.highlights.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-800 mb-2">
                              Highlights:
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {attraction.highlights.map((highlight, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {highlight}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {attraction.nearby_attractions.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-800 mb-2">
                              Nearby attractions:
                            </h4>
                            <p className="text-sm text-gray-600">
                              {attraction.nearby_attractions.join(", ")}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Download CTA */}
        <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Take Udupi With You</h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Download our complete guide and explore Udupi at your own pace.
              Perfect for offline reading and trip planning.
            </p>
            <Button
              onClick={handleDownloadPDF}
              size="lg"
              className="bg-white text-orange-600 hover:bg-orange-50"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Complete Guide (PDF)
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}

// Default data functions (fallback when Supabase data is not available)
function getDefaultFestivals(): Festival[] {
  return [
    {
      id: "kambala",
      name: "Kambala (Buffalo Racing)",
      description:
        "Traditional buffalo racing in muddy fields, a unique sport of coastal Karnataka",
      date: "November - March",
      location: "Various paddy fields around Udupi",
      type: "Traditional Sport",
      significance:
        "Ancient agrarian festival celebrating harvest and buffalo worship",
      best_viewing_spots: ["Brahmavar", "Kundapura", "Hiriyadka"],
    },
    {
      id: "krishna-janmashtami",
      name: "Krishna Janmashtami",
      description:
        "Grand celebration of Lord Krishna's birth at the famous Udupi Krishna Temple",
      date: "August/September (as per lunar calendar)",
      location: "Sri Krishna Temple, Car Street",
      type: "Religious Festival",
      significance:
        "Most important festival celebrating the birth of Lord Krishna",
      best_viewing_spots: ["Krishna Temple", "Car Street", "Temple courtyard"],
    },
    {
      id: "paryaya",
      name: "Paryaya Festival",
      description:
        "Biennial transfer of temple administration between Ashta Mathas",
      date: "Every 2 years in January",
      location: "Sri Krishna Temple",
      type: "Religious Ceremony",
      significance:
        "Unique tradition of rotating temple administration among eight monasteries",
      best_viewing_spots: ["Temple premises", "Car Street procession route"],
    },
    {
      id: "rathotsava",
      name: "Rathotsava (Chariot Festival)",
      description:
        "Annual chariot procession of Lord Krishna through the streets of Udupi",
      date: "January/February",
      location: "Starting from Krishna Temple",
      type: "Religious Procession",
      significance:
        "Devotees pull the sacred chariot containing Lord Krishna's idol",
      best_viewing_spots: ["Car Street", "Rajangana", "Temple courtyard"],
    },
  ];
}

function getDefaultSeasons(): Season[] {
  return [
    {
      id: "winter",
      name: "Winter",
      months: "December - February",
      weather: "Cool and pleasant with gentle sea breeze",
      temperature_range: "20°C - 30°C",
      ideal_for: [
        "Temple visits",
        "Beach activities",
        "Sightseeing",
        "Photography",
      ],
      pros: [
        "Perfect weather",
        "Clear skies",
        "Comfortable for walking",
        "Festival season",
      ],
      cons: ["Higher tourist crowds", "Increased accommodation rates"],
      rainfall: "Minimal",
    },
    {
      id: "summer",
      name: "Summer",
      months: "March - May",
      weather: "Warm and humid with occasional sea breeze",
      temperature_range: "25°C - 35°C",
      ideal_for: [
        "Early morning temple visits",
        "Indoor activities",
        "Beach visits in evening",
      ],
      pros: [
        "Lower tourist crowds",
        "Better accommodation rates",
        "Clear visibility",
      ],
      cons: ["Hot and humid", "Uncomfortable midday heat"],
      rainfall: "Occasional pre-monsoon showers",
    },
    {
      id: "monsoon",
      name: "Monsoon",
      months: "June - September",
      weather: "Heavy rainfall with cool temperatures",
      temperature_range: "22°C - 28°C",
      ideal_for: [
        "Experiencing lush greenery",
        "Photography",
        "Peaceful temple visits",
      ],
      pros: [
        "Lush green landscape",
        "Cool temperatures",
        "Fewer crowds",
        "Spiritual atmosphere",
      ],
      cons: [
        "Heavy rainfall",
        "Limited outdoor activities",
        "Travel disruptions",
      ],
      rainfall: "Heavy (1500-3000mm annually)",
    },
    {
      id: "post-monsoon",
      name: "Post-Monsoon",
      months: "October - November",
      weather: "Pleasant with clear skies and fresh air",
      temperature_range: "23°C - 32°C",
      ideal_for: [
        "All outdoor activities",
        "Beach visits",
        "Temple tours",
        "Cultural events",
      ],
      pros: [
        "Perfect weather",
        "Clean air",
        "Beautiful landscapes",
        "Festival preparations",
      ],
      cons: ["Slightly higher humidity", "Occasional afternoon showers"],
      rainfall: "Light occasional showers",
    },
  ];
}

function getDefaultAttractions(): Attraction[] {
  return [
    {
      id: "krishna-temple",
      name: "Sri Krishna Temple",
      type: "Religious Site",
      description:
        "Famous 13th-century temple dedicated to Lord Krishna, known for its unique worship rituals and delicious prasadam",
      location: "Car Street, Udupi",
      best_time_to_visit: "Early morning (5 AM) or evening (7 PM) for aarti",
      duration: "2-3 hours",
      entry_fee: "Free",
      highlights: [
        "Kanakana Kindi (Golden Window)",
        "Dvaita Philosophy Center",
        "Traditional Prasadam",
      ],
      nearby_attractions: ["Anantheshwara Temple", "Chandramouleshwara Temple"],
      rating: 4.8,
    },
    {
      id: "malpe-beach",
      name: "Malpe Beach",
      type: "Beach",
      description:
        "Pristine beach with golden sand, water sports, and stunning sunsets. Gateway to St. Mary's Island",
      location: "Malpe, 6 km from Udupi",
      best_time_to_visit: "Evening (4 PM - 7 PM) for sunset",
      duration: "3-4 hours",
      entry_fee: "Free",
      highlights: [
        "Water sports",
        "Sunset views",
        "Fresh seafood",
        "Boat rides",
      ],
      nearby_attractions: ["St. Mary's Island", "Malpe Port", "Delta Beach"],
      rating: 4.6,
    },
    {
      id: "st-marys-island",
      name: "St. Mary's Island",
      type: "Natural Wonder",
      description:
        "Unique hexagonal basaltic rock formations created by volcanic activity, accessible by boat from Malpe",
      location: "6 km from Malpe Beach by boat",
      best_time_to_visit: "Morning (9 AM - 12 PM) for photography",
      duration: "4-5 hours (including boat travel)",
      entry_fee: "Boat charges apply (₹300-500 per person)",
      highlights: [
        "Hexagonal rock columns",
        "Unique geology",
        "Crystal clear water",
        "Photography",
      ],
      nearby_attractions: ["Malpe Beach", "Coconut Island"],
      rating: 4.7,
    },
    {
      id: "manipal-end-point",
      name: "End Point, Manipal",
      type: "Viewpoint",
      description:
        "Scenic hilltop viewpoint offering panoramic views of the Western Ghats and Swarna River",
      location: "Manipal, 5 km from Udupi",
      best_time_to_visit: "Sunset (5 PM - 7 PM)",
      duration: "1-2 hours",
      entry_fee: "Free",
      highlights: [
        "Panoramic views",
        "Sunset point",
        "Hanging bridge",
        "Photography",
      ],
      nearby_attractions: ["Manipal Lake", "Hasta Shilpa Heritage Village"],
      rating: 4.4,
    },
    {
      id: "kaup-beach",
      name: "Kaup Beach & Lighthouse",
      type: "Beach & Lighthouse",
      description:
        "Beautiful beach with a historic lighthouse offering spectacular coastal views",
      location: "Kaup, 15 km from Udupi",
      best_time_to_visit: "Evening for beach, morning for lighthouse",
      duration: "2-3 hours",
      entry_fee: "Lighthouse: ₹20 per person",
      highlights: [
        "Historic lighthouse",
        "Panoramic sea views",
        "Rocky coastline",
        "Photography",
      ],
      nearby_attractions: ["Kaup Beach", "Goddess Mariamma Temple"],
      rating: 4.5,
    },
    {
      id: "pajaka-kshetra",
      name: "Pajaka Kshetra",
      type: "Religious Site",
      description:
        "Birthplace of Sri Madhvacharya, founder of Dvaita philosophy, with ancient temples and peaceful surroundings",
      location: "Pajaka, 14 km from Udupi",
      best_time_to_visit: "Morning (8 AM - 11 AM)",
      duration: "2 hours",
      entry_fee: "Free",
      highlights: [
        "Birthplace of Madhvacharya",
        "Ancient temples",
        "Spiritual significance",
        "Peaceful environment",
      ],
      nearby_attractions: ["Kunjarugiri", "Sringeri Mutt"],
      rating: 4.3,
    },
  ];
}
