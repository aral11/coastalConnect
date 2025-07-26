/**
 * coastalConnect Design System
 * Inspired by Swiggy's modern food delivery platform design
 * Features: Orange/red theme, clean typography, modern cards
 */

export const designSystem = {
  colors: {
    primary: {
      50: '#FFF3E0',
      100: '#FFE0B2', 
      200: '#FFCC80',
      300: '#FFB74D',
      400: '#FFA726',
      500: '#FF9800', // Main orange
      600: '#FB8C00',
      700: '#F57C00',
      800: '#EF6C00',
      900: '#E65100'
    },
    secondary: {
      50: '#FFEBEE',
      100: '#FFCDD2',
      200: '#EF9A9A',
      300: '#E57373',
      400: '#EF5350',
      500: '#F44336', // Red accent
      600: '#E53935',
      700: '#D32F2F',
      800: '#C62828',
      900: '#B71C1C'
    },
    swiggyOrange: {
      50: '#FFF4E6',
      100: '#FFE4CC',
      200: '#FFCC99',
      300: '#FFB366',
      400: '#FF9933',
      500: '#FF5722', // Swiggy's signature orange
      600: '#E64A19',
      700: '#D84315',
      800: '#BF360C',
      900: '#FF3D00'
    },
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121'
    },
    success: {
      50: '#E8F5E8',
      100: '#C8E6C8',
      200: '#A5D6A5',
      300: '#81C784',
      400: '#66BB6A',
      500: '#4CAF50',
      600: '#43A047',
      700: '#388E3C',
      800: '#2E7D32',
      900: '#1B5E20'
    },
    warning: {
      50: '#FFFDE7',
      100: '#FFF9C4',
      200: '#FFF59D',
      300: '#FFF176',
      400: '#FFEE58',
      500: '#FFEB3B',
      600: '#FDD835',
      700: '#FBC02D',
      800: '#F9A825',
      900: '#F57F17'
    },
    error: {
      50: '#FFEBEE',
      100: '#FFCDD2',
      200: '#EF9A9A',
      300: '#E57373',
      400: '#EF5350',
      500: '#F44336',
      600: '#E53935',
      700: '#D32F2F',
      800: '#C62828',
      900: '#B71C1C'
    }
  },
  
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      mono: ['Fira Code', 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', 'monospace']
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }]
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    }
  },

  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem'
  },

  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none'
  },

  components: {
    button: {
      primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]',
      secondary: 'bg-white hover:bg-gray-50 text-orange-600 font-semibold py-3 px-6 rounded-xl border-2 border-orange-600 hover:border-orange-700 transition-all duration-200',
      ghost: 'bg-transparent hover:bg-orange-50 text-orange-600 font-semibold py-3 px-6 rounded-xl transition-all duration-200',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200',
      success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200'
    },
    card: {
      default: 'bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden',
      elevated: 'bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:scale-[1.02]',
      flat: 'bg-white rounded-2xl border border-gray-200 hover:border-orange-200 transition-all duration-300 overflow-hidden',
      gradient: 'bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-xl text-white overflow-hidden'
    },
    input: {
      default: 'w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-gray-900 placeholder-gray-500',
      search: 'w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white shadow-sm'
    },
    badge: {
      primary: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800',
      secondary: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800',
      success: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800',
      warning: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800',
      error: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800'
    }
  }
};

export const layouts = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-16 lg:py-24',
  grid: {
    responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    cards: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
    features: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'
  }
};

export const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin'
};

export const statusColors = {
  success: designSystem.colors.success,
  warning: designSystem.colors.warning,
  error: designSystem.colors.error,
  info: designSystem.colors.primary
};

// Utility functions
export const getColorVariant = (variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error', shade: number = 500) => {
  return designSystem.colors[variant]?.[shade] || designSystem.colors.primary[500];
};

export const getSpacing = (size: keyof typeof designSystem.spacing) => {
  return designSystem.spacing[size];
};

export const getShadow = (size: keyof typeof designSystem.shadows) => {
  return designSystem.shadows[size];
};

// Swiggy-specific theme utilities
export const swiggyTheme = {
  primary: designSystem.colors.swiggyOrange[500],
  primaryHover: designSystem.colors.swiggyOrange[600],
  background: designSystem.colors.swiggyOrange[500],
  cardBackground: '#FFFFFF',
  textPrimary: designSystem.colors.neutral[900],
  textSecondary: designSystem.colors.neutral[600],
  textLight: designSystem.colors.neutral[500],
  border: designSystem.colors.neutral[200],
  borderHover: designSystem.colors.swiggyOrange[300]
};

export default designSystem;
