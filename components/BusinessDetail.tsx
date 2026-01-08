import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Phone, MessageCircle, ShoppingCart, Plus, Minus, Send, Share2 } from 'lucide-react';
import { Business, Product } from '../types';

interface BusinessDetailProps {
  business: Business;
  onBack: () => void;
}

const BusinessDetail: React.FC<BusinessDetailProps> = ({ business, onBack }) => {
  const [cart, setCart] = useState<{ [key: string]: number }>({});

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
    const message = `Merhaba ${business.name}, YerelEsnaf uygulamasından sipariş vermek istiyorum:\n\n${items.join('\n')}\n\n*Toplam Tutar: ${total} TL*\n\nAdresimi ve detayları paylaşabilir miyim?`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${business.phone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="bg-white min-h-[calc(100vh-80px)] md:rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative pb-24 md:pb-0">
      {/* Cover Image & Header */}
      <div className="h-64 md:h-80 relative">
        <img 
          src={business.imageUrl} 
          alt={business.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-2 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="flex justify-between items-end">
             <div>
                <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
                  {business.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{business.name}</h1>
                <div className="flex items-center gap-4 text-sm md:text-base opacity-90">
                  <div className="flex items-center">
                    <Star className="text-amber-400 fill-current mr-1" size={18} />
                    <span className="font-medium">{business.rating} / 5.0</span>
                  </div>
                  <div className="hidden md:flex items-center">
                    <MapPin className="mr-1" size={18} />
                    <span>{business.address}</span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 p-6 md:p-8">
        {/* Left Column: Products */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShoppingCart className="text-indigo-600" />
              Ürünler & Hizmetler
            </h2>
            <div className="space-y-4">
              {business.products.map(product => (
                <div key={product.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-colors">
                  <div>
                    <h3 className="font-bold text-slate-800">{product.name}</h3>
                    <p className="text-sm text-slate-500">{product.description}</p>
                    <span className="text-indigo-600 font-bold mt-1 block">{product.price} TL</span>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                    {cart[product.id] > 0 ? (
                      <>
                        <button 
                          onClick={() => handleRemoveFromCart(product.id)}
                          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold w-4 text-center">{cart[product.id]}</span>
                        <button 
                          onClick={() => handleAddToCart(product.id)}
                          className="w-8 h-8 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 rounded"
                        >
                          <Plus size={16} />
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => handleAddToCart(product.id)}
                        className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1"
                      >
                        <Plus size={16} /> Ekle
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {business.products.length === 0 && (
                <p className="text-slate-500 italic">Bu işletme henüz ürün listesi eklememiş.</p>
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl space-y-4">
             <h3 className="font-bold text-slate-900">Hakkımızda</h3>
             <p className="text-slate-600 leading-relaxed">{business.description}</p>
             <div className="flex gap-2 flex-wrap">
                {business.tags.map(tag => (
                   <span key={tag} className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">#{tag}</span>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column: Contact & Cart Summary */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">Sipariş Özeti</h3>
              
              {Object.keys(cart).length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {Object.entries(cart).map(([id, count]) => {
                      const product = business.products.find(p => p.id === id);
                      if (!product) return null;
                      return (
                        <div key={id} className="flex justify-between text-sm">
                          <span className="text-slate-600">{count}x {product.name}</span>
                          <span className="font-medium text-slate-900">{product.price * (count as number)} TL</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Toplam</span>
                    <span className="text-xl font-bold text-indigo-600">{calculateTotal()} TL</span>
                  </div>

                  <button 
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle size={20} />
                    WhatsApp ile Sipariş Ver
                  </button>
                  <p className="text-xs text-center text-slate-400">Siparişiniz WhatsApp üzerinden mesaj olarak iletilecektir.</p>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <ShoppingCart size={48} className="mx-auto mb-2 opacity-20" />
                  <p>Sepetiniz boş. Ürün ekleyerek sipariş oluşturabilirsiniz.</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                 <a href={`tel:${business.phone}`} className="flex items-center gap-3 text-slate-600 hover:text-indigo-600 transition-colors p-2 hover:bg-slate-50 rounded-lg">
                    <Phone size={20} />
                    <span className="font-medium">Hemen Ara</span>
                 </a>
                 <div className="flex items-center gap-3 text-slate-600 p-2">
                    <MapPin size={20} className="shrink-0" />
                    <span className="text-sm">{business.address}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Mobile Sticky Cart Button */}
      {Object.keys(cart).length > 0 && (
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