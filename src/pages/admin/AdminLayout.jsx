import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Bell, LayoutDashboard, Settings, Search, Menu, X, Home, LogOut, BookOpen } from 'lucide-react';
import { useStore } from '../../store/useStore';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const brandConfig = useStore(state => state.siteConfig.brand);
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const isCheckingAuth = useStore(state => state.isCheckingAuth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = useStore(state => state.user);

  if (isCheckingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Verificando sesión...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
    { to: '/admin/catalogs', label: 'Catalogs', icon: <BookOpen size={18} /> },
    { to: '/admin/editor', label: 'Editor', icon: <Settings size={18} /> },
    { to: '/admin/subscribers', label: 'Newsletter', icon: <Search size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col text-gray-800 font-sans">
      
      {/* Top Navigation Bar */}
      <header className="bg-[#F8F9FA] px-4 lg:px-10 py-3 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative z-20 sticky top-0">
        
        {/* Left: Brand / Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            {(brandConfig.displayMode === 'LOGO' || brandConfig.displayMode === 'BOTH') && brandConfig.logoUrl && (
              <img src={brandConfig.logoUrl} alt="Logo" className="h-7 object-contain" />
            )}
            {(brandConfig.displayMode === 'TEXT' || brandConfig.displayMode === 'BOTH') && (
              <h1 className="font-display text-lg md:text-2xl tracking-widest text-black uppercase">
                {brandConfig.name}
              </h1>
            )}
          </div>
          {/* Admin badge */}
          <span className="ml-3 text-[9px] tracking-widest uppercase bg-black text-white px-2 py-0.5 font-medium">
            Admin
          </span>
        </div>

        {/* Center: Pill Switcher - desktop only */}
        <div className="hidden md:flex items-center bg-white rounded-full p-1 shadow-sm border border-black/5 absolute left-1/2 -translate-x-1/2">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({isActive}) => `px-6 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all ${isActive ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {/* Store link - desktop */}
          <button 
            onClick={() => navigate('/')}
            className="hidden md:flex items-center space-x-1 text-xs font-medium tracking-widest text-gray-500 hover:text-black transition-colors uppercase mr-2"
            title="Ir a la tienda"
          >
            <Home size={14} />
            <span>Store</span>
          </button>

          {/* Logout - desktop */}
          <button 
            onClick={async () => {
              await useStore.getState().logout();
              navigate('/login');
            }}
            className="hidden md:flex items-center space-x-1 text-xs font-medium tracking-widest text-gray-500 hover:text-red-500 transition-colors uppercase mr-2"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm border border-black/5 text-gray-600 hover:text-black transition-colors"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-black/5 shadow-lg z-10 flex flex-col">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({isActive}) =>
                `flex items-center space-x-3 px-5 py-4 text-sm font-medium border-b border-black/5 transition-colors ${isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-50'}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Divider */}
          <div className="my-1" />

          <button
            onClick={() => { setMobileMenuOpen(false); navigate('/'); }}
            className="flex items-center space-x-3 px-5 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50 border-b border-black/5"
          >
            <Home size={18} />
            <span>Go to Store</span>
          </button>

          <button
            onClick={async () => {
              setMobileMenuOpen(false);
              await useStore.getState().logout();
              navigate('/login');
            }}
            className="flex items-center space-x-3 px-5 py-4 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto flex flex-col p-4 md:p-6 lg:p-10">
        <Outlet />
      </main>
      
    </div>
  );
};

export default AdminLayout;
