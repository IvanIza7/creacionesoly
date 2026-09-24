import React from 'react';
import { useStore } from '../../store/useStore';
import ProductCard from '../../components/products/ProductCard';

const Promotions = () => {
  const products = useStore(state => state.products);
  
  const promoProducts = products.filter(p => p.promoPrice !== null);

  return (
    <div className="w-full bg-background pt-24 pb-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-accent text-xs tracking-widest block mb-4 uppercase">LIMITED TIME OFFERS</span>
          <h1 className="font-display text-5xl">Promotions</h1>
        </div>

        {promoProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {promoProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-primary/40 font-serif italic">
            No promotions available at this time.
          </div>
        )}
      </div>
    </div>
  );
};

export default Promotions;
