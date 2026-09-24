import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

const ShoppingListDrawer = ({ isOpen, onClose }) => {
  const { 
    shoppingList, 
    updateQuantity, 
    removeFromShoppingList, 
    businessSettings, 
    fetchBusinessSettings 
  } = useStore();

  useEffect(() => {
    if (isOpen && !businessSettings) {
      fetchBusinessSettings();
    }
  }, [isOpen, businessSettings, fetchBusinessSettings]);

  if (!isOpen) return null;

  const totalItems = shoppingList.reduce((acc, item) => acc + item.quantity, 0);

  const handleSendWhatsapp = () => {
    if (shoppingList.length === 0) return;

    const baseMessage = businessSettings?.defaultWhatsappMessage 
      || "Hello. I would like to receive information about availability and pricing for the following products:";
    
    let productsText = "\n";
    shoppingList.forEach(item => {
      productsText += `\n- ${item.product.name} (Qty: ${item.quantity})`;
      if (item.product.sku) productsText += `\n  SKU: ${item.product.sku}`;
    });

    const fullMessage = `${baseMessage}${productsText}\n\nThank you.`;
    const waNumber = businessSettings?.whatsappNumber || "1234567890";
    
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(fullMessage)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md xl:max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-black/5 flex items-center justify-between bg-[#fbfbfb]">
          <div className="flex items-center space-x-3">
            <ShoppingBag size={20} />
            <h2 className="font-display text-xl uppercase tracking-widest">Shopping List</h2>
          </div>
          <button onClick={onClose} aria-label="Close Shopping List" className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-white">
          {shoppingList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-primary/40 space-y-4">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="font-serif italic text-sm">You haven't added any products to your list yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {shoppingList.map((item) => (
                <div key={item.id} className="flex gap-4 border border-black/5 p-3 hover:border-black/10 transition-colors">
                  <div className="w-20 h-20 bg-gray-50 flex-shrink-0">
                    <img src={item.product.image} alt={item.product.name} loading="lazy" className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h4 className="font-medium text-sm leading-tight text-primary mb-1">{item.product.name}</h4>
                      <p className="text-[10px] text-primary/40 tracking-widest uppercase">SKU: {item.product.sku}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-black/10 rounded-sm overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity" className="px-2 py-1 bg-[#f9f9f9] hover:bg-black/5">
                          <Minus size={12} />
                        </button>
                        <span className="text-xs px-3 font-medium min-w-[30px] text-center" aria-live="polite">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity" className="px-2 py-1 bg-[#f9f9f9] hover:bg-black/5">
                          <Plus size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeFromShoppingList(item.id)} aria-label="Remove item" className="text-primary/40 hover:text-red-500 p-1 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-black/5 bg-[#fbfbfb]">
          <div className="flex justify-between items-center mb-6 text-sm">
            <span className="text-primary/60 uppercase tracking-widest text-[10px]">Total items</span>
            <span className="font-medium">{totalItems}</span>
          </div>
          <button 
            onClick={handleSendWhatsapp}
            disabled={shoppingList.length === 0}
            aria-label="Request Information via WhatsApp"
            className="w-full bg-[#128C7E] hover:bg-[#075E54] text-white py-4 px-2 flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/10 uppercase tracking-[0.1em] sm:tracking-widest text-[10px] sm:text-xs font-medium"
          >
            <span className="truncate whitespace-nowrap text-center">Request Info via WhatsApp</span>
          </button>
          <p className="text-center text-[9px] text-primary/40 mt-4 font-serif italic">
            The system will automatically generate a message with your selected products.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ShoppingListDrawer;
