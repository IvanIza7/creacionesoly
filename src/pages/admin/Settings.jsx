import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Loader2 } from 'lucide-react';

const Settings = () => {
  const { businessSettings, fetchBusinessSettings, updateBusinessSettings } = useStore();
  const [formData, setFormData] = useState({
    businessName: '',
    whatsappNumber: '',
    defaultWhatsappMessage: '',
    contactEmail: ''
  });
  const [status, setStatus] = useState('IDLE'); // IDLE, LOADING, SAVING, SUCCESS, ERROR
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      setStatus('LOADING');
      await fetchBusinessSettings();
      setStatus('IDLE');
    };
    loadSettings();
  }, [fetchBusinessSettings]);

  useEffect(() => {
    if (businessSettings) {
      setFormData({
        businessName: businessSettings.businessName || '',
        whatsappNumber: businessSettings.whatsappNumber || '',
        defaultWhatsappMessage: businessSettings.defaultWhatsappMessage || '',
        contactEmail: businessSettings.contactEmail || ''
      });
    }
  }, [businessSettings]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setStatus('SAVING');
    setErrorMsg('');
    try {
      await updateBusinessSettings(formData);
      setStatus('SUCCESS');
      setTimeout(() => setStatus('IDLE'), 3000);
    } catch (err) {
      setStatus('ERROR');
      setErrorMsg(err.response?.data?.message || 'Error al guardar configuración');
    }
  };

  if (status === 'LOADING') {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-gray-400" size={32} /></div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-12">
        <h2 className="text-3xl font-display mb-2">Configuración General</h2>
        <span className="text-xs tracking-widest text-primary/40 uppercase">INFORMACIÓN DEL NEGOCIO</span>
      </div>

      {status === 'SUCCESS' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-sm">
          Configuración guardada exitosamente.
        </div>
      )}

      {status === 'ERROR' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="bg-white border border-black/5 p-8 space-y-6">
        
        <div>
          <label className="block text-[10px] tracking-widest text-primary/60 uppercase mb-2">Nombre del Negocio</label>
          <input 
            type="text" 
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className="w-full bg-[#f9f9f9] border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-accent" 
          />
        </div>

        <div>
          <label className="block text-[10px] tracking-widest text-primary/60 uppercase mb-2">Correo de Contacto</label>
          <input 
            type="email" 
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className="w-full bg-[#f9f9f9] border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-accent" 
          />
        </div>

        <div className="pt-4 border-t border-black/5">
          <h3 className="text-lg font-medium mb-1">Integración WhatsApp</h3>
          <p className="text-sm font-serif italic text-primary/60 mb-4">Configura cómo recibirás las Shopping Lists.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-widest text-primary/60 uppercase mb-2">Número de WhatsApp (con código de país, sin +)</label>
              <input 
                type="text" 
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="Ej. 1234567890"
                className="w-full bg-[#f9f9f9] border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-accent" 
              />
            </div>
            
            <div>
              <label className="block text-[10px] tracking-widest text-primary/60 uppercase mb-2">Mensaje Inicial Predeterminado</label>
              <textarea 
                name="defaultWhatsappMessage"
                value={formData.defaultWhatsappMessage}
                onChange={handleChange}
                rows={3}
                className="w-full bg-[#f9f9f9] border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-accent" 
              />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button 
            onClick={handleSave}
            disabled={status === 'SAVING'}
            className="px-8 py-3 text-xs tracking-widest uppercase transition-colors bg-primary text-white hover:bg-black disabled:opacity-50 flex items-center justify-center min-w-[120px]"
          >
            {status === 'SAVING' ? <Loader2 size={16} className="animate-spin" /> : 'GUARDAR CAMBIOS'}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default Settings;
