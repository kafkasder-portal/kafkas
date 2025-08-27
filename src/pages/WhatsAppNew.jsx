import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Search,
  Filter,
  MoreHorizontal,
  User,
  Users,
  Clock,
  Check,
  CheckCheck,
  Reply,
  Forward,
  Trash2,
  Archive,
  Star,
  StarOff,
  Mail,
  MailOpen,
  Phone,
  Video,
  Image,
  File,
  Paperclip,
  Smile,
  Plus,
  Edit,
  Eye,
  AlertTriangle,
  Settings,
  QrCode,
  RefreshCw,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Smartphone,
  Globe,
  Shield,
  ShieldCheck,
  ShieldX,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Camera,
  Mic,
  MicOff,
  Headphones,
  Monitor,
  Tablet,
  Zap,
  ZapOff,
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

const WhatsAppNew = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [autoReply, setAutoReply] = useState(true);
  const [notifications, setNotifications] = useState(true);

  // Mock data
  const chats = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      phone: '+90 532 123 4567',
      lastMessage: 'Merhaba, yardım talebim var.',
      lastMessageTime: '2024-01-15T14:30:00',
      unreadCount: 2,
      status: 'online',
      avatar: null,
      type: 'individual'
    },
    {
      id: 2,
      name: 'Fatma Demir',
      phone: '+90 533 987 6543',
      lastMessage: 'Bağış bilgilerini gönderdim.',
      lastMessageTime: '2024-01-15T13:45:00',
      unreadCount: 0,
      status: 'offline',
      avatar: null,
      type: 'individual'
    },
    {
      id: 3,
      name: 'Gönüllü Grubu',
      phone: 'Group',
      lastMessage: 'Yarın toplantı var.',
      lastMessageTime: '2024-01-15T12:15:00',
      unreadCount: 5,
      status: 'active',
      avatar: null,
      type: 'group',
      participants: 8
    },
    {
      id: 4,
      name: 'Mehmet Kaya',
      phone: '+90 534 456 7890',
      lastMessage: 'Acil durum bildirimi.',
      lastMessageTime: '2024-01-15T11:20:00',
      unreadCount: 1,
      status: 'online',
      avatar: null,
      type: 'individual'
    },
    {
      id: 5,
      name: 'Sistem Bildirimleri',
      phone: 'System',
      lastMessage: 'Yeni kullanıcı kaydı yapıldı.',
      lastMessageTime: '2024-01-15T10:30:00',
      unreadCount: 0,
      status: 'system',
      avatar: null,
      type: 'system'
    }
  ];

  const messages = [
    {
      id: 1,
      chatId: 1,
      sender: 'Ahmet Yılmaz',
      content: 'Merhaba, yardım talebim var.',
      timestamp: '2024-01-15T14:00:00',
      type: 'text',
      status: 'read',
      direction: 'incoming'
    },
    {
      id: 2,
      chatId: 1,
      sender: 'System',
      content: 'Merhaba! Size nasıl yardımcı olabilirim?',
      timestamp: '2024-01-15T14:05:00',
      type: 'text',
      status: 'read',
      direction: 'outgoing'
    },
    {
      id: 3,
      chatId: 1,
      sender: 'Ahmet Yılmaz',
      content: 'Gıda yardımına ihtiyacım var.',
      timestamp: '2024-01-15T14:30:00',
      type: 'text',
      status: 'delivered',
      direction: 'incoming'
    },
    {
      id: 4,
      chatId: 2,
      sender: 'Fatma Demir',
      content: 'Bağış bilgilerini gönderdim.',
      timestamp: '2024-01-15T13:45:00',
      type: 'text',
      status: 'read',
      direction: 'incoming'
    },
    {
      id: 5,
      chatId: 3,
      sender: 'Gönüllü Grubu',
      content: 'Yarın saat 10:00\'da toplantı var.',
      timestamp: '2024-01-15T12:15:00',
      type: 'text',
      status: 'read',
      direction: 'incoming'
    }
  ];

  const chatColumns = [
    {
      key: 'name',
      label: 'Sohbet',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            {item.type === 'group' ? (
              <Users className="w-5 h-5 text-green-600" />
            ) : item.type === 'system' ? (
              <Settings className="w-5 h-5 text-green-600" />
            ) : (
              <User className="w-5 h-5 text-green-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.name}</span>
              {item.unreadCount > 0 && (
                <Badge variant="primary" className="text-xs">
                  {item.unreadCount}
                </Badge>
              )}
              {item.status === 'online' && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </div>
            <div className="text-sm text-muted-500">
              {item.type === 'group' ? `${item.participants} katılımcı` : item.phone}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'lastMessage',
      label: 'Son Mesaj',
      render: (item) => (
        <div className="max-w-xs">
          <div className="text-sm font-medium truncate">{item.lastMessage}</div>
          <div className="text-xs text-muted-500">
            {new Date(item.lastMessageTime).toLocaleString('tr-TR')}
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Tür',
      render: (item) => (
        <Badge variant={item.type === 'group' ? 'primary' : 'outline'}>
          {item.type === 'group' ? 'Grup' : item.type === 'system' ? 'Sistem' : 'Bireysel'}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Durum',
      render: (item) => {
        const statusConfig = {
          online: { label: 'Çevrimiçi', color: 'success' },
          offline: { label: 'Çevrimdışı', color: 'muted' },
          active: { label: 'Aktif', color: 'success' },
          system: { label: 'Sistem', color: 'info' }
        };
        return <StatusBadge status={item.status} />;
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
            onClick={() => setSelectedChat(item)}
          />
          <Button variant="ghost" size="sm" icon={<Reply className="w-4 h-4" />} />
          <Button variant="ghost" size="sm" icon={<Archive className="w-4 h-4" />} />
        </div>
      )
    }
  ];

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'chats' || 
                      (activeTab === 'groups' && chat.type === 'group') ||
                      (activeTab === 'individual' && chat.type === 'individual');
    
    return matchesSearch && matchesTab;
  });

  const stats = [
    {
      title: 'Toplam Sohbet',
      value: chats.length,
      icon: MessageCircle,
      color: 'green'
    },
    {
      title: 'Okunmamış',
      value: chats.reduce((sum, chat) => sum + chat.unreadCount, 0),
      icon: Mail,
      color: 'warning'
    },
    {
      title: 'Çevrimiçi',
      value: chats.filter(chat => chat.status === 'online').length,
      icon: Wifi,
      color: 'success'
    },
    {
      title: 'Aktif Grup',
      value: chats.filter(chat => chat.type === 'group' && chat.status === 'active').length,
      icon: Users,
      color: 'brand'
    }
  ];

  const selectedMessages = selectedChat 
    ? messages.filter(msg => msg.chatId === selectedChat.id)
    : [];

  const connectionConfig = {
    connected: { label: 'Bağlı', color: 'success', icon: Wifi },
    connecting: { label: 'Bağlanıyor...', color: 'warning', icon: RefreshCw },
    disconnected: { label: 'Bağlantı Yok', color: 'danger', icon: WifiOff }
  };

  return (
    <Page
      title="WhatsApp Entegrasyonu"
      description="WhatsApp Business API entegrasyonu ve mesajlaşma yönetimi"
      actions={
        <>
          <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
            Filtrele
          </Button>
          <Button variant="outline" icon={<Search className="w-4 h-4" />}>
            Ara
          </Button>
          <Button 
            variant="primary" 
            icon={<Settings className="w-4 h-4" />}
            onClick={() => setShowSettingsModal(true)}
          >
            Ayarlar
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
        {/* Connection Status */}
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
              ? ' Tüm mesajlar otomatik olarak senkronize ediliyor'
              : ' Bağlantı kurulmaya çalışılıyor'
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

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Arama</CardTitle>
            <CardDescription>Sohbetleri filtrelemek için arama yapın</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <Label htmlFor="search">Arama</Label>
                <Input
                  id="search"
                  placeholder="Kişi adı veya telefon numarası ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Chats and Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chats List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Sohbetleri</CardTitle>
                <CardDescription>Toplam {filteredChats.length} sohbet</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="chats">Tümü</TabsTrigger>
                    <TabsTrigger value="individual">Bireysel</TabsTrigger>
                    <TabsTrigger value="groups">Gruplar</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="mt-4 space-y-2">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedChat?.id === chat.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-border hover:bg-muted-50'
                      }`}
                      onClick={() => setSelectedChat(chat)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          {chat.type === 'group' ? (
                            <Users className="w-4 h-4 text-green-600" />
                          ) : chat.type === 'system' ? (
                            <Settings className="w-4 h-4 text-green-600" />
                          ) : (
                            <User className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{chat.name}</span>
                            {chat.unreadCount > 0 && (
                              <Badge variant="primary" className="text-xs">
                                {chat.unreadCount}
                              </Badge>
                            )}
                            {chat.status === 'online' && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                          <div className="text-xs text-muted-500 truncate">
                            {chat.lastMessage}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Messages */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedChat ? selectedChat.name : 'WhatsApp Mesajları'}
                </CardTitle>
                <CardDescription>
                  {selectedChat 
                    ? `${selectedChat.type === 'group' ? 'Grup' : 'Bireysel'} sohbet`
                    : 'Bir sohbet seçin'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedChat ? (
                  <div className="space-y-4">
                    {/* Messages List */}
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {selectedMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs p-3 rounded-lg ${
                            message.direction === 'outgoing'
                              ? 'bg-green-500 text-white'
                              : 'bg-muted-100'
                          }`}>
                            <div className="text-sm font-medium mb-1">{message.sender}</div>
                            <div className="text-sm">{message.content}</div>
                            <div className={`text-xs mt-1 flex items-center gap-1 ${
                              message.direction === 'outgoing' ? 'text-green-100' : 'text-muted-500'
                            }`}>
                              {new Date(message.timestamp).toLocaleString('tr-TR')}
                              {message.direction === 'outgoing' && (
                                <CheckCheck className="w-3 h-3" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="ghost" size="sm" icon={<Paperclip className="w-4 h-4" />} />
                      <Button variant="ghost" size="sm" icon={<Camera className="w-4 h-4" />} />
                      <Input
                        placeholder="Mesajınızı yazın..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="primary" 
                        icon={<Send className="w-4 h-4" />}
                        disabled={!messageText.trim()}
                      >
                        Gönder
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Mesajları görüntülemek için bir sohbet seçin</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Settings Modal */}
        <Modal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>WhatsApp Ayarları</Modal.Title>
            <Modal.Description>
              WhatsApp Business API entegrasyon ayarları
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              {/* Connection Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Bağlantı Ayarları</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <QrCode className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">QR Kod Bağlantısı</p>
                        <p className="text-sm text-muted-500">Telefon ile QR kod tarayın</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      QR Göster
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Bağlantı Durumu</p>
                        <p className="text-sm text-muted-500">
                          {connectionConfig[connectionStatus].label}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={connectionStatus} />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Bildirim Ayarları</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Bildirimler</p>
                        <p className="text-sm text-muted-500">Yeni mesaj bildirimleri</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Otomatik Yanıt</p>
                        <p className="text-sm text-muted-500">Gelen mesajlara otomatik yanıt</p>
                      </div>
                    </div>
                    <Switch
                      checked={autoReply}
                      onCheckedChange={setAutoReply}
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
                        <p className="font-medium">API Anahtarı</p>
                        <p className="text-sm text-muted-500">Güvenli bağlantı</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Yenile
                    </Button>
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
              Kaydet
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Page>
  );
};

export default WhatsAppNew;
