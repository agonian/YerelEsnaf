import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Phone, MessageCircle, ShoppingCart, Plus, Minus, FileText, Map, AlertCircle, Info, Landmark } from 'lucide-react';
import { Business, User } from '../types';

interface BusinessDetailProps {
  business: Business;
  currentUser: User | null;
  onBack: () => void;
}

const BusinessDetail: React.FC<BusinessDetailProps> = ({ business, currentUser, onBack }) => {
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [orderNote, setOrderNote] = useState('');
  const [address, setAddress] = useState(currentUser?.address || '');

  // Default true if undefined (backward compatibility)
  const hasDelivery = business.hasDelivery ?? true;
  const isPublicService = business.isPublicService ?? false;

  const handleAddToCart = (productId: string) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      }
      return { ...prev, [productId]: current - 1 };
    });
  };

  const calculateTotal = () => {
    return Object.entries(cart).reduce((total, [id, count]) => {
      const product = business.products.find(p => p.id === id);
      return total + (product ? product.price * (count as number) : 0);
    }, 0);
  };

  const handleWhatsAppOrder = () => {
    const items = Object.entries(cart).map(([id, count]) => {
      const product = business.products.find(p => p.id === id);
      return product ? `▪️ ${count}x ${product.name} (${product.price * (count as number)} TL)` : '';
    }).filter(Boolean);

    if (items.length === 0) return;

    const total = calculateTotal();
    
    let message = `Merhaba *${business.name}*, YerelEsnaf üzerinden sipariş vermek istiyorum:\n\n`;
    message += `${items.join('\n')}\n\n`;
    message += `*Toplam Tutar: ${total} TL*\n`;
    
    if (orderNote.trim()) {
      message += `\n📝 *Not:* ${orderNote}`;
    }
    
    if (hasDelivery) {
        if (address.trim()) {
            message += `\n📍 *Teslimat Adresi:* ${address}`;
        } else {
            message += `\n📍 *Adres:* (Lütfen konum isteyiniz)`;
        }
    } else {
        message += `\n🥡 *Teslimat Tipi:* Gel-Al (Müşteri İşletmeye Gelecek)`;
    }
    
    message += `\n\nSiparişi onaylıyor musunuz?`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${business.phone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="bg-white min-h-[calc(100vh-80px)] md:rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative pb-24 md:pb-0">
      {/* Cover Image & Header */}
      <div className="h-48 md:h-64 relative group">
        <img 
          src={business.imageUrl} 
          alt={business.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
        
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-2 rounded-full transition-colors z-10"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
             <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-indigo-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider">
                    {business.category}
                    </span>
                    {isPublicService && (
                        <span className="bg-blue-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider flex items-center gap-1">
                            <Landmark size={10} /> Kamu/Kurum
                        </span>
                    )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">{business.name}</h1>
                <div className="flex items-center gap-4 text-sm opacity-90 mt-1">
                  <div className="flex items-center text-amber-400">
                    <Star className="fill-current mr-1" size={16} />
                    <span className="font-medium text-white">{business.rating}</span>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <MapPin className="mr-1" size={16} />
                    <span>{business.address}</span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className={`grid gap-8 p-6 ${isPublicService ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
        {/* Left Column: Products OR Description if Public Service */}
        <div className={`${isPublicService ? 'max-w-4xl mx-auto w-full' : 'md:col-span-2'} space-y-8`}>
          
          {/* Main Description (More prominent for Public Services) */}
           <div className="bg-slate-50 p-6 rounded-xl space-y-3 border border-slate-100">
             <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
                 <Info size={16} />
                 {isPublicService ? 'Kurum Hakkında' : 'İşletme Hakkında'}
             </h3>
             <p className="text-slate-600 text-sm leading-relaxed">{business.description}</p>
             <div className="flex gap-2 flex-wrap pt-2">
                {business.tags.map(tag => (
                   <span key={tag} className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">#{tag}</span>
                ))}
             </div>
             {isPublicService && (
                 <div className="pt-4 mt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-4">
                     <a href={`tel:${business.phone}`} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                        <Phone size={18} />
                        Hemen Ara
                     </a>
                     <button onClick={() => alert("Harita servisi yakında eklenecek.")} className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 py-3 px-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                        <MapPin size={18} />
                        Yol Tarifi Al
                     </button>
                 </div>
             )}
          </div>

          {/* Products List - Only if NOT a Public Service */}
          {!isPublicService && (
            <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShoppingCart className="text-indigo-600" size={20} />
                Menü & Ürünler
                </h2>
                <div className="grid gap-3">
                {business.products.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-all bg-white shadow-sm">
                    <div>
                        <h3 className="font-bold text-slate-800">{product.name}</h3>
                        {product.description && <p className="text-sm text-slate-500 line-clamp-1">{product.description}</p>}
                        <span className="text-indigo-600 font-bold mt-1 block text-sm">{product.price} TL</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {cart[product.id] > 0 ? (
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm h-9">
                            <button 
                            onClick={() => handleRemoveFromCart(product.id)}
                            className="w-8 h-full flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-l-lg"
                            >
                            <Minus size={14} />
                            </button>
                            <span className="font-bold w-6 text-center text-sm">{cart[product.id]}</span>
                            <button 
                            onClick={() => handleAddToCart(product.id)}
                            className="w-8 h-full flex items-center justify-center text-indigo-600 hover:bg-indigo-50 rounded-r-lg"
                            >
                            <Plus size={14} />
                            </button>
                        </div>
                        ) : (
                        <button 
                            onClick={() => handleAddToCart(product.id)}
                            className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                        )}
                    </div>
                    </div>
                ))}
                {business.products.length === 0 && (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500 italic">Bu işletme henüz ürün listesi eklememiş.</p>
                    </div>
                )}
                </div>
            </div>
          )}
        </div>

        {/* Right Column: Contact & Cart Summary - Only if NOT a Public Service */}
        {!isPublicService && (
            <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-lg shadow-slate-200/50 sticky top-24">
                <h3 className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Sipariş Detayları</h3>
                
                {/* Delivery Warning */}
                {!hasDelivery && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex gap-2 text-xs text-amber-800 font-medium">
                        <AlertCircle size={16} className="shrink-0" />
                        <p>Bu işletmede paket servis yoktur. Sadece Gel-Al sipariş verebilirsiniz.</p>
                    </div>
                )}

                {Object.keys(cart).length > 0 ? (
                    <div className="space-y-4">
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {Object.entries(cart).map(([id, count]) => {
                        const product = business.products.find(p => p.id === id);
                        if (!product) return null;
                        return (
                            <div key={id} className="flex justify-between text-sm">
                            <span className="text-slate-600 line-clamp-1">{count}x {product.name}</span>
                            <span className="font-medium text-slate-900 whitespace-nowrap">{product.price * (count as number)} TL</span>
                            </div>
                        );
                        })}
                    </div>
                    
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Toplam Tutar</span>
                        <span className="text-xl font-bold text-indigo-600">{calculateTotal()} TL</span>
                    </div>

                    {/* Order Form Fields */}
                    <div className="space-y-3 pt-2">
                        {hasDelivery && (
                            <div>
                                <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                                    <Map size={12} /> Teslimat Adresi
                                </label>
                                <textarea 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Mahalle, sokak, bina no..."
                                    className="w-full text-sm p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-16"
                                />
                            </div>
                        )}
                        <div>
                        <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                            <FileText size={12} /> Sipariş Notu
                        </label>
                        <input 
                            type="text" 
                            value={orderNote}
                            onChange={(e) => setOrderNote(e.target.value)}
                            placeholder={hasDelivery ? "Acısız olsun, zili çalmayın vb." : "30 dk sonra gelip alacağım."}
                            className="w-full text-sm p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        </div>
                    </div>

                    <button 
                        onClick={handleWhatsAppOrder}
                        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-sm mt-2"
                    >
                        <MessageCircle size={20} />
                        {hasDelivery ? 'WhatsApp ile Sipariş' : 'Gel-Al Sipariş Oluştur'}
                    </button>
                    <p className="text-[10px] text-center text-slate-400">Sipariş detayları mesaj olarak işletmeye iletilecektir.</p>
                    </div>
                ) : (
                    <div className="text-center py-6 text-slate-400">
                    <ShoppingCart size={40} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Sepetiniz boş.</p>
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-100">
                    <a href={`tel:${business.phone}`} className="flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors p-2 hover:bg-slate-50 rounded-lg text-sm font-medium w-full border border-slate-200">
                        <Phone size={16} />
                        Telefonla Ara
                    </a>
                </div>
            </div>
            </div>
        )}
      </div>

      {/* Mobile Sticky Cart Button - Only if NOT Public Service */}
      {!isPublicService && Object.keys(cart).length > 0 && (
         <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 md:hidden z-50">
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] text-white py-3 px-4 rounded-xl font-bold shadow-lg flex items-center justify-between"
            >
               <span className="flex items-center gap-2"><MessageCircle size={20} /> Siparişi Tamamla</span>
               <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{calculateTotal()} TL</span>
            </button>
         </div>
      )}
    </div>
  );
};

export default BusinessDetail;