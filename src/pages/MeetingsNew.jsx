import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Video,
  Phone,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  AlertTriangle,
  Info,
  Settings,
  Search,
  Filter,
  MoreHorizontal,
  User,
  UserPlus,
  UserMinus,
  Mail,
  Send,
  Download,
  Upload,
  Copy,
  ExternalLink,
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
  Volume2,
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
  Bell,
  BellOff,
  Star,
  StarOff,
  Heart,
  HeartOff,
  ThumbsUp,
  ThumbsDown,
  Share,
  Bookmark,
  BookmarkPlus,
  BookmarkMinus,
  Flag,
  FlagOff,
  Shield,
  ShieldCheck,
  ShieldX,
  Lock,
  Unlock,
  Key,
  KeyOff,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Zap,
  ZapOff,
  Globe,
  Globe2,
  Map,
  Navigation,
  Home,
  Building,
  Store,
  School,
  Hospital,
  Bank,
  Coffee,
  Restaurant,
  Car,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  Walk,
  Run,
  Activity,
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  LineChart,
  AreaChart,
  ScatterChart,
  RadarChart,
  Gauge,
  Target,
  Award,
  Trophy,
  Medal,
  Crown,
  Star as StarIcon,
  Heart as HeartIcon,
  Zap as ZapIcon,
  Target as TargetIcon,
  Award as AwardIcon,
  Trophy as TrophyIcon,
  Medal as MedalIcon,
  Crown as CrownIcon,
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

const MeetingsNew = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
  const [showMeetingDetailsModal, setShowMeetingDetailsModal] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingType, setMeetingType] = useState('online');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  // Mock data
  const meetings = [
    {
      id: 1,
      title: 'Gönüllü Koordinasyon Toplantısı',
      date: '2024-01-20',
      time: '10:00',
      duration: '2 saat',
      type: 'online',
      location: 'Zoom Meeting',
      status: 'upcoming',
      participants: [
        { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@kafportal.com', status: 'confirmed' },
        { id: 2, name: 'Fatma Demir', email: 'fatma@kafportal.com', status: 'confirmed' },
        { id: 3, name: 'Mehmet Kaya', email: 'mehmet@kafportal.com', status: 'pending' }
      ],
      organizer: 'Ahmet Yılmaz',
      description: 'Gönüllü aktivitelerinin koordinasyonu ve planlama toplantısı',
      agenda: [
        'Gönüllü sayısı ve dağılımı',
        'Yeni projeler ve fikirler',
        'Eğitim programları',
        'Sosyal medya stratejisi'
      ],
      attachments: [
        { name: 'Gönüllü Raporu.pdf', size: '2.5 MB' },
        { name: 'Proje Planı.docx', size: '1.8 MB' }
      ]
    },
    {
      id: 2,
      title: 'Bağış Kampanyası Değerlendirme',
      date: '2024-01-18',
      time: '14:30',
      duration: '1.5 saat',
      type: 'hybrid',
      location: 'Kafkasder Ofisi + Google Meet',
      status: 'completed',
      participants: [
        { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@kafportal.com', status: 'attended' },
        { id: 4, name: 'Ayşe Özkan', email: 'ayse@kafportal.com', status: 'attended' },
        { id: 5, name: 'Ali Çelik', email: 'ali@kafportal.com', status: 'attended' }
      ],
      organizer: 'Fatma Demir',
      description: 'Son bağış kampanyasının sonuçlarının değerlendirilmesi',
      agenda: [
        'Kampanya sonuçları',
        'Bağışçı analizi',
        'Gelecek planları',
        'Bütçe değerlendirmesi'
      ],
      attachments: [
        { name: 'Kampanya Raporu.pdf', size: '3.2 MB' },
        { name: 'Bağışçı Listesi.xlsx', size: '1.1 MB' }
      ]
    },
    {
      id: 3,
      title: 'Acil Durum Koordinasyon',
      date: '2024-01-16',
      time: '09:00',
      duration: '1 saat',
      type: 'online',
      location: 'Microsoft Teams',
      status: 'cancelled',
      participants: [
        { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@kafportal.com', status: 'cancelled' },
        { id: 2, name: 'Fatma Demir', email: 'fatma@kafportal.com', status: 'cancelled' }
      ],
      organizer: 'Mehmet Kaya',
      description: 'Acil durum müdahale planının gözden geçirilmesi',
      agenda: [
        'Acil durum prosedürleri',
        'İletişim protokolleri',
        'Kaynak dağılımı'
      ],
      attachments: []
    },
    {
      id: 4,
      title: 'Yönetim Kurulu Toplantısı',
      date: '2024-01-25',
      time: '16:00',
      duration: '3 saat',
      type: 'in-person',
      location: 'Kafkasder Merkez Ofisi',
      status: 'upcoming',
      participants: [
        { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@kafportal.com', status: 'confirmed' },
        { id: 2, name: 'Fatma Demir', email: 'fatma@kafportal.com', status: 'confirmed' },
        { id: 3, name: 'Mehmet Kaya', email: 'mehmet@kafportal.com', status: 'confirmed' },
        { id: 4, name: 'Ayşe Özkan', email: 'ayse@kafportal.com', status: 'pending' },
        { id: 5, name: 'Ali Çelik', email: 'ali@kafportal.com', status: 'confirmed' }
      ],
      organizer: 'Ahmet Yılmaz',
      description: 'Aylık yönetim kurulu toplantısı',
      agenda: [
        'Finansal raporlar',
        'Proje güncellemeleri',
        'Stratejik planlama',
        'Personel değerlendirmesi'
      ],
      attachments: [
        { name: 'Finansal Rapor.pdf', size: '4.1 MB' },
        { name: 'Proje Durumu.pptx', size: '2.7 MB' }
      ]
    }
  ];

  const participants = [
    { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@kafportal.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Fatma Demir', email: 'fatma@kafportal.com', role: 'moderator', status: 'active' },
    { id: 3, name: 'Mehmet Kaya', email: 'mehmet@kafportal.com', role: 'user', status: 'active' },
    { id: 4, name: 'Ayşe Özkan', email: 'ayse@kafportal.com', role: 'volunteer', status: 'active' },
    { id: 5, name: 'Ali Çelik', email: 'ali@kafportal.com', role: 'user', status: 'active' }
  ];

  const meetingColumns = [
    {
      key: 'title',
      label: 'Toplantı',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
            {item.type === 'online' ? (
              <Video className="w-5 h-5 text-brand-600" />
            ) : item.type === 'in-person' ? (
              <MapPin className="w-5 h-5 text-brand-600" />
            ) : (
              <Users className="w-5 h-5 text-brand-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium">{item.title}</div>
            <div className="text-sm text-muted-500">{item.organizer}</div>
          </div>
        </div>
      )
    },
    {
      key: 'date',
      label: 'Tarih & Saat',
      render: (item) => (
        <div>
          <div className="font-medium">
            {new Date(item.date).toLocaleDateString('tr-TR')}
          </div>
          <div className="text-sm text-muted-500">
            {item.time} - {item.duration}
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Tür',
      render: (item) => (
        <Badge variant={item.type === 'online' ? 'primary' : 'outline'}>
          {item.type === 'online' ? 'Çevrimiçi' : item.type === 'in-person' ? 'Yüz Yüze' : 'Hibrit'}
        </Badge>
      )
    },
    {
      key: 'participants',
      label: 'Katılımcılar',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="text-sm">{item.participants.length} kişi</span>
        </div>
      )
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
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<Eye className="w-4 h-4" />}
            onClick={() => {
              setSelectedMeeting(item);
              setShowMeetingDetailsModal(true);
            }}
          />
          <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} />
          <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} />
        </div>
      )
    }
  ];

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'upcoming' || 
                      (activeTab === 'completed' && meeting.status === 'completed') ||
                      (activeTab === 'cancelled' && meeting.status === 'cancelled');
    
    return matchesSearch && matchesTab;
  });

  const stats = [
    {
      title: 'Toplam Toplantı',
      value: meetings.length,
      icon: Calendar,
      color: 'brand'
    },
    {
      title: 'Yaklaşan',
      value: meetings.filter(m => m.status === 'upcoming').length,
      icon: Clock,
      color: 'warning'
    },
    {
      title: 'Tamamlanan',
      value: meetings.filter(m => m.status === 'completed').length,
      icon: Check,
      color: 'success'
    },
    {
      title: 'İptal Edilen',
      value: meetings.filter(m => m.status === 'cancelled').length,
      icon: X,
      color: 'danger'
    }
  ];

  const handleCreateMeeting = () => {
    // Mock meeting creation
    const newMeeting = {
      id: meetings.length + 1,
      title: meetingTitle,
      date: meetingDate,
      time: meetingTime,
      duration: '1 saat',
      type: meetingType,
      location: meetingLocation,
      status: 'upcoming',
      participants: selectedParticipants,
      organizer: 'Ahmet Yılmaz',
      description: meetingDescription,
      agenda: [],
      attachments: []
    };
    
    setShowNewMeetingModal(false);
    // In real app, this would be saved to database
  };

  return (
    <Page
      title="Toplantılar"
      description="Toplantı planlama ve yönetim sistemi"
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
            onClick={() => setShowNewMeetingModal(true)}
          >
            Yeni Toplantı
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
            <CardTitle>Toplantı Arama</CardTitle>
            <CardDescription>Toplantıları filtrelemek için arama yapın</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <Label htmlFor="search">Arama</Label>
                <Input
                  id="search"
                  placeholder="Toplantı adı veya organizatör ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Meetings List */}
        <Card>
          <CardHeader>
            <CardTitle>Toplantı Listesi</CardTitle>
            <CardDescription>Toplam {filteredMeetings.length} toplantı</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upcoming">Yaklaşan</TabsTrigger>
                <TabsTrigger value="completed">Tamamlanan</TabsTrigger>
                <TabsTrigger value="cancelled">İptal Edilen</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="mt-6">
              <DataTable
                data={filteredMeetings}
                columns={meetingColumns}
                pagination={true}
                itemsPerPage={10}
              />
            </div>
          </CardContent>
        </Card>

        {/* New Meeting Modal */}
        <Modal
          isOpen={showNewMeetingModal}
          onClose={() => setShowNewMeetingModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Yeni Toplantı Oluştur</Modal.Title>
            <Modal.Description>
              Yeni bir toplantı planlayın ve katılımcıları davet edin
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <FormField>
                <Label htmlFor="title">Toplantı Başlığı</Label>
                <Input
                  id="title"
                  placeholder="Toplantı başlığını girin"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <Label htmlFor="date">Tarih</Label>
                  <Input
                    id="date"
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                  />
                </FormField>
                
                <FormField>
                  <Label htmlFor="time">Saat</Label>
                  <Input
                    id="time"
                    type="time"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                  />
                </FormField>
              </div>
              
              <FormField>
                <Label htmlFor="type">Toplantı Türü</Label>
                <Select
                  id="type"
                  value={meetingType}
                  onChange={(e) => setMeetingType(e.target.value)}
                  options={[
                    { value: 'online', label: 'Çevrimiçi' },
                    { value: 'in-person', label: 'Yüz Yüze' },
                    { value: 'hybrid', label: 'Hibrit' }
                  ]}
                />
              </FormField>
              
              <FormField>
                <Label htmlFor="location">Konum</Label>
                <Input
                  id="location"
                  placeholder="Toplantı konumu veya link"
                  value={meetingLocation}
                  onChange={(e) => setMeetingLocation(e.target.value)}
                />
              </FormField>
              
              <FormField>
                <Label htmlFor="description">Açıklama</Label>
                <textarea
                  id="description"
                  className="w-full p-3 border rounded-md resize-none"
                  rows={3}
                  placeholder="Toplantı açıklaması"
                  value={meetingDescription}
                  onChange={(e) => setMeetingDescription(e.target.value)}
                />
              </FormField>
              
              <FormField>
                <Label>Katılımcılar</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`participant-${participant.id}`}
                        checked={selectedParticipants.some(p => p.id === participant.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedParticipants([...selectedParticipants, participant]);
                          } else {
                            setSelectedParticipants(selectedParticipants.filter(p => p.id !== participant.id));
                          }
                        }}
                      />
                      <label htmlFor={`participant-${participant.id}`} className="text-sm">
                        {participant.name} ({participant.email})
                      </label>
                    </div>
                  ))}
                </div>
              </FormField>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowNewMeetingModal(false)}>
              İptal
            </Button>
            <Button variant="primary" onClick={handleCreateMeeting}>
              Toplantı Oluştur
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Meeting Details Modal */}
        <Modal
          isOpen={showMeetingDetailsModal}
          onClose={() => setShowMeetingDetailsModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>{selectedMeeting?.title}</Modal.Title>
            <Modal.Description>
              Toplantı detayları ve katılımcı bilgileri
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            {selectedMeeting && (
              <div className="space-y-6">
                {/* Meeting Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Tarih & Saat</Label>
                    <p className="text-sm text-muted-500">
                      {new Date(selectedMeeting.date).toLocaleDateString('tr-TR')} - {selectedMeeting.time}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Süre</Label>
                    <p className="text-sm text-muted-500">{selectedMeeting.duration}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tür</Label>
                    <Badge variant={selectedMeeting.type === 'online' ? 'primary' : 'outline'}>
                      {selectedMeeting.type === 'online' ? 'Çevrimiçi' : selectedMeeting.type === 'in-person' ? 'Yüz Yüze' : 'Hibrit'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Konum</Label>
                    <p className="text-sm text-muted-500">{selectedMeeting.location}</p>
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <Label className="text-sm font-medium">Açıklama</Label>
                  <p className="text-sm text-muted-500 mt-1">{selectedMeeting.description}</p>
                </div>
                
                {/* Agenda */}
                {selectedMeeting.agenda.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Gündem</Label>
                    <ul className="list-disc list-inside text-sm text-muted-500 mt-1 space-y-1">
                      {selectedMeeting.agenda.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Participants */}
                <div>
                  <Label className="text-sm font-medium">Katılımcılar ({selectedMeeting.participants.length})</Label>
                  <div className="mt-2 space-y-2">
                    {selectedMeeting.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">{participant.name}</p>
                          <p className="text-xs text-muted-500">{participant.email}</p>
                        </div>
                        <StatusBadge status={participant.status} />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Attachments */}
                {selectedMeeting.attachments.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Ekler</Label>
                    <div className="mt-2 space-y-2">
                      {selectedMeeting.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <File className="w-4 h-4" />
                            <span className="text-sm">{attachment.name}</span>
                          </div>
                          <span className="text-xs text-muted-500">{attachment.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowMeetingDetailsModal(false)}>
              Kapat
            </Button>
            <Button variant="primary" icon={<Send className="w-4 h-4" />}>
              Davet Gönder
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Page>
  );
};

export default MeetingsNew;
