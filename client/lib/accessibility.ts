/**
 * Accessibility Utilities for CoastalConnect
 * Provides WCAG 2.1 AA compliance utilities and helpers
 */

import React, { useEffect, useRef, useState } from 'react';

// ==============================================
// ARIA UTILITIES
// ==============================================

/**
 * Generate unique IDs for ARIA attributes
 */
export const generateId = (prefix = 'cc'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * ARIA live region hook for dynamic content announcements
 */
export const useAriaLive = () => {
  const [announcement, setAnnouncement] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setAnnouncement(''); // Clear first to ensure re-announcement
    
    timeoutRef.current = setTimeout(() => {
      setAnnouncement(message);
    }, 10);

    // Clear announcement after 1 second to allow re-announcements
    timeoutRef.current = setTimeout(() => {
      setAnnouncement('');
    }, 1000);
  };

  const LiveRegion: React.FC<{ priority?: 'polite' | 'assertive' }> = ({ priority = 'polite' }) => (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {announcement}
    </div>
  );

  return { announce, LiveRegion };
};

/**
 * Focus management hook for modals and dialogs
 */
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Store previous focus
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }

      if (e.key === 'Escape') {
        // Close modal and return focus
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore previous focus when trap is deactivated
      if (previousFocusRef.current && document.contains(previousFocusRef.current)) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive]);

  return containerRef;
};

/**
 * Keyboard navigation hook for custom components
 */
export const useKeyboardNavigation = (options: {
  onEnter?: () => void;
  onSpace?: () => void;
  onEscape?: () => void;
  onArrowDown?: () => void;
  onArrowUp?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        if (options.onEnter) {
          e.preventDefault();
          options.onEnter();
        }
        break;
      case ' ':
        if (options.onSpace) {
          e.preventDefault();
          options.onSpace();
        }
        break;
      case 'Escape':
        if (options.onEscape) {
          e.preventDefault();
          options.onEscape();
        }
        break;
      case 'ArrowDown':
        if (options.onArrowDown) {
          e.preventDefault();
          options.onArrowDown();
        }
        break;
      case 'ArrowUp':
        if (options.onArrowUp) {
          e.preventDefault();
          options.onArrowUp();
        }
        break;
      case 'ArrowLeft':
        if (options.onArrowLeft) {
          e.preventDefault();
          options.onArrowLeft();
        }
        break;
      case 'ArrowRight':
        if (options.onArrowRight) {
          e.preventDefault();
          options.onArrowRight();
        }
        break;
    }
  };

  return { handleKeyDown };
};

// ==============================================
// SCREEN READER UTILITIES
// ==============================================

/**
 * Screen reader only text component
 */
export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sr-only">{children}</span>
);

/**
 * Visually hidden but accessible to screen readers
 */
export const VisuallyHidden: React.FC<{ 
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}> = ({ children, as: Component = 'span' }) => {
  const Element = Component;
  return (
    <Element className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">
      {children}
    </Element>
  );
};

/**
 * Skip link component for keyboard navigation
 */
export const SkipLink: React.FC<{ href: string; children: React.ReactNode }> = ({ 
  href, 
  children 
}) => (
  <a
    href={href}
    className="absolute top-0 left-0 bg-orange-600 text-white px-4 py-2 z-50 transform -translate-y-full focus:translate-y-0 transition-transform"
  >
    {children}
  </a>
);

// ==============================================
// FORM ACCESSIBILITY UTILITIES
// ==============================================

/**
 * Enhanced form field with accessibility features
 */
interface AccessibleFormFieldProps {
  id: string;
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const AccessibleFormField: React.FC<AccessibleFormFieldProps> = ({
  id,
  label,
  error,
  description,
  required,
  children
}) => {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const ariaDescribedBy = [descriptionId, errorId].filter(Boolean).join(' ');

  return (
    <div className="space-y-1">
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-gray-500">
          {description}
        </p>
      )}
      
      <div>
        {React.cloneElement(children as React.ReactElement, {
          id,
          'aria-describedby': ariaDescribedBy || undefined,
          'aria-invalid': error ? 'true' : undefined,
          'aria-required': required ? 'true' : undefined
        })}
      </div>
      
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// ==============================================
// IMAGE ACCESSIBILITY
// ==============================================

/**
 * Accessible image component with automatic alt text validation
 */
interface AccessibleImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  decorative?: boolean;
  caption?: string;
}

export const AccessibleImage: React.FC<AccessibleImageProps> = ({
  src,
  alt,
  decorative = false,
  caption,
  className,
  ...props
}) => {
  // Warn in development if alt text is missing or inadequate
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!decorative && (!alt || alt.length < 3)) {
        console.warn(`Image ${src} has inadequate alt text: "${alt}"`);
      }
      if (decorative && alt) {
        console.warn(`Decorative image ${src} should have empty alt text`);
      }
    }
  }, [src, alt, decorative]);

  const imageElement = (
    <img
      src={src}
      alt={decorative ? '' : alt}
      className={className}
      {...props}
    />
  );

  if (caption) {
    const figureId = generateId('figure');
    const captionId = generateId('caption');
    
    return (
      <figure id={figureId} className="space-y-2">
        {React.cloneElement(imageElement, {
          'aria-labelledby': captionId
        })}
        <figcaption id={captionId} className="text-sm text-gray-600">
          {caption}
        </figcaption>
      </figure>
    );
  }

  return imageElement;
};

// ==============================================
// MOTION AND ANIMATION PREFERENCES
// ==============================================

/**
 * Respect user's motion preferences
 */
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

/**
 * Conditional animation wrapper
 */
export const RespectMotionPrefs: React.FC<{
  children: React.ReactNode;
  animated: string;
  static: string;
}> = ({ children, animated, static: staticClass }) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className={prefersReducedMotion ? staticClass : animated}>
      {children}
    </div>
  );
};

// ==============================================
// ACCESSIBLE BUTTON VARIANTS
// ==============================================

/**
 * Icon button with proper accessibility
 */
interface AccessibleIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  description?: string;
}

export const AccessibleIconButton: React.FC<AccessibleIconButtonProps> = ({
  icon,
  label,
  description,
  className,
  ...props
}) => {
  const descriptionId = description ? generateId('btn-desc') : undefined;

  return (
    <>
      <button
        className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${className}`}
        aria-label={label}
        aria-describedby={descriptionId}
        {...props}
      >
        {React.cloneElement(icon as React.ReactElement, { 'aria-hidden': true })}
      </button>
      {description && (
        <VisuallyHidden as="span">
          <span id={descriptionId}>{description}</span>
        </VisuallyHidden>
      )}
    </>
  );
};

// ==============================================
// ACCESSIBILITY TESTING UTILITIES
// ==============================================

/**
 * Development-only accessibility warnings
 */
export const useA11yWarnings = (element: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || !element.current) return;

    const el = element.current;
    
    // Check for missing alt attributes on images
    const images = el.querySelectorAll('img:not([alt])');
    if (images.length > 0) {
      console.warn('Images without alt attributes found:', images);
    }

    // Check for buttons without accessible names
    const buttons = el.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach(button => {
      if (!button.textContent?.trim()) {
        console.warn('Button without accessible name found:', button);
      }
    });

    // Check for form controls without labels
    const inputs = el.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    inputs.forEach(input => {
      const id = input.getAttribute('id');
      if (!id || !el.querySelector(`label[for="${id}"]`)) {
        console.warn('Form control without label found:', input);
      }
    });
  }, [element]);
};

export default {
  generateId,
  useAriaLive,
  useFocusTrap,
  useKeyboardNavigation,
  ScreenReaderOnly,
  VisuallyHidden,
  SkipLink,
  AccessibleFormField,
  AccessibleImage,
  useReducedMotion,
  RespectMotionPrefs,
  AccessibleIconButton,
  useA11yWarnings
};