import React from 'react';
import { MapPin, ShoppingBag, Calendar, Info, Shield } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'explore', label: 'Keşfet', icon: <MapPin size={20} /> },
    { id: 'deals', label: 'Fırsatlar', icon: <ShoppingBag size={20} /> },
    { id: 'planner', label: 'Akıllı Asistan', icon: <Calendar size={20} /> },
    { id: 'business', label: 'İşletme Ekle', icon: <Info size={20} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setView('explore')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xl">Y</span>
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">Yerel<span className="text-indigo-600">Esnaf</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-2">
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
            
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            
             <button
                onClick={() => setView('admin')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'admin'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Shield size={16} />
                <span>Yönetici</span>
              </button>
          </div>
          
          {/* Mobile Menu Icon Placeholder */}
           <div className="md:hidden flex">
            <button className="text-slate-500 hover:text-slate-900">
               <span className="sr-only">Menüyü aç</span>
               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
               </svg>
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
             <button
                onClick={() => setView('admin')}
                className={`flex flex-col items-center space-y-1 ${
                  currentView === 'admin' ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                <Shield size={20} />
                <span className="text-xs">Yönetici</span>
              </button>
      </div>
    </nav>
  );
};

export default Navbar;
