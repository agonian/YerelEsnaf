
import React, { useState } from 'react';
import { Map, Calendar, Plus, MessageCircle, Trash2, MapPin, Info, Image, Phone } from 'lucide-react';
import { Tour, User as UserType, UserRole } from '../types';

interface ToursBoardProps {
  tours: Tour[];
  currentUser: UserType | null;
  onAddTour: (tour: Tour) => void;
  onDeleteTour: (id: string) => void;
  onOpenAuth: () => void;
}

const ToursBoard: React.FC<ToursBoardProps> = ({ tours, currentUser, onAddTour, onDeleteTour, onOpenAuth }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Custom Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, tourId: string | null}>({
    isOpen: false,
    tourId: null
  });

  const [formData, setFormData] = useState<{
    title: string;
    route: string;
    date: string;
    price: number;
    conditions: string;
    description: string;
    imageUrl: string;
    contactName: string;
    contactPhone: string;
  }>({
    title: '',
    route: '',
    date: '',
    price: 0,
    conditions: '',
    description: '',
    imageUrl: '',
    contactName: currentUser?.name || '',
    contactPhone: currentUser?.phone || ''
  });

  const filteredTours = tours.filter(t => t.status === 'approved');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const newTour: Tour = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'approved', // Simulating instant approval for demo
      ownerId: currentUser.id
    };

    onAddTour(newTour);
    resetForm();
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setFormData({
        title: '', route: '', date: '', price: 0, conditions: '', description: '', 
        imageUrl: '', contactName: currentUser?.name || '', contactPhone: currentUser?.phone || ''
    });
  };

  const handleOpenCreateModal = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    // Only Business/Admin can post tours
    if (currentUser.role !== UserRole.BUSINESS && currentUser.role !== UserRole.ADMIN) {
        alert("Tur ilanı eklemek için İşletme Hesabı ile giriş yapmalısınız.");
        return;
    }
    setFormData(prev => ({...prev, contactName: currentUser.name, contactPhone: currentUser.phone || ''}));
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, tourId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setDeleteModal({ isOpen: true, tourId });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.tourId) {
        onDeleteTour(deleteModal.tourId);
        setDeleteModal({ isOpen: false, tourId: null });
    }
  };

  const handleReservation = (tour: Tour) => {
     const message = `Merhaba, *${tour.title}* için rezervasyon yaptırmak istiyorum.\n\n*Tarih:* ${new Date(tour.date).toLocaleDateString('tr-TR')}\n*Fiyat:* ${tour.price} TL`;
     window.open(`https://wa.me/${tour.contactPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-20">
      
      {/* Minimal Header */}
      <div className="flex items-center justify-between mb-2 px-1">
         <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Map className="text-orange-600" size={24} />
              Tur İlanları
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">Özel gezi rotaları.</p>
         </div>
         <button 
           onClick={handleOpenCreateModal}
           className="bg-orange-600 text-white px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 hover:bg-orange-700 transition-colors shadow-sm text-xs"
         >
            <Plus size={16} /> <span>Tur Ekle</span>
         </button>
      </div>

      {/* Info Alert */}
      <div className="bg-orange-50 border border-orange-100 p-2 rounded-lg text-xs text-orange-800 flex items-center gap-2 mb-4">
          <Info size={14} className="shrink-0" />
          <span>Sadece yetkili acenteler ilan verebilir.</span>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
         {filteredTours.length > 0 ? (
           filteredTours.map(tour => (
             <div key={tour.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col md:flex-row">
                {/* Image */}
                <div className="h-40 md:h-auto md:w-2/5 relative">
                    <img src={tour.imageUrl} alt={tour.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                        {new Date(tour.date).toLocaleDateString('tr-TR')}
                    </div>
                </div>
                
                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                             <h3 className="font-bold text-slate-900 text-base mb-1 leading-tight">{tour.title}</h3>
                             <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                                <MapPin size={12} className="text-orange-500" /> {tour.route}
                             </p>
                        </div>
                        {(currentUser && (currentUser.id === tour.ownerId || currentUser.role === UserRole.ADMIN)) && (
                            <button onClick={(e) => handleDeleteClick(e, tour.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                        )}
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg text-xs text-slate-600 mb-3 border border-slate-100 flex-1">
                        <p className="line-clamp-3 mb-1">{tour.description}</p>
                        {tour.conditions && (
                            <p className="text-slate-400 italic text-[10px] pt-1 border-t border-slate-200 mt-1">
                                {tour.conditions}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Kişi Başı</span>
                            <span className="text-lg font-bold text-orange-600">{tour.price} TL</span>
                        </div>
                        <button 
                           onClick={() => handleReservation(tour)}
                           className="bg-[#25D366] hover:bg-[#128C7E] text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 text-xs shadow-sm transition-colors"
                        >
                           <MessageCircle size={16} />
                           Rezervasyon
                        </button>
                    </div>
                </div>
             </div>
           ))
         ) : (
            <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
               <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Map size={24} />
               </div>
               <h3 className="text-sm font-bold text-slate-700">Aktif Tur Yok</h3>
               <p className="text-xs text-slate-500 mb-4">Şu an planlanmış bir tur bulunmuyor.</p>
            </div>
         )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                 <h3 className="font-bold text-xl text-slate-900">Yeni Tur Ekle</h3>
                 <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><span className="text-2xl">&times;</span></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Tur Başlığı</label>
                    <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Örn: Günübirlik Kapadokya" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Tarih</label>
                        <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Ücret (TL)</label>
                        <input type="number" required value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="0" />
                     </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Güzergah</label>
                    <input required value={formData.route} onChange={e => setFormData({...formData, route: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Örn: Hatay - Adana - Nevşehir" />
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Görsel URL</label>
                    <div className="relative">
                        <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input required value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder="https://..." />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Açıklama</label>
                    <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none" placeholder="Tur programı detayı..." />
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Katılım Şartları / Notlar</label>
                    <textarea rows={2} value={formData.conditions} onChange={e => setFormData({...formData, conditions: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none" placeholder="Fiyata dahil olanlar, olmayanlar..." />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Acente Adı</label>
                        <input required value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">İletişim Tel</label>
                        <input required value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="90555..." />
                     </div>
                 </div>

                 <button type="submit" className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg transition-all">İlanı Yayınla</button>
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
                 <h3 className="font-bold text-lg text-slate-900 mb-2">Turu Sil</h3>
                 <p className="text-sm text-slate-500 mb-6">Bu ilanı silmek istediğinize emin misiniz?</p>
                 <div className="flex gap-3 w-full">
                    <button onClick={() => setDeleteModal({ isOpen: false, tourId: null })} className="flex-1 py-2.5 rounded-xl text-slate-600 font-bold bg-slate-100 hover:bg-slate-200">İptal</button>
                    <button onClick={handleConfirmDelete} className="flex-1 py-2.5 rounded-xl text-white font-bold bg-red-600 hover:bg-red-700">Sil</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ToursBoard;
