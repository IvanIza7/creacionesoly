import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import ProductCard from '../../components/products/ProductCard';

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const collections = useStore(state => state.catalogs.collections);
  const products = useStore(state => state.products);
  
  const collection = collections.find(c => c.id === categoryId);
  
  if (!collection) {
    return <div className="p-24 text-center">Collection not found</div>;
  }

  const categoryProducts = products.filter(p => p.category.toUpperCase() === collection.name.toUpperCase());

  return (
    <div className="w-full bg-background pt-8 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        <Link to="/" className="text-xs tracking-widest text-primary/40 hover:text-accent transition-colors mb-16 inline-block">
          ← ALL COLLECTIONS
        </Link>
        
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <span className="text-accent text-xs tracking-widest mb-6 block uppercase">COLLECTION</span>
          <h1 className="font-display text-6xl md:text-8xl mb-8">{collection.name}</h1>
          <p className="font-serif italic text-xl md:text-2xl text-primary/60 leading-relaxed">
            {collection.description}
          </p>
        </div>

        <div className="flex justify-between items-center border-y border-black/5 py-4 mb-16">
          <div className="flex items-center space-x-6">
            <span className="text-xs tracking-widest font-medium flex items-center space-x-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              <span>FILTER</span>
            </span>
            <div className="flex space-x-4">
              <button className="text-[10px] tracking-widest border border-accent bg-accent/10 text-accent px-4 py-2 uppercase">ALL</button>
              <button className="text-[10px] tracking-widest border border-black/10 hover:border-black/30 text-primary/60 px-4 py-2 uppercase transition-colors">18K WHITE GOLD</button>
              <button className="text-[10px] tracking-widest border border-black/10 hover:border-black/30 text-primary/60 px-4 py-2 uppercase transition-colors">18K YELLOW GOLD</button>
            </div>
          </div>
          <span className="text-xs tracking-widest text-primary/40">{categoryProducts.length} {categoryProducts.length === 1 ? 'PIECE' : 'PIECES'}</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {categoryProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        
        {categoryProducts.length === 0 && (
          <div className="text-center py-24 text-primary/40 font-serif italic">
            No pieces found in this collection.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
