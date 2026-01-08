import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import BusinessCard from './components/BusinessCard';
import AIPlanner from './components/AIPlanner';
import AdminPanel from './components/AdminPanel';
import BusinessDetail from './components/BusinessDetail';
import AuthModal from './components/AuthModal';
import BusinessRegistration from './components/BusinessRegistration';
import { MOCK_BUSINESSES } from './constants';
import { Category, Business, User, UserRole } from './types';
import { Search, Filter, Rocket, Wallet, Lock } from 'lucide-react';

function App() {
  const [currentView, setView] = useState('explore'); 
  const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load user from local storage (mock persistence)
  useEffect(() => {
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (name: string, role: UserRole) => {
    const user: User = {
      id: Date.now().toString(),
      name,
      role
    };
    setCurrentUser(user);
    localStorage.setItem('mockUser', JSON.stringify(user));
    
    // Redirect logic based on role
    if (role === UserRole.ADMIN) {
      setView('admin');
    } else if (role === UserRole.BUSINESS) {
      setView('business_register');
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
    setBusinesses(prev => [newBusiness, ...prev]);
    alert("Başvurunuz alındı! Yönlendiriliyorsunuz...");
    setView('explore'); // Or show a success page
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
    // Basic Route Protection
    if (view === 'admin' && currentUser?.role !== UserRole.ADMIN) {
      setIsAuthModalOpen(true);
      return;
    }
    setView(view);
    if (view !== 'detail') {
      setSelectedBusiness(null);
    }
  };

  // Filtering Logic
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      // Admin sees everything in admin panel, but 'explore' only shows approved
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
  }, [selectedCategory, searchQuery, currentView, businesses]);

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW: EXPLORE & DEALS */}
        {(currentView === 'explore' || currentView === 'deals') && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="bg-indigo-600 rounded-2xl p-8 md:p-12 text-white shadow-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 max-w-2xl">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  {currentView === 'deals' ? 'Günün Fırsatlarını Yakala' : 'İlçenizi Yeniden Keşfedin'}
                </h1>
                <p className="text-indigo-100 text-lg mb-8">
                  {currentView === 'deals' 
                    ? 'En sevdiğiniz restoranlarda ve mağazalarda size özel indirimler.' 
                    : 'Aradığınız tüm yerel işletmeler, ustalar ve hizmetler tek bir yerde.'}
                </p>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="İşletme, yemek veya hizmet ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-400/50 shadow-lg"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 pb-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center text-slate-500 mr-2">
                 <Filter size={18} className="mr-1" />
                 <span className="text-sm font-medium">Filtrele:</span>
              </div>
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === 'All'
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Tümü
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-slate-800 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
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
        )}

        {/* VIEW: BUSINESS DETAIL */}
        {currentView === 'detail' && selectedBusiness && (
          <BusinessDetail business={selectedBusiness} onBack={handleBackToExplore} />
        )}

        {/* VIEW: ADMIN PANEL */}
        {currentView === 'admin' && (
          <AdminPanel 
            businesses={businesses} 
            setBusinesses={setBusinesses} 
            currentUser={currentUser}
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
