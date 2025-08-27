import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import {
  DollarSign,
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  User,
  CreditCard,
  Building,
  Gift,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Phone,
} from 'lucide-react';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);



  // Load donations data
  useEffect(() => {
    const loadDonations = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for development
      const mockDonations = [
        {
          id: 1,
          donorName: 'Ahmet Yılmaz',
          email: 'ahmet@example.com',
          phone: '+90 532 123 4567',
          amount: 5000,
          currency: 'TRY',
          type: 'bank_transfer',
          status: 'completed',
          date: '2024-01-20',
          category: 'Genel Bağış',
          notes: 'Deprem bölgesi için bağış',
          anonymous: false,
          receipt: true,
        },
        {
          id: 2,
          donorName: 'Anonim Bağışçı',
          email: 'anonymous@example.com',
          phone: '',
          amount: 25000,
          currency: 'TRY',
          type: 'credit_card',
          status: 'completed',
          date: '2024-01-19',
          category: 'Acil Yardım',
          notes: 'Büyük bağış',
          anonymous: true,
          receipt: false,
        },
        {
          id: 3,
          donorName: 'Fatma Demir',
          email: 'fatma@example.com',
          phone: '+90 533 234 5678',
          amount: 1000,
          currency: 'TRY',
          type: 'cash',
          status: 'pending',
          date: '2024-01-18',
          category: 'Eğitim',
          notes: 'Öğrenci bursu için',
          anonymous: false,
          receipt: true,
        },
        {
          id: 4,
          donorName: 'Mehmet Kaya',
          email: 'mehmet@example.com',
          phone: '+90 534 345 6789',
          amount: 7500,
          currency: 'TRY',
          type: 'bank_transfer',
          status: 'completed',
          date: '2024-01-17',
          category: 'Sağlık',
          notes: 'Hastane tedavisi için',
          anonymous: false,
          receipt: true,
        },
        {
          id: 5,
          donorName: 'Ayşe Özkan',
          email: 'ayse@example.com',
          phone: '+90 535 456 7890',
          amount: 3000,
          currency: 'TRY',
          type: 'credit_card',
          status: 'failed',
          date: '2024-01-16',
          category: 'Gıda',
          notes: 'Gıda yardımı',
          anonymous: false,
          receipt: true,
        },
      ];
      
      setDonations(mockDonations);
      setLoading(false);
    };

    loadDonations();
  }, []);

  // Filter and search donations
  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatusFilter = filterStatus === 'all' || donation.status === filterStatus;
    const matchesTypeFilter = filterType === 'all' || donation.type === filterType;
    
    return matchesSearch && matchesStatusFilter && matchesTypeFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const paginatedDonations = filteredDonations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const completedDonations = donations.filter(d => d.status === 'completed').length;
  const pendingDonations = donations.filter(d => d.status === 'pending').length;

  // Handle donation selection
  const handleDonationClick = useCallback((donation) => {
    setSelectedDonation(donation);
    setShowModal(true);
  }, []);

  // Handle status change
  const _handleStatusChange = useCallback((donationId, newStatus) => {
    setDonations(prev => 
      prev.map(d => d.id === donationId ? { ...d, status: newStatus } : d)
    );
  }, []);

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return { color: '#10b981', icon: CheckCircle, text: 'Tamamlandı' };
      case 'pending':
        return { color: '#f59e0b', icon: Clock, text: 'Beklemede' };
      case 'failed':
        return { color: '#dc2626', icon: AlertTriangle, text: 'Başarısız' };
      default:
        return { color: '#6b7280', icon: AlertTriangle, text: 'Bilinmiyor' };
    }
  };

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'credit_card':
        return CreditCard;
      case 'bank_transfer':
        return Building;
      case 'cash':
        return DollarSign;
      default:
        return Gift;
    }
  };

  // Format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency || 'TRY',
      minimumFractionDigits: 0
    }).format(amount);
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
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bağış Yönetimi</h1>
              <p className="text-gray-600">Toplam {donations.length} bağış</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Bağış
          </motion.button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Bağış</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tamamlanan</p>
                <p className="text-2xl font-bold text-green-600">{completedDonations}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bekleyen</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingDonations}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Bağışçı veya not ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="completed">Tamamlandı</option>
            <option value="pending">Beklemede</option>
            <option value="failed">Başarısız</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Tüm Türler</option>
            <option value="credit_card">Kredi Kartı</option>
            <option value="bank_transfer">Banka Transferi</option>
            <option value="cash">Nakit</option>
          </select>
        </div>
      </div>

      {/* Donations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedDonations.map((donation) => {
          const statusInfo = getStatusInfo(donation.status);
          const StatusIcon = statusInfo.icon;
          const TypeIcon = getTypeIcon(donation.type);
          
          return (
            <motion.div
              key={donation.id}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden cursor-pointer"
              onClick={() => handleDonationClick(donation)}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {donation.anonymous ? 'Anonim Bağışçı' : donation.donorName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <TypeIcon className="w-5 h-5 text-gray-600" />
                    <StatusIcon className="w-5 h-5" style={{ color: statusInfo.color }} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold text-lg text-green-600">
                    {formatCurrency(donation.amount, donation.currency)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {!donation.anonymous && (
                  <>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{donation.email}</span>
                    </div>
                    {donation.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{donation.phone}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{donation.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Gift className="w-4 h-4" />
                  <span>{donation.category}</span>
                </div>
                {donation.notes && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Not:</span> {donation.notes}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {donation.receipt && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Makbuz
                      </span>
                    )}
                    {donation.anonymous && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        Anonim
                      </span>
                    )}
                  </div>
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
                  ? 'bg-green-600 text-white border-green-600'
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
      {showModal && selectedDonation && (
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
              <h2 className="text-xl font-bold text-gray-900">Bağış Detayı</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Bağışçı</label>
                <p className="text-gray-900">
                  {selectedDonation.anonymous ? 'Anonim Bağışçı' : selectedDonation.donorName}
                </p>
              </div>
              
              {!selectedDonation.anonymous && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700">E-posta</label>
                    <p className="text-gray-900">{selectedDonation.email}</p>
                  </div>
                  
                  {selectedDonation.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Telefon</label>
                      <p className="text-gray-900">{selectedDonation.phone}</p>
                    </div>
                  )}
                </>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-700">Tutar</label>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(selectedDonation.amount, selectedDonation.currency)}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Ödeme Türü</label>
                <div className="flex items-center gap-2">
                  {(() => {
                    const TypeIcon = getTypeIcon(selectedDonation.type);
                    return <TypeIcon className="w-4 h-4" />;
                  })()}
                  <span className="text-gray-900">
                    {selectedDonation.type === 'credit_card' ? 'Kredi Kartı' :
                     selectedDonation.type === 'bank_transfer' ? 'Banka Transferi' :
                     selectedDonation.type === 'cash' ? 'Nakit' : 'Diğer'}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Durum</label>
                <div className="flex items-center gap-2">
                  {(() => {
                    const statusInfo = getStatusInfo(selectedDonation.status);
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
                <label className="text-sm font-medium text-gray-700">Kategori</label>
                <p className="text-gray-900">{selectedDonation.category}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Tarih</label>
                <p className="text-gray-900">{selectedDonation.date}</p>
              </div>
              
              {selectedDonation.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Notlar</label>
                  <p className="text-gray-900">{selectedDonation.notes}</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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

export default Donations;
