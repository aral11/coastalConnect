// Utility functions for triggering real-time stats events

/**
 * Trigger a booking confirmation event to update stats in real-time
 */
export const triggerBookingEvent = (bookingData: { id: number; type: string; amount: number }) => {
  const event = new CustomEvent('booking-confirmed', {
    detail: bookingData
  });
  window.dispatchEvent(event);
  console.log('📈 Booking event triggered:', bookingData);
};

/**
 * Trigger a vendor approval event to update stats in real-time
 */
export const triggerVendorApprovalEvent = (vendorData: { id: number; type: string; name: string }) => {
  const event = new CustomEvent('vendor-approved', {
    detail: vendorData
  });
  window.dispatchEvent(event);
  console.log('✅ Vendor approval event triggered:', vendorData);
};

/**
 * Trigger a creator registration event to update stats in real-time
 */
export const triggerCreatorRegistrationEvent = (creatorData: { id: number; name: string; specialty: string }) => {
  const event = new CustomEvent('creator-registered', {
    detail: creatorData
  });
  window.dispatchEvent(event);
  console.log('👥 Creator registration event triggered:', creatorData);
};

/**
 * Trigger a rating update event to recalculate average rating
 */
export const triggerRatingUpdateEvent = (ratingData: { vendorId: number; vendorType: string; rating: number }) => {
  const event = new CustomEvent('rating-updated', {
    detail: ratingData
  });
  window.dispatchEvent(event);
  console.log('⭐ Rating update event triggered:', ratingData);
};

/**
 * Trigger when all platform data is cleared (admin function)
 */
export const triggerDataClearedEvent = () => {
  const event = new CustomEvent('data-cleared');
  window.dispatchEvent(event);
  console.log('🗑️ Data cleared event triggered - stats will reset to zero');
};

/**
 * Force refresh all platform statistics
 */
export const refreshPlatformStats = async () => {
  try {
    const response = await fetch('/api/stats/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      console.log('📊 Platform stats refreshed successfully');
      // Trigger a custom event to notify components
      window.dispatchEvent(new CustomEvent('stats-refreshed'));
    }
  } catch (error) {
    console.error('Failed to refresh platform stats:', error);
  }
};
