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