/**
 * Accessibility Utilities for CoastalConnect
 * Provides WCAG 2.1 AA compliance utilities and helpers
 */

import { useEffect, useRef, useState } from 'react';

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

  return { announce, announcement };
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
// CONTRAST AND COLOR UTILITIES
// ==============================================

/**
 * Calculate color contrast ratio
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Calculate relative luminance
    const getRgbLuminance = (c: number) => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    return 0.2126 * getRgbLuminance(r) + 0.7152 * getRgbLuminance(g) + 0.0722 * getRgbLuminance(b);
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (lightest + 0.05) / (darkest + 0.05);
};

/**
 * Check if color combination meets WCAG contrast requirements
 */
export const meetsContrastRequirement = (
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean => {
  const ratio = getContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  } else {
    return size === 'large' ? ratio >= 3 : ratio >= 4.5;
  }
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

// ==============================================
// FORM ACCESSIBILITY UTILITIES
// ==============================================

/**
 * Generate accessible form field IDs and ARIA attributes
 */
export const generateFormFieldProps = (
  id: string,
  options: {
    required?: boolean;
    error?: string;
    description?: string;
  } = {}
) => {
  const { required, error, description } = options;
  
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const ariaDescribedBy = [descriptionId, errorId].filter(Boolean).join(' ');

  return {
    fieldProps: {
      id,
      'aria-describedby': ariaDescribedBy || undefined,
      'aria-invalid': error ? 'true' : undefined,
      'aria-required': required ? 'true' : undefined
    },
    labelProps: {
      htmlFor: id
    },
    descriptionId,
    errorId
  };
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

// ==============================================
// SCREEN READER UTILITIES
// ==============================================

/**
 * Get screen reader friendly text for common UI patterns
 */
export const getScreenReaderText = {
  loading: 'Loading content, please wait',
  error: 'An error occurred',
  success: 'Action completed successfully',
  required: 'required field',
  optional: 'optional field',
  newWindow: 'opens in new window',
  download: 'download file',
  expand: 'expand section',
  collapse: 'collapse section',
  sortAscending: 'sort ascending',
  sortDescending: 'sort descending',
  currentPage: 'current page',
  goToPage: 'go to page',
  nextPage: 'next page',
  previousPage: 'previous page',
  closeDialog: 'close dialog',
  openMenu: 'open menu',
  closeMenu: 'close menu'
};

// ==============================================
// FOCUS MANAGEMENT UTILITIES
// ==============================================

/**
 * Focus management utilities for complex interactions
 */
export const focusManagement = {
  /**
   * Focus the first focusable element in a container
   */
  focusFirst: (container: HTMLElement): void => {
    const focusable = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    focusable?.focus();
  },

  /**
   * Focus the last focusable element in a container
   */
  focusLast: (container: HTMLElement): void => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    lastElement?.focus();
  },

  /**
   * Check if an element is focusable
   */
  isFocusable: (element: HTMLElement): boolean => {
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    return element.matches(focusableSelector);
  },

  /**
   * Get all focusable elements in a container
   */
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    return Array.from(container.querySelectorAll(focusableSelector)) as HTMLElement[];
  }
};

// ==============================================
// COMMON ACCESSIBILITY PATTERNS
// ==============================================

/**
 * Common accessibility patterns and utilities
 */
export const a11yPatterns = {
  /**
   * Get props for an accessible button that toggles a panel
   */
  getDisclosureButtonProps: (isExpanded: boolean, controlsId: string) => ({
    'aria-expanded': isExpanded,
    'aria-controls': controlsId,
    'aria-label': isExpanded ? 'Collapse section' : 'Expand section'
  }),

  /**
   * Get props for a modal dialog
   */
  getModalProps: (titleId: string, descriptionId?: string) => ({
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': titleId,
    'aria-describedby': descriptionId
  }),

  /**
   * Get props for a tab panel
   */
  getTabPanelProps: (tabId: string, panelId: string, isSelected: boolean) => ({
    role: 'tabpanel',
    id: panelId,
    'aria-labelledby': tabId,
    hidden: !isSelected,
    tabIndex: isSelected ? 0 : -1
  }),

  /**
   * Get props for a tab button
   */
  getTabProps: (tabId: string, panelId: string, isSelected: boolean) => ({
    role: 'tab',
    id: tabId,
    'aria-controls': panelId,
    'aria-selected': isSelected,
    tabIndex: isSelected ? 0 : -1
  }),

  /**
   * Get props for a table cell that can be sorted
   */
  getSortableColumnProps: (sortDirection?: 'asc' | 'desc') => ({
    'aria-sort': sortDirection === 'asc' ? 'ascending' : 
                 sortDirection === 'desc' ? 'descending' : 'none',
    role: 'columnheader'
  })
};

export default {
  generateId,
  useAriaLive,
  useFocusTrap,
  useKeyboardNavigation,
  getContrastRatio,
  meetsContrastRequirement,
  useReducedMotion,
  generateFormFieldProps,
  useA11yWarnings,
  getScreenReaderText,
  focusManagement,
  a11yPatterns
};
