import React from 'react';
import { Star, MapPin, Phone, Tag, Truck, Landmark } from 'lucide-react';
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
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse z-10">
            Öne Çıkan
          </div>
        )}
        
        {/* Public Service Badge */}
        {business.isPublicService && (
             <div className="absolute top-3 left-3 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md shadow-md z-10 flex items-center gap-1">
                <Landmark size={12} />
                Kamu/Kurum
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

        {/* Feature Icons: Offer or Delivery Status */}
        <div className="mt-3 flex flex-col gap-2">
            {business.offer && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2.5">
                <div className="flex items-center text-indigo-700 font-bold text-xs mb-0.5">
                    <Tag size={12} className="mr-1" />
                    {business.offer.title}
                </div>
            </div>
            )}
            
            {/* Show Delivery Info if NOT a public service */}
            {!business.isPublicService && (
                <div className="flex items-center gap-2 text-xs">
                    {business.hasDelivery ? (
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                            <Truck size={12} /> Paket Servis
                        </span>
                    ) : (
                        <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded flex items-center gap-1">
                            <Truck size={12} className="opacity-50" /> Gel-Al
                        </span>
                    )}
                </div>
            )}
        </div>
        
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