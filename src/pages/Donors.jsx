// import { motion } from 'framer-motion';
import {
  Users,
  Heart,
  TrendingUp,
  DollarSign,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
} from 'lucide-react';

const Donors = () => {
  const donors = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet.yilmaz@email.com',
      phone: '+90 532 123 4567',
      totalDonations: 15000,
      donationCount: 12,
      lastDonation: '2024-01-10',
      category: 'Büyük Bağışçı',
      status: 'Aktif',
    },
    {
      id: 2,
      name: 'Fatma Kaya',
      email: 'fatma.kaya@email.com',
      phone: '+90 533 987 6543',
      totalDonations: 5000,
      donationCount: 8,
      lastDonation: '2024-01-08',
      category: 'Düzenli Bağışçı',
      status: 'Aktif',
    },
    {
      id: 3,
      name: 'Mehmet Demir',
      email: 'mehmet.demir@email.com',
      phone: '+90 534 456 7890',
      totalDonations: 2500,
      donationCount: 3,
      lastDonation: '2023-12-15',
      category: 'Yeni Bağışçı',
      status: 'Pasif',
    },
    {
      id: 4,
      name: 'Ayşe Özkan',
      email: 'ayse.ozkan@email.com',
      phone: '+90 535 321 0987',
      totalDonations: 25000,
      donationCount: 20,
      lastDonation: '2024-01-12',
      category: 'Büyük Bağışçı',
      status: 'Aktif',
    },
  ];

  const stats = [
    {
      title: 'Toplam Bağışçı',
      value: '1,247',
      icon: Users,
      color: '#3b82f6',
    },
    {
      title: 'Aktif Bağışçı',
      value: '892',
      icon: Heart,
      color: '#ef4444',
    },
    {
      title: 'Bu Ay Yeni',
      value: '45',
      icon: TrendingUp,
      color: '#10b981',
    },
    {
      title: 'Ortalama Bağış',
      value: '₺2,450',
      icon: DollarSign,
      color: '#f59e0b',
    },
  ];

  const getCategoryColor = category => {
    switch (category) {
      case 'Büyük Bağışçı':
        return '#ef4444';
      case 'Düzenli Bağışçı':
        return '#10b981';
      case 'Yeni Bağışçı':
        return '#3b82f6';
      default:
        return '#64748b';
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Aktif':
        return '#10b981';
      case 'Pasif':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '2rem' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1a202c',
              margin: 0,
            }}
          >
            Bağışçı Yönetimi
          </h1>
          <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>
            Bağışçı takibi ve ilişki yönetimi
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <motion.button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
            whileHover={{ backgroundColor: '#f1f5f9' }}
          >
            <Mail size={18} />
            Toplu E-posta
          </motion.button>
          <motion.button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} />
            Yeni Bağışçı
          </motion.button>
        </div>
      </div>

      {/* İstatistikler */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className='card'
            style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div
              style={{
                padding: '1rem',
                borderRadius: '12px',
                backgroundColor: `${stat.color}20`,
                color: stat.color,
              }}
            >
              <stat.icon size={24} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1a202c',
                  margin: 0,
                }}
              >
                {stat.value}
              </h3>
              <p
                style={{
                  color: '#64748b',
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.875rem',
                }}
              >
                {stat.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Arama ve Filtre */}
      <div className='card' style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
              }}
            />
            <input
              type='text'
              placeholder='Bağışçı ara...'
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>
          <select
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '0.875rem',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <option value=''>Tüm Kategoriler</option>
            <option value='buyuk'>Büyük Bağışçı</option>
            <option value='duzenli'>Düzenli Bağışçı</option>
            <option value='yeni'>Yeni Bağışçı</option>
          </select>
          <select
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '0.875rem',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <option value=''>Tüm Durumlar</option>
            <option value='aktif'>Aktif</option>
            <option value='pasif'>Pasif</option>
          </select>
          <motion.button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
            whileHover={{ backgroundColor: '#f1f5f9' }}
          >
            <Filter size={18} />
            Filtrele
          </motion.button>
        </div>
      </div>

      {/* Bağışçı Listesi */}
      <div className='card'>
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1a202c',
            marginBottom: '1.5rem',
          }}
        >
          Bağışçı Listesi
        </h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {donors.map(donor => (
            <motion.div
              key={donor.id}
              style={{
                padding: '1.5rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              }}
              transition={{ duration: 0.2 }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#1a202c',
                        margin: 0,
                      }}
                    >
                      {donor.name}
                    </h4>
                    <span
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: getCategoryColor(donor.category),
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}
                    >
                      {donor.category}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      color: '#64748b',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <Mail size={14} />
                      {donor.email}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <Phone size={14} />
                      {donor.phone}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '1rem',
                      marginTop: '1rem',
                    }}
                  >
                    <div
                      style={{
                        padding: '0.75rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          marginBottom: '0.25rem',
                        }}
                      >
                        Toplam Bağış
                      </div>
                      <div
                        style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#1a202c',
                        }}
                      >
                        ₺{donor.totalDonations.toLocaleString()}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '0.75rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          marginBottom: '0.25rem',
                        }}
                      >
                        Bağış Sayısı
                      </div>
                      <div
                        style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#1a202c',
                        }}
                      >
                        {donor.donationCount}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '0.75rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          marginBottom: '0.25rem',
                        }}
                      >
                        Son Bağış
                      </div>
                      <div
                        style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#1a202c',
                        }}
                      >
                        {donor.lastDonation}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '0.75rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          marginBottom: '0.25rem',
                        }}
                      >
                        Ortalama
                      </div>
                      <div
                        style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#1a202c',
                        }}
                      >
                        ₺
                        {Math.round(
                          donor.totalDonations / donor.donationCount
                        ).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: getStatusColor(donor.status),
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  {donor.status}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <motion.button
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                  whileHover={{ backgroundColor: '#dc2626' }}
                >
                  Bağış Geçmişi
                </motion.button>
                <motion.button
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                  whileHover={{ backgroundColor: '#059669' }}
                >
                  İletişim
                </motion.button>
                <motion.button
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f8fafc',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                  whileHover={{ backgroundColor: '#f1f5f9' }}
                >
                  Düzenle
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Donors;
