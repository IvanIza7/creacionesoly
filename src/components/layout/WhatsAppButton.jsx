import React from 'react';
import { useStore } from '../../store/useStore';

const WhatsAppButton = () => {
  const { businessSettings, fetchBusinessSettings } = useStore();

  React.useEffect(() => {
    if (!businessSettings) {
      fetchBusinessSettings();
    }
  }, [businessSettings, fetchBusinessSettings]);

  const handleClick = () => {
    const waNumber = businessSettings?.whatsappNumber || "1234567890";
    const text = encodeURIComponent(businessSettings?.defaultWhatsappMessage || "Hello Creaciones Oly, I would like to make a general inquiry.");
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  };

  return (
    <button 
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-whatsapp text-white px-5 py-3 rounded-none shadow-xl flex items-center space-x-2 hover:bg-[#083a28] transition-colors"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
      <span className="font-medium text-sm tracking-wide">WHATSAPP</span>
    </button>
  );
};

export default WhatsAppButton;
