import React, { useState } from 'react';
import { Shield, Check, X, Search, DollarSign } from 'lucide-react';
import { Business } from '../types';

interface AdminPanelProps {
  businesses: Business[];
  setBusinesses: React.Dispatch<React.SetStateAction<Business[]>>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ businesses, setBusinesses }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const togglePromotion = (id: string) => {
    setBusinesses(prev => prev.map(b => 
      b.id === id ? { ...b, isPromoted: !b.isPromoted } : b
    ));
  };

  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <Shield className="text-indigo-600" />
             Yönetici Paneli
           </h2>
           <p className="text-slate-500">İşletme durumlarını ve reklamları yönetin.</p>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="İşletme ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">İşletme Adı</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Ürün Sayısı</th>
              <th className="px-6 py-4 text-center">Öne Çıkar (Reklam)</th>
              <th className="px-6 py-4 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBusinesses.map(business => (
              <tr key={business.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{business.name}</td>
                <td className="px-6 py-4 text-slate-600">
                  <span className="bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">
                    {business.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{business.products.length}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => togglePromotion(business.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      business.isPromoted 
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200' 
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {business.isPromoted ? (
                      <><Check size={14} /> Aktif</>
                    ) : (
                      <><X size={14} /> Pasif</>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-indigo-600 hover:text-indigo-800 font-medium">Düzenle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredBusinesses.length === 0 && (
         <div className="p-12 text-center text-slate-500">
            Sonuç bulunamadı.
         </div>
      )}
      
      <div className="bg-slate-50 p-4 border-t border-slate-200 text-xs text-slate-500 text-center">
        * "Öne Çıkan" olarak işaretlenen işletmeler ana sayfada özel etiketle listelenir.
      </div>
    </div>
  );
};

export default AdminPanel;
