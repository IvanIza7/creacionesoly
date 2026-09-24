import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../store/useStore';

const Hero = () => {
  const heroConfig = useStore(state => state.siteConfig.hero);
  const products = useStore(state => state.products);
  
  const configuredProducts = heroConfig.carouselProducts?.map(id => products.find(p => p.id === id)).filter(Boolean) || [];
  const heroProducts = configuredProducts.length > 0 ? configuredProducts : products.filter(p => p.isNew);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const nextSlide = useCallback(() => {
    if (heroProducts.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % heroProducts.length);
    setProgress(0);
  }, [heroProducts.length]);

  const prevSlide = useCallback(() => {
    if (heroProducts.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? heroProducts.length - 1 : prev - 1));
    setProgress(0);
  }, [heroProducts.length]);

  // Autoplay logic
  useEffect(() => {
    if (heroProducts.length === 0) return;
    
    if (progress >= 100) {
      nextSlide();
      return;
    }

    const interval = heroConfig.autoplayInterval || 5000;
    const increment = (50 / interval) * 100;

    const timer = setInterval(() => {
      setProgress(prev => prev + increment);
    }, 50);
    
    return () => clearInterval(timer);
  }, [progress, heroProducts.length, nextSlide, heroConfig.autoplayInterval]);

  return (
    <div className="relative w-full min-h-screen md:min-h-[600px] md:h-[80vh] bg-primary overflow-hidden flex flex-col md:flex-row py-20 md:py-0">
      {/* Background Image (Covering both but darkened) */}
      <img 
        src={heroConfig.backgroundImage}
        alt="Hero Background"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
      />
      
      {/* Left Panel: Brand */}
      <div className="relative z-10 w-full md:w-1/2 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 border-r border-white/10">
        <span className="text-accent text-xs tracking-widest font-medium mb-8">CREACIONES OLY</span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display text-white leading-tight mb-6">
          {heroConfig.headline} <span className="text-accent italic font-serif">{heroConfig.highlightedWord}</span>
        </h1>
        <p className="text-white/80 font-serif italic text-xl md:text-2xl max-w-md mb-12">
          {heroConfig.subtitle}
        </p>
        <div>
          <button className="border border-white/40 text-white hover:bg-white hover:text-primary transition-colors px-8 py-3 text-xs tracking-[0.2em] font-medium">
            {heroConfig.ctaLabel}
          </button>
        </div>
        <div className="absolute bottom-12 left-8 md:left-24 flex items-center space-x-4 text-white/40 text-xs tracking-widest">
          <span>{heroConfig.footerTagline}</span>
        </div>
      </div>

      {/* Right Column - Dynamic Card */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:py-12 bg-transparent relative z-10">
        
        <div className="w-full max-w-[280px] md:max-w-[300px] mx-auto">
          {/* Header & Arrows above the card */}
          <div className="flex flex-col mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/60 text-[10px] tracking-widest uppercase">{useStore(state => state.siteConfig.uiTexts.newArrivals) || 'NEW ARRIVALS'}</span>
              <div className="flex-1 ml-6 h-[1px] bg-white/10"></div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button onClick={prevSlide} aria-label="Previous slide" className="text-white/40 hover:text-white transition-colors p-2">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1" fill="none"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
              <div className="flex-1 flex space-x-2">
                {heroProducts.map((_, idx) => (
                  <div key={idx} className="h-[2px] flex-1 bg-white/10 relative">
                    {idx === currentIndex && (
                      <div className="absolute top-0 left-0 h-full bg-accent" style={{ width: `${progress}%` }} />
                    )}
                    {idx < currentIndex && (
                      <div className="absolute top-0 left-0 h-full bg-accent w-full" />
                    )}
                  </div>
                ))}
              </div>
              <button onClick={nextSlide} aria-label="Next slide" className="text-white/40 hover:text-white transition-colors p-2">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1" fill="none"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>

          {/* Product Card */}
          {heroProducts.length > 0 && (
            <div className="relative w-full bg-[#16110f] shadow-2xl overflow-hidden flex flex-col border border-white/5">
               <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 z-20">
                 <div 
                   className="h-full bg-accent transition-all duration-75 ease-linear"
                   style={{ width: `${progress}%` }}
                 />
               </div>

               <div className="relative w-full aspect-[5/4] overflow-hidden bg-white/5">
                 <div className="absolute top-4 left-4 bg-[#1a1412] text-white text-[9px] tracking-widest px-2 py-1 uppercase z-10 font-medium">NEW</div>
                 <img 
                   src={heroProducts[currentIndex].image} 
                   alt={heroProducts[currentIndex].name} 
                   className="w-full h-full object-cover"
                 />
               </div>
               
               <div className="p-6 pb-8 flex flex-col w-full text-left">
                 <span className="text-accent text-[10px] md:text-[8px] tracking-[0.2em] mb-2 uppercase block">
                   {heroProducts[currentIndex].category} · 18K WHITE GOLD
                 </span>
                 <h3 className="text-white font-display text-2xl md:text-3xl mb-2">{heroProducts[currentIndex].name}</h3>
                 <span className="text-white/40 text-[10px] md:text-[9px] tracking-widest mb-6 block uppercase">REF. {heroProducts[currentIndex].sku}</span>
                 
                 <div className="flex justify-between items-end w-full">
                   <div className="flex justify-between items-end">
                     {heroProducts[currentIndex].priceOnRequest ? <span className="font-serif italic text-white/60">Price on request</span> : `$${(heroProducts[currentIndex].priceSale || 0).toLocaleString()}`}
                   </div>
                   <span className="text-white/40 text-[9px] tracking-widest">{currentIndex + 1} / {heroProducts.length}</span>
                 </div>
               </div>
            </div>
          )}

          {/* Dots below the card */}
          <div className="flex justify-center space-x-3 mt-8">
            {heroProducts.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-6 w-6 flex items-center justify-center group`}
              >
                <div className={`h-[2px] w-4 transition-colors ${idx === currentIndex ? 'bg-accent' : 'bg-white/20 group-hover:bg-white/40'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
