import React from 'react';
import { Star, MapPin, Phone, Tag } from 'lucide-react';
import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
  onClick?: (business: Business) => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onClick }) => {
  return (
    <div 
      onClick={() => onClick && onClick(business)}
      className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer h-full flex flex-col"
    >
      <div className="relative h-48 overflow-hidden shrink-0">
        <img 
          src={business.imageUrl} 
          alt={business.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {business.isPromoted && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
            Öne Çıkan
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-semibold px-2 py-1 rounded">
          {business.category}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-slate-800 leading-tight">{business.name}</h3>
          <div className="flex items-center text-amber-500 text-sm font-medium bg-amber-50 px-1.5 py-0.5 rounded">
            <Star size={14} className="fill-current mr-1" />
            {business.rating}
          </div>
        </div>
        
        <p className="text-slate-500 text-sm mb-3 line-clamp-2">{business.description}</p>
        
        <div className="space-y-2 text-sm text-slate-600 mt-auto">
          <div className="flex items-center">
            <MapPin size={16} className="mr-2 text-slate-400 flex-shrink-0" />
            <span className="truncate">{business.address}</span>
          </div>
          <div className="flex items-center">
            <Phone size={16} className="mr-2 text-slate-400 flex-shrink-0" />
            <span>{business.phone}</span>
          </div>
        </div>

        {business.offer && (
           <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-lg p-3">
              <div className="flex items-center text-indigo-700 font-bold text-sm mb-1">
                 <Tag size={14} className="mr-1" />
                 {business.offer.title}
              </div>
              <p className="text-indigo-600 text-xs">{business.offer.discountRate ? `Oran: ${business.offer.discountRate}` : 'Fırsat'}</p>
           </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2 flex-wrap">
          {business.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
