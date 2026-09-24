import React from 'react';
import { useStore } from '../../store/useStore';
import ProductCard from '../../components/products/ProductCard';

const NewArrivals = () => {
  const products = useStore(state => state.products);
  
  const newProducts = products.filter(p => p.isNew);

  return (
    <div className="w-full bg-background pt-24 pb-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-accent text-xs tracking-widest block mb-4 uppercase">LATEST ADDITIONS</span>
          <h1 className="font-display text-5xl">New Arrivals</h1>
        </div>

        {newProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {newProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-primary/40 font-serif italic">
            No new arrivals at this moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;
