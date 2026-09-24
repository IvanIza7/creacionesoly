import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Heart, Tag, Grid3X3, ShoppingBag, X, User, LayoutDashboard } from 'lucide-react';
import { useStore } from '../../store/useStore';
import ShoppingListDrawer from '../client/ShoppingListDrawer';

const FabNav = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const shoppingList = useStore(state => state.shoppingList);
  const favorites = useStore(state => state.favorites);
  const collections = useStore(state => state.catalogs.collections);
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const user = useStore(state => state.user);
  const isAdmin = isAuthenticated && user?.role === 'admin';
  
  // Metallic gold gradient used for borders and rings
  const goldGradient = "bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]";
  const iconColor = "text-[#E6C762]";

  return (
    <>
      {/* Backdrop for Collections Menu */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[35] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />
      
      <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[40] pointer-events-auto flex flex-col items-center">
      
      {/* Upward Popup Menu for Collections */}
      <div 
        className={`mb-4 overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 max-h-[400px] translate-y-0' : 'opacity-0 max-h-0 translate-y-4 pointer-events-none'}`}
      >
        <div className="bg-[#1c0f16]/30 backdrop-blur-3xl transform-gpu shadow-[0_15px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] border border-[#BF953F]/40 rounded-3xl p-4 flex flex-col min-w-[200px]">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#BF953F]/20">
            <span className="text-white text-xs tracking-[0.2em] uppercase font-medium">Collections</span>
            <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu" className="text-white/60 hover:text-white w-8 h-8 flex justify-center items-center rounded-full">
              <X size={16} />
            </button>
          </div>
          <ul className="space-y-1">
            <li>
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-white/80 hover:text-[#E6C762] hover:bg-white/5 transition-colors text-sm font-medium"
              >
                MEN
              </Link>
            </li>
            <li>
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-white/80 hover:text-[#E6C762] hover:bg-white/5 transition-colors text-sm font-medium border-b border-white/10 mb-2 pb-3"
              >
                WOMEN
              </Link>
            </li>
            {collections.map(c => (
              <li key={c.id}>
                <Link 
                  to={`/category/${c.id}`} 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-white/80 hover:text-[#E6C762] hover:bg-white/5 transition-colors text-sm"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 mt-2 rounded-lg text-[#E6C762] font-medium hover:bg-white/5 transition-colors text-sm border border-[#BF953F]/20 text-center"
              >
                {useStore(state => state.siteConfig.uiTexts.viewCatalog) || 'VIEW CATALOG'}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Glass container - highly translucent with heavy blur and a direct gold border */}
      <div className="flex items-center space-x-3 sm:space-x-5 px-4 sm:px-6 py-2 rounded-full bg-[#1c0f16]/30 backdrop-blur-3xl transform-gpu shadow-[0_15px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] border border-[#BF953F]/40">
        
        <button 
          onClick={() => { setIsMenuOpen(false); navigate('/new-arrivals'); }} 
          aria-label="New Arrivals"
          title="Novedades" 
          className={`w-11 h-11 md:w-8 md:h-8 rounded-full flex items-center justify-center ${iconColor} hover:text-white hover:bg-white/10 transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]`}
        >
          <Sparkles size={18} strokeWidth={1.5} className="md:w-4 md:h-4" />
        </button>
        
        <button 
          onClick={() => { setIsMenuOpen(false); navigate('/favorites'); }} 
          aria-label="Favorites"
          title="Favoritos" 
          className={`w-11 h-11 md:w-8 md:h-8 rounded-full flex items-center justify-center ${iconColor} hover:text-white hover:bg-white/10 transition-all duration-300 relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]`}
        >
          <Heart size={18} strokeWidth={1.5} className={`md:w-4 md:h-4 ${favorites.length > 0 ? "fill-[#FCF6BA] text-[#FCF6BA]" : ""}`} />
          {favorites.length > 0 && (
            <span className="absolute top-1 right-1 md:top-0 md:right-0 w-2.5 h-2.5 md:w-2 md:h-2 bg-[#FCF6BA] rounded-full shadow-[0_0_8px_rgba(252,246,186,0.8)] border border-black"></span>
          )}
        </button>

        <button 
          onClick={() => { setIsMenuOpen(false); navigate('/promotions'); }} 
          aria-label="Promotions"
          title="Ofertas" 
          className={`w-11 h-11 md:w-8 md:h-8 rounded-full flex items-center justify-center ${iconColor} hover:text-white hover:bg-white/10 transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]`}
        >
          <Tag size={18} strokeWidth={1.5} className="md:w-4 md:h-4" />
        </button>

        {/* Catalog / Grid - Special central/highlighted button with large textured gold ring */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          aria-label="Collections Menu"
          title="Colecciones" 
          aria-expanded={isMenuOpen}
          className={`relative w-14 h-14 md:w-10 md:h-10 rounded-full flex items-center justify-center p-[1px] ${goldGradient} shadow-[0_0_10px_rgba(191,149,63,0.3)] hover:scale-105 transition-transform duration-300 mx-1`}
        >
          <div className="w-full h-full rounded-full bg-[#1c0f16]/40 backdrop-blur-xl transform-gpu flex items-center justify-center border border-black/30 shadow-inner">
            <Grid3X3 size={20} strokeWidth={1.5} className={`md:w-[18px] md:h-[18px] ${isMenuOpen ? "text-white" : iconColor}`} />
          </div>
        </button>

        <button 
          onClick={() => { setIsMenuOpen(false); setIsDrawerOpen(true); }} 
          aria-label="Shopping Cart"
          className={`w-11 h-11 md:w-8 md:h-8 rounded-full flex items-center justify-center ${iconColor} hover:text-white hover:bg-white/10 transition-all duration-300 relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]`}
        >
          <ShoppingBag size={18} strokeWidth={1.5} className={`md:w-4 md:h-4 ${shoppingList.length > 0 ? "fill-[#FCF6BA] text-[#FCF6BA]" : ""}`} />
          {shoppingList.length > 0 && (
            <span className="absolute top-0 right-0 md:-top-1 md:-right-1 w-4 h-4 bg-[#BF953F] text-black border border-black rounded-full flex items-center justify-center text-[9px] font-bold shadow-[0_0_8px_rgba(191,149,63,0.8)]">
              {shoppingList.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </button>

        {/* User / Profile / Admin Panel button - mobile only */}
        {isAdmin ? (
          <button 
            onClick={() => { setIsMenuOpen(false); navigate('/admin'); }} 
            aria-label="Admin Panel"
            title="Admin Panel"
            className={`md:hidden w-11 h-11 rounded-full flex items-center justify-center bg-white/10 border border-[#BF953F]/50 ${iconColor} hover:text-white hover:bg-white/20 transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]`}
          >
            <LayoutDashboard size={18} strokeWidth={1.5} />
          </button>
        ) : (
          <button 
            onClick={() => { setIsMenuOpen(false); navigate(isAuthenticated ? '/profile' : '/login'); }} 
            aria-label={isAuthenticated ? 'My Profile' : 'Log In'}
            title={isAuthenticated ? 'Mi Perfil' : 'Iniciar Sesión'}
            className={`md:hidden w-11 h-11 rounded-full flex items-center justify-center ${iconColor} hover:text-white hover:bg-white/10 transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]`}
          >
            <User size={18} strokeWidth={1.5} className={isAuthenticated ? 'fill-[#FCF6BA]/30 text-[#FCF6BA]' : ''} />
          </button>
        )}

      </div>
      </div>
      
      <ShoppingListDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

export default FabNav;
