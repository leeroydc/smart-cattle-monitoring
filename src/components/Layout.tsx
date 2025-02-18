
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Boxes, MapPin, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout, userRole = 'Rancher' } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
    { icon: ClipboardList, label: 'Cattle Details', path: '/cattle' },
    { icon: Boxes, label: 'Inventory', path: '/inventory' },
    { icon: MapPin, label: 'GPS Tracking', path: '/gps' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card shadow-lg transition-transform animate-slide-in">
        <div className="flex h-full flex-col px-3 py-4">
          {/* Top section with profile and settings */}
          <div className="mb-6 flex flex-col space-y-4 border-b pb-4">
            <div className="flex justify-between">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="text-sm font-medium text-muted-foreground text-center">
              {userRole} Account
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-end border-b bg-background px-6">
          <Button variant="ghost" onClick={handleLogout} className="gap-2">
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </header>

        {/* Page content */}
        <main className="px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
