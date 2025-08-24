import { AnimatePresence } from 'framer-motion';
import {
  Activity,
  Ambulance,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Heart,
  Plus,
  Search,
  Stethoscope,
  User,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { hospitalReferralsService } from '../services/hospitalReferralsService';

const HospitalReferral = () => {
  const [referrals, setReferrals] = useState([]);
  const [filteredReferrals, setFilteredReferrals] = useState([]);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [modalMode, setModalMode] = useState('view'); // 'view', 'add', 'edit'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
  });
  const itemsPerPage = 10;

  useEffect(() => {
    loadReferrals();
    loadStats();
  }, []);

  const loadReferrals = async () => {
    try {
      setLoading(true);
      const response = await hospitalReferralsService.getAllHospitalReferrals();
      const referralsData = response.data || [];
      setReferrals(referralsData);
      setFilteredReferrals(referralsData);
    } catch (error) {
      console.error('Hastane sevkleri yüklenirken hata:', error);
      setReferrals([]);
      setFilteredReferrals([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsResponse = await hospitalReferralsService.getReferralStats();
      setStats(
        statsResponse.data || {
          total: 0,
          pending: 0,
          approved: 0,
          completed: 0,
        }
      );
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    }
  };

  // Filter referrals
  useEffect(() => {
    if (!Array.isArray(referrals)) {
      setFilteredReferrals([]);
      return;
    }

    const filtered = referrals.filter(referral => {
      const matchesSearch =
        searchTerm === '' ||
        referral.patientName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        referral.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.referredHospital
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || referral.status === statusFilter;
      const matchesUrgency =
        urgencyFilter === 'all' || referral.urgency === urgencyFilter;

      return matchesSearch && matchesStatus && matchesUrgency;
    });

    setFilteredReferrals(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, urgencyFilter, referrals]);

  const getStatusColor = status => {
    const colors = {
      pending: '#f59e0b',
      approved: '#10b981',
      rejected: '#ef4444',
      completed: '#8b5cf6',
    };
    return colors[status] || '#6b7280';
  };

  const getUrgencyColor = urgency => {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
    };
    return colors[urgency] || '#6b7280';
  };

  const getStatusText = status => {
    const texts = {
      pending: 'Beklemede',
      approved: 'Onaylandı',
      rejected: 'Reddedildi',
      completed: 'Tamamlandı',
    };
    return texts[status] || status;
  };

  const getUrgencyText = urgency => {
    const texts = {
      low: 'Düşük',
      medium: 'Orta',
      high: 'Yüksek',
    };
    return texts[urgency] || urgency;
  };

  const openModal = (mode, referral = null) => {
    setModalMode(mode);
    setSelectedReferral(referral);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReferral(null);
    setModalMode('view');
  };

  const handleStatusChange = async (referralId, newStatus) => {
    try {
      await hospitalReferralsService.updateReferralStatus(
        referralId,
        newStatus
      );
      setReferrals(prev =>
        prev.map(r => (r.id === referralId ? { ...r, status: newStatus } : r))
      );
      // İstatistikleri yeniden yükle
      loadStats();
    } catch (error) {
      console.error('Durum güncellenirken hata:', error);
    }
  };

  const formatDate = dateString => {
    if (!dateString) return 'Belirtilmemiş';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const formatCurrency = amount => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Pagination
  const safeFilteredReferrals = Array.isArray(filteredReferrals)
    ? filteredReferrals
    : [];
  const totalPages = Math.ceil(safeFilteredReferrals.length / itemsPerPage);
  const paginatedReferrals = safeFilteredReferrals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <motion.div
      className='card'
      style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `4px solid ${color}`,
      }}
      whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1a202c',
              margin: 0,
            }}
          >
            {loading ? '...' : value}
          </h3>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: '0.25rem 0 0 0',
            }}
          >
            {title}
          </p>
          {subtitle && (
            <p
              style={{
                fontSize: '0.75rem',
                color,
                margin: '0.25rem 0 0 0',
                fontWeight: '500',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div
          style={{
            padding: '1rem',
            backgroundColor: `${color}15`,
            borderRadius: '12px',
          }}
        >
          <Icon size={24} color={color} />
        </div>
      </div>
    </motion.div>
  );

  const ReferralCard = ({ referral }) => (
    <motion.div
      className='card'
      style={{ marginBottom: '1rem', cursor: 'pointer' }}
      whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
      onClick={() => openModal('view', referral)}
      layout
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: `${getUrgencyColor(referral.urgency)}15`,
              borderRadius: '12px',
            }}
          >
            <Heart size={20} color={getUrgencyColor(referral.urgency)} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
              {referral.patientName}
            </h3>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: '0.25rem 0 0 0',
              }}
            >
              {referral.age} yaş • {referral.gender}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: `${getStatusColor(referral.status)}15`,
              color: getStatusColor(referral.status),
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600',
              textTransform: 'uppercase',
            }}
          >
            {getStatusText(referral.status)}
          </div>
          <div
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: `${getUrgencyColor(referral.urgency)}15`,
              color: getUrgencyColor(referral.urgency),
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600',
              textTransform: 'uppercase',
            }}
          >
            {getUrgencyText(referral.urgency)}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            <Stethoscope size={16} color='#6b7280' />
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Tanı:
            </span>
          </div>
          <p
            style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              margin: 0,
            }}
          >
            {referral.diagnosis}
          </p>
        </div>
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            <Building size={16} color='#6b7280' />
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Hastane:
            </span>
          </div>
          <p
            style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              margin: 0,
            }}
          >
            {referral.referredHospital}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid #f3f4f6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={14} color='#6b7280' />
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Randevu: {formatDate(referral.appointmentDate)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#10b981',
            }}
          >
            {formatCurrency(referral.cost)}
          </span>
          {referral.transportNeeded && <Ambulance size={14} color='#3b82f6' />}
        </div>
      </div>
    </motion.div>
  );

  const ReferralModal = () => {
    if (!isModalOpen || !selectedReferral) return null;

    return (
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
      >
        <motion.div
          style={{
            background: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.5rem',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                Hastane Sevk Detayları
              </h2>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: '0.25rem 0 0 0',
                }}
              >
                {selectedReferral.patientName} - #{selectedReferral.id}
              </p>
            </div>
            <button
              onClick={closeModal}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '8px',
              }}
            >
              <XCircle size={20} color='#6b7280' />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '1.5rem' }}>
            {/* Patient Info */}
            <div style={{ marginBottom: '2rem' }}>
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <User size={18} color='#667eea' />
                Hasta Bilgileri
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  backgroundColor: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      display: 'block',
                    }}
                  >
                    Ad Soyad
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {selectedReferral.patientName}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      display: 'block',
                    }}
                  >
                    TC Kimlik
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {selectedReferral.nationalId}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      display: 'block',
                    }}
                  >
                    Yaş
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {selectedReferral.age}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      display: 'block',
                    }}
                  >
                    Cinsiyet
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {selectedReferral.gender}
                  </span>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      display: 'block',
                    }}
                  >
                    Adres
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {selectedReferral.address}
                  </span>
                </div>
              </div>
            </div>

            {/* Medical Info */}
            <div style={{ marginBottom: '2rem' }}>
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Stethoscope size={18} color='#667eea' />
                Tıbbi Bilgiler
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  backgroundColor: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      display: 'block',
                    }}
                  >
                    Tanı
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {selectedReferral.diagnosis}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      display: 'block',
                    }}
                  >
                    Aciliyet
                  </span>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: `${getUrgencyColor(selectedReferral.urgency)}15`,
                      color: getUrgencyColor(selectedReferral.urgency),
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}
                  >
                    {getUrgencyText(selectedReferral.urgency)}
                  </div>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      display: 'block',
                    }}
                  >
                    Hastane
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {selectedReferral.referredHospital}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      display: 'block',
                    }}
                  >
                    Bölüm
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {selectedReferral.referredDepartment}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      display: 'block',
                    }}
                  >
                    Doktor
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {selectedReferral.doctorName}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      display: 'block',
                    }}
                  >
                    Randevu Tarihi
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {formatDate(selectedReferral.appointmentDate)}
                  </span>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      display: 'block',
                    }}
                  >
                    Notlar
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {selectedReferral.notes}
                  </span>
                </div>
              </div>
            </div>

            {/* Status & Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <motion.button
                  onClick={() =>
                    handleStatusChange(selectedReferral.id, 'approved')
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckCircle size={16} />
                  Onayla
                </motion.button>

                <motion.button
                  onClick={() =>
                    handleStatusChange(selectedReferral.id, 'rejected')
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <XCircle size={16} />
                  Reddet
                </motion.button>
              </div>

              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#10b981',
                  }}
                >
                  {formatCurrency(selectedReferral.cost)}
                </span>
                {selectedReferral.transportNeeded && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <Ambulance size={16} color='#3b82f6' />
                    <span style={{ fontSize: '0.75rem', color: '#3b82f6' }}>
                      Ulaşım
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className='page-container'>
      {/* Header */}
      <motion.div
        className='page-header'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className='page-title'>Hastane Sevk Yönetimi</h1>
          <p className='page-subtitle'>
            Hasta sevk işlemlerini yönetin ve takip edin
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <motion.button
            onClick={() => openModal('add')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={16} />
            Yeni Sevk
          </motion.button>

          <motion.button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download size={16} />
            Export
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <StatCard
          title='Toplam Sevk'
          value={stats.total}
          icon={FileText}
          color='#667eea'
          subtitle='Bu ay'
        />
        <StatCard
          title='Bekleyen Sevkler'
          value={stats.pending}
          icon={Clock}
          color='#f59e0b'
          subtitle='Onay bekliyor'
        />
        <StatCard
          title='Onaylanan'
          value={stats.approved}
          icon={CheckCircle}
          color='#10b981'
          subtitle='Aktif sevkler'
        />
        <StatCard
          title='Tamamlanan'
          value={stats.completed}
          icon={Activity}
          color='#8b5cf6'
          subtitle='Başarılı'
        />
      </div>

      {/* Filters */}
      <motion.div
        className='card'
        style={{ marginBottom: '2rem' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                color='#6b7280'
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <input
                type='text'
                placeholder='Hasta, tanı veya hastane ara...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                }}
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
            }}
          >
            <option value='all'>Tüm Durumlar</option>
            <option value='pending'>Beklemede</option>
            <option value='approved'>Onaylandı</option>
            <option value='rejected'>Reddedildi</option>
            <option value='completed'>Tamamlandı</option>
          </select>

          <select
            value={urgencyFilter}
            onChange={e => setUrgencyFilter(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
            }}
          >
            <option value='all'>Tüm Aciliyet Seviyeleri</option>
            <option value='low'>Düşük</option>
            <option value='medium'>Orta</option>
            <option value='high'>Yüksek</option>
          </select>
        </div>
      </motion.div>

      {/* Referrals List */}
      <motion.div
        style={{ marginBottom: '2rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '3rem 0',
            }}
          >
            <div
              style={{
                width: '3rem',
                height: '3rem',
                border: '2px solid #e5e7eb',
                borderTop: '2px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            ></div>
          </div>
        ) : filteredReferrals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <Stethoscope
              size={48}
              color='#9ca3af'
              style={{ margin: '0 auto 1rem' }}
            />
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: '500',
                color: '#111827',
                marginBottom: '0.5rem',
              }}
            >
              Sevk bulunamadı
            </h3>
            <p style={{ color: '#6b7280' }}>Henüz hastane sevki bulunmuyor.</p>
          </div>
        ) : (
          <AnimatePresence mode='popLayout'>
            {paginatedReferrals.map(referral => (
              <ReferralCard key={referral.id} referral={referral} />
            ))}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: currentPage === i + 1 ? '#667eea' : 'white',
                color: currentPage === i + 1 ? 'white' : '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {i + 1}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        <ReferralModal />
      </AnimatePresence>
    </div>
  );
};

export default HospitalReferral;
