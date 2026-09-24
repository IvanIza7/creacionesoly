import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Edit2, Trash2, X, Search, Image as ImageIcon, ScanLine, LayoutDashboard } from 'lucide-react';
import ImageCropper from '../../components/ui/ImageCropper';
import { TextInputWithCount } from '../../components/ui/InputWithCount';

const ProductFormModal = ({ isOpen, onClose, product, onSave }) => {
  const catalogs = useStore(state => state.catalogs);
  const collections = catalogs.collections;
  
  const [formData, setFormData] = useState(product || {
    name: '',
    category: catalogs.categories[0],
    collectionId: '',
    gender: catalogs.genders[0],
    brand: catalogs.brands[0],
    materials: [catalogs.materials[0]],
    color: catalogs.colors[0],
    stone: catalogs.stones[0],
    size: catalogs.sizes[0],
    pricePurchase: '',
    priceSale: '',
    stockInitial: '',
    stockCurrent: '',
    stockMinimum: 2,
    location: catalogs.locations[0],
    image: '',
    isNew: true
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'materials') {
      const opts = Array.from(e.target.selectedOptions, option => option.value);
      setFormData({ ...formData, materials: opts });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      stockInitial: Number(formData.stockInitial) || Number(formData.stockCurrent),
      stockCurrent: Number(formData.stockCurrent) || Number(formData.stockInitial),
      pricePurchase: Number(formData.pricePurchase) || 0,
      priceSale: Number(formData.priceSale) || 0,
      stockMinimum: Number(formData.stockMinimum) || 2
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-black/10 flex justify-between items-center bg-[#fbfbfb]">
          <h3 className="text-2xl font-display">{product ? 'Edit Product' : 'Quick Add Product'}</h3>
          <button onClick={onClose} className="text-primary/40 hover:text-primary"><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 flex flex-col md:flex-row gap-8">
           {/* Left side: Image & Core */}
           <div className="w-full md:w-1/3 flex flex-col space-y-6">
             <ImageCropper 
                label="Product Image (1:1)"
                aspectRatio={1} 
                currentImageUrl={formData.image}
                onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
             />
             
             <div>
                <TextInputWithCount 
                  label="Product Name *" 
                  required 
                  value={formData.name} 
                  onChange={(v) => setFormData({ ...formData, name: v })} 
                  maxLength={50} 
                />
             </div>
             <div>
                <label className="text-[10px] tracking-widest uppercase text-primary/60 mb-2 block">Sale Price *</label>
                <input required type="number" name="priceSale" value={formData.priceSale} onChange={handleChange} className="w-full border border-black/20 px-4 py-2 text-sm focus:border-primary focus:outline-none" />
             </div>
           </div>

           {/* Right side: Catalogs & Stock */}
           <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="text-[10px] tracking-widest uppercase text-primary/60 mb-2 block">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-black/20 px-4 py-2 text-sm focus:border-primary focus:outline-none">
                  {catalogs.categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] tracking-widest uppercase text-primary/60 mb-2 block">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-black/20 px-4 py-2 text-sm focus:border-primary focus:outline-none">
                  {catalogs.genders.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] tracking-widest uppercase text-primary/60 mb-2 block">Material</label>
                <select name="materials" multiple value={formData.materials} onChange={handleChange} className="w-full border border-black/20 px-4 py-2 text-sm focus:border-primary focus:outline-none h-20">
                  {catalogs.materials.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] tracking-widest uppercase text-primary/60 mb-2 block">Color</label>
                <select name="color" value={formData.color} onChange={handleChange} className="w-full border border-black/20 px-4 py-2 text-sm focus:border-primary focus:outline-none">
                  {catalogs.colors.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] tracking-widest uppercase text-primary/60 mb-2 block">Stone</label>
                <select name="stone" value={formData.stone} onChange={handleChange} className="w-full border border-black/20 px-4 py-2 text-sm focus:border-primary focus:outline-none">
                  {catalogs.stones.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] tracking-widest uppercase text-primary/60 mb-2 block">Size</label>
                <select name="size" value={formData.size} onChange={handleChange} className="w-full border border-black/20 px-4 py-2 text-sm focus:border-primary focus:outline-none">
                  {catalogs.sizes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] tracking-widest uppercase text-primary/60 mb-2 block">Collection</label>
                <select name="collectionId" value={formData.collectionId} onChange={handleChange} className="w-full border border-black/20 px-4 py-2 text-sm focus:border-primary focus:outline-none">
                  <option value="">None</option>
                  {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] tracking-widest uppercase text-primary/60 mb-2 block">Location</label>
                <select name="location" value={formData.location} onChange={handleChange} className="w-full border border-black/20 px-4 py-2 text-sm focus:border-primary focus:outline-none">
                  {catalogs.locations.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] tracking-widest uppercase text-primary/60 mb-2 block">Current Stock *</label>
                <input required type="number" name="stockCurrent" value={formData.stockCurrent} onChange={handleChange} className="w-full border border-black/20 px-4 py-2 text-sm focus:border-primary focus:outline-none" />
              </div>
              
              <div>
                <label className="text-[10px] tracking-widest uppercase text-primary/60 mb-2 block">Mark as "New Arrival"</label>
                <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} className="w-4 h-4" />
              </div>

           </div>
        </form>

        <div className="p-6 border-t border-black/10 bg-[#fbfbfb] flex justify-end space-x-4">
          <button onClick={onClose} className="px-6 py-3 border border-black/20 text-xs tracking-widest uppercase hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-accent">Cancel</button>
          <button onClick={handleSubmit} className="px-6 py-3 bg-primary text-white text-xs tracking-widest uppercase hover:bg-black focus:outline-none focus:ring-2 focus:ring-accent">Save Product</button>
        </div>
      </div>
    </div>
  );
};

const Inventory = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const catalogs = useStore(state => state.catalogs);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Smart Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.materials && p.materials.some(m => m.toLowerCase().includes(q)))
      );
    }

    if (filterCategory !== 'All') result = result.filter(p => p.category === filterCategory);
    if (filterLocation !== 'All') result = result.filter(p => p.location === filterLocation);
    
    if (filterStatus !== 'All') {
      if (filterStatus === 'Available') result = result.filter(p => p.status.includes('Disponible'));
      if (filterStatus === 'Low Stock') result = result.filter(p => p.status.includes('Poco stock'));
      if (filterStatus === 'Out of Stock') result = result.filter(p => p.status.includes('Agotado'));
    }

    // Sort
    if (sortBy === 'Newest') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'Price High') result = [...result].sort((a, b) => b.priceSale - a.priceSale);
    if (sortBy === 'Price Low') result = [...result].sort((a, b) => a.priceSale - b.priceSale);

    return result;
  }, [products, searchQuery, filterCategory, filterStatus, filterLocation, sortBy]);

  const handleSave = (productData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const countAll = products.length;
  const countAvailable = products.filter(p => p.status.includes('Disponible')).length;
  const countLowStock = products.filter(p => p.status.includes('Poco stock')).length;
  const countOutOfStock = products.filter(p => p.status.includes('Agotado')).length;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* LEFT SIDEBAR: Filters */}
      <div className="w-full lg:w-64 flex-shrink-0">
        {/* Mobile: header with toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-display text-black font-semibold">Inventory</h2>
            <span className="px-2 py-0.5 bg-white text-gray-700 text-[10px] rounded-full border border-black/5 font-medium shadow-sm">
              {countAll} total
            </span>
          </div>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center space-x-1 text-xs border border-black/10 rounded-full px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span>{showMobileFilters ? 'Hide' : 'Filters'}</span>
            <span className="text-[10px]">{showMobileFilters ? '▲' : '▼'}</span>
          </button>
        </div>
        
        {/* Filter panels - always shown on desktop, togglable on mobile */}
        <div className={`flex flex-col gap-6 ${showMobileFilters ? 'block' : 'hidden lg:flex'}`}>

        {/* 2x2 Status Grid */}
        <div>
          <h3 className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-3">Status</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setFilterStatus('All')}
              className={`p-3 rounded-2xl border flex flex-col items-start transition-all ${filterStatus === 'All' ? 'border-gray-800 shadow-sm' : 'border-black/5 bg-white shadow-sm hover:border-black/20'}`}
            >
              <span className="text-[10px] font-medium text-gray-500 mb-1">All</span>
              <span className="text-lg font-bold text-black">{countAll}</span>
            </button>
            <button 
              onClick={() => setFilterStatus('Available')}
              className={`p-3 rounded-2xl border flex flex-col items-start transition-all ${filterStatus === 'Available' ? 'border-gray-800 shadow-sm' : 'border-black/5 bg-white shadow-sm hover:border-black/20'}`}
            >
              <span className="text-[10px] font-medium text-gray-500 mb-1">Active</span>
              <span className="text-lg font-bold text-black">{countAvailable}</span>
            </button>
            <button 
              onClick={() => setFilterStatus('Low Stock')}
              className={`p-3 rounded-2xl border flex flex-col items-start transition-all ${filterStatus === 'Low Stock' ? 'border-gray-800 shadow-sm' : 'border-black/5 bg-white shadow-sm hover:border-black/20'}`}
            >
              <span className="text-[10px] font-medium text-gray-500 mb-1">Low Stock</span>
              <span className="text-lg font-bold text-black">{countLowStock}</span>
            </button>
            <button 
              onClick={() => setFilterStatus('Out of Stock')}
              className={`p-3 rounded-2xl border flex flex-col items-start transition-all ${filterStatus === 'Out of Stock' ? 'border-gray-800 shadow-sm' : 'border-black/5 bg-white shadow-sm hover:border-black/20'}`}
            >
              <span className="text-[10px] font-medium text-gray-500 mb-1">Out Stock</span>
              <span className="text-lg font-bold text-black">{countOutOfStock}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-2">Sort</h3>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full bg-white border border-black/5 rounded-xl py-2.5 px-4 text-xs text-gray-700 shadow-sm focus:outline-none focus:border-gray-300">
              <option value="Newest">Alphabetical: A-Z</option>
              <option value="Price High">Price: High to Low</option>
              <option value="Price Low">Price: Low to High</option>
            </select>
          </div>
          <div>
            <h3 className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-2">Category</h3>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full bg-white border border-black/5 rounded-xl py-2.5 px-4 text-xs text-gray-700 shadow-sm focus:outline-none focus:border-gray-300">
              <option value="All">All Categories</option>
              {catalogs.categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <h3 className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-2">Location</h3>
            <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="w-full bg-white border border-black/5 rounded-xl py-2.5 px-4 text-xs text-gray-700 shadow-sm focus:outline-none focus:border-gray-300">
              <option value="All">All Locations</option>
              {catalogs.locations.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button 
          onClick={() => { setFilterStatus('All'); setFilterCategory('All'); setFilterLocation('All'); setSearchQuery(''); setSortBy('Newest'); }}
          className="mt-4 flex items-center justify-center space-x-2 py-3 text-xs text-gray-500 hover:text-black transition-colors"
        >
          <span>↻ Clear Filters</span>
        </button>
        </div>{/* end collapsible filter panels */}
      </div>{/* end sidebar */}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full min-h-[600px]">
        {/* Top Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-black/5 rounded-full py-2.5 pl-10 pr-10 text-sm shadow-sm focus:outline-none focus:border-gray-300"
            />
            <ScanLine className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="hidden sm:flex bg-white rounded-full border border-black/5 shadow-sm p-1">
              <button className="p-1.5 rounded-full bg-black text-white"><LayoutDashboard size={14} /></button>
              <button className="p-1.5 rounded-full text-gray-400 hover:text-black"><LayoutDashboard size={14} className="opacity-50" /></button>
            </div>
            <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm border border-black/5 text-gray-600 hover:text-black">
              <span className="font-bold -translate-y-1">...</span>
            </button>
            <button 
              onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
              className="bg-black text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors shadow-md whitespace-nowrap"
            >
              Add Item
            </button>
          </div>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-8 custom-scrollbar">
          {filteredProducts.map(product => {
            const isLowStock = product.stockCurrent <= product.stockMinimum;
            const isOutOfStock = product.stockCurrent === 0;
            return (
              <div key={product.id} className="bg-white rounded-[20px] p-3 pl-4 flex flex-col md:flex-row items-start md:items-center shadow-sm border border-black/5 hover:shadow-md transition-shadow relative">
                
                {/* Thumbnail & Title */}
                <div className="flex items-center space-x-4 w-full md:w-[40%] mb-4 md:mb-0">
                  <div className="w-14 h-14 rounded-[14px] bg-[#f0f0f0] flex-shrink-0 overflow-hidden p-1 shadow-inner">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-[10px]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1 leading-tight">{product.name}</h4>
                    <div className="flex items-center text-[11px] text-gray-500 space-x-2">
                      <span>{product.category}</span>
                      <span>•</span>
                      <span>Stock: {product.stockCurrent} Units</span>
                      {isLowStock && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.6)]"></span>}
                    </div>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px h-10 bg-gray-100 mx-6"></div>

                {/* Meta 1: Date */}
                <div className="hidden md:block w-1/4 mb-4 md:mb-0">
                  <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold block mb-1">Added Date</span>
                  <span className="text-xs font-medium text-gray-800">
                    {new Date(product.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px h-10 bg-gray-100 mx-6"></div>

                {/* Meta 2: Location */}
                <div className="hidden md:block w-1/4 mb-4 md:mb-0">
                  <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold block mb-1">Warehouse Location</span>
                  <span className="text-xs font-medium text-gray-800">{product.location || 'Warehouse A'}</span>
                </div>

                {/* Actions */}
                <div className="w-full md:w-auto md:ml-auto flex items-center justify-end absolute top-4 right-4 md:relative md:top-auto md:right-auto">
                  <div className="relative group">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-100 text-gray-400 hover:text-black hover:border-gray-300 transition-colors">
                      <span className="font-bold -translate-y-1">...</span>
                    </button>
                    {/* Hover menu for actions */}
                    <div className="absolute right-0 top-full mt-1 bg-white shadow-lg border border-black/5 rounded-xl py-2 w-32 hidden group-hover:block z-10">
                      <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center"><Edit2 size={12} className="mr-2" /> Edit</button>
                      <button onClick={() => deleteProduct(product.id)} className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center"><Trash2 size={12} className="mr-2" /> Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <ProductFormModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={editingProduct}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Inventory;
