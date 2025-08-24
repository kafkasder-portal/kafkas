import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Target,
  PieChart,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
} from 'lucide-react';
import { fundService } from '../services/fundService';
import { toast } from 'sonner';

const Fund = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFunds, setFilteredFunds] = useState([]);
  const [stats, setStats] = useState({
    totalFunds: 0,
    activeCampaigns: 0,
    totalTarget: 0,
    totalCollected: 0,
  });

  // Fon verilerini yükle
  const loadFunds = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fundService.getAll();
      setFunds(data);

      // İstatistikleri hesapla
      const totalFunds = data.length;
      const activeCampaigns = data.filter(
        fund => fund.status === 'Aktif'
      ).length;
      const totalTarget = data.reduce(
        (sum, fund) => sum + fund.targetAmount,
        0
      );
      const totalCollected = data.reduce(
        (sum, fund) => sum + fund.currentAmount,
        0
      );

      setStats({
        totalFunds,
        activeCampaigns,
        totalTarget,
        totalCollected,
      });
    } catch (_error) {
      setError('Fon verileri yüklenirken hata oluştu');
      toast.error('Fon verileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Fon güncelle
  const handleUpdateFund = async (id, updates) => {
    try {
      await fundService.update(id, updates);
      toast.success('Fon başarıyla güncellendi');
      loadFunds();
    } catch (_error) {
      toast.error('Fon güncellenirken hata oluştu');
    }
  };

  // Fon sil
  const handleDeleteFund = async id => {
    try {
      await fundService.delete(id);
      toast.success('Fon başarıyla silindi');
      loadFunds();
    } catch (_error) {
      toast.error('Fon silinirken hata oluştu');
    }
  };

  // Component mount olduğunda verileri yükle
  useEffect(() => {
    loadFunds();
  }, []);

  // Arama filtresi
  useEffect(() => {
    const filtered = funds.filter(
      fund =>
        fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fund.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fund.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFunds(filtered);
  }, [funds, searchTerm]);

  const statsData = [
    {
      title: 'Toplam Fon',
      value: stats.totalFunds.toString(),
      icon: PieChart,
      color: '#3b82f6',
    },
    {
      title: 'Aktif Kampanya',
      value: stats.activeCampaigns.toString(),
      icon: Target,
      color: '#10b981',
    },
    {
      title: 'Toplam Hedef',
      value: `₺${(stats.totalTarget / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: '#f59e0b',
    },
    {
      title: 'Toplanan Miktar',
      value: `₺${(stats.totalCollected / 1000000).toFixed(1)}M`,
      icon: TrendingUp,
      color: '#ef4444',
    },
  ];

  const getCategoryColor = category => {
    switch (category) {
      case 'Acil Yardım':
        return '#ef4444';
      case 'Eğitim':
        return '#3b82f6';
      case 'Sağlık':
        return '#10b981';
      case 'Gıda':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Aktif':
        return '#10b981';
      case 'Beklemede':
        return '#f59e0b';
      case 'Tamamlandı':
        return '#64748b';
      case 'İptal':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getProgressColor = percentage => {
    if (percentage >= 100) return '#10b981';
    if (percentage >= 75) return '#3b82f6';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
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
            Fon Yönetimi
          </h1>
          <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>
            Bağış fonları ve kampanya yönetimi
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
            <PieChart size={18} />
            Raporlar
          </motion.button>
          <motion.button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
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
            Yeni Fon
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
        {statsData.map((stat, index) => (
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
              placeholder='Fon ara...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
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
            <option value='acil'>Acil Yardım</option>
            <option value='egitim'>Eğitim</option>
            <option value='saglik'>Sağlık</option>
            <option value='gida'>Gıda</option>
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
            <option value='beklemede'>Beklemede</option>
            <option value='tamamlandi'>Tamamlandı</option>
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

      {/* Fon Listesi */}
      <div className='card'>
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1a202c',
            marginBottom: '1.5rem',
          }}
        >
          Fon Listesi
        </h3>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '1rem', color: '#64748b' }}>
              Yükleniyor...
            </div>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div
              style={{
                fontSize: '1rem',
                color: '#ef4444',
                marginBottom: '1rem',
              }}
            >
              {error}
            </div>
            <button
              onClick={loadFunds}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {!loading && !error && filteredFunds.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '1rem', color: '#64748b' }}>
              Fon bulunamadı
            </div>
          </div>
        )}

        {!loading && !error && filteredFunds.length > 0 && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredFunds.map(fund => {
              const progressPercentage =
                (fund.currentAmount / fund.targetAmount) * 100;
              return (
                <motion.div
                  key={fund.id}
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
                          {fund.name}
                        </h4>
                        <span
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: getCategoryColor(fund.category),
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                          }}
                        >
                          {fund.category}
                        </span>
                      </div>
                      <p
                        style={{
                          color: '#64748b',
                          fontSize: '0.875rem',
                          marginBottom: '1rem',
                          lineHeight: '1.5',
                        }}
                      >
                        {fund.description}
                      </p>

                      {/* İlerleme Çubuğu */}
                      <div style={{ marginBottom: '1rem' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.5rem',
                          }}
                        >
                          <span
                            style={{ fontSize: '0.875rem', color: '#64748b' }}
                          >
                            İlerleme
                          </span>
                          <span
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: '#1a202c',
                            }}
                          >
                            ₺{fund.currentAmount.toLocaleString()} / ₺
                            {fund.targetAmount.toLocaleString()}
                          </span>
                        </div>
                        <div
                          style={{
                            width: '100%',
                            height: '12px',
                            backgroundColor: '#e2e8f0',
                            borderRadius: '6px',
                            overflow: 'hidden',
                          }}
                        >
                          <motion.div
                            style={{
                              height: '100%',
                              backgroundColor:
                                getProgressColor(progressPercentage),
                              borderRadius: '6px',
                            }}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(progressPercentage, 100)}%`,
                            }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '0.5rem',
                          }}
                        >
                          <span
                            style={{ fontSize: '0.75rem', color: '#64748b' }}
                          >
                            %{progressPercentage.toFixed(1)} tamamlandı
                          </span>
                          <span
                            style={{ fontSize: '0.75rem', color: '#64748b' }}
                          >
                            Kalan: ₺
                            {(
                              fund.targetAmount - fund.currentAmount
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Detaylar */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(150px, 1fr))',
                          gap: '1rem',
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
                            Bağışçı Sayısı
                          </div>
                          <div
                            style={{
                              fontSize: '1rem',
                              fontWeight: '600',
                              color: '#1a202c',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <Users size={14} />
                            {fund.donorCount}
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
                            Başlangıç
                          </div>
                          <div
                            style={{
                              fontSize: '1rem',
                              fontWeight: '600',
                              color: '#1a202c',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <Calendar size={14} />
                            {fund.startDate}
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
                            Bitiş
                          </div>
                          <div
                            style={{
                              fontSize: '1rem',
                              fontWeight: '600',
                              color: '#1a202c',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <Calendar size={14} />
                            {fund.endDate}
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
                            Ortalama Bağış
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
                              fund.currentAmount / fund.donorCount
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: getStatusColor(fund.status),
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}
                    >
                      {fund.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <motion.button
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                      whileHover={{ backgroundColor: '#2563eb' }}
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
                      Kampanya Paylaş
                    </motion.button>
                    <motion.button
                      onClick={() =>
                        handleUpdateFund(fund.id, {
                          currentAmount: fund.currentAmount + 1000,
                        })
                      }
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                      whileHover={{ backgroundColor: '#d97706' }}
                    >
                      Bağış Ekle
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteFund(fund.id)}
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
                      Sil
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Fund;
