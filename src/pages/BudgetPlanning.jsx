import { AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  Edit,
  Eye,
  Filter,
  Loader,
  PieChart,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useForm } from '../hooks/useForm';
import { useModal } from '../hooks/useModal';
import { budgetService } from '../services/budgetService';
import { projectService } from '../services/projectService';
import { financeService } from '../services/financeService';
import { donationsService } from '../services/donationsService';
import { BarChart, LineChart, PieChart as CustomPieChart } from '../components/DataVisualization';

const BudgetPlanning = () => {
  const { t } = useTranslation();
  const [budgets, setBudgets] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    category: '',
    status: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [projects, setProjects] = useState([]);
  const [financialData, setFinancialData] = useState({});
  const [donationData, setDonationData] = useState({});
  const [selectedBudget, setSelectedBudget] = useState(null);
  
  const modal = useModal();
  const [editingBudget, setEditingBudget] = useState(null);

  // Form validation rules
  const validationRules = {
    name: { required: true, label: 'Bütçe Adı' },
    year: { required: true, label: 'Yıl' },
    totalBudget: { required: true, label: 'Toplam Bütçe', min: 0 },
    category: { required: true, label: 'Kategori' },
  };

  const form = useForm(
    {
      name: '',
      year: new Date().getFullYear().toString(),
      totalBudget: '',
      category: '',
      description: '',
      status: 'draft',
      allocations: [],
      incomeSources: [],
      expenseCategories: [],
      notes: '',
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
      
      const [budgetsData, projectsData, financialData, donationData] = await Promise.all([
        budgetService.getAllBudgets(),
        projectService.getAllProjects(),
        financeService.getAll(),
        donationsService.getAllDonations(),
      ]);

      setBudgets(budgetsData.data || []);
      setFilteredBudgets(budgetsData.data || []);
      setProjects(projectsData.data || []);
      setFinancialData(financialData || []);
      setDonationData(donationData.data || []);
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Arama ve filtreleme
  useEffect(() => {
    let filtered = budgets;

    if (searchTerm) {
      filtered = filtered.filter(
        budget =>
          budget.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          budget.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          budget.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.year) {
      filtered = filtered.filter(budget => budget.year === filters.year);
    }

    if (filters.category) {
      filtered = filtered.filter(budget => budget.category === filters.category);
    }

    if (filters.status) {
      filtered = filtered.filter(budget => budget.status === filters.status);
    }

    setFilteredBudgets(filtered);
  }, [budgets, searchTerm, filters]);

  const handleFormSubmit = async (values) => {
    try {
      if (editingBudget) {
        await budgetService.updateBudget(editingBudget.id, values);
        toast.success('Bütçe başarıyla güncellendi!');
      } else {
        await budgetService.createBudget(values);
        toast.success('Bütçe başarıyla oluşturuldu!');
      }
      
      modal.close();
      form.reset();
      setEditingBudget(null);
      loadData();
    } catch (error) {
      console.error('Bütçe kaydedilirken hata:', error);
      toast.error('Bütçe kaydedilirken bir hata oluştu.');
    }
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    form.setValues({
      name: budget.name,
      year: budget.year,
      totalBudget: budget.totalBudget,
      category: budget.category,
      description: budget.description,
      status: budget.status,
      allocations: budget.allocations || [],
      incomeSources: budget.incomeSources || [],
      expenseCategories: budget.expenseCategories || [],
      notes: budget.notes || '',
    });
    modal.open();
  };

  const handleDeleteBudget = async (budgetId) => {
    if (window.confirm('Bu bütçeyi silmek istediğinizden emin misiniz?')) {
      try {
        await budgetService.deleteBudget(budgetId);
        toast.success('Bütçe başarıyla silindi!');
        loadData();
      } catch (error) {
        console.error('Bütçe silinirken hata:', error);
        toast.error('Bütçe silinirken bir hata oluştu.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return { bg: '#fef3c7', color: '#92400e', text: 'Taslak' };
      case 'active': return { bg: '#dcfce7', color: '#166534', text: 'Aktif' };
      case 'approved': return { bg: '#dcfce7', color: '#166534', text: 'Onaylandı' };
      case 'completed': return { bg: '#dcfce7', color: '#166534', text: 'Tamamlandı' };
      case 'cancelled': return { bg: '#fee2e2', color: '#991b1b', text: 'İptal' };
      default: return { bg: '#f1f5f9', color: '#475569', text: 'Bilinmiyor' };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateBudgetUtilization = (budget) => {
    const totalAllocated = budget.allocations?.reduce((sum, alloc) => sum + parseFloat(alloc.amount || 0), 0) || 0;
    const utilization = (totalAllocated / parseFloat(budget.totalBudget)) * 100;
    return Math.min(utilization, 100);
  };

  const calculateBudgetVariance = (budget) => {
    const totalAllocated = budget.allocations?.reduce((sum, alloc) => sum + parseFloat(alloc.amount || 0), 0) || 0;
    const variance = parseFloat(budget.totalBudget) - totalAllocated;
    return variance;
  };

  const budgetStats = [
    {
      title: 'Toplam Bütçe',
      value: formatCurrency(budgets.reduce((sum, b) => sum + parseFloat(b.totalBudget || 0), 0)),
      icon: DollarSign,
      color: '#3b82f6',
    },
    {
      title: 'Aktif Bütçe',
      value: budgets.filter(b => b.status === 'active').length,
      icon: TrendingUp,
      color: '#10b981',
    },
    {
      title: 'Ortalama Kullanım',
      value: budgets.length > 0 
        ? Math.round(budgets.reduce((sum, b) => sum + calculateBudgetUtilization(b), 0) / budgets.length) + '%'
        : '0%',
      icon: BarChart3,
      color: '#f59e0b',
    },
    {
      title: 'Toplam Varyans',
      value: formatCurrency(budgets.reduce((sum, b) => sum + calculateBudgetVariance(b), 0)),
      icon: TrendingDown,
      color: '#ef4444',
    },
  ];

  const generateBudgetReport = () => {
    const reportData = {
      totalBudgets: budgets.length,
      totalAmount: budgets.reduce((sum, b) => sum + parseFloat(b.totalBudget || 0), 0),
      averageUtilization: budgets.length > 0 
        ? budgets.reduce((sum, b) => sum + calculateBudgetUtilization(b), 0) / budgets.length
        : 0,
      categoryBreakdown: budgets.reduce((acc, budget) => {
        acc[budget.category] = (acc[budget.category] || 0) + parseFloat(budget.totalBudget || 0);
        return acc;
      }, {}),
    };
    
    // Burada rapor indirme işlemi yapılabilir
    console.log('Budget Report:', reportData);
    toast.success('Bütçe raporu hazırlandı!');
  };

  const chartData = {
    budgetTrend: [
      { label: 'Oca', value: 450000 },
      { label: 'Şub', value: 520000 },
      { label: 'Mar', value: 480000 },
      { label: 'Nis', value: 610000 },
      { label: 'May', value: 550000 },
      { label: 'Haz', value: 670000 },
    ],
    categoryDistribution: [
      { label: 'Eğitim', value: 35 },
      { label: 'Sağlık', value: 25 },
      { label: 'Sosyal Yardım', value: 20 },
      { label: 'Acil Yardım', value: 15 },
      { label: 'Altyapı', value: 5 },
    ],
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Bütçe Planlama</h1>
          <p className="text-gray-600 mt-2">Bütçeleri planlayın, takip edin ve analiz edin</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generateBudgetReport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            Rapor İndir
          </button>
          <button
            onClick={() => {
              setEditingBudget(null);
              form.reset();
              modal.open();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Yeni Bütçe
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {budgetStats.map((stat, index) => (
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Bütçe Trendi</h3>
          <LineChart data={chartData.budgetTrend} height={300} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Kategori Dağılımı</h3>
          <CustomPieChart data={chartData.categoryDistribution} height={300} />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Bütçe ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tüm Yıllar</option>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
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
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tüm Durumlar</option>
              <option value="draft">Taslak</option>
              <option value="active">Aktif</option>
              <option value="approved">Onaylandı</option>
              <option value="completed">Tamamlandı</option>
              <option value="cancelled">İptal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Budgets List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bütçe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanım
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toplam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Varyans
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBudgets.map((budget) => (
                <motion.tr
                  key={budget.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {budget.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {budget.category} • {budget.year}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      style={{
                        backgroundColor: getStatusColor(budget.status).bg,
                        color: getStatusColor(budget.status).color,
                      }}
                    >
                      {getStatusColor(budget.status).text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${calculateBudgetUtilization(budget)}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900">
                        {Math.round(calculateBudgetUtilization(budget))}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(budget.totalBudget)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={calculateBudgetVariance(budget) >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(calculateBudgetVariance(budget))}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedBudget(budget)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditBudget(budget)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBudget(budget.id)}
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

      {/* Budget Form Modal */}
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
                    {editingBudget ? 'Bütçe Düzenle' : 'Yeni Bütçe'}
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
                      Bütçe Adı *
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
                      Yıl *
                    </label>
                    <select
                      {...form.register('year')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map(year => (
                        <option key={year} value={year.toString()}>{year}</option>
                      ))}
                    </select>
                    {form.errors.year && (
                      <p className="text-red-500 text-sm mt-1">{form.errors.year}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Toplam Bütçe (₺) *
                    </label>
                    <input
                      type="number"
                      {...form.register('totalBudget')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {form.errors.totalBudget && (
                      <p className="text-red-500 text-sm mt-1">{form.errors.totalBudget}</p>
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
                      <option value="draft">Taslak</option>
                      <option value="active">Aktif</option>
                      <option value="approved">Onaylandı</option>
                      <option value="completed">Tamamlandı</option>
                      <option value="cancelled">İptal</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    {...form.register('description')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                    {form.isSubmitting ? 'Kaydediliyor...' : (editingBudget ? 'Güncelle' : 'Oluştur')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget Detail Modal */}
      <AnimatePresence>
        {selectedBudget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBudget(null)}
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
                  <h2 className="text-xl font-semibold">{selectedBudget.name}</h2>
                  <button
                    onClick={() => setSelectedBudget(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Bütçe Detayları</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">Kategori:</span> {selectedBudget.category}
                      </div>
                      <div>
                        <span className="font-medium">Yıl:</span> {selectedBudget.year}
                      </div>
                      <div>
                        <span className="font-medium">Durum:</span>
                        <span
                          className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          style={{
                            backgroundColor: getStatusColor(selectedBudget.status).bg,
                            color: getStatusColor(selectedBudget.status).color,
                          }}
                        >
                          {getStatusColor(selectedBudget.status).text}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Toplam Bütçe:</span> {formatCurrency(selectedBudget.totalBudget)}
                      </div>
                      <div>
                        <span className="font-medium">Kullanım:</span> {Math.round(calculateBudgetUtilization(selectedBudget))}%
                      </div>
                      <div>
                        <span className="font-medium">Varyans:</span>
                        <span className={calculateBudgetVariance(selectedBudget) >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {' '}{formatCurrency(calculateBudgetVariance(selectedBudget))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Bütçe Kullanımı</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Kullanılan</span>
                          <span>{formatCurrency(selectedBudget.allocations?.reduce((sum, alloc) => sum + parseFloat(alloc.amount || 0), 0) || 0)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${calculateBudgetUtilization(selectedBudget)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Kalan</span>
                          <span>{formatCurrency(calculateBudgetVariance(selectedBudget))}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedBudget.description && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Açıklama</h3>
                    <p className="text-gray-700">{selectedBudget.description}</p>
                  </div>
                )}

                {selectedBudget.allocations && selectedBudget.allocations.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Bütçe Tahsisleri</h3>
                    <div className="space-y-2">
                      {selectedBudget.allocations.map((allocation, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{allocation.category}</div>
                            <div className="text-sm text-gray-500">{allocation.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(allocation.amount)}</div>
                            <div className="text-sm text-gray-500">{allocation.date}</div>
                          </div>
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

export default BudgetPlanning;
