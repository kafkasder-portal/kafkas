import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
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

const FundNew = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFund, setSelectedFund] = useState(null);
  const [showNewFundModal, setShowNewFundModal] = useState(false);
  const [showFundDetailsModal, setShowFundDetailsModal] = useState(false);
  const [fundName, setFundName] = useState('');
  const [fundType, setFundType] = useState('general');
  const [fundAmount, setFundAmount] = useState('');
  const [fundDescription, setFundDescription] = useState('');
  const [selectedDonors, setSelectedDonors] = useState([]);

  // Mock data
  const funds = [
    {
      id: 1,
      name: 'Acil Yardım Fonu',
      type: 'emergency',
      totalAmount: 150000,
      currentBalance: 125000,
      targetAmount: 200000,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      description: 'Acil durumlar için ayrılan özel fon',
      donors: [
        { name: 'Ahmet Yılmaz', amount: 50000, date: '2024-01-15' },
        { name: 'Fatma Demir', amount: 30000, date: '2024-01-10' },
        { name: 'Mehmet Kaya', amount: 25000, date: '2024-01-05' }
      ],
      expenses: [
        { description: 'Deprem yardımı', amount: 15000, date: '2024-01-20' },
        { description: 'Sel yardımı', amount: 10000, date: '2024-01-18' }
      ],
      manager: 'Ahmet Yılmaz',
      progress: 75
    },
    {
      id: 2,
      name: 'Eğitim Fonu',
      type: 'education',
      totalAmount: 80000,
      currentBalance: 45000,
      targetAmount: 100000,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      description: 'Eğitim projeleri için ayrılan fon',
      donors: [
        { name: 'Ayşe Özkan', amount: 40000, date: '2024-01-12' },
        { name: 'Ali Çelik', amount: 20000, date: '2024-01-08' },
        { name: 'Zeynep Demir', amount: 20000, date: '2024-01-03' }
      ],
      expenses: [
        { description: 'Burs ödemeleri', amount: 25000, date: '2024-01-15' },
        { description: 'Kitap alımı', amount: 10000, date: '2024-01-10' }
      ],
      manager: 'Fatma Demir',
      progress: 80
    },
    {
      id: 3,
      name: 'Sağlık Fonu',
      type: 'health',
      totalAmount: 120000,
      currentBalance: 95000,
      targetAmount: 150000,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      description: 'Sağlık hizmetleri için ayrılan fon',
      donors: [
        { name: 'Mehmet Kaya', amount: 60000, date: '2024-01-14' },
        { name: 'Ahmet Yılmaz', amount: 40000, date: '2024-01-09' },
        { name: 'Fatma Demir', amount: 20000, date: '2024-01-04' }
      ],
      expenses: [
        { description: 'İlaç alımı', amount: 15000, date: '2024-01-16' },
        { description: 'Tıbbi ekipman', amount: 10000, date: '2024-01-12' }
      ],
      manager: 'Mehmet Kaya',
      progress: 80
    },
    {
      id: 4,
      name: 'Gıda Yardım Fonu',
      type: 'food',
      totalAmount: 90000,
      currentBalance: 30000,
      targetAmount: 100000,
      status: 'completed',
      startDate: '2023-06-01',
      endDate: '2023-12-31',
      description: 'Gıda yardımı projeleri için ayrılan fon',
      donors: [
        { name: 'Ali Çelik', amount: 50000, date: '2023-06-15' },
        { name: 'Ayşe Özkan', amount: 30000, date: '2023-06-10' },
        { name: 'Zeynep Demir', amount: 10000, date: '2023-06-05' }
      ],
      expenses: [
        { description: 'Gıda paketi alımı', amount: 40000, date: '2023-12-20' },
        { description: 'Nakliye giderleri', amount: 20000, date: '2023-12-15' }
      ],
      manager: 'Ali Çelik',
      progress: 100
    }
  ];

  const donors = [
    { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', totalDonated: 150000, status: 'active' },
    { id: 2, name: 'Fatma Demir', email: 'fatma@example.com', totalDonated: 80000, status: 'active' },
    { id: 3, name: 'Mehmet Kaya', email: 'mehmet@example.com', totalDonated: 120000, status: 'active' },
    { id: 4, name: 'Ayşe Özkan', email: 'ayse@example.com', totalDonated: 90000, status: 'active' },
    { id: 5, name: 'Ali Çelik', email: 'ali@example.com', totalDonated: 70000, status: 'active' }
  ];

  const fundColumns = [
    {
      key: 'name',
      label: 'Fon',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
            {item.type === 'emergency' ? (
              <AlertTriangle className="w-5 h-5 text-brand-600" />
            ) : item.type === 'education' ? (
              <School className="w-5 h-5 text-brand-600" />
            ) : item.type === 'health' ? (
              <Activity className="w-5 h-5 text-brand-600" />
            ) : (
              <Package className="w-5 h-5 text-brand-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-muted-500">{item.manager}</div>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Tür',
      render: (item) => {
        const typeConfig = {
          emergency: { label: 'Acil', color: 'danger' },
          education: { label: 'Eğitim', color: 'info' },
          health: { label: 'Sağlık', color: 'success' },
          food: { label: 'Gıda', color: 'warning' },
          general: { label: 'Genel', color: 'brand' }
        };
        const config = typeConfig[item.type];
        return <Badge variant={config.color}>{config.label}</Badge>;
      }
    },
    {
      key: 'amount',
      label: 'Miktar',
      render: (item) => (
        <div>
          <div className="font-medium">₺{item.currentBalance.toLocaleString()}</div>
          <div className="text-sm text-muted-500">
            Hedef: ₺{item.targetAmount.toLocaleString()}
          </div>
        </div>
      )
    },
    {
      key: 'progress',
      label: 'İlerleme',
      render: (item) => (
        <div className="w-full">
          <div className="flex justify-between text-sm mb-1">
            <span>{item.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-brand-500 h-2 rounded-full" 
              style={{ width: `${item.progress}%` }}
            ></div>
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
      key: 'actions',
      label: 'İşlemler',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<Eye className="w-4 h-4" />}
            onClick={() => {
              setSelectedFund(item);
              setShowFundDetailsModal(true);
            }}
          />
          <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} />
          <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} />
        </div>
      )
    }
  ];

  const filteredFunds = funds.filter(fund => {
    const matchesSearch = fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fund.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'overview' || 
                      (activeTab === 'active' && fund.status === 'active') ||
                      (activeTab === 'completed' && fund.status === 'completed');
    
    return matchesSearch && matchesTab;
  });

  const stats = [
    {
      title: 'Toplam Fon',
      value: funds.length,
      icon: DollarSign,
      color: 'brand'
    },
    {
      title: 'Toplam Bakiye',
      value: `₺${funds.reduce((sum, fund) => sum + fund.currentBalance, 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'success'
    },
    {
      title: 'Toplam Hedef',
      value: `₺${funds.reduce((sum, fund) => sum + fund.targetAmount, 0).toLocaleString()}`,
      icon: Target,
      color: 'warning'
    },
    {
      title: 'Aktif Fon',
      value: funds.filter(f => f.status === 'active').length,
      icon: Activity,
      color: 'info'
    }
  ];

  const handleCreateFund = () => {
    // Mock fund creation
    const newFund = {
      id: funds.length + 1,
      name: fundName,
      type: fundType,
      totalAmount: 0,
      currentBalance: 0,
      targetAmount: parseFloat(fundAmount) || 0,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2024-12-31',
      description: fundDescription,
      donors: [],
      expenses: [],
      manager: 'Ahmet Yılmaz',
      progress: 0
    };
    
    setShowNewFundModal(false);
    // In real app, this would be saved to database
  };

  return (
    <Page
      title="Fon Yönetimi"
      description="Fon oluşturma ve takip sistemi"
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
            onClick={() => setShowNewFundModal(true)}
          >
            Yeni Fon
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
            <CardTitle>Fon Arama</CardTitle>
            <CardDescription>Fonları filtrelemek için arama yapın</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <Label htmlFor="search">Arama</Label>
                <Input
                  id="search"
                  placeholder="Fon adı veya yönetici ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Funds List */}
        <Card>
          <CardHeader>
            <CardTitle>Fon Listesi</CardTitle>
            <CardDescription>Toplam {filteredFunds.length} fon</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
                <TabsTrigger value="active">Aktif</TabsTrigger>
                <TabsTrigger value="completed">Tamamlanan</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="mt-6">
              <DataTable
                data={filteredFunds}
                columns={fundColumns}
                pagination={true}
                itemsPerPage={10}
              />
            </div>
          </CardContent>
        </Card>

        {/* New Fund Modal */}
        <Modal
          isOpen={showNewFundModal}
          onClose={() => setShowNewFundModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Yeni Fon Oluştur</Modal.Title>
            <Modal.Description>
              Yeni bir fon oluşturun ve hedef belirleyin
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <FormField>
                <Label htmlFor="name">Fon Adı</Label>
                <Input
                  id="name"
                  placeholder="Fon adını girin"
                  value={fundName}
                  onChange={(e) => setFundName(e.target.value)}
                />
              </FormField>
              
              <FormField>
                <Label htmlFor="type">Fon Türü</Label>
                <Select
                  id="type"
                  value={fundType}
                  onChange={(e) => setFundType(e.target.value)}
                  options={[
                    { value: 'general', label: 'Genel' },
                    { value: 'emergency', label: 'Acil' },
                    { value: 'education', label: 'Eğitim' },
                    { value: 'health', label: 'Sağlık' },
                    { value: 'food', label: 'Gıda' }
                  ]}
                />
              </FormField>
              
              <FormField>
                <Label htmlFor="amount">Hedef Miktar (₺)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Hedef miktarı girin"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                />
              </FormField>
              
              <FormField>
                <Label htmlFor="description">Açıklama</Label>
                <textarea
                  id="description"
                  className="w-full p-3 border rounded-md resize-none"
                  rows={3}
                  placeholder="Fon açıklaması"
                  value={fundDescription}
                  onChange={(e) => setFundDescription(e.target.value)}
                />
              </FormField>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowNewFundModal(false)}>
              İptal
            </Button>
            <Button variant="primary" onClick={handleCreateFund}>
              Fon Oluştur
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Fund Details Modal */}
        <Modal
          isOpen={showFundDetailsModal}
          onClose={() => setShowFundDetailsModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>{selectedFund?.name}</Modal.Title>
            <Modal.Description>
              Fon detayları ve finansal bilgiler
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            {selectedFund && (
              <div className="space-y-6">
                {/* Fund Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Yönetici</Label>
                    <p className="text-sm text-muted-500">{selectedFund.manager}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Durum</Label>
                    <StatusBadge status={selectedFund.status} />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Başlangıç</Label>
                    <p className="text-sm text-muted-500">{selectedFund.startDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Bitiş</Label>
                    <p className="text-sm text-muted-500">{selectedFund.endDate}</p>
                  </div>
                </div>
                
                {/* Financial Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ₺{selectedFund.currentBalance.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-500">Mevcut Bakiye</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      ₺{selectedFund.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-500">Toplam Bağış</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      ₺{selectedFund.targetAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-500">Hedef</div>
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <Label className="text-sm font-medium">Açıklama</Label>
                  <p className="text-sm text-muted-500 mt-1">{selectedFund.description}</p>
                </div>
                
                {/* Donors */}
                <div>
                  <Label className="text-sm font-medium">Bağışçılar ({selectedFund.donors.length})</Label>
                  <div className="mt-2 space-y-2">
                    {selectedFund.donors.map((donor, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">{donor.name}</p>
                          <p className="text-xs text-muted-500">{donor.date}</p>
                        </div>
                        <div className="text-sm font-medium text-green-600">
                          ₺{donor.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Expenses */}
                <div>
                  <Label className="text-sm font-medium">Giderler ({selectedFund.expenses.length})</Label>
                  <div className="mt-2 space-y-2">
                    {selectedFund.expenses.map((expense, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">{expense.description}</p>
                          <p className="text-xs text-muted-500">{expense.date}</p>
                        </div>
                        <div className="text-sm font-medium text-red-600">
                          -₺{expense.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowFundDetailsModal(false)}>
              Kapat
            </Button>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              Bağış Ekle
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Page>
  );
};

export default FundNew;
