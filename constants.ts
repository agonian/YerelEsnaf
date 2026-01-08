import { Business, Category } from './types';

// Admin phone number for receiving registration requests
export const ADMIN_PHONE_NUMBER = '905550000000'; 

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
    name: 'Şifa Eczanesi',
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
  // NEW: Public Service Example
  {
    id: '9',
    name: 'İlçe Devlet Hastanesi',
    category: Category.PUBLIC,
    description: '7/24 Acil servis, poliklinik hizmetleri ve görüntüleme merkezi. Randevu için 182\'yi arayabilirsiniz.',
    address: 'Hürriyet Mah. Sağlık Cad. No:1',
    phone: '02120000000',
    imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80',
    rating: 4.2,
    tags: ['hastane', 'acil', 'sağlık', 'doktor'],
    status: 'approved',
    hasDelivery: false,
    isPublicService: true,
    products: []
  },
  {
    id: '10',
    name: 'Halk Kütüphanesi',
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
  }
];