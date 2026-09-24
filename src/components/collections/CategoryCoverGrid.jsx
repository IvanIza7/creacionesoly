import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ArrowRight, Gem } from 'lucide-react';

const CategoryCoverGrid = () => {
  const collections = useStore(state => state.catalogs.collections);
  const products = useStore(state => state.products);

  return (
    <div className="w-full">
      {/* Section header */}
      <div className="px-8 md:px-16 py-12 md:py-16 border-b border-white/5 flex items-end justify-between">
        <div>
          <span className="text-[#BF953F] text-[10px] tracking-[0.3em] uppercase block mb-3">Nuestras Colecciones</span>
          <h2 className="font-display text-3xl md:text-5xl text-white leading-tight">Explora nuestra<br /><span className="italic font-serif text-[#FCF6BA]">gama completa</span></h2>
        </div>
        <span className="text-white/20 text-xs tracking-widest uppercase hidden md:block">Creaciones Oly · Est. 2024</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 w-full border-t border-l border-white/5">
        {collections.map(collection => {
          const count = products.filter(p => p.category.toUpperCase() === collection.name.toUpperCase()).length;
          
          return (
            <Link 
              key={collection.id} 
              to={`/category/${collection.id}`}
              className="group relative aspect-[3/4] overflow-hidden border-b border-r border-white/5 bg-[#120e0b]"
            >
              {collection.coverImage ? (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-50 transition-all duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${collection.coverImage})` }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-20 transition-all duration-700 group-hover:scale-105">
                  <Gem size={80} strokeWidth={1} className="text-[#BF953F]" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a07]/95 via-transparent to-transparent" />
              
              <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-12 right-6 sm:right-12">
                <span className="text-white/50 text-[10px] tracking-widest mb-2 sm:mb-3 block">{count} {count === 1 ? 'PIECE' : 'PIECES'}</span>
                <div className="flex justify-between items-end">
                  <h3 className="text-2xl sm:text-4xl font-display text-white relative inline-block">
                    {collection.name}
                    <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-[#BF953F]/60 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></span>
                  </h3>
                  <ArrowRight className="text-[#BF953F] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryCoverGrid;
