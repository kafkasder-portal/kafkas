import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
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

const UserManagementNew = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock data
  const users = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet@kafportal.com',
      phone: '+90 532 123 4567',
      role: 'admin',
      status: 'active',
      location: 'İstanbul',
      lastLogin: '2024-01-15T10:30:00',
      joinDate: '2023-03-15',
      avatar: null
    },
    {
      id: 2,
      name: 'Fatma Demir',
      email: 'fatma@kafportal.com',
      phone: '+90 533 987 6543',
      role: 'moderator',
      status: 'active',
      location: 'Ankara',
      lastLogin: '2024-01-14T15:45:00',
      joinDate: '2023-06-20',
      avatar: null
    },
    {
      id: 3,
      name: 'Mehmet Kaya',
      email: 'mehmet@kafportal.com',
      phone: '+90 534 456 7890',
      role: 'user',
      status: 'inactive',
      location: 'İzmir',
      lastLogin: '2024-01-10T09:15:00',
      joinDate: '2023-09-10',
      avatar: null
    },
    {
      id: 4,
      name: 'Ayşe Özkan',
      email: 'ayse@kafportal.com',
      phone: '+90 535 321 0987',
      role: 'volunteer',
      status: 'active',
      location: 'Bursa',
      lastLogin: '2024-01-15T14:20:00',
      joinDate: '2023-12-01',
      avatar: null
    },
    {
      id: 5,
      name: 'Ali Çelik',
      email: 'ali@kafportal.com',
      phone: '+90 536 654 3210',
      role: 'user',
      status: 'pending',
      location: 'Antalya',
      lastLogin: null,
      joinDate: '2024-01-12',
      avatar: null
    }
  ];

  const roleNames = {
    admin: 'Yönetici',
    moderator: 'Moderatör',
    user: 'Kullanıcı',
    volunteer: 'Gönüllü'
  };

  const statusConfig = {
    active: { label: 'Aktif', color: 'success' },
    inactive: { label: 'Pasif', color: 'danger' },
    pending: { label: 'Beklemede', color: 'warning' }
  };

  const userColumns = [
    {
      key: 'name',
      label: 'Kullanıcı',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-muted-500">{item.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Rol',
      render: (item) => (
        <Badge variant={item.role === 'admin' ? 'primary' : 'outline'}>
          {roleNames[item.role]}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Durum',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'location',
      label: 'Konum',
      render: (item) => (
        <div className="flex items-center gap-1 text-sm text-muted-600">
          <MapPin className="w-4 h-4" />
          {item.location}
        </div>
      )
    },
    {
      key: 'lastLogin',
      label: 'Son Giriş',
      render: (item) => (
        <div className="text-sm">
          {item.lastLogin ? new Date(item.lastLogin).toLocaleDateString('tr-TR') : 'Hiç giriş yapılmamış'}
        </div>
      )
    },
    {
      key: 'joinDate',
      label: 'Katılım Tarihi',
      render: (item) => new Date(item.joinDate).toLocaleDateString('tr-TR')
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
            onClick={() => setSelectedUser(item)}
          />
          <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} />
          <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} />
        </div>
      )
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesTab = activeTab === 'all' || user.status === activeTab;
    
    return matchesSearch && matchesRole && matchesStatus && matchesTab;
  });

  const stats = [
    {
      title: 'Toplam Kullanıcı',
      value: users.length,
      icon: Users,
      color: 'brand'
    },
    {
      title: 'Aktif Kullanıcı',
      value: users.filter(u => u.status === 'active').length,
      icon: CheckCircle,
      color: 'success'
    },
    {
      title: 'Bekleyen Kullanıcı',
      value: users.filter(u => u.status === 'pending').length,
      icon: Clock,
      color: 'warning'
    },
    {
      title: 'Pasif Kullanıcı',
      value: users.filter(u => u.status === 'inactive').length,
      icon: XCircle,
      color: 'danger'
    }
  ];

  return (
    <Page
      title="Kullanıcı Yönetimi"
      description="Sistem kullanıcılarını yönetin ve izleyin"
      actions={
        <>
          <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
            Filtrele
          </Button>
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Dışa Aktar
          </Button>
          <Button 
            variant="primary" 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddUserModal(true)}
          >
            Yeni Kullanıcı
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtreler</CardTitle>
            <CardDescription>Kullanıcıları filtrelemek için kriterleri seçin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField>
                <Label htmlFor="search">Arama</Label>
                <Input
                  id="search"
                  placeholder="İsim veya e-posta ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </FormField>
              
              <FormField>
                <Label htmlFor="role">Rol</Label>
                <Select
                  id="role"
                  value={roleFilter}
                  onChange={setRoleFilter}
                  options={[
                    { value: 'all', label: 'Tüm Roller' },
                    { value: 'admin', label: 'Yönetici' },
                    { value: 'moderator', label: 'Moderatör' },
                    { value: 'user', label: 'Kullanıcı' },
                    { value: 'volunteer', label: 'Gönüllü' }
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
                    { value: 'active', label: 'Aktif' },
                    { value: 'inactive', label: 'Pasif' },
                    { value: 'pending', label: 'Beklemede' }
                  ]}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Kullanıcı Listesi</CardTitle>
            <CardDescription>Toplam {filteredUsers.length} kullanıcı bulundu</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Tümü ({users.length})</TabsTrigger>
                <TabsTrigger value="active">Aktif ({users.filter(u => u.status === 'active').length})</TabsTrigger>
                <TabsTrigger value="inactive">Pasif ({users.filter(u => u.status === 'inactive').length})</TabsTrigger>
                <TabsTrigger value="pending">Beklemede ({users.filter(u => u.status === 'pending').length})</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="mt-6">
              <DataTable
                data={filteredUsers}
                columns={userColumns}
                searchable={false}
                pagination
                itemsPerPage={10}
              />
            </div>
          </CardContent>
        </Card>

        {/* Add User Modal */}
        <Modal
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Yeni Kullanıcı Ekle</Modal.Title>
            <Modal.Description>
              Sisteme yeni bir kullanıcı eklemek için gerekli bilgileri doldurun
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <FormField>
                <Label htmlFor="name" required>Ad Soyad</Label>
                <Input id="name" placeholder="Kullanıcının adı ve soyadı" />
              </FormField>
              
              <FormField>
                <Label htmlFor="email" required>E-posta</Label>
                <Input id="email" type="email" placeholder="kullanici@ornek.com" />
              </FormField>
              
              <FormField>
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" placeholder="+90 532 123 4567" />
              </FormField>
              
              <FormField>
                <Label htmlFor="role" required>Rol</Label>
                <Select
                  id="role"
                  options={[
                    { value: 'user', label: 'Kullanıcı' },
                    { value: 'volunteer', label: 'Gönüllü' },
                    { value: 'moderator', label: 'Moderatör' },
                    { value: 'admin', label: 'Yönetici' }
                  ]}
                />
              </FormField>
              
              <FormField>
                <Label htmlFor="location">Konum</Label>
                <Input id="location" placeholder="Şehir" />
              </FormField>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowAddUserModal(false)}>
              İptal
            </Button>
            <Button variant="primary">
              Kullanıcı Ekle
            </Button>
          </Modal.Footer>
        </Modal>

        {/* User Detail Modal */}
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          size="lg"
        >
          {selectedUser && (
            <>
              <Modal.Header>
                <Modal.Title>Kullanıcı Detayları</Modal.Title>
                <Modal.Description>
                  {selectedUser.name} kullanıcısının detaylı bilgileri
                </Modal.Description>
              </Modal.Header>
              <Modal.Body>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                      <p className="text-muted-600">{selectedUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Telefon</Label>
                      <p className="text-sm">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <Label>Konum</Label>
                      <p className="text-sm">{selectedUser.location}</p>
                    </div>
                    <div>
                      <Label>Rol</Label>
                      <Badge variant="outline">{roleNames[selectedUser.role]}</Badge>
                    </div>
                    <div>
                      <Label>Durum</Label>
                      <StatusBadge status={selectedUser.status} />
                    </div>
                    <div>
                      <Label>Son Giriş</Label>
                      <p className="text-sm">
                        {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString('tr-TR') : 'Hiç giriş yapılmamış'}
                      </p>
                    </div>
                    <div>
                      <Label>Katılım Tarihi</Label>
                      <p className="text-sm">{new Date(selectedUser.joinDate).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
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

export default UserManagementNew;
