import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'react-qr-code'
import { 
  Plus, 
  TrendingUp, 
  Users, 
  MapPin, 
  Calendar,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  QrCode,
  Navigation,
  Printer,
  X,
  Activity,
  DollarSign,
  Settings,
  Box
} from 'lucide-react'
import './PiggyBankTracking.css'



const PiggyBankTracking = () => {
  const [piggyBanks, setPiggyBanks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedBank, setSelectedBank] = useState(null)
  const [showQRModal, setShowQRModal] = useState(false)



  // Mock data with coordinates
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        name: 'Merkez Kumbara',
        location: 'Dernek Merkezi',
        address: 'Atatürk Caddesi No:123, Kadıköy/İstanbul',
        coordinates: { lat: 40.9909, lng: 29.0303 },
        currentAmount: 1250,
        targetAmount: 5000,
        status: 'active',
        assignedTo: 'Ahmet Yılmaz',
        lastCollection: '2024-01-15',
        nextCollection: '2024-02-15',
        totalCollections: 8,
        notes: 'Merkez lokasyonda aktif kullanımda',
        qrCode: 'KUMBARA-001'
      },
      {
        id: 2,
        name: 'Şube Kumbara',
        location: 'Kadıköy Şubesi',
        address: 'Moda Caddesi No:45, Kadıköy/İstanbul',
        coordinates: { lat: 40.9876, lng: 29.0278 },
        currentAmount: 850,
        targetAmount: 3000,
        status: 'active',
        assignedTo: 'Fatma Demir',
        lastCollection: '2024-01-10',
        nextCollection: '2024-02-10',
        totalCollections: 5,
        notes: 'Şube lokasyonunda düzenli toplanıyor',
        qrCode: 'KUMBARA-002'
      },
      {
        id: 3,
        name: 'Etkinlik Kumbara',
        location: 'Kültür Merkezi',
        address: 'Bağdat Caddesi No:78, Kadıköy/İstanbul',
        coordinates: { lat: 40.9854, lng: 29.0256 },
        currentAmount: 2100,
        targetAmount: 2000,
        status: 'full',
        assignedTo: 'Mehmet Kaya',
        lastCollection: '2024-01-20',
        nextCollection: '2024-01-25',
        totalCollections: 12,
        notes: 'Etkinlik sırasında kullanılıyor',
        qrCode: 'KUMBARA-003'
      },
      {
        id: 4,
        name: 'Eski Kumbara',
        location: 'Depo',
        address: 'Depo Sokak No:12, Kadıköy/İstanbul',
        coordinates: { lat: 40.9832, lng: 29.0234 },
        currentAmount: 0,
        targetAmount: 1000,
        status: 'inactive',
        assignedTo: 'Zeynep Öz',
        lastCollection: '2023-12-01',
        nextCollection: '-',
        totalCollections: 15,
        notes: 'Eski model, yedek olarak saklanıyor',
        qrCode: 'KUMBARA-004'
      }
    ]
    
    setTimeout(() => {
      setPiggyBanks(mockData)
      setLoading(false)
    }, 1000)
  }, [])



  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktif'
      case 'full': return 'Dolu'
      case 'inactive': return 'Pasif'
      default: return 'Bilinmiyor'
    }
  }

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100)
  }

  // QR Kod oluşturma fonksiyonu
  const generateQRCode = (bank) => {
    const qrData = {
      id: bank.id,
      name: bank.name,
      location: bank.location,
      address: bank.address,
      coordinates: bank.coordinates,
      qrCode: bank.qrCode
    }
    return JSON.stringify(qrData)
  }

  // Rota oluşturma fonksiyonu
  const openNavigation = (bank) => {
    const { lat, lng } = bank.coordinates
    const address = encodeURIComponent(bank.address)
    
    // Google Maps ile rota oluştur
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${address}`
    
    // Kullanıcıya seçenek sun
    if (confirm(`${bank.name} konumuna rota oluşturmak istiyor musunuz?`)) {
      // Google Maps'i tercih et
      window.open(googleMapsUrl, '_blank')
    }
  }

  // QR Kod modal'ını aç
  const openQRModal = (bank) => {
    setSelectedBank(bank)
    setShowQRModal(true)
  }

  const filteredPiggyBanks = piggyBanks.filter(bank => {
    const matchesSearch = bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bank.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || bank.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalAmount = piggyBanks.reduce((sum, bank) => sum + bank.currentAmount, 0)
  const totalTarget = piggyBanks.reduce((sum, bank) => sum + bank.targetAmount, 0)
  const activeBanks = piggyBanks.filter(bank => bank.status === 'active').length

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="loading-spinner"
        />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="piggy-bank-tracking-page"
    >
      {/* Header */}
      <div className="piggy-bank-header">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Box className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="piggy-bank-title">Kumbara Takibi</h1>
              <p className="piggy-bank-subtitle">Kumbaraların durumu ve toplama takibi</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            <span>Yeni Kumbara</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="stats-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="stats-label">Toplam Tutar</p>
                <p className="stats-value">₺{totalAmount.toLocaleString()}</p>
              </div>
                          <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-7 h-7 text-green-600" />
            </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="stats-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="stats-label">Hedef Tutar</p>
                <p className="stats-value">₺{totalTarget.toLocaleString()}</p>
              </div>
                          <div className="p-2 bg-blue-100 rounded-lg">
              <Box className="w-7 h-7 text-blue-600" />
            </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="stats-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="stats-label">Aktif Kumbaralar</p>
                <p className="stats-value">{activeBanks}</p>
              </div>
                          <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-7 h-7 text-purple-600" />
            </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="stats-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="stats-label">Toplam Kumbara</p>
                <p className="stats-value">{piggyBanks.length}</p>
              </div>
                          <div className="p-2 bg-orange-100 rounded-lg">
              <MapPin className="w-7 h-7 text-orange-600" />
            </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="filter-container">
          <div className="flex flex-col sm:flex-row gap-4">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Kumbara ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="full">Dolu</option>
            <option value="inactive">Pasif</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary"
          >
            <Download className="w-5 h-5 mr-2" />
            <span>Dışa Aktar</span>
          </motion.button>
          </div>
        </div>
      </div>

      {/* Piggy Banks List */}
      <div className="piggy-bank-table">
        <div className="overflow-x-auto table-container">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Box className="w-4 h-4 mr-2" />
                    Kumbara
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Lokasyon
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Tutar
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Durum
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Sorumlu
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Son Toplama
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    İşlemler
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPiggyBanks.map((bank, index) => (
                <motion.tr
                  key={bank.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="table-row"
                >
                  <td className="table-cell whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{bank.name}</div>
                      <div className="text-sm text-gray-500">{bank.notes}</div>
                    </div>
                  </td>
                  <td className="table-cell whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <span className="text-sm text-gray-900">{bank.location}</span>
                        <div className="text-xs text-gray-500">{bank.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        ₺{bank.currentAmount.toLocaleString()}
                      </div>
                      <div className="progress-container">
                        <div
                          className="progress-fill"
                          style={{ width: `${getProgressPercentage(bank.currentAmount, bank.targetAmount)}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {getProgressPercentage(bank.currentAmount, bank.targetAmount).toFixed(1)}% / ₺{bank.targetAmount.toLocaleString()}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell whitespace-nowrap">
                    <span className={`status-badge status-${bank.status}`}>
                      {getStatusText(bank.status)}
                    </span>
                  </td>
                  <td className="table-cell whitespace-nowrap text-sm text-gray-900">
                    {bank.assignedTo}
                  </td>
                  <td className="table-cell whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-900">{bank.lastCollection}</div>
                        <div className="text-xs text-gray-500">Sonraki: {bank.nextCollection}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 action-buttons">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="action-button action-view"
                        title="Görüntüle"
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="action-button action-qr"
                        title="QR Kod"
                        onClick={() => openQRModal(bank)}
                      >
                        <QrCode className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="action-button action-navigation"
                        title="Rota Oluştur"
                        onClick={() => openNavigation(bank)}
                      >
                        <Navigation className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="action-button action-edit"
                        title="Düzenle"
                      >
                        <Edit className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="action-button action-delete"
                        title="Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredPiggyBanks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="empty-state"
        >
          <Box className="empty-state-icon" />
          <h3 className="empty-state-title">Kumbara bulunamadı</h3>
          <p className="empty-state-description">Arama kriterlerinize uygun kumbara bulunamadı.</p>
        </motion.div>
      )}

      {/* QR Kod Modal */}
      {showQRModal && selectedBank && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="qr-modal"
          onClick={() => setShowQRModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="qr-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h3 className="qr-modal-title no-print">
                {selectedBank.name} - QR Kod
              </h3>
              
              {/* Yazdırılabilir QR Kod Alanı */}
              <div className="qr-code-container bg-white p-6 rounded-lg border-2 border-gray-200 mb-4 print-area">
                <div className="flex flex-col items-center">
                  {/* QR Kod - 40x30mm boyutunda */}
                  <div className="mb-3 flex justify-center items-center">
                    <QRCode
                      value={generateQRCode(selectedBank)}
                      size={151}
                      level="H"
                      includeMargin={true}
                      style={{ width: '40mm', height: '30mm' }}
                    />
                  </div>
                  
                  {/* Kumbara Bilgileri */}
                  <div className="text-center text-sm">
                    <div className="font-bold text-lg mb-1">{selectedBank.name}</div>
                    <div className="text-gray-600 mb-1">{selectedBank.location}</div>
                    <div className="text-gray-500 text-xs">{selectedBank.qrCode}</div>
                  </div>
                </div>
              </div>
              
              {/* Detay Bilgileri */}
              <div className="qr-info no-print">
                <p><strong>Kod:</strong> {selectedBank.qrCode}</p>
                <p><strong>Lokasyon:</strong> {selectedBank.location}</p>
                <p><strong>Adres:</strong> {selectedBank.address}</p>
                <p><strong>Koordinatlar:</strong> {selectedBank.coordinates.lat}, {selectedBank.coordinates.lng}</p>
              </div>
              
              {/* Butonlar */}
              <div className="flex space-x-3 no-print">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-success flex-1"
                  onClick={() => window.print()}
                >
                  <Printer className="btn-icon" />
                  Yazdır
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary flex-1"
                  onClick={() => openNavigation(selectedBank)}
                >
                  <Navigation className="btn-icon" />
                  Rota Oluştur
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-secondary flex-1"
                  onClick={() => setShowQRModal(false)}
                >
                  <X className="btn-icon" />
                  Kapat
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default PiggyBankTracking
