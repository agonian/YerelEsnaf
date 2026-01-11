
import React, { useState } from 'react';
import { Tag, MapPin, Search, Plus, Filter, MessageCircle, Trash2, Edit, Home, Car, ShoppingBag, Image, Phone, User, LayoutGrid, List } from 'lucide-react';
import { ClassifiedAd, ClassifiedCategory, User as UserType, UserRole } from '../types';

interface ClassifiedsBoardProps {
  ads: ClassifiedAd[];
  currentUser: UserType | null;
  onAddAd: (ad: ClassifiedAd) => void;
  onDeleteAd: (id: string) => void;
  onOpenAuth: () => void;
}

const ClassifiedsBoard: React.FC<ClassifiedsBoardProps> = ({ ads, currentUser, onAddAd, onDeleteAd, onOpenAuth }) => {
  const [activeCategory, setActiveCategory] = useState<ClassifiedCategory | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // New State for View Mode
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, adId: string | null}>({
    isOpen: false,
    adId: null
  });

  const [formData, setFormData] = useState<{
    title: string;
    price: number;
    category: ClassifiedCategory;
    description: string;
    imageUrl: string;
    location: string;
    contactName: string;
    contactPhone: string;
  }>({
    title: '',
    price: 0,
    category: ClassifiedCategory.SECOND_HAND,
    description: '',
    imageUrl: '',
    location: '',
    contactName: currentUser?.name || '',
    contactPhone: currentUser?.phone || ''
  });

  const filteredAds = ads.filter(ad => 
    (activeCategory === 'All' || ad.category === activeCategory) &&
    ad.status === 'approved' &&
    (ad.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     ad.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const newAd: ClassifiedAd = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'approved', // Auto-approve for demo simplicity, typically pending
      ownerId: currentUser.id
    };

    onAddAd(newAd);
    resetForm();
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setFormData({
        title: '', price: 0, category: ClassifiedCategory.SECOND_HAND, description: '', 
        imageUrl: '', location: '', contactName: currentUser?.name || '', contactPhone: currentUser?.phone || ''
    });
  };

  const handleOpenCreateModal = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setFormData(prev => ({...prev, contactName: currentUser.name, contactPhone: currentUser.phone || ''}));
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, adId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setDeleteModal({ isOpen: true, adId });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.adId) {
        onDeleteAd(deleteModal.adId);
        setDeleteModal({ isOpen: false, adId: null });
    }
  };

  const getCategoryIcon = (cat: ClassifiedCategory) => {
      switch(cat) {
          case ClassifiedCategory.REAL_ESTATE: return <Home size={12} />;
          case ClassifiedCategory.VEHICLE: return <Car size={12} />;
          case ClassifiedCategory.SECOND_HAND: return <ShoppingBag size={12} />;
          default: return <Tag size={12} />;
      }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-24">
      
      {/* Header - Compact */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="relative z-10">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Tag size={24} />
              Pazar Yeri
            </h1>
            <p className="text-emerald-100 text-sm opacity-90">
              İkinci el, emlak ve vasıta ilanları.
            </p>
         </div>
         <button 
              onClick={handleOpenCreateModal}
              className="bg-white text-emerald-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-50 transition-colors shadow-sm text-sm whitespace-nowrap w-fit z-10"
            >
               <Plus size={16} /> <span>İlan Ver</span>
         </button>
         <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 translate-x-10 pointer-events-none"></div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between sticky top-16 z-20">
         
         {/* Categories - Compact */}
         <div className="flex overflow-x-auto no-scrollbar w-full md:w-auto gap-2 pb-1 md:pb-0">
            <button 
              onClick={() => setActiveCategory('All')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap border ${activeCategory === 'All' ? 'bg-emerald-600 text-white border-emerald-600' : 'text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
               Tümü
            </button>
            {Object.values(ClassifiedCategory).map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${activeCategory === cat ? 'bg-emerald-600 text-white border-emerald-600' : 'text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                   {getCategoryIcon(cat)} {cat}
                </button>
            ))}
         </div>

         <div className="flex gap-2 w-full md:w-auto items-center">
            {/* Search */}
            <div className="relative flex-1 md:w-56">
               <input 
                 type="text" 
                 placeholder="İlan ara..." 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
               />
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            </div>

            {/* View Toggle */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Izgara Görünümü"
                >
                    <LayoutGrid size={16} />
                </button>
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Liste Görünümü"
                >
                    <List size={16} />
                </button>
            </div>
         </div>
      </div>

      {/* --- ADS LISTING --- */}
      {filteredAds.length > 0 ? (
          <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4" 
                : "flex flex-col gap-3"
          }>
           {filteredAds.map(ad => (
             <div 
                key={ad.id} 
                className={`bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-all group relative ${
                    viewMode === 'list' ? 'flex flex-row h-32 md:h-40' : 'flex flex-col'
                }`}
             >
                {/* Image Section */}
                <div className={`bg-slate-100 relative overflow-hidden ${
                    viewMode === 'list' ? 'w-32 md:w-48 shrink-0' : 'aspect-[4/3] w-full'
                }`}>
                    <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    
                    {/* Badge */}
                    <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-bold text-white flex items-center gap-1 shadow-sm">
                        {getCategoryIcon(ad.category)} <span className={viewMode === 'grid' ? 'hidden md:inline' : ''}>{ad.category}</span>
                    </div>

                    {/* Delete Button (Owner/Admin) */}
                    {(currentUser && (currentUser.id === ad.ownerId || currentUser.role === UserRole.ADMIN)) && (
                        <button 
                            onClick={(e) => handleDeleteClick(e, ad.id)}
                            className="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-full text-red-500 shadow-sm hover:bg-white"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}
                </div>
                
                {/* Content Section */}
                <div className={`p-3 flex flex-col flex-1 ${viewMode === 'list' ? 'justify-between' : ''}`}>
                    <div>
                        <div className="flex justify-between items-start gap-1 mb-1">
                            <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">{ad.title}</h3>
                        </div>
                        <p className="text-emerald-600 font-bold text-base md:text-lg mb-1">{ad.price.toLocaleString('tr-TR')} TL</p>
                        
                        {/* Description - Show only in List view or limited in Grid */}
                        {viewMode === 'list' && (
                            <p className="text-slate-500 text-xs line-clamp-2 mb-2 hidden md:block">{ad.description}</p>
                        )}
                    </div>
                    
                    <div className="mt-auto">
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-2">
                            <MapPin size={10} /> <span className="truncate max-w-[100px]">{ad.location}</span>
                            <span className="w-0.5 h-0.5 bg-slate-300 rounded-full"></span>
                            <span className="shrink-0">{new Date(ad.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>

                        {viewMode === 'list' ? (
                             <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                 <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                                     <User size={12} className="text-slate-400" /> {ad.contactName}
                                 </div>
                                 <a 
                                    href={`https://wa.me/${ad.contactPhone}`} 
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                                 >
                                    <MessageCircle size={14} /> Mesaj
                                 </a>
                             </div>
                        ) : (
                             // Grid View Footer (Minimal)
                             <a 
                                href={`https://wa.me/${ad.contactPhone}`} 
                                target="_blank"
                                rel="noreferrer"
                                className="w-full border border-slate-200 text-slate-600 text-[10px] font-bold py-1.5 rounded flex items-center justify-center gap-1 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors"
                             >
                                <MessageCircle size={12} /> Mesaj Gönder
                             </a>
                        )}
                    </div>
                </div>
             </div>
           ))
          }
         </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-xl border border-dashed border-slate-300">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Tag size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">İlan Bulunamadı</h3>
            <p className="text-slate-500 mb-6">Bu kategoride henüz ilan yok. İlk ilanı sen ekle!</p>
            <button onClick={handleOpenCreateModal} className="text-emerald-600 font-bold hover:underline">Hemen İlan Ver</button>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                 <h3 className="font-bold text-xl text-slate-900">Yeni İlan Oluştur</h3>
                 <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><span className="text-2xl">&times;</span></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">İlan Başlığı</label>
                    <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Örn: Temiz iPhone 11" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Fiyat (TL)</label>
                        <input type="number" required value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="0" />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Kategori</label>
                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as ClassifiedCategory})} className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 outline-none">
                            {Object.values(ClassifiedCategory).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Görsel URL</label>
                    <div className="relative">
                        <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input required value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="https://..." />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Konum / Mahalle</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Örn: Cumhuriyet Mah." />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Açıklama</label>
                    <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none" placeholder="Ürün detayları..." />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">İletişim İsim</label>
                        <input required value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">İletişim Tel</label>
                        <input required value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="90555..." />
                     </div>
                 </div>

                 <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all">İlanı Yayınla</button>
              </form>
           </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/80 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-sm animate-in zoom-in-95">
              <div className="flex flex-col items-center text-center">
                 <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-red-100 text-red-600">
                   <Trash2 size={24} />
                 </div>
                 <h3 className="font-bold text-lg text-slate-900 mb-2">İlanı Sil</h3>
                 <p className="text-sm text-slate-500 mb-6">Bu ilanı silmek istediğinize emin misiniz?</p>
                 <div className="flex gap-3 w-full">
                    <button onClick={() => setDeleteModal({ isOpen: false, adId: null })} className="flex-1 py-2.5 rounded-xl text-slate-600 font-bold bg-slate-100 hover:bg-slate-200">İptal</button>
                    <button onClick={handleConfirmDelete} className="flex-1 py-2.5 rounded-xl text-white font-bold bg-red-600 hover:bg-red-700">Sil</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ClassifiedsBoard;
