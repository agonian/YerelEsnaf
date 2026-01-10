import React from 'react';
import { Lock, Github, Twitter, Instagram } from 'lucide-react';
import { User, UserRole } from '../types';

interface FooterProps {
  onAdminLoginClick: () => void;
  currentUser: User | null;
}

const Footer: React.FC<FooterProps> = ({ onAdminLoginClick, currentUser }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12 pt-8 pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="text-center md:text-left">
          <h3 className="font-bold text-slate-900">YerelEsnaf</h3>
          <p className="text-xs text-slate-500 mt-1">© 2024 Tüm hakları saklıdır.</p>
        </div>

        <div className="flex items-center gap-4">
           <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Instagram size={20} /></a>
           <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Twitter size={20} /></a>
           <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Github size={20} /></a>
        </div>

        <div>
           {/* Gizli Yönetici Girişi - Zaten yönetici ise gösterme */}
           {currentUser?.role !== UserRole.ADMIN && (
             <button 
               onClick={onAdminLoginClick}
               className="flex items-center gap-1 text-[10px] text-slate-300 hover:text-slate-500 transition-colors"
               title="Yönetici Girişi"
             >
               <Lock size={12} /> Yönetici
             </button>
           )}
        </div>

      </div>
    </footer>
  );
};

export default Footer;