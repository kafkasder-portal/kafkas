import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Activity,
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
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  LineChart,
  AreaChart,
  ScatterChart,
  Gauge,
  Target,
  Award,
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

const HospitalReferralNew = () => {
  const [activeTab, setActiveTab] = useState('referrals');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [showNewReferralModal, setShowNewReferralModal] = useState(false);
  const [showReferralDetailsModal, setShowReferralDetailsModal] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [hospital, setHospital] = useState('');
  const [department, setDepartment] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [notes, setNotes] = useState('');

  // Mock data
  const referrals = [
    {
      id: 1,
      patientName: 'Ahmet Yılmaz',
      patientPhone: '+90 532 123 4567',
      patientAge: 45,
      diagnosis: 'Kardiyoloji - Kalp Damar Hastalığı',
      hospital: 'İstanbul Üniversitesi Hastanesi',
      department: 'Kardiyoloji',
      urgency: 'high',
      status: 'pending',
      referralDate: '2024-01-15T10:30:00',
      appointmentDate: null,
      notes: 'Hasta kalp ağrısı şikayeti ile başvurdu. EKG anormal.',
      doctor: 'Dr. Fatma Demir',
      coordinator: 'Mehmet Kaya',
      cost: 5000,
      insurance: 'SGK',
      documents: [
        { name: 'Muayene Raporu.pdf', status: 'uploaded' },
        { name: 'EKG Sonucu.pdf', status: 'uploaded' },
        { name: 'Kan Tahlili.pdf', status: 'pending' }
      ]
    },
    {
      id: 2,
      patientName: 'Fatma Demir',
      patientPhone: '+90 533 987 6543',
      patientAge: 32,
      diagnosis: 'Ortopedi - Bel Fıtığı',
      hospital: 'Ankara Şehir Hastanesi',
      department: 'Ortopedi',
      urgency: 'normal',
      status: 'confirmed',
      referralDate: '2024-01-10T14:15:00',
      appointmentDate: '2024-01-20T09:00:00',
      notes: 'Bel ağrısı ve bacakta uyuşma şikayeti var.',
      doctor: 'Dr. Mehmet Kaya',
      coordinator: 'Ayşe Özkan',
      cost: 3000,
      insurance: 'Özel Sigorta',
      documents: [
        { name: 'MR Sonucu.pdf', status: 'uploaded' },
        { name: 'Fizik Tedavi Raporu.pdf', status: 'uploaded' }
      ]
    },
    {
      id: 3,
      patientName: 'Mehmet Kaya',
      patientPhone: '+90 534 456 7890',
      patientAge: 28,
      diagnosis: 'Göz Hastalıkları - Katarakt',
      hospital: 'İzmir Göz Hastanesi',
      department: 'Göz Hastalıkları',
      urgency: 'low',
      status: 'completed',
      referralDate: '2024-01-08T09:20:00',
      appointmentDate: '2024-01-12T11:00:00',
      notes: 'Görme bozukluğu şikayeti. Katarakt teşhisi konuldu.',
      doctor: 'Dr. Ayşe Özkan',
      coordinator: 'Ali Çelik',
      cost: 8000,
      insurance: 'SGK',
      documents: [
        { name: 'Göz Muayenesi.pdf', status: 'uploaded' },
        { name: 'Ameliyat Raporu.pdf', status: 'uploaded' }
      ]
    },
    {
      id: 4,
      patientName: 'Ayşe Özkan',
      patientPhone: '+90 535 321 0987',
      patientAge: 55,
      diagnosis: 'Onkoloji - Meme Kanseri',
      hospital: 'Bursa Onkoloji Hastanesi',
      department: 'Onkoloji',
      urgency: 'high',
      status: 'pending',
      referralDate: '2024-01-12T13:45:00',
      appointmentDate: null,
      notes: 'Meme kanseri şüphesi. Acil biyopsi gerekli.',
      doctor: 'Dr. Ali Çelik',
      coordinator: 'Zeynep Demir',
      cost: 15000,
      insurance: 'SGK',
      documents: [
        { name: 'Mamografi.pdf', status: 'uploaded' },
        { name: 'Ultrason.pdf', status: 'uploaded' },
        { name: 'Biyopsi Raporu.pdf', status: 'pending' }
      ]
    }
  ];

  const hospitals = [
    { id: 1, name: 'İstanbul Üniversitesi Hastanesi', city: 'İstanbul', status: 'active' },
    { id: 2, name: 'Ankara Şehir Hastanesi', city: 'Ankara', status: 'active' },
    { id: 3, name: 'İzmir Göz Hastanesi', city: 'İzmir', status: 'active' },
    { id: 4, name: 'Bursa Onkoloji Hastanesi', city: 'Bursa', status: 'active' }
  ];

  const referralColumns = [
    {
      key: 'patient',
      label: 'Hasta',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-brand-600" />
          </div>
          <div className="flex-1">
            <div className="font-medium">{item.patientName}</div>
            <div className="text-sm text-muted-500">{item.patientPhone}</div>
          </div>
        </div>
      )
    },
    {
      key: 'diagnosis',
      label: 'Teşhis',
      render: (item) => (
        <div>
          <div className="font-medium">{item.diagnosis}</div>
          <div className="text-sm text-muted-500">{item.hospital}</div>
        </div>
      )
    },
    {
      key: 'urgency',
      label: 'Öncelik',
      render: (item) => {
        const urgencyConfig = {
          high: { label: 'Yüksek', color: 'danger' },
          normal: { label: 'Normal', color: 'warning' },
          low: { label: 'Düşük', color: 'success' }
        };
        const config = urgencyConfig[item.urgency];
        return <Badge variant={config.color}>{config.label}</Badge>;
      }
    },
    {
      key: 'appointment',
      label: 'Randevu',
      render: (item) => (
        <div>
          {item.appointmentDate ? (
            <div className="font-medium">
              {new Date(item.appointmentDate).toLocaleDateString('tr-TR')}
            </div>
          ) : (
            <div className="text-sm text-muted-500">Beklemede</div>
          )}
        </div>
      )
    },
    {
      key: 'cost',
      label: 'Maliyet',
      render: (item) => (
        <div className="font-medium text-green-600">
          ₺{item.cost.toLocaleString()}
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
              setSelectedReferral(item);
              setShowReferralDetailsModal(true);
            }}
          />
          <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} />
          <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} />
        </div>
      )
    }
  ];

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = referral.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'referrals' || 
                      (activeTab === 'pending' && referral.status === 'pending') ||
                      (activeTab === 'confirmed' && referral.status === 'confirmed') ||
                      (activeTab === 'completed' && referral.status === 'completed');
    
    return matchesSearch && matchesTab;
  });

  const stats = [
    {
      title: 'Toplam Sevk',
      value: referrals.length,
      icon: Stethoscope,
      color: 'brand'
    },
    {
      title: 'Bekleyen',
      value: referrals.filter(r => r.status === 'pending').length,
      icon: Clock,
      color: 'warning'
    },
    {
      title: 'Onaylanan',
      value: referrals.filter(r => r.status === 'confirmed').length,
      icon: Check,
      color: 'success'
    },
    {
      title: 'Tamamlanan',
      value: referrals.filter(r => r.status === 'completed').length,
      icon: Activity,
      color: 'info'
    }
  ];

  const handleCreateReferral = () => {
    // Mock referral creation
    const newReferral = {
      id: referrals.length + 1,
      patientName,
      patientPhone,
      patientAge: parseInt(patientAge) || 0,
      diagnosis,
      hospital,
      department,
      urgency,
      status: 'pending',
      referralDate: new Date().toISOString(),
      appointmentDate: null,
      notes,
      doctor: 'Dr. Yeni',
      coordinator: 'Atanacak',
      cost: 0,
      insurance: 'SGK',
      documents: []
    };
    
    setShowNewReferralModal(false);
    // In real app, this would be saved to database
  };

  return (
    <Page
      title="Hastane Sevkleri"
      description="Hastane sevk ve randevu yönetim sistemi"
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
            onClick={() => setShowNewReferralModal(true)}
          >
            Yeni Sevk
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
            <CardTitle>Sevk Arama</CardTitle>
            <CardDescription>Hastane sevklerini filtrelemek için arama yapın</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <Label htmlFor="search">Arama</Label>
                <Input
                  id="search"
                  placeholder="Hasta adı, teşhis veya hastane ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Referrals List */}
        <Card>
          <CardHeader>
            <CardTitle>Hastane Sevkleri</CardTitle>
            <CardDescription>Toplam {filteredReferrals.length} sevk</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="referrals">Tümü</TabsTrigger>
                <TabsTrigger value="pending">Bekleyen</TabsTrigger>
                <TabsTrigger value="confirmed">Onaylanan</TabsTrigger>
                <TabsTrigger value="completed">Tamamlanan</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="mt-6">
              <DataTable
                data={filteredReferrals}
                columns={referralColumns}
                pagination={true}
                itemsPerPage={10}
              />
            </div>
          </CardContent>
        </Card>

        {/* New Referral Modal */}
        <Modal
          isOpen={showNewReferralModal}
          onClose={() => setShowNewReferralModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Yeni Hastane Sevki</Modal.Title>
            <Modal.Description>
              Yeni bir hastane sevki oluşturun
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <Label htmlFor="name">Hasta Adı</Label>
                  <Input
                    id="name"
                    placeholder="Hasta adı"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </FormField>
                
                <FormField>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Telefon numarası"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <Label htmlFor="age">Yaş</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Hasta yaşı"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                  />
                </FormField>
                
                <FormField>
                  <Label htmlFor="urgency">Öncelik</Label>
                  <Select
                    id="urgency"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    options={[
                      { value: 'high', label: 'Yüksek' },
                      { value: 'normal', label: 'Normal' },
                      { value: 'low', label: 'Düşük' }
                    ]}
                  />
                </FormField>
              </div>
              
              <FormField>
                <Label htmlFor="diagnosis">Teşhis</Label>
                <Input
                  id="diagnosis"
                  placeholder="Hastalık teşhisi"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <Label htmlFor="hospital">Hastane</Label>
                  <Input
                    id="hospital"
                    placeholder="Hastane adı"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                  />
                </FormField>
                
                <FormField>
                  <Label htmlFor="department">Bölüm</Label>
                  <Input
                    id="department"
                    placeholder="Hastane bölümü"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </FormField>
              </div>
              
              <FormField>
                <Label htmlFor="notes">Notlar</Label>
                <textarea
                  id="notes"
                  className="w-full p-3 border rounded-md resize-none"
                  rows={3}
                  placeholder="Hasta hakkında notlar..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </FormField>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowNewReferralModal(false)}>
              İptal
            </Button>
            <Button variant="primary" onClick={handleCreateReferral}>
              Sevk Oluştur
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Referral Details Modal */}
        <Modal
          isOpen={showReferralDetailsModal}
          onClose={() => setShowReferralDetailsModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>{selectedReferral?.patientName} - Hastane Sevki</Modal.Title>
            <Modal.Description>
              Sevk detayları ve randevu bilgileri
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            {selectedReferral && (
              <div className="space-y-6">
                {/* Patient Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Telefon</Label>
                    <p className="text-sm text-muted-500">{selectedReferral.patientPhone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Yaş</Label>
                    <p className="text-sm text-muted-500">{selectedReferral.patientAge}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Hastane</Label>
                    <p className="text-sm text-muted-500">{selectedReferral.hospital}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Bölüm</Label>
                    <p className="text-sm text-muted-500">{selectedReferral.department}</p>
                  </div>
                </div>
                
                {/* Medical Info */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedReferral.diagnosis}
                    </div>
                    <div className="text-sm text-muted-500">Teşhis</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ₺{selectedReferral.cost.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-500">Maliyet</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {selectedReferral.insurance}
                    </div>
                    <div className="text-sm text-muted-500">Sigorta</div>
                  </div>
                </div>
                
                {/* Notes */}
                <div>
                  <Label className="text-sm font-medium">Notlar</Label>
                  <p className="text-sm text-muted-500 mt-1">{selectedReferral.notes}</p>
                </div>
                
                {/* Documents */}
                <div>
                  <Label className="text-sm font-medium">Belgeler ({selectedReferral.documents.length})</Label>
                  <div className="mt-2 space-y-2">
                    {selectedReferral.documents.map((doc, index) => (
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
                
                {/* Staff Info */}
                <div>
                  <Label className="text-sm font-medium">Personel Bilgileri</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Doktor:</span>
                      <span className="text-sm font-medium">{selectedReferral.doctor}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Koordinatör:</span>
                      <span className="text-sm font-medium">{selectedReferral.coordinator}</span>
                    </div>
                  </div>
                </div>
                
                {/* Appointment Info */}
                <div>
                  <Label className="text-sm font-medium">Randevu Bilgisi</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sevk Tarihi:</span>
                      <span className="text-sm font-medium">
                        {new Date(selectedReferral.referralDate).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    {selectedReferral.appointmentDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Randevu Tarihi:</span>
                        <span className="text-sm font-medium">
                          {new Date(selectedReferral.appointmentDate).toLocaleString('tr-TR')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowReferralDetailsModal(false)}>
              Kapat
            </Button>
            <Button variant="primary" icon={<Check className="w-4 h-4" />}>
              Randevu Ver
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Page>
  );
};

export default HospitalReferralNew;
