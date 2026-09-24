import React from 'react';
import { Heart, ShoppingBag, Gem } from 'lucide-react';
import { useStore } from '../../store/useStore';

const ProductCard = ({ product }) => {
  const toggleFavorite = useStore(state => state.toggleFavorite);
  const addToShoppingList = useStore(state => state.addToShoppingList);
  const favorites = useStore(state => state.favorites);
  const shoppingList = useStore(state => state.shoppingList);

  const isFav = favorites.includes(product.id);
  const cartItem = shoppingList.find(item => item.id === product.id);
  const isCart = !!cartItem;

  return (
    <div className="group relative bg-white border border-black/5 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-[#f9f9f9] overflow-hidden flex items-center justify-center">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            loading="lazy"
            className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-primary/20 space-y-2 group-hover:scale-105 transition-transform duration-700">
            <Gem size={48} strokeWidth={1} />
            <span className="text-[10px] tracking-[0.2em] uppercase">No Image</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {product.isNew && (
            <span className="bg-primary text-white text-[10px] tracking-widest px-2 py-1 uppercase">NEW</span>
          )}
          {product.promoPrice && (
            <span className="bg-accent text-white text-[10px] tracking-widest px-2 py-1 uppercase">PROMO</span>
          )}
          {product.status && product.status !== 'IN STOCK' && (
            <span className="bg-white/90 text-primary text-[10px] tracking-widest px-2 py-1 uppercase">{product.status}</span>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute top-4 right-4 flex flex-col space-y-3 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => toggleFavorite(product.id)}
            aria-label="Add to favorites"
            className="w-10 h-10 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:text-accent transition-colors"
          >
            <Heart size={16} className={isFav ? "fill-accent text-accent" : ""} />
          </button>
          <button 
            onClick={() => addToShoppingList(product)}
            aria-label="Add to shopping list"
            className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center bg-white border border-accent/20 text-primary hover:bg-accent hover:border-accent hover:text-white transition-all shadow-sm"
          >
            <ShoppingBag size={16} className={isCart ? "fill-accent text-accent" : ""} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 text-center">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-display text-sm md:text-lg mb-1 group-hover:text-accent transition-colors">{product.name}</h3>
            <span className="text-[10px] tracking-widest uppercase text-primary/40 block mb-2">{product.category}</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          {product.priceOnRequest ? (
            <span className="font-serif italic text-primary/60">Price on request</span>
          ) : product.promoPrice ? (
            <div className="flex space-x-2 items-center">
              <span className="text-primary/40 line-through text-sm">${(product.priceSale || 0).toLocaleString()}</span>
              <span className="text-accent font-medium">${product.promoPrice.toLocaleString()}</span>
            </div>
          ) : (
            <span className="text-primary font-medium text-sm md:text-base">${(product.priceSale || 0).toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
