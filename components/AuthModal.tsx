import React, { useState } from 'react';
import { X, User, Shield, Building2 } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string, role: UserRole, id?: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // For demo purposes: If Business role is selected, assign the ID that matches the mock business
      const userId = role === UserRole.BUSINESS ? 'demo_business_user' : Date.now().toString();
      onLogin(name, role, userId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Giriş Yap / Kayıt Ol</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Adınız Soyadınız</label>
             <input 
               type="text" 
               required
               value={name}
               onChange={(e) => setName(e.target.value)}
               className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
               placeholder="Örn: Ahmet Yılmaz"
             />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Giriş Rolü Seçin (Demo)</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole(UserRole.USER)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  role === UserRole.USER 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <User size={24} className="mb-1" />
                <span className="text-xs font-bold">Kullanıcı</span>
              </button>

              <button
                type="button"
                onClick={() => setRole(UserRole.BUSINESS)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  role === UserRole.BUSINESS 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Building2 size={24} className="mb-1" />
                <span className="text-xs font-bold">İşletme</span>
              </button>

              <button
                type="button"
                onClick={() => setRole(UserRole.ADMIN)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  role === UserRole.ADMIN 
                    ? 'bg-purple-50 border-purple-200 text-purple-700' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Shield size={24} className="mb-1" />
                <span className="text-xs font-bold">Yönetici</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              *Normalde şifre istenir. Bu bir demosu olduğu için rol seçerek giriş yapabilirsiniz.
            </p>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-slate-200"
          >
            Devam Et
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
