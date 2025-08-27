import { useState, useEffect } from 'react';
import {
  Page,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  FormField,
  Input,
  Select,
  Textarea,
  Alert,
  Badge,
  DataTable,
  Modal,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  SimpleBreadcrumb,
  Loading
} from '../ui';
import { donationsService } from '../services/donationsService';

/**
 * Modern Donations Page - Design System Example
 * Demonstrates form components, validation, and data management
 */
const DonationsNew = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('list');
  const [formData, setFormData] = useState({
    donorName: '',
    donorType: 'individual',
    amount: '',
    currency: 'TRY',
    category: '',
    description: '',
    isRecurring: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Donation categories
  const categories = [
    { value: 'education', label: 'Eğitim Desteği' },
    { value: 'health', label: 'Sağlık Desteği' },
    { value: 'food', label: 'Gıda Yardımı' },
    { value: 'clothing', label: 'Giyim Yardımı' },
    { value: 'shelter', label: 'Barınma Desteği' },
    { value: 'emergency', label: 'Acil Durum' },
    { value: 'other', label: 'Diğer' },
  ];

  // Donor types
  const donorTypes = [
    { value: 'individual', label: 'Bireysel' },
    { value: 'corporate', label: 'Kurumsal' },
    { value: 'foundation', label: 'Vakıf/Dernek' },
  ];

  // Currencies
  const currencies = [
    { value: 'TRY', label: '₺ Türk Lirası' },
    { value: 'USD', label: '$ Dolar' },
    { value: 'EUR', label: '€ Euro' },
  ];

  // Table columns
  const columns = [
    {
      key: 'donorName',
      title: 'Bağışçı',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500">
            {donorTypes.find(t => t.value === row.donorType)?.label || row.donorType}
          </div>
        </div>
      )
    },
    {
      key: 'amount',
      title: 'Tutar',
      align: 'right',
      render: (value, row) => (
        <div className="font-mono">
          {new Intl.NumberFormat('tr-TR').format(value)} {row.currency}
        </div>
      )
    },
    {
      key: 'category',
      title: 'Kategori',
      align: 'center',
      render: (value) => (
        <Badge variant="secondary">
          {categories.find(c => c.value === value)?.label || value}
        </Badge>
      )
    },
    {
      key: 'date',
      title: 'Tarih',
      width: '40',
      render: (value) => new Date(value).toLocaleDateString('tr-TR')
    },
    {
      key: 'status',
      title: 'Durum',
      width: '32',
      align: 'center',
      render: (value) => (
        <Badge 
          variant={value === 'completed' ? 'success' : 
                   value === 'pending' ? 'warning' : 'secondary'}
        >
          {value === 'completed' ? 'Tamamlandı' : 
           value === 'pending' ? 'Beklemede' : value}
        </Badge>
      )
    }
  ];

  // Load donations
  useEffect(() => {
    const loadDonations = async () => {
      try {
        setLoading(true);
        const data = await donationsService.getAllDonations();
        setDonations(data || []);
      } catch (error) {
        console.error('Donations loading error:', error);
        setDonations([]);
      } finally {
        setLoading(false);
      }
    };

    loadDonations();
  }, []);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.donorName.trim()) {
      errors.donorName = 'Bağışçı adı zorunludur';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Geçerli bir tutar giriniz';
    }

    if (!formData.category) {
      errors.category = 'Kategori seçiniz';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      await donationsService.createDonation({
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date().toISOString(),
        status: 'completed'
      });

      setSubmitSuccess(true);
      setFormData({
        donorName: '',
        donorType: 'individual',
        amount: '',
        currency: 'TRY',
        category: '',
        description: '',
        isRecurring: false,
      });
      setFormErrors({});
      
      // Reload donations
      const data = await donationsService.getAllDonations();
      setDonations(data || []);
      
      setTimeout(() => {
        setShowAddModal(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Donation creation error:', error);
      setFormErrors({ submit: 'Bağış kaydedilemedi. Lütfen tekrar deneyin.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: donations.length,
    totalAmount: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
    thisMonth: donations.filter(d => 
      new Date(d.date).getMonth() === new Date().getMonth() &&
      new Date(d.date).getFullYear() === new Date().getFullYear()
    ).length,
    avgAmount: donations.length > 0 ? 
      donations.reduce((sum, d) => sum + (d.amount || 0), 0) / donations.length : 0
  };

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/dashboard' },
    { label: 'Bağışlar', href: '/donations' }
  ];

  if (loading) {
    return (
      <Page title="Bağışlar" description="Yükleniyor...">
        <Loading type="card" />
      </Page>
    );
  }

  return (
    <Page 
      title="Bağış Yönetimi"
      description="Bağış kayıtları ve yönetimi"
      breadcrumb={<SimpleBreadcrumb items={breadcrumbItems} />}
      actions={
        <Button onClick={() => setShowAddModal(true)}>
          ➕ Yeni Bağış Ekle
        </Button>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-brand-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Toplam Bağış</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              ₺{new Intl.NumberFormat('tr-TR').format(stats.totalAmount)}
            </div>
            <div className="text-sm text-gray-600">Toplam Tutar</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {stats.thisMonth}
            </div>
            <div className="text-sm text-gray-600">Bu Ay</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              ₺{new Intl.NumberFormat('tr-TR').format(stats.avgAmount)}
            </div>
            <div className="text-sm text-gray-600">Ortalama</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="list">
            Bağış Listesi ({donations.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Analitik
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Tüm Bağışlar</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                columns={columns}
                data={donations}
                searchable={true}
                sortable={true}
                pageSize={20}
                searchPlaceholder="Bağışçı adı veya kategori ile ara..."
                emptyText="Henüz bağış kaydı bulunmamaktadır"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Kategori Dağılımı</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map(category => {
                    const count = donations.filter(d => d.category === category.value).length;
                    const percentage = donations.length > 0 ? (count / donations.length) * 100 : 0;
                    
                    return (
                      <div key={category.value} className="flex items-center justify-between">
                        <span className="text-sm">{category.label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-brand-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-mono w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bağışçı Türleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {donorTypes.map(type => {
                    const count = donations.filter(d => d.donorType === type.value).length;
                    const percentage = donations.length > 0 ? (count / donations.length) * 100 : 0;
                    
                    return (
                      <div key={type.value} className="flex items-center justify-between">
                        <span className="text-sm">{type.label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-mono w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Donation Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setFormErrors({});
          setSubmitSuccess(false);
        }}
        title="Yeni Bağış Ekle"
        size="lg"
      >
        {submitSuccess && (
          <Alert variant="success" className="mb-4">
            <Alert.Title>Başarılı!</Alert.Title>
            <Alert.Description>
              Bağış başarıyla kaydedildi.
            </Alert.Description>
          </Alert>
        )}

        {formErrors.submit && (
          <Alert variant="danger" className="mb-4">
            <Alert.Title>Hata</Alert.Title>
            <Alert.Description>{formErrors.submit}</Alert.Description>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField>
              <Input
                label="Bağışçı Adı"
                placeholder="Bağışçı adı ve soyadı"
                value={formData.donorName}
                onChange={(e) => setFormData(prev => ({ ...prev, donorName: e.target.value }))}
                error={formErrors.donorName}
                required
              />
            </FormField>

            <FormField>
              <Select
                label="Bağışçı Türü"
                options={donorTypes}
                value={formData.donorType}
                onChange={(value) => setFormData(prev => ({ ...prev, donorType: value }))}
                placeholder="Bağışçı türü seçin"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField>
              <Input
                label="Bağış Tutarı"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                error={formErrors.amount}
                required
              />
            </FormField>

            <FormField>
              <Select
                label="Para Birimi"
                options={currencies}
                value={formData.currency}
                onChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
              />
            </FormField>
          </div>

          <FormField>
            <Select
              label="Kategori"
              options={categories}
              value={formData.category}
              onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              placeholder="Bağış kategorisi seçin"
              error={formErrors.category}
              required
            />
          </FormField>

          <FormField>
            <Textarea
              label="Açıklama"
              placeholder="Bağış hakkında ek bilgiler..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button"
              variant="outline"
              onClick={() => setShowAddModal(false)}
              disabled={isSubmitting}
            >
              İptal
            </Button>
            <Button 
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </Modal>
    </Page>
  );
};

export default DonationsNew;
