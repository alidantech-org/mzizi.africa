'use client';

import { useEffect } from 'react';

export default function SidebarWidthManager() {
  useEffect(() => {
    const handleSidebarWidthChange = () => {
      const sidebar = document.querySelector('[data-sidebar]');
      const mainContent = document.getElementById('main-content');
      
      if (sidebar && mainContent) {
        const sidebarWidth = sidebar.classList.contains('minimized') ? '4rem' : '16rem';
        mainContent.style.paddingLeft = sidebarWidth;
      }
    };

    // Observe sidebar width changes
    const observer = new MutationObserver(handleSidebarWidthChange);
    
    // Start observing the sidebar
    const sidebar = document.querySelector('[data-sidebar]');
    if (sidebar) {
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    // Initial setup
    handleSidebarWidthChange();

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
