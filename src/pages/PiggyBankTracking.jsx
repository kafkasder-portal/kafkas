import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'react-qr-code'
import { 
  PiggyBank, 
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
  Navigation
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'full': return 'text-blue-600 bg-blue-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

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
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page-container"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PiggyBank className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kumbara Takibi</h1>
              <p className="text-gray-600">Kumbaraların durumu ve toplama takibi</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Kumbara</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Tutar</p>
                <p className="text-2xl font-bold text-gray-900">₺{totalAmount.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hedef Tutar</p>
                <p className="text-2xl font-bold text-gray-900">₺{totalTarget.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <PiggyBank className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Kumbaralar</p>
                <p className="text-2xl font-bold text-gray-900">{activeBanks}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Kumbara</p>
                <p className="text-2xl font-bold text-gray-900">{piggyBanks.length}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Kumbara ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="full">Dolu</option>
            <option value="inactive">Pasif</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Dışa Aktar</span>
          </motion.button>
        </div>
      </div>

      {/* Piggy Banks List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kumbara
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasyon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sorumlu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Toplama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
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
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{bank.name}</div>
                      <div className="text-sm text-gray-500">{bank.notes}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <span className="text-sm text-gray-900">{bank.location}</span>
                        <div className="text-xs text-gray-500">{bank.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        ₺{bank.currentAmount.toLocaleString()}
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(bank.currentAmount, bank.targetAmount)}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {getProgressPercentage(bank.currentAmount, bank.targetAmount).toFixed(1)}% / ₺{bank.targetAmount.toLocaleString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bank.status)}`}>
                      {getStatusText(bank.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {bank.assignedTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{bank.lastCollection}</div>
                        <div className="text-xs text-gray-500">Sonraki: {bank.nextCollection}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Görüntüle"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-purple-600 hover:text-purple-900"
                        title="QR Kod"
                        onClick={() => openQRModal(bank)}
                      >
                        <QrCode className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-green-600 hover:text-green-900"
                        title="Rota Oluştur"
                        onClick={() => openNavigation(bank)}
                      >
                        <Navigation className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-orange-600 hover:text-orange-900"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-600 hover:text-red-900"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
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
          className="text-center py-12"
        >
          <PiggyBank className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Kumbara bulunamadı</h3>
          <p className="text-gray-500">Arama kriterlerinize uygun kumbara bulunamadı.</p>
        </motion.div>
      )}

      {/* QR Kod Modal */}
      {showQRModal && selectedBank && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowQRModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-8 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4 no-print">
                {selectedBank.name} - QR Kod
              </h3>
              
              {/* Yazdırılabilir QR Kod Alanı */}
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-4 print-area">
                <div className="flex flex-col items-center">
                  {/* QR Kod - 40x30mm boyutunda */}
                  <div className="mb-3 qr-code-container">
                    <QRCode
                      value={generateQRCode(selectedBank)}
                      size={151}
                      level="H"
                      includeMargin={true}
                      className="qr-code-printable"
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
              <div className="text-sm text-gray-600 mb-4 no-print">
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
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  onClick={() => window.print()}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Yazdır
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => openNavigation(selectedBank)}
                >
                  <Navigation className="w-4 h-4 inline mr-2" />
                  Rota Oluştur
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => setShowQRModal(false)}
                >
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
