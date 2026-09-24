import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const SimpleCatalogList = ({ title, items, catalogName }) => {
  const addCatalogItem = useStore(state => state.addCatalogItem);
  const deleteCatalogItem = useStore(state => state.deleteCatalogItem);
  const [newItem, setNewItem] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newItem.trim() && !items.includes(newItem.trim())) {
      addCatalogItem(catalogName, newItem.trim());
      setNewItem('');
    }
  };

  return (
    <div className="bg-white border border-black/5 flex flex-col h-[320px] sm:h-[400px]">
      <div className="p-4 border-b border-black/5 bg-[#fbfbfb]">
        <h3 className="font-display text-lg">{title}</h3>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center bg-[#f9f9f9] p-3 text-sm">
            <span>{item}</span>
            <button onClick={() => deleteCatalogItem(catalogName, item)} className="text-primary/40 hover:text-red-500">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-black/5 bg-[#fbfbfb]">
        <form onSubmit={handleAdd} className="flex space-x-2">
          <input 
            type="text" 
            value={newItem} 
            onChange={e => setNewItem(e.target.value)} 
            placeholder="New option..."
            className="flex-1 bg-white border border-black/10 px-3 py-2 text-xs focus:outline-none focus:border-accent"
          />
          <button type="submit" className="bg-primary text-white px-3 py-2 text-xs hover:bg-black"><Plus size={14}/></button>
        </form>
      </div>
    </div>
  );
};

const Catalogs = () => {
  const catalogs = useStore(state => state.catalogs);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-display mb-2">Manageable Catalogs</h2>
        <span className="text-xs tracking-widest text-primary/40 uppercase">SYSTEM CONFIGURATION</span>
      </div>
      
      <p className="text-sm text-primary/60 mb-8 max-w-3xl">
        Add or remove options from the dropdowns used throughout the system. This allows the inventory structure to scale dynamically without requiring code changes. (Note: Collections are managed in the Site Editor).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
        <SimpleCatalogList title="Categories" items={catalogs.categories} catalogName="categories" />
        <SimpleCatalogList title="Materials" items={catalogs.materials} catalogName="materials" />
        <SimpleCatalogList title="Stones" items={catalogs.stones} catalogName="stones" />
        <SimpleCatalogList title="Colors" items={catalogs.colors} catalogName="colors" />
        <SimpleCatalogList title="Sizes" items={catalogs.sizes} catalogName="sizes" />
        <SimpleCatalogList title="Genders" items={catalogs.genders} catalogName="genders" />
        <SimpleCatalogList title="Brands" items={catalogs.brands} catalogName="brands" />
        <SimpleCatalogList title="Locations" items={catalogs.locations} catalogName="locations" />
      </div>
    </div>
  );
};

export default Catalogs;
