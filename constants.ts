
import { Business, Category, JobPosting, ClassifiedAd, ClassifiedCategory, Tour } from './types';

// Admin phone number for receiving registration requests
export const ADMIN_PHONE_NUMBER = '905550000000'; 

export const MOCK_TOURS: Tour[] = [
  {
    id: 't1',
    title: 'Günübirlik Kapadokya Turu',
    route: 'Samandağ Çıkışlı - Adana - Niğde - Nevşehir',
    date: '2024-06-15',
    price: 1200,
    conditions: 'Fiyata ulaşım ve rehberlik dahildir. Müze girişleri hariçtir.',
    description: 'Peri bacalarını keşfetmeye hazır mısınız? Sabah 05:00 hareket.',
    imageUrl: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&q=80',
    contactName: 'Samandağ Gezi',
    contactPhone: '905551234567',
    createdAt: new Date().toISOString(),
    status: 'approved',
    ownerId: 'demo_business_user'
  },
  {
    id: 't2',
    title: 'Büyük Karadeniz Turu (5 Gece)',
    route: 'Hatay - Trabzon - Rize - Artvin - Batum',
    date: '2024-07-01',
    price: 12500,
    conditions: 'Lüks otellerde konaklama, sabah kahvaltısı ve akşam yemeği dahil. Batum geçişi için kimlik yeterlidir.',
    description: 'Yaylaların serin havasını solumak isteyenler için kaçırılmayacak fırsat.',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80',
    contactName: 'Akdeniz Turizm',
    contactPhone: '905559876543',
    createdAt: new Date().toISOString(),
    status: 'approved',
    ownerId: 'biz_tour_1'
  }
];

export const MOCK_JOBS: JobPosting[] = [
  {
    id: 'j1',
    type: 'hiring',
    title: 'Tecrübeli Garson Aranıyor',
    description: 'Restoranımızda çalışmak üzere, diksiyonu düzgün, en az 1 yıl tecrübeli garson çalışma arkadaşları arıyoruz.',
    contactName: 'Lezzet Konağı',
    contactPhone: '905551234567',
    category: 'Garson',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'approved',
    ownerId: 'demo_business_user'
  },
  {
    id: 'j2',
    type: 'seeking',
    title: 'A2 Ehliyetli Kuryeyim',
    description: 'Samandağ bölgesinde paket servis işi arıyorum. Kendi motorum yok. Tam zamanlı çalışabilirim.',
    contactName: 'Ali Yılmaz',
    contactPhone: '905559998877',
    category: 'Kurye',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'approved',
    ownerId: 'user_1'
  },
  {
    id: 'j3',
    type: 'hiring',
    title: 'Bulaşıkçı',
    description: 'Akşam saatlerinde (17:00 - 00:00) çalışacak bulaşıkçı aranıyor.',
    contactName: 'Meydan Restoran',
    contactPhone: '903265120033',
    category: 'Mutfak',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'approved',
    ownerId: 'biz_3'
  }
];

export const MOCK_CLASSIFIEDS: ClassifiedAd[] = [
  {
    id: 'c1',
    title: 'Sahibinden Temiz iPhone 13',
    price: 32000,
    category: ClassifiedCategory.SECOND_HAND,
    description: 'Kutusu faturası duruyor. Çiziksiz, pil sağlığı %90. Acil satılık.',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b2191d50?auto=format&fit=crop&q=80',
    location: 'Çiğdede Mah.',
    contactName: 'Mehmet Demir',
    contactPhone: '905551112233',
    createdAt: new Date().toISOString(),
    status: 'approved',
    ownerId: 'user_1'
  },
  {
    id: 'c2',
    title: 'Deniz Mahallesinde Kiralık 3+1 Daire',
    price: 15000,
    category: ClassifiedCategory.REAL_ESTATE,
    description: 'Denize yürüme mesafesinde, doğalgazlı, geniş balkonlu daire.',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80',
    location: 'Deniz Mah.',
    contactName: 'Emlakçı Ahmet',
    contactPhone: '905554445566',
    createdAt: new Date().toISOString(),
    status: 'approved',
    ownerId: 'user_2'
  },
  {
    id: 'c3',
    title: '2020 Model Fiat Egea',
    price: 850000,
    category: ClassifiedCategory.VEHICLE,
    description: 'Hatasız, boyasız, tramersiz. 45.000 km de. Bakımları yeni yapıldı.',
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80',
    location: 'Atatürk Mah.',
    contactName: 'Mustafa Can',
    contactPhone: '905557778899',
    createdAt: new Date().toISOString(),
    status: 'approved',
    ownerId: 'user_3'
  }
];

export const MOCK_BUSINESSES: Business[] = [
  {
    id: '1',
    name: 'Lezzet Konağı',
    category: Category.FOOD,
    description: 'Yöresel ev yemekleri ve serpme kahvaltı.',
    address: 'Cumhuriyet Cad. No:12',
    phone: '905551234567', 
    imageUrl: 'https://picsum.photos/400/300?random=1',
    rating: 4.8,
    tags: ['kahvaltı', 'mantı', 'ev yemeği', 'bahçe'],
    status: 'approved',
    ownerId: 'demo_business_user', // Fixed ID for demo login matching
    isPromoted: true,
    hasDelivery: true,
    isPublicService: false,
    offer: {
      title: 'Serpme Kahvaltıda %20 İndirim',
      description: 'Hafta içi 11:00\'e kadar geçerli.',
      validUntil: '2024-12-31',
      discountRate: '%20'
    },
    products: [
      { id: 'p1', name: 'Serpme Kahvaltı (2 Kişilik)', price: 450, description: 'Peynir tabağı, reçeller, bal kaymak, sahanda yumurta...' },
      { id: 'p2', name: 'Kayseri Mantısı', price: 180, description: 'Yoğurtlu ve soslu.' },
      { id: 'p3', name: 'Gözleme Çeşitleri', price: 90, description: 'Peynirli, Patatesli veya Ispanaklı' }
    ]
  },
  {
    id: '2',
    name: 'Elit Organizasyon',
    category: Category.EVENTS,
    description: 'Düğün, nişan ve özel günleriniz için profesyonel çözümler.',
    address: 'İstasyon Meydanı No:5',
    phone: '905552223344',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    rating: 4.9,
    tags: ['düğün', 'nişan', 'kına', 'süsleme'],
    status: 'approved',
    isPromoted: true,
    hasDelivery: false,
    isPublicService: false,
    products: [
      { id: 'p1', name: 'Nişan Masası Süsleme', price: 3500, description: 'Arka fon, maket pasta, jardinyer seti.' },
      { id: 'p2', name: 'Gelin Yolu Süsleme', price: 2000, description: '8 adet sütun ve çiçekler.' }
    ]
  },
  {
    id: '3',
    name: 'Pırlanta Güzellik Merkezi',
    category: Category.BEAUTY,
    description: 'Cilt bakımı, lazer ve saç tasarımı.',
    address: 'Lale Sok. No:3',
    phone: '905553334455',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    rating: 4.5,
    tags: ['kuaför', 'makyaj', 'gelin başı'],
    status: 'approved',
    hasDelivery: false,
    isPublicService: false,
    offer: {
      title: 'Gelin Paketi Kampanyası',
      description: 'Saç + Makyaj + Cilt Bakımı sadece 2500 TL.',
      validUntil: '2024-08-30'
    },
    products: [
      { id: 'p1', name: 'Gelin Başı & Makyaj', price: 2500, description: 'Prova dahildir.' },
      { id: 'p2', name: 'Klasik Cilt Bakımı', price: 800, description: '60 dakika derinlemesine temizlik.' },
      { id: 'p3', name: 'Manikür & Pedikür', price: 400, description: 'Kalıcı oje seçeneği ile.' }
    ]
  },
  {
    id: '4',
    name: 'Merkez Çiçekçilik',
    category: Category.SHOPPING,
    description: 'Taze kesme çiçekler ve aranjmanlar.',
    address: 'Çarşı İçi No:22',
    phone: '905554445566',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    rating: 4.2,
    tags: ['çiçek', 'gelin çiçeği', 'aranjman'],
    status: 'approved',
    hasDelivery: true,
    isPublicService: false,
    products: [
      { id: 'p1', name: 'Gül Buketi (10\'lu)', price: 600, description: 'İthal kırmızı güller.' },
      { id: 'p2', name: 'Orkide (Çift Dallı)', price: 850, description: 'Seramik saksıda.' }
    ]
  },
  {
    id: '5',
    name: 'Usta Oto Tamir',
    category: Category.AUTOMOTIVE,
    description: 'Her marka araç için güvenilir servis.',
    address: 'Sanayi Sitesi C Blok',
    phone: '905556667788',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    rating: 4.7,
    tags: ['tamir', 'bakım', 'yağ değişimi'],
    status: 'approved',
    hasDelivery: false,
    isPublicService: false,
    products: [
      { id: 'p1', name: 'Periyodik Bakım', price: 1500, description: 'Yağ ve filtre değişimi (Parça hariç işçilik).' },
      { id: 'p2', name: 'Kışlık Bakım Kontrolü', price: 500, description: 'Antifriz ve lastik kontrolü.' }
    ]
  },
  {
    id: '6',
    name: 'Fotoğrafçı Ahmet',
    category: Category.SERVICES,
    description: 'Düğün hikayesi ve dış çekim uzmanı.',
    address: 'Kültür Cad. No:8',
    phone: '905557778899',
    imageUrl: 'https://picsum.photos/400/300?random=6',
    rating: 4.9,
    tags: ['fotoğraf', 'düğün', 'video'],
    status: 'approved',
    hasDelivery: false,
    isPublicService: false,
    products: [
      { id: 'p1', name: 'Dış Çekim Albüm Paketi', price: 5000, description: 'Panoramik albüm + 2 aile albümü + poster.' },
      { id: 'p2', name: 'Düğün Hikayesi Klibi', price: 4000, description: 'Tüm gün video çekimi ve kurgu.' }
    ]
  },
  {
    id: '7',
    name: 'Burger Station',
    category: Category.FOOD,
    description: 'El yapımı hamburgerler ve özel soslar.',
    address: 'Gençlik Cad. No:15',
    phone: '905558889900',
    imageUrl: 'https://picsum.photos/400/300?random=7',
    rating: 4.6,
    tags: ['burger', 'fast food', 'öğrenci dostu'],
    status: 'approved',
    hasDelivery: true,
    isPublicService: false,
    offer: {
      title: '2. Burger Bedava',
      description: 'Her Salı günü geçerli.',
      validUntil: '2024-12-31',
      discountRate: '1 al 1 bedava'
    },
    products: [
      { id: 'p1', name: 'Cheeseburger Menü', price: 220, description: '140gr köfte, patates ve içecek.' },
      { id: 'p2', name: 'Tavuk Burger Menü', price: 180, description: 'Çıtır tavuk, patates ve içecek.' },
      { id: 'p3', name: 'Soğan Halkası (8\'li)', price: 60, description: 'Özel sos ile.' }
    ]
  },
  {
    id: '8',
    name: 'Merkez Eczanesi (Nöbetçi)',
    category: Category.HEALTH,
    description: 'Sağlık danışmanlığı ve dermo-kozmetik ürünler.',
    address: 'Hastane Karşısı',
    phone: '905559990011',
    imageUrl: 'https://picsum.photos/400/300?random=8',
    rating: 5.0,
    tags: ['eczane', 'sağlık', 'kozmetik'],
    status: 'approved',
    hasDelivery: true,
    isPublicService: false,
    products: [
      { id: 'p1', name: 'Güneş Kremi 50+', price: 450, description: 'Hassas ciltler için.' },
      { id: 'p2', name: 'Vitamin C Serumu', price: 350, description: 'Aydınlatıcı etki.' }
    ]
  },
  {
    id: '9',
    name: 'İlçe Halk Kütüphanesi',
    category: Category.PUBLIC,
    description: 'Hafta içi 08:30 - 17:30 arası hizmet vermektedir. Ücretsiz internet ve çalışma salonu mevcuttur.',
    address: 'Merkez Mah. Okul Sok. No:4',
    phone: '02121111111',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80',
    rating: 4.8,
    tags: ['kütüphane', 'kitap', 'ders çalışma'],
    status: 'approved',
    hasDelivery: false,
    isPublicService: true,
    products: []
  },
  // ... (Other businesses remain the same)
  {
    id: '11',
    name: 'Best Restaurant (Balık & Meze)',
    category: Category.FOOD,
    description: 'Çevlik yolu üzerinde, taze mevsim balıkları ve zengin meze çeşitleri ile aile ortamı.',
    address: 'Kapısuyu Mah. (Çevlik Yolu Üzeri)',
    phone: '903265949224',
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80',
    rating: 4.7,
    tags: ['balık', 'meze', 'alkollü', 'manzara'],
    status: 'approved',
    hasDelivery: false,
    isPublicService: false,
    products: [
      { id: 'p1', name: 'Levrek Izgara', price: 450, description: 'Mevsim salata ile servis edilir.' },
      { id: 'p2', name: 'Karides Güveç', price: 380, description: 'Tereyağlı ve sarımsaklı.' },
      { id: 'p3', name: 'Humus & Meze Tabağı', price: 250, description: 'Yöresel meze çeşitleri.' }
    ]
  },
  // ... other businesses ...
];
