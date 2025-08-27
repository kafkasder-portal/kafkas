import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  Calendar,
  Clock,
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
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  Maximize,
  Minimize,
  Fullscreen,
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
  Coffee,
  Car,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  Activity,
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  LineChart,
  AreaChart,
  ScatterChart,
  Gauge,
  Target,
  Trophy,
  Medal,
  Crown,
  Plus,
  Edit,
  Trash2,
  Eye,
  File,
  FileText,
  FileCheck,
  FileX,
  FilePlus,
  FileMinus,
  FileSearch,
  FileEdit,
  FileArchive,
  FileDownload,
  FileUpload,
  Receipt,
  CreditCard,
  DollarSign,
  Euro,
  PoundSterling,
  Yen,
  Bitcoin,
  Gift,
  HandHeart,
  HeartHandshake,
  Handshake,
  HelpCircle,
  LifeBuoy,
  Shield as ShieldIcon,
  Truck,
  Box,
  Package,
  ShoppingCart,
  ShoppingBag,
  Bag,
  Briefcase,
  Suitcase,
  Archive,
  Database,
  HardDrive,
  Server,
  Cloud,
  CloudOff,
  Wifi as WifiIcon,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  SignalZero,
  Radio,
  RadioTower,
  Satellite,
  SatelliteDish,
  Antenna,
  Router,
  Modem,
  Cable,
  Plug,
  Power as PowerIcon,
  Battery as BatteryIcon,
  Zap as ZapIcon,
  Lightning,
  Thunder,
  Storm,
  Rain,
  Snow,
  Cloud as CloudIcon,
  Sun,
  Moon,
  Star as StarIcon,
  Planet,
  Globe as GlobeIcon,
  Map as MapIcon,
  Compass,
  Navigation as NavigationIcon,
  Route,
  Road,
  Highway,
  Street,
  Avenue,
  Boulevard,
  Lane,
  Alley,
  Bridge,
  Tunnel,
  Mountain,
  Hill,
  Valley,
  River,
  Lake,
  Ocean,
  Sea,
  Beach,
  Island,
  Forest,
  Tree,
  Leaf,
  Flower,
  Grass,
  Bush,
  Cactus,
  Palm,
  Pine,
  Oak,
  Maple,
  Cherry,
  Apple,
  Orange,
  Banana,
  Grape,
  Strawberry,
  Blueberry,
  Raspberry,
  Blackberry,
  Lemon,
  Lime,
  Peach,
  Pear,
  Plum,
  Apricot,
  Mango,
  Pineapple,
  Coconut,
  Avocado,
  Tomato,
  Carrot,
  Potato,
  Onion,
  Garlic,
  Pepper,
  Chili,
  Cucumber,
  Lettuce,
  Spinach,
  Kale,
  Broccoli,
  Cauliflower,
  Cabbage,
  Brussels,
  Asparagus,
  Mushroom,
  Corn,
  Peas,
  Beans,
  Lentils,
  Rice,
  Wheat,
  Oats,
  Barley,
  Rye,
  Quinoa,
  Millet,
  Sorghum,
  Buckwheat,
  Amaranth,
  Teff,
  Spelt,
  Kamut,
  Farro,
  Bulgur,
  Couscous,
  Pasta,
  Noodles,
  Bread,
  Cake,
  Cookie,
  Pie,
  Tart,
  Pudding,
  IceCream,
  Yogurt,
  Cheese,
  Milk,
  Butter,
  Cream,
  SourCream,
  Buttermilk,
  Kefir,
  CottageCheese,
  Feta,
  Mozzarella,
  Cheddar,
  Swiss,
  Gouda,
  Brie,
  Camembert,
  BlueCheese,
  GoatCheese,
  SheepCheese,
  BuffaloCheese,
  SoyMilk,
  AlmondMilk,
  CoconutMilk,
  OatMilk,
  RiceMilk,
  HempMilk,
  FlaxMilk,
  CashewMilk,
  HazelnutMilk,
  WalnutMilk,
  PistachioMilk,
  MacadamiaMilk,
  BrazilNutMilk,
  PecanMilk,
  PineNutMilk,
  SunflowerSeedMilk,
  PumpkinSeedMilk,
  ChiaSeedMilk,
  SesameSeedMilk,
  PoppySeedMilk,
  MustardSeedMilk,
  CarawaySeedMilk,
  CuminSeedMilk,
  CorianderSeedMilk,
  FennelSeedMilk,
  AniseSeedMilk,
  CardamomSeedMilk,
  NutmegSeedMilk,
  MaceSeedMilk,
  CloveSeedMilk,
  CinnamonSeedMilk,
  AllspiceSeedMilk,
  JuniperSeedMilk,
  BaySeedMilk,
  RosemarySeedMilk,
  ThymeSeedMilk,
  OreganoSeedMilk,
  BasilSeedMilk,
  SageSeedMilk,
  MarjoramSeedMilk,
  TarragonSeedMilk,
  DillSeedMilk,
  ParsleySeedMilk,
  CilantroSeedMilk,
  MintSeedMilk,
  LemonGrassSeedMilk,
  GingerSeedMilk,
  TurmericSeedMilk,
  GalangalSeedMilk,
  LemongrassSeedMilk,
  KaffirLimeSeedMilk,
  CurryLeafSeedMilk,
  FenugreekSeedMilk,
  AsafoetidaSeedMilk,
  NigellaSeedMilk,
  BlackSeedMilk,
  KalonjiSeedMilk,
  AjwainSeedMilk,
  CaromSeedMilk,
  BishopSeedMilk,
  CelerySeedMilk,
  LovageSeedMilk,
  AngelicaSeedMilk,
  ChervilSeedMilk,
  BorageSeedMilk,
  HyssopSeedMilk,
  SavorySeedMilk,
  WinterSavorySeedMilk,
  SummerSavorySeedMilk,
  HorehoundSeedMilk,
  HyssopSeedMilk2,
  LavenderSeedMilk,
  BergamotSeedMilk,
  LemonBalSeedMilk,
  CatnipSeedMilk,
  PennyroyalSeedMilk,
  SpearmintSeedMilk,
  PeppermintSeedMilk,
  AppleMintSeedMilk,
  PineappleMintSeedMilk,
  ChocolateMintSeedMilk,
  OrangeMintSeedMilk,
  GrapefruitMintSeedMilk,
  LimeMintSeedMilk,
  GingerMintSeedMilk,
  BasilMintSeedMilk,
  LemonMintSeedMilk,
  StrawberryMintSeedMilk,
  RaspberryMintSeedMilk,
  BlackberryMintSeedMilk,
  BlueberryMintSeedMilk,
  CranberryMintSeedMilk,
  ElderberryMintSeedMilk,
  MulberryMintSeedMilk,
  GooseberryMintSeedMilk,
  CurrantMintSeedMilk,
  BlackcurrantMintSeedMilk,
  RedcurrantMintSeedMilk,
  WhitecurrantMintSeedMilk,
  JostaberryMintSeedMilk,
  LoganberryMintSeedMilk,
  BoysenberryMintSeedMilk,
  TayberryMintSeedMilk,
  MarionberryMintSeedMilk,
  OlallieberryMintSeedMilk,
  YoungberryMintSeedMilk,
  DewberryMintSeedMilk,
  WineberryMintSeedMilk,
  SalmonberryMintSeedMilk,
  CloudberryMintSeedMilk,
  LingonberryMintSeedMilk,
  HuckleberryMintSeedMilk,
  BilberryMintSeedMilk,
  WhortleberryMintSeedMilk,
  BlaeberryMintSeedMilk,
  WhinberryMintSeedMilk,
  WimberryMintSeedMilk,
  HurtsMintSeedMilk,
  HurtleberryMintSeedMilk,
  MyrtleberryMintSeedMilk,
  BearberryMintSeedMilk,
  CowberryMintSeedMilk,
  FoxberryMintSeedMilk,
  PartridgeberryMintSeedMilk,
  RedberryMintSeedMilk,
  MountainCranberryMintSeedMilk,
  RockCranberryMintSeedMilk,
  LowbushCranberryMintSeedMilk,
  HighbushCranberryMintSeedMilk,
  EuropeanCranberryMintSeedMilk,
  AmericanCranberryMintSeedMilk,
  LargeCranberryMintSeedMilk,
  SmallCranberryMintSeedMilk,
  BogCranberryMintSeedMilk,
  SwampCranberryMintSeedMilk,
  MarshCranberryMintSeedMilk,
  FenCranberryMintSeedMilk,
  HeathCranberryMintSeedMilk,
  MoorCranberryMintSeedMilk,
  PeatCranberryMintSeedMilk,
  SphagnumCranberryMintSeedMilk,
  MossCranberryMintSeedMilk,
  LichenCranberryMintSeedMilk,
  FungusCranberryMintSeedMilk,
  AlgaeCranberryMintSeedMilk,
  SeaweedCranberryMintSeedMilk,
  KelpCranberryMintSeedMilk,
  NoriCranberryMintSeedMilk,
  WakameCranberryMintSeedMilk,
  KombuCranberryMintSeedMilk,
  HijikiCranberryMintSeedMilk,
  ArameCranberryMintSeedMilk,
  DulseCranberryMintSeedMilk,
  IrishMossCranberryMintSeedMilk,
  CarrageenCranberryMintSeedMilk,
  AgarCranberryMintSeedMilk,
  SpirulinaCranberryMintSeedMilk,
  ChlorellaCranberryMintSeedMilk,
  BlueGreenAlgaeCranberryMintSeedMilk,
  CyanobacteriaCranberryMintSeedMilk,
  MicroalgaeCranberryMintSeedMilk,
  MacroalgaeCranberryMintSeedMilk,
  PhytoplanktonCranberryMintSeedMilk,
  ZooplanktonCranberryMintSeedMilk,
  KrillCranberryMintSeedMilk,
  CopepodCranberryMintSeedMilk,
  AmphipodCranberryMintSeedMilk,
  IsopodCranberryMintSeedMilk,
  OstracodCranberryMintSeedMilk,
  CladoceranCranberryMintSeedMilk,
  RotiferCranberryMintSeedMilk,
  TardigradeCranberryMintSeedMilk,
  NematodeCranberryMintSeedMilk,
  AnnelidCranberryMintSeedMilk,
  PolychaeteCranberryMintSeedMilk,
  OligochaeteCranberryMintSeedMilk,
  HirudineanCranberryMintSeedMilk,
  LeechCranberryMintSeedMilk,
  EarthwormCranberryMintSeedMilk,
  MarineWormCranberryMintSeedMilk,
  TubeWormCranberryMintSeedMilk,
  FanWormCranberryMintSeedMilk,
  FeatherDusterWormCranberryMintSeedMilk,
  ChristmasTreeWormCranberryMintSeedMilk,
  PompeiiWormCranberryMintSeedMilk,
  GiantTubewormCranberryMintSeedMilk,
  VestimentiferanCranberryMintSeedMilk,
  SiboglinidCranberryMintSeedMilk,
  PogonophoranCranberryMintSeedMilk,
  FrenulateCranberryMintSeedMilk,
  MoniliferanCranberryMintSeedMilk,
  EscarpiaCranberryMintSeedMilk,
  LamellibrachiaCranberryMintSeedMilk,
  RidgeiaCranberryMintSeedMilk,
  TevniaCranberryMintSeedMilk,
  OasisiaCranberryMintSeedMilk,
  EscarpiaCranberryMintSeedMilk2,
  LamellibrachiaCranberryMintSeedMilk2,
  RidgeiaCranberryMintSeedMilk2,
  TevniaCranberryMintSeedMilk2,
  OasisiaCranberryMintSeedMilk2,
  EscarpiaCranberryMintSeedMilk3,
  LamellibrachiaCranberryMintSeedMilk3,
  RidgeiaCranberryMintSeedMilk3,
  TevniaCranberryMintSeedMilk3,
  OasisiaCranberryMintSeedMilk3,
  EscarpiaCranberryMintSeedMilk4,
  LamellibrachiaCranberryMintSeedMilk4,
  RidgeiaCranberryMintSeedMilk4,
  TevniaCranberryMintSeedMilk4,
  OasisiaCranberryMintSeedMilk4,
  EscarpiaCranberryMintSeedMilk5,
  LamellibrachiaCranberryMintSeedMilk5,
  RidgeiaCranberryMintSeedMilk5,
  TevniaCranberryMintSeedMilk5,
  OasisiaCranberryMintSeedMilk5,
  EscarpiaCranberryMintSeedMilk6,
  LamellibrachiaCranberryMintSeedMilk6,
  RidgeiaCranberryMintSeedMilk6,
  TevniaCranberryMintSeedMilk6,
  OasisiaCranberryMintSeedMilk6,
  EscarpiaCranberryMintSeedMilk7,
  LamellibrachiaCranberryMintSeedMilk7,
  RidgeiaCranberryMintSeedMilk7,
  TevniaCranberryMintSeedMilk7,
  OasisiaCranberryMintSeedMilk7,
  EscarpiaCranberryMintSeedMilk8,
  LamellibrachiaCranberryMintSeedMilk8,
  RidgeiaCranberryMintSeedMilk8,
  TevniaCranberryMintSeedMilk8,
  OasisiaCranberryMintSeedMilk8,
  EscarpiaCranberryMintSeedMilk9,
  LamellibrachiaCranberryMintSeedMilk9,
  RidgeiaCranberryMintSeedMilk9,
  TevniaCranberryMintSeedMilk9,
  OasisiaCranberryMintSeedMilk9,
  EscarpiaCranberryMintSeedMilk10,
  LamellibrachiaCranberryMintSeedMilk10,
  RidgeiaCranberryMintSeedMilk10,
  TevniaCranberryMintSeedMilk10,
  OasisiaCranberryMintSeedMilk10,
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

const ScholarshipNew = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showNewApplicationModal, setShowNewApplicationModal] = useState(false);
  const [showApplicationDetailsModal, setShowApplicationDetailsModal] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [scholarshipType, setScholarshipType] = useState('undergraduate');
  const [university, setUniversity] = useState('');
  const [department, setDepartment] = useState('');
  const [gpa, setGpa] = useState('');
  const [familyIncome, setFamilyIncome] = useState('');
  const [motivation, setMotivation] = useState('');

  // Mock data
  const applications = [
    {
      id: 1,
      applicantName: 'Ahmet Yılmaz',
      applicantEmail: 'ahmet.yilmaz@email.com',
      applicantPhone: '+90 532 123 4567',
      scholarshipType: 'undergraduate',
      university: 'İstanbul Üniversitesi',
      department: 'Tıp Fakültesi',
      gpa: 3.85,
      familyIncome: 25000,
      motivation: 'Tıp alanında uzmanlaşmak ve topluma hizmet etmek istiyorum.',
      status: 'pending',
      applicationDate: '2024-01-15T10:30:00',
      documents: [
        { name: 'Transkript.pdf', status: 'uploaded' },
        { name: 'Referans Mektubu.pdf', status: 'uploaded' },
        { name: 'Motivasyon Mektubu.pdf', status: 'pending' }
      ],
      reviewer: 'Fatma Demir',
      reviewDate: null,
      comments: '',
      amount: 50000
    },
    {
      id: 2,
      applicantName: 'Fatma Demir',
      applicantEmail: 'fatma.demir@email.com',
      applicantPhone: '+90 533 987 6543',
      scholarshipType: 'graduate',
      university: 'Ankara Üniversitesi',
      department: 'Hukuk Fakültesi',
      gpa: 3.92,
      familyIncome: 18000,
      motivation: 'Hukuk alanında araştırma yapmak ve akademik kariyer hedefliyorum.',
      status: 'approved',
      applicationDate: '2024-01-10T14:15:00',
      documents: [
        { name: 'Transkript.pdf', status: 'uploaded' },
        { name: 'Referans Mektubu.pdf', status: 'uploaded' },
        { name: 'Motivasyon Mektubu.pdf', status: 'uploaded' }
      ],
      reviewer: 'Mehmet Kaya',
      reviewDate: '2024-01-12T16:45:00',
      comments: 'Mükemmel akademik performans ve güçlü motivasyon.',
      amount: 75000
    },
    {
      id: 3,
      applicantName: 'Mehmet Kaya',
      applicantEmail: 'mehmet.kaya@email.com',
      applicantPhone: '+90 534 456 7890',
      scholarshipType: 'undergraduate',
      university: 'İzmir Üniversitesi',
      department: 'Mühendislik Fakültesi',
      gpa: 3.45,
      familyIncome: 22000,
      motivation: 'Mühendislik alanında yenilikçi projeler geliştirmek istiyorum.',
      status: 'rejected',
      applicationDate: '2024-01-08T09:20:00',
      documents: [
        { name: 'Transkript.pdf', status: 'uploaded' },
        { name: 'Referans Mektubu.pdf', status: 'missing' },
        { name: 'Motivasyon Mektubu.pdf', status: 'uploaded' }
      ],
      reviewer: 'Ayşe Özkan',
      reviewDate: '2024-01-11T11:30:00',
      comments: 'Referans mektubu eksik ve GPA yeterli değil.',
      amount: 40000
    },
    {
      id: 4,
      applicantName: 'Ayşe Özkan',
      applicantEmail: 'ayse.ozkan@email.com',
      applicantPhone: '+90 535 321 0987',
      scholarshipType: 'graduate',
      university: 'Bursa Üniversitesi',
      department: 'Eğitim Fakültesi',
      gpa: 3.78,
      familyIncome: 15000,
      motivation: 'Eğitim alanında araştırma yaparak öğretmenlik mesleğini geliştirmek istiyorum.',
      status: 'pending',
      applicationDate: '2024-01-12T13:45:00',
      documents: [
        { name: 'Transkript.pdf', status: 'uploaded' },
        { name: 'Referans Mektubu.pdf', status: 'uploaded' },
        { name: 'Motivasyon Mektubu.pdf', status: 'uploaded' }
      ],
      reviewer: 'Ali Çelik',
      reviewDate: null,
      comments: '',
      amount: 60000
    }
  ];

  const scholarshipTypes = [
    { id: 1, name: 'Lisans Bursu', type: 'undergraduate', amount: 50000, status: 'active' },
    { id: 2, name: 'Yüksek Lisans Bursu', type: 'graduate', amount: 75000, status: 'active' },
    { id: 3, name: 'Doktora Bursu', type: 'phd', amount: 100000, status: 'active' },
    { id: 4, name: 'Acil Durum Bursu', type: 'emergency', amount: 25000, status: 'active' }
  ];

  const applicationColumns = [
    {
      key: 'applicant',
      label: 'Başvuran',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-brand-600" />
          </div>
          <div className="flex-1">
            <div className="font-medium">{item.applicantName}</div>
            <div className="text-sm text-muted-500">{item.applicantEmail}</div>
          </div>
        </div>
      )
    },
    {
      key: 'scholarship',
      label: 'Burs Türü',
      render: (item) => {
        const typeConfig = {
          undergraduate: { label: 'Lisans', color: 'info' },
          graduate: { label: 'Yüksek Lisans', color: 'warning' },
          phd: { label: 'Doktora', color: 'danger' },
          emergency: { label: 'Acil', color: 'success' }
        };
        const config = typeConfig[item.scholarshipType];
        return <Badge variant={config.color}>{config.label}</Badge>;
      }
    },
    {
      key: 'university',
      label: 'Üniversite',
      render: (item) => (
        <div>
          <div className="font-medium">{item.university}</div>
          <div className="text-sm text-muted-500">{item.department}</div>
        </div>
      )
    },
    {
      key: 'academic',
      label: 'Akademik',
      render: (item) => (
        <div>
          <div className="font-medium">GPA: {item.gpa}</div>
          <div className="text-sm text-muted-500">Gelir: ₺{item.familyIncome.toLocaleString()}</div>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Burs Miktarı',
      render: (item) => (
        <div className="font-medium text-green-600">
          ₺{item.amount.toLocaleString()}
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
              setSelectedApplication(item);
              setShowApplicationDetailsModal(true);
            }}
          />
          <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} />
          <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} />
        </div>
      )
    }
  ];

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'applications' || 
                      (activeTab === 'pending' && application.status === 'pending') ||
                      (activeTab === 'approved' && application.status === 'approved') ||
                      (activeTab === 'rejected' && application.status === 'rejected');
    
    return matchesSearch && matchesTab;
  });

  const stats = [
    {
      title: 'Toplam Başvuru',
      value: applications.length,
      icon: FileText,
      color: 'brand'
    },
    {
      title: 'Bekleyen',
      value: applications.filter(a => a.status === 'pending').length,
      icon: Clock,
      color: 'warning'
    },
    {
      title: 'Onaylanan',
      value: applications.filter(a => a.status === 'approved').length,
      icon: Check,
      color: 'success'
    },
    {
      title: 'Reddedilen',
      value: applications.filter(a => a.status === 'rejected').length,
      icon: X,
      color: 'danger'
    }
  ];

  const handleCreateApplication = () => {
    // Mock application creation
    const newApplication = {
      id: applications.length + 1,
      applicantName,
      applicantEmail,
      applicantPhone,
      scholarshipType,
      university,
      department,
      gpa: parseFloat(gpa) || 0,
      familyIncome: parseFloat(familyIncome) || 0,
      motivation,
      status: 'pending',
      applicationDate: new Date().toISOString(),
      documents: [],
      reviewer: 'Atanacak',
      reviewDate: null,
      comments: '',
      amount: scholarshipTypes.find(st => st.type === scholarshipType)?.amount || 0
    };
    
    setShowNewApplicationModal(false);
    // In real app, this would be saved to database
  };

  return (
    <Page
      title="Burs Başvuruları"
      description="Burs başvuru ve değerlendirme sistemi"
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
            onClick={() => setShowNewApplicationModal(true)}
          >
            Yeni Başvuru
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
            <CardTitle>Başvuru Arama</CardTitle>
            <CardDescription>Burs başvurularını filtrelemek için arama yapın</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <Label htmlFor="search">Arama</Label>
                <Input
                  id="search"
                  placeholder="Başvuran adı, email veya üniversite ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Burs Başvuruları</CardTitle>
            <CardDescription>Toplam {filteredApplications.length} başvuru</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="applications">Tümü</TabsTrigger>
                <TabsTrigger value="pending">Bekleyen</TabsTrigger>
                <TabsTrigger value="approved">Onaylanan</TabsTrigger>
                <TabsTrigger value="rejected">Reddedilen</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="mt-6">
              <DataTable
                data={filteredApplications}
                columns={applicationColumns}
                pagination={true}
                itemsPerPage={10}
              />
            </div>
          </CardContent>
        </Card>

        {/* New Application Modal */}
        <Modal
          isOpen={showNewApplicationModal}
          onClose={() => setShowNewApplicationModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Yeni Burs Başvurusu</Modal.Title>
            <Modal.Description>
              Yeni bir burs başvurusu oluşturun
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input
                    id="name"
                    placeholder="Başvuran adı"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                  />
                </FormField>
                
                <FormField>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email adresi"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                  />
                </FormField>
              </div>
              
              <FormField>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Telefon numarası"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                />
              </FormField>
              
              <FormField>
                <Label htmlFor="type">Burs Türü</Label>
                <Select
                  id="type"
                  value={scholarshipType}
                  onChange={(e) => setScholarshipType(e.target.value)}
                  options={[
                    { value: 'undergraduate', label: 'Lisans' },
                    { value: 'graduate', label: 'Yüksek Lisans' },
                    { value: 'phd', label: 'Doktora' },
                    { value: 'emergency', label: 'Acil Durum' }
                  ]}
                />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <Label htmlFor="university">Üniversite</Label>
                  <Input
                    id="university"
                    placeholder="Üniversite adı"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                  />
                </FormField>
                
                <FormField>
                  <Label htmlFor="department">Bölüm</Label>
                  <Input
                    id="department"
                    placeholder="Bölüm adı"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <Label htmlFor="gpa">GPA</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    placeholder="4.00 üzerinden"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                  />
                </FormField>
                
                <FormField>
                  <Label htmlFor="income">Aile Geliri (₺)</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="Yıllık gelir"
                    value={familyIncome}
                    onChange={(e) => setFamilyIncome(e.target.value)}
                  />
                </FormField>
              </div>
              
              <FormField>
                <Label htmlFor="motivation">Motivasyon Mektubu</Label>
                <textarea
                  id="motivation"
                  className="w-full p-3 border rounded-md resize-none"
                  rows={4}
                  placeholder="Burs başvuru motivasyonunuzu yazın..."
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                />
              </FormField>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowNewApplicationModal(false)}>
              İptal
            </Button>
            <Button variant="primary" onClick={handleCreateApplication}>
              Başvuru Oluştur
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Application Details Modal */}
        <Modal
          isOpen={showApplicationDetailsModal}
          onClose={() => setShowApplicationDetailsModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>{selectedApplication?.applicantName} - Burs Başvurusu</Modal.Title>
            <Modal.Description>
              Başvuru detayları ve değerlendirme bilgileri
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            {selectedApplication && (
              <div className="space-y-6">
                {/* Applicant Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-500">{selectedApplication.applicantEmail}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Telefon</Label>
                    <p className="text-sm text-muted-500">{selectedApplication.applicantPhone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Üniversite</Label>
                    <p className="text-sm text-muted-500">{selectedApplication.university}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Bölüm</Label>
                    <p className="text-sm text-muted-500">{selectedApplication.department}</p>
                  </div>
                </div>
                
                {/* Academic Info */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedApplication.gpa}
                    </div>
                    <div className="text-sm text-muted-500">GPA</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ₺{selectedApplication.familyIncome.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-500">Aile Geliri</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      ₺{selectedApplication.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-500">Burs Miktarı</div>
                  </div>
                </div>
                
                {/* Motivation */}
                <div>
                  <Label className="text-sm font-medium">Motivasyon Mektubu</Label>
                  <p className="text-sm text-muted-500 mt-1">{selectedApplication.motivation}</p>
                </div>
                
                {/* Documents */}
                <div>
                  <Label className="text-sm font-medium">Belgeler ({selectedApplication.documents.length})</Label>
                  <div className="mt-2 space-y-2">
                    {selectedApplication.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4" />
                          <span className="text-sm">{doc.name}</span>
                        </div>
                        <StatusBadge status={doc.status} />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Review Info */}
                <div>
                  <Label className="text-sm font-medium">Değerlendirme</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Değerlendirici:</span>
                      <span className="text-sm font-medium">{selectedApplication.reviewer}</span>
                    </div>
                    {selectedApplication.reviewDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Değerlendirme Tarihi:</span>
                        <span className="text-sm font-medium">
                          {new Date(selectedApplication.reviewDate).toLocaleString('tr-TR')}
                        </span>
                      </div>
                    )}
                    {selectedApplication.comments && (
                      <div>
                        <span className="text-sm">Yorumlar:</span>
                        <p className="text-sm text-muted-500 mt-1">{selectedApplication.comments}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowApplicationDetailsModal(false)}>
              Kapat
            </Button>
            <Button variant="primary" icon={<Check className="w-4 h-4" />}>
              Onayla
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Page>
  );
};

export default ScholarshipNew;
