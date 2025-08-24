import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Filter,
  Heart,
  MapPin,
  Package,
  Plus,
  Search,
  Stethoscope,
  Truck,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { aidService } from '../services/aidService';
import { toast } from 'sonner';

const Aid = () => {
  const [aidPrograms, setAidPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [stats, setStats] = useState({
    totalAid: 0,
    activePrograms: 0,
    beneficiaries: 0,
    distributionPoints: 0,
  });

  // Yardım programlarını yükle
  const loadAidPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await aidService.getAll();
      setAidPrograms(data);

      // İstatistikleri hesapla
      const totalAid = data.length;
      const activePrograms = data.filter(
        program => program.status === 'Aktif'
      ).length;
      const beneficiaries = data.reduce(
        (sum, program) => sum + program.beneficiaries,
        0
      );
      const distributionPoints = new Set(data.map(program => program.location))
        .size;

      setStats({
        totalAid,
        activePrograms,
        beneficiaries,
        distributionPoints,
      });
    } catch (err) {
      setError('Yardım programları yüklenirken hata oluştu');
      toast.error('Yardım programları yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Program güncelle
  const handleUpdateProgram = async (id, updates) => {
    try {
      await aidService.update(id, updates);
      toast.success('Program başarıyla güncellendi');
      loadAidPrograms();
    } catch (err) {
      toast.error('Program güncellenirken hata oluştu');
    }
  };

  // Program sil
  const handleDeleteProgram = async id => {
    try {
      await aidService.delete(id);
      toast.success('Program başarıyla silindi');
      loadAidPrograms();
    } catch (err) {
      toast.error('Program silinirken hata oluştu');
    }
  };

  // Component mount olduğunda verileri yükle
  useEffect(() => {
    loadAidPrograms();
  }, []);

  // Arama filtresi
  useEffect(() => {
    const filtered = aidPrograms.filter(
      program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPrograms(filtered);
  }, [aidPrograms, searchTerm]);

  const getStatusColor = status => {
    switch (status) {
      case 'Aktif':
        return '#10b981';
      case 'Tamamlandı':
        return '#3b82f6';
      case 'Planlandı':
        return '#f59e0b';
      case 'İptal':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getTypeIcon = type => {
    switch (type) {
      case 'Gıda':
        return <Package size={16} />;
      case 'Giyim':
        return <Heart size={16} />;
      case 'Eğitim':
        return <Users size={16} />;
      case 'Sağlık':
        return <Heart size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const statsData = [
    {
      title: 'Toplam Yardım',
      value: stats.totalAid.toString(),
      icon: Heart,
      color: '#ef4444',
    },
    {
      title: 'Aktif Programlar',
      value: stats.activePrograms.toString(),
      icon: Package,
      color: '#10b981',
    },
    {
      title: 'Yararlanıcılar',
      value: stats.beneficiaries.toString(),
      icon: Users,
      color: '#3b82f6',
    },
    {
      title: 'Dağıtım Noktaları',
      value: stats.distributionPoints.toString(),
      icon: MapPin,
      color: '#f59e0b',
    },
  ];

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
            Yardım Programları
          </h1>
          <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>
            İnsani yardım ve destek programları
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to='/aid/hospital-referral'>
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
                textDecoration: 'none',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Stethoscope size={18} />
              Hastane Sevk
            </motion.button>
          </Link>
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
            Yeni Program
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
              placeholder='Yardım programı ara...'
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

      {/* Program Listesi */}
      <div className='card'>
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1a202c',
            marginBottom: '1.5rem',
          }}
        >
          Aktif Programlar
        </h3>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '1rem', color: '#6b7280' }}>
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
              onClick={loadAidPrograms}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {!loading && !error && filteredPrograms.length === 0 && (
          <div
            style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}
          >
            Yardım programı bulunamadı
          </div>
        )}

        {!loading && !error && filteredPrograms.length > 0 && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredPrograms.map(program => (
              <motion.div
                key={program.id}
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
                      {getTypeIcon(program.type)}
                      <h4
                        style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          color: '#1a202c',
                          margin: 0,
                        }}
                      >
                        {program.title}
                      </h4>
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
                        <MapPin size={14} />
                        {program.location}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <Users size={14} />
                        {program.beneficiaries} kişi
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <Calendar size={14} />
                        {program.date}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        Bütçe:
                      </span>
                      <span style={{ fontWeight: '600', color: '#1a202c' }}>
                        ₺{program.budget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: getStatusColor(program.status),
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}
                  >
                    {program.status}
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
                    Detaylar
                  </motion.button>
                  <motion.button
                    onClick={() =>
                      handleUpdateProgram(program.id, {
                        beneficiaries: program.beneficiaries + 10,
                        status: 'Aktif',
                      })
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
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
                    <Truck size={14} />
                    Dağıt
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteProgram(program.id)}
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
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Aid;
