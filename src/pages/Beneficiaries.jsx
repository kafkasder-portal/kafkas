import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Filter,
  Loader,
  MapPin,
  Phone,
  PlusCircle,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePageAnimation from '../hooks/usePageAnimation';
import { beneficiariesService } from '../services/beneficiariesService';

const Beneficiaries = () => {
  const navigate = useNavigate();
  const { pageClasses, cardClasses, buttonClasses } = usePageAnimation();

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    durum: '',
    aileTipi: '',
    sehir: '',
    uyruk: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    uyruk: 'TC',
    tcPasaport: '',
    dogumTarihi: '',
    telefon: '',
    sehir: '',
    ilce: '',
    mahalle: '',
    adres: '',
    aciklama: '',
    kayitTarihi: new Date().toISOString().split('T')[0],
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const loadBeneficiaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await beneficiariesService.getAllBeneficiaries();
      const beneficiariesData = response.data || [];
      setBeneficiaries(beneficiariesData);
      setFilteredBeneficiaries(beneficiariesData);
    } catch (error) {
      console.error('İhtiyaç sahipleri yüklenirken hata:', error);
      setError('İhtiyaç sahipleri yüklenirken bir hata oluştu.');
      setBeneficiaries([]);
      setFilteredBeneficiaries([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = dateString => {
    if (!dateString) return 'Belirtilmemiş';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  useEffect(() => {
    const safeBeneficiariesForFilter = Array.isArray(beneficiaries)
      ? beneficiaries
      : [];
    const filtered = safeBeneficiariesForFilter.filter(beneficiary => {
      const matchesSearch =
        beneficiary.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beneficiary.soyad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beneficiary.telefon.includes(searchTerm) ||
        beneficiary.tcPasaport.includes(searchTerm);

      const matchesFilters =
        (!filters.durum || beneficiary.durum === filters.durum) &&
        (!filters.aileTipi || beneficiary.aileTipi === filters.aileTipi) &&
        (!filters.sehir ||
          beneficiary.sehir
            .toLowerCase()
            .includes(filters.sehir.toLowerCase())) &&
        (!filters.uyruk || beneficiary.uyruk === filters.uyruk);

      return matchesSearch && matchesFilters;
    });

    setFilteredBeneficiaries(filtered);
    setCurrentPage(1);
  }, [searchTerm, filters, beneficiaries]);

  const getDurumColor = durum => {
    switch (durum) {
      case 'ONAYLANDI':
        return '#10b981';
      case 'INCELEME':
        return '#f59e0b';
      case 'REDDEDILDI':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getDurumText = durum => {
    switch (durum) {
      case 'ONAYLANDI':
        return 'Onaylandı';
      case 'INCELEME':
        return 'İncelemede';
      case 'REDDEDILDI':
        return 'Reddedildi';
      default:
        return durum;
    }
  };

  const getAileTipiText = aileTipi => {
    switch (aileTipi) {
      case 'BIREYSEL':
        return 'Bireysel';
      case 'AILE_REISI':
        return 'Aile Reisi';
      case 'AILE_UYESI':
        return 'Aile Üyesi';
      default:
        return aileTipi;
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.ad.trim()) errors.ad = 'Ad zorunludur';
    if (!formData.soyad.trim()) errors.soyad = 'Soyad zorunludur';
    if (!formData.kayitTarihi) errors.kayitTarihi = 'Kayıt tarihi zorunludur';

    if (formData.uyruk === 'TC' && formData.tcPasaport.length !== 11) {
      errors.tcPasaport = 'TC Kimlik No 11 haneli olmalıdır';
    }

    if (
      formData.telefon &&
      !/^\+90\s\d{3}\s\d{3}\s\d{4}$/.test(formData.telefon)
    ) {
      errors.telefon = 'Telefon formatı: +90 5XX XXX XXXX';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitLoading(true);

    try {
      const response = await beneficiariesService.createBeneficiary(formData);
      const newBeneficiary = response.data;

      setBeneficiaries(prev => [newBeneficiary, ...prev]);
      setShowModal(false);
      setFormData({
        ad: '',
        soyad: '',
        uyruk: 'TC',
        tcPasaport: '',
        dogumTarihi: '',
        telefon: '',
        sehir: '',
        ilce: '',
        mahalle: '',
        adres: '',
        aciklama: '',
        kayitTarihi: new Date().toISOString().split('T')[0],
      });
      setFormErrors({});

      setToast({
        show: true,
        message: 'İhtiyaç sahibi başarıyla eklendi!',
        type: 'success',
      });

      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    } catch (error) {
      console.error('İhtiyaç sahibi eklenirken hata:', error);
      setToast({
        show: true,
        message:
          error.response?.data?.message ||
          'Bir hata oluştu. Lütfen tekrar deneyin.',
        type: 'error',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Pagination
  const safeFilteredBeneficiaries = Array.isArray(filteredBeneficiaries)
    ? filteredBeneficiaries
    : [];
  const totalPages = Math.ceil(safeFilteredBeneficiaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBeneficiaries = safeFilteredBeneficiaries.slice(
    startIndex,
    endIndex
  );

  const safeBeneficiaries = Array.isArray(beneficiaries) ? beneficiaries : [];
  const stats = [
    {
      title: 'Toplam İhtiyaç Sahibi',
      value: safeBeneficiaries.length.toString(),
      icon: Users,
      color: '#3b82f6',
    },
    {
      title: 'Onaylanan',
      value: safeBeneficiaries
        .filter(b => b.durum === 'ONAYLANDI')
        .length.toString(),
      icon: Check,
      color: '#10b981',
    },
    {
      title: 'İncelemede',
      value: safeBeneficiaries
        .filter(b => b.durum === 'INCELEME')
        .length.toString(),
      icon: AlertCircle,
      color: '#f59e0b',
    },
    {
      title: 'Reddedilen',
      value: safeBeneficiaries
        .filter(b => b.durum === 'REDDEDILDI')
        .length.toString(),
      icon: X,
      color: '#ef4444',
    },
  ];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          padding: '2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Loader
            size={48}
            style={{
              animation: 'spin 1s linear infinite',
              color: '#3b82f6',
              marginBottom: '1rem',
            }}
          />
          <p style={{ color: '#64748b', fontSize: '1.125rem' }}>
            İhtiyaç sahipleri yükleniyor...
          </p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ padding: '2rem' }}
      >
        <div className='card' style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertCircle
            size={64}
            style={{ color: '#ef4444', marginBottom: '1rem' }}
          />
          <h2 style={{ color: '#1a202c', marginBottom: '0.5rem' }}>
            Bir Hata Oluştu
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{error}</p>
          <motion.button
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            whileHover={{ backgroundColor: '#2563eb' }}
            onClick={() => window.location.reload()}
          >
            Tekrar Dene
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '2rem' }}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            style={{
              position: 'fixed',
              top: '2rem',
              right: '2rem',
              zIndex: 1000,
              padding: '1rem 1.5rem',
              backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
              color: 'white',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
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
            İhtiyaç Sahipleri
          </h1>
          <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>
            Yardım alan kişi ve ailelerin yönetimi
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
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
        >
          <PlusCircle size={18} />
          Yeni İhtiyaç Sahibi Ekle
        </motion.button>
      </div>

      {/* Statistics */}
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
                borderRadius: '8px',
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

      {/* Search and Filter */}
      <div className='card' style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: '1fr auto',
          }}
        >
          <div style={{ position: 'relative' }}>
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
              placeholder='Ad, soyad, telefon veya TC/Pasaport ile ara...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
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
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            whileHover={{ backgroundColor: '#f1f5f9' }}
          >
            <Filter size={18} />
            Filtrele
          </motion.button>
        </div>

        {/* Filter Options */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <select
            value={filters.durum}
            onChange={e =>
              setFilters(prev => ({ ...prev, durum: e.target.value }))
            }
            style={{
              padding: '0.5rem',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '0.875rem',
            }}
          >
            <option value=''>Tüm Durumlar</option>
            <option value='INCELEME'>İncelemede</option>
            <option value='ONAYLANDI'>Onaylandı</option>
            <option value='REDDEDILDI'>Reddedildi</option>
          </select>

          <select
            value={filters.aileTipi}
            onChange={e =>
              setFilters(prev => ({ ...prev, aileTipi: e.target.value }))
            }
            style={{
              padding: '0.5rem',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '0.875rem',
            }}
          >
            <option value=''>Tüm Aile Tipleri</option>
            <option value='BIREYSEL'>Bireysel</option>
            <option value='AILE_REISI'>Aile Reisi</option>
            <option value='AILE_UYESI'>Aile Üyesi</option>
          </select>

          <input
            type='text'
            placeholder='Şehir'
            value={filters.sehir}
            onChange={e =>
              setFilters(prev => ({ ...prev, sehir: e.target.value }))
            }
            style={{
              padding: '0.5rem',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '0.875rem',
            }}
          />

          <select
            value={filters.uyruk}
            onChange={e =>
              setFilters(prev => ({ ...prev, uyruk: e.target.value }))
            }
            style={{
              padding: '0.5rem',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '0.875rem',
            }}
          >
            <option value=''>Tüm Uyruklar</option>
            <option value='TC'>TC</option>
            <option value='SURIYE'>Suriye</option>
            <option value='AFGANISTAN'>Afganistan</option>
            <option value='IRAK'>Irak</option>
            <option value='DIGER'>Diğer</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {filteredBeneficiaries.length === 0 ? (
        <div className='card' style={{ textAlign: 'center', padding: '3rem' }}>
          <Users size={64} style={{ color: '#64748b', marginBottom: '1rem' }} />
          <h2 style={{ color: '#1a202c', marginBottom: '0.5rem' }}>
            Henüz İhtiyaç Sahibi Yok
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            İlk ihtiyaç sahibini ekleyerek başlayın.
          </p>
          <motion.button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            whileHover={{ backgroundColor: '#2563eb' }}
            onClick={() => setShowModal(true)}
          >
            <PlusCircle size={18} />
            İhtiyaç Sahibi Ekle
          </motion.button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className='card desktop-only'>
            <div style={{ overflowX: 'auto' }}>
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
                      Ad Soyad
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                      }}
                    >
                      Uyruk
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                      }}
                    >
                      Şehir/İlçe
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                      }}
                    >
                      Telefon
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
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                      }}
                    >
                      Kayıt Tarihi
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                      }}
                    >
                      İşlem
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentBeneficiaries.map(beneficiary => (
                    <motion.tr
                      key={beneficiary.id}
                      style={{ borderBottom: '1px solid #f1f5f9' }}
                      whileHover={{ backgroundColor: '#f8fafc' }}
                    >
                      <td style={{ padding: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1a202c' }}>
                            {beneficiary.ad} {beneficiary.soyad}
                          </div>
                          <div
                            style={{ fontSize: '0.875rem', color: '#64748b' }}
                          >
                            {getAileTipiText(beneficiary.aileTipi)}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>
                        {beneficiary.uyruk}
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>
                        {beneficiary.sehir} / {beneficiary.ilce}
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>
                        {beneficiary.telefon}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: getDurumColor(beneficiary.durum),
                            color: 'white',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                          }}
                        >
                          {getDurumText(beneficiary.durum)}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>
                        {formatDate(beneficiary.kayitTarihi)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <motion.button
                            onClick={() =>
                              navigate(
                                `/yardim/ihtiyac-sahipleri/${beneficiary.id}`
                              )
                            }
                            style={{
                              padding: '0.5rem',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            }}
                            whileHover={{ backgroundColor: '#f1f5f9' }}
                          >
                            <Eye size={14} />
                          </motion.button>
                          <motion.button
                            style={{
                              padding: '0.5rem',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            }}
                            whileHover={{ backgroundColor: '#f1f5f9' }}
                          >
                            <Edit size={14} />
                          </motion.button>
                          <motion.button
                            style={{
                              padding: '0.5rem',
                              backgroundColor: '#fef2f2',
                              border: '1px solid #fecaca',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              color: '#ef4444',
                            }}
                            whileHover={{ backgroundColor: '#fee2e2' }}
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className='mobile-only'>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {currentBeneficiaries.map(beneficiary => (
                <motion.div
                  key={beneficiary.id}
                  className='card'
                  style={{ padding: '1.5rem' }}
                  whileHover={{ scale: 1.02 }}
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
                    <div>
                      <h3
                        style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          color: '#1a202c',
                          margin: 0,
                        }}
                      >
                        {beneficiary.ad} {beneficiary.soyad}
                      </h3>
                      <p
                        style={{
                          color: '#64748b',
                          margin: '0.25rem 0',
                          fontSize: '0.875rem',
                        }}
                      >
                        {getAileTipiText(beneficiary.aileTipi)} •{' '}
                        {beneficiary.uyruk}
                      </p>
                    </div>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: getDurumColor(beneficiary.durum),
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}
                    >
                      {getDurumText(beneficiary.durum)}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gap: '0.5rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#64748b',
                        fontSize: '0.875rem',
                      }}
                    >
                      <Phone size={14} />
                      {beneficiary.telefon}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#64748b',
                        fontSize: '0.875rem',
                      }}
                    >
                      <MapPin size={14} />
                      {beneficiary.sehir} / {beneficiary.ilce}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#64748b',
                        fontSize: '0.875rem',
                      }}
                    >
                      <Calendar size={14} />
                      {formatDate(beneficiary.kayitTarihi)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <motion.button
                      onClick={() =>
                        navigate(`/yardim/ihtiyac-sahipleri/${beneficiary.id}`)
                      }
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                      whileHover={{ backgroundColor: '#2563eb' }}
                    >
                      Detaylar
                    </motion.button>
                    <motion.button
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                      whileHover={{ backgroundColor: '#f1f5f9' }}
                    >
                      <Edit size={14} />
                    </motion.button>
                    <motion.button
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        color: '#ef4444',
                      }}
                      whileHover={{ backgroundColor: '#fee2e2' }}
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className='card' style={{ marginTop: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {startIndex + 1}-
                  {Math.min(endIndex, filteredBeneficiaries.length)} /{' '}
                  {filteredBeneficiaries.length} kayıt
                </span>
                <select
                  value={itemsPerPage}
                  onChange={e => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                  }}
                >
                  <option value={10}>10 satır</option>
                  <option value={25}>25 satır</option>
                  <option value={50}>50 satır</option>
                </select>
              </div>

              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <motion.button
                  style={{
                    padding: '0.5rem',
                    backgroundColor: currentPage === 1 ? '#f8fafc' : '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1,
                  }}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  whileHover={
                    currentPage !== 1 ? { backgroundColor: '#f1f5f9' } : {}
                  }
                >
                  <ChevronLeft size={16} />
                </motion.button>

                <span
                  style={{
                    color: '#64748b',
                    fontSize: '0.875rem',
                    padding: '0 1rem',
                  }}
                >
                  {currentPage} / {totalPages}
                </span>

                <motion.button
                  style={{
                    padding: '0.5rem',
                    backgroundColor:
                      currentPage === totalPages ? '#f8fafc' : '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    cursor:
                      currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1,
                  }}
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage(prev => Math.min(prev + 1, totalPages))
                  }
                  whileHover={
                    currentPage !== totalPages
                      ? { backgroundColor: '#f1f5f9' }
                      : {}
                  }
                >
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem',
            }}
            onClick={e => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'auto',
              }}
            >
              <div
                style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h2
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1a202c',
                    margin: 0,
                  }}
                >
                  Yeni İhtiyaç Sahibi Ekle
                </h2>
                <motion.button
                  style={{
                    padding: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0)',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '6px',
                  }}
                  whileHover={{ backgroundColor: '#f1f5f9' }}
                  onClick={() => setShowModal(false)}
                >
                  <X size={20} />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {/* Ad Soyad */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Ad *
                      </label>
                      <input
                        type='text'
                        name='ad'
                        value={formData.ad}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `2px solid ${formErrors.ad ? '#ef4444' : '#e2e8f0'}`,
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          outline: 'none',
                        }}
                      />
                      {formErrors.ad && (
                        <p
                          style={{
                            color: '#ef4444',
                            fontSize: '0.75rem',
                            marginTop: '0.25rem',
                          }}
                        >
                          {formErrors.ad}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Soyad *
                      </label>
                      <input
                        type='text'
                        name='soyad'
                        value={formData.soyad}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `2px solid ${formErrors.soyad ? '#ef4444' : '#e2e8f0'}`,
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          outline: 'none',
                        }}
                      />
                      {formErrors.soyad && (
                        <p
                          style={{
                            color: '#ef4444',
                            fontSize: '0.75rem',
                            marginTop: '0.25rem',
                          }}
                        >
                          {formErrors.soyad}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Uyruk ve TC/Pasaport */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Uyruk
                      </label>
                      <select
                        name='uyruk'
                        value={formData.uyruk}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          outline: 'none',
                        }}
                      >
                        <option value='TC'>TC</option>
                        <option value='SURIYE'>Suriye</option>
                        <option value='AFGANISTAN'>Afganistan</option>
                        <option value='IRAK'>Irak</option>
                        <option value='DIGER'>Diğer</option>
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        TC/Pasaport No
                      </label>
                      <input
                        type='text'
                        name='tcPasaport'
                        value={formData.tcPasaport}
                        onChange={handleInputChange}
                        placeholder={
                          formData.uyruk === 'TC' ? '12345678901' : 'P123456789'
                        }
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `2px solid ${formErrors.tcPasaport ? '#ef4444' : '#e2e8f0'}`,
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          outline: 'none',
                        }}
                      />
                      {formErrors.tcPasaport && (
                        <p
                          style={{
                            color: '#ef4444',
                            fontSize: '0.75rem',
                            marginTop: '0.25rem',
                          }}
                        >
                          {formErrors.tcPasaport}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Doğum Tarihi ve Telefon */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Doğum Tarihi
                      </label>
                      <input
                        type='date'
                        name='dogumTarihi'
                        value={formData.dogumTarihi}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Telefon
                      </label>
                      <input
                        type='text'
                        name='telefon'
                        value={formData.telefon}
                        onChange={handleInputChange}
                        placeholder='+90 5XX XXX XXXX'
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `2px solid ${formErrors.telefon ? '#ef4444' : '#e2e8f0'}`,
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          outline: 'none',
                        }}
                      />
                      {formErrors.telefon && (
                        <p
                          style={{
                            color: '#ef4444',
                            fontSize: '0.75rem',
                            marginTop: '0.25rem',
                          }}
                        >
                          {formErrors.telefon}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email alanı kaldırıldı */}

                  {/* Şehir, İlçe, Mahalle */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Şehir
                      </label>
                      <select
                        name='sehir'
                        value={formData.sehir}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          outline: 'none',
                        }}
                      >
                        <option value=''>Şehir Seçiniz</option>
                        <option value=''>Seçiniz</option>
                        <option value='İstanbul'>İstanbul</option>
                        <option value='Ankara'>Ankara</option>
                        <option value='İzmir'>İzmir</option>
                        <option value='Bursa'>Bursa</option>
                        <option value='Antalya'>Antalya</option>
                        <option value='Adana'>Adana</option>
                        <option value='Konya'>Konya</option>
                        <option value='Gaziantep'>Gaziantep</option>
                        <option value='Mersin'>Mersin</option>
                        <option value='Kayseri'>Kayseri</option>
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        İlçe
                      </label>
                      <select
                        name='ilce'
                        value={formData.ilce}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          outline: 'none',
                        }}
                      >
                        <option value=''>İlçe Seçiniz</option>
                        <option value=''>Seçiniz</option>
                        <option value='Kadıköy'>Kadıköy</option>
                        <option value='Beşiktaş'>Beşiktaş</option>
                        <option value='Şişli'>Şişli</option>
                        <option value='Üsküdar'>Üsküdar</option>
                        <option value='Fatih'>Fatih</option>
                        <option value='Beyoğlu'>Beyoğlu</option>
                        <option value='Bakırköy'>Bakırköy</option>
                        <option value='Maltepe'>Maltepe</option>
                        <option value='Pendik'>Pendik</option>
                        <option value='Kartal'>Kartal</option>
                        <option value='Başakşehir'>Başakşehir</option>
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Mahalle
                      </label>
                      <select
                        name='mahalle'
                        value={formData.mahalle}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          outline: 'none',
                        }}
                      >
                        <option value=''>Mahalle Seçiniz</option>
                        <option value=''>Seçiniz</option>
                        <option value='Acıbadem'>Acıbadem</option>
                        <option value='Bostancı'>Bostancı</option>
                        <option value='Caddebostan'>Caddebostan</option>
                        <option value='Fenerbahçe'>Fenerbahçe</option>
                        <option value='Göztepe'>Göztepe</option>
                        <option value='Kozyatağı'>Kozyatağı</option>
                        <option value='Moda'>Moda</option>
                        <option value='Suadiye'>Suadiye</option>
                        <option value='Şaşkınbakkal'>Şaşkınbakkal</option>
                        <option value='Zühtüpaşa'>Zühtüpaşa</option>
                        <option value='Bahçeşehir'>Bahçeşehir</option>
                        <option value='Kayabaşı'>Kayabaşı</option>
                        <option value='Şamlar'>Şamlar</option>
                        <option value='Ziya Gökalp'>Ziya Gökalp</option>
                        <option value='Altınşehir'>Altınşehir</option>
                        <option value='Başak'>Başak</option>
                        <option value='Güvercintepe'>Güvercintepe</option>
                        <option value='İkitelli OSB'>İkitelli OSB</option>
                        <option value='Metrokent'>Metrokent</option>
                        <option value='Şahintepe'>Şahintepe</option>
                      </select>
                    </div>
                  </div>

                  {/* Adres */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#374151',
                      }}
                    >
                      Adres
                    </label>
                    <textarea
                      name='adres'
                      value={formData.adres}
                      onChange={handleInputChange}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  {/* Aile Tipi ve Durum alanları kaldırıldı */}

                  {/* Kayıt Tarihi */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#374151',
                      }}
                    >
                      Kayıt Tarihi *
                    </label>
                    <input
                      type='date'
                      name='kayitTarihi'
                      value={formData.kayitTarihi}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${formErrors.kayitTarihi ? '#ef4444' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        outline: 'none',
                      }}
                    />
                    {formErrors.kayitTarihi && (
                      <p
                        style={{
                          color: '#ef4444',
                          fontSize: '0.75rem',
                          marginTop: '0.25rem',
                        }}
                      >
                        {formErrors.kayitTarihi}
                      </p>
                    )}
                  </div>

                  {/* Açıklama */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#374151',
                      }}
                    >
                      Açıklama
                    </label>
                    <textarea
                      name='aciklama'
                      value={formData.aciklama}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder='İhtiyaç sahibi hakkında ek bilgiler...'
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    marginTop: '2rem',
                    justifyContent: 'flex-end',
                  }}
                >
                  <motion.button
                    type='button'
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#f8fafc',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                    whileHover={{ backgroundColor: '#f1f5f9' }}
                    onClick={() => setShowModal(false)}
                  >
                    İptal
                  </motion.button>
                  <motion.button
                    type='submit'
                    disabled={submitLoading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      backgroundColor: submitLoading ? '#94a3b8' : '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: submitLoading ? 'not-allowed' : 'pointer',
                    }}
                    whileHover={
                      !submitLoading ? { backgroundColor: '#2563eb' } : {}
                    }
                  >
                    {submitLoading ? (
                      <>
                        <Loader
                          size={16}
                          style={{ animation: 'spin 1s linear infinite' }}
                        />
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Kaydet
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Beneficiaries;
