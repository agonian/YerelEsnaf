import React, { useState } from 'react';
import { Shield, Check, X, Search, Clock, Trash2 } from 'lucide-react';
import { Business, UserRole, User } from '../types';

interface AdminPanelProps {
  businesses: Business[];
  setBusinesses: React.Dispatch<React.SetStateAction<Business[]>>;
  currentUser: User | null;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ businesses, setBusinesses, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Protect Admin Route
  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-red-600">Yetkisiz Erişim</h2>
        <p>Bu sayfayı görüntülemek için yönetici olmalısınız.</p>
      </div>
    );
  }

  const handleStatusChange = (id: string, status: 'approved' | 'rejected') => {
    if (confirm(`İşletme durumu "${status}" olarak güncellenecek. Emin misiniz?`)) {
       setBusinesses(prev => prev.map(b => 
        b.id === id ? { ...b, status: status } : b
      ));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu işletmeyi kalıcı olarak silmek istediğinize emin misiniz?")) {
      setBusinesses(prev => prev.filter(b => b.id !== id));
    }
  };

  const togglePromotion = (id: string) => {
    setBusinesses(prev => prev.map(b => 
      b.id === id ? { ...b, isPromoted: !b.isPromoted } : b
    ));
  };

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' ? true : b.status === 'pending';
    return matchesSearch && matchesTab;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px]">
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Shield className="text-purple-600" />
              Yönetici Paneli
            </h2>
            <p className="text-slate-500">Başvuruları onaylayın ve siteyi yönetin.</p>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="İşletme ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-64"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
        </div>

        <div className="flex gap-4 border-b border-slate-100">
           <button
             onClick={() => setActiveTab('pending')}
             className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
               activeTab === 'pending' 
                 ? 'text-purple-600' 
                 : 'text-slate-500 hover:text-slate-800'
             }`}
           >
             Bekleyen Onaylar
             {businesses.filter(b => b.status === 'pending').length > 0 && (
               <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                 {businesses.filter(b => b.status === 'pending').length}
               </span>
             )}
             {activeTab === 'pending' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600"></div>}
           </button>
           <button
             onClick={() => setActiveTab('all')}
             className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
               activeTab === 'all' 
                 ? 'text-purple-600' 
                 : 'text-slate-500 hover:text-slate-800'
             }`}
           >
             Tüm İşletmeler
             {activeTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600"></div>}
           </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">İşletme Adı</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Durum</th>
              <th className="px-6 py-4 text-center">Öne Çıkar</th>
              <th className="px-6 py-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBusinesses.map(business => (
              <tr key={business.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{business.name}</div>
                  <div className="text-xs text-slate-400">{business.phone}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <span className="bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">
                    {business.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {business.status === 'approved' && (
                    <span className="inline-flex items-center text-green-700 bg-green-50 px-2 py-1 rounded text-xs font-bold border border-green-100">
                      <Check size={12} className="mr-1" /> Onaylı
                    </span>
                  )}
                  {business.status === 'pending' && (
                    <span className="inline-flex items-center text-amber-700 bg-amber-50 px-2 py-1 rounded text-xs font-bold border border-amber-100 animate-pulse">
                      <Clock size={12} className="mr-1" /> Bekliyor
                    </span>
                  )}
                  {business.status === 'rejected' && (
                    <span className="inline-flex items-center text-red-700 bg-red-50 px-2 py-1 rounded text-xs font-bold border border-red-100">
                      <X size={12} className="mr-1" /> Reddedildi
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => togglePromotion(business.id)}
                    disabled={business.status !== 'approved'}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                      business.isPromoted 
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                        : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Shield size={16} className={business.isPromoted ? 'fill-current' : ''} />
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2">
                     {business.status === 'pending' && (
                       <>
                        <button 
                          onClick={() => handleStatusChange(business.id, 'approved')}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"
                        >
                          Onayla
                        </button>
                        <button 
                          onClick={() => handleStatusChange(business.id, 'rejected')}
                          className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"
                        >
                          Reddet
                        </button>
                       </>
                     )}
                     
                     {business.status !== 'pending' && (
                       <button 
                         onClick={() => handleDelete(business.id)}
                         className="text-slate-400 hover:text-red-600 p-2"
                         title="Sil"
                       >
                         <Trash2 size={18} />
                       </button>
                     )}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredBusinesses.length === 0 && (
           <div className="p-12 text-center text-slate-500">
              {activeTab === 'pending' ? 'Bekleyen başvuru yok.' : 'Kayıt bulunamadı.'}
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
