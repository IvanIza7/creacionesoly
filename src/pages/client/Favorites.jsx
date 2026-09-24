import React from 'react';
import { useStore } from '../../store/useStore';
import ProductCard from '../../components/products/ProductCard';

const Favorites = () => {
  const products = useStore(state => state.products);
  const favorites = useStore(state => state.favorites);
  
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="w-full bg-background pt-24 pb-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-accent text-xs tracking-widest block mb-4 uppercase">SAVED PIECES</span>
          <h1 className="font-display text-5xl">My Favorites</h1>
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {favoriteProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-primary/40 font-serif italic">
            You haven't saved any pieces yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
