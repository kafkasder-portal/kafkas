import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  QrCode,
  Smartphone,
  RefreshCw,
  Check,
  X,
  Eye,
  EyeOff,
  Lock,
  User,
  Phone,
  Mail,
  Shield,
  ShieldCheck,
  Wifi,
  WifiOff,
  AlertTriangle,
  Info,
  Settings,
  Key,
  Download,
  Upload,
  Copy,
  ExternalLink,
  Clock,
  Calendar,
  Globe,
  Zap,
  ZapOff,
  Battery,
  BatteryCharging,
  Volume2,
  VolumeX,
  Camera,
  Mic,
  Headphones,
  Monitor,
  Tablet,
  Smartphone as Mobile,
  Laptop,
  Server,
  Database,
  Cloud,
  CloudOff,
  Link,
  Link2,
  Unlink,
  RotateCcw,
  Power,
  PowerOff,
  Play,
  Pause,
  Stop,
  SkipBack,
  SkipForward,
  Volume1,
  Volume3,
  Mute,
  Maximize,
  Minimize,
  Fullscreen,
  FullscreenExit,
  MonitorOff,
  MonitorSpeaker,
  MonitorSmartphone,
  MonitorCheck,
  MonitorX,
  MonitorPause,
  MonitorPlay,
  MonitorStop,
  MonitorUp,
  MonitorDown,
  MonitorLeft,
  MonitorRight,
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

const WhatsAppLoginNew = () => {
  const [activeTab, setActiveTab] = useState('qr');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [qrCodeData, setQrCodeData] = useState('https://api.whatsapp.com/qr/abc123');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [autoConnect, setAutoConnect] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [apiKey, setApiKey] = useState('sk-1234567890abcdef');

  // Mock data
  const connectionHistory = [
    {
      id: 1,
      date: '2024-01-15T14:30:00',
      status: 'connected',
      method: 'QR Code',
      device: 'iPhone 15',
      location: 'İstanbul, TR',
      duration: '2h 15m'
    },
    {
      id: 2,
      date: '2024-01-15T12:15:00',
      status: 'disconnected',
      method: 'Phone Number',
      device: 'Samsung Galaxy',
      location: 'Ankara, TR',
      duration: '1h 45m'
    },
    {
      id: 3,
      date: '2024-01-15T10:00:00',
      status: 'connected',
      method: 'QR Code',
      device: 'iPhone 15',
      location: 'İstanbul, TR',
      duration: '3h 30m'
    }
  ];

  const deviceList = [
    {
      id: 1,
      name: 'iPhone 15',
      type: 'mobile',
      status: 'active',
      lastSeen: '2024-01-15T14:30:00',
      location: 'İstanbul, TR',
      battery: 85,
      connection: 'WiFi'
    },
    {
      id: 2,
      name: 'Samsung Galaxy',
      type: 'mobile',
      status: 'inactive',
      lastSeen: '2024-01-15T12:15:00',
      location: 'Ankara, TR',
      battery: 0,
      connection: 'Mobile Data'
    },
    {
      id: 3,
      name: 'MacBook Pro',
      type: 'desktop',
      status: 'active',
      lastSeen: '2024-01-15T14:30:00',
      location: 'İstanbul, TR',
      battery: 100,
      connection: 'WiFi'
    }
  ];

  const connectionConfig = {
    connected: { label: 'Bağlı', color: 'success', icon: Wifi },
    connecting: { label: 'Bağlanıyor...', color: 'warning', icon: RefreshCw },
    disconnected: { label: 'Bağlantı Yok', color: 'danger', icon: WifiOff },
    error: { label: 'Hata', color: 'danger', icon: AlertTriangle }
  };

  const stats = [
    {
      title: 'Bağlantı Durumu',
      value: connectionConfig[connectionStatus].label,
      icon: connectionConfig[connectionStatus].icon,
      color: connectionConfig[connectionStatus].color
    },
    {
      title: 'Aktif Cihaz',
      value: deviceList.filter(d => d.status === 'active').length,
      icon: Smartphone,
      color: 'success'
    },
    {
      title: 'Toplam Cihaz',
      value: deviceList.length,
      icon: Monitor,
      color: 'brand'
    },
    {
      title: 'Son Bağlantı',
      value: '2h 15m',
      icon: Clock,
      color: 'info'
    }
  ];

  const handleQRScan = () => {
    setConnectionStatus('connecting');
    setTimeout(() => {
      setConnectionStatus('connected');
      setShowQRModal(false);
    }, 3000);
  };

  const handlePhoneVerification = () => {
    setConnectionStatus('connecting');
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 2000);
  };

  const handleDisconnect = () => {
    setConnectionStatus('disconnected');
  };

  const connectionHistoryColumns = [
    {
      key: 'date',
      label: 'Tarih',
      render: (item) => (
        <div>
          <div className="font-medium">
            {new Date(item.date).toLocaleDateString('tr-TR')}
          </div>
          <div className="text-sm text-muted-500">
            {new Date(item.date).toLocaleTimeString('tr-TR')}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Durum',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'method',
      label: 'Yöntem',
      render: (item) => (
        <Badge variant={item.method === 'QR Code' ? 'primary' : 'outline'}>
          {item.method}
        </Badge>
      )
    },
    {
      key: 'device',
      label: 'Cihaz',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          <span>{item.device}</span>
        </div>
      )
    },
    {
      key: 'duration',
      label: 'Süre',
      render: (item) => <span className="text-sm">{item.duration}</span>
    }
  ];

  const deviceColumns = [
    {
      key: 'name',
      label: 'Cihaz',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
            {item.type === 'mobile' ? (
              <Smartphone className="w-4 h-4 text-brand-600" />
            ) : (
              <Monitor className="w-4 h-4 text-brand-600" />
            )}
          </div>
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-muted-500">{item.type}</div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Durum',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'battery',
      label: 'Pil',
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.battery > 20 ? (
            <Battery className="w-4 h-4 text-green-600" />
          ) : (
            <Battery className="w-4 h-4 text-red-600" />
          )}
          <span className="text-sm">{item.battery}%</span>
        </div>
      )
    },
    {
      key: 'connection',
      label: 'Bağlantı',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4" />
          <span className="text-sm">{item.connection}</span>
        </div>
      )
    },
    {
      key: 'lastSeen',
      label: 'Son Görülme',
      render: (item) => (
        <div className="text-sm text-muted-500">
          {new Date(item.lastSeen).toLocaleString('tr-TR')}
        </div>
      )
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
          />
          {item.status === 'active' && (
            <Button 
              variant="ghost" 
              size="sm" 
              icon={<PowerOff className="w-4 h-4" />}
              onClick={handleDisconnect}
            />
          )}
        </div>
      )
    }
  ];

  return (
    <Page
      title="WhatsApp Giriş"
      description="WhatsApp Business API bağlantı ve kimlik doğrulama"
      actions={
        <>
          <Button variant="outline" icon={<Settings className="w-4 h-4" />}>
            Ayarlar
          </Button>
          <Button 
            variant="primary" 
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={() => setConnectionStatus('connecting')}
          >
            Yenile
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
        {/* Connection Status Alert */}
        <Alert variant={connectionStatus === 'connected' ? 'success' : 'warning'}>
          <AlertTitle>
            <div className="flex items-center gap-2">
              {(() => {
                const IconComponent = connectionConfig[connectionStatus].icon;
                return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
              })()}
              WhatsApp Bağlantı Durumu
            </div>
          </AlertTitle>
          <AlertDescription>
            {connectionConfig[connectionStatus].label} - 
            {connectionStatus === 'connected' 
              ? ' WhatsApp Business API başarıyla bağlandı'
              : connectionStatus === 'connecting'
              ? ' Bağlantı kuruluyor, lütfen bekleyin'
              : ' Bağlantı kurulmadı, giriş yapın'
            }
          </AlertDescription>
        </Alert>

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
                    {(() => {
                      const IconComponent = stat.icon;
                      return <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />;
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Connection Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Bağlantı Yöntemleri</CardTitle>
            <CardDescription>WhatsApp Business API\'ye bağlanmak için bir yöntem seçin</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="qr">QR Kod</TabsTrigger>
                <TabsTrigger value="phone">Telefon</TabsTrigger>
                <TabsTrigger value="api">API Key</TabsTrigger>
              </TabsList>

              <TabsContent value="qr" className="space-y-4">
                <div className="text-center py-8">
                  <div className="w-64 h-64 mx-auto bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="w-32 h-32 text-gray-400" />
                  </div>
                  <p className="text-sm text-muted-500 mb-4">
                    WhatsApp uygulamanızda QR kodu tarayın
                  </p>
                  <div className="space-y-2">
                    <Button 
                      variant="primary" 
                      icon={<QrCode className="w-4 h-4" />}
                      onClick={() => setShowQRModal(true)}
                    >
                      QR Kodu Göster
                    </Button>
                    <Button 
                      variant="outline" 
                      icon={<RefreshCw className="w-4 h-4" />}
                    >
                      Yenile
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4">
                <div className="max-w-md mx-auto space-y-4">
                  <FormField>
                    <Label htmlFor="phone">Telefon Numarası</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+90 532 123 4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      icon={<Phone className="w-4 h-4" />}
                    />
                  </FormField>
                  
                  <FormField>
                    <Label htmlFor="verification">Doğrulama Kodu</Label>
                    <Input
                      id="verification"
                      type="text"
                      placeholder="6 haneli kod"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      icon={<Key className="w-4 h-4" />}
                    />
                  </FormField>
                  
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={handlePhoneVerification}
                    disabled={!phoneNumber || !verificationCode}
                  >
                    Bağlan
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="api" className="space-y-4">
                <div className="max-w-md mx-auto space-y-4">
                  <FormField>
                    <Label htmlFor="apiKey">API Anahtarı</Label>
                    <div className="relative">
                      <Input
                        id="apiKey"
                        type={showPassword ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        icon={<Key className="w-4 h-4" />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        icon={showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </div>
                  </FormField>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" icon={<Copy className="w-4 h-4" />}>
                      Kopyala
                    </Button>
                    <Button variant="outline" icon={<RefreshCw className="w-4 h-4" />}>
                      Yenile
                    </Button>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={handleQRScan}
                    disabled={!apiKey}
                  >
                    API ile Bağlan
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Connection History and Devices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connection History */}
          <Card>
            <CardHeader>
              <CardTitle>Bağlantı Geçmişi</CardTitle>
              <CardDescription>Son bağlantı kayıtları</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={connectionHistory}
                columns={connectionHistoryColumns}
                pagination={false}
                className="max-h-64"
              />
            </CardContent>
          </Card>

          {/* Connected Devices */}
          <Card>
            <CardHeader>
              <CardTitle>Bağlı Cihazlar</CardTitle>
              <CardDescription>Aktif ve geçmiş cihaz bağlantıları</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={deviceList}
                columns={deviceColumns}
                pagination={false}
                className="max-h-64"
              />
            </CardContent>
          </Card>
        </div>

        {/* Settings Modal */}
        <Modal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>WhatsApp Bağlantı Ayarları</Modal.Title>
            <Modal.Description>
              Bağlantı ve güvenlik ayarlarını yapılandırın
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              {/* Connection Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Bağlantı Ayarları</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Otomatik Bağlantı</p>
                        <p className="text-sm text-muted-500">Uygulama açıldığında otomatik bağlan</p>
                      </div>
                    </div>
                    <Switch
                      checked={autoConnect}
                      onCheckedChange={setAutoConnect}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Bildirimler</p>
                        <p className="text-sm text-muted-500">Bağlantı durumu bildirimleri</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Güvenlik Ayarları</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">End-to-End Şifreleme</p>
                        <p className="text-sm text-muted-500">Aktif</p>
                      </div>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">SSL/TLS Bağlantısı</p>
                        <p className="text-sm text-muted-500">Güvenli bağlantı</p>
                      </div>
                    </div>
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              {/* API Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">API Ayarları</h3>
                <div className="space-y-4">
                  <FormField>
                    <Label htmlFor="webhook">Webhook URL</Label>
                    <Input
                      id="webhook"
                      placeholder="https://api.kafkasder.com/webhook"
                      icon={<Link className="w-4 h-4" />}
                    />
                  </FormField>
                  
                  <FormField>
                    <Label htmlFor="timeout">Bağlantı Zaman Aşımı</Label>
                    <Select
                      id="timeout"
                      options={[
                        { value: '30', label: '30 saniye' },
                        { value: '60', label: '1 dakika' },
                        { value: '120', label: '2 dakika' },
                        { value: '300', label: '5 dakika' }
                      ]}
                    />
                  </FormField>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowSettingsModal(false)}>
              İptal
            </Button>
            <Button variant="primary">
              Kaydet
            </Button>
          </Modal.Footer>
        </Modal>

        {/* QR Code Modal */}
        <Modal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          size="md"
        >
          <Modal.Header>
            <Modal.Title>QR Kod Tarama</Modal.Title>
            <Modal.Description>
              WhatsApp uygulamanızda bu QR kodu tarayın
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center py-8">
              <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-24 h-24 text-gray-600" />
              </div>
              <p className="text-sm text-muted-500 mb-4">
                QR kod geçerlilik süresi: <span className="font-medium">2 dakika</span>
              </p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" icon={<RefreshCw className="w-4 h-4" />}>
                  Yenile
                </Button>
                <Button variant="outline" icon={<Download className="w-4 h-4" />}>
                  İndir
                </Button>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowQRModal(false)}>
              İptal
            </Button>
            <Button variant="primary" onClick={handleQRScan}>
              Bağlandı
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Page>
  );
};

export default WhatsAppLoginNew;
