'use client';

import { useEffect } from 'react';

export default function SidebarStateManager() {
  useEffect(() => {
    // Function to update sidebar width CSS variable
    const updateSidebarWidth = () => {
      const sidebar = document.querySelector('[data-sidebar]');
      const mainContent = document.getElementById('main-content');

      if (sidebar && mainContent) {
        const isMinimized = sidebar.classList.contains('lg:w-16');
        const isLargeScreen = window.innerWidth >= 1024; // lg: breakpoint

        // Only apply width changes on large screens
        if (isLargeScreen) {
          // Use appropriate width based on sidebar state
          const sidebarWidth = isMinimized ? '4rem' : '16rem';

          // Update CSS variable on the root element
          document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);

          // Update main content padding to match sidebar width
          mainContent.style.paddingLeft = sidebarWidth;
        } else {
          // On mobile, remove inline padding to use CSS classes
          mainContent.style.paddingLeft = '';
        }
      }
    };

    // Initial update
    updateSidebarWidth();

    // Set up a MutationObserver to watch for class changes on the sidebar
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateSidebarWidth();
        }
      });
    });

    // Start observing the sidebar
    const sidebar = document.querySelector('[data-sidebar]');
    if (sidebar) {
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    // Set up resize listener to handle responsive changes
    const handleResize = () => {
      updateSidebarWidth();
    };

    window.addEventListener('resize', handleResize);

    // Clean up observer and listener on unmount
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return null;
}
