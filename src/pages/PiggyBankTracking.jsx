// import { motion } from 'framer-motion';
import {
  DollarSign,
  Download,
  Edit,
  ExternalLink,
  Eye,
  Landmark,
  MapPin,
  Plus,
  QrCode,
  ScanLine,
  Search,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

import { useMultipleModals } from '../hooks/useModal';
import { toast } from 'sonner';

const PiggyBankTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const modals = useMultipleModals(['add', 'qr', 'scanner']);
  const [selectedPiggyBank, setSelectedPiggyBank] = useState(null);
  const [scannedCode, setScannedCode] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [videoRef, setVideoRef] = useState(null);

  // Örnek kumbara verileri
  const [piggyBanks, setPiggyBanks] = useState([
    {
      id: 1,
      code: 'KB001',
      location: 'Fatih Camii',
      address: 'Fatih/İstanbul',
      placementDate: '2024-01-15',
      lastCollection: '2024-01-20',
      totalCollected: 2500,
      status: 'Aktif',
      responsible: 'Ahmet Yılmaz',
      qrCode: 'KUMBARA:KB001|LOC:Fatih Camii|DATE:2024-01-15',
    },
    {
      id: 2,
      code: 'KB002',
      location: 'Sultanahmet Camii',
      address: 'Sultanahmet/İstanbul',
      placementDate: '2024-01-10',
      lastCollection: '2024-01-18',
      totalCollected: 3200,
      status: 'Aktif',
      responsible: 'Fatma Kaya',
      qrCode: 'KUMBARA:KB002|LOC:Sultanahmet Camii|DATE:2024-01-10',
    },
    {
      id: 3,
      code: 'KB003',
      location: 'Beyazıt Camii',
      address: 'Beyazıt/İstanbul',
      placementDate: '2024-01-05',
      lastCollection: '2024-01-15',
      totalCollected: 1800,
      status: 'Bakım',
      responsible: 'Mehmet Demir',
      qrCode: 'KUMBARA:KB003|LOC:Beyazıt Camii|DATE:2024-01-05',
    },
    {
      id: 4,
      code: 'KB004',
      location: 'Eyüp Sultan Camii',
      address: 'Eyüp/İstanbul',
      placementDate: '2024-01-12',
      lastCollection: '2024-01-22',
      totalCollected: 4100,
      status: 'Aktif',
      responsible: 'Ayşe Özkan',
      qrCode: 'KUMBARA:KB004|LOC:Eyüp Sultan Camii|DATE:2024-01-12',
    },
  ]);

  const [newPiggyBank, setNewPiggyBank] = useState({
    code: '',
    location: '',
    address: '',
    placementDate: '',
    responsible: '',
  });

  // İstatistikler
  const stats = [
    {
      title: 'Toplam Kumbara',
      value: piggyBanks.length.toString(),
      icon: Landmark,
      color: '#3b82f6',
    },
    {
      title: 'Aktif Kumbara',
      value: piggyBanks.filter(pb => pb.status === 'Aktif').length.toString(),
      icon: TrendingUp,
      color: '#10b981',
    },
    {
      title: 'Toplam Toplanan',
      value: `₺${piggyBanks.reduce((sum, pb) => sum + pb.totalCollected, 0).toLocaleString()}`,
      icon: DollarSign,
      color: '#f59e0b',
    },
    {
      title: 'Sorumlu Kişi',
      value: new Set(piggyBanks.map(pb => pb.responsible)).size.toString(),
      icon: Users,
      color: '#ef4444',
    },
  ];

  // Filtreleme
  const filteredPiggyBanks = piggyBanks.filter(piggyBank => {
    const matchesSearch =
      piggyBank.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      piggyBank.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      piggyBank.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      selectedLocation === '' || piggyBank.address.includes(selectedLocation);
    return matchesSearch && matchesLocation;
  });

  const handleAddPiggyBank = () => {
    if (
      !newPiggyBank.code ||
      !newPiggyBank.location ||
      !newPiggyBank.address ||
      !newPiggyBank.placementDate ||
      !newPiggyBank.responsible
    ) {
      error('Lütfen tüm alanları doldurun!');
      return;
    }

    const newId = Math.max(...piggyBanks.map(pb => pb.id), 0) + 1;
    const piggyBankToAdd = {
      id: newId,
      ...newPiggyBank,
      lastCollection: '-',
      totalCollected: 0,
      status: 'Aktif',
      qrCode: generateQRCode(piggyBankToAdd.code, piggyBankToAdd.location),
    };

    setPiggyBanks(prev => [...prev, piggyBankToAdd]);
    setNewPiggyBank({
      code: '',
      location: '',
      address: '',
      placementDate: '',
      responsible: '',
    });
    modals.close('add');
    success('Yeni kumbara başarıyla eklendi!');
  };

  const handleDeletePiggyBank = id => {
    setPiggyBanks(prev => prev.filter(pb => pb.id !== id));
    success('Kumbara kaydı silindi!');
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Aktif':
        return '#10b981';
      case 'Bakım':
        return '#f59e0b';
      case 'Pasif':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const generateQRCode = (code, location) => {
    // QR kod için basit bir veri string'i oluştur
    const qrData = `KUMBARA:${code}|LOC:${location}|DATE:${new Date().toISOString()}`;
    return qrData;
  };

  const generateQRCodeSVG = data => {
    const size = 150;
    const moduleSize = size / 21; // 21x21 modül (standart QR kod boyutu)

    // QR kod için daha gerçekçi pattern oluştur
    const pattern = [];
    for (let i = 0; i < 21; i++) {
      pattern[i] = [];
      for (let j = 0; j < 21; j++) {
        // Köşe marker'ları (7x7)
        if ((i < 7 && j < 7) || (i < 7 && j >= 14) || (i >= 14 && j < 7)) {
          // Dış çerçeve
          if (
            i === 0 ||
            i === 6 ||
            j === 0 ||
            j === 6 ||
            (i >= 2 && i <= 4 && j >= 2 && j <= 4)
          ) {
            pattern[i][j] = true;
          } else {
            pattern[i][j] = false;
          }
        }
        // Timing pattern'ları
        else if (i === 6 || j === 6) {
          pattern[i][j] = (i + j) % 2 === 0;
        }
        // Veri alanları - hash fonksiyonu ile
        else {
          const hash = (data.charCodeAt((i * j) % data.length) + i + j) % 2;
          pattern[i][j] = hash === 0;
        }
      }
    }

    return (
      <div
        style={{
          display: 'inline-block',
          padding: '10px',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
        }}
      >
        <svg width={size} height={size} style={{ display: 'block' }}>
          <rect width={size} height={size} fill='white' />
          {pattern.map((row, i) =>
            row.map(
              (cell, j) =>
                cell && (
                  <rect
                    key={`${i}-${j}`}
                    x={j * moduleSize}
                    y={i * moduleSize}
                    width={moduleSize}
                    height={moduleSize}
                    fill='#000'
                  />
                )
            )
          )}
        </svg>
        <div
          style={{
            textAlign: 'center',
            fontSize: '10px',
            color: '#666',
            marginTop: '5px',
          }}
        >
          {data.split('|')[0]}
        </div>
      </div>
    );
  };

  const handleShowQR = piggyBank => {
    setSelectedPiggyBank(piggyBank);
    modals.open('qr');
  };

  const handlePrintQR = () => {
    window.print();
  };

  const handleQRScan = () => {
    modals.open('scanner');
    setCameraActive(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Arka kamera tercih et
          width: { ideal: 300 },
          height: { ideal: 300 },
        },
      });

      if (videoRef) {
        videoRef.srcObject = stream;
        videoRef.play();
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Kamera erişim hatası:', error);
      error('Kamera erişimi reddedildi veya mevcut değil');
    }
  };

  const stopCamera = () => {
    if (videoRef && videoRef.srcObject) {
      const tracks = videoRef.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.srcObject = null;
    }
    setCameraActive(false);
  };

  const captureQRCode = () => {
    // Simüle edilmiş QR kod yakalama
    // Gerçek uygulamada burada QR kod kütüphanesi kullanılır
    const simulatedCodes = ['KB001-QR', 'KB002-QR', 'KB003-QR', 'KB004-QR'];
    const randomCode =
      simulatedCodes[Math.floor(Math.random() * simulatedCodes.length)];

    setScannedCode(randomCode);
    stopCamera();

    success(`QR kod yakalandı: ${randomCode}`);
  };

  const handleScanComplete = code => {
    setScannedCode(code);
    modals.close('scanner');

    // QR koduna göre kumbara ara
    const foundPiggyBank = piggyBanks.find(pb => pb.qrCode === code);
    if (foundPiggyBank) {
      setSelectedPiggyBank(foundPiggyBank);
      modals.open('qr');
      success(`Kumbara bulundu: ${foundPiggyBank.code}`);
    } else {
      error('QR koda ait kumbara bulunamadı');
    }
  };

  return (
    <div
      style={{
        padding: '2rem',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      {/* Toast Bildirimi */}
      

      {/* Başlık */}
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1a202c',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <Landmark size={32} style={{ color: '#3b82f6' }} />
          Kumbara Takibi
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Kumbara yerleşimi, toplama ve takip işlemlerini yönetin
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <p
                    style={{
                      color: '#64748b',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {stat.title}
                  </p>
                  <p
                    style={{
                      fontSize: '1.875rem',
                      fontWeight: 'bold',
                      color: '#1a202c',
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor: `${stat.color}15`,
                    padding: '0.75rem',
                    borderRadius: '8px',
                  }}
                >
                  <IconComponent size={24} style={{ color: stat.color }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filtreler ve Arama */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
            <Search
              size={20}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
              }}
            />
            <input
              type='text'
              placeholder='Kumbara kodu, lokasyon veya adres ara...'
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

          <select
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              minWidth: '150px',
            }}
          >
            <option value=''>Tüm Lokasyonlar</option>
            <option value='Fatih'>Fatih</option>
            <option value='Sultanahmet'>Sultanahmet</option>
            <option value='Beyazıt'>Beyazıt</option>
            <option value='Eyüp'>Eyüp</option>
          </select>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <motion.button
              onClick={handleQRScan}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
              whileHover={{ backgroundColor: '#059669' }}
              whileTap={{ scale: 0.95 }}
            >
              <ScanLine size={16} />
              QR Tara
            </motion.button>
            <motion.button
              onClick={() => modals.open('add')}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
              whileHover={{ backgroundColor: '#2563eb' }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={16} />
              Yeni Kumbara
            </motion.button>
          </div>
        </div>
      </div>

      {/* Kumbara Listesi */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1a202c',
            }}
          >
            Kumbara Listesi ({filteredPiggyBanks.length})
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  Kumbara Kodu
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  Lokasyon
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  Adres
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  Yerleşim Tarihi
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  Son Toplama
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  Toplam Tutar
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0',
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
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  Sorumlu
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPiggyBanks.map(piggyBank => (
                <motion.tr
                  key={piggyBank.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ borderBottom: '1px solid #f1f5f9' }}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                >
                  <td
                    style={{
                      padding: '1rem',
                      fontWeight: '500',
                      color: '#1a202c',
                    }}
                  >
                    {piggyBank.code}
                  </td>
                  <td style={{ padding: '1rem', color: '#374151' }}>
                    {piggyBank.location}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <motion.button
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(piggyBank.address)}`,
                          '_blank'
                        )
                      }
                      style={{
                        backgroundColor: 'rgba(0,0,0,0)',
                        border: 'none',
                        color: '#3b82f6',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        textDecoration: 'underline',
                      }}
                      whileHover={{ color: '#1d4ed8' }}
                    >
                      <MapPin size={12} />
                      {piggyBank.address}
                      <ExternalLink size={10} />
                    </motion.button>
                  </td>
                  <td
                    style={{
                      padding: '1rem',
                      color: '#64748b',
                      fontSize: '0.875rem',
                    }}
                  >
                    {piggyBank.placementDate}
                  </td>
                  <td
                    style={{
                      padding: '1rem',
                      color: '#64748b',
                      fontSize: '0.875rem',
                    }}
                  >
                    {piggyBank.lastCollection}
                  </td>
                  <td
                    style={{
                      padding: '1rem',
                      fontWeight: '500',
                      color: '#10b981',
                    }}
                  >
                    ₺{piggyBank.totalCollected.toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        backgroundColor: `${getStatusColor(piggyBank.status)}15`,
                        color: getStatusColor(piggyBank.status),
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                      }}
                    >
                      {piggyBank.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '1rem',
                      color: '#64748b',
                      fontSize: '0.875rem',
                    }}
                  >
                    {piggyBank.responsible}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'center',
                      }}
                    >
                      <motion.button
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                        whileHover={{ backgroundColor: '#2563eb' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye size={14} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleShowQR(piggyBank)}
                        style={{
                          backgroundColor: '#8b5cf6',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                        whileHover={{ backgroundColor: '#7c3aed' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <QrCode size={14} />
                      </motion.button>
                      <motion.button
                        style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                        whileHover={{ backgroundColor: '#059669' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit size={14} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeletePiggyBank(piggyBank.id)}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                        whileHover={{ backgroundColor: '#dc2626' }}
                        whileTap={{ scale: 0.95 }}
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

        {filteredPiggyBanks.length === 0 && (
          <div
            style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}
          >
            <Landmark
              size={48}
              style={{ marginBottom: '1rem', opacity: 0.5 }}
            />
            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
              Kumbara bulunamadı
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              Arama kriterlerinizi değiştirmeyi deneyin.
            </p>
          </div>
        )}
      </div>

      {/* Yeni Kumbara Ekleme Modal */}
      {modals.modals.add && (
        <div
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
          onClick={() => modals.close('add')}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1a202c',
                }}
              >
                Yeni Kumbara Ekle
              </h3>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                    }}
                  >
                    Kumbara Kodu
                  </label>
                  <input
                    type='text'
                    value={newPiggyBank.code}
                    onChange={e =>
                      setNewPiggyBank(prev => ({
                        ...prev,
                        code: e.target.value,
                      }))
                    }
                    placeholder='Örn: KB005'
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                    }}
                  >
                    Lokasyon
                  </label>
                  <input
                    type='text'
                    value={newPiggyBank.location}
                    onChange={e =>
                      setNewPiggyBank(prev => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    placeholder='Örn: Süleymaniye Camii'
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                    }}
                  >
                    Adres
                  </label>
                  <input
                    type='text'
                    value={newPiggyBank.address}
                    onChange={e =>
                      setNewPiggyBank(prev => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder='Örn: Süleymaniye/İstanbul'
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                    }}
                  >
                    Yerleşim Tarihi
                  </label>
                  <input
                    type='date'
                    value={newPiggyBank.placementDate}
                    onChange={e =>
                      setNewPiggyBank(prev => ({
                        ...prev,
                        placementDate: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                    }}
                  >
                    Sorumlu Kişi
                  </label>
                  <input
                    type='text'
                    value={newPiggyBank.responsible}
                    onChange={e =>
                      setNewPiggyBank(prev => ({
                        ...prev,
                        responsible: e.target.value,
                      }))
                    }
                    placeholder='Örn: Ali Veli'
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'flex-end',
                  marginTop: '1.5rem',
                }}
              >
                <motion.button
                  onClick={() => modals.close('add')}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                  whileHover={{ backgroundColor: '#e5e7eb' }}
                  whileTap={{ scale: 0.95 }}
                >
                  İptal
                </motion.button>
                <motion.button
                  onClick={handleAddPiggyBank}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                  whileHover={{ backgroundColor: '#059669' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Kaydet
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* QR Kod Modal */}
      {modals.modals.qr && selectedPiggyBank && (
        <div
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
          onClick={() => modals.close('qr')}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '400px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1a202c',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <QrCode size={20} />
                QR Kod - {selectedPiggyBank.code}
              </h3>
            </div>

            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                {generateQRCodeSVG(selectedPiggyBank.qrCode)}
              </div>

              <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <p
                  style={{
                    margin: '0.5rem 0',
                    fontSize: '0.875rem',
                    color: '#374151',
                  }}
                >
                  <strong>Kumbara Kodu:</strong> {selectedPiggyBank.code}
                </p>
                <p
                  style={{
                    margin: '0.5rem 0',
                    fontSize: '0.875rem',
                    color: '#374151',
                  }}
                >
                  <strong>Lokasyon:</strong> {selectedPiggyBank.location}
                </p>
                <p
                  style={{
                    margin: '0.5rem 0',
                    fontSize: '0.875rem',
                    color: '#374151',
                  }}
                >
                  <strong>Adres:</strong> {selectedPiggyBank.address}
                </p>
                <p
                  style={{
                    margin: '0.5rem 0',
                    fontSize: '0.875rem',
                    color: '#374151',
                  }}
                >
                  <strong>Boyut:</strong> 40x25mm
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'center',
                }}
              >
                <motion.button
                  onClick={() => modals.close('qr')}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                  whileHover={{ backgroundColor: '#e5e7eb' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Kapat
                </motion.button>
                <motion.button
                  onClick={handlePrintQR}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  whileHover={{ backgroundColor: '#2563eb' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={14} />
                  Yazdır
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* QR Tarayıcı Modal */}
      {modals.modals.scanner && (
        <div
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
          onClick={() => modals.close('scanner')}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '400px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1a202c',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <ScanLine size={20} />
                QR Kod Tara
              </h3>
            </div>

            <div style={{ padding: '2rem' }}>
              <div
                style={{
                  backgroundColor: '#f3f4f6',
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  padding: '2rem',
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <ScanLine
                  size={48}
                  style={{ color: '#6b7280', margin: '0 auto 1rem' }}
                />
                {!cameraActive ? (
                  <>
                    <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                      Kamera ile tara veya manuel girin
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        marginBottom: '1rem',
                      }}
                    >
                      <motion.button
                        onClick={startCamera}
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          flex: 1,
                        }}
                        whileHover={{ backgroundColor: '#2563eb' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        📷 Kamera Aç
                      </motion.button>
                    </div>

                    <input
                      type='text'
                      placeholder='Veya QR kod değerini manuel girin...'
                      value={scannedCode}
                      onChange={e => setScannedCode(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        marginBottom: '1rem',
                      }}
                    />

                    <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      Örnek QR kodlar: KB001-QR, KB002-QR, KB003-QR, KB004-QR
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                      Kamera aktif - QR kodu kameraya gösterin
                    </p>

                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '300px',
                        margin: '0 auto 1rem',
                        backgroundColor: '#000',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      <video
                        ref={ref => setVideoRef(ref)}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                        }}
                        autoPlay
                        playsInline
                        muted
                      />

                      {/* QR kod hedef çerçevesi */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '150px',
                          height: '150px',
                          border: '2px solid #10b981',
                          borderRadius: '8px',
                          pointerEvents: 'none',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '-2px',
                            left: '-2px',
                            width: '20px',
                            height: '20px',
                            borderTop: '4px solid #10b981',
                            borderLeft: '4px solid #10b981',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: '-2px',
                            right: '-2px',
                            width: '20px',
                            height: '20px',
                            borderTop: '4px solid #10b981',
                            borderRight: '4px solid #10b981',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '-2px',
                            left: '-2px',
                            width: '20px',
                            height: '20px',
                            borderBottom: '4px solid #10b981',
                            borderLeft: '4px solid #10b981',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '-2px',
                            right: '-2px',
                            width: '20px',
                            height: '20px',
                            borderBottom: '4px solid #10b981',
                            borderRight: '4px solid #10b981',
                          }}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <motion.button
                        onClick={captureQRCode}
                        style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                        whileHover={{ backgroundColor: '#059669' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        📸 Yakala
                      </motion.button>
                      <motion.button
                        onClick={stopCamera}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                        whileHover={{ backgroundColor: '#dc2626' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ❌ Kapat
                      </motion.button>
                    </div>

                    {scannedCode && (
                      <div
                        style={{
                          backgroundColor: '#f0fdf4',
                          border: '1px solid #10b981',
                          borderRadius: '6px',
                          padding: '0.75rem',
                          textAlign: 'center',
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            color: '#059669',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                          }}
                        >
                          Yakalanan QR: {scannedCode}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'center',
                }}
              >
                <motion.button
                  onClick={() => {
                    stopCamera();
                    modals.close('scanner');
                    setScannedCode('');
                  }}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                  whileHover={{ backgroundColor: '#e5e7eb' }}
                  whileTap={{ scale: 0.95 }}
                >
                  İptal
                </motion.button>
                <motion.button
                  onClick={() => handleScanComplete(scannedCode)}
                  disabled={!scannedCode.trim()}
                  style={{
                    backgroundColor: scannedCode.trim() ? '#10b981' : '#d1d5db',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    cursor: scannedCode.trim() ? 'pointer' : 'not-allowed',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                  whileHover={{
                    backgroundColor: scannedCode.trim() ? '#059669' : '#d1d5db',
                  }}
                  whileTap={{ scale: scannedCode.trim() ? 0.95 : 1 }}
                >
                  Tara
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PiggyBankTracking;
