import { AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  CheckSquare,
  Coins,
  Download,
  FileText,
  Package,
  PieChart,
  RefreshCw,
  Share2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

const ReportGenerator = () => {
  const [selectedReportType, setSelectedReportType] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  // const [filters, setFilters] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  const reportTypes = [
    {
      id: 'donations',
      title: 'Bağış Raporu',
      description: 'Detaylı bağış analizi ve istatistikleri',
      icon: Coins,
      color: '#10b981',
      fields: ['donor_name', 'amount', 'date', 'type', 'status'],
    },
    {
      id: 'volunteers',
      title: 'Gönüllü Raporu',
      description: 'Gönüllü aktiviteleri ve performans',
      icon: Users,
      color: '#3b82f6',
      fields: ['volunteer_name', 'activities', 'hours', 'rating'],
    },
    {
      id: 'inventory',
      title: 'Envanter Raporu',
      description: 'Stok durumu ve malzeme analizi',
      icon: Package,
      color: '#f59e0b',
      fields: ['item_name', 'quantity', 'category', 'location'],
    },
    {
      id: 'tasks',
      title: 'Görev Raporu',
      description: 'Görev tamamlama oranları ve verimlilik',
      icon: CheckSquare,
      color: '#8b5cf6',
      fields: ['task_name', 'assignee', 'status', 'completion_date'],
    },
  ];

  // const chartTypes = [
    { id: 'bar', name: 'Bar Chart', icon: BarChart3 },
    { id: 'pie', name: 'Pie Chart', icon: PieChart },
    { id: 'line', name: 'Line Chart', icon: TrendingUp },
  // ];

  const generateReport = async () => {
    if (!selectedReportType) return;

    setIsGenerating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockData = {
      donations: {
        total: 125600,
        count: 156,
        average: 805,
        trends: [
          { month: 'Oca', value: 15200 },
          { month: 'Şub', value: 18400 },
          { month: 'Mar', value: 22100 },
          { month: 'Nis', value: 19800 },
          { month: 'May', value: 25100 },
          { month: 'Haz', value: 25000 },
        ],
      },
      volunteers: {
        total: 89,
        active: 67,
        hours: 1240,
        activities: [
          { name: 'Yardım Dağıtımı', count: 45 },
          { name: 'Eğitim', count: 23 },
          { name: 'Etkinlik Org.', count: 21 },
        ],
      },
    };

    setGeneratedReport({
      type: selectedReportType,
      data: mockData[selectedReportType] || {},
      generatedAt: new Date(),
      filters,
      dateRange,
    });

    setIsGenerating(false);
  };

  const exportReport = _format => {
    // Simulate export
    // In real app, this would trigger download
  };

  return (
    <div className='page-container'>
      <motion.div
        className='page-header'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className='page-title'>Rapor Oluşturucu</h1>
        <p className='page-subtitle'>
          Detaylı raporlar oluşturun ve analiz edin
        </p>
      </motion.div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}
      >
        {/* Report Configuration */}
        <motion.div
          className='card'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 style={{ marginBottom: '1.5rem' }}>Rapor Türü Seçin</h3>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            {reportTypes.map(type => {
              const Icon = type.icon;
              const isSelected = selectedReportType === type.id;

              return (
                <motion.div
                  key={type.id}
                  onClick={() => setSelectedReportType(type.id)}
                  style={{
                    padding: '1rem',
                    border: `2px solid ${isSelected ? type.color : '#e2e8f0'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    backgroundColor: isSelected
                      ? `${type.color}10`
                      : 'rgba(0,0,0,0)',
                    transition: 'all 0.2s ease',
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <div
                      style={{
                        padding: '0.75rem',
                        backgroundColor: `${type.color}15`,
                        borderRadius: '8px',
                      }}
                    >
                      <Icon size={20} color={type.color} />
                    </div>
                    <div>
                      <h4
                        style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          margin: 0,
                        }}
                      >
                        {type.title}
                      </h4>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          margin: 0,
                        }}
                      >
                        {type.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Date Range */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.75rem' }}>Tarih Aralığı</h4>
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
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '0.25rem',
                    display: 'block',
                  }}
                >
                  Başlangıç
                </label>
                <input
                  type='date'
                  value={dateRange.start}
                  onChange={e =>
                    setDateRange(prev => ({ ...prev, start: e.target.value }))
                  }
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '0.25rem',
                    display: 'block',
                  }}
                >
                  Bitiş
                </label>
                <input
                  type='date'
                  value={dateRange.end}
                  onChange={e =>
                    setDateRange(prev => ({ ...prev, end: e.target.value }))
                  }
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <motion.button
            onClick={generateReport}
            disabled={!selectedReportType || isGenerating}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: selectedReportType ? '#667eea' : '#e2e8f0',
              color: selectedReportType ? 'white' : '#9ca3af',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: selectedReportType ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
            whileHover={selectedReportType ? { scale: 1.02 } : {}}
            whileTap={selectedReportType ? { scale: 0.98 } : {}}
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <RefreshCw size={18} />
                </motion.div>
                Oluşturuluyor...
              </>
            ) : (
              <>
                <FileText size={18} />
                Rapor Oluştur
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Report Preview */}
        <motion.div
          className='card'
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 style={{ marginBottom: '1.5rem' }}>Rapor Önizleme</h3>

          <AnimatePresence mode='wait'>
            {!generatedReport ? (
              <motion.div
                key='placeholder'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3rem',
                  color: '#6b7280',
                  textAlign: 'center',
                }}
              >
                <FileText size={64} color='#d1d5db' />
                <p style={{ marginTop: '1rem', fontSize: '1.125rem' }}>
                  Rapor oluşturmak için yukarıdan bir tür seçin
                </p>
              </motion.div>
            ) : (
              <motion.div
                key='report'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Report Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        margin: 0,
                      }}
                    >
                      {
                        reportTypes.find(r => r.id === generatedReport.type)
                          ?.title
                      }
                    </h4>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        margin: 0,
                      }}
                    >
                      Oluşturulma:{' '}
                      {generatedReport.generatedAt.toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <motion.button
                      onClick={() => exportReport('pdf')}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#f3f4f6',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                      whileHover={{ backgroundColor: '#e5e7eb' }}
                    >
                      <Download size={16} />
                    </motion.button>
                    <motion.button
                      onClick={() => exportReport('excel')}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#f3f4f6',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                      whileHover={{ backgroundColor: '#e5e7eb' }}
                    >
                      <Share2 size={16} />
                    </motion.button>
                  </div>
                </div>

                {/* Report Content */}
                {generatedReport.type === 'donations' && (
                  <div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem',
                        marginBottom: '2rem',
                      }}
                    >
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '1rem',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#10b981',
                          }}
                        >
                          ₺{generatedReport.data.total?.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Toplam Bağış
                        </div>
                      </div>
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '1rem',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#3b82f6',
                          }}
                        >
                          {generatedReport.data.count}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Bağış Sayısı
                        </div>
                      </div>
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '1rem',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#f59e0b',
                          }}
                        >
                          ₺{generatedReport.data.average}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Ortalama
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {generatedReport.type === 'volunteers' && (
                  <div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem',
                        marginBottom: '2rem',
                      }}
                    >
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '1rem',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#3b82f6',
                          }}
                        >
                          {generatedReport.data.total}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Toplam Gönüllü
                        </div>
                      </div>
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '1rem',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#10b981',
                          }}
                        >
                          {generatedReport.data.active}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Aktif
                        </div>
                      </div>
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '1rem',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#f59e0b',
                          }}
                        >
                          {generatedReport.data.hours}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Toplam Saat
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportGenerator;
