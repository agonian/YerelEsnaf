export enum Category {
  FOOD = 'Yeme & İçme',
  SHOPPING = 'Alışveriş',
  BEAUTY = 'Güzellik & Bakım',
  SERVICES = 'Hizmetler',
  AUTOMOTIVE = 'Otomotiv',
  EVENTS = 'Etkinlik & Organizasyon',
  HEALTH = 'Sağlık',
  OTHER = 'Diğer'
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
  isPromoted?: boolean; // For monetization (Ads)
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
