import React from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "CoastalConnect - Udupi & Manipal Visitor Guide",
  description = "Discover the best restaurants, stays, places to visit, experiences, transport, and festivals in Udupi & Manipal. Your complete guide to coastal Karnataka.",
  keywords = "Udupi, Manipal, Karnataka, travel guide, restaurants, hotels, homestays, places to visit, coastal Karnataka, tourism",
  ogImage = "https://coastalconnect.in/coastalconnect-og.jpg",
  ogUrl = "https://coastalconnect.in",
  canonical
}) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="CoastalConnect" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="CoastalConnect" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={ogUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Additional metadata */}
      <meta name="theme-color" content="#ea580c" />
      <meta name="msapplication-TileColor" content="#ea580c" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/coastalconnect-logo.svg" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          "name": "CoastalConnect",
          "description": description,
          "url": ogUrl,
          "logo": "https://coastalconnect.in/coastalconnect-logo.svg",
          "areaServed": [
            {
              "@type": "City",
              "name": "Udupi",
              "addressRegion": "Karnataka",
              "addressCountry": "IN"
            },
            {
              "@type": "City", 
              "name": "Manipal",
              "addressRegion": "Karnataka",
              "addressCountry": "IN"
            }
          ],
          "serviceType": [
            "Travel Guide",
            "Restaurant Directory",
            "Accommodation Listings",
            "Tourist Information"
          ]
        })}
      </script>
    </>
  );
};

export default SEO;
