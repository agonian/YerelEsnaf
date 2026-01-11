
export enum Category {
  FOOD = 'Yeme & İçme',
  SHOPPING = 'Alışveriş',
  BEAUTY = 'Güzellik & Bakım',
  SERVICES = 'Hizmetler',
  AUTOMOTIVE = 'Otomotiv',
  EVENTS = 'Etkinlik & Organizasyon',
  HEALTH = 'Sağlık',
  PUBLIC = 'Kamu & Kurumlar',
  OTHER = 'Diğer'
}

export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  BUSINESS = 'business',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string; // Saved user address
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Business {
  id: string;
  name: string;
  category: Category;
  description: string;
  address: string;
  phone: string;
  imageUrl: string;
  rating: number;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected' | 'passive'; // Added passive
  ownerId?: string; // Link to user
  isPromoted?: boolean;
  promotedUntil?: string; // ISO Date string for expiration
  
  // New Flags
  hasDelivery?: boolean; // Paket servis var mı?
  isPublicService?: boolean; // Kamu kurumu mu? (Ürün satışı yok)

  offer?: {
    title: string;
    description: string;
    validUntil: string;
    discountRate?: string;
  };
  products: Product[];
}

export interface PlannerResult {
  stepName: string;
  description: string;
  recommendedCategories: Category[];
  searchKeywords: string[];
}

export interface JobPosting {
  id: string;
  type: 'hiring' | 'seeking'; // hiring: İş Veren, seeking: İş Arayan
  title: string;
  description: string;
  contactName: string; // İşletme adı veya Kişi adı
  contactPhone: string;
  category?: string; // Garson, Aşçı, Kurye vb.
  createdAt: string; // ISO Date
  expiresAt: string; // ISO Date (Auto set to 30 days)
  status: 'pending' | 'approved' | 'rejected' | 'passive';
  isPromoted?: boolean; // Admin promotion flag
  ownerId: string; // User ID creating the post
}

// --- NEW TYPES FOR CLASSIFIEDS (PAZAR YERİ) ---
export enum ClassifiedCategory {
  REAL_ESTATE = 'Emlak',
  VEHICLE = 'Vasıta',
  SECOND_HAND = 'İkinci El'
}

export interface ClassifiedAd {
  id: string;
  title: string;
  price: number;
  category: ClassifiedCategory;
  description: string;
  imageUrl: string; // Essential for classifieds
  location: string; // e.g., "Cumhuriyet Mah."
  contactName: string;
  contactPhone: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'passive';
  ownerId: string;
}

// --- NEW TYPE FOR TOURS ---
export interface Tour {
  id: string;
  title: string;
  route: string; // Güzergah
  date: string; // Tur Tarihi
  price: number;
  conditions?: string; // Katılım Şartları
  description: string;
  imageUrl: string;
  contactName: string; // Acente Adı
  contactPhone: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'passive';
  ownerId: string;
}
