/**
 * Centralized mock data for development and testing
 * Eliminates duplicate mock data across the application
 */

// Base mock data structure
export const MOCK_DATA = {
  // User related data
  users: [
    {
      id: '1',
      email: 'admin@kafportal.com',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      status: 'active',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'user@kafportal.com',
      first_name: 'Test',
      last_name: 'User',
      role: 'user',
      status: 'active',
      created_at: new Date().toISOString(),
    },
  ],

  // Inventory data
  inventory: [
    {
      id: '1',
      name: 'Pirinç',
      description: '5kg paket pirinç',
      category: 'Gıda',
      quantity: 50,
      unit: 'paket',
      status: 'available',
      location: 'Depo A',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Makarna',
      description: '500g paket makarna',
      category: 'Gıda',
      quantity: 100,
      unit: 'paket',
      status: 'available',
      location: 'Depo A',
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Süt',
      description: '1L süt',
      category: 'Gıda',
      quantity: 30,
      unit: 'adet',
      status: 'low_stock',
      location: 'Depo B',
      created_at: new Date().toISOString(),
    },
  ],

  // Task data
  tasks: [
    {
      id: '1',
      title: 'Depo kontrolü',
      description: 'Haftalık depo kontrolü yapılacak',
      status: 'pending',
      priority: 'medium',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Bağış toplama',
      description: 'Mahalle bağış toplama kampanyası',
      status: 'in_progress',
      priority: 'high',
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    },
  ],

  // Donation data
  donations: [
    {
      id: '1',
      donor_name: 'Ahmet Yılmaz',
      donor_email: 'ahmet@example.com',
      amount: 500,
      currency: 'TRY',
      status: 'completed',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      donor_name: 'Ayşe Demir',
      donor_email: 'ayse@example.com',
      amount: 1000,
      currency: 'TRY',
      status: 'completed',
      created_at: new Date().toISOString(),
    },
  ],

  // Budget data
  budgets: [
    {
      id: '1',
      name: '2024 Genel Bütçe',
      year: 2024,
      total_budget: 500000,
      category: 'Genel',
      description: '2024 yılı genel faaliyet bütçesi',
      status: 'active',
      created_at: new Date().toISOString(),
    },
  ],

  // Project data
  projects: [
    {
      id: '1',
      name: 'Eğitim Desteği Projesi',
      description: 'İhtiyaç sahibi öğrencilere eğitim desteği',
      status: 'active',
      budget: 100000,
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      created_at: new Date().toISOString(),
    },
  ],

  // Volunteer data
  volunteers: [
    {
      id: '1',
      name: 'Mehmet Kaya',
      email: 'mehmet@example.com',
      phone: '+90 555 123 4567',
      status: 'active',
      total_hours: 120,
      created_at: new Date().toISOString(),
    },
  ],

  // Beneficiary data
  beneficiaries: [
    {
      id: '1',
      name: 'Fatma Demir',
      email: 'fatma@example.com',
      phone: '+90 555 987 6543',
      status: 'active',
      category: 'Eğitim',
      created_at: new Date().toISOString(),
    },
  ],
};

// Statistics data
export const MOCK_STATS = {
  donations: {
    total: 150000,
    monthly: 25000,
    change: 12.5,
    count: 45,
    thisMonth: 25000,
    monthlyTrend: [45000, 52000, 48000, 61000, 55000, 67000],
  },
  beneficiaries: {
    total: 120,
    active: 98,
    change: 8.2,
    thisMonth: 8,
    monthlyTrend: [42000, 47000, 51000, 49000, 62000, 58000],
  },
  hospital_referrals: {
    total: 45,
    pending: 12,
    change: -5.3,
    thisMonth: 3,
    monthlyTrend: [38000, 42000, 45000, 41000, 48000, 52000],
  },
  tasks: {
    total: 156,
    active: 42,
    completed: 98,
    overdue: 16,
    thisMonth: 12,
    monthlyTrend: [120, 135, 142, 156, 148, 156],
  },
  volunteers: {
    total: 247,
    active: 189,
    thisMonth: 34,
    totalHours: 12450,
    monthlyTrend: [180, 195, 210, 225, 240, 247],
  },
  aid: {
    programs: 12,
    active: 8,
    beneficiaries: 150,
  },
};

// Mock data generators
export const generateMockData = {
  // Generate random user
  user: (overrides = {}) => ({
    id: Date.now().toString(),
    email: `user${Date.now()}@example.com`,
    first_name: 'Test',
    last_name: 'User',
    role: 'user',
    status: 'active',
    created_at: new Date().toISOString(),
    ...overrides,
  }),

  // Generate random donation
  donation: (overrides = {}) => ({
    id: Date.now().toString(),
    donor_name: 'Test Donor',
    donor_email: 'donor@example.com',
    amount: Math.floor(Math.random() * 1000) + 100,
    currency: 'TRY',
    status: 'completed',
    created_at: new Date().toISOString(),
    ...overrides,
  }),

  // Generate random task
  task: (overrides = {}) => ({
    id: Date.now().toString(),
    title: 'Test Task',
    description: 'Test task description',
    status: 'pending',
    priority: 'medium',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    ...overrides,
  }),

  // Generate random inventory item
  inventoryItem: (overrides = {}) => ({
    id: Date.now().toString(),
    name: 'Test Item',
    description: 'Test item description',
    category: 'Test',
    quantity: Math.floor(Math.random() * 100) + 1,
    unit: 'adet',
    status: 'available',
    location: 'Test Depo',
    created_at: new Date().toISOString(),
    ...overrides,
  }),
};

// Mock API responses
export const createMockApiResponse = (data, status = 200, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data,
        status,
        ok: status >= 200 && status < 300,
      });
    }, delay);
  });
};

// Mock error responses
export const createMockErrorResponse = (message = 'Mock error', status = 500, delay = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(message));
    }, delay);
  });
};
