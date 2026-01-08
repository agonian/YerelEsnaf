import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import BusinessCard from './components/BusinessCard';
import AIPlanner from './components/AIPlanner';
import AdminPanel from './components/AdminPanel';
import BusinessDetail from './components/BusinessDetail';
import AuthModal from './components/AuthModal';
import BusinessRegistration from './components/BusinessRegistration';
import BusinessDashboard from './components/BusinessDashboard';
import { MOCK_BUSINESSES } from './constants';
import { Category, Business, User, UserRole } from './types';
import { Search, Filter, Rocket, Wallet, Lock, Sun, Moon, Coffee, Megaphone, Info } from 'lucide-react';

// --- Ad Placeholder Component ---
const AdPlaceholder: React.FC<{ 
  size: 'banner' | 'sidebar' | 'box', 
  label?: string,
  className?: string 
}> = ({ size, label, className = '' }) => {
  const heightClass = size === 'banner' ? 'h-24' : size === 'sidebar' ? 'h-[600px]' : 'h-64';
  
  return (
    <div className={`bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 p-4 relative overflow-hidden group ${heightClass} ${className}`}>
       <div className="absolute inset-0 bg-slate-200/50 -skew-x-12 -translate-x-full group-hover:animate-shimmer" />
       <span className="text-xs uppercase font-bold tracking-widest mb-1 z-10">Reklam Alanı</span>
       {label && <span className="text-[10px] text-slate-500 z-10">{label}</span>}
       <div className="absolute bottom-2 right-2 z-10">
         <Info size={12} className="opacity-50" />
       </div>
    </div>
  );
};

function App() {
  const [currentView, setView] = useState('explore'); 
  const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Time of Day Logic
  const currentHour = new Date().getHours();
  const timeContext = currentHour < 11 ? 'morning' : currentHour < 17 ? 'lunch' : 'dinner';
  
  // Load user from local storage (mock persistence)
  useEffect(() => {
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    // Check for expired promotions on load (Simple simulation)
    const now = new Date();
    setBusinesses(prev => prev.map(b => {
      if (b.promotedUntil && new Date(b.promotedUntil) < now) {
        return { ...b, isPromoted: false, promotedUntil: undefined };
      }
      return b;
    }));

  }, []);

  const handleLogin = (name: string, role: UserRole, id?: string) => {
    const userId = id || Date.now().toString();
    const user: User = {
      id: userId,
      name,
      role,
      address: 'Örnek Mah. Çınar Sok. No:5' // Mock Address
    };
    setCurrentUser(user);
    localStorage.setItem('mockUser', JSON.stringify(user));
    
    // Redirect logic based on role
    if (role === UserRole.ADMIN) {
      setView('admin');
    } else if (role === UserRole.BUSINESS) {
      const userBiz = businesses.find(b => b.ownerId === userId);
      
      if (userBiz) {
         setSelectedBusiness(userBiz);
         setView('business_dashboard');
      } else {
         setView('business_register');
      }
    } else {
      setView('explore');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mockUser');
    setView('explore');
  };

  const handleRegisterBusiness = (newBusiness: Business) => {
    // Ensure the new business has the current user's ID
    if (currentUser) {
        newBusiness.ownerId = currentUser.id;
    }
    setBusinesses(prev => [newBusiness, ...prev]);
    alert("Başvurunuz alındı! Yönetim paneline yönlendiriliyorsunuz...");
    
    // Immediately set selected business and view
    setSelectedBusiness(newBusiness);
    setView('business_dashboard');
  };

  const handleBusinessClick = (business: Business) => {
    setSelectedBusiness(business);
    setView('detail');
    window.scrollTo(0, 0);
  };

  const handleBackToExplore = () => {
    setSelectedBusiness(null);
    setView('explore');
  };

  const handleSetView = (view: string) => {
    if (view === 'admin' && currentUser?.role !== UserRole.ADMIN) {
      setIsAuthModalOpen(true);
      return;
    }
    // Business dashboard check
    if (view === 'business_dashboard') {
       if (!currentUser || currentUser.role !== UserRole.BUSINESS) {
         setIsAuthModalOpen(true);
         return;
       }
       // Find user's business
       const userBiz = businesses.find(b => b.ownerId === currentUser.id);
       if (userBiz) {
         setSelectedBusiness(userBiz);
       } else {
         // If they have the role but no business, send to register
         setView('business_register');
         return;
       }
    }

    setView(view);
    if (view !== 'detail' && view !== 'business_dashboard') {
      setSelectedBusiness(null);
    }
  };

  const handleBusinessUpdate = (updated: Business) => {
    setBusinesses(prev => prev.map(b => b.id === updated.id ? updated : b));
    setSelectedBusiness(updated);
  };

  // Promoted Businesses (Showcase)
  const promotedBusinesses = useMemo(() => {
    return businesses.filter(b => b.status === 'approved' && b.isPromoted);
  }, [businesses]);

  // Filtering Logic
  const filteredBusinesses = useMemo(() => {
    let result = businesses.filter((business) => {
      // Admin sees everything in admin panel
      if (currentView === 'explore' || currentView === 'deals' || currentView === 'planner') {
         if (business.status !== 'approved') return false;
      }

      const matchesCategory = selectedCategory === 'All' || business.category === selectedCategory;
      const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            business.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (currentView === 'deals') {
        return matchesCategory && matchesSearch && !!business.offer;
      }
      
      return matchesCategory && matchesSearch;
    });

    // Sort: Promoted first
    return result.sort((a, b) => (a.isPromoted === b.isPromoted) ? 0 : a.isPromoted ? -1 : 1);
  }, [selectedCategory, searchQuery, currentView, businesses]);

  // Smart Suggestions Logic
  const suggestedBusinesses = useMemo(() => {
     // First, filter only active businesses
     const activeBusinesses = businesses.filter(b => b.status === 'approved');

     if (timeContext === 'morning') return activeBusinesses.filter(b => b.tags.includes('kahvaltı') || b.category === Category.FOOD);
     if (timeContext === 'lunch') return activeBusinesses.filter(b => b.tags.includes('döner') || b.tags.includes('burger') || b.tags.includes('ev yemeği'));
     return activeBusinesses.filter(b => b.category === Category.FOOD && (b.tags.includes('ocakbaşı') || b.tags.includes('akşam')));
  }, [businesses, timeContext]);

  const categories = Object.values(Category);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar 
        currentView={currentView} 
        setView={handleSetView} 
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={handleLogin} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW: EXPLORE & DEALS */}
        {(currentView === 'explore' || currentView === 'deals') && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* New Minimal Hero */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden h-48 md:h-56 flex flex-col justify-center">
               <div className="absolute right-0 top-0 h-full w-1/2 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
               <div className="relative z-10 max-w-xl">
                 <h1 className="text-2xl md:text-3xl font-bold mb-2">
                   {currentView === 'deals' ? '🔥 Günün Fırsatları' : `👋 Merhaba ${currentUser?.name.split(' ')[0] || 'Misafir'},`}
                 </h1>
                 <p className="text-indigo-100 text-sm md:text-base mb-6 opacity-90">
                   {currentView === 'deals' ? 'Bütçe dostu kampanyaları kaçırma.' : 'Bugün ilçede ne keşfetmek istersin?'}
                 </p>
                 <div className="relative max-w-md">
                    <input
                      type="text"
                      placeholder="Ne arıyorsun? (Kebap, Kuaför, Tamirci...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-slate-900 focus:outline-none shadow-xl border-0 text-sm"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 </div>
               </div>
            </div>

            {/* AD SECTION 1: PREMIUM LOCAL SHOWCASE (VİTRİN) */}
            {currentView === 'explore' && promotedBusinesses.length > 0 && (
              <div className="relative">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="bg-amber-100 p-1.5 rounded-lg">
                      <Megaphone size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 leading-none">Vitrin</h3>
                      <p className="text-xs text-slate-500">İlçemizin öne çıkan işletmeleri</p>
                    </div>
                 </div>
                 
                 {/* Horizontal Scroll Container */}
                 <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 scroll-smooth no-scrollbar snap-x">
                    {promotedBusinesses.map(business => (
                       <div key={business.id} className="min-w-[280px] md:min-w-[320px] snap-center">
                          <BusinessCard 
                            business={business} 
                            onClick={handleBusinessClick}
                          />
                       </div>
                    ))}
                    {/* "Place Ad" Card for Showcase */}
                    <div className="min-w-[200px] flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-white border-2 border-dashed border-slate-300 rounded-xl p-6 text-center group cursor-pointer hover:border-indigo-400 transition-colors">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
                           <Rocket size={24} />
                        </div>
                        <h4 className="font-bold text-slate-700 text-sm mb-1">Burada Yer Alın</h4>
                        <p className="text-xs text-slate-500 mb-3">İşletmenizi binlerce kişiye gösterin.</p>
                        <button onClick={() => alert("İletişim: reklam@yeresnaf.com")} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">Bilgi Al</button>
                    </div>
                 </div>
              </div>
            )}

            {/* AD SECTION 2: GOOGLE ADS BANNER (Horizontal) */}
            <AdPlaceholder size="banner" label="Google Ads (728x90) - Kampanya Alanı" />

            {/* MAIN CONTENT LAYOUT WITH SIDEBAR */}
            <div className="flex flex-col lg:flex-row gap-8">
               
               {/* LEFT COLUMN: Main Grid & Filters */}
               <div className="flex-1">
                  
                  {/* Smart Suggestions */}
                  {currentView === 'explore' && !searchQuery && (
                    <div className="mb-6">
                       <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold">
                          {timeContext === 'morning' && <Sun className="text-amber-500" size={20} />}
                          {timeContext === 'lunch' && <Coffee className="text-orange-500" size={20} />}
                          {timeContext === 'dinner' && <Moon className="text-indigo-500" size={20} />}
                          <span>
                            {timeContext === 'morning' ? 'Güne Güzel Başla' : timeContext === 'lunch' ? 'Öğle Arası Önerileri' : 'Akşam Keyfi'}
                          </span>
                       </div>
                       <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                          {suggestedBusinesses.slice(0, 5).map(b => (
                             <div key={b.id} onClick={() => handleBusinessClick(b)} className="min-w-[140px] md:min-w-[160px] bg-white p-2 rounded-xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-all">
                                <img src={b.imageUrl} className="w-full h-24 object-cover rounded-lg mb-2" alt={b.name} />
                                <h4 className="font-bold text-sm truncate">{b.name}</h4>
                                <span className="text-[10px] text-slate-500">{b.category}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                  )}

                  {/* Filters */}
                  <div className="flex flex-wrap items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap border ${
                        selectedCategory === 'All'
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      Tümü
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap border ${
                          selectedCategory === cat
                            ? 'bg-slate-800 text-white border-slate-800'
                            : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Results Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                    {filteredBusinesses.length > 0 ? (
                      filteredBusinesses.map((business) => (
                        <BusinessCard 
                          key={business.id} 
                          business={business} 
                          onClick={handleBusinessClick}
                        />
                      ))
                    ) : (
                      <div className="col-span-full py-20 text-center">
                        <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
                          <Search size={40} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">Sonuç bulunamadı</h3>
                        <p className="text-slate-500">Aramanızı veya filtrelerinizi değiştirmeyi deneyin.</p>
                      </div>
                    )}
                  </div>
               </div>

               {/* RIGHT COLUMN: Sidebar Ads (Desktop Only) */}
               <div className="hidden lg:flex flex-col w-72 space-y-6 shrink-0">
                  {/* AD SECTION 3: SIDEBAR ADS */}
                  <AdPlaceholder size="box" label="Sponsorlu (250x250)" />
                  
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                     <h4 className="font-bold text-slate-900 mb-3 text-sm">Popüler Kategoriler</h4>
                     <div className="space-y-2">
                        {categories.slice(0,5).map(cat => (
                           <div key={cat} onClick={() => setSelectedCategory(cat)} className="flex items-center justify-between text-xs text-slate-600 hover:text-indigo-600 cursor-pointer p-2 hover:bg-slate-50 rounded transition-colors">
                              <span>{cat}</span>
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{businesses.filter(b => b.category === cat).length}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <AdPlaceholder size="sidebar" label="Google Ads (300x600)" />
               </div>

            </div>
          </div>
        )}

        {/* VIEW: BUSINESS DETAIL */}
        {currentView === 'detail' && selectedBusiness && (
          <BusinessDetail business={selectedBusiness} currentUser={currentUser} onBack={handleBackToExplore} />
        )}

        {/* VIEW: BUSINESS DASHBOARD (Self Management) */}
        {currentView === 'business_dashboard' && selectedBusiness && (
           <BusinessDashboard business={selectedBusiness} onUpdateBusiness={handleBusinessUpdate} />
        )}

        {/* VIEW: ADMIN PANEL */}
        {currentView === 'admin' && (
          <AdminPanel 
            businesses={businesses} 
            setBusinesses={setBusinesses} 
            currentUser={currentUser}
            onAddBusiness={() => setView('business_register')}
          />
        )}

        {/* VIEW: BUSINESS REGISTRATION */}
        {currentView === 'business_register' && (
          <BusinessRegistration 
            currentUser={currentUser} 
            onRegister={handleRegisterBusiness}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* VIEW: PLANNER */}
        {currentView === 'planner' && (
          <AIPlanner businesses={businesses.filter(b => b.status === 'approved')} />
        )}

      </main>
    </div>
  );
}

export default App;
