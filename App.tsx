import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import BusinessCard from './components/BusinessCard';
import AIPlanner from './components/AIPlanner';
import AdminPanel from './components/AdminPanel';
import BusinessDetail from './components/BusinessDetail';
import AuthModal from './components/AuthModal';
import BusinessRegistration from './components/BusinessRegistration'; // Kept as component but not main nav
import BusinessDashboard from './components/BusinessDashboard';
import JobBoard from './components/JobBoard';
import Footer from './components/Footer';
import { MOCK_BUSINESSES, MOCK_JOBS } from './constants';
import { Category, Business, User, UserRole, JobPosting } from './types';
import { Search, Filter, Rocket, Wallet, Lock, Sun, Moon, Coffee, Megaphone, Info, Building2, ArrowRight } from 'lucide-react';

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
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(MOCK_JOBS);

  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'admin_login'>('login');
  const [authInitialRole, setAuthInitialRole] = useState<UserRole.USER | UserRole.BUSINESS>(UserRole.USER);

  // Admin Managed State
  const [specialLogo, setSpecialLogo] = useState<string | undefined>('https://cdn-icons-png.flaticon.com/512/744/744922.png'); 
  // Custom Background Image for Hero - Admin customizable state
  const [heroImage, setHeroImage] = useState<string>('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80');
  // Admin Profile Settings
  const [adminProfileName, setAdminProfileName] = useState('Site Yöneticisi');

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

  const handleLogin = (userData: any, role: UserRole, businessData?: Partial<Business>) => {
    let user: User = {
      id: userData.id,
      name: userData.name,
      role: role,
      address: 'Örnek Mah. Çınar Sok. No:5' // Mock Address
    };
    
    // Use dynamic admin name if logging in as admin
    if (role === UserRole.ADMIN) {
        user.name = adminProfileName;
    }

    setCurrentUser(user);
    localStorage.setItem('mockUser', JSON.stringify(user));
    
    // Scroll to top on login
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // If a new business was created during registration, add it to state
    if (businessData && role === UserRole.BUSINESS) {
        setBusinesses(prev => [businessData as Business, ...prev]);
    }
    
    // Redirect logic based on role
    if (role === UserRole.ADMIN) {
      setView('admin');
    } else if (role === UserRole.BUSINESS) {
      const userBiz = businessData as Business || businesses.find(b => b.ownerId === user.id);
      
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
    window.scrollTo(0,0);
  };

  const handleRegisterBusinessLegacy = (newBusiness: Business) => {
    if (currentUser) {
        newBusiness.ownerId = currentUser.id;
    }
    setBusinesses(prev => [newBusiness, ...prev]);
    alert("Başvurunuz alındı! Yönetim paneline yönlendiriliyorsunuz...");
    setSelectedBusiness(newBusiness);
    setView('business_dashboard');
    window.scrollTo(0,0);
  };

  // JOB HANDLERS
  const handleAddJob = (newJob: JobPosting) => {
     if (currentUser?.role === UserRole.ADMIN) {
        newJob.status = 'approved';
     }
     setJobPostings(prev => [newJob, ...prev]);
     alert("İlanınız başarıyla oluşturuldu! Yönetici onayından sonra yayınlanacaktır.");
  };

  const handleUpdateJob = (updatedJob: JobPosting) => {
    setJobPostings(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
    // If admin is updating, no alert needed usually, but for user feedback:
    if (currentUser?.role !== UserRole.ADMIN) {
        alert("İlanınız güncellendi.");
    }
  };

  const handleDeleteJob = (jobId: string) => {
      setJobPostings(prev => prev.filter(j => j.id !== jobId));
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
    // Reset scroll when changing views
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'admin' && currentUser?.role !== UserRole.ADMIN) {
      setAuthMode('admin_login');
      setIsAuthModalOpen(true);
      return;
    }
    if (view === 'business_dashboard') {
       if (!currentUser || currentUser.role !== UserRole.BUSINESS) {
         setAuthMode('login');
         setIsAuthModalOpen(true);
         return;
       }
       const userBiz = businesses.find(b => b.ownerId === currentUser.id);
       if (userBiz) {
         setSelectedBusiness(userBiz);
       } else {
         setView('explore'); 
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

  const handleRateBusiness = (businessId: string, newRating: number) => {
    setBusinesses(prev => prev.map(b => {
      if (b.id === businessId) {
        const currentRating = b.rating;
        const averagedRating = Number(((currentRating * 10 + newRating) / 11).toFixed(1));
        const finalBusiness = { ...b, rating: averagedRating };
        if (selectedBusiness?.id === businessId) {
            setSelectedBusiness(finalBusiness);
        }
        return finalBusiness;
      }
      return b;
    }));
  };

  const handleUpdateAdminProfile = (newName: string) => {
      setAdminProfileName(newName);
      if (currentUser && currentUser.role === UserRole.ADMIN) {
          const updatedUser = { ...currentUser, name: newName };
          setCurrentUser(updatedUser);
          localStorage.setItem('mockUser', JSON.stringify(updatedUser));
      }
  };

  const promotedBusinesses = useMemo(() => {
    return businesses.filter(b => b.status === 'approved' && b.isPromoted);
  }, [businesses]);

  const filteredBusinesses = useMemo(() => {
    let result = businesses.filter((business) => {
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

    return result.sort((a, b) => (a.isPromoted === b.isPromoted) ? 0 : a.isPromoted ? -1 : 1);
  }, [selectedCategory, searchQuery, currentView, businesses]);

  const categories = Object.values(Category);

  return (
    // Removed pb-16 from here, padding handled in Footer
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col transition-all">
      <Navbar 
        currentView={currentView} 
        setView={handleSetView} 
        currentUser={currentUser}
        onOpenAuth={() => {
            setAuthInitialRole(UserRole.USER); // Reset to User default for navbar clicks
            setAuthMode('login');
            setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        specialLogo={specialLogo}
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={handleLogin}
        initialMode={authMode}
        initialRole={authInitialRole}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow w-full">
        
        {/* VIEW: EXPLORE & DEALS */}
        {(currentView === 'explore' || currentView === 'deals') && (
          <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* Minimal Customizable Hero Section */}
            <div className="relative rounded-2xl overflow-hidden shadow-md h-36 md:h-40 flex items-center group">
               {/* Background Image - Admin Customizable */}
               <div className="absolute inset-0">
                   <img 
                      src={heroImage} 
                      alt="Şehir Arkaplan" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
               </div>

               {/* Minimal Content Layout */}
               <div className="relative z-10 w-full px-6 md:px-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-white">
                      <h1 className="text-xl md:text-2xl font-bold mb-1">
                          Merhaba, <span className="text-indigo-300">{currentUser?.name.split(' ')[0] || 'Misafir'}</span>
                      </h1>
                      <p className="text-xs md:text-sm text-slate-300 opacity-90">
                          {currentView === 'deals' ? 'Bugünün fırsatlarını kaçırma.' : 'Bugün nereyi keşfetmek istersin?'}
                      </p>
                  </div>

                  <div className="w-full md:w-96 relative">
                     <input
                       type="text"
                       placeholder="Ne arıyorsun? (Kebap, Çiçek, Tamir...)"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-slate-300 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-indigo-400 transition-all text-sm"
                     />
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  </div>
               </div>
            </div>

            {/* AD SECTION 1: PREMIUM LOCAL SHOWCASE (VİTRİN) */}
            {currentView === 'explore' && promotedBusinesses.length > 0 && (
              <div className="relative mt-6">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="bg-amber-100 p-1.5 rounded-lg">
                      <Megaphone size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 leading-none">Vitrin</h3>
                      <p className="text-xs text-slate-500">İlçemizin öne çıkan işletmeleri</p>
                    </div>
                 </div>
                 
                 {/* Horizontal Scroll Container - Aligned with parent padding */}
                 <div className="flex gap-4 overflow-x-auto pb-6 scroll-smooth no-scrollbar snap-x">
                    {promotedBusinesses.map(business => (
                       <div key={business.id} className="w-72 md:w-80 flex-none snap-center">
                          <BusinessCard 
                            business={business} 
                            onClick={handleBusinessClick}
                          />
                       </div>
                    ))}
                    {/* "Place Ad" Card for Showcase */}
                    <div className="w-72 md:w-80 flex-none flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-white border-2 border-dashed border-slate-300 rounded-xl p-6 text-center group cursor-pointer hover:border-indigo-400 transition-colors">
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

            {/* CTA BANNER: Join as Business */}
            {(!currentUser || currentUser.role !== UserRole.BUSINESS) && currentView === 'explore' && (
                <div className="bg-slate-900 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full filter blur-[80px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10 text-center md:text-left">
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Esnaf mısınız?</h3>
                        <p className="text-slate-300 text-xs md:text-sm max-w-lg">
                            İşletmenizi hemen ekleyin, dijital dünyada yerinizi alın.
                        </p>
                    </div>
                    <button 
                        onClick={() => {
                            setAuthInitialRole(UserRole.BUSINESS); // Default to Business for this button
                            setAuthMode('register');
                            setIsAuthModalOpen(true);
                        }}
                        className="relative z-10 bg-white text-slate-900 px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 whitespace-nowrap text-sm shadow-sm"
                    >
                        <Building2 size={16} className="text-indigo-600" />
                        Kayıt Ol
                        <ArrowRight size={14} />
                    </button>
                </div>
            )}

            {/* AD SECTION 2: GOOGLE ADS BANNER (Horizontal) */}
            <AdPlaceholder size="banner" label="Google Ads (728x90) - Kampanya Alanı" />

            {/* MAIN CONTENT LAYOUT WITH SIDEBAR */}
            <div className="flex flex-col lg:flex-row gap-8">
               
               {/* LEFT COLUMN: Main Grid & Filters */}
               <div className="flex-1">

                  {/* Filters - Horizontal Scroll */}
                  <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0 select-none">
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                        selectedCategory === 'All'
                          ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                          : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      Tümü
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                          selectedCategory === cat
                            ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                            : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Results Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
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

        {/* VIEW: JOB BOARD */}
        {currentView === 'jobs' && (
           <JobBoard 
             jobs={jobPostings} 
             currentUser={currentUser} 
             onAddJob={handleAddJob}
             onUpdateJob={handleUpdateJob}
             onDeleteJob={handleDeleteJob}
             onOpenAuth={() => {
                 setAuthInitialRole(UserRole.USER); // Default User
                 setAuthMode('login');
                 setIsAuthModalOpen(true);
             }}
           />
        )}

        {/* VIEW: BUSINESS DETAIL */}
        {currentView === 'detail' && selectedBusiness && (
          <BusinessDetail 
            business={selectedBusiness} 
            currentUser={currentUser} 
            onBack={handleBackToExplore}
            onRate={(rating) => handleRateBusiness(selectedBusiness.id, rating)}
          />
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
            jobs={jobPostings}
            setJobs={setJobPostings}
            currentUser={currentUser}
            onAddBusiness={() => setView('business_register')}
            // Application Settings Props
            heroImage={heroImage}
            setHeroImage={setHeroImage}
            specialLogo={specialLogo}
            setSpecialLogo={setSpecialLogo}
            // New prop for updating Admin Profile Name
            onUpdateAdminProfile={handleUpdateAdminProfile}
            adminProfileName={adminProfileName}
          />
        )}

        {/* VIEW: BUSINESS REGISTRATION - Legacy access if needed */}
        {currentView === 'business_register' && (
          <BusinessRegistration 
            currentUser={currentUser} 
            onRegister={handleRegisterBusinessLegacy}
            onOpenAuth={() => {
                setAuthInitialRole(UserRole.USER);
                setAuthMode('login');
                setIsAuthModalOpen(true);
            }}
          />
        )}

        {/* VIEW: PLANNER */}
        {currentView === 'planner' && (
          <AIPlanner businesses={businesses.filter(b => b.status === 'approved')} />
        )}

      </main>

      <Footer 
        onAdminLoginClick={() => {
          setAuthMode('admin_login');
          setIsAuthModalOpen(true);
        }}
        currentUser={currentUser}
      />
    </div>
  );
}

export default App;