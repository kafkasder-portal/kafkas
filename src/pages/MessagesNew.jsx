import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
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

const MessagesNew = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');

  // Mock data
  const conversations = [
    {
      id: 1,
      title: 'Gönüllü Koordinasyonu',
      participants: ['Ahmet Yılmaz', 'Fatma Demir', 'Mehmet Kaya'],
      lastMessage: 'Yarın saat 10:00\'da toplantı var.',
      lastMessageTime: '2024-01-15T14:30:00',
      unreadCount: 3,
      type: 'group',
      status: 'active',
      avatar: null
    },
    {
      id: 2,
      title: 'Bağış Takibi',
      participants: ['Ayşe Özkan'],
      lastMessage: 'Bağış belgeleri hazırlandı.',
      lastMessageTime: '2024-01-15T13:45:00',
      unreadCount: 0,
      type: 'direct',
      status: 'active',
      avatar: null
    },
    {
      id: 3,
      title: 'Acil Durum',
      participants: ['Ali Çelik', 'Zeynep Demir'],
      lastMessage: 'Acil yardım gerekiyor.',
      lastMessageTime: '2024-01-15T12:15:00',
      unreadCount: 5,
      type: 'group',
      status: 'urgent',
      avatar: null
    },
    {
      id: 4,
      title: 'Sistem Bildirimleri',
      participants: ['System'],
      lastMessage: 'Yeni kullanıcı kaydı yapıldı.',
      lastMessageTime: '2024-01-15T11:20:00',
      unreadCount: 1,
      type: 'system',
      status: 'info',
      avatar: null
    },
    {
      id: 5,
      title: 'Proje Güncellemesi',
      participants: ['Proje Ekibi'],
      lastMessage: 'Proje raporu güncellendi.',
      lastMessageTime: '2024-01-15T10:30:00',
      unreadCount: 0,
      type: 'group',
      status: 'active',
      avatar: null
    }
  ];

  const messages = [
    {
      id: 1,
      conversationId: 1,
      sender: 'Ahmet Yılmaz',
      content: 'Merhaba, gönüllü koordinasyonu için toplantı yapalım.',
      timestamp: '2024-01-15T14:00:00',
      type: 'text',
      status: 'read'
    },
    {
      id: 2,
      conversationId: 1,
      sender: 'Fatma Demir',
      content: 'Evet, yarın saat 10:00\'da uygun.',
      timestamp: '2024-01-15T14:15:00',
      type: 'text',
      status: 'read'
    },
    {
      id: 3,
      conversationId: 1,
      sender: 'Mehmet Kaya',
      content: 'Yarın saat 10:00\'da toplantı var.',
      timestamp: '2024-01-15T14:30:00',
      type: 'text',
      status: 'delivered'
    },
    {
      id: 4,
      conversationId: 2,
      sender: 'Ayşe Özkan',
      content: 'Bağış belgeleri hazırlandı.',
      timestamp: '2024-01-15T13:45:00',
      type: 'text',
      status: 'read'
    },
    {
      id: 5,
      conversationId: 3,
      sender: 'Ali Çelik',
      content: 'Acil yardım gerekiyor.',
      timestamp: '2024-01-15T12:15:00',
      type: 'text',
      status: 'read'
    }
  ];

  const conversationColumns = [
    {
      key: 'title',
      label: 'Konuşma',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
            {item.type === 'group' ? (
              <Users className="w-5 h-5 text-brand-600" />
            ) : item.type === 'system' ? (
              <Mail className="w-5 h-5 text-brand-600" />
            ) : (
              <User className="w-5 h-5 text-brand-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.title}</span>
              {item.unreadCount > 0 && (
                <Badge variant="primary" className="text-xs">
                  {item.unreadCount}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-500">
              {item.participants.join(', ')}
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
          active: { label: 'Aktif', color: 'success' },
          urgent: { label: 'Acil', color: 'danger' },
          info: { label: 'Bilgi', color: 'info' }
        };
        const config = statusConfig[item.status];
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
            onClick={() => setSelectedConversation(item)}
          />
          <Button variant="ghost" size="sm" icon={<Reply className="w-4 h-4" />} />
          <Button variant="ghost" size="sm" icon={<Archive className="w-4 h-4" />} />
        </div>
      )
    }
  ];

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTab = activeTab === 'all' || conv.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const stats = [
    {
      title: 'Toplam Konuşma',
      value: conversations.length,
      icon: MessageSquare,
      color: 'brand'
    },
    {
      title: 'Okunmamış',
      value: conversations.reduce((sum, conv) => sum + conv.unreadCount, 0),
      icon: Mail,
      color: 'warning'
    },
    {
      title: 'Aktif Grup',
      value: conversations.filter(conv => conv.type === 'group' && conv.status === 'active').length,
      icon: Users,
      color: 'success'
    },
    {
      title: 'Acil Mesaj',
      value: conversations.filter(conv => conv.status === 'urgent').length,
      icon: AlertTriangle,
      color: 'danger'
    }
  ];

  const selectedMessages = selectedConversation 
    ? messages.filter(msg => msg.conversationId === selectedConversation.id)
    : [];

  return (
    <Page
      title="Mesajlar"
      description="İç mesajlaşma sistemi ve iletişim yönetimi"
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
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowNewMessageModal(true)}
          >
            Yeni Mesaj
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

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Mesaj Arama</CardTitle>
            <CardDescription>Konuşmaları filtrelemek için arama yapın</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <Label htmlFor="search">Arama</Label>
                <Input
                  id="search"
                  placeholder="Konuşma adı veya katılımcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Conversations and Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Konuşmalar</CardTitle>
                <CardDescription>Toplam {filteredConversations.length} konuşma</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">Tümü</TabsTrigger>
                    <TabsTrigger value="active">Aktif</TabsTrigger>
                    <TabsTrigger value="urgent">Acil</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="mt-4 space-y-2">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedConversation?.id === conversation.id
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-border hover:bg-muted-50'
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                          {conversation.type === 'group' ? (
                            <Users className="w-4 h-4 text-brand-600" />
                          ) : conversation.type === 'system' ? (
                            <Mail className="w-4 h-4 text-brand-600" />
                          ) : (
                            <User className="w-4 h-4 text-brand-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{conversation.title}</span>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="primary" className="text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-500 truncate">
                            {conversation.lastMessage}
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
                  {selectedConversation ? selectedConversation.title : 'Mesajlar'}
                </CardTitle>
                <CardDescription>
                  {selectedConversation 
                    ? `${selectedConversation.participants.join(', ')}`
                    : 'Bir konuşma seçin'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedConversation ? (
                  <div className="space-y-4">
                    {/* Messages List */}
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {selectedMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'Ahmet Yılmaz' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs p-3 rounded-lg ${
                            message.sender === 'Ahmet Yılmaz'
                              ? 'bg-brand-500 text-white'
                              : 'bg-muted-100'
                          }`}>
                            <div className="text-sm font-medium mb-1">{message.sender}</div>
                            <div className="text-sm">{message.content}</div>
                            <div className={`text-xs mt-1 ${
                              message.sender === 'Ahmet Yılmaz' ? 'text-brand-100' : 'text-muted-500'
                            }`}>
                              {new Date(message.timestamp).toLocaleString('tr-TR')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex gap-2 pt-4 border-t">
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
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Mesajları görüntülemek için bir konuşma seçin</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* New Message Modal */}
        <Modal
          isOpen={showNewMessageModal}
          onClose={() => setShowNewMessageModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Yeni Mesaj</Modal.Title>
            <Modal.Description>
              Yeni bir konuşma başlatın veya mevcut konuşmaya mesaj gönderin
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <FormField>
                <Label htmlFor="recipients">Alıcılar</Label>
                <Select
                  id="recipients"
                  options={[
                    { value: 'all', label: 'Tüm Kullanıcılar' },
                    { value: 'volunteers', label: 'Gönüllüler' },
                    { value: 'admins', label: 'Yöneticiler' }
                  ]}
                />
              </FormField>
              
              <FormField>
                <Label htmlFor="subject">Konu</Label>
                <Input id="subject" placeholder="Mesaj konusu" />
              </FormField>
              
              <FormField>
                <Label htmlFor="message">Mesaj</Label>
                <textarea
                  id="message"
                  className="w-full p-3 border rounded-md resize-none"
                  rows={4}
                  placeholder="Mesajınızı yazın..."
                />
              </FormField>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowNewMessageModal(false)}>
              İptal
            </Button>
            <Button variant="primary">
              Gönder
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Page>
  );
};

export default MessagesNew;
