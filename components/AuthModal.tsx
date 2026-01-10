import React, { useState } from 'react';
import { X, User, Building2, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import { UserRole, Category, Business } from '../types';
import { ADMIN_PHONE_NUMBER } from '../constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onLogin handles both standard login and registration (which effectively logs you in)
  onLogin: (userData: any, role: UserRole, businessData?: Partial<Business>) => void;
  initialMode?: 'login' | 'register' | 'admin_login';
  initialRole?: UserRole.USER | UserRole.BUSINESS; // New prop for default selection
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, initialMode = 'login', initialRole = UserRole.USER }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'admin_login'>(initialMode);
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole.USER | UserRole.BUSINESS>(initialRole);
  
  // Business Register Specifics
  const [bizName, setBizName] = useState('');
  const [bizCategory, setBizCategory] = useState<Category>(Category.FOOD);
  const [bizPhone, setBizPhone] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  // Sync internal mode and role if props change
  React.useEffect(() => {
    if (isOpen) {
        setMode(initialMode);
        setRegRole(initialRole);
    }
  }, [initialMode, initialRole, isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ADMIN LOGIN LOGIC
    if (mode === 'admin_login') {
       // Allow both 'admin123' and 'admin' for convenience as per user request
       if (loginIdentifier === 'admin' && (loginPassword === 'admin123' || loginPassword === 'admin')) {
           onLogin({ name: 'Site Yöneticisi', id: 'admin_1' }, UserRole.ADMIN);
           onClose();
       } else {
           alert("Hatalı yönetici bilgileri. (Kullanıcı: admin / Şifre: admin)");
       }
       return;
    }

    // Standard User/Business Login
    if (loginIdentifier && loginPassword) {
       // Demo: If username contains 'isletme', log in as business owner of 'Lezzet Konağı'
       if (loginIdentifier.includes('isletme')) {
           onLogin({ name: 'İşletme Sahibi', id: 'demo_business_user' }, UserRole.BUSINESS);
       } else {
           onLogin({ name: loginIdentifier, id: `user_${Date.now()}` }, UserRole.USER);
       }
       onClose();
    } else {
        alert("Lütfen tüm alanları doldurun.");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regUsername || !regPassword) {
        alert("Lütfen temel bilgileri doldurun.");
        return;
    }

    const userId = `user_${Date.now()}`;
    const userData = {
        id: userId,
        name: regName,
        username: regUsername
    };

    if (regRole === UserRole.BUSINESS) {
        if (!bizName || !bizPhone) {
            alert("İşletme kaydı için işletme adı ve telefon zorunludur.");
            return;
        }

        const businessData: Partial<Business> = {
            id: `biz_${Date.now()}`,
            name: bizName,
            category: bizCategory,
            phone: bizPhone,
            ownerId: userId,
            status: 'pending', // IMPORTANT: Starts as pending
            description: 'Yeni işletme',
            address: '',
            imageUrl: 'https://picsum.photos/400/300',
            rating: 0,
            tags: [],
            products: []
        };

        // Trigger WhatsApp Message for approval
        const waMessage = `Merhaba, yeni işletme kaydı oluşturdum.%0A%0A*Kullanıcı:* ${regName}%0A*İşletme:* ${bizName}%0A*Kategori:* ${bizCategory}%0A*Tel:* ${bizPhone}%0A%0AOnayınızı bekliyorum.`;
        window.open(`https://wa.me/${ADMIN_PHONE_NUMBER}?text=${waMessage}`, '_blank');

        onLogin(userData, UserRole.BUSINESS, businessData);
        alert("Kayıt başarılı! İşletme onayı için WhatsApp mesajı oluşturuldu.");

    } else {
        onLogin(userData, UserRole.USER);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
             {mode === 'login' ? 'Giriş Yap' : mode === 'register' ? 'Hesap Oluştur' : 'Yönetici Girişi'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-full p-1 hover:bg-slate-200">
            <X size={20} />
          </button>
        </div>

        {/* Tabs (Only for User/Business) */}
        {mode !== 'admin_login' && (
            <div className="flex p-1 mx-4 mt-4 bg-slate-100 rounded-xl">
                <button 
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Giriş Yap
                </button>
                <button 
                  onClick={() => setMode('register')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Kayıt Ol
                </button>
            </div>
        )}

        <div className="p-6 overflow-y-auto custom-scrollbar">
           
           {/* LOGIN FORM */}
           {(mode === 'login' || mode === 'admin_login') && (
               <form onSubmit={handleLoginSubmit} className="space-y-4">
                   {mode === 'admin_login' && (
                       <div className="bg-purple-50 text-purple-700 p-3 rounded-xl text-sm flex items-center gap-2 mb-2">
                           <Shield size={16} />
                           Güvenli Yönetici Paneli Girişi
                       </div>
                   )}

                   <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kullanıcı Adı / E-posta</label>
                       <input 
                         type="text" 
                         value={loginIdentifier}
                         onChange={(e) => setLoginIdentifier(e.target.value)}
                         className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                         placeholder={mode === 'admin_login' ? 'admin' : 'kullanici_adi'}
                       />
                   </div>
                   <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Şifre</label>
                       <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                placeholder="••••••"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                       </div>
                   </div>

                   <button type="submit" className={`w-full py-3.5 rounded-xl text-white font-bold shadow-lg transition-transform active:scale-95 ${mode === 'admin_login' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'}`}>
                       Giriş Yap
                   </button>
                   
                   {mode === 'login' && (
                       <p className="text-center text-xs text-slate-400 mt-2">
                           Demo Hesap: <span className="font-mono text-slate-600">isletme</span> (İşletme)
                       </p>
                   )}
               </form>
           )}

           {/* REGISTER FORM */}
           {mode === 'register' && (
               <form onSubmit={handleRegisterSubmit} className="space-y-4">
                   {/* Role Selection */}
                   <div className="grid grid-cols-2 gap-3 mb-4">
                       <button
                         type="button"
                         onClick={() => setRegRole(UserRole.USER)}
                         className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${regRole === UserRole.USER ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                       >
                           <User size={24} />
                           <span className="text-xs font-bold">Bireysel</span>
                       </button>
                       <button
                         type="button"
                         onClick={() => setRegRole(UserRole.BUSINESS)}
                         className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${regRole === UserRole.BUSINESS ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                       >
                           <Building2 size={24} />
                           <span className="text-xs font-bold">Kurumsal</span>
                       </button>
                   </div>

                   <div className="space-y-3">
                       <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1">Hesap Bilgileri</h3>
                       <input 
                         type="text" 
                         value={regName}
                         onChange={(e) => setRegName(e.target.value)}
                         className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                         placeholder="Ad Soyad"
                       />
                       <input 
                         type="text" 
                         value={regUsername}
                         onChange={(e) => setRegUsername(e.target.value)}
                         className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                         placeholder="Kullanıcı Adı"
                       />
                       <input 
                         type="password" 
                         value={regPassword}
                         onChange={(e) => setRegPassword(e.target.value)}
                         className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                         placeholder="Şifre"
                       />
                   </div>

                   {/* Business Specific Fields */}
                   {regRole === UserRole.BUSINESS && (
                       <div className="space-y-3 pt-2 animate-in slide-in-from-bottom-2">
                           <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1">İşletme Detayları</h3>
                           <input 
                                type="text" 
                                value={bizName}
                                onChange={(e) => setBizName(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                placeholder="İşletme Adı"
                           />
                           <select 
                                value={bizCategory}
                                onChange={(e) => setBizCategory(e.target.value as Category)}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
                           >
                                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                           <input 
                                type="tel" 
                                value={bizPhone}
                                onChange={(e) => setBizPhone(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                placeholder="İşletme Telefonu"
                           />
                           <div className="bg-amber-50 p-3 rounded-lg text-xs text-amber-800 border border-amber-100">
                                Kayıt sonrası işletmeniz <b>Onay Bekliyor</b> statüsünde açılacaktır. WhatsApp üzerinden onay aldıktan sonra paneline erişebilirsiniz.
                           </div>
                       </div>
                   )}

                   <button type="submit" className="w-full py-3.5 rounded-xl text-white font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-transform active:scale-95 flex items-center justify-center gap-2">
                       {regRole === UserRole.BUSINESS ? 'Kayıt Ol ve Onaya Gönder' : 'Kayıt Ol'} <ArrowRight size={18} />
                   </button>
               </form>
           )}

        </div>
      </div>
    </div>
  );
};

export default AuthModal;