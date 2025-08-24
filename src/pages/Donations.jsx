import { motion } from 'framer-motion';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Coins, Vault, Building, Plus, Search, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { donationsService } from '../services/donationsService';

const DonationsList = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDonations, setFilteredDonations] = useState([]);

  useEffect(() => {
    loadDonations();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = donations.filter(
        donation =>
          donation.donor_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          donation.donor_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDonations(filtered);
    } else {
      setFilteredDonations(donations);
    }
  }, [donations, searchTerm]);

  const loadDonations = async () => {
    try {
      setLoading(true);
      const response = await donationsService.getAllDonations();
      setDonations(response.data || []);
    } catch (error) {
      console.error('Bağışlar yüklenirken hata:', error);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const formatCurrency = amount => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'onaylandı':
        return { bg: '#dcfce7', color: '#166534' };
      case 'pending':
      case 'beklemede':
        return { bg: '#fef3c7', color: '#92400e' };
      case 'cancelled':
      case 'iptal':
        return { bg: '#fee2e2', color: '#991b1b' };
      default:
        return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  const getStatusText = status => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Onaylandı';
      case 'pending':
        return 'Beklemede';
      case 'cancelled':
        return 'İptal';
      default:
        return status || 'Bilinmiyor';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1a202c',
              margin: 0,
            }}
          >
            Bağış Listesi
          </h2>
          <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>
            Tüm bağış kayıtları ve detayları
          </p>
        </div>
        <motion.button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#10b981',
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
          Yeni Bağış
        </motion.button>
      </div>

      <div className='card'>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
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
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.9rem',
              }}
            />
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <Filter size={18} />
            Filtrele
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div
              style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}
            >
              <div
                className='loading-spinner'
                style={{ margin: '0 auto 1rem' }}
              ></div>
              Bağışlar yükleniyor...
            </div>
          ) : filteredDonations.length === 0 ? (
            <div
              style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}
            >
              {searchTerm
                ? 'Arama kriterlerine uygun bağış bulunamadı.'
                : 'Henüz bağış kaydı bulunmuyor.'}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Bağışçı
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Tutar
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Tarih
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Tür
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((donation, index) => {
                  const statusStyle = getStatusColor(donation.status);
                  return (
                    <motion.tr
                      key={donation.id}
                      style={{ borderBottom: '1px solid #f1f5f9' }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ backgroundColor: '#f8fafc' }}
                    >
                      <td style={{ padding: '1rem', fontWeight: '500' }}>
                        <div>
                          <div>{donation.donor_name || 'Anonim'}</div>
                          {donation.donor_email && (
                            <div
                              style={{ fontSize: '0.8rem', color: '#64748b' }}
                            >
                              {donation.donor_email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          fontWeight: '600',
                          color: '#10b981',
                        }}
                      >
                        {formatCurrency(donation.amount)}
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>
                        {formatDate(donation.created_at || donation.date)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                          }}
                        >
                          {donation.payment_method || donation.type || 'Nakit'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                          }}
                        >
                          {getStatusText(donation.status)}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const DonationsVault = () => {
  const [vaultStats, setVaultStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVaultStats();
  }, [loadVaultStats]);

  const loadVaultStats = async () => {
    try {
      setLoading(true);
      const stats = await donationsService.getDonationStats();

      const formattedStats = [
        {
          label: 'Toplam Kasa',
          value: formatCurrency(stats.total_amount || 0),
          change: '+12%',
          color: '#10b981',
        },
        {
          label: 'Bu Ay',
          value: formatCurrency(stats.monthly_amount || 0),
          change: '+8%',
          color: '#3b82f6',
        },
        {
          label: 'Kurumsal',
          value: formatCurrency(stats.institutional_amount || 0),
          change: '+15%',
          color: '#8b5cf6',
        },
      ];

      setVaultStats(formattedStats);
    } catch (error) {
      console.error('Kasa istatistikleri yüklenirken hata:', error);
      setVaultStats([
        { label: 'Toplam Kasa', value: '₺0', change: '0%', color: '#10b981' },
        { label: 'Bu Ay', value: '₺0', change: '0%', color: '#3b82f6' },
        { label: 'Kurumsal', value: '₺0', change: '0%', color: '#8b5cf6' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = amount => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#1a202c',
          marginBottom: '1rem',
        }}
      >
        Bağış Veznesi
      </h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Bağış kasası yönetimi ve takibi
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <div
            className='loading-spinner'
            style={{ margin: '0 auto 1rem' }}
          ></div>
          Kasa istatistikleri yükleniyor...
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {vaultStats.map((stat, index) => (
            <motion.div
              key={index}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.9rem',
                    color: '#64748b',
                    fontWeight: '500',
                  }}
                >
                  {stat.label}
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: stat.color,
                    fontWeight: '600',
                  }}
                >
                  {stat.change}
                </span>
              </div>
              <div
                style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: '#1e293b',
                }}
              >
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const DonationsInstitutions = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2
      style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#1a202c',
        marginBottom: '1rem',
      }}
    >
      Kurumlar
    </h2>
    <p style={{ color: '#64748b', marginBottom: '2rem' }}>
      Bağışçı kurum yönetimi
    </p>

    <div className='card'>
      <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
        Kurum listesi burada görüntülenecek...
      </p>
    </div>
  </motion.div>
);

const Donations = () => {
  const location = useLocation();

  const navItems = [
    { path: '/donations', label: 'Bağış Listesi', icon: Coins },
    { path: '/donations/vault', label: 'Bağış Veznesi', icon: Vault },
    { path: '/donations/institutions', label: 'Kurumlar', icon: Building },
  ];

  return (
    <div className='page-container'>
      <div className='page-header'>
        <h1 className='page-title'>Bağış Yönetimi</h1>
        <p className='page-subtitle'>Bağış işlemleri ve takibi</p>

        <div className='breadcrumb'>
          <span>Bağış Yönetimi</span>
          <span className='breadcrumb-separator'>&gt;</span>
          <span>
            {navItems.find(item => item.path === location.pathname)?.label ||
              'Bağış Listesi'}
          </span>
        </div>
      </div>

      <motion.nav
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '1rem',
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {navItems.map(item => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                backgroundColor: isActive
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(0,0,0,0)',
                color: isActive ? '#10b981' : '#64748b',
                border: isActive
                  ? '1px solid rgba(16, 185, 129, 0.2)'
                  : '1px solid transparent',
              }}
            >
              <IconComponent size={18} />
              {item.label}
            </Link>
          );
        })}
      </motion.nav>

      <Routes>
        <Route path='/' element={<DonationsList />} />
        <Route path='/vault' element={<DonationsVault />} />
        <Route path='/institutions' element={<DonationsInstitutions />} />
      </Routes>
    </div>
  );
};

export default Donations;
