import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  PiggyBank,
  BarChart3,
  Calendar,
  Clock,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';

// Design System Components
import { Page } from '../layouts';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Button,
  Badge,
  StatusBadge,
  Alert,
  AlertTitle,
  AlertDescription,
  DataTable,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  Input,
  Label,
  FormField
} from '../ui';

const FinanceNew = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  const financialStats = [
    {
      title: 'Toplam Gelir',
      value: '₺125,430',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'success'
    },
    {
      title: 'Toplam Gider',
      value: '₺89,210',
      change: '+8.2%',
      trend: 'up',
      icon: TrendingDown,
      color: 'danger'
    },
    {
      title: 'Net Kar',
      value: '₺36,220',
      change: '+15.3%',
      trend: 'up',
      icon: BarChart3,
      color: 'success'
    },
    {
      title: 'Bekleyen Ödemeler',
      value: '₺15,800',
      change: '-3.1%',
      trend: 'down',
      icon: Clock,
      color: 'warning'
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      description: 'Bağış - Ahmet Yılmaz',
      amount: 5000,
      type: 'income',
      category: 'Bağış',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 2,
      description: 'Gıda Yardımı Alımı',
      amount: -3200,
      type: 'expense',
      category: 'Gıda',
      date: '2024-01-14',
      status: 'completed'
    },
    {
      id: 3,
      description: 'İlaç Yardımı',
      amount: -1800,
      type: 'expense',
      category: 'Sağlık',
      date: '2024-01-13',
      status: 'pending'
    },
    {
      id: 4,
      description: 'Bağış - Fatma Demir',
      amount: 2500,
      type: 'income',
      category: 'Bağış',
      date: '2024-01-12',
      status: 'completed'
    },
    {
      id: 5,
      description: 'Kırtasiye Malzemeleri',
      amount: -750,
      type: 'expense',
      category: 'Eğitim',
      date: '2024-01-11',
      status: 'completed'
    }
  ];

  const budgetCategories = [
    { name: 'Gıda Yardımı', allocated: 50000, spent: 32000, remaining: 18000 },
    { name: 'Sağlık', allocated: 30000, spent: 18500, remaining: 11500 },
    { name: 'Eğitim', allocated: 25000, spent: 12000, remaining: 13000 },
    { name: 'Barınma', allocated: 20000, spent: 15000, remaining: 5000 },
    { name: 'Ulaşım', allocated: 10000, spent: 8500, remaining: 1500 }
  ];

  const transactionColumns = [
    {
      key: 'description',
      label: 'Açıklama',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${item.type === 'income' ? 'bg-success-500' : 'bg-danger-500'}`} />
          <span className="font-medium">{item.description}</span>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Tutar',
      render: (item) => (
        <span className={`font-semibold ${item.type === 'income' ? 'text-success-600' : 'text-danger-600'}`}>
          {item.type === 'income' ? '+' : ''}₺{Math.abs(item.amount).toLocaleString()}
        </span>
      )
    },
    {
      key: 'category',
      label: 'Kategori',
      render: (item) => <Badge variant="outline">{item.category}</Badge>
    },
    {
      key: 'date',
      label: 'Tarih',
      render: (item) => new Date(item.date).toLocaleDateString('tr-TR')
    },
    {
      key: 'status',
      label: 'Durum',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'actions',
      label: 'İşlemler',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />} />
          <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} />
          <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} />
        </div>
      )
    }
  ];

  const budgetColumns = [
    {
      key: 'name',
      label: 'Kategori',
      render: (item) => <span className="font-medium">{item.name}</span>
    },
    {
      key: 'allocated',
      label: 'Ayrılan',
      render: (item) => `₺${item.allocated.toLocaleString()}`
    },
    {
      key: 'spent',
      label: 'Harcanan',
      render: (item) => `₺${item.spent.toLocaleString()}`
    },
    {
      key: 'remaining',
      label: 'Kalan',
      render: (item) => `₺${item.remaining.toLocaleString()}`
    },
    {
      key: 'progress',
      label: 'İlerleme',
      render: (item) => {
        const percentage = (item.spent / item.allocated) * 100;
        return (
          <div className="w-full">
            <div className="flex justify-between text-sm mb-1">
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${percentage > 80 ? 'bg-danger-500' : percentage > 60 ? 'bg-warning-500' : 'bg-success-500'}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        )
      }
    }
  ];

  return (
    <Page
      title="Finans Yönetimi"
      description="Gelir, gider ve bütçe takibi"
      actions={
        <>
          <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
            Filtrele
          </Button>
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Dışa Aktar
          </Button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Yeni İşlem
          </Button>
        </>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {financialStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-600">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <stat.icon className={`w-4 h-4 ${stat.trend === 'up' ? 'text-success-500' : 'text-danger-500'}`} />
                      <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-success-600' : 'text-danger-600'}`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-muted-500">geçen aya göre</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Period Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Dönem Seçimi</CardTitle>
            <CardDescription>Finansal verileri görüntülemek için dönem seçin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <FormField>
                <Label htmlFor="period">Dönem</Label>
                <Select
                  id="period"
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                  options={[
                    { value: 'week', label: 'Bu Hafta' },
                    { value: 'month', label: 'Bu Ay' },
                    { value: 'quarter', label: 'Bu Çeyrek' },
                    { value: 'year', label: 'Bu Yıl' }
                  ]}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="transactions">İşlemler</TabsTrigger>
            <TabsTrigger value="budget">Bütçe</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gelir Dağılımı</CardTitle>
                  <CardDescription>Bu ayki gelir kaynakları</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Bağışlar</span>
                      <span className="font-semibold">₺85,200</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Devlet Desteği</span>
                      <span className="font-semibold">₺25,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Diğer</span>
                      <span className="font-semibold">₺15,230</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gider Dağılımı</CardTitle>
                  <CardDescription>Bu ayki gider kategorileri</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Gıda Yardımı</span>
                      <span className="font-semibold">₺32,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sağlık</span>
                      <span className="font-semibold">₺18,500</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Eğitim</span>
                      <span className="font-semibold">₺12,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Diğer</span>
                      <span className="font-semibold">₺26,710</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Son İşlemler</CardTitle>
                <CardDescription>Son 30 günün finansal işlemleri</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={recentTransactions}
                  columns={transactionColumns}
                  searchable
                  pagination
                  itemsPerPage={10}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bütçe Takibi</CardTitle>
                <CardDescription>Kategori bazında bütçe durumu</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={budgetCategories}
                  columns={budgetColumns}
                  searchable
                  pagination
                  itemsPerPage={10}
                />
              </CardContent>
            </Card>

            <Alert variant="info">
              <Alert.Title>Bütçe Uyarısı</Alert.Title>
              <Alert.Description>
                Barınma kategorisinde bütçenin %75'i kullanıldı. Yakında bütçe aşımı riski var.
              </Alert.Description>
            </Alert>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Page>
  );
};

export default FinanceNew;
