import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with service role key for server-side operations
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface GuideCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  active: boolean;
}

interface GuideItem {
  id: string;
  category_id: string;
  title: string;
  description?: string;
  address?: string;
  city: "Udupi" | "Manipal";
  area?: string;
  phone?: string;
  website?: string;
  price_range?: string;
  cuisine_or_type?: string;
  tags?: string[];
  is_verified: boolean;
  is_featured: boolean;
  guide_categories?: {
    name: string;
    slug: string;
  };
}

const generateHTMLContent = (
  categories: GuideCategory[],
  items: GuideItem[],
): string => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const generateCategorySection = (category: GuideCategory): string => {
    const categoryItems = items.filter(
      (item) => item.category_id === category.id,
    );

    if (categoryItems.length === 0) return "";

    const itemsHTML = categoryItems
      .map((item) => {
        const tags = item.tags ? item.tags.join(", ") : "";
        const badges = [];
        if (item.is_featured) badges.push("⭐ Featured");
        if (item.is_verified) badges.push("✓ Verified");

        return `
        <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid #ff6600; border-radius: 0 8px 8px 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <h4 style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">${item.title}</h4>
            ${badges.length > 0 ? `<span style="font-size: 12px; color: #ff6600; font-weight: 500;">${badges.join(" • ")}</span>` : ""}
          </div>
          
          ${item.description ? `<p style="margin: 8px 0; color: #4a5568; font-size: 14px; line-height: 1.4;">${item.description}</p>` : ""}
          
          <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 10px; font-size: 13px; color: #666;">
            ${item.address ? `<span><strong>📍 Address:</strong> ${item.address}</span>` : ""}
            ${item.phone ? `<span><strong>📞 Phone:</strong> ${item.phone}</span>` : ""}
            ${item.price_range ? `<span><strong>💰 Price:</strong> ${item.price_range}</span>` : ""}
            ${item.cuisine_or_type ? `<span><strong>🏷️ Type:</strong> ${item.cuisine_or_type}</span>` : ""}
          </div>
          
          ${tags ? `<div style="margin-top: 8px; font-size: 12px; color: #666; font-style: italic;">Tags: ${tags}</div>` : ""}
          
          ${
            item.address
              ? `
            <div style="margin-top: 10px;">
              <a href="https://www.google.com/maps/search/${encodeURIComponent(item.title + " " + item.address)}" 
                 style="color: #1a73e8; text-decoration: none; font-size: 12px; font-weight: 500;">
                🗺️ View on Google Maps
              </a>
            </div>
          `
              : ""
          }
        </div>
      `;
      })
      .join("");

    return `
      <div style="page-break-before: auto; margin-bottom: 40px;">
        <h3 style="color: #ff6600; font-size: 24px; font-weight: 700; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 3px solid #ff6600;">
          ${category.name}
        </h3>
        ${itemsHTML}
      </div>
    `;
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CoastalConnect - Udupi & Manipal Visitor Guide</title>
      <style>
        @page {
          size: A4;
          margin: 20mm;
          @bottom-center {
            content: "CoastalConnect.in • Page " counter(page) " of " counter(pages);
            font-size: 10px;
            color: #666;
          }
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          background: white;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .logo {
          font-size: 32px;
          font-weight: 800;
          color: #ff6600;
          margin-bottom: 10px;
        }
        
        .subtitle {
          font-size: 18px;
          color: #4a5568;
          margin-bottom: 5px;
        }
        
        .date {
          font-size: 12px;
          color: #666;
        }
        
        .intro {
          background: linear-gradient(135deg, #ff6600 0%, #0ea5e9 100%);
          color: white;
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 30px;
          text-align: center;
        }
        
        .intro h2 {
          margin: 0 0 15px 0;
          font-size: 24px;
          font-weight: 700;
        }
        
        .intro p {
          margin: 0;
          font-size: 16px;
          opacity: 0.95;
        }
        
        .stats {
          display: flex;
          justify-content: space-around;
          background: #f7fafc;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          border: 1px solid #e2e8f0;
        }
        
        .stat {
          text-align: center;
        }
        
        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #ff6600;
          display: block;
        }
        
        .stat-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .contact-info {
          background: #1a202c;
          color: white;
          padding: 25px;
          border-radius: 12px;
          margin-top: 40px;
          text-align: center;
        }
        
        .contact-info h3 {
          margin-top: 0;
          color: #ff6600;
          font-size: 20px;
        }
        
        .contact-details {
          display: flex;
          justify-content: space-around;
          margin-top: 15px;
          font-size: 14px;
        }
        
        .qr-note {
          background: #fff5f0;
          border: 1px solid #fed7aa;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          font-size: 14px;
          text-align: center;
        }
        
        .disclaimer {
          font-size: 11px;
          color: #666;
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">CoastalConnect</div>
        <div class="subtitle">Udupi & Manipal Visitor Guide</div>
        <div class="date">Generated on ${currentDate}</div>
      </div>

      <div class="intro">
        <h2>Welcome to Coastal Karnataka!</h2>
        <p>
          Discover the best restaurants, stays, places to visit, experiences, transport, 
          and festivals in the beautiful coastal cities of Udupi and Manipal.
        </p>
      </div>

      <div class="stats">
        <div class="stat">
          <span class="stat-number">${items.length}</span>
          <span class="stat-label">Total Places</span>
        </div>
        <div class="stat">
          <span class="stat-number">${categories.length}</span>
          <span class="stat-label">Categories</span>
        </div>
        <div class="stat">
          <span class="stat-number">${items.filter((i) => i.is_verified).length}</span>
          <span class="stat-label">Verified</span>
        </div>
        <div class="stat">
          <span class="stat-number">${items.filter((i) => i.is_featured).length}</span>
          <span class="stat-label">Featured</span>
        </div>
      </div>

      <div class="qr-note">
        <strong>💡 Tip:</strong> Visit <strong>coastalconnect.in/guide</strong> for the interactive version 
        with real-time updates, search, and direct booking options!
      </div>

      ${categories.map(generateCategorySection).join("")}

      <div class="contact-info">
        <h3>Connect With Us</h3>
        <p>For the latest updates, bookings, and more interactive features:</p>
        <div class="contact-details">
          <div>🌐 coastalconnect.in</div>
          <div>📧 hello@coastalconnect.in</div>
          <div>📱 +91 820 252 0187</div>
        </div>
      </div>

      <div class="disclaimer">
        <p>
          This guide is updated regularly. Information such as prices, phone numbers, and availability 
          may change. Please verify details before visiting. Generated from CoastalConnect database on ${currentDate}.
        </p>
      </div>
    </body>
    </html>
  `;
};

const convertHTMLToPDF = async (html: string): Promise<Buffer> => {
  // For Netlify Functions, we'll use a simple HTML-to-PDF approach
  // In production, you might want to use puppeteer or a dedicated PDF service

  try {
    // Try to use puppeteer if available
    const puppeteer = await import("puppeteer");

    const browser = await puppeteer.default.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
    });

    await browser.close();
    return pdfBuffer;
  } catch (error) {
    console.error("Puppeteer not available, using fallback method:", error);

    // Fallback: Return HTML as PDF-like response (browser will handle PDF generation)
    const htmlWithPrintStyles = html.replace(
      "</head>",
      `
        <style>
          @media print {
            body { -webkit-print-color-adjust: exact; color-adjust: exact; }
          }
        </style>
      </head>`,
    );

    return Buffer.from(htmlWithPrintStyles, "utf-8");
  }
};

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  try {
    // Set CORS headers
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    };

    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
        body: "",
      };
    }

    if (event.httpMethod !== "GET") {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    console.log("Fetching guide data from Supabase...");

    // Fetch categories and items from Supabase
    const [categoriesResponse, itemsResponse] = await Promise.all([
      supabase
        .from("guide_categories")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true }),

      supabase
        .from("guide_items")
        .select(
          `
          *,
          guide_categories(name, slug)
        `,
        )
        .order("sort_order", { ascending: true }),
    ]);

    if (categoriesResponse.error) {
      console.error("Error fetching categories:", categoriesResponse.error);
      throw new Error("Failed to fetch guide categories");
    }

    if (itemsResponse.error) {
      console.error("Error fetching items:", itemsResponse.error);
      throw new Error("Failed to fetch guide items");
    }

    const categories = categoriesResponse.data || [];
    const items = itemsResponse.data || [];

    console.log(
      `Found ${categories.length} categories and ${items.length} items`,
    );

    // Generate HTML content
    const htmlContent = generateHTMLContent(categories, items);

    // Convert to PDF
    const pdfBuffer = await convertHTMLToPDF(htmlContent);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="CoastalConnect_Udupi_Manipal_Guide.pdf"',
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
      body: pdfBuffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error("Error generating PDF:", error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Failed to generate PDF",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
