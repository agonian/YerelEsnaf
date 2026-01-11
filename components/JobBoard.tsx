
import React, { useState } from 'react';
import { Briefcase, User, Clock, Plus, Filter, MessageCircle, MapPin, Search, Trash2, Edit, AlertTriangle } from 'lucide-react';
import { JobPosting, User as UserType, UserRole } from '../types';

interface JobBoardProps {
  jobs: JobPosting[];
  currentUser: UserType | null;
  onAddJob: (job: JobPosting) => void;
  onUpdateJob: (job: JobPosting) => void;
  onDeleteJob: (jobId: string) => void;
  onOpenAuth: () => void;
}

const JobBoard: React.FC<JobBoardProps> = ({ jobs, currentUser, onAddJob, onUpdateJob, onDeleteJob, onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<'hiring' | 'seeking'>('hiring');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, jobId: string | null}>({
    isOpen: false,
    jobId: null
  });
  
  // Editing state
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    contactName: currentUser?.name || '',
    contactPhone: currentUser?.phone || ''
  });

  // Calculate days left helper
  const getDaysLeft = (dateString: string) => {
    const diff = new Date(dateString).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };

  const filteredJobs = jobs.filter(job => 
    job.type === activeTab &&
    job.status === 'approved' && // Only show approved jobs (no passive or pending)
    new Date(job.expiresAt) > new Date() && // Only show non-expired
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     job.category?.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => (a.isPromoted === b.isPromoted) ? 0 : a.isPromoted ? -1 : 1); // Show promoted first

  const handleSubmitJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    // Determine type based on role, Admin can choose but defaults to hiring here for simplicity
    // If editing, keep original type
    const jobType = editingJobId 
        ? jobs.find(j => j.id === editingJobId)?.type || 'hiring'
        : (currentUser.role === UserRole.BUSINESS ? 'hiring' : 'seeking');

    if (editingJobId) {
        // UPDATE MODE
        const originalJob = jobs.find(j => j.id === editingJobId);
        if (!originalJob) return;

        const updatedJob: JobPosting = {
            ...originalJob,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            contactName: formData.contactName,
            contactPhone: formData.contactPhone,
        };
        onUpdateJob(updatedJob);
    } else {
        // CREATE MODE
        const newJob: JobPosting = {
            id: Date.now().toString(),
            type: jobType,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            contactName: formData.contactName,
            contactPhone: formData.contactPhone,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending', 
            ownerId: currentUser.id
        };
        onAddJob(newJob);
    }

    resetForm();
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingJobId(null);
    setFormData({ title: '', description: '', category: '', contactName: currentUser?.name || '', contactPhone: '' });
  };

  const handleOpenCreateModal = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setEditingJobId(null);
    setFormData({ title: '', description: '', category: '', contactName: currentUser.name, contactPhone: currentUser.phone || '' });
    setIsModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, job: JobPosting) => {
      e.stopPropagation(); // Stop event bubbling
      e.preventDefault();
      setEditingJobId(job.id);
      setFormData({
          title: job.title,
          description: job.description,
          category: job.category || '',
          contactName: job.contactName,
          contactPhone: job.contactPhone
      });
      setIsModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, jobId: string) => {
      e.stopPropagation(); // Stop event bubbling
      e.preventDefault();
      setDeleteModal({ isOpen: true, jobId });
  };

  const handleConfirmDelete = () => {
      if (deleteModal.jobId) {
          onDeleteJob(deleteModal.jobId);
          setDeleteModal({ isOpen: false, jobId: null });
      }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-20">
      
      {/* Minimal Header */}
      <div className="flex items-center justify-between mb-2 px-1">
         <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="text-indigo-600" size={24} />
              İş İlanları
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">Personel ve iş arayanlar.</p>
         </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center bg-white p-2 rounded-xl border border-slate-200 sticky top-14 z-20 shadow-sm">
         <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('hiring')}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'hiring' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
               Personel Arayan
            </button>
            <button 
              onClick={() => setActiveTab('seeking')}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'seeking' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
               İş Arayan
            </button>
         </div>

         <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
               <input 
                 type="text" 
                 placeholder="Pozisyon ara..." 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
               />
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            </div>
            <button 
              onClick={handleOpenCreateModal}
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 hover:bg-indigo-700 transition-colors whitespace-nowrap text-xs shadow-sm"
            >
               <Plus size={16} /> <span>İlan Ver</span>
            </button>
         </div>
      </div>

      {/* Job Grid */}
      <div className="grid md:grid-cols-2 gap-3">
         {filteredJobs.length > 0 ? (
           filteredJobs.map(job => (
             <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1 h-full ${job.type === 'hiring' ? 'bg-indigo-500' : 'bg-amber-500'}`}></div>
                
                {/* Admin Promotion Badge */}
                {job.isPromoted && (
                    <div className="absolute top-0 right-0 bg-yellow-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg shadow-sm z-10 pointer-events-none">
                        Öne Çıkan
                    </div>
                )}
                
                {/* Actions for Owner or Admin */}
                {(currentUser && (currentUser.id === job.ownerId || currentUser.role === UserRole.ADMIN)) && (
                    <div className="absolute top-3 right-3 flex gap-2 z-30">
                        <button 
                          onClick={(e) => handleEditClick(e, job)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all"
                          title="Düzenle"
                          type="button"
                        >
                            <Edit size={14} />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteClick(e, job.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all"
                          title="Sil"
                          type="button"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}

                <div className="flex justify-between items-start mb-2 pl-2 pr-12">
                   <div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md mb-1 inline-block border ${
                        job.type === 'hiring' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                         {job.category || (job.type === 'hiring' ? 'Personel' : 'İş Arıyor')}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 leading-tight">{job.title}</h3>
                   </div>
                </div>

                <p className="text-slate-600 text-xs mb-3 pl-2 line-clamp-2 min-h-[2.5em]">
                   {job.description}
                </p>

                <div className="flex justify-between items-end pl-2 pt-2 border-t border-slate-50">
                   <div>
                       <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mb-0.5">
                            <User size={10} /> {job.contactName}
                       </div>
                       <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock size={10} /> {new Date(job.createdAt).toLocaleDateString('tr-TR')}
                       </div>
                   </div>
                   
                   <a 
                     href={`https://wa.me/${job.contactPhone}`} 
                     target="_blank" 
                     rel="noreferrer"
                     onClick={(e) => e.stopPropagation()}
                     className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                        job.type === 'hiring' 
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100' 
                          : 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'
                     }`}
                   >
                      <MessageCircle size={14} /> Mesaj
                   </a>
                </div>
             </div>
           ))
         ) : (
            <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
               <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Briefcase size={24} />
               </div>
               <h3 className="text-sm font-bold text-slate-700">Henüz İlan Yok</h3>
               <p className="text-xs text-slate-500 mb-4">Bu kategoride şu an aktif ilan bulunmuyor.</p>
               <button onClick={handleOpenCreateModal} className="text-indigo-600 text-xs font-bold hover:underline">İlk ilanı sen ver</button>
            </div>
         )}
      </div>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/80 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-sm animate-in zoom-in-95">
              <div className="flex flex-col items-center text-center">
                 <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-red-100 text-red-600">
                   <Trash2 size={24} />
                 </div>
                 <h3 className="font-bold text-lg text-slate-900 mb-2">İlanı Sil</h3>
                 <p className="text-sm text-slate-500 mb-6">Bu ilanı kalıcı olarak silmek istediğinize emin misiniz?</p>
                 
                 <div className="flex gap-3 w-full">
                    <button 
                      onClick={() => setDeleteModal({ isOpen: false, jobId: null })}
                      className="flex-1 py-2.5 rounded-xl text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      İptal
                    </button>
                    <button 
                      onClick={handleConfirmDelete}
                      className="flex-1 py-2.5 rounded-xl text-white font-bold bg-red-600 hover:bg-red-700 transition-colors"
                    >
                      Sil
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-in zoom-in-95">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-bold text-xl text-slate-900">
                    {editingJobId ? 'İlanı Düzenle' : (currentUser?.role === UserRole.BUSINESS ? 'Eleman İlanı Oluştur' : 'İş Arayan İlanı Oluştur')}
                 </h3>
                 <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                    <span className="text-2xl">&times;</span>
                 </button>
              </div>
              <form onSubmit={handleSubmitJob} className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Başlık</label>
                    <input 
                      required
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder={currentUser?.role === UserRole.BUSINESS ? "Örn: Garson Aranıyor" : "Örn: Tecrübeli Aşçıyım"}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Kategori / Pozisyon</label>
                        <input 
                          required
                          value={formData.category} 
                          onChange={e => setFormData({...formData, category: e.target.value})}
                          placeholder="Örn: Mutfak, Kurye..."
                          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">İletişim Tel</label>
                        <input 
                          required
                          value={formData.contactPhone} 
                          onChange={e => setFormData({...formData, contactPhone: e.target.value})}
                          placeholder="555..."
                          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Açıklama</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Detayları buraya yazınız..."
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    />
                 </div>

                 {!editingJobId && (
                    <div className="bg-indigo-50 p-3 rounded-lg text-xs text-indigo-700">
                        <p><strong>Not:</strong> İlanınız yönetici onayından sonra yayınlanacaktır. İlan süresi otomatik olarak 30 gün olarak ayarlanır.</p>
                    </div>
                 )}

                 <div className="flex gap-3 pt-2">
                    <button type="button" onClick={resetForm} className="flex-1 py-3 text-slate-600 font-bold bg-slate-100 rounded-xl hover:bg-slate-200">İptal</button>
                    <button type="submit" className="flex-1 py-3 text-white font-bold bg-slate-900 rounded-xl hover:bg-slate-800">
                        {editingJobId ? 'Güncelle' : 'İlanı Gönder'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default JobBoard;
