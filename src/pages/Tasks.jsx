import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Flag,
  Tag,
  MapPin,
} from 'lucide-react';

// Mock data for development - moved outside component to avoid dependency issues
const mockTasks = [
  {
    id: 1,
    title: 'Acil yardım paketi dağıtımı',
    description: 'Deprem bölgesindeki ailelere acil yardım paketlerinin dağıtılması',
    status: 'in_progress',
    priority: 'high',
    assignee: 'Ahmet Yılmaz',
    assignees: ['Ahmet Yılmaz', 'Fatma Demir'],
    dueDate: '2024-01-25',
    createdAt: '2024-01-20',
    completedAt: null,
    progress: 75,
    category: 'Acil Yardım',
    location: 'Hatay, Türkiye',
    estimatedHours: 8,
    actualHours: 6,
    tags: ['acil', 'dağıtım', 'deprem'],
    notes: 'Öncelikli olarak çocuklu ailelere öncelik verilecek',
  },
  {
    id: 2,
    title: 'Gönüllü eğitimi tamamlama',
    description: 'Yeni gönüllüler için temel eğitim programının tamamlanması',
    status: 'completed',
    priority: 'medium',
    assignee: 'Fatma Demir',
    assignees: ['Fatma Demir'],
    dueDate: '2024-01-22',
    createdAt: '2024-01-15',
    completedAt: '2024-01-22',
    progress: 100,
    category: 'Eğitim',
    location: 'İstanbul, Türkiye',
    estimatedHours: 12,
    actualHours: 10,
    tags: ['eğitim', 'gönüllü'],
    notes: 'Eğitim materyalleri hazırlandı ve başarıyla tamamlandı',
  },
  {
    id: 3,
    title: 'Finansal rapor hazırlama',
    description: 'Aylık finansal raporun hazırlanması ve yönetim kuruluna sunulması',
    status: 'pending',
    priority: 'low',
    assignee: 'Mehmet Kaya',
    assignees: ['Mehmet Kaya'],
    dueDate: '2024-01-30',
    createdAt: '2024-01-18',
    completedAt: null,
    progress: 0,
    category: 'Finans',
    location: 'Ankara, Türkiye',
    estimatedHours: 6,
    actualHours: 0,
    tags: ['rapor', 'finans'],
    notes: 'Muhasebe verilerinin toplanması bekleniyor',
  },
  {
    id: 4,
    title: 'Hastane sevk koordinasyonu',
    description: 'Acil hastaların hastanelere sevk edilmesi ve koordinasyonu',
    status: 'in_progress',
    priority: 'high',
    assignee: 'Ayşe Özkan',
    assignees: ['Ayşe Özkan', 'Ali Çelik'],
    dueDate: '2024-01-23',
    createdAt: '2024-01-19',
    completedAt: null,
    progress: 60,
    category: 'Sağlık',
    location: 'İzmir, Türkiye',
    estimatedHours: 10,
    actualHours: 6,
    tags: ['sağlık', 'sevk', 'acil'],
    notes: 'Hastane randevuları ayarlanıyor',
  },
  {
    id: 5,
    title: 'Envanter kontrolü',
    description: 'Depo envanterinin kontrol edilmesi ve eksik malzemelerin tespiti',
    status: 'completed',
    priority: 'medium',
    assignee: 'Ali Çelik',
    assignees: ['Ali Çelik'],
    dueDate: '2024-01-21',
    createdAt: '2024-01-16',
    completedAt: '2024-01-21',
    progress: 100,
    category: 'Lojistik',
    location: 'Bursa, Türkiye',
    estimatedHours: 4,
    actualHours: 3,
    tags: ['envanter', 'kontrol'],
    notes: 'Eksik malzemeler listesi hazırlandı',
  },
];

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load tasks data
  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTasks(mockTasks);
      setLoading(false);
    };

    loadTasks();
  }, []);

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatusFilter = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriorityFilter = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatusFilter && matchesPriorityFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const _pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;

  // Handle task selection
  const handleTaskClick = useCallback((task) => {
    setSelectedTask(task);
    setShowModal(true);
  }, []);

  // Handle status change
  const _handleStatusChange = useCallback((taskId, newStatus) => {
    setTasks(prev => 
      prev.map(t => t.id === taskId ? { 
        ...t, 
        status: newStatus,
        completedAt: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null
      } : t)
    );
  }, []);

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return { color: '#10b981', icon: CheckCircle, text: 'Tamamlandı' };
      case 'in_progress':
        return { color: '#3b82f6', icon: Clock, text: 'Devam Ediyor' };
      case 'pending':
        return { color: '#f59e0b', icon: AlertTriangle, text: 'Beklemede' };
      default:
        return { color: '#6b7280', icon: AlertTriangle, text: 'Bilinmiyor' };
    }
  };

  // Get priority color and icon
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'high':
        return { color: '#dc2626', icon: Flag, text: 'Yüksek' };
      case 'medium':
        return { color: '#f59e0b', icon: Flag, text: 'Orta' };
      case 'low':
        return { color: '#10b981', icon: Flag, text: 'Düşük' };
      default:
        return { color: '#6b7280', icon: Flag, text: 'Bilinmiyor' };
    }
  };

  // Check if task is overdue
  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status !== 'completed';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
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
            <div className="p-3 bg-orange-100 rounded-lg">
              <CheckSquare className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Görev Yönetimi</h1>
              <p className="text-gray-600">Toplam {totalTasks} görev</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Görev
          </motion.button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Görev</p>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tamamlanan</p>
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Devam Eden</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressTasks}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Geciken</p>
                <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Görev ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="completed">Tamamlandı</option>
            <option value="in_progress">Devam Ediyor</option>
            <option value="pending">Beklemede</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tüm Öncelikler</option>
            <option value="high">Yüksek</option>
            <option value="medium">Orta</option>
            <option value="low">Düşük</option>
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedTasks.map((task) => {
          const statusInfo = getStatusInfo(task.status);
          const StatusIcon = statusInfo.icon;
          const priorityInfo = getPriorityInfo(task.priority);
          const PriorityIcon = priorityInfo.icon;
          const overdue = isOverdue(task.dueDate, task.status);
          
          return (
            <motion.div
              key={task.id}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`bg-white rounded-lg shadow-md border overflow-hidden cursor-pointer ${
                overdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
              }`}
              onClick={() => handleTaskClick(task)}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{task.title}</h3>
                  <div className="flex items-center gap-2">
                    <PriorityIcon className="w-5 h-5" style={{ color: priorityInfo.color }} />
                    <StatusIcon className="w-5 h-5" style={{ color: statusInfo.color }} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Tag className="w-4 h-4" />
                  <span>{task.category}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="text-sm text-gray-600 line-clamp-2">
                  {task.description}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{task.assignee}</span>
                  {task.assignees.length > 1 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      +{task.assignees.length - 1}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className={overdue ? 'text-red-600 font-medium' : ''}>
                    {formatDate(task.dueDate)}
                  </span>
                  {overdue && <XCircle className="w-4 h-4 text-red-600" />}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{task.location}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-4 pb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">İlerleme</span>
                  <span className="text-xs font-medium text-gray-900">{task.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{
                      backgroundColor: statusInfo.color,
                      width: `${task.progress}%`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="px-4 pb-3">
                <div className="flex flex-wrap gap-1">
                  {task.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {task.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      +{task.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {task.actualHours}/{task.estimatedHours}h
                    </span>
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
                  ? 'bg-orange-600 text-white border-orange-600'
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
      {showModal && selectedTask && (
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
              <h2 className="text-xl font-bold text-gray-900">Görev Detayı</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Başlık</label>
                <p className="text-gray-900">{selectedTask.title}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Açıklama</label>
                <p className="text-gray-900">{selectedTask.description}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Sorumlu</label>
                <p className="text-gray-900">{selectedTask.assignee}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Durum</label>
                <div className="flex items-center gap-2">
                  {(() => {
                    const statusInfo = getStatusInfo(selectedTask.status);
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
                <label className="text-sm font-medium text-gray-700">Öncelik</label>
                <div className="flex items-center gap-2">
                  {(() => {
                    const priorityInfo = getPriorityInfo(selectedTask.priority);
                    const PriorityIcon = priorityInfo.icon;
                    return (
                      <>
                        <PriorityIcon className="w-4 h-4" style={{ color: priorityInfo.color }} />
                        <span style={{ color: priorityInfo.color }}>{priorityInfo.text}</span>
                      </>
                    );
                  })()}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Kategori</label>
                <p className="text-gray-900">{selectedTask.category}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Konum</label>
                <p className="text-gray-900">{selectedTask.location}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Bitiş Tarihi</label>
                <p className={`text-gray-900 ${isOverdue(selectedTask.dueDate, selectedTask.status) ? 'text-red-600 font-medium' : ''}`}>
                  {formatDate(selectedTask.dueDate)}
                  {isOverdue(selectedTask.dueDate, selectedTask.status) && ' (Gecikmiş)'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">İlerleme</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        backgroundColor: getStatusInfo(selectedTask.status).color,
                        width: `${selectedTask.progress}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">{selectedTask.progress}%</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Saat</label>
                <p className="text-gray-900">{selectedTask.actualHours}/{selectedTask.estimatedHours} saat</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Etiketler</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedTask.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Notlar</label>
                <p className="text-gray-900">{selectedTask.notes}</p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
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

export default Tasks;