// CoastalConnect x Swiggy-Inspired Design System
// Complete UI/UX framework matching Swiggy's modern marketplace aesthetic

// 🎨 SWIGGY-INSPIRED COLOR PALETTE
export const swiggyColors = {
  // Primary Orange (Swiggy's signature)
  primary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',    // Main Swiggy orange
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },

  // Secondary Dark (Rich blacks and grays)
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',     // Dark UI elements
    900: '#0f172a',     // Rich black
  },

  // Accent Green (Success, ratings, offers)
  accent: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',     // Success green
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Pure whites and backgrounds
  white: '#ffffff',
  black: '#000000',
  
  // Background variants
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    muted: '#f1f5f9',
    dark: '#0f172a',
  },

  // Text colors
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    muted: '#64748b',
    light: '#94a3b8',
    inverse: '#ffffff',
  },

  // Status colors (Swiggy style)
  status: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Rating colors
  rating: {
    excellent: '#22c55e',  // 4.0+
    good: '#84cc16',       // 3.5-3.9
    average: '#f59e0b',    // 3.0-3.4
    poor: '#ef4444',       // <3.0
  },
};

// 🔤 SWIGGY TYPOGRAPHY SYSTEM
export const swiggyTypography = {
  fontFamilies: {
    primary: ['ProximaNova', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    secondary: ['Okra', 'system-ui', 'sans-serif'],
    mono: ['SF Mono', 'Monaco', 'monospace'],
  },

  fontSizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px - body text
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px - card titles
    '3xl': '1.875rem',  // 30px - section headings
    '4xl': '2.25rem',   // 36px - page titles
    '5xl': '3rem',      // 48px - hero titles
    '6xl': '3.75rem',   // 60px
  },

  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,      // Swiggy's preferred weight
    bold: 700,
    extrabold: 800,
  },

  lineHeights: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
};

// 📱 SWIGGY COMPONENT SYSTEM
export const swiggyComponents = {
  // Button variants (Swiggy style)
  button: {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-sm',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium',
    ghost: 'text-gray-700 hover:bg-gray-100 font-medium',
    destructive: 'bg-red-500 hover:bg-red-600 text-white font-semibold',
    
    sizes: {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    },

    rounded: {
      none: 'rounded-none',
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
  },

  // Card variants (Swiggy marketplace style)
  card: {
    base: 'bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow',
    restaurant: 'bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden',
    vendor: 'bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4',
    offer: 'bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 p-4',
    category: 'bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer',
  },

  // Input styles (Swiggy forms)
  input: {
    base: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500',
    search: 'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white',
    location: 'w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white',
  },

  // Badge styles (ratings, status, offers)
  badge: {
    default: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    rating: 'inline-flex items-center px-2 py-1 rounded text-xs font-semibold text-white',
    offer: 'inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-800',
    status: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
  },
};

// 🎭 SWIGGY ANIMATIONS & INTERACTIONS
export const swiggyAnimations = {
  // Transitions (smooth like Swiggy)
  transition: {
    fast: 'transition-all duration-150 ease-out',
    normal: 'transition-all duration-200 ease-out',
    slow: 'transition-all duration-300 ease-out',
  },

  // Hover effects
  hover: {
    lift: 'hover:-translate-y-1 hover:shadow-lg',
    scale: 'hover:scale-105',
    subtle: 'hover:scale-[1.02]',
    glow: 'hover:shadow-xl hover:shadow-orange-500/20',
  },

  // Loading states
  loading: {
    skeleton: 'animate-pulse bg-gray-200 rounded',
    spinner: 'animate-spin rounded-full border-2 border-orange-500 border-t-transparent',
    shimmer: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]',
  },
};

// 📐 SWIGGY LAYOUT SYSTEM
export const swiggyLayouts = {
  // Container sizes (like Swiggy's responsive design)
  container: {
    sm: 'max-w-2xl mx-auto px-4',
    md: 'max-w-4xl mx-auto px-4',
    lg: 'max-w-6xl mx-auto px-4',
    xl: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    full: 'w-full px-4 sm:px-6 lg:px-8',
  },

  // Grid systems (Swiggy's card layouts)
  grid: {
    restaurants: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
    categories: 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4',
    offers: 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide',
    vendors: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  },

  // Section spacing
  section: {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20',
  },

  // Header heights
  header: {
    mobile: 'h-16',
    desktop: 'h-20',
  },
};

// 🎯 SWIGGY DESIGN PATTERNS
export const swiggyPatterns = {
  // Hero sections
  hero: {
    main: 'bg-white py-12 lg:py-16',
    search: 'bg-gradient-to-b from-orange-50 to-white py-8 lg:py-12',
  },

  // Navigation patterns
  nav: {
    sticky: 'sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100',
    transparent: 'absolute top-0 left-0 right-0 z-50 bg-transparent',
    mobile: 'fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg',
  },

  // Card patterns (Swiggy marketplace)
  card: {
    restaurant: `
      group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 
      overflow-hidden border border-gray-100 cursor-pointer
    `,
    vendor: `
      bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md 
      transition-shadow p-4 cursor-pointer
    `,
    category: `
      bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow 
      cursor-pointer p-4 text-center
    `,
    offer: `
      bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border 
      border-orange-200 p-4 cursor-pointer hover:shadow-md transition-shadow
    `,
  },

  // Rating patterns
  rating: {
    excellent: 'bg-green-500 text-white',
    good: 'bg-green-400 text-white',
    average: 'bg-yellow-500 text-white',
    poor: 'bg-red-500 text-white',
  },
};

// 🛠️ SWIGGY UTILITY FUNCTIONS
export const swiggyUtils = {
  // Combine classes utility
  cn: (...classes: (string | undefined | null | false)[]) => {
    return classes.filter(Boolean).join(' ');
  },

  // Get rating color based on score
  getRatingColor: (rating: number) => {
    if (rating >= 4.0) return swiggyPatterns.rating.excellent;
    if (rating >= 3.5) return swiggyPatterns.rating.good;
    if (rating >= 3.0) return swiggyPatterns.rating.average;
    return swiggyPatterns.rating.poor;
  },

  // Format delivery time
  formatDeliveryTime: (minutes: number) => {
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  },

  // Format price (Indian currency)
  formatPrice: (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  },

  // Format distance
  formatDistance: (km: number) => {
    if (km < 1) return `${Math.round(km * 1000)}m`;
    return `${km.toFixed(1)}km`;
  },

  // Generate offer text
  generateOfferText: (type: 'percentage' | 'amount' | 'buy1get1', value?: number) => {
    switch (type) {
      case 'percentage':
        return `${value}% OFF`;
      case 'amount':
        return `₹${value} OFF`;
      case 'buy1get1':
        return 'BUY 1 GET 1';
      default:
        return 'SPECIAL OFFER';
    }
  },
};

// 📱 RESPONSIVE BREAKPOINTS (Swiggy style)
export const swiggyBreakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// 🎨 SWIGGY THEME CONFIGURATION
export const swiggyTheme = {
  colors: swiggyColors,
  typography: swiggyTypography,
  components: swiggyComponents,
  animations: swiggyAnimations,
  layouts: swiggyLayouts,
  patterns: swiggyPatterns,
  utils: swiggyUtils,
  breakpoints: swiggyBreakpoints,
};

// Export everything for easy access
export default swiggyTheme;

// Legacy compatibility exports
export const colors = swiggyColors;
export const typography = swiggyTypography;
export const components = swiggyComponents;
export const animations = swiggyAnimations;
export const layouts = swiggyLayouts;
export const patterns = swiggyPatterns;
export const utils = swiggyUtils;
export const breakpoints = swiggyBreakpoints;
