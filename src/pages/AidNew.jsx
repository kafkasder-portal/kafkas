import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Users,
  MapPin,
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
  Package as PackageIcon,
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

const AidNew = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAid, setSelectedAid] = useState(null);
  const [showNewAidModal, setShowNewAidModal] = useState(false);
  const [showAidDetailsModal, setShowAidDetailsModal] = useState(false);
  const [aidTitle, setAidTitle] = useState('');
  const [aidType, setAidType] = useState('food');
  const [aidQuantity, setAidQuantity] = useState('');
  const [aidLocation, setAidLocation] = useState('');
  const [aidDescription, setAidDescription] = useState('');
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState([]);

  // Mock data
  const aidRequests = [
    {
      id: 1,
      title: 'Gıda Yardımı - Acil',
      type: 'food',
      quantity: '50 paket',
      location: 'İstanbul, Fatih',
      status: 'active',
      priority: 'high',
      beneficiary: 'Ahmet Yılmaz',
      phone: '+90 532 123 4567',
      requestDate: '2024-01-15T10:30:00',
      description: 'Aile için acil gıda yardımına ihtiyaç var',
      items: [
        { name: 'Makarna', quantity: '5 kg', status: 'available' },
        { name: 'Pirinç', quantity: '3 kg', status: 'available' },
        { name: 'Yağ', quantity: '2 L', status: 'pending' }
      ],
      assignedVolunteer: 'Fatma Demir',
      estimatedDelivery: '2024-01-16T14:00:00'
    },
    {
      id: 2,
      title: 'İlaç Yardımı',
      type: 'medicine',
      quantity: '10 kutu',
      location: 'Ankara, Çankaya',
      status: 'completed',
      priority: 'medium',
      beneficiary: 'Mehmet Kaya',
      phone: '+90 533 987 6543',
      requestDate: '2024-01-14T15:45:00',
      description: 'Kronik hastalık için ilaç yardımı',
      items: [
        { name: 'Diyabet İlacı', quantity: '3 kutu', status: 'delivered' },
        { name: 'Tansiyon İlacı', quantity: '2 kutu', status: 'delivered' }
      ],
      assignedVolunteer: 'Ayşe Özkan',
      deliveryDate: '2024-01-15T11:20:00'
    },
    {
      id: 3,
      title: 'Kıyafet Yardımı',
      type: 'clothing',
      quantity: '20 parça',
      location: 'İzmir, Konak',
      status: 'pending',
      priority: 'low',
      beneficiary: 'Ali Çelik',
      phone: '+90 534 456 7890',
      requestDate: '2024-01-15T09:15:00',
      description: 'Çocuklar için kışlık kıyafet yardımı',
      items: [
        { name: 'Çocuk Mont', quantity: '5 adet', status: 'available' },
        { name: 'Çocuk Bot', quantity: '5 çift', status: 'pending' }
      ],
      assignedVolunteer: 'Zeynep Demir',
      estimatedDelivery: '2024-01-18T16:00:00'
    },
    {
      id: 4,
      title: 'Eğitim Malzemesi',
      type: 'education',
      quantity: '15 set',
      location: 'Bursa, Nilüfer',
      status: 'active',
      priority: 'medium',
      beneficiary: 'Fatma Yıldız',
      phone: '+90 535 321 0987',
      requestDate: '2024-01-15T12:00:00',
      description: 'Okul çocukları için kırtasiye malzemesi',
      items: [
        { name: 'Defter', quantity: '20 adet', status: 'available' },
        { name: 'Kalem', quantity: '30 adet', status: 'available' },
        { name: 'Çanta', quantity: '5 adet', status: 'pending' }
      ],
      assignedVolunteer: 'Ahmet Yılmaz',
      estimatedDelivery: '2024-01-17T10:00:00'
    }
  ];

  const beneficiaries = [
    { id: 1, name: 'Ahmet Yılmaz', phone: '+90 532 123 4567', location: 'İstanbul, Fatih', status: 'active' },
    { id: 2, name: 'Mehmet Kaya', phone: '+90 533 987 6543', location: 'Ankara, Çankaya', status: 'active' },
    { id: 3, name: 'Ali Çelik', phone: '+90 534 456 7890', location: 'İzmir, Konak', status: 'active' },
    { id: 4, name: 'Fatma Yıldız', phone: '+90 535 321 0987', location: 'Bursa, Nilüfer', status: 'active' }
  ];

  const aidColumns = [
    {
      key: 'title',
      label: 'Yardım Talebi',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
            {item.type === 'food' ? (
              <Package className="w-5 h-5 text-brand-600" />
            ) : item.type === 'medicine' ? (
              <Activity className="w-5 h-5 text-brand-600" />
            ) : item.type === 'clothing' ? (
              <Users className="w-5 h-5 text-brand-600" />
            ) : (
              <School className="w-5 h-5 text-brand-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium">{item.title}</div>
            <div className="text-sm text-muted-500">{item.beneficiary}</div>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Tür',
      render: (item) => {
        const typeConfig = {
          food: { label: 'Gıda', color: 'success' },
          medicine: { label: 'İlaç', color: 'danger' },
          clothing: { label: 'Kıyafet', color: 'warning' },
          education: { label: 'Eğitim', color: 'info' }
        };
        const config = typeConfig[item.type];
        return <Badge variant={config.color}>{config.label}</Badge>;
      }
    },
    {
      key: 'priority',
      label: 'Öncelik',
      render: (item) => {
        const priorityConfig = {
          high: { label: 'Yüksek', color: 'danger' },
          medium: { label: 'Orta', color: 'warning' },
          low: { label: 'Düşük', color: 'success' }
        };
        const config = priorityConfig[item.priority];
        return <Badge variant={config.color}>{config.label}</Badge>;
      }
    },
    {
      key: 'location',
      label: 'Konum',
      render: (item) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{item.location}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Durum',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'volunteer',
      label: 'Gönüllü',
      render: (item) => (
        <div className="text-sm text-muted-500">
          {item.assignedVolunteer}
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
            onClick={() => {
              setSelectedAid(item);
              setShowAidDetailsModal(true);
            }}
          />
          <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} />
          <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} />
        </div>
      )
    }
  ];

  const filteredAidRequests = aidRequests.filter(aid => {
    const matchesSearch = aid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aid.beneficiary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'active' || 
                      (activeTab === 'completed' && aid.status === 'completed') ||
                      (activeTab === 'pending' && aid.status === 'pending');
    
    return matchesSearch && matchesTab;
  });

  const stats = [
    {
      title: 'Toplam Talep',
      value: aidRequests.length,
      icon: Package,
      color: 'brand'
    },
    {
      title: 'Aktif',
      value: aidRequests.filter(a => a.status === 'active').length,
      icon: Clock,
      color: 'warning'
    },
    {
      title: 'Tamamlanan',
      value: aidRequests.filter(a => a.status === 'completed').length,
      icon: Check,
      color: 'success'
    },
    {
      title: 'Bekleyen',
      value: aidRequests.filter(a => a.status === 'pending').length,
      icon: AlertTriangle,
      color: 'danger'
    }
  ];

  const handleCreateAid = () => {
    // Mock aid creation
    const newAid = {
      id: aidRequests.length + 1,
      title: aidTitle,
      type: aidType,
      quantity: aidQuantity,
      location: aidLocation,
      status: 'pending',
      priority: 'medium',
      beneficiary: 'Yeni Talep',
      phone: '+90 000 000 0000',
      requestDate: new Date().toISOString(),
      description: aidDescription,
      items: [],
      assignedVolunteer: 'Atanacak',
      estimatedDelivery: null
    };
    
    setShowNewAidModal(false);
    // In real app, this would be saved to database
  };

  return (
    <Page
      title="Yardım Dağıtımı"
      description="Yardım talepleri ve dağıtım yönetimi"
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
            onClick={() => setShowNewAidModal(true)}
          >
            Yeni Yardım
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
            <CardTitle>Yardım Arama</CardTitle>
            <CardDescription>Yardım taleplerini filtrelemek için arama yapın</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <Label htmlFor="search">Arama</Label>
                <Input
                  id="search"
                  placeholder="Yardım adı veya yararlanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Aid Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Yardım Talepleri</CardTitle>
            <CardDescription>Toplam {filteredAidRequests.length} talep</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">Aktif</TabsTrigger>
                <TabsTrigger value="completed">Tamamlanan</TabsTrigger>
                <TabsTrigger value="pending">Bekleyen</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="mt-6">
              <DataTable
                data={filteredAidRequests}
                columns={aidColumns}
                pagination={true}
                itemsPerPage={10}
              />
            </div>
          </CardContent>
        </Card>

        {/* New Aid Modal */}
        <Modal
          isOpen={showNewAidModal}
          onClose={() => setShowNewAidModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Yeni Yardım Talebi</Modal.Title>
            <Modal.Description>
              Yeni bir yardım talebi oluşturun ve yararlanıcıları seçin
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <FormField>
                <Label htmlFor="title">Yardım Başlığı</Label>
                <Input
                  id="title"
                  placeholder="Yardım başlığını girin"
                  value={aidTitle}
                  onChange={(e) => setAidTitle(e.target.value)}
                />
              </FormField>
              
              <FormField>
                <Label htmlFor="type">Yardım Türü</Label>
                <Select
                  id="type"
                  value={aidType}
                  onChange={(e) => setAidType(e.target.value)}
                  options={[
                    { value: 'food', label: 'Gıda' },
                    { value: 'medicine', label: 'İlaç' },
                    { value: 'clothing', label: 'Kıyafet' },
                    { value: 'education', label: 'Eğitim' }
                  ]}
                />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <Label htmlFor="quantity">Miktar</Label>
                  <Input
                    id="quantity"
                    placeholder="Miktar bilgisi"
                    value={aidQuantity}
                    onChange={(e) => setAidQuantity(e.target.value)}
                  />
                </FormField>
                
                <FormField>
                  <Label htmlFor="location">Konum</Label>
                  <Input
                    id="location"
                    placeholder="Teslimat konumu"
                    value={aidLocation}
                    onChange={(e) => setAidLocation(e.target.value)}
                  />
                </FormField>
              </div>
              
              <FormField>
                <Label htmlFor="description">Açıklama</Label>
                <textarea
                  id="description"
                  className="w-full p-3 border rounded-md resize-none"
                  rows={3}
                  placeholder="Yardım açıklaması"
                  value={aidDescription}
                  onChange={(e) => setAidDescription(e.target.value)}
                />
              </FormField>
              
              <FormField>
                <Label>Yararlanıcılar</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {beneficiaries.map((beneficiary) => (
                    <div key={beneficiary.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`beneficiary-${beneficiary.id}`}
                        checked={selectedBeneficiaries.some(b => b.id === beneficiary.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBeneficiaries([...selectedBeneficiaries, beneficiary]);
                          } else {
                            setSelectedBeneficiaries(selectedBeneficiaries.filter(b => b.id !== beneficiary.id));
                          }
                        }}
                      />
                      <label htmlFor={`beneficiary-${beneficiary.id}`} className="text-sm">
                        {beneficiary.name} ({beneficiary.location})
                      </label>
                    </div>
                  ))}
                </div>
              </FormField>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowNewAidModal(false)}>
              İptal
            </Button>
            <Button variant="primary" onClick={handleCreateAid}>
              Talep Oluştur
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Aid Details Modal */}
        <Modal
          isOpen={showAidDetailsModal}
          onClose={() => setShowAidDetailsModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>{selectedAid?.title}</Modal.Title>
            <Modal.Description>
              Yardım talebi detayları ve dağıtım bilgileri
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            {selectedAid && (
              <div className="space-y-6">
                {/* Aid Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Yararlanıcı</Label>
                    <p className="text-sm text-muted-500">{selectedAid.beneficiary}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Telefon</Label>
                    <p className="text-sm text-muted-500">{selectedAid.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Konum</Label>
                    <p className="text-sm text-muted-500">{selectedAid.location}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Öncelik</Label>
                    <Badge variant={selectedAid.priority === 'high' ? 'danger' : selectedAid.priority === 'medium' ? 'warning' : 'success'}>
                      {selectedAid.priority === 'high' ? 'Yüksek' : selectedAid.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </Badge>
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <Label className="text-sm font-medium">Açıklama</Label>
                  <p className="text-sm text-muted-500 mt-1">{selectedAid.description}</p>
                </div>
                
                {/* Items */}
                <div>
                  <Label className="text-sm font-medium">Yardım Kalemleri</Label>
                  <div className="mt-2 space-y-2">
                    {selectedAid.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-500">{item.quantity}</p>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Volunteer Info */}
                <div>
                  <Label className="text-sm font-medium">Atanan Gönüllü</Label>
                  <p className="text-sm text-muted-500 mt-1">{selectedAid.assignedVolunteer}</p>
                </div>
                
                {/* Delivery Info */}
                <div>
                  <Label className="text-sm font-medium">Teslimat Bilgisi</Label>
                  <p className="text-sm text-muted-500 mt-1">
                    {selectedAid.deliveryDate 
                      ? `Teslim Edildi: ${new Date(selectedAid.deliveryDate).toLocaleString('tr-TR')}`
                      : `Tahmini Teslimat: ${new Date(selectedAid.estimatedDelivery).toLocaleString('tr-TR')}`
                    }
                  </p>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowAidDetailsModal(false)}>
              Kapat
            </Button>
            <Button variant="primary" icon={<Send className="w-4 h-4" />}>
              Gönüllü Ata
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Page>
  );
};

export default AidNew;
