import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Search } from 'lucide-react';
import { generatePlanFromIntent } from '../services/geminiService';
import { PlannerResult, Business } from '../types';
import BusinessCard from './BusinessCard';

interface AIPlannerProps {
  businesses: Business[];
}

const AIPlanner: React.FC<AIPlannerProps> = ({ businesses }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlannerResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePlan = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const result = await generatePlanFromIntent(prompt);
      setPlan(result);
    } catch (err) {
      setError("Plan oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to find matching businesses for a step
  const getMatchingBusinesses = (step: PlannerResult) => {
    return businesses.filter(b => 
      step.recommendedCategories.includes(b.category) && 
      step.searchKeywords.some(keyword => 
        b.tags.includes(keyword.toLowerCase()) || 
        b.description.toLowerCase().includes(keyword.toLowerCase()) ||
        b.category.toLowerCase().includes(keyword.toLowerCase())
      )
    ).slice(0, 3); // Limit to 3 for UI cleanliness
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-700 rounded-full mb-2">
          <Sparkles size={24} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Akıllı Etkinlik Planlayıcı</h2>
        <p className="text-slate-600 max-w-lg mx-auto">
          "Düğün yapmak istiyorum", "Arkadaşlarımla akşam yemeği yiyeceğim" gibi aklınızdakileri yazın, sizin için ilçedeki en uygun rotayı oluşturalım.
        </p>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-200 flex flex-col md:flex-row gap-2 max-w-2xl mx-auto">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ne yapmak istiyorsunuz?"
          className="flex-1 p-4 rounded-xl outline-none text-slate-700 placeholder:text-slate-400"
          onKeyDown={(e) => e.key === 'Enter' && handlePlan()}
        />
        <button
          onClick={handlePlan}
          disabled={loading || !prompt.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              Planla <Sparkles size={18} />
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      )}

      {plan && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-4 py-4 border-b border-slate-200">
             <div className="bg-green-100 p-2 rounded-full text-green-700">
               <CheckCircle size={24} />
             </div>
             <div>
               <h3 className="font-bold text-lg text-slate-800">Planınız Hazır!</h3>
               <p className="text-slate-500">İşte isteğinize uygun adım adım önerilerimiz.</p>
             </div>
          </div>

          <div className="space-y-12 relative before:absolute before:left-4 md:before:left-8 before:top-4 before:h-full before:w-0.5 before:bg-indigo-100">
            {plan.map((step, index) => {
              const matches = getMatchingBusinesses(step);
              return (
                <div key={index} className="relative pl-12 md:pl-20">
                  {/* Timeline Dot */}
                  <div className="absolute left-0 md:left-4 top-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold z-10 ring-4 ring-white shadow-md">
                    {index + 1}
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-slate-800 mb-1">{step.stepName}</h4>
                    <p className="text-slate-600">{step.description}</p>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {step.recommendedCategories.map((cat, i) => (
                        <span key={i} className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {matches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {matches.map(business => (
                        <BusinessCard key={business.id} business={business} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500">
                      <Search size={32} className="mx-auto mb-2 opacity-50" />
                      <p>Bu kategori için şu an uygun işletme kaydı bulunamadı.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPlanner;
