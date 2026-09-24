import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import api from '../../api/axios';
import { Loader2 } from 'lucide-react';

const Footer = () => {
  const footerConfig = useStore(state => state.siteConfig.footer);
  const [email, setEmail] = useState('');
  const [botField, setBotField] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [status, setStatus] = useState('IDLE'); // IDLE, LOADING, SUCCESS, ERROR
  const [message, setMessage] = useState('');
  const [isTypo, setIsTypo] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!privacyConsent) {
      setMessage('Debes aceptar la política de privacidad para suscribirte.');
      setStatus('ERROR');
      return;
    }

    setStatus('LOADING');
    setMessage('');
    setIsTypo(false);

    try {
      const response = await api.post('/newsletter/subscribe', {
        email,
        bot_field: botField,
        privacy_consent: privacyConsent
      });

      setStatus('SUCCESS');
      setMessage(response.data.message);
      setEmail('');
      setPrivacyConsent(false);
    } catch (error) {
      setStatus('ERROR');
      if (error.response?.status === 400 && error.response?.data?.message?.includes('error de escritura')) {
        setIsTypo(true);
      }
      setMessage(error.response?.data?.message || 'Error al conectar con el servidor.');
    }
  };

  return (
    <footer className="w-full bg-[#16110f] text-white pt-24 pb-32 px-6 border-t border-accent/20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
        
        {/* Left Side: Brand */}
        <div className="flex-1 w-full text-center md:text-left flex flex-col items-center md:items-start">
          <h2 className="font-display text-4xl md:text-5xl tracking-widest mb-4 text-white">{footerConfig.title}</h2>
          <p className="font-serif italic text-white/50 text-sm">
            {footerConfig.subtitle}
          </p>
        </div>

        {/* Right Side: Newsletter (Mix of styles) */}
        <div className="flex-1 w-full max-w-md bg-white/5 p-8 border border-white/10 shadow-2xl backdrop-blur-sm">
          <span className="text-accent text-[9px] tracking-[0.2em] uppercase mb-4 block">{footerConfig.newsletterTitle}</span>
          <p className="text-white/80 text-sm mb-8 font-light">
            {footerConfig.newsletterSubtitle}
          </p>

          {status === 'SUCCESS' ? (
            <div className="bg-[#e5f5e0]/10 border border-[#0b4f37] p-4 text-[#e5f5e0] text-xs leading-relaxed">
              {message}
            </div>
          ) : (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Honeypot */}
              <input 
                type="text" 
                name="website_url" 
                value={botField} 
                onChange={(e) => setBotField(e.target.value)} 
                className="hidden absolute -left-[9999px]" 
                tabIndex="-1" 
                autoComplete="off"
              />

              <div className="flex flex-col sm:flex-row items-end gap-6">
                <div className="flex-1 w-full">
                  <label className="text-white/40 text-[10px] mb-2 block">Your Email ID</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com*" 
                    required
                    maxLength={100}
                    className="w-full bg-transparent border-b border-white/20 pb-2 text-sm focus:outline-none focus:border-accent text-white placeholder-white/20 transition-colors"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={status === 'LOADING'}
                  className="text-[10px] tracking-widest uppercase border border-white/20 text-white px-8 py-3 hover:bg-accent hover:border-accent transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                >
                  {status === 'LOADING' ? <Loader2 size={14} className="animate-spin" /> : 'Subscribe'}
                </button>
              </div>

              {/* Privacy Consent */}
              <label className="flex items-start space-x-2 cursor-pointer mt-2 group">
                <input 
                  type="checkbox" 
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  required
                  className="mt-0.5 appearance-none w-3 h-3 border border-white/40 checked:bg-accent checked:border-accent transition-colors flex-shrink-0"
                />
                <span className="text-[9px] text-white/50 font-light leading-tight group-hover:text-white/80 transition-colors">
                  Acepto la <a href="#" className="underline hover:text-accent">política de privacidad</a> y consiento recibir comunicaciones comerciales sobre novedades y promociones.
                </span>
              </label>

              {/* Feedback Message */}
              {status === 'ERROR' && (
                <div className={`text-[10px] p-3 border ${isTypo ? 'border-yellow-500/50 text-yellow-200 bg-yellow-500/10' : 'border-red-500/50 text-red-200 bg-red-500/10'}`}>
                  {message}
                </div>
              )}
            </form>
          )}
        </div>

      </div>
    </footer>
  );
};

export default Footer;
