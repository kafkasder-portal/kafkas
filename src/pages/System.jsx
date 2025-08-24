// import { motion } from 'framer-motion';
import {
  Settings,
  Shield,
  Database,
  Users,
  Bell,
  Key,
  Monitor,
  Activity,
  Plus,
  Search,
  Filter,
} from 'lucide-react';

const System = () => {
  const systemModules = [
    {
      id: 1,
      name: 'Kullanıcı Yönetimi',
      description: 'Sistem kullanıcıları ve yetkilendirme ayarları',
      icon: Users,
      status: 'Aktif',
      lastUpdate: '2024-01-15',
      version: '2.1.0',
    },
    {
      id: 2,
      name: 'Güvenlik Ayarları',
      description: 'Sistem güvenliği ve erişim kontrolü',
      icon: Shield,
      status: 'Aktif',
      lastUpdate: '2024-01-14',
      version: '1.8.2',
    },
    {
      id: 3,
      name: 'Veritabanı Yönetimi',
      description: 'Veritabanı yedekleme ve bakım işlemleri',
      icon: Database,
      status: 'Aktif',
      lastUpdate: '2024-01-13',
      version: '3.0.1',
    },
    {
      id: 4,
      name: 'Bildirim Sistemi',
      description: 'E-posta ve SMS bildirim ayarları',
      icon: Bell,
      status: 'Bakımda',
      lastUpdate: '2024-01-10',
      version: '1.5.3',
    },
  ];

  const systemStats = [
    {
      title: 'Sistem Durumu',
      value: 'Çevrimiçi',
      icon: Monitor,
      color: '#10b981',
    },
    {
      title: 'Aktif Kullanıcı',
      value: '47',
      icon: Users,
      color: '#3b82f6',
    },
    {
      title: 'Sistem Yükü',
      value: '%23',
      icon: Activity,
      color: '#f59e0b',
    },
    {
      title: 'Son Yedekleme',
      value: '2 saat önce',
      icon: Database,
      color: '#ef4444',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Yeni kullanıcı eklendi',
      user: 'Admin',
      timestamp: '2024-01-15 14:30',
      type: 'user',
    },
    {
      id: 2,
      action: 'Sistem yedeklemesi tamamlandı',
      user: 'System',
      timestamp: '2024-01-15 12:00',
      type: 'backup',
    },
    {
      id: 3,
      action: 'Güvenlik ayarları güncellendi',
      user: 'Admin',
      timestamp: '2024-01-15 10:15',
      type: 'security',
    },
    {
      id: 4,
      action: 'Bildirim sistemi bakıma alındı',
      user: 'Tech Team',
      timestamp: '2024-01-15 09:00',
      type: 'maintenance',
    },
  ];

  const getStatusColor = status => {
    switch (status) {
      case 'Aktif':
        return '#10b981';
      case 'Bakımda':
        return '#f59e0b';
      case 'Devre Dışı':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getActivityTypeColor = type => {
    switch (type) {
      case 'user':
        return '#3b82f6';
      case 'backup':
        return '#10b981';
      case 'security':
        return '#ef4444';
      case 'maintenance':
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
            Sistem Yönetimi
          </h1>
          <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>
            Sistem ayarları ve yönetim paneli
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
            <Database size={18} />
            Yedekle
          </motion.button>
          <motion.button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#64748b',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings size={18} />
            Ayarlar
          </motion.button>
        </div>
      </div>

      {/* Sistem İstatistikleri */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {systemStats.map((stat, index) => (
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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '1.5rem',
        }}
      >
        {/* Sistem Modülleri */}
        <div className='card'>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1a202c',
                margin: 0,
              }}
            >
              Sistem Modülleri
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                  }}
                />
                <input
                  type='text'
                  placeholder='Modül ara...'
                  style={{
                    padding: '0.5rem 0.5rem 0.5rem 2rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    width: '150px',
                  }}
                />
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {systemModules.map(module => (
              <motion.div
                key={module.id}
                style={{
                  padding: '1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                }}
                whileHover={{
                  scale: 1.01,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                transition={{ duration: 0.2 }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        backgroundColor: '#f8fafc',
                        color: '#64748b',
                      }}
                    >
                      <module.icon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#1a202c',
                          margin: '0 0 0.25rem 0',
                        }}
                      >
                        {module.name}
                      </h4>
                      <p
                        style={{
                          color: '#64748b',
                          fontSize: '0.875rem',
                          margin: '0 0 0.5rem 0',
                          lineHeight: '1.4',
                        }}
                      >
                        {module.description}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          fontSize: '0.75rem',
                          color: '#64748b',
                        }}
                      >
                        <span>v{module.version}</span>
                        <span>Son güncelleme: {module.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: getStatusColor(module.status),
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}
                    >
                      {module.status}
                    </span>
                    <motion.button
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#f8fafc',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                      }}
                      whileHover={{ backgroundColor: '#f1f5f9' }}
                    >
                      Ayarlar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Son Aktiviteler */}
        <div className='card'>
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '1.5rem',
            }}
          >
            Son Aktiviteler
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {recentActivities.map(activity => (
              <motion.div
                key={activity.id}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                }}
                whileHover={{ backgroundColor: '#f8fafc' }}
                transition={{ duration: 0.2 }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: getActivityTypeColor(activity.type),
                      marginTop: '0.5rem',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: '#1a202c',
                        margin: '0 0 0.25rem 0',
                        fontWeight: '500',
                      }}
                    >
                      {activity.action}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.75rem',
                        color: '#64748b',
                      }}
                    >
                      <span>{activity.user}</span>
                      <span>{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.button
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#f8fafc',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              cursor: 'pointer',
              marginTop: '1rem',
            }}
            whileHover={{ backgroundColor: '#f1f5f9' }}
          >
            Tüm Aktiviteleri Görüntüle
          </motion.button>
        </div>
      </div>

      {/* Hızlı Eylemler */}
      <div className='card' style={{ marginTop: '1.5rem' }}>
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1a202c',
            marginBottom: '1.5rem',
          }}
        >
          Hızlı Eylemler
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <motion.button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              backgroundColor: '#ffffff',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
            whileHover={{ scale: 1.02, borderColor: '#3b82f6' }}
          >
            <Users style={{ color: '#3b82f6' }} size={20} />
            <div>
              <div
                style={{
                  fontWeight: '600',
                  color: '#1a202c',
                  fontSize: '0.875rem',
                }}
              >
                Kullanıcı Ekle
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                Yeni sistem kullanıcısı
              </div>
            </div>
          </motion.button>

          <motion.button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              backgroundColor: '#ffffff',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
            whileHover={{ scale: 1.02, borderColor: '#10b981' }}
          >
            <Database style={{ color: '#10b981' }} size={20} />
            <div>
              <div
                style={{
                  fontWeight: '600',
                  color: '#1a202c',
                  fontSize: '0.875rem',
                }}
              >
                Yedek Al
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                Sistem yedeği oluştur
              </div>
            </div>
          </motion.button>

          <motion.button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              backgroundColor: '#ffffff',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
            whileHover={{ scale: 1.02, borderColor: '#ef4444' }}
          >
            <Shield style={{ color: '#ef4444' }} size={20} />
            <div>
              <div
                style={{
                  fontWeight: '600',
                  color: '#1a202c',
                  fontSize: '0.875rem',
                }}
              >
                Güvenlik Taraması
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                Sistem güvenlik kontrolü
              </div>
            </div>
          </motion.button>

          <motion.button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              backgroundColor: '#ffffff',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
            whileHover={{ scale: 1.02, borderColor: '#f59e0b' }}
          >
            <Activity style={{ color: '#f59e0b' }} size={20} />
            <div>
              <div
                style={{
                  fontWeight: '600',
                  color: '#1a202c',
                  fontSize: '0.875rem',
                }}
              >
                Performans Raporu
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                Sistem performans analizi
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default System;
