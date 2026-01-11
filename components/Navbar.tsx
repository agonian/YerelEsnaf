import React, { useState, useEffect } from 'react';
import { MapPin, ShoppingBag, Calendar, LogIn, User, Shield, LayoutDashboard, Briefcase, Menu, X, LogOut, ChevronRight, UserCircle, Settings, Tag, Map } from 'lucide-react';
import { UserRole, User as UserType } from '../types';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  currentUser: UserType | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  specialLogo?: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, currentUser, onOpenAuth, onLogout, specialLogo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when view changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentView]);

  const navItems = [
    { id: 'explore', label: 'Keşfet', icon: <MapPin /> },
    { id: 'deals', label: 'Fırsatlar', icon: <ShoppingBag /> },
    { id: 'classifieds', label: 'Pazar', icon: <Tag /> },
    { id: 'jobs', label: 'İş İlanı', icon: <Briefcase /> },
    { id: 'tours', label: 'Turlar', icon: <Map /> }, // Added Tours
    { id: 'planner', label: 'Asistan', icon: <Calendar /> },
  ];

  // Helper to check if the last tab (Account) should be active
  const isAccountTabActive = currentView === 'business_dashboard' || currentView === 'admin';

  const handleAccountClick = () => {
    if (!currentUser) {
      onOpenAuth();
    } else {
      setIsMenuOpen(true);
    }
  };

  return (
    <>
      {/* --- TOP HEADER (Branding) --- */}
      {/* Mobile: Sticky Top, Logo Only. Desktop: Standard Nav */}
      <nav className="sticky top-0 z-40 md:z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm h-14 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-center md:justify-between items-center h-full relative">
            
            {/* Logo & Brand - Centered on Mobile, Left on Desktop */}
            <div className="flex items-center gap-4 absolute left-4 md:static">
               <div className="flex items-center cursor-pointer group" onClick={() => setView('explore')}>
                  <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center mr-2 shadow-indigo-200 shadow-sm group-hover:scale-105 transition-transform">
                    <span className="text-white font-bold text-lg">Y</span>
                  </div>
                  <span className="font-bold text-xl text-slate-800 tracking-tight">Yerel<span className="text-indigo-600">Esnaf</span></span>
               </div>

               {/* Special Occasion Logo (Desktop Only) */}
               {specialLogo && (
                  <div className="hidden sm:block h-8 border-l border-slate-200 pl-4 ml-2">
                     <img src={specialLogo} alt="Özel Gün" className="h-full object-contain opacity-90 hover:opacity-100 transition-opacity" />
                  </div>
               )}
            </div>

            {/* Mobile Special Logo (Right Side) */}
            {specialLogo && (
               <div className="md:hidden absolute right-4">
                  <img src={specialLogo} alt="Özel Gün" className="h-6 object-contain" />
               </div>
            )}
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <div className="flex space-x-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      currentView === item.id
                        ? 'text-indigo-600 bg-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    {React.cloneElement(item.icon as React.ReactElement, { size: 16 })}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="h-5 w-px bg-slate-200 mx-2"></div>

              {/* Desktop Actions */}
              {currentUser?.role === UserRole.BUSINESS && (
                 <button
                    onClick={() => setView('business_dashboard')}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                      currentView === 'business_dashboard'
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <LayoutDashboard size={16} />
                    <span>İşletmem</span>
                  </button>
              )}

              {currentUser?.role === UserRole.ADMIN && (
                 <button
                    onClick={() => setView('admin')}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                      currentView === 'admin'
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-purple-500 hover:text-purple-700'
                    }`}
                  >
                    <Shield size={16} />
                    <span>Yönetici</span>
                  </button>
              )}

              {/* Desktop Auth */}
              {currentUser ? (
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-slate-700 leading-none">{currentUser.name}</span>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Çıkış Yap"
                  >
                    <LogIn size={16} className="rotate-180" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="ml-2 flex items-center space-x-1 px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <User size={14} />
                  <span>Giriş</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE BOTTOM NAVIGATION BAR (App Layout) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
          {/* Use flex and overflow-x-auto to handle more items without shrinking too much */}
          <div className="flex items-center h-16 overflow-x-auto no-scrollbar px-2">
            {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`flex flex-col items-center justify-center space-y-1 relative group min-w-[64px] ${
                      currentView === item.id ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  >
                    {/* Active Indicator Top Line */}
                    {currentView === item.id && (
                        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-600 rounded-b-full"></span>
                    )}
                    
                    {React.cloneElement(item.icon as React.ReactElement, { 
                        size: 20, 
                        strokeWidth: currentView === item.id ? 2.5 : 2,
                        className: "transition-transform group-active:scale-90"
                    })}
                    <span className="text-[9px] font-medium leading-none">{item.label}</span>
                  </button>
            ))}
            
            {/* Last Tab: Account / Login */}
            <button
                onClick={handleAccountClick}
                className={`flex flex-col items-center justify-center space-y-1 relative group min-w-[64px] ${
                    isAccountTabActive || isMenuOpen ? 'text-indigo-600' : 'text-slate-400'
                }`}
            >
                {/* Active Indicator */}
                {isAccountTabActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-600 rounded-b-full"></span>
                )}

                {currentUser ? (
                    <UserCircle size={20} strokeWidth={isAccountTabActive ? 2.5 : 2} className="transition-transform group-active:scale-90" />
                ) : (
                    <LogIn size={20} className="transition-transform group-active:scale-90" />
                )}
                <span className="text-[9px] font-medium leading-none">
                    {currentUser ? 'Hesabım' : 'Giriş'}
                </span>
            </button>
          </div>
      </div>

      {/* --- BOTTOM SHEET MENU (Profile & More) --- */}
      {/* Only shown if logged in. If not logged in, AuthModal handles it directly. */}
      {currentUser && (
          <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden ${
                    isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Sheet */}
            <div className={`fixed bottom-0 left-0 right-0 bg-white z-[100] rounded-t-3xl shadow-2xl transform transition-transform duration-300 md:hidden flex flex-col max-h-[85vh] ${
                isMenuOpen ? 'translate-y-0' : 'translate-y-full'
            }`}>
                {/* Drag Handle Area */}
                <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setIsMenuOpen(false)}>
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
                </div>

                <div className="p-6 overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                         <h2 className="text-xl font-bold text-slate-800">Hesabım</h2>
                         <button onClick={() => setIsMenuOpen(false)} className="bg-slate-100 p-2 rounded-full text-slate-500">
                             <X size={20} />
                         </button>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-indigo-50 rounded-2xl p-4 flex items-center gap-4 mb-6 border border-indigo-100">
                         <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold shadow-sm">
                             {currentUser.name.charAt(0)}
                         </div>
                         <div>
                             <h3 className="font-bold text-slate-900 text-lg">{currentUser.name}</h3>
                             <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide bg-white px-2 py-0.5 rounded inline-block mt-1 border border-indigo-50">
                                {currentUser.role === 'user' ? 'Bireysel Üye' : currentUser.role === 'business' ? 'İşletme Hesabı' : 'Yönetici'}
                             </p>
                         </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="space-y-3">
                         {currentUser.role === UserRole.BUSINESS && (
                             <button 
                                onClick={() => { setView('business_dashboard'); setIsMenuOpen(false); }}
                                className="w-full bg-white border border-slate-200 hover:bg-slate-50 p-4 rounded-xl flex items-center gap-4 text-left group transition-all"
                             >
                                 <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                     <LayoutDashboard size={20} />
                                 </div>
                                 <div className="flex-1">
                                     <h4 className="font-bold text-slate-800">İşletme Paneli</h4>
                                     <p className="text-xs text-slate-500">Menü, ürün ve bilgi düzenle</p>
                                 </div>
                                 <ChevronRight size={20} className="text-slate-300" />
                             </button>
                         )}

                        {currentUser.role === UserRole.ADMIN && (
                             <button 
                                onClick={() => { setView('admin'); setIsMenuOpen(false); }}
                                className="w-full bg-white border border-slate-200 hover:bg-slate-50 p-4 rounded-xl flex items-center gap-4 text-left group transition-all"
                             >
                                 <div className="bg-purple-100 text-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                     <Shield size={20} />
                                 </div>
                                 <div className="flex-1">
                                     <h4 className="font-bold text-slate-800">Yönetici Paneli</h4>
                                     <p className="text-xs text-slate-500">Tüm sistem kontrolü</p>
                                 </div>
                                 <ChevronRight size={20} className="text-slate-300" />
                             </button>
                         )}
                         
                         {/* Other Settings (Placeholder) */}
                         <button className="w-full bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4 text-left opacity-50 cursor-not-allowed">
                             <div className="bg-slate-100 text-slate-500 p-2 rounded-lg">
                                 <Settings size={20} />
                             </div>
                             <div className="flex-1">
                                 <h4 className="font-bold text-slate-800">Ayarlar</h4>
                                 <p className="text-xs text-slate-500">Profil ve uygulama ayarları</p>
                             </div>
                             <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500">Yakında</span>
                         </button>
                    </div>

                    {/* Logout Button */}
                    <button 
                        onClick={() => { onLogout(); setIsMenuOpen(false); }}
                        className="w-full mt-6 bg-red-50 text-red-600 p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                    >
                        <LogOut size={20} />
                        Çıkış Yap
                    </button>
                    
                    <div className="text-center mt-6 pb-2">
                        <p className="text-[10px] text-slate-400">Versiyon 1.0.3</p>
                    </div>
                </div>
            </div>
          </>
      )}
    </>
  );
};

export default Navbar;