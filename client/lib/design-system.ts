// CoastalConnect Design System - Complete UI/UX Guidelines

// 🎨 COLOR PALETTE
export const colors = {
  // Primary - Ocean & Beach inspired
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Main brand blue
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Secondary - Coastal sunset
  secondary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',  // Coastal orange
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },

  // Accent - Beach sand & sea foam
  accent: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',  // Teal accent
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },

  // Neutral - Beach stones & driftwood
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Status colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
};

// 📐 SPACING SYSTEM
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
};

// 🔤 TYPOGRAPHY SYSTEM
export const typography = {
  fontFamilies: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
    mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
  },
  
  fontSizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
    '8xl': '6rem',      // 96px
    '9xl': '8rem',      // 128px
  },
  
  fontWeights: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  
  lineHeights: {
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
};

// 🧩 COMPONENT TOKENS
export const components = {
  // Button variants
  button: {
    sizes: {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    },
    variants: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-orange-500 hover:bg-orange-600 text-white', 
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
      ghost: 'text-gray-700 hover:bg-gray-100',
      destructive: 'bg-red-600 hover:bg-red-700 text-white',
    },
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-md',
      md: 'rounded-lg',
      lg: 'rounded-xl',
      full: 'rounded-full',
    },
  },

  // Card variants
  card: {
    base: 'bg-white rounded-xl shadow-sm border border-gray-200',
    elevated: 'bg-white rounded-xl shadow-lg border-0',
    interactive: 'bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200',
    feature: 'bg-white rounded-2xl shadow-lg border-0 overflow-hidden',
  },

  // Input variants
  input: {
    base: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    large: 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    search: 'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  },

  // Badge variants
  badge: {
    default: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-800',
  },
};

// 📱 LAYOUT SYSTEM
export const layouts = {
  // Container widths
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  containerFluid: 'w-full px-4 sm:px-6 lg:px-8',
  containerNarrow: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
  containerWide: 'max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8',

  // Section spacing
  section: 'py-12 lg:py-16',
  sectionSmall: 'py-8 lg:py-12',
  sectionLarge: 'py-16 lg:py-24',

  // Grid systems
  grid: {
    cols1: 'grid grid-cols-1',
    cols2: 'grid grid-cols-1 md:grid-cols-2',
    cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    cols6: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    auto: 'grid grid-cols-auto',
  },

  // Gap sizes
  gap: {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  },
};

// 🎭 ANIMATION SYSTEM
export const animations = {
  // Transitions
  transition: {
    fast: 'transition-all duration-150 ease-in-out',
    normal: 'transition-all duration-200 ease-in-out',
    slow: 'transition-all duration-300 ease-in-out',
    slower: 'transition-all duration-500 ease-in-out',
  },

  // Transforms
  transform: {
    hover: 'hover:scale-105',
    press: 'active:scale-95',
    lift: 'hover:-translate-y-1',
    subtle: 'hover:scale-[1.02]',
  },

  // Shadows
  shadow: {
    soft: 'shadow-sm hover:shadow-md',
    medium: 'shadow-md hover:shadow-lg',
    large: 'shadow-lg hover:shadow-xl',
    xl: 'shadow-xl hover:shadow-2xl',
  },
};

// 🌐 RESPONSIVE BREAKPOINTS
export const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// 🎯 DESIGN PATTERNS
export const patterns = {
  // Hero sections
  hero: {
    default: 'relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white overflow-hidden',
    coastal: 'relative bg-gradient-to-br from-blue-600 via-teal-500 to-cyan-600 text-white overflow-hidden',
    sunset: 'relative bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 text-white overflow-hidden',
  },

  // Content sections
  section: {
    default: 'py-12 lg:py-16',
    feature: 'py-16 lg:py-24',
    compact: 'py-8 lg:py-12',
  },

  // Navigation patterns
  nav: {
    sticky: 'sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200',
    transparent: 'absolute top-0 left-0 right-0 z-50 bg-transparent',
    solid: 'bg-white border-b border-gray-200',
  },

  // Card patterns
  card: {
    product: 'group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden',
    service: 'bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200',
    feature: 'text-center bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 p-8',
  },

  // Button patterns
  cta: {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200',
    secondary: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl transition-all duration-200',
  },
};

// 🎨 THEME VARIANTS (like Swiggy/Zomato style)
export const themes = {
  coastal: {
    primary: colors.primary[600],
    secondary: colors.accent[500],
    background: colors.neutral[50],
    surface: colors.neutral[0],
    text: colors.neutral[900],
    textSecondary: colors.neutral[600],
  },
  
  sunset: {
    primary: colors.secondary[500],
    secondary: colors.primary[500],
    background: '#fef7f0',
    surface: colors.neutral[0],
    text: colors.neutral[900],
    textSecondary: colors.neutral[600],
  },
};

// 🚀 UTILITY FUNCTIONS
export const utils = {
  // Combine classes utility
  cn: (...classes: (string | undefined | null | false)[]) => {
    return classes.filter(Boolean).join(' ');
  },

  // Get responsive value
  responsive: (value: string | Record<string, string>) => {
    if (typeof value === 'string') return value;
    
    const breakpointKeys = Object.keys(breakpoints);
    return Object.entries(value)
      .map(([key, val]) => {
        if (key === 'default') return val;
        if (breakpointKeys.includes(key)) return `${key}:${val}`;
        return null;
      })
      .filter(Boolean)
      .join(' ');
  },

  // Generate gradient
  gradient: (from: string, to: string, direction = 'to-r') => {
    return `bg-gradient-${direction} from-${from} to-${to}`;
  },

  // Get status color
  statusColor: (status: 'success' | 'warning' | 'error' | 'info') => {
    const statusMap = {
      success: 'text-green-600 bg-green-50',
      warning: 'text-yellow-600 bg-yellow-50', 
      error: 'text-red-600 bg-red-50',
      info: 'text-blue-600 bg-blue-50',
    };
    return statusMap[status];
  },
};

// Legacy exports for backward compatibility
export const designSystem = {
  colors,
  spacing,
  typography,
  components,
};

export const statusColors = {
  success: utils.statusColor('success'),
  warning: utils.statusColor('warning'),
  error: utils.statusColor('error'),
  info: utils.statusColor('info'),
};

// Specific theme export (can be used for theming)
export const swiggyTheme = themes.sunset;
export const airbnbTheme = themes.coastal;

// Export everything as default for easy importing
export default {
  colors,
  spacing,
  typography,
  components,
  layouts,
  animations,
  breakpoints,
  patterns,
  themes,
  utils,
};
