import React, { useState } from 'react';
import { Business, Product, Category } from '../types';
import { Plus, Trash2, Edit2, Save, X, Package, DollarSign, Store, Image, MapPin, Phone, Info, AlertTriangle, Truck, Landmark, Clock, Lock } from 'lucide-react';
import { ADMIN_PHONE_NUMBER } from '../constants';

interface BusinessDashboardProps {
  business: Business;
  onUpdateBusiness: (updatedBusiness: Business) => void;
}

const BusinessDashboard: React.FC<BusinessDashboardProps> = ({ business, onUpdateBusiness }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'products'>('info');
  
  // Products State
  const [products, setProducts] = useState<Product[]>(business.products);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ name: '', price: 0, description: '' });

  // General Info State
  const [formData, setFormData] = useState<Business>(business);
  const [isSaving, setIsSaving] = useState(false);

  // --- BLOCKED VIEW FOR PENDING STATUS ---
  if (business.status === 'pending') {
      return (
          <div className="max-w-2xl mx-auto py-12 text-center">
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 shadow-sm">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
                      <Lock size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Hesabınız Onay Bekliyor</h2>
                  <p className="text-slate-600 mb-6">
                      İşletme panelinize erişebilmek için hesabınızın yönetici tarafından onaylanması gerekmektedir. 
                  </p>
                  
                  <div className="bg-white p-4 rounded-xl border border-slate-100 text-left mb-6">
                      <h4 className="font-bold text-slate-800 mb-2 text-sm">Ne yapmalısınız?</h4>
                      <ul className="text-sm text-slate-500 space-y-2">
                          <li className="flex gap-2"><Clock size={16} className="text-amber-500 shrink-0" /> İşletme bilgileriniz inceleniyor.</li>
                          <li className="flex gap-2"><Phone size={16} className="text-green-500 shrink-0" /> Onay sürecini hızlandırmak için WhatsApp'tan yazabilirsiniz.</li>
                      </ul>
                  </div>

                  <button 
                    onClick={() => {
                        const waMessage = `Merhaba, işletmemin onayı hakkında bilgi almak istiyorum.%0A%0A*İşletme Adı:* ${business.name}`;
                        window.open(`https://wa.me/${ADMIN_PHONE_NUMBER}?text=${waMessage}`, '_blank');
                    }}
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                      <Phone size={18} /> WhatsApp ile İletişime Geç
                  </button>
              </div>
          </div>
      );
  }

  // --- Product Handlers ---
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: Number(newProduct.price),
      description: newProduct.description
    };

    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    onUpdateBusiness({ ...business, products: updatedProducts });
    setNewProduct({ name: '', price: 0, description: '' });
    setIsAddingProduct(false);
  };

  const handleDeleteProduct = (id: string) => {
    if(confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
        const updatedProducts = products.filter(p => p.id !== id);
        setProducts(updatedProducts);
        onUpdateBusiness({ ...business, products: updatedProducts });
    }
  };

  // --- General Info Handlers ---
  const handleInfoSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
        onUpdateBusiness(formData);
        setIsSaving(false);
        alert('Bilgiler başarıyla güncellendi.');
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* Header Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">İşletme Yönetim Paneli</h2>
            <p className="text-slate-500 text-sm">İşletme bilgilerinizi ve menünüzü buradan yönetin.</p>
          </div>
          <div className="flex items-center gap-2">
             <div className={`px-3 py-1 rounded-full text-xs font-bold ${business.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {business.status === 'approved' ? 'Yayında' : 'Onay Bekliyor/Pasif'}
             </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
           <button 
             onClick={() => setActiveTab('info')}
             className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'info' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
           >
             <Store size={18} />
             İşletme Bilgileri
           </button>
           <button 
             onClick={() => setActiveTab('products')}
             className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'products' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
           >
             <Package size={18} />
             Ürünler & Menü
           </button>
        </div>
      </div>

      {/* --- TAB CONTENT: GENERAL INFO --- */}
      {activeTab === 'info' && (
         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-left-4">
             <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-sm text-amber-800">
                <AlertTriangle className="shrink-0" size={20} />
                <div>
                   <p className="font-bold">Önemli Bilgi</p>
                   <p>İşletme statüsü, puan (rating) ve reklam durumu sadece <span className="font-bold">Site Yöneticisi (Admin)</span> tarafından değiştirilebilir. Bilgilerinizi güncelledikten sonra "Değişiklikleri Kaydet" butonuna basmayı unutmayın.</p>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                 {/* Editable Fields */}
                 <div className="space-y-4">
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">İşletme Adı</label>
                       <input 
                         className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                         value={formData.name}
                         onChange={e => setFormData({...formData, name: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Kategori</label>
                       <select 
                          className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value as Category})}
                       >
                          {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Telefon</label>
                       <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            className="w-full p-3 pl-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                          />
                       </div>
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Adres</label>
                       <div className="relative">
                          <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                          <textarea 
                            className="w-full p-3 pl-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                            rows={3}
                            value={formData.address}
                            onChange={e => setFormData({...formData, address: e.target.value})}
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                     <div>
                       <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Kapak Görseli (URL)</label>
                       <div className="relative">
                          <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            className="w-full p-3 pl-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-600" 
                            value={formData.imageUrl}
                            onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                          />
                       </div>
                       <div className="mt-2 h-32 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img src={formData.imageUrl} className="w-full h-full object-cover opacity-80" alt="Önizleme" />
                       </div>
                    </div>

                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Açıklama</label>
                       <textarea 
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                            rows={4}
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                          />
                    </div>

                    <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm font-medium flex items-center gap-2"><Landmark size={16} className="text-blue-600" /> Kamu/Bilgi Kurumu (Ürün Satışı Yok)</span>
                            <input 
                                type="checkbox" 
                                checked={formData.isPublicService || false}
                                onChange={e => setFormData({...formData, isPublicService: e.target.checked})}
                                className="w-4 h-4"
                            />
                        </label>
                        <div className="h-px bg-slate-200" />
                        <label className={`flex items-center justify-between cursor-pointer ${formData.isPublicService ? 'opacity-50' : ''}`}>
                            <span className="text-sm font-medium flex items-center gap-2"><Truck size={16} className="text-green-600" /> Paket Servis Var</span>
                            <input 
                                type="checkbox" 
                                checked={formData.hasDelivery ?? true}
                                disabled={formData.isPublicService}
                                onChange={e => setFormData({...formData, hasDelivery: e.target.checked})}
                                className="w-4 h-4"
                            />
                        </label>
                    </div>

                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Etiketler (Virgül ile ayırın)</label>
                       <input 
                         className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                         value={formData.tags.join(', ')}
                         onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
                         placeholder="Örn: kebap, döner, acılı"
                       />
                    </div>
                 </div>
             </div>

             {/* Read-Only Stats */}
             <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="p-3 bg-slate-50 rounded-lg text-center">
                    <span className="block text-xs text-slate-500 uppercase font-bold">Puan (Rating)</span>
                    <span className="text-xl font-bold text-slate-800">{business.rating} / 5.0</span>
                    <span className="block text-[10px] text-slate-400 mt-1">Yönetici tarafından denetlenir.</span>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-lg text-center">
                    <span className="block text-xs text-slate-500 uppercase font-bold">Reklam Durumu</span>
                    <span className={`text-sm font-bold block mt-1 ${business.isPromoted ? 'text-green-600' : 'text-slate-400'}`}>
                        {business.isPromoted ? 'Aktif' : 'Pasif'}
                    </span>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-lg text-center">
                    <span className="block text-xs text-slate-500 uppercase font-bold">Statü</span>
                    <span className="text-sm font-bold text-slate-800 block mt-1 uppercase">{business.status === 'approved' ? 'Onaylı' : business.status}</span>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-lg text-center">
                    <span className="block text-xs text-slate-500 uppercase font-bold">İlan Bitiş</span>
                    <span className="text-sm text-slate-600 block mt-1">{business.promotedUntil ? new Date(business.promotedUntil).toLocaleDateString() : '-'}</span>
                 </div>
             </div>

             <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleInfoSave}
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
                >
                  {isSaving ? 'Kaydediliyor...' : <><Save size={20} /> Değişiklikleri Kaydet</>}
                </button>
             </div>
         </div>
      )}

      {/* --- TAB CONTENT: PRODUCTS --- */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-right-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
              <Package className="text-indigo-600" size={20} />
              Ürün Listesi
            </h3>
            <button 
              onClick={() => setIsAddingProduct(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={16} /> Yeni Ürün Ekle
            </button>
          </div>

          {isAddingProduct && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 animate-in fade-in slide-in-from-top-2">
              <h4 className="font-bold text-indigo-900 mb-3 text-sm">Yeni Ürün Bilgileri</h4>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-indigo-800 mb-1">Ürün Adı</label>
                  <input 
                    type="text" 
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full p-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="Örn: Lahmacun"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-indigo-800 mb-1">Fiyat (TL)</label>
                  <input 
                    type="number" 
                    value={newProduct.price || ''}
                    onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    className="w-full p-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-indigo-800 mb-1">Açıklama</label>
                  <input 
                    type="text" 
                    value={newProduct.description || ''}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full p-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="İçerik detayları..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 text-slate-600 text-sm hover:bg-white rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button 
                  onClick={handleAddProduct}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1"
                >
                  <Save size={14} /> Kaydet
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {products.map(product => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-sm transition-shadow">
                <div>
                  <h4 className="font-bold text-slate-800">{product.name}</h4>
                  <p className="text-xs text-slate-500">{product.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-sm">
                    {product.price} TL
                  </span>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            
            {products.length === 0 && !isAddingProduct && (
              <div className="text-center py-10 text-slate-400">
                <Package size={40} className="mx-auto mb-2 opacity-20" />
                <p>Henüz ürün eklenmemiş.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard;