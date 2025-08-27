import { useState, useEffect } from 'react';
import {
  Page,
  Button,
  DataTable,
  Badge,
  StatusBadge,
  Modal,
  Input,
  FormField,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Loading,
  Tooltip,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '../ui';
import { beneficiariesService } from '../services/beneficiariesService';

/**
 * Modern Beneficiaries Page - Design System Example
 * Shows best practices for using the new component library
 */
const BeneficiariesNew = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');

  // Sample data columns for DataTable
  const columns = [
    {
      key: 'fullName',
      title: 'Ad Soyad',
      sortable: true,
      render: (value, row) => (
        <div className="font-medium">
          {value}
          {row.isUrgent && (
            <Tooltip content="Acil durum">
              <Badge variant="destructive" className="ml-2 text-xs">
                ACİL
              </Badge>
            </Tooltip>
          )}
        </div>
      )
    },
    {
      key: 'tc',
      title: 'TC Kimlik No',
      width: '48',
    },
    {
      key: 'phone',
      title: 'Telefon',
      width: '40',
    },
    {
      key: 'status',
      title: 'Durum',
      width: '32',
      align: 'center',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'createdAt',
      title: 'Kayıt Tarihi',
      width: '40',
      render: (value) => new Date(value).toLocaleDateString('tr-TR')
    },
    {
      key: 'actions',
      title: 'İşlemler',
      width: '32',
      align: 'center',
      sortable: false,
      render: (_, row) => (
        <div className="flex gap-2">
          <Tooltip content="Düzenle">
            <Button variant="ghost" size="sm">
              ✏️
            </Button>
          </Tooltip>
          <Tooltip content="Detayları Görüntüle">
            <Button variant="ghost" size="sm">
              👁️
            </Button>
          </Tooltip>
        </div>
      )
    }
  ];

  // Load beneficiaries
  useEffect(() => {
    const loadBeneficiaries = async () => {
      try {
        setLoading(true);
        const data = await beneficiariesService.getAllBeneficiaries();
        setBeneficiaries(data || []);
      } catch (error) {
        console.error('Beneficiaries loading error:', error);
        setBeneficiaries([]);
      } finally {
        setLoading(false);
      }
    };

    loadBeneficiaries();
  }, []);

  // Filter data based on selected tab
  const filteredData = beneficiaries.filter(beneficiary => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'active') return beneficiary.status === 'active';
    if (selectedTab === 'pending') return beneficiary.status === 'pending';
    if (selectedTab === 'urgent') return beneficiary.isUrgent === true;
    return true;
  });

  if (loading) {
    return (
      <Page title="Faydalanıcılar" description="Yükleniyor...">
        <Loading type="table" />
      </Page>
    );
  }

  return (
    <Page 
      title="Faydalanıcılar"
      description={`Toplam ${beneficiaries.length} faydalanıcı kayıtlı`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline">
            📤 Dışa Aktar
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            ➕ Yeni Faydalanıcı
          </Button>
        </div>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-brand-600">
              {beneficiaries.length}
            </div>
            <div className="text-sm text-gray-600">Toplam Faydalanıcı</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {beneficiaries.filter(b => b.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Aktif</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {beneficiaries.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Beklemede</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {beneficiaries.filter(b => b.isUrgent).length}
            </div>
            <div className="text-sm text-gray-600">Acil Durum</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for filtering */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            Tüm Kayıtlar ({beneficiaries.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Aktif ({beneficiaries.filter(b => b.status === 'active').length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Beklemede ({beneficiaries.filter(b => b.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="urgent">
            Acil ({beneficiaries.filter(b => b.isUrgent).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab}>
          <Card>
            <CardHeader>
              <CardTitle>Faydalanıcı Listesi</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                columns={columns}
                data={filteredData}
                searchable={true}
                sortable={true}
                pageSize={25}
                searchPlaceholder="İsim, TC kimlik veya telefon ile ara..."
                emptyText="Bu filtrede faydalanıcı bulunamadı"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Beneficiary Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Yeni Faydalanıcı Ekle"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField>
              <Input
                label="Ad"
                placeholder="Faydalanıcı adı"
                required
              />
            </FormField>
            <FormField>
              <Input
                label="Soyad" 
                placeholder="Faydalanıcı soyadı"
                required
              />
            </FormField>
          </div>
          
          <FormField>
            <Input
              label="TC Kimlik Numarası"
              placeholder="11 haneli TC kimlik numarası"
              maxLength={11}
              required
            />
          </FormField>

          <FormField>
            <Input
              label="Telefon"
              placeholder="+90 XXX XXX XX XX"
              type="tel"
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline"
              onClick={() => setShowAddModal(false)}
            >
              İptal
            </Button>
            <Button>
              Kaydet
            </Button>
          </div>
        </div>
      </Modal>
    </Page>
  );
};

export default BeneficiariesNew;
