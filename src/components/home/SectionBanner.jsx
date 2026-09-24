import React from 'react';

const SectionBanner = ({ title, label, imageUrl, align = 'left' }) => {
  return (
    <div className="relative w-full h-64 mb-12 overflow-hidden bg-primary">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-luminosity hover:scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
      
      <div className={`absolute inset-0 flex flex-col justify-end p-12 ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
        <span className="text-accent text-xs tracking-[0.2em] mb-2">{label}</span>
        <h2 className="text-white font-display text-4xl">{title}</h2>
      </div>
    </div>
  );
};

export default SectionBanner;
