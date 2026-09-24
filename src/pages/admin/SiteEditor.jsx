import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { MessageCircle } from 'lucide-react';
import { BrandEditor, TextsEditor, HeroEditor, FooterEditor, WhatsappEditor, CollectionsEditor } from '../../components/admin/editor/EditorTabs';

const SiteEditor = () => {
  const heroConfig = useStore(state => state.siteConfig.hero);
  const footerConfig = useStore(state => state.siteConfig.footer);
  const { businessSettings, fetchBusinessSettings, updateBusinessSettings } = useStore();
  
  React.useEffect(() => {
    if (!businessSettings) {
      fetchBusinessSettings();
    }
  }, [businessSettings, fetchBusinessSettings]);

  const whatsappNumber = businessSettings?.whatsappNumber || '';
  const defaultWhatsappMessage = businessSettings?.defaultWhatsappMessage || '';

  const catalogs = useStore(state => state.catalogs);
  const products = useStore(state => state.products);
  const collections = catalogs.collections;

  const updateHeroConfig = useStore(state => state.updateHeroConfig);
  const updateFooterConfig = useStore(state => state.updateFooterConfig);
  
  const addCatalogItem = useStore(state => state.addCatalogItem);
  const updateCatalogItem = useStore(state => state.updateCatalogItem);
  const deleteCatalogItem = useStore(state => state.deleteCatalogItem);
  const reorderCatalogItems = useStore(state => state.reorderCatalogItems);

  const [activeTab, setActiveTab] = useState('BRAND'); // BRAND | TEXTS | HERO | COLLECTIONS | FOOTER | WHATSAPP
  
  const [brandForm, setBrandForm] = useState(useStore(state => state.siteConfig.brand));
  const [uiTextsForm, setUiTextsForm] = useState(useStore(state => state.siteConfig.uiTexts));
  const [heroForm, setHeroForm] = useState(heroConfig);
  const [footerForm, setFooterForm] = useState(footerConfig);
  const [waForm, setWaForm] = useState({ number: whatsappNumber, message: defaultWhatsappMessage });
  const [isSaved, setIsSaved] = useState(true);
  const [expandedCollection, setExpandedCollection] = useState(null);

  React.useEffect(() => {
    if (businessSettings && activeTab === 'WHATSAPP') {
      // Solo actualiza si no hay cambios sin guardar
      if (isSaved) {
        setWaForm({
          number: businessSettings.whatsappNumber || '',
          message: businessSettings.defaultWhatsappMessage || ''
        });
      }
    }
  }, [businessSettings, isSaved, activeTab]);

  const updateBrandConfig = useStore(state => state.updateBrandConfig);
  const updateUiTexts = useStore(state => state.updateUiTexts);

  const handleBrandChange = (field, value) => {
    setBrandForm(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleUiTextsChange = (field, value) => {
    setUiTextsForm(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleHeroChange = (field, value) => {
    setHeroForm(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleFooterChange = (field, value) => {
    setFooterForm(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleWaChange = (field, value) => {
    setWaForm(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSaveAll = async () => {
    if (activeTab === 'BRAND') updateBrandConfig(brandForm);
    if (activeTab === 'TEXTS') updateUiTexts(uiTextsForm);
    if (activeTab === 'HERO') updateHeroConfig(heroForm);
    if (activeTab === 'FOOTER') updateFooterConfig(footerForm);
    if (activeTab === 'WHATSAPP') {
      await updateBusinessSettings({
        ...businessSettings,
        whatsappNumber: waForm.number,
        defaultWhatsappMessage: waForm.message
      });
    }
    
    // Guardar inmediatamente en Supabase
    await syncStateToCloud();
    setIsSaved(true);
  };

  const handleAddCollection = () => {
    addCatalogItem('collections', {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Collection',
      coverImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
      description: 'Enter description here.',
    });
  };

  const renderLivePreview = () => {
    if (activeTab === 'BRAND') {
      return (
        <div className="absolute inset-0 bg-background flex items-center justify-center p-6">
           <div className="bg-white p-6 shadow-sm border border-black/5 rounded-xl flex items-center justify-center">
             {brandForm.displayMode === 'LOGO' || brandForm.displayMode === 'BOTH' ? (
               <img src={brandForm.logoUrl || 'https://via.placeholder.com/150?text=LOGO'} alt="Brand Logo" className="h-12 mr-4 object-contain" />
             ) : null}
             {brandForm.displayMode === 'TEXT' || brandForm.displayMode === 'BOTH' ? (
               <h1 className="font-display text-2xl tracking-widest text-black">
                 {brandForm.name}
               </h1>
             ) : null}
           </div>
        </div>
      );
    }
    
    if (activeTab === 'TEXTS') {
      return (
        <div className="absolute inset-0 bg-background flex flex-col p-6 space-y-4">
           <div className="bg-white p-4 shadow-sm border border-black/5 rounded-xl text-center">
             <span className="text-[10px] tracking-widest uppercase mb-2 block">{uiTextsForm.newArrivals}</span>
           </div>
           <div className="bg-white p-4 shadow-sm border border-black/5 rounded-xl text-center">
             <span className="text-[10px] tracking-widest uppercase mb-2 block">{uiTextsForm.viewCatalog}</span>
           </div>
           <div className="bg-white p-4 shadow-sm border border-black/5 rounded-xl">
             <span className="text-gray-400 text-sm block">{uiTextsForm.searchPlaceholder}</span>
           </div>
        </div>
      );
    }

    if (activeTab === 'HERO') {
      return (
        <div className="absolute inset-0 bg-primary flex flex-col p-6 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity" style={{ backgroundImage: `url(${heroForm.backgroundImage})` }} />
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <span className="text-accent text-[8px] tracking-widest mb-2">CREACIONES OLY</span>
            <h1 className="text-white font-display text-2xl leading-tight mb-2">
              {heroForm.headline} <span className="text-accent italic font-serif">{heroForm.highlightedWord}</span>
            </h1>
            <p className="text-white/80 font-serif italic text-xs mb-4 max-w-[200px] line-clamp-2">{heroForm.subtitle}</p>
            <div>
              <button className="border border-white/40 text-white text-[8px] tracking-widest px-3 py-1">{heroForm.ctaLabel}</button>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeTab === 'COLLECTIONS') {
      return (
        <div className="absolute inset-0 p-4 bg-background overflow-auto">
          <div className="text-center mb-4">
            <h2 className="font-display text-xl">Nuestras Colecciones</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {collections.map(c => (
              <div key={c.id} className="relative aspect-[3/4] bg-primary">
                <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: `url(${c.coverImage})` }} />
                <div className="absolute bottom-2 left-2 text-white font-display text-[10px]">{c.name}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'FOOTER') {
      return (
        <div className="absolute inset-0 bg-[#16110f] p-4 flex flex-col justify-center">
          <h2 className="font-display text-xl text-white mb-2">{footerForm.title}</h2>
          <p className="font-serif italic text-white/50 text-[10px] mb-8">{footerForm.subtitle}</p>
          
          <div className="bg-white/5 p-4 border border-white/10">
            <span className="text-accent text-[8px] tracking-widest uppercase mb-2 block">{footerForm.newsletterTitle}</span>
            <p className="text-white/80 text-[10px] mb-4">{footerForm.newsletterSubtitle}</p>
            <div className="border-b border-white/20 pb-1 flex justify-between">
               <span className="text-white/40 text-[10px]">email@example.com</span>
               <span className="text-white text-[8px] uppercase">Suscribirse</span>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'WHATSAPP') {
      return (
        <div className="absolute inset-0 bg-background flex flex-col items-center justify-center relative">
           <div className="text-center p-8 text-primary/40 text-xs">Contenido de la página aquí</div>
           <div className="absolute bottom-6 right-6">
             <div className="bg-[#128C7E] text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-xl shadow-green-900/20">
               <MessageCircle size={16} />
               <span className="text-[10px] uppercase tracking-widest font-medium">WhatsApp</span>
             </div>
           </div>
           <div className="absolute top-4 right-4 bg-white shadow p-3 rounded text-xs border border-black/10 max-w-[250px]">
             <div className="font-medium mb-1">Vista previa de WhatsApp:</div>
             <div className="mb-2"><strong>https://wa.me/{waForm.number}</strong></div>
             <div className="italic text-[10px] text-gray-500 line-clamp-3">{waForm.message}</div>
           </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 h-full p-2 sm:p-0">
      {/* Editor Panel */}
      <div className="flex-1 lg:max-w-2xl flex flex-col">
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-display mb-1 lg:mb-2">Editor Web</h2>
          <span className="text-[10px] lg:text-xs tracking-widest text-primary/40 uppercase">PERSONALIZAR PÁGINAS DE LA TIENDA</span>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 lg:space-x-8 border-b border-black/5 mb-6 lg:mb-8 overflow-x-auto whitespace-nowrap hide-scrollbar">
          {['BRAND', 'TEXTS', 'HERO', 'COLLECTIONS', 'FOOTER', 'WHATSAPP'].map(tab => (
            <button 
              key={tab}
              onClick={() => { setActiveTab(tab); setIsSaved(true); }}
              className={`pb-3 lg:pb-4 text-[10px] lg:text-xs tracking-widest uppercase transition-colors relative ${activeTab === tab ? 'text-primary font-medium' : 'text-primary/40 hover:text-primary'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto lg:pr-4 pb-12">
          {activeTab === 'BRAND' && <BrandEditor form={brandForm} onChange={handleBrandChange} />}
          {activeTab === 'TEXTS' && <TextsEditor form={uiTextsForm} onChange={handleUiTextsChange} />}
          {activeTab === 'HERO' && <HeroEditor form={heroForm} onChange={handleHeroChange} products={products} />}
          {activeTab === 'FOOTER' && <FooterEditor form={footerForm} onChange={handleFooterChange} />}
          {activeTab === 'WHATSAPP' && <WhatsappEditor form={waForm} onChange={handleWaChange} />}
          {activeTab === 'COLLECTIONS' && (
            <CollectionsEditor 
              collections={collections}
              addCollection={handleAddCollection}
              deleteCollection={deleteCatalogItem}
              updateCollection={updateCatalogItem}
              reorderCollections={(newOrder) => reorderCatalogItems('collections', newOrder)}
              expandedCollection={expandedCollection}
              setExpandedCollection={setExpandedCollection}
            />
          )}
        </div>

        {/* Save button - mobile only */}
        <button 
          onClick={handleSaveAll}
          className={`lg:hidden mt-6 w-full py-4 text-xs tracking-widest uppercase transition-colors flex justify-center items-center font-bold shadow-md ${isSaved ? 'bg-[#0b4f37] text-white' : 'bg-accent text-white hover:bg-black'}`}
        >
          {isSaved ? 'PUBLICADO EN LA NUBE ✓' : 'GUARDAR Y PUBLICAR EN LA NUBE ☁️'}
        </button>
      </div>

      {/* Live Preview Panel - hidden on mobile */}
      <div className="hidden lg:flex w-full lg:w-96 flex-col shrink-0 sticky top-12 h-[500px] lg:h-[calc(100vh-160px)] mt-8 lg:mt-0">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] lg:text-xs tracking-widest text-primary/60 uppercase flex items-center"><span className="w-2 h-2 bg-accent rounded-full mr-2"></span> VISTA PREVIA</span>
          {!isSaved && <span className="text-[10px] tracking-widest text-accent uppercase font-bold">● Cambios sin guardar</span>}
        </div>
        
        {/* Browser Frame */}
        <div className="bg-white border border-black/10 rounded-t-lg shadow-sm flex flex-col flex-1 overflow-hidden">
          <div className="h-6 lg:h-8 bg-[#f5f5f5] border-b border-black/5 flex items-center px-4 space-x-1.5 shrink-0">
            <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-black/20"></div>
            <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-black/20"></div>
            <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-black/20"></div>
            <div className="flex-1 mx-4 h-3 lg:h-4 bg-white border border-black/5 rounded-full"></div>
          </div>
          
          <div className="flex-1 bg-background overflow-hidden relative">
             {renderLivePreview()}
          </div>
        </div>

        <button 
          onClick={handleSaveAll}
          className={`mt-4 w-full py-3 lg:py-4 text-[10px] lg:text-xs tracking-widest uppercase transition-all duration-300 flex justify-center items-center font-bold shadow-md ${isSaved ? 'bg-[#0b4f37] text-white' : 'bg-accent text-white hover:bg-black'}`}
        >
          {isSaved ? 'PUBLICADO EN LA NUBE ✓' : 'GUARDAR Y PUBLICAR EN LA NUBE ☁️'}
        </button>
      </div>
    </div>
  );
};

export default SiteEditor;
