import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  PackageOpen,
  PackageX,
  PackageCheck,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  ShoppingCart,
  Truck,
  Warehouse,
  Tag,
  DollarSign,
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
  FormField,
  Modal
} from '../ui';

const InventoryNew = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock data
  const inventoryItems = [
    {
      id: 1,
      name: 'Gıda Paketi A',
      category: 'Gıda',
      description: 'Temel gıda paketi (pirinç, makarna, yağ)',
      quantity: 150,
      unit: 'paket',
      minStock: 20,
      maxStock: 200,
      cost: 85.50,
      supplier: 'ABC Gıda Ltd.',
      location: 'Depo A - Raf 1',
      status: 'in-stock',
      lastUpdated: '2024-01-15T10:30:00',
      expiryDate: '2024-06-15'
    },
    {
      id: 2,
      name: 'İlaç Paketi B',
      category: 'Sağlık',
      description: 'Temel ilaç paketi (ağrı kesici, vitamin)',
      quantity: 45,
      unit: 'paket',
      minStock: 10,
      maxStock: 100,
      cost: 120.00,
      supplier: 'XYZ İlaç Ltd.',
      location: 'Depo B - Raf 3',
      status: 'low-stock',
      lastUpdated: '2024-01-14T15:45:00',
      expiryDate: '2024-08-20'
    },
    {
      id: 3,
      name: 'Kırtasiye Seti',
      category: 'Eğitim',
      description: 'Okul kırtasiye seti (kalem, defter, çanta)',
      quantity: 200,
      unit: 'set',
      minStock: 30,
      maxStock: 250,
      cost: 45.75,
      supplier: 'DEF Kırtasiye Ltd.',
      location: 'Depo A - Raf 2',
      status: 'in-stock',
      lastUpdated: '2024-01-13T09:15:00',
      expiryDate: '2025-12-31'
    },
    {
      id: 4,
      name: 'Battaniye',
      category: 'Barınma',
      description: 'Kalın battaniye (150x200cm)',
      quantity: 8,
      unit: 'adet',
      minStock: 15,
      maxStock: 80,
      cost: 75.00,
      supplier: 'GHI Tekstil Ltd.',
      location: 'Depo C - Raf 1',
      status: 'out-of-stock',
      lastUpdated: '2024-01-12T14:20:00',
      expiryDate: '2026-12-31'
    },
    {
      id: 5,
      name: 'Su Şişesi',
      category: 'Gıda',
      description: '19L damacana su',
      quantity: 25,
      unit: 'adet',
      minStock: 10,
      maxStock: 50,
      cost: 15.00,
      supplier: 'JKL Su Ltd.',
      location: 'Depo A - Raf 4',
      status: 'in-stock',
      lastUpdated: '2024-01-15T16:30:00',
      expiryDate: '2024-03-15'
    }
  ];

  const categories = ['Gıda', 'Sağlık', 'Eğitim', 'Barınma', 'Ulaşım', 'Diğer'];
  
  const statusConfig = {
    'in-stock': { label: 'Stokta', color: 'success', icon: PackageCheck },
    'low-stock': { label: 'Az Stok', color: 'warning', icon: AlertTriangle },
    'out-of-stock': { label: 'Stok Yok', color: 'danger', icon: PackageX }
  };

  const inventoryColumns = [
    {
      key: 'name',
      label: 'Ürün',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-muted-500">{item.description}</div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Kategori',
      render: (item) => <Badge variant="outline">{item.category}</Badge>
    },
    {
      key: 'quantity',
      label: 'Stok',
      render: (item) => (
        <div className="text-center">
          <div className="font-semibold">{item.quantity} {item.unit}</div>
          <div className="text-xs text-muted-500">
            Min: {item.minStock} | Max: {item.maxStock}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Durum',
      render: (item) => {
        const config = statusConfig[item.status];
        const Icon = config.icon;
        return (
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 text-${config.color}-500`} />
            <StatusBadge status={item.status} />
          </div>
        )
      }
    },
    {
      key: 'cost',
      label: 'Maliyet',
      render: (item) => (
        <div className="text-right">
          <div className="font-semibold">₺{item.cost.toFixed(2)}</div>
          <div className="text-xs text-muted-500">Toplam: ₺{(item.cost * item.quantity).toFixed(2)}</div>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Konum',
      render: (item) => (
        <div className="text-sm text-muted-600">
          {item.location}
        </div>
      )
    },
    {
      key: 'expiryDate',
      label: 'Son Kullanma',
      render: (item) => {
        const expiryDate = new Date(item.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        return (
          <div className="text-sm">
            <div>{expiryDate.toLocaleDateString('tr-TR')}</div>
            <div className={`text-xs ${daysUntilExpiry < 30 ? 'text-danger-600' : daysUntilExpiry < 90 ? 'text-warning-600' : 'text-success-600'}`}>
              {daysUntilExpiry > 0 ? `${daysUntilExpiry} gün kaldı` : 'Süresi dolmuş'}
            </div>
          </div>
        )
      }
    },
    {
      key: 'actions',
      label: 'İşlemler',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<Eye className="w-4 h-4" />}
            onClick={() => setSelectedItem(item)}
          />
          <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} />
          <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} />
        </div>
      )
    }
  ];

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  const stats = [
    {
      title: 'Toplam Ürün',
      value: inventoryItems.length,
      icon: Package,
      color: 'brand'
    },
    {
      title: 'Stokta',
      value: inventoryItems.filter(item => item.status === 'in-stock').length,
      icon: PackageCheck,
      color: 'success'
    },
    {
      title: 'Az Stok',
      value: inventoryItems.filter(item => item.status === 'low-stock').length,
      icon: AlertTriangle,
      color: 'warning'
    },
    {
      title: 'Stok Yok',
      value: inventoryItems.filter(item => item.status === 'out-of-stock').length,
      icon: PackageX,
      color: 'danger'
    }
  ];

  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);

  return (
    <Page
      title="Envanter Yönetimi"
      description="Stok takibi ve envanter yönetimi"
      actions={
        <>
          <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
            Filtrele
          </Button>
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Dışa Aktar
          </Button>
          <Button variant="outline" icon={<Upload className="w-4 h-4" />}>
            Toplu Yükle
          </Button>
          <Button 
            variant="primary" 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddItemModal(true)}
          >
            Yeni Ürün
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-600">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-600">Toplam Değer</p>
                  <p className="text-2xl font-bold mt-1">₺{totalValue.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-brand-100">
                  <DollarSign className="w-6 h-6 text-brand-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtreler</CardTitle>
            <CardDescription>Envanter öğelerini filtrelemek için kriterleri seçin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField>
                <Label htmlFor="search">Arama</Label>
                <Input
                  id="search"
                  placeholder="Ürün adı veya açıklama ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </FormField>
              
              <FormField>
                <Label htmlFor="category">Kategori</Label>
                <Select
                  id="category"
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  options={[
                    { value: 'all', label: 'Tüm Kategoriler' },
                    ...categories.map(cat => ({ value: cat, label: cat }))
                  ]}
                />
              </FormField>
              
              <FormField>
                <Label htmlFor="status">Durum</Label>
                <Select
                  id="status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { value: 'all', label: 'Tüm Durumlar' },
                    { value: 'in-stock', label: 'Stokta' },
                    { value: 'low-stock', label: 'Az Stok' },
                    { value: 'out-of-stock', label: 'Stok Yok' }
                  ]}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Envanter Listesi</CardTitle>
            <CardDescription>Toplam {filteredItems.length} ürün bulundu</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Tümü ({inventoryItems.length})</TabsTrigger>
                <TabsTrigger value="in-stock">Stokta ({inventoryItems.filter(item => item.status === 'in-stock').length})</TabsTrigger>
                <TabsTrigger value="low-stock">Az Stok ({inventoryItems.filter(item => item.status === 'low-stock').length})</TabsTrigger>
                <TabsTrigger value="out-of-stock">Stok Yok ({inventoryItems.filter(item => item.status === 'out-of-stock').length})</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="mt-6">
              <DataTable
                data={filteredItems}
                columns={inventoryColumns}
                searchable={false}
                pagination
                itemsPerPage={10}
              />
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <div className="space-y-4">
          {inventoryItems.filter(item => item.status === 'out-of-stock').length > 0 && (
            <Alert variant="danger">
              <AlertTitle>Stok Uyarısı</AlertTitle>
              <AlertDescription>
                {inventoryItems.filter(item => item.status === 'out-of-stock').length} ürün stokta bulunmuyor. 
                Acil sipariş verilmesi gerekiyor.
              </AlertDescription>
            </Alert>
          )}
          
          {inventoryItems.filter(item => {
            const expiryDate = new Date(item.expiryDate);
            const today = new Date();
            const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
            return daysUntilExpiry < 30 && daysUntilExpiry > 0;
          }).length > 0 && (
            <Alert variant="warning">
              <AlertTitle>Son Kullanma Tarihi Uyarısı</AlertTitle>
              <AlertDescription>
                {inventoryItems.filter(item => {
                  const expiryDate = new Date(item.expiryDate);
                  const today = new Date();
                  const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                  return daysUntilExpiry < 30 && daysUntilExpiry > 0;
                }).length} ürünün son kullanma tarihi 30 gün içinde dolacak.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Add Item Modal */}
        <Modal
          isOpen={showAddItemModal}
          onClose={() => setShowAddItemModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Yeni Ürün Ekle</Modal.Title>
            <Modal.Description>
              Envantere yeni bir ürün eklemek için gerekli bilgileri doldurun
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <FormField>
                <Label htmlFor="name" required>Ürün Adı</Label>
                <Input id="name" placeholder="Ürün adını girin" />
              </FormField>
              
              <FormField>
                <Label htmlFor="description">Açıklama</Label>
                <Input id="description" placeholder="Ürün açıklaması" />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <Label htmlFor="category" required>Kategori</Label>
                  <Select
                    id="category"
                    options={categories.map(cat => ({ value: cat, label: cat }))}
                  />
                </FormField>
                
                <FormField>
                  <Label htmlFor="unit" required>Birim</Label>
                  <Input id="unit" placeholder="adet, paket, kg, vb." />
                </FormField>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField>
                  <Label htmlFor="quantity" required>Miktar</Label>
                  <Input id="quantity" type="number" placeholder="0" />
                </FormField>
                
                <FormField>
                  <Label htmlFor="minStock" required>Min Stok</Label>
                  <Input id="minStock" type="number" placeholder="0" />
                </FormField>
                
                <FormField>
                  <Label htmlFor="maxStock" required>Max Stok</Label>
                  <Input id="maxStock" type="number" placeholder="0" />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <Label htmlFor="cost" required>Birim Maliyet</Label>
                  <Input id="cost" type="number" step="0.01" placeholder="0.00" />
                </FormField>
                
                <FormField>
                  <Label htmlFor="supplier">Tedarikçi</Label>
                  <Input id="supplier" placeholder="Tedarikçi adı" />
                </FormField>
              </div>
              
              <FormField>
                <Label htmlFor="location">Depo Konumu</Label>
                <Input id="location" placeholder="Depo - Raf bilgisi" />
              </FormField>
              
              <FormField>
                <Label htmlFor="expiryDate">Son Kullanma Tarihi</Label>
                <Input id="expiryDate" type="date" />
              </FormField>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowAddItemModal(false)}>
              İptal
            </Button>
            <Button variant="primary">
              Ürün Ekle
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Item Detail Modal */}
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          size="lg"
        >
          {selectedItem && (
            <>
              <Modal.Header>
                <Modal.Title>Ürün Detayları</Modal.Title>
                <Modal.Description>
                  {selectedItem.name} ürününün detaylı bilgileri
                </Modal.Description>
              </Modal.Header>
              <Modal.Body>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-brand-100 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedItem.name}</h3>
                      <p className="text-muted-600">{selectedItem.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Kategori</Label>
                      <Badge variant="outline">{selectedItem.category}</Badge>
                    </div>
                    <div>
                      <Label>Durum</Label>
                      <StatusBadge status={selectedItem.status} />
                    </div>
                    <div>
                      <Label>Miktar</Label>
                      <p className="text-sm">{selectedItem.quantity} {selectedItem.unit}</p>
                    </div>
                    <div>
                      <Label>Birim Maliyet</Label>
                      <p className="text-sm">₺{selectedItem.cost.toFixed(2)}</p>
                    </div>
                    <div>
                      <Label>Tedarikçi</Label>
                      <p className="text-sm">{selectedItem.supplier}</p>
                    </div>
                    <div>
                      <Label>Konum</Label>
                      <p className="text-sm">{selectedItem.location}</p>
                    </div>
                    <div>
                      <Label>Son Kullanma</Label>
                      <p className="text-sm">{new Date(selectedItem.expiryDate).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div>
                      <Label>Son Güncelleme</Label>
                      <p className="text-sm">{new Date(selectedItem.lastUpdated).toLocaleString('tr-TR')}</p>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline" onClick={() => setSelectedItem(null)}>
                  Kapat
                </Button>
                <Button variant="primary">
                  Düzenle
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal>
      </motion.div>
    </Page>
  );
};

export default InventoryNew;
