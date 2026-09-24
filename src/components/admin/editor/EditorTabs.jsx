import React from 'react';
import ImageCropper from '../../ui/ImageCropper';
import { TextInputWithCount, TextAreaWithCount } from '../../ui/InputWithCount';
import { Plus, Trash2, MessageCircle, GripVertical } from 'lucide-react';

export const BrandEditor = ({ form, onChange }) => (
  <div className="space-y-6">
    <TextInputWithCount 
      label="Nombre de la Marca" 
      value={form.name} 
      onChange={(v) => onChange('name', v)} 
      maxLength={30} 
    />
    <ImageCropper 
      label="Logo Image (Proporción libre)"
      aspectRatio={null} 
      currentImageUrl={form.logoUrl}
      onUploadSuccess={(url) => onChange('logoUrl', url)}
    />
    <div>
      <label className="block text-[10px] tracking-widest text-primary/60 uppercase mb-2">Modo de Visualización</label>
      <select 
        value={form.displayMode} 
        onChange={(e) => onChange('displayMode', e.target.value)}
        className="w-full bg-white border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-accent"
      >
        <option value="TEXT">Solo Texto</option>
        <option value="LOGO">Solo Logo</option>
        <option value="BOTH">Texto y Logo</option>
      </select>
    </div>
  </div>
);

export const TextsEditor = ({ form, onChange }) => (
  <div className="space-y-6">
    <TextInputWithCount label='Texto "Recién Llegados"' value={form.newArrivals} onChange={v => onChange('newArrivals', v)} maxLength={40} />
    <TextInputWithCount label='Texto "Ver Catálogo"' value={form.viewCatalog} onChange={v => onChange('viewCatalog', v)} maxLength={40} />
    <TextInputWithCount label='Texto de Búsqueda' value={form.searchPlaceholder} onChange={v => onChange('searchPlaceholder', v)} maxLength={50} />
  </div>
);

export const HeroEditor = ({ form, onChange, products }) => {
  const [draggedIdx, setDraggedIdx] = React.useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    
    const newItems = [...(form.carouselProducts || [])];
    const item = newItems.splice(draggedIdx, 1)[0];
    newItems.splice(targetIdx, 0, item);
    onChange('carouselProducts', newItems);
    setDraggedIdx(null);
  };

  const addProduct = (e) => {
    const id = e.target.value;
    if (!id) return;
    const current = form.carouselProducts || [];
    if (current.length < 5 && !current.includes(id)) {
      onChange('carouselProducts', [...current, id]);
    }
  };

  const removeProduct = (idx) => {
    const newItems = [...(form.carouselProducts || [])];
    newItems.splice(idx, 1);
    onChange('carouselProducts', newItems);
  };

  const currentProducts = form.carouselProducts || [];

  return (
    <div className="space-y-6">
      <ImageCropper 
        label="Imagen de Fondo (Hero 16:9)"
        aspectRatio={16/9} 
        currentImageUrl={form.backgroundImage}
        onUploadSuccess={(url) => onChange('backgroundImage', url)}
      />
      <div className="grid grid-cols-2 gap-4">
        <TextInputWithCount label='Título principal' value={form.headline} onChange={v => onChange('headline', v)} maxLength={50} />
        <TextInputWithCount label='Palabra Resaltada' value={form.highlightedWord} onChange={v => onChange('highlightedWord', v)} maxLength={30} />
      </div>
      <TextAreaWithCount label='Subtítulo' rows="3" value={form.subtitle} onChange={v => onChange('subtitle', v)} maxLength={150} />
      <div className="grid grid-cols-2 gap-4">
        <TextInputWithCount label='Texto del Botón' value={form.ctaLabel} onChange={v => onChange('ctaLabel', v)} maxLength={30} />
        <TextInputWithCount label='Eslogan Inferior' value={form.footerTagline} onChange={v => onChange('footerTagline', v)} maxLength={80} />
      </div>

      <div className="bg-[#fbfbfb] p-4 border border-black/5">
        <label className="block text-[10px] tracking-widest text-primary/60 uppercase mb-2">Tiempo de Reproducción ({((form.autoplayInterval || 5000)/1000).toFixed(1)}s)</label>
        <input 
          type="range" 
          min="3000" 
          max="10000" 
          step="500" 
          value={form.autoplayInterval || 5000} 
          onChange={e => onChange('autoplayInterval', Number(e.target.value))} 
          className="w-full accent-accent" 
        />
        <div className="flex justify-between text-[9px] text-gray-400 mt-1 font-medium">
          <span>Rápido (3s)</span>
          <span>Lento (10s)</span>
        </div>
      </div>

      <div className="bg-[#fbfbfb] p-4 border border-black/5">
        <label className="block text-[10px] tracking-widest text-primary/60 uppercase mb-2">Productos del Carrusel (Max 5)</label>
        
        <select 
          onChange={addProduct} 
          value="" 
          disabled={currentProducts.length >= 5}
          className="w-full bg-white border border-black/10 px-4 py-2 text-sm focus:outline-none focus:border-accent mb-4 disabled:opacity-50"
        >
          <option value="">{currentProducts.length >= 5 ? 'Límite máximo alcanzado (5)' : 'Añadir un producto...'}</option>
          {products?.filter(p => !currentProducts.includes(p.id)).map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
          ))}
        </select>

        <div className="space-y-2">
          {currentProducts.map((id, idx) => {
            const p = products?.find(prod => prod.id === id);
            if (!p) return null;
            return (
              <div 
                key={id}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={() => setDraggedIdx(null)}
                className={`flex items-center justify-between p-2 border border-black/10 shadow-sm cursor-move transition-all duration-200 ${draggedIdx === idx ? 'opacity-40 scale-[0.98] ring-1 ring-accent bg-[#f9f9f9]' : 'bg-white hover:border-accent'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 overflow-hidden shrink-0">
                    <img src={p.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{p.name}</span>
                    <span className="text-[9px] text-gray-400">Orden: {idx + 1}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeProduct(idx)}
                  className="text-gray-400 hover:text-red-500 p-2"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
          {currentProducts.length === 0 && (
            <p className="text-xs text-gray-400 italic text-center py-4">Ningún producto seleccionado. (Se mostrará "Recién Llegados" por defecto)</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const FooterEditor = ({ form, onChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <TextInputWithCount label='Título de la Marca' value={form.title} onChange={v => onChange('title', v)} maxLength={50} />
      <TextInputWithCount label='Subtítulo de la Marca' value={form.subtitle} onChange={v => onChange('subtitle', v)} maxLength={100} />
    </div>
    <TextInputWithCount label='Título del Boletín' value={form.newsletterTitle} onChange={v => onChange('newsletterTitle', v)} maxLength={50} />
    <TextAreaWithCount label='Subtítulo del Boletín' rows="3" value={form.newsletterSubtitle} onChange={v => onChange('newsletterSubtitle', v)} maxLength={150} />
  </div>
);

export const WhatsappEditor = ({ form, onChange }) => (
  <div className="space-y-6">
    <TextInputWithCount 
      label="WhatsApp Number" 
      value={form.number} 
      onChange={(v) => onChange('number', v)} 
      maxLength={20} 
    />
    <p className="text-[10px] text-primary/50 mt-1 mb-4">Incluye el código de país, sin el signo +. Ejemplo: 1234567890</p>
    
    <TextAreaWithCount 
      label="Mensaje Predeterminado de WhatsApp" 
      rows="3" 
      value={form.message} 
      onChange={(v) => onChange('message', v)} 
      maxLength={200} 
    />
    <p className="text-[10px] text-primary/50 mt-1">Este mensaje se prellenará cuando un cliente solicite información sobre su Lista de Compras.</p>
  </div>
);

export const CollectionsEditor = ({ collections, addCollection, deleteCollection, updateCollection, reorderCollections, expandedCollection, setExpandedCollection }) => {
  const [draggedIdx, setDraggedIdx] = React.useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    
    const newItems = [...collections];
    const item = newItems.splice(draggedIdx, 1)[0];
    newItems.splice(targetIdx, 0, item);
    reorderCollections(newItems);
    setDraggedIdx(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
         <span className="text-sm font-medium">{collections.length} Colecciones</span>
         <button onClick={addCollection} className="flex items-center space-x-2 text-xs tracking-widest bg-primary text-white px-4 py-2 hover:bg-black">
           <Plus size={14} /> <span>AÑADIR COLECCIÓN</span>
         </button>
      </div>
      {collections.map((c, idx) => (
        <div 
          key={c.id} 
          className={`border border-black/5 overflow-hidden transition-all duration-200 ${draggedIdx === idx ? 'opacity-40 scale-[0.98] ring-1 ring-accent bg-[#f9f9f9]' : 'bg-white'}`}
          draggable
          onDragStart={(e) => handleDragStart(e, idx)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, idx)}
          onDragEnd={() => setDraggedIdx(null)}
        >
          <div 
            className="p-4 flex items-center justify-between cursor-move hover:bg-black/[0.02]"
            onClick={(e) => {
              if (!e.defaultPrevented) {
                setExpandedCollection(expandedCollection === c.id ? null : c.id);
              }
            }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-100 overflow-hidden cursor-pointer" onClick={(e) => { e.preventDefault(); setExpandedCollection(expandedCollection === c.id ? null : c.id); }}>
                <img src={c.coverImage} alt={c.name} className="w-full h-full object-cover pointer-events-none" />
              </div>
              <span className="font-medium text-sm cursor-pointer" onClick={(e) => { e.preventDefault(); setExpandedCollection(expandedCollection === c.id ? null : c.id); }}>{c.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[9px] text-gray-400">Orden: {idx + 1}</span>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteCollection('collections', c.id); }} className="text-primary/40 hover:text-red-500 p-2">
                <Trash2 size={16} />
              </button>
              <div className="text-gray-300 cursor-move pl-2 border-l border-black/5">
                <GripVertical size={16} />
              </div>
            </div>
          </div>
          {expandedCollection === c.id && (
            <div className="p-4 border-t border-black/5 bg-[#fbfbfb] space-y-4 cursor-default">
              <TextInputWithCount 
                label="Nombre" 
                value={c.name} 
                onChange={v => updateCollection('collections', c, { ...c, name: v })} 
                maxLength={40} 
              />
              <ImageCropper 
                label="Cover Image (Proporción 3:4)"
                aspectRatio={3/4} 
                currentImageUrl={c.coverImage}
                onUploadSuccess={(url) => updateCollection('collections', c, { ...c, coverImage: url })}
              />
              <TextAreaWithCount 
                label="Descripción" 
                rows="3" 
                value={c.description} 
                onChange={v => updateCollection('collections', c, { ...c, description: v })} 
                maxLength={150} 
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
