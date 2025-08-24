// =====================================================
// MOCK API CLIENT FOR DEVELOPMENT/FALLBACK
// =====================================================

// Mock data
const MOCK_DATA = {
  users: [
    {
      id: '1',
      email: 'admin@kafportal.com',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      email: 'user@kafportal.com',
      first_name: 'Test',
      last_name: 'User',
      role: 'user',
      status: 'active',
      created_at: new Date().toISOString()
    }
  ],
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
      created_at: new Date().toISOString()
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
      created_at: new Date().toISOString()
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
      created_at: new Date().toISOString()
    }
  ],
  tasks: [
    {
      id: '1',
      title: 'Depo kontrolü',
      description: 'Haftalık depo kontrolü yapılacak',
      status: 'pending',
      priority: 'medium',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Bağış toplama',
      description: 'Mahalle bağış toplama kampanyası',
      status: 'in_progress',
      priority: 'high',
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    }
  ],
  donations: [
    {
      id: '1',
      donor_name: 'Ahmet Yılmaz',
      donor_email: 'ahmet@example.com',
      amount: 500,
      currency: 'TRY',
      status: 'completed',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      donor_name: 'Ayşe Demir',
      donor_email: 'ayse@example.com',
      amount: 1000,
      currency: 'TRY',
      status: 'completed',
      created_at: new Date().toISOString()
    }
  ]
};

// Mock API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API Client
class MockApiClient {
  constructor() {
    this.baseURL = 'mock://api';
  }

  async request(endpoint, options = {}) {
    // Simulate network delay
    await delay(500);

    const method = options.method || 'GET';
    const resourceName = endpoint.split('/')[1];
    

    switch (method) {
      case 'GET':
        if (MOCK_DATA[resourceName]) {
          return {
            success: true,
            data: MOCK_DATA[resourceName],
            count: MOCK_DATA[resourceName].length
          };
        }
        break;

      case 'POST':
        if (MOCK_DATA[resourceName]) {
          const newItem = {
            id: (MOCK_DATA[resourceName].length + 1).toString(),
            ...JSON.parse(options.body),
            created_at: new Date().toISOString()
          };
          MOCK_DATA[resourceName].push(newItem);
          return {
            success: true,
            data: newItem
          };
        }
        break;

      case 'PUT':
      case 'PATCH':
        // Update logic would go here
        return {
          success: true,
          message: 'Updated successfully'
        };

      case 'DELETE':
        // Delete logic would go here
        return {
          success: true,
          message: 'Deleted successfully'
        };
    }

    // Default response
    return {
      success: true,
      data: [],
      message: 'Mock API response'
    };
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const mockApiClient = new MockApiClient();
export default mockApiClient;
