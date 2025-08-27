import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Heart,
  Calendar,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import PropTypes from 'prop-types';

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data for development
  const mockBeneficiaries = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      phone: '+90 532 123 4567',
      address: 'İstanbul, Türkiye',
      status: 'active',
      category: 'Acil Yardım',
      lastHelp: '2024-01-15',
      totalHelp: 3,
      priority: 'high',
      notes: 'Deprem bölgesinden gelen aile',
    },
    {
      id: 2,
      name: 'Fatma Demir',
      email: 'fatma@example.com',
      phone: '+90 533 234 5678',
      address: 'Ankara, Türkiye',
      status: 'pending',
      category: 'Eğitim',
      lastHelp: '2024-01-10',
      totalHelp: 1,
      priority: 'medium',
      notes: 'Üniversite öğrencisi',
    },
    {
      id: 3,
      name: 'Mehmet Kaya',
      email: 'mehmet@example.com',
      phone: '+90 534 345 6789',
      address: 'İzmir, Türkiye',
      status: 'active',
      category: 'Sağlık',
      lastHelp: '2024-01-20',
      totalHelp: 5,
      priority: 'high',
      notes: 'Kronik hastalık tedavisi',
    },
    {
      id: 4,
      name: 'Ayşe Özkan',
      email: 'ayse@example.com',
      phone: '+90 535 456 7890',
      address: 'Bursa, Türkiye',
      status: 'inactive',
      category: 'Gıda',
      lastHelp: '2023-12-15',
      totalHelp: 2,
      priority: 'low',
      notes: 'Geçici yardım talebi',
    },
    {
      id: 5,
      name: 'Ali Çelik',
      email: 'ali@example.com',
      phone: '+90 536 567 8901',
      address: 'Antalya, Türkiye',
      status: 'active',
      category: 'Barınma',
      lastHelp: '2024-01-18',
      totalHelp: 4,
      priority: 'high',
      notes: 'Evsiz aile',
    },
  ];

  // Load beneficiaries data
  useEffect(() => {
    const loadBeneficiaries = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBeneficiaries(mockBeneficiaries);
      } catch (error) {
        console.error('Error loading beneficiaries:', error);
        setBeneficiaries([]);
      } finally {
        setLoading(false);
      }
    };

    loadBeneficiaries();
  }, []);

  // Filter and search beneficiaries
  const filteredBeneficiaries = beneficiaries.filter(beneficiary => {
    const matchesSearch = beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         beneficiary.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         beneficiary.phone.includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || beneficiary.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBeneficiaries.length / itemsPerPage);
  const paginatedBeneficiaries = filteredBeneficiaries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle beneficiary selection
  const handleBeneficiaryClick = useCallback((beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setShowModal(true);
  }, []);

  // Handle status change
  const handleStatusChange = useCallback((beneficiaryId, newStatus) => {
    setBeneficiaries(prev => 
      prev.map(b => b.id === beneficiaryId ? { ...b, status: newStatus } : b)
    );
  }, []);

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'active':
        return { color: '#10b981', icon: CheckCircle, text: 'Aktif' };
      case 'pending':
        return { color: '#f59e0b', icon: Clock, text: 'Beklemede' };
      case 'inactive':
        return { color: '#6b7280', icon: AlertTriangle, text: 'Pasif' };
      default:
        return { color: '#6b7280', icon: AlertTriangle, text: 'Bilinmiyor' };
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#dc2626';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">İhtiyaç Sahipleri</h1>
              <p className="text-gray-600">Toplam {beneficiaries.length} kayıt</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Kayıt
          </motion.button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="İhtiyaç sahibi ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="pending">Beklemede</option>
            <option value="inactive">Pasif</option>
          </select>
        </div>
      </div>

      {/* Beneficiaries Grid */}
      {paginatedBeneficiaries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBeneficiaries.map((beneficiary) => {
            // Validate beneficiary data
            if (!beneficiary || !beneficiary.id) {
              return null;
            }
            
            const statusInfo = getStatusInfo(beneficiary.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <motion.div
                key={beneficiary.id}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden cursor-pointer"
                onClick={() => handleBeneficiaryClick(beneficiary)}
              >
                {/* Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{beneficiary.name}</h3>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getPriorityColor(beneficiary.priority) }}
                      />
                      <StatusIcon className="w-5 h-5" style={{ color: statusInfo.color }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Heart className="w-4 h-4" />
                    <span>{beneficiary.category}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{beneficiary.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{beneficiary.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{beneficiary.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Son yardım: {beneficiary.lastHelp}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Toplam yardım: {beneficiary.totalHelp}
                    </span>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle edit
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 text-gray-400 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">İhtiyaç sahibi bulunamadı</h3>
          <p className="text-gray-500">Arama kriterlerinize uygun ihtiyaç sahibi bulunamadı.</p>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Önceki
          </motion.button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 border rounded-lg ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </motion.button>
          ))}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sonraki
          </motion.button>
        </div>
      )}

      {/* Detail Modal */}
      {showModal && selectedBeneficiary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">İhtiyaç Sahibi Detayı</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Ad Soyad</label>
                <p className="text-gray-900">{selectedBeneficiary.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">E-posta</label>
                <p className="text-gray-900">{selectedBeneficiary.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Telefon</label>
                <p className="text-gray-900">{selectedBeneficiary.phone}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Adres</label>
                <p className="text-gray-900">{selectedBeneficiary.address}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Kategori</label>
                <p className="text-gray-900">{selectedBeneficiary.category}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Durum</label>
                <div className="flex items-center gap-2">
                  {(() => {
                    const statusInfo = getStatusInfo(selectedBeneficiary.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <>
                        <StatusIcon className="w-4 h-4" style={{ color: statusInfo.color }} />
                        <span style={{ color: statusInfo.color }}>{statusInfo.text}</span>
                      </>
                    );
                  })()}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Notlar</label>
                <p className="text-gray-900">{selectedBeneficiary.notes}</p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Düzenle
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                onClick={() => setShowModal(false)}
              >
                Kapat
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Beneficiaries;
