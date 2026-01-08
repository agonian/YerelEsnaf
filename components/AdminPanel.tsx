import React, { useState, useEffect } from 'react';
import { Shield, Check, X, Search, Clock, Trash2, Edit, Plus, AlertTriangle, Truck, Landmark } from 'lucide-react';
import { Business, UserRole, User, Category } from '../types';

interface AdminPanelProps {
  businesses: Business[];
  setBusinesses: React.Dispatch<React.SetStateAction<Business[]>>;
  currentUser: User | null;
  onAddBusiness: () => void;
}

// Helper component for live countdown
const PromotionTimer: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        return `${days}g ${hours}s ${minutes}d ${seconds}sn`;
      }
      return 'Süre Doldu';
    };

    // Initial call
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return <span className="text-[10px] font-mono font-bold text-amber-600 block mt-1">{timeLeft}</span>;
};

const AdminPanel: React.FC<AdminPanelProps> = ({ businesses, setBusinesses, currentUser, onAddBusiness }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');
  
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  
  // Modals
  const [showTimeModal, setShowTimeModal] = useState<{id: string} | null>(null);
  const [timeDuration, setTimeDuration] = useState('1h');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning';
    onConfirm: () => void;
  } | null>(null);

  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-red-600">Yetkisiz Erişim</h2>
        <p>Bu sayfayı görüntülemek için yönetici olmalısınız.</p>
      </div>
    );
  }

  // --- Handlers ---

  const handleStatusChange = (id: string, status: 'approved' | 'rejected' | 'passive') => {
    setBusinesses(prev => prev.map(b => 
      b.id === id ? { ...b, status: status } : b
    ));
  };

  const handleDeleteRequest = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'İşletmeyi Sil',
      message: 'Bu işletmeyi kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
      type: 'danger',
      onConfirm: () => {
        setBusinesses(prev => prev.filter(b => b.id !== id));
        setConfirmModal(null);
      }
    });
  };

  const handlePromoteClick = (business: Business) => {
     if (business.isPromoted) {
       // Request disable promotion
       setConfirmModal({
         isOpen: true,
         title: 'Reklamı Kaldır',
         message: `${business.name} adlı işletmenin öne çıkarma özelliği kapatılsın mı?`,
         type: 'warning',
         onConfirm: () => {
            setBusinesses(prev => prev.map(b => 
              b.id === business.id ? { ...b, isPromoted: false, promotedUntil: undefined } : b
            ));
            setConfirmModal(null);
         }
       });
     } else {
       // Enable promotion (Show Time modal)
       setShowTimeModal({ id: business.id });
     }
  };

  const handleTimeConfirm = () => {
    if (!showTimeModal) return;

    const now = new Date();
    let expiryDate = new Date();

    switch (timeDuration) {
      case '1h': expiryDate.setHours(now.getHours() + 1); break;
      case '24h': expiryDate.setHours(now.getHours() + 24); break;
      case '7d': expiryDate.setDate(now.getDate() + 7); break;
      case '30d': expiryDate.setDate(now.getDate() + 30); break;
      default: expiryDate.setHours(now.getHours() + 1);
    }

    const isoDate = expiryDate.toISOString();

    setBusinesses(prev => prev.map(b => 
      b.id === showTimeModal.id ? { ...b, isPromoted: true, promotedUntil: isoDate } : b
    ));

    setShowTimeModal(null);
  };

  const handleEditSave = (updated: Business) => {
     setBusinesses(prev => prev.map(b => b.id === updated.id ? updated : b));
     setEditingBusiness(null);
  };

  // --- Filtering ---
  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' ? true : b.status === 'pending';
    const matchesCat = categoryFilter === 'All' ? true : b.category === categoryFilter;
    
    return matchesSearch && matchesTab && matchesCat;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] relative">
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Shield className="text-purple-600" />
              Yönetici Paneli
            </h2>
            <p className="text-slate-500">İşletme onayı, düzenleme ve öne çıkarma işlemleri.</p>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <button 
              type="button"
              onClick={onAddBusiness}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors mr-2"
            >
              <Plus size={16} /> Yeni İşletme
            </button>

            <select 
               className="p-2 border border-slate-300 rounded-lg text-sm bg-white"
               value={categoryFilter}
               onChange={(e) => setCategoryFilter(e.target.value as Category | 'All')}
            >
               <option value="All">Tüm Kategoriler</option>
               {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="relative">
              <input
                type="text"
                placeholder="İşletme ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-64"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>
        </div>

        <div className="flex gap-4 border-b border-slate-100">
           <button
             type="button"
             onClick={() => setActiveTab('pending')}
             className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
               activeTab === 'pending' 
                 ? 'text-purple-600' 
                 : 'text-slate-500 hover:text-slate-800'
             }`}
           >
             Bekleyen Onaylar
             {businesses.filter(b => b.status === 'pending').length > 0 && (
               <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                 {businesses.filter(b => b.status === 'pending').length}
               </span>
             )}
             {activeTab === 'pending' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600"></div>}
           </button>
           <button
             type="button"
             onClick={() => setActiveTab('all')}
             className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
               activeTab === 'all' 
                 ? 'text-purple-600' 
                 : 'text-slate-500 hover:text-slate-800'
             }`}
           >
             Tüm İşletmeler
             {activeTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600"></div>}
           </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">İşletme</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Durum</th>
              <th className="px-6 py-4 text-center">Reklam</th>
              <th className="px-6 py-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBusinesses.map(business => (
              <tr key={business.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{business.name}</div>
                  <div className="text-xs text-slate-400">{business.phone}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <span className="bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">
                    {business.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {business.status === 'approved' && (
                    <span className="inline-flex items-center text-green-700 bg-green-50 px-2 py-1 rounded text-xs font-bold border border-green-100">
                      <Check size={12} className="mr-1" /> Onaylı
                    </span>
                  )}
                  {business.status === 'pending' && (
                    <span className="inline-flex items-center text-amber-700 bg-amber-50 px-2 py-1 rounded text-xs font-bold border border-amber-100 animate-pulse">
                      <Clock size={12} className="mr-1" /> Bekliyor
                    </span>
                  )}
                  {business.status === 'rejected' && (
                    <span className="inline-flex items-center text-red-700 bg-red-50 px-2 py-1 rounded text-xs font-bold border border-red-100">
                      <X size={12} className="mr-1" /> Reddedildi
                    </span>
                  )}
                  {business.status === 'passive' && (
                    <span className="inline-flex items-center text-slate-500 bg-slate-100 px-2 py-1 rounded text-xs font-bold border border-slate-200">
                      Pasif
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <div className="flex flex-col items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handlePromoteClick(business)}
                      className={`relative z-10 inline-flex items-center justify-center w-8 h-8 rounded-full transition-all cursor-pointer ${
                        business.isPromoted 
                          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 ring-2 ring-yellow-400 ring-offset-1' 
                          : 'bg-slate-100 text-slate-300 hover:bg-slate-200 hover:text-indigo-500'
                      }`}
                      title={business.isPromoted ? "Reklamı Kapat" : "Öne Çıkar"}
                    >
                      <Shield size={16} className={business.isPromoted ? 'fill-current' : ''} />
                    </button>
                    {business.isPromoted && business.promotedUntil && (
                      <PromotionTimer targetDate={business.promotedUntil} />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2">
                     <button
                        type="button"
                        onClick={() => setEditingBusiness(business)}
                        className="p-2 text-slate-500 hover:text-indigo-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                        title="Düzenle / İncele"
                     >
                        <Edit size={16} />
                     </button>

                     {business.status === 'pending' && (
                       <>
                        <button 
                          type="button"
                          onClick={() => handleStatusChange(business.id, 'approved')}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"
                        >
                          Onayla
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleStatusChange(business.id, 'rejected')}
                          className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"
                        >
                          Reddet
                        </button>
                       </>
                     )}
                     
                     {business.status === 'approved' && (
                        <button 
                          type="button"
                          onClick={() => handleStatusChange(business.id, 'passive')}
                          className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                        >
                          Pasife Al
                        </button>
                     )}

                      {business.status === 'passive' && (
                        <button 
                          type="button"
                          onClick={() => handleStatusChange(business.id, 'approved')}
                          className="bg-green-100 text-green-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-200 transition-colors"
                        >
                          Aktif Et
                        </button>
                     )}
                     
                     <button 
                       type="button"
                       onClick={() => handleDeleteRequest(business.id)}
                       className="text-slate-400 hover:text-red-600 p-2"
                       title="Sil"
                     >
                       <Trash2 size={16} />
                     </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      {confirmModal && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-white/80 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-sm animate-in zoom-in-95">
              <div className="flex flex-col items-center text-center">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                   confirmModal.type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                 }`}>
                   <AlertTriangle size={24} />
                 </div>
                 <h3 className="font-bold text-lg text-slate-900 mb-2">{confirmModal.title}</h3>
                 <p className="text-sm text-slate-500 mb-6">{confirmModal.message}</p>
                 
                 <div className="flex gap-3 w-full">
                    <button 
                      onClick={() => setConfirmModal(null)}
                      className="flex-1 py-2.5 rounded-xl text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      İptal
                    </button>
                    <button 
                      onClick={confirmModal.onConfirm}
                      className={`flex-1 py-2.5 rounded-xl text-white font-bold transition-colors ${
                        confirmModal.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-500 hover:bg-amber-600'
                      }`}
                    >
                      Onayla
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- TIME MODAL --- */}
      {showTimeModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 w-80 animate-in zoom-in-95">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Clock className="text-indigo-600" />
                Süre Seçiniz
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                İşletmeyi öne çıkarıyorsunuz. Bu işlem ne kadar süre geçerli olsun?
              </p>
              
              <div className="grid grid-cols-2 gap-2 mb-6">
                 {['1h', '24h', '7d', '30d'].map(t => (
                   <button
                     key={t}
                     type="button"
                     onClick={() => setTimeDuration(t)}
                     className={`py-2 rounded-lg text-sm font-bold border ${
                       timeDuration === t 
                         ? 'bg-indigo-600 text-white border-indigo-600' 
                         : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                     }`}
                   >
                     {t === '1h' ? '1 Saat' : t === '24h' ? '1 Gün' : t === '7d' ? '1 Hafta' : '1 Ay'}
                   </button>
                 ))}
              </div>

              <div className="flex justify-end gap-2">
                 <button type="button" onClick={() => setShowTimeModal(null)} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-lg">İptal</button>
                 <button type="button" onClick={handleTimeConfirm} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">Uygula</button>
              </div>
           </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {editingBusiness && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
           <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
                 <h3 className="font-bold text-xl">İşletme Düzenle</h3>
                 <button type="button" onClick={() => setEditingBusiness(null)}><X /></button>
              </div>
              <div className="p-6 space-y-4">
                 <div>
                    <label className="text-xs font-bold text-slate-500">İşletme Adı</label>
                    <input 
                      className="w-full p-2 border rounded-lg" 
                      value={editingBusiness.name} 
                      onChange={e => setEditingBusiness({...editingBusiness, name: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500">Kategori</label>
                      <select 
                         className="w-full p-2 border rounded-lg bg-white"
                         value={editingBusiness.category}
                         onChange={e => setEditingBusiness({...editingBusiness, category: e.target.value as Category})}
                      >
                         {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500">Telefon</label>
                      <input 
                        className="w-full p-2 border rounded-lg" 
                        value={editingBusiness.phone} 
                        onChange={e => setEditingBusiness({...editingBusiness, phone: e.target.value})}
                      />
                    </div>
                 </div>

                 {/* New Toggles for Edit */}
                 <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm font-medium flex items-center gap-2"><Landmark size={16} className="text-blue-600" /> Kamu/Bilgi Kurumu (Ürün Satışı Yok)</span>
                        <input 
                           type="checkbox" 
                           checked={editingBusiness.isPublicService || false}
                           onChange={e => setEditingBusiness({...editingBusiness, isPublicService: e.target.checked})}
                           className="w-4 h-4"
                        />
                    </label>
                    <div className="h-px bg-slate-200" />
                    <label className={`flex items-center justify-between cursor-pointer ${editingBusiness.isPublicService ? 'opacity-50' : ''}`}>
                        <span className="text-sm font-medium flex items-center gap-2"><Truck size={16} className="text-green-600" /> Paket Servis Var</span>
                        <input 
                           type="checkbox" 
                           checked={editingBusiness.hasDelivery ?? true}
                           disabled={editingBusiness.isPublicService}
                           onChange={e => setEditingBusiness({...editingBusiness, hasDelivery: e.target.checked})}
                           className="w-4 h-4"
                        />
                    </label>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-slate-500">Açıklama</label>
                    <textarea 
                      className="w-full p-2 border rounded-lg" 
                      rows={3}
                      value={editingBusiness.description} 
                      onChange={e => setEditingBusiness({...editingBusiness, description: e.target.value})}
                    />
                 </div>
                 
                 <div className="border-t pt-4">
                    <h4 className="font-bold text-sm mb-2">Ürünler ({editingBusiness.products.length})</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto bg-slate-50 p-2 rounded-lg">
                       {editingBusiness.products.map((p, idx) => (
                          <div key={p.id} className="flex justify-between text-sm bg-white p-2 rounded shadow-sm">
                             <span>{p.name}</span>
                             <span className="font-bold">{p.price} TL</span>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="p-6 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                 <button type="button" onClick={() => setEditingBusiness(null)} className="px-4 py-2 bg-white border rounded-lg">Vazgeç</button>
                 <button type="button" onClick={() => handleEditSave(editingBusiness)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Değişiklikleri Kaydet</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;