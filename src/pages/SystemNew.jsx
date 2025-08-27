import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Shield,
  Database,
  HardDrive,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Eye,
  Edit,
  Save,
  Server,
  Network,
  Lock,
  Key,
  Users,
  Bell,
  Globe,
  Monitor,
  BarChart3,
  Cpu,
  HardDriveIcon,
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
  Modal,
  Switch
} from '../ui';

const SystemNew = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Mock data
  const systemStats = [
    {
      title: 'CPU Kullanımı',
      value: '45%',
      status: 'normal',
      icon: Cpu,
      color: 'success'
    },
    {
      title: 'RAM Kullanımı',
      value: '78%',
      status: 'warning',
      icon: BarChart3,
      color: 'warning'
    },
    {
      title: 'Disk Kullanımı',
      value: '62%',
      status: 'normal',
      icon: HardDriveIcon,
      color: 'success'
    },
    {
      title: 'Ağ Trafiği',
      value: '1.2 GB/s',
      status: 'normal',
      icon: Network,
      color: 'success'
    }
  ];

  const systemLogs = [
    {
      id: 1,
      timestamp: '2024-01-15T10:30:00',
      level: 'info',
      message: 'Sistem başarıyla başlatıldı',
      source: 'System',
      user: 'admin'
    },
    {
      id: 2,
      timestamp: '2024-01-15T10:25:00',
      level: 'warning',
      message: 'RAM kullanımı %80\'in üzerine çıktı',
      source: 'Monitor',
      user: 'system'
    },
    {
      id: 3,
      timestamp: '2024-01-15T10:20:00',
      level: 'error',
      message: 'Veritabanı bağlantısı başarısız',
      source: 'Database',
      user: 'system'
    },
    {
      id: 4,
      timestamp: '2024-01-15T10:15:00',
      level: 'info',
      message: 'Yedekleme tamamlandı',
      source: 'Backup',
      user: 'admin'
    },
    {
      id: 5,
      timestamp: '2024-01-15T10:10:00',
      level: 'info',
      message: 'Kullanıcı girişi: admin',
      source: 'Auth',
      user: 'admin'
    }
  ];

  const backupHistory = [
    {
      id: 1,
      name: 'Tam Yedek - 2024-01-15',
      type: 'full',
      size: '2.5 GB',
      status: 'completed',
      createdAt: '2024-01-15T02:00:00',
      duration: '15 dakika'
    },
    {
      id: 2,
      name: 'Artırımlı Yedek - 2024-01-14',
      type: 'incremental',
      size: '150 MB',
      status: 'completed',
      createdAt: '2024-01-14T02:00:00',
      duration: '3 dakika'
    },
    {
      id: 3,
      name: 'Tam Yedek - 2024-01-13',
      type: 'full',
      size: '2.4 GB',
      status: 'failed',
      createdAt: '2024-01-13T02:00:00',
      duration: '0 dakika'
    }
  ];

  const securityEvents = [
    {
      id: 1,
      timestamp: '2024-01-15T10:30:00',
      type: 'login_success',
      description: 'Başarılı giriş: admin@kafportal.com',
      ip: '192.168.1.100',
      user: 'admin'
    },
    {
      id: 2,
      timestamp: '2024-01-15T10:25:00',
      type: 'login_failed',
      description: 'Başarısız giriş denemesi',
      ip: '192.168.1.101',
      user: 'unknown'
    },
    {
      id: 3,
      timestamp: '2024-01-15T10:20:00',
      type: 'permission_denied',
      description: 'Yetkisiz erişim denemesi',
      ip: '192.168.1.102',
      user: 'user123'
    }
  ];

  const logColumns = [
    {
      key: 'timestamp',
      label: 'Zaman',
      render: (item) => new Date(item.timestamp).toLocaleString('tr-TR')
    },
    {
      key: 'level',
      label: 'Seviye',
      render: (item) => (
        <Badge 
          variant={
            item.level === 'error' ? 'danger' : 
            item.level === 'warning' ? 'warning' : 'success'
          }
        >
          {item.level.toUpperCase()}
        </Badge>
      )
    },
    {
      key: 'message',
      label: 'Mesaj',
      render: (item) => <span className="font-medium">{item.message}</span>
    },
    {
      key: 'source',
      label: 'Kaynak',
      render: (item) => <Badge variant="outline">{item.source}</Badge>
    },
    {
      key: 'user',
      label: 'Kullanıcı',
      render: (item) => <span className="text-sm text-muted-600">{item.user}</span>
    }
  ];

  const backupColumns = [
    {
      key: 'name',
      label: 'Yedek Adı',
      render: (item) => <span className="font-medium">{item.name}</span>
    },
    {
      key: 'type',
      label: 'Tür',
      render: (item) => (
        <Badge variant={item.type === 'full' ? 'primary' : 'outline'}>
          {item.type === 'full' ? 'Tam Yedek' : 'Artırımlı'}
        </Badge>
      )
    },
    {
      key: 'size',
      label: 'Boyut',
      render: (item) => <span className="font-semibold">{item.size}</span>
    },
    {
      key: 'status',
      label: 'Durum',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'createdAt',
      label: 'Oluşturulma',
      render: (item) => new Date(item.createdAt).toLocaleDateString('tr-TR')
    },
    {
      key: 'duration',
      label: 'Süre',
      render: (item) => <span className="text-sm text-muted-600">{item.duration}</span>
    },
    {
      key: 'actions',
      label: 'İşlemler',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />} />
          <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} />
        </div>
      )
    }
  ];

  const securityColumns = [
    {
      key: 'timestamp',
      label: 'Zaman',
      render: (item) => new Date(item.timestamp).toLocaleString('tr-TR')
    },
    {
      key: 'type',
      label: 'Olay Türü',
      render: (item) => {
        const typeConfig = {
          login_success: { label: 'Başarılı Giriş', color: 'success' },
          login_failed: { label: 'Başarısız Giriş', color: 'warning' },
          permission_denied: { label: 'Yetki Reddedildi', color: 'danger' }
        };
        const config = typeConfig[item.type];
        return <Badge variant={config.color}>{config.label}</Badge>;
      }
    },
    {
      key: 'description',
      label: 'Açıklama',
      render: (item) => <span className="font-medium">{item.description}</span>
    },
    {
      key: 'ip',
      label: 'IP Adresi',
      render: (item) => <span className="text-sm text-muted-600">{item.ip}</span>
    },
    {
      key: 'user',
      label: 'Kullanıcı',
      render: (item) => <span className="text-sm text-muted-600">{item.user}</span>
    }
  ];

  return (
    <Page
      title="Sistem Yönetimi"
      description="Sistem ayarları, performans ve güvenlik yönetimi"
      actions={
        <>
          <Button variant="outline" icon={<RefreshCw className="w-4 h-4" />}>
            Yenile
          </Button>
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Log İndir
          </Button>
          <Button 
            variant="primary" 
            icon={<Save className="w-4 h-4" />}
            onClick={() => setShowSettingsModal(true)}
          >
            Ayarları Kaydet
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
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-600">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <div className={`w-2 h-2 rounded-full bg-${stat.color}-500`} />
                      <span className="text-sm text-muted-500">
                        {stat.status === 'normal' ? 'Normal' : 'Dikkat'}
                      </span>
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

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="logs">Sistem Logları</TabsTrigger>
            <TabsTrigger value="backup">Yedekleme</TabsTrigger>
            <TabsTrigger value="security">Güvenlik</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sistem Durumu</CardTitle>
                  <CardDescription>Genel sistem sağlığı ve performans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Veritabanı Bağlantısı</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success-500" />
                        <span className="text-sm text-success-600">Aktif</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Web Sunucusu</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success-500" />
                        <span className="text-sm text-success-600">Çalışıyor</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SSL Sertifikası</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success-500" />
                        <span className="text-sm text-success-600">Geçerli</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Son Yedekleme</span>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-warning-500" />
                        <span className="text-sm text-warning-600">2 saat önce</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hızlı İşlemler</CardTitle>
                  <CardDescription>Sistem yönetimi için hızlı erişim</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      icon={<Database className="w-4 h-4" />}
                      onClick={() => setShowBackupModal(true)}
                    >
                      Manuel Yedekleme
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      icon={<Activity className="w-4 h-4" />}
                    >
                      Performans Raporu
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      icon={<Shield className="w-4 h-4" />}
                    >
                      Güvenlik Taraması
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      icon={<Settings className="w-4 h-4" />}
                      onClick={() => setShowSettingsModal(true)}
                    >
                      Sistem Ayarları
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sistem Logları</CardTitle>
                <CardDescription>Son sistem olayları ve logları</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={systemLogs}
                  columns={logColumns}
                  searchable
                  pagination
                  itemsPerPage={10}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Yedekleme Geçmişi</CardTitle>
                <CardDescription>Sistem yedekleme kayıtları</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={backupHistory}
                  columns={backupColumns}
                  searchable
                  pagination
                  itemsPerPage={10}
                />
              </CardContent>
            </Card>

            <Alert variant="info">
              <AlertTitle>Otomatik Yedekleme</AlertTitle>
              <AlertDescription>
                Sistem her gece saat 02:00'de otomatik olarak yedeklenir. 
                Son yedekleme 2 saat önce tamamlandı.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Güvenlik Olayları</CardTitle>
                <CardDescription>Son güvenlik olayları ve erişim kayıtları</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={securityEvents}
                  columns={securityColumns}
                  searchable
                  pagination
                  itemsPerPage={10}
                />
              </CardContent>
            </Card>

            <Alert variant="warning">
              <AlertTitle>Güvenlik Uyarısı</AlertTitle>
              <AlertDescription>
                Son 24 saatte 3 başarısız giriş denemesi tespit edildi. 
                IP adresi 192.168.1.101'den gelen istekler izleniyor.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        {/* Backup Modal */}
        <Modal
          isOpen={showBackupModal}
          onClose={() => setShowBackupModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Manuel Yedekleme</Modal.Title>
            <Modal.Description>
              Sistem verilerinin manuel yedeklemesini başlatın
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <FormField>
                <Label htmlFor="backupType">Yedekleme Türü</Label>
                <Select
                  id="backupType"
                  options={[
                    { value: 'full', label: 'Tam Yedekleme' },
                    { value: 'incremental', label: 'Artırımlı Yedekleme' },
                    { value: 'database', label: 'Sadece Veritabanı' }
                  ]}
                />
              </FormField>
              
              <FormField>
                <Label htmlFor="backupName">Yedekleme Adı</Label>
                <Input id="backupName" placeholder="Manuel yedekleme - 2024-01-15" />
              </FormField>
              
              <FormField>
                <Label htmlFor="compression">Sıkıştırma</Label>
                <Select
                  id="compression"
                  options={[
                    { value: 'none', label: 'Sıkıştırma Yok' },
                    { value: 'gzip', label: 'GZIP Sıkıştırma' },
                    { value: 'zip', label: 'ZIP Sıkıştırma' }
                  ]}
                />
              </FormField>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowBackupModal(false)}>
              İptal
            </Button>
            <Button variant="primary">
              Yedeklemeyi Başlat
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Settings Modal */}
        <Modal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          size="xl"
        >
          <Modal.Header>
            <Modal.Title>Sistem Ayarları</Modal.Title>
            <Modal.Description>
              Sistem performansı ve güvenlik ayarlarını yapılandırın
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Performans Ayarları</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Otomatik Önbellek Temizleme</Label>
                      <p className="text-sm text-muted-600">Her 24 saatte bir önbelleği temizle</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Maksimum Eşzamanlı Bağlantı</Label>
                    <Input type="number" defaultValue={100} className="w-24" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Oturum Zaman Aşımı (dakika)</Label>
                    <Input type="number" defaultValue={30} className="w-24" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Güvenlik Ayarları</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>İki Faktörlü Kimlik Doğrulama</Label>
                      <p className="text-sm text-muted-600">Tüm kullanıcılar için zorunlu</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>IP Kısıtlaması</Label>
                      <p className="text-sm text-muted-600">Belirli IP aralıklarından erişim</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Maksimum Başarısız Giriş</Label>
                    <Input type="number" defaultValue={5} className="w-24" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Yedekleme Ayarları</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Otomatik Yedekleme</Label>
                      <p className="text-sm text-muted-600">Her gece otomatik yedekleme</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Yedekleme Saklama Süresi (gün)</Label>
                    <Input type="number" defaultValue={30} className="w-24" />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowSettingsModal(false)}>
              İptal
            </Button>
            <Button variant="primary">
              Ayarları Kaydet
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Page>
  );
};

export default SystemNew;
