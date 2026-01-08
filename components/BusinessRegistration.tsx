import React, { useState } from 'react';
import { Send, Building2, User, Phone, MapPin, Info } from 'lucide-react';
import { Category, Business, UserRole, User as UserType } from '../types';
import { ADMIN_PHONE_NUMBER } from '../constants';

interface BusinessRegistrationProps {
  currentUser: UserType | null;
  onRegister: (business: Business) => void;
  onOpenAuth: () => void;
}

const BusinessRegistration: React.FC<BusinessRegistrationProps> = ({ currentUser, onRegister, onOpenAuth }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: Category.FOOD,
    description: '',
    address: '',
    phone: '',
  });

  if (!currentUser || (currentUser.role !== UserRole.BUSINESS && currentUser.role !== UserRole.ADMIN)) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
          <Building2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">İşletmenizi Eklemek İçin Giriş Yapın</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          YerelEsnaf'ta işletmenizi listelemek için "İşletme" hesabıyla giriş yapmanız gerekmektedir.
        </p>
        <button 
          onClick={onOpenAuth}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-colors"
        >
          Giriş Yap / Kayıt Ol
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new business object
    const newBusiness: Business = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      description: formData.description,
      address: formData.address,
      phone: formData.phone.replace(/[^0-9]/g, ''),
      imageUrl: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 100)}`,
      rating: 0,
      tags: [],
      products: [],
      status: 'pending', // Important
      ownerId: currentUser.id
    };

    onRegister(newBusiness);

    // Prepare WhatsApp Message for Admin
    const waMessage = `Merhaba, yeni bir işletme başvurusu yaptım.%0A%0A*İşletme Adı:* ${formData.name}%0A*Kategori:* ${formData.category}%0A*Yetkili:* ${currentUser.name}%0A%0AOnay ve ödeme süreci için bilgi bekliyorum.`;
    window.open(`https://wa.me/${ADMIN_PHONE_NUMBER}?text=${waMessage}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="mb-8 border-b border-slate-100 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="text-indigo-600" />
            İşletme Başvuru Formu
          </h2>
          <p className="text-slate-500 mt-1">
            Bilgilerinizi doldurun ve yönetici onayına gönderin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Building2 size={16} /> İşletme Adı
            </label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Örn: Paşa Döner"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Kategori</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {Object.values(Category).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Phone size={16} /> Telefon (WhatsApp)
              </label>
              <input 
                type="tel" 
                required
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="90555..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <MapPin size={16} /> Adres
            </label>
            <textarea 
              required
              rows={2}
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Mahalle, Cadde, No..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Info size={16} /> Hakkında
            </label>
            <textarea 
              required
              rows={4}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="İşletmenizi tanıtan kısa bir yazı..."
            />
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3 text-sm text-indigo-800">
            <Info className="shrink-0 mt-0.5" size={18} />
            <p>
              "Başvuruyu Tamamla" butonuna bastığınızda WhatsApp açılacak ve yöneticiye otomatik bir mesaj gönderilecektir. Ödeme onayı sonrası işletmeniz yayınlanacaktır.
            </p>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-green-100 flex items-center justify-center gap-2"
          >
            <Send size={20} />
            Başvuruyu Tamamla ve WhatsApp'a Git
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessRegistration;
