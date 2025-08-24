import { AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Filter,
  Loader,
  MapPin,
  Plus,
  Search,
  Target,
  Trash2,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useForm } from '../hooks/useForm';
import { useModal } from '../hooks/useModal';
import { projectService } from '../services/projectService';
import { budgetService } from '../services/budgetService';
import { tasksService } from '../services/tasksService';
import { volunteersService } from '../services/volunteersService';
import { beneficiariesService } from '../services/beneficiariesService';

const ProjectManagement = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    budgetRange: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [volunteers, setVolunteers] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [budgetData, setBudgetData] = useState({});
  
  const modal = useModal();
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Form validation rules
  const validationRules = {
    name: { required: true, label: 'Proje Adı' },
    description: { required: true, label: 'Açıklama' },
    startDate: { required: true, label: 'Başlangıç Tarihi' },
    endDate: { required: true, label: 'Bitiş Tarihi' },
    budget: { required: true, label: 'Bütçe', min: 0 },
    category: { required: true, label: 'Kategori' },
    priority: { required: true, label: 'Öncelik' },
  };

  const form = useForm(
    {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      budget: '',
      category: '',
      priority: 'medium',
      status: 'planning',
      location: '',
      manager: '',
      team: [],
      beneficiaries: [],
      objectives: [],
      risks: [],
      milestones: [],
    },
    validationRules
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projectsData, volunteersData, beneficiariesData, budgetData] = await Promise.all([
        projectService.getAllProjects(),
        volunteersService.getAll(),
        beneficiariesService.getAllBeneficiaries(),
        budgetService.getBudgetOverview(),
      ]);

      setProjects(projectsData.data || []);
      setFilteredProjects(projectsData.data || []);
      setVolunteers(volunteersData || []);
      setBeneficiaries(beneficiariesData.data || []);
      setBudgetData(budgetData || {});
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Arama ve filtreleme
  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(
        project =>
          project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(project => project.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(project => project.priority === filters.priority);
    }

    if (filters.category) {
      filtered = filtered.filter(project => project.category === filters.category);
    }

    if (filters.budgetRange) {
      const [min, max] = filters.budgetRange.split('-').map(Number);
      filtered = filtered.filter(project => {
        const budget = parseFloat(project.budget);
        return budget >= min && budget <= max;
      });
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, filters]);

  const handleFormSubmit = async (values) => {
    try {
      if (editingProject) {
        await projectService.updateProject(editingProject.id, values);
        toast.success('Proje başarıyla güncellendi!');
      } else {
        await projectService.createProject(values);
        toast.success('Proje başarıyla oluşturuldu!');
      }
      
      modal.close();
      form.reset();
      setEditingProject(null);
      loadData();
    } catch (error) {
      console.error('Proje kaydedilirken hata:', error);
      toast.error('Proje kaydedilirken bir hata oluştu.');
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    form.setValues({
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      budget: project.budget,
      category: project.category,
      priority: project.priority,
      status: project.status,
      location: project.location,
      manager: project.manager,
      team: project.team || [],
      beneficiaries: project.beneficiaries || [],
      objectives: project.objectives || [],
      risks: project.risks || [],
      milestones: project.milestones || [],
    });
    modal.open();
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      try {
        await projectService.deleteProject(projectId);
        toast.success('Proje başarıyla silindi!');
        loadData();
      } catch (error) {
        console.error('Proje silinirken hata:', error);
        toast.error('Proje silinirken bir hata oluştu.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return { bg: '#fef3c7', color: '#92400e', text: 'Planlama' };
      case 'active': return { bg: '#dcfce7', color: '#166534', text: 'Aktif' };
      case 'on-hold': return { bg: '#fef3c7', color: '#92400e', text: 'Beklemede' };
      case 'completed': return { bg: '#dcfce7', color: '#166534', text: 'Tamamlandı' };
      case 'cancelled': return { bg: '#fee2e2', color: '#991b1b', text: 'İptal' };
      default: return { bg: '#f1f5f9', color: '#475569', text: 'Bilinmiyor' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  const calculateProgress = (project) => {
    if (!project.milestones || project.milestones.length === 0) return 0;
    const completed = project.milestones.filter(m => m.completed).length;
    return Math.round((completed / project.milestones.length) * 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const projectStats = [
    {
      title: 'Toplam Proje',
      value: projects.length,
      icon: Target,
      color: '#3b82f6',
    },
    {
      title: 'Aktif Proje',
      value: projects.filter(p => p.status === 'active').length,
      icon: TrendingUp,
      color: '#10b981',
    },
    {
      title: 'Toplam Bütçe',
      value: formatCurrency(projects.reduce((sum, p) => sum + parseFloat(p.budget || 0), 0)),
      icon: DollarSign,
      color: '#f59e0b',
    },
    {
      title: 'Tamamlanan',
      value: projects.filter(p => p.status === 'completed').length,
      icon: CheckCircle,
      color: '#10b981',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Proje Yönetimi</h1>
          <p className="text-gray-600 mt-2">Projeleri planlayın, takip edin ve yönetin</p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            form.reset();
            modal.open();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Yeni Proje
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {projectStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8" style={{ color: stat.color }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Proje ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tüm Durumlar</option>
              <option value="planning">Planlama</option>
              <option value="active">Aktif</option>
              <option value="on-hold">Beklemede</option>
              <option value="completed">Tamamlandı</option>
              <option value="cancelled">İptal</option>
            </select>
            
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tüm Öncelikler</option>
              <option value="high">Yüksek</option>
              <option value="medium">Orta</option>
              <option value="low">Düşük</option>
            </select>
            
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tüm Kategoriler</option>
              <option value="education">Eğitim</option>
              <option value="health">Sağlık</option>
              <option value="social">Sosyal Yardım</option>
              <option value="emergency">Acil Yardım</option>
              <option value="infrastructure">Altyapı</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İlerleme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bütçe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: getPriorityColor(project.priority) }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {project.category}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      style={{
                        backgroundColor: getStatusColor(project.status).bg,
                        color: getStatusColor(project.status).color,
                      }}
                    >
                      {getStatusColor(project.status).text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${calculateProgress(project)}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900">
                        {calculateProgress(project)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(project.budget)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>Başlangıç: {formatDate(project.startDate)}</div>
                      <div>Bitiş: {formatDate(project.endDate)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditProject(project)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Form Modal */}
      <AnimatePresence>
        {modal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={modal.close}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {editingProject ? 'Proje Düzenle' : 'Yeni Proje'}
                  </h2>
                  <button
                    onClick={modal.close}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proje Adı *
                    </label>
                    <input
                      type="text"
                      {...form.register('name')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {form.errors.name && (
                      <p className="text-red-500 text-sm mt-1">{form.errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori *
                    </label>
                    <select
                      {...form.register('category')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Kategori Seçin</option>
                      <option value="education">Eğitim</option>
                      <option value="health">Sağlık</option>
                      <option value="social">Sosyal Yardım</option>
                      <option value="emergency">Acil Yardım</option>
                      <option value="infrastructure">Altyapı</option>
                    </select>
                    {form.errors.category && (
                      <p className="text-red-500 text-sm mt-1">{form.errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlangıç Tarihi *
                    </label>
                    <input
                      type="date"
                      {...form.register('startDate')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {form.errors.startDate && (
                      <p className="text-red-500 text-sm mt-1">{form.errors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bitiş Tarihi *
                    </label>
                    <input
                      type="date"
                      {...form.register('endDate')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {form.errors.endDate && (
                      <p className="text-red-500 text-sm mt-1">{form.errors.endDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bütçe (₺) *
                    </label>
                    <input
                      type="number"
                      {...form.register('budget')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {form.errors.budget && (
                      <p className="text-red-500 text-sm mt-1">{form.errors.budget}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Öncelik *
                    </label>
                    <select
                      {...form.register('priority')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Düşük</option>
                      <option value="medium">Orta</option>
                      <option value="high">Yüksek</option>
                    </select>
                    {form.errors.priority && (
                      <p className="text-red-500 text-sm mt-1">{form.errors.priority}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durum
                    </label>
                    <select
                      {...form.register('status')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="planning">Planlama</option>
                      <option value="active">Aktif</option>
                      <option value="on-hold">Beklemede</option>
                      <option value="completed">Tamamlandı</option>
                      <option value="cancelled">İptal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konum
                    </label>
                    <input
                      type="text"
                      {...form.register('location')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama *
                  </label>
                  <textarea
                    {...form.register('description')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {form.errors.description && (
                    <p className="text-red-500 text-sm mt-1">{form.errors.description}</p>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={modal.close}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={form.isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {form.isSubmitting ? 'Kaydediliyor...' : (editingProject ? 'Güncelle' : 'Oluştur')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{selectedProject.name}</h2>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Proje Detayları</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">Kategori:</span> {selectedProject.category}
                      </div>
                      <div>
                        <span className="font-medium">Durum:</span>
                        <span
                          className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          style={{
                            backgroundColor: getStatusColor(selectedProject.status).bg,
                            color: getStatusColor(selectedProject.status).color,
                          }}
                        >
                          {getStatusColor(selectedProject.status).text}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Öncelik:</span>
                        <span
                          className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          style={{
                            backgroundColor: getPriorityColor(selectedProject.priority) + '20',
                            color: getPriorityColor(selectedProject.priority),
                          }}
                        >
                          {selectedProject.priority}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Bütçe:</span> {formatCurrency(selectedProject.budget)}
                      </div>
                      <div>
                        <span className="font-medium">İlerleme:</span> {calculateProgress(selectedProject)}%
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Tarih Bilgileri</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">Başlangıç:</span> {formatDate(selectedProject.startDate)}
                      </div>
                      <div>
                        <span className="font-medium">Bitiş:</span> {formatDate(selectedProject.endDate)}
                      </div>
                      <div>
                        <span className="font-medium">Konum:</span> {selectedProject.location || 'Belirtilmemiş'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Açıklama</h3>
                  <p className="text-gray-700">{selectedProject.description}</p>
                </div>

                {selectedProject.milestones && selectedProject.milestones.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Kilometre Taşları</h3>
                    <div className="space-y-2">
                      {selectedProject.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={milestone.completed}
                            onChange={() => {
                              // Milestone completion logic
                            }}
                            className="rounded"
                          />
                          <span className={milestone.completed ? 'line-through text-gray-500' : ''}>
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectManagement;
