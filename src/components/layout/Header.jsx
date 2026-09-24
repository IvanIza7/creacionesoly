import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import { useStore } from '../../store/useStore';

const ScrollNavLink = ({ to, children, className = '' }) => {
  return (
    <Link 
      to={to} 
      className={`relative overflow-hidden group block ${className}`}
    >
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full text-primary text-xs tracking-[0.2em] font-medium" style={{ lineHeight: 1 }}>
        {children}
      </span>
      <span className="block absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-[110%] group-hover:translate-y-0 text-accent text-xs tracking-[0.2em] font-medium" style={{ lineHeight: 1 }}>
        {children}
      </span>
    </Link>
  );
};

const MegaDropdown = React.memo(({ title, isOpen, onMouseEnter, onMouseLeave, collections }) => {
  return (
    <div 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute top-full left-0 w-full bg-primary text-white z-50 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[600px] py-12 border-t border-white/10' : 'max-h-0 py-0 border-t-0'}`}
    >
      <div className="max-w-7xl mx-auto px-8">
        <h3 className="text-accent text-sm tracking-widest mb-8 uppercase">{title} COLLECTION</h3>
        <div className="grid grid-cols-4 gap-x-12 gap-y-10">
          {['RINGS', 'BRACELETS', 'CHAINS', 'PENDANTS', 'WATCHES', 'SILVER', 'MOISSANITE', 'ACCESSORIES'].map((cat) => (
            <div key={cat}>
              <h4 className="text-white/60 text-xs tracking-widest mb-4 border-b border-white/10 pb-2">{cat}</h4>
              <ul className="space-y-3">
                {collections.filter(c => c.name.toUpperCase().includes(cat.toUpperCase()) || cat === 'ACCESSORIES').slice(0, 3).map(c => (
                  <li key={c.id}>
                    <Link to={`/category/${c.id}`} className="text-white hover:text-accent transition-colors text-sm">
                      {c.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to={`/`} className="text-white hover:text-accent transition-colors text-sm">View all</Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

const Header = () => {
  const navigate = useNavigate();
  const collections = useStore(state => state.catalogs.collections);
  const brandConfig = useStore(state => state.siteConfig.brand);
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const user = useStore(state => state.user);
  const [activeDropdown, setActiveDropdown] = useState(null);
  let timeoutId = null;

  const handleMouseEnter = (dropdown) => {
    if (timeoutId) clearTimeout(timeoutId);
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setActiveDropdown(null);
    }, 120);
  };

  return (
    <header className="sticky top-0 w-full bg-background z-40 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="shrink-0 flex items-center space-x-3">
          {(brandConfig.displayMode === 'LOGO' || brandConfig.displayMode === 'BOTH') && brandConfig.logoUrl && (
            <img src={brandConfig.logoUrl} alt="Logo" width="160" height="40" className="h-10 w-auto object-contain" />
          )}
          {(brandConfig.displayMode === 'TEXT' || brandConfig.displayMode === 'BOTH') && (
            <span className="text-3xl font-display tracking-widest uppercase text-primary">
              {brandConfig.name}
            </span>
          )}
        </Link>
        
        {/* Main Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          <div 
            className="flex items-center h-20"
            onMouseEnter={() => handleMouseEnter('MEN')}
            onMouseLeave={handleMouseLeave}
          >
            <span className={`text-xs tracking-[0.2em] font-medium cursor-pointer transition-colors ${activeDropdown === 'MEN' ? 'text-accent' : 'text-primary hover:text-accent'}`}>
              MEN
            </span>
          </div>
          <div 
            className="flex items-center h-20"
            onMouseEnter={() => handleMouseEnter('WOMEN')}
            onMouseLeave={handleMouseLeave}
          >
            <span className={`text-xs tracking-[0.2em] font-medium cursor-pointer transition-colors ${activeDropdown === 'WOMEN' ? 'text-accent' : 'text-primary hover:text-accent'}`}>
              WOMEN
            </span>
          </div>
          
          <div className="w-px h-4 bg-primary/20 mx-2"></div>
          
          <ScrollNavLink to="/category/c1">RINGS</ScrollNavLink>
          <ScrollNavLink to="/category/c4">WATCHES</ScrollNavLink>
          <ScrollNavLink to="/category/c3">BRACELETS</ScrollNavLink>
          <ScrollNavLink to="/category/c5">EARRINGS</ScrollNavLink>
        </nav>
        
        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button aria-label="Search" className="text-primary hover:text-accent transition-colors">
            <Search size={20} />
          </button>
          
          {/* Admin Panel Return Button - only visible for admin users */}
          {isAuthenticated && user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="hidden md:flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase bg-primary text-white px-4 py-2 hover:bg-accent transition-colors"
            >
              <span>&#9964;</span>
              <span>Admin Panel</span>
            </button>
          )}

          {/* Login/Profile for non-admin users */}
          {(!isAuthenticated || (isAuthenticated && user?.role !== 'admin')) && (
            isAuthenticated ? (
              <Link to="/profile" className="hidden md:flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase text-primary/60 hover:text-primary transition-colors">
                <User size={14} />
                <span>Profile</span>
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => navigate('/login')}
                  className="text-xs font-medium tracking-widest px-3 py-2 text-primary hover:text-accent transition-colors uppercase"
                >
                  Log In
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="text-xs font-medium tracking-widest border border-primary/20 px-4 py-2 hover:bg-primary hover:text-white transition-colors uppercase"
                >
                  Sign Up
                </button>
              </div>
            )
          )}
        </div>
      </div>
      
      {/* Dropdowns */}
      <MegaDropdown 
        title="MEN'S" 
        isOpen={activeDropdown === 'MEN'} 
        onMouseEnter={() => handleMouseEnter('MEN')}
        onMouseLeave={handleMouseLeave}
        collections={collections}
      />
      <MegaDropdown 
        title="WOMEN'S" 
        isOpen={activeDropdown === 'WOMEN'} 
        onMouseEnter={() => handleMouseEnter('WOMEN')}
        onMouseLeave={handleMouseLeave}
        collections={collections}
      />
    </header>
  );
};

export default Header;
