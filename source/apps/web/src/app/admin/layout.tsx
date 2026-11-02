'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import AdminAppBar from '@/components/admin/layout/AdminAppBar';
import SidebarStateManager from '@/components/admin/layout/SidebarStateManager';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Component */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="transition-all duration-300 lg:pl-64" id="main-content">
        {/* AppBar Component */}
        <AdminAppBar setSidebarOpen={setSidebarOpen} />

        {/* Page content */}
        <main className="pt-2 px-2 md:px-4 pb-8">{children}</main>
      </div>

      {/* Sidebar state manager */}
      <SidebarStateManager />
    </div>
  );
}
