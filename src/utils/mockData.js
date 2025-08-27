/**
 * Centralized mock data for development and testing
 * This consolidates all mock data to prevent duplication across service files
 */

// Mock data for different endpoints
export const MOCK_DATA = {
  '/donations': {
    stats: {
      total: 150000,
      monthly: 25000,
      change: 12.5,
      count: 45,
      thisMonth: 25000,
      monthlyTrend: [45000, 52000, 48000, 61000, 55000, 67000],
    },
    data: [],
  },
  '/beneficiaries': {
    stats: {
      total: 120,
      active: 98,
      change: 8.2,
      thisMonth: 8,
      monthlyTrend: [42000, 47000, 51000, 49000, 62000, 58000],
    },
    data: [],
  },
  '/hospital-referrals': {
    stats: {
      total: 45,
      pending: 12,
      change: -5.3,
      thisMonth: 3,
      monthlyTrend: [38000, 42000, 45000, 41000, 48000, 52000],
    },
    data: [],
  },
  '/tasks': {
    stats: {
      total: 156,
      active: 42,
      completed: 98,
      overdue: 16,
      thisMonth: 12,
      monthlyTrend: [120, 135, 142, 156, 148, 156],
    },
    data: [
      {
        id: 1,
        title: 'Yardım paketi dağıtımı',
        description: 'Acil yardım paketlerinin ihtiyaç sahiplerine dağıtılması',
        status: 'Devam Ediyor',
        priority: 'Yüksek',
        assignee: 'Ahmet Yılmaz',
        dueDate: '2024-01-25',
        createdAt: '2024-01-15',
      },
      {
        id: 2,
        title: 'Gönüllü eğitimi',
        description: 'Yeni gönüllüler için temel eğitim programı',
        status: 'Tamamlandı',
        priority: 'Orta',
        assignee: 'Fatma Demir',
        dueDate: '2024-01-20',
        createdAt: '2024-01-10',
      },
      {
        id: 3,
        title: 'Rapor hazırlama',
        description: 'Aylık faaliyet raporunun hazırlanması',
        status: 'Beklemede',
        priority: 'Düşük',
        assignee: 'Mehmet Kaya',
        dueDate: '2024-01-30',
        createdAt: '2024-01-18',
      },
    ],
  },
  '/aid': {
    stats: { programs: 12, active: 8, beneficiaries: 150 },
    data: [],
  },
  '/volunteers': {
    stats: {
      total: 247,
      active: 189,
      thisMonth: 34,
      totalHours: 12450,
      monthlyTrend: [180, 195, 210, 225, 240, 247],
    },
    data: [
      {
        id: 1,
        name: 'Ahmet Yılmaz',
        email: 'ahmet.yilmaz@email.com',
        phone: '+90 532 123 4567',
        role: 'Yardım Dağıtımı',
        location: 'İstanbul',
        status: 'Aktif',
        joinDate: '2023-03-15',
        totalHours: 156,
        lastActivity: '2024-01-20',
        skills: ['Lojistik', 'Organizasyon', 'İletişim'],
      },
      {
        id: 2,
        name: 'Fatma Demir',
        email: 'fatma.demir@email.com',
        phone: '+90 533 234 5678',
        role: 'Eğitim Koordinatörü',
        location: 'Ankara',
        status: 'Aktif',
        joinDate: '2023-01-10',
        totalHours: 234,
        lastActivity: '2024-01-19',
        skills: ['Eğitim', 'Mentorluk', 'Proje Yönetimi'],
      },
      {
        id: 3,
        name: 'Mehmet Kaya',
        email: 'mehmet.kaya@email.com',
        phone: '+90 534 345 6789',
        role: 'Sağlık Hizmetleri',
        location: 'İzmir',
        status: 'Aktif',
        joinDate: '2023-06-20',
        totalHours: 189,
        lastActivity: '2024-01-18',
        skills: ['İlk Yardım', 'Sağlık', 'Danışmanlık'],
      },
      {
        id: 4,
        name: 'Ayşe Özkan',
        email: 'ayse.ozkan@email.com',
        phone: '+90 535 456 7890',
        role: 'Sosyal Medya',
        location: 'Bursa',
        status: 'Pasif',
        joinDate: '2023-02-05',
        totalHours: 89,
        lastActivity: '2023-12-15',
        skills: ['Sosyal Medya', 'İçerik Üretimi', 'Pazarlama'],
      },
      {
        id: 5,
        name: 'Hasan Yıldız',
        email: 'hasan.yildiz@email.com',
        phone: '+90 536 567 8901',
        role: 'Teknik Destek',
        location: 'Antalya',
        status: 'Aktif',
        joinDate: '2023-04-12',
        totalHours: 167,
        lastActivity: '2024-01-17',
        skills: ['Teknoloji', 'Sistem Yönetimi', 'Destek'],
      },
    ],
  },
  '/messages': {
    stats: {
      total: 156,
      unread: 23,
      activeChats: 12,
      thisMonth: 45,
      monthlyTrend: [120, 135, 142, 156, 148, 156],
    },
    data: [
      {
        id: 1,
        sender: 'Ahmet Yılmaz',
        recipient: 'Fatma Demir',
        subject: 'Yardım paketi dağıtımı hakkında',
        content:
          'Merhaba, yarın yapılacak yardım paketi dağıtımı için gönüllü sayısını artırmamız gerekiyor. Acil yardım edebilir misiniz?',
        type: 'internal',
        priority: 'high',
        unread: true,
        time: '2 saat önce',
        date: '2024-01-20T10:30:00Z',
      },
      {
        id: 2,
        sender: 'Mehmet Kaya',
        recipient: 'Tüm Gönüllüler',
        subject: 'Haftalık toplantı hatırlatması',
        content:
          "Bu hafta Cuma günü saat 14:00'te haftalık değerlendirme toplantımız var. Katılımınızı bekliyoruz.",
        type: 'announcement',
        priority: 'medium',
        unread: false,
        time: '1 gün önce',
        date: '2024-01-19T15:45:00Z',
      },
      {
        id: 3,
        sender: 'Ayşe Özkan',
        recipient: 'Yönetim Kurulu',
        subject: 'Finansal rapor - Ocak 2024',
        content:
          'Ocak ayı finansal raporu hazırlandı. Toplam bağış miktarı 125.000₺ olarak gerçekleşti. Detayları ekte bulabilirsiniz.',
        type: 'report',
        priority: 'low',
        unread: true,
        time: '3 gün önce',
        date: '2024-01-17T09:15:00Z',
      },
      {
        id: 4,
        sender: 'Hasan Yıldız',
        recipient: 'Envanter Sorumlusu',
        subject: 'Stok durumu kontrolü',
        content:
          'Yardım paketlerindeki malzeme stoklarını kontrol etmemiz gerekiyor. Acil ihtiyaç listesi hazırlayabilir misiniz?',
        type: 'internal',
        priority: 'low',
        unread: false,
        time: '4 gün önce',
        date: '2024-01-16T11:20:00Z',
      },
      {
        id: 5,
        sender: 'Zeynep Arslan',
        recipient: 'Tüm Personel',
        subject: 'Yeni gönüllü eğitim programı',
        content:
          'Yeni gönüllülerimiz için temel eğitim programı hazırlandı. Program detayları ve kayıt formu ekte yer almaktadır.',
        type: 'announcement',
        priority: 'medium',
        unread: true,
        time: '5 gün önce',
        date: '2024-01-15T14:30:00Z',
      },
    ],
  },
  '/finance': {
    stats: {
      total: 125000,
      income: 85000,
      expense: 40000,
      balance: 45000,
      thisMonth: 15000,
      monthlyTrend: [35000, 42000, 38000, 45000, 52000, 48000],
    },
    data: [
      {
        id: 1,
        description: 'Bağış geliri',
        amount: 25000,
        type: 'Gelir',
        category: 'Bağış',
        date: '2024-01-20',
        status: 'Tamamlandı',
      },
      {
        id: 2,
        description: 'Yardım paketi alımı',
        amount: -15000,
        type: 'Gider',
        category: 'Yardım',
        date: '2024-01-18',
        status: 'Tamamlandı',
      },
      {
        id: 3,
        description: 'Ofis kirası',
        amount: -8000,
        type: 'Gider',
        category: 'İşletme',
        date: '2024-01-15',
        status: 'Tamamlandı',
      },
    ],
  },
  '/users': {
    stats: {
      total: 45,
      active: 38,
      change: 5.2,
      thisMonth: 3,
      monthlyTrend: [35, 38, 40, 42, 44, 45],
    },
    data: [],
  },
  '/donors': {
    stats: {
      total: 234,
      active: 198,
      change: 8.7,
      thisMonth: 12,
      monthlyTrend: [180, 185, 190, 195, 200, 234],
    },
    data: [],
  },
  '/inventory': {
    stats: {
      totalItems: 1250,
      lowStock: 15,
      outOfStock: 3,
      change: 2.1,
      thisMonth: 45,
      monthlyTrend: [1100, 1150, 1200, 1220, 1240, 1250],
    },
    data: [],
  },
  '/projects': {
    stats: {
      total: 67,
      active: 23,
      completed: 44,
      change: 12.3,
      thisMonth: 5,
      monthlyTrend: [45, 52, 58, 62, 65, 67],
    },
    data: [],
  },
  '/meetings': {
    stats: {
      total: 89,
      upcoming: 12,
      completed: 77,
      change: -2.1,
      thisMonth: 8,
      monthlyTrend: [65, 70, 75, 80, 85, 89],
    },
    data: [],
  },
  '/scholarships': {
    stats: {
      total: 156,
      active: 89,
      awarded: 67,
      change: 15.6,
      thisMonth: 12,
      monthlyTrend: [100, 110, 120, 130, 140, 156],
    },
    data: [],
  },
};

// Helper function to get mock data with simulated delay
export const getMockData = (endpoint, delay = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DATA[endpoint] || {});
    }, delay);
  });
};

// Helper function to get mock statistics
export const getMockStats = (endpoint) => {
  return MOCK_DATA[endpoint]?.stats || {
    total: 0,
    active: 0,
    change: 0,
    thisMonth: 0,
  };
};

// Helper function to get mock data array
export const getMockDataArray = (endpoint) => {
  return MOCK_DATA[endpoint]?.data || [];
};
