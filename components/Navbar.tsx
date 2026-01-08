import React from 'react';
import { MapPin, ShoppingBag, Calendar, Info, Shield, LogIn, User, Building2 } from 'lucide-react';
import { UserRole, User as UserType } from '../types';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  currentUser: UserType | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, currentUser, onOpenAuth, onLogout }) => {
  const navItems = [
    { id: 'explore', label: 'Keşfet', icon: <MapPin size={20} /> },
    { id: 'deals', label: 'Fırsatlar', icon: <ShoppingBag size={20} /> },
    { id: 'planner', label: 'Akıllı Asistan', icon: <Calendar size={20} /> },
  ];

  // İşletme linkini sadece herkes görebilir (başvuru için) ancak rolüne göre yönlendirme değişir
  // Admin linkini sadece admin görür

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setView('explore')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xl">Y</span>
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">Yerel<span className="text-indigo-600">Esnaf</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-200 mx-1"></div>

             {/* İşletme Butonu */}
             <button
                onClick={() => setView('business_register')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'business_register'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Building2 size={16} />
                <span>İşletme Ekle</span>
              </button>

            {/* Admin Butonu (Sadece Admin) */}
            {currentUser?.role === UserRole.ADMIN && (
               <button
                  onClick={() => setView('admin')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'admin'
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-purple-500 hover:text-purple-700'
                  }`}
                >
                  <Shield size={16} />
                  <span>Yönetici</span>
                </button>
            )}

            {/* Auth Button */}
            {currentUser ? (
              <div className="flex items-center gap-2 ml-2">
                <div className="flex flex-col items-end mr-1">
                  <span className="text-xs font-bold text-slate-700">{currentUser.name}</span>
                  <span className="text-[10px] uppercase text-slate-500 bg-slate-100 px-1 rounded">{currentUser.role === 'user' ? 'Kullanıcı' : currentUser.role}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Çıkış Yap"
                >
                  <LogIn size={18} className="rotate-180" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="ml-2 flex items-center space-x-1 px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
              >
                <User size={16} />
                <span>Giriş Yap</span>
              </button>
            )}
          </div>
          
          {/* Mobile Menu Icon Placeholder */}
           <div className="md:hidden flex">
            <button 
              onClick={currentUser ? onLogout : onOpenAuth}
              className="text-slate-500 hover:text-slate-900"
            >
               {currentUser ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold">{currentUser.name.split(' ')[0]}</span>
                    <LogIn size={20} className="rotate-180 text-red-500" />
                  </div>
               ) : (
                 <User size={24} />
               )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Bar for quick access */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-3 px-2 z-50 pb-safe">
         {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex flex-col items-center space-y-1 ${
                  currentView === item.id ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
            
            {currentUser?.role === UserRole.ADMIN ? (
               <button
                onClick={() => setView('admin')}
                className={`flex flex-col items-center space-y-1 ${
                  currentView === 'admin' ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                <Shield size={20} />
                <span className="text-xs">Admin</span>
              </button>
            ) : (
              <button
                onClick={() => setView('business_register')}
                className={`flex flex-col items-center space-y-1 ${
                  currentView === 'business_register' ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                <Building2 size={20} />
                <span className="text-xs">İşletme</span>
              </button>
            )}
      </div>
    </nav>
  );
};

export default Navbar;
