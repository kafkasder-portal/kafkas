// import { motion } from 'framer-motion';
import {
  Award,
  Clock,
  Filter,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  UserPlus,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { volunteersService } from '../services/volunteersService';

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);

  // Veri yükleme fonksiyonu
  const loadVolunteers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await volunteersService.getAll();
      setVolunteers(data);
    } catch (_error) {
      setError('Gönüllüler yüklenirken hata oluştu');
      toast.error('Gönüllüler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Gönüllü güncelleme fonksiyonu
  const handleUpdateVolunteer = async (volunteerId, updates) => {
    try {
      await volunteersService.update(volunteerId, updates);
      toast.success('Gönüllü başarıyla güncellendi');
      loadVolunteers();
    } catch (_error) {
      toast.error('Gönüllü güncellenirken hata oluştu');
    }
  };

  // Gönüllü silme fonksiyonu
  const handleDeleteVolunteer = async volunteerId => {
    try {
      await volunteersService.delete(volunteerId);
      toast.success('Gönüllü başarıyla silindi');
      loadVolunteers();
    } catch (_error) {
      toast.error('Gönüllü silinirken hata oluştu');
    }
  };

  // Component mount edildiğinde veri yükle
  useEffect(() => {
    loadVolunteers();
  }, []);

  // Arama ve filtreleme
  useEffect(() => {
    if (!Array.isArray(volunteers)) {
      setFilteredVolunteers([]);
      return;
    }

    const filtered = volunteers.filter(
      volunteer =>
        volunteer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVolunteers(filtered);
  }, [volunteers, searchTerm]);

  const stats = [
    {
      title: 'Toplam Gönüllü',
      value: '247',
      icon: Users,
      color: '#3b82f6',
    },
    {
      title: 'Aktif Gönüllü',
      value: '189',
      icon: UserPlus,
      color: '#10b981',
    },
    {
      title: 'Toplam Saat',
      value: '12,450',
      icon: Clock,
      color: '#f59e0b',
    },
    {
      title: 'Bu Ay Katılım',
      value: '34',
      icon: Award,
      color: '#8b5cf6',
    },
  ];

  const getStatusColor = status => {
    return status === 'Aktif' ? '#10b981' : '#64748b';
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
            Gönüllü Yönetimi
          </h1>
          <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>
            Gönüllü kayıtları ve aktivite takibi
          </p>
        </div>
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
          Yeni Gönüllü
        </motion.button>
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
              placeholder='Gönüllü ara...'
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

      {/* Gönüllü Listesi */}
      <div className='card'>
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1a202c',
            marginBottom: '1.5rem',
          }}
        >
          Gönüllü Listesi
        </h3>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div
              style={{
                display: 'inline-block',
                width: '32px',
                height: '32px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            ></div>
            <p style={{ marginTop: '1rem', color: '#64748b' }}>
              Gönüllüler yükleniyor...
            </p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
            <button
              onClick={loadVolunteers}
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

        {!loading && !error && filteredVolunteers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#64748b' }}>Gönüllü bulunamadı.</p>
          </div>
        )}

        {!loading && !error && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredVolunteers.map(volunteer => (
              <motion.div
                key={volunteer.id}
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
                        {volunteer.name}
                      </h4>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: getStatusColor(volunteer.status),
                          color: 'white',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                        }}
                      >
                        {volunteer.status}
                      </span>
                    </div>
                    <p
                      style={{
                        color: '#667eea',
                        fontWeight: '500',
                        margin: '0 0 0.5rem 0',
                        fontSize: '0.875rem',
                      }}
                    >
                      {volunteer.role}
                    </p>
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
                        {volunteer.email}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <Phone size={14} />
                        {volunteer.phone}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <MapPin size={14} />
                        {volunteer.location}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        fontSize: '0.875rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: '#64748b',
                        }}
                      >
                        <Clock size={14} />
                        <span>{volunteer.hoursWorked} saat</span>
                      </div>
                      <div style={{ color: '#64748b' }}>
                        Katılım: {volunteer.joinDate}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <motion.button
                    onClick={() =>
                      handleUpdateVolunteer(volunteer.id, {
                        status:
                          volunteer.status === 'Aktif' ? 'Pasif' : 'Aktif',
                      })
                    }
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
                    Durum Değiştir
                  </motion.button>
                  <motion.button
                    onClick={() =>
                      handleUpdateVolunteer(volunteer.id, {
                        hoursWorked: volunteer.hoursWorked + 1,
                      })
                    }
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
                    Saat Ekle
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteVolunteer(volunteer.id)}
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

export default Volunteers;
