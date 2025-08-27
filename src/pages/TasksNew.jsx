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
  Tag,
} from 'lucide-react';

// Design System Components
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Label,
  Select,
  Badge,
  StatusBadge,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Modal,
  PaginationWithInfo,
  Alert,
  AlertTitle,
  AlertDescription
} from '../ui';
import { Page } from '../layouts/Page';

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
    title: 'Kumbara toplama etkinliği',
    description: 'Şehir merkezinde kumbara toplama etkinliği düzenlenmesi',
    status: 'pending',
    priority: 'medium',
    assignee: 'Zeynep Arslan',
    assignees: ['Zeynep Arslan', 'Can Özkan'],
    dueDate: '2024-01-28',
    createdAt: '2024-01-21',
    completedAt: null,
    progress: 0,
    category: 'Fon Toplama',
    location: 'İstanbul, Türkiye',
    estimatedHours: 16,
    actualHours: 0,
    tags: ['kumbara', 'etkinlik', 'fon-toplama'],
    notes: 'Belediyeden izin alınması gerekiyor',
  },
];

const statusOptions = [
  { value: 'all', label: 'Tümü' },
  { value: 'pending', label: 'Beklemede' },
  { value: 'in_progress', label: 'Devam Ediyor' },
  { value: 'completed', label: 'Tamamlandı' },
];

const priorityOptions = [
  { value: 'all', label: 'Tümü' },
  { value: 'high', label: 'Yüksek' },
  { value: 'medium', label: 'Orta' },
  { value: 'low', label: 'Düşük' },
];

const TasksNew = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(statusOptions[0]);
  const [filterPriority, setFilterPriority] = useState(priorityOptions[0]);
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
    
    const matchesStatusFilter = filterStatus.value === 'all' || task.status === filterStatus.value;
    const matchesPriorityFilter = filterPriority.value === 'all' || task.priority === filterPriority.value;
    
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

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  // Get priority text
  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return 'Bilinmiyor';
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Page>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Görevler
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Görev yönetimi ve takip sistemi
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Yeni Görev
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Toplam Görev
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalTasks}
                  </p>
                </div>
                <CheckSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Tamamlanan
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {completedTasks}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Devam Eden
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {inProgressTasks}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Geciken
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {overdueTasks}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filtreler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Arama</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Görev ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status-filter">Durum</Label>
                <Select 
                  options={statusOptions}
                  value={filterStatus} 
                  onChange={setFilterStatus}
                  placeholder="Durum seçin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority-filter">Öncelik</Label>
                <Select 
                  options={priorityOptions}
                  value={filterPriority} 
                  onChange={setFilterPriority}
                  placeholder="Öncelik seçin"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Table */}
        <Card>
          <CardHeader>
            <CardTitle>Görev Listesi</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : paginatedTasks.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Görev Bulunamadı</AlertTitle>
                <AlertDescription>
                  Arama kriterlerinize uygun görev bulunamadı.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Görev</TableHead>
                      <TableHead>Atanan</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Öncelik</TableHead>
                      <TableHead>Bitiş Tarihi</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTasks.map((task) => {
                      const statusInfo = getStatusInfo(task.status);
                      const StatusIcon = statusInfo.icon;

                      return (
                        <TableRow
                          key={task.id}
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => handleTaskClick(task)}
                        >
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {task.title}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {task.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{task.assignee}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge
                              variant={task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'info' : 'warning'}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusInfo.text}
                            </StatusBadge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getPriorityColor(task.priority)}>
                              {getPriorityText(task.priority)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{task.dueDate}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle edit
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle delete
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="mt-6">
                  <PaginationWithInfo
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredTasks.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Task Detail Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={selectedTask?.title || 'Görev Detayları'}
        >
          {selectedTask && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Açıklama</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedTask.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Atanan Kişi</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedTask.assignee}
                  </p>
                </div>
                <div>
                  <Label>Bitiş Tarihi</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedTask.dueDate}
                  </p>
                </div>
                <div>
                  <Label>Kategori</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedTask.category}
                  </p>
                </div>
                <div>
                  <Label>Konum</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedTask.location}
                  </p>
                </div>
              </div>

              {selectedTask.tags && selectedTask.tags.length > 0 && (
                <div>
                  <Label>Etiketler</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTask.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedTask.notes && (
                <div>
                  <Label>Notlar</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedTask.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </motion.div>
    </Page>
  );
};

export default TasksNew;
