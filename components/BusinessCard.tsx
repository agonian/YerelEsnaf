import React, { useState } from 'react';
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
      className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer h-full flex flex-col relative"
    >
      {/* 1. Image Section - Fixed Height */}
      <div className="relative h-32 overflow-hidden shrink-0 bg-slate-100">
        <img 
          src={business.imageUrl} 
          alt={business.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {business.isPromoted && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md z-10">
            Öne Çıkan
          </div>
        )}
        
        {business.isPublicService && (
             <div className="absolute top-2 left-2 bg-blue-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-md z-10 flex items-center gap-1">
                <Landmark size={10} />
                Kamu
             </div>
        )}

        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm text-slate-800 text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
          {business.category}
        </div>
      </div>
      
      {/* 2. Content Section - Flex Grow to push footer down */}
      <div className="p-3 flex flex-col flex-grow">
        
        {/* Header (Title & Rate) - Fixed Min Height for alignment */}
        <div className="flex justify-between items-start gap-2 min-h-[2.5rem] mb-1">
          <h3 className="font-bold text-sm text-slate-800 leading-tight line-clamp-2">{business.name}</h3>
          <div className="flex items-center text-amber-500 text-[10px] font-bold bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
            <Star size={10} className="fill-current mr-0.5" />
            {business.rating}
          </div>
        </div>
        
        {/* Description - Fixed Height with line clamp */}
        <p className="text-slate-500 text-xs leading-snug line-clamp-2 h-8 mb-2">
            {business.description}
        </p>
        
        {/* Badges Area - Fixed Min Height to prevent address jumping */}
        <div className="min-h-[24px] mb-3 flex flex-col justify-start">
            {business.offer ? (
                <div className="bg-indigo-50 border border-indigo-100 rounded p-1 inline-flex max-w-full">
                    <div className="flex items-center text-indigo-700 font-bold text-[9px] leading-none">
                        <Tag size={10} className="mr-1 shrink-0" />
                        <span className="truncate">{business.offer.title}</span>
                    </div>
                </div>
            ) : !business.isPublicService ? (
                 <div className="flex items-center gap-2 text-[9px]">
                    {business.hasDelivery ? (
                        <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-1 border border-green-100">
                            <Truck size={10} /> Paket Servis
                        </span>
                    ) : (
                        <span className="text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded flex items-center gap-1 border border-slate-100">
                             Gel-Al
                        </span>
                    )}
                </div>
            ) : null}
        </div>

        {/* Address & Phone - Always at the bottom of the flex container */}
        <div className="mt-auto pt-2 border-t border-slate-50 space-y-1">
          <div className="flex items-center text-[10px] text-slate-500">
            <MapPin size={12} className="mr-1.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{business.address}</span>
          </div>
          <div className="flex items-center text-[10px] text-slate-500">
            <Phone size={12} className="mr-1.5 text-slate-400 flex-shrink-0" />
            <span>{business.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;