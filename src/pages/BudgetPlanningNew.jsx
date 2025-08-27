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

const BudgetPlanningNew = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showNewBudgetModal, setShowNewBudgetModal] = useState(false);
  const [showBudgetDetailsModal, setShowBudgetDetailsModal] = useState(false);
  const [budgetName, setBudgetName] = useState('');
  const [budgetType, setBudgetType] = useState('operational');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetPeriod, setBudgetPeriod] = useState('2024');
  const [budgetDescription, setBudgetDescription] = useState('');

  // Mock data
  const budgets = [
    {
      id: 1,
      name: '2024 Operasyonel Bütçe',
      type: 'operational',
      totalBudget: 500000,
      spentAmount: 320000,
      remainingAmount: 180000,
      period: '2024',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      description: '2024 yılı operasyonel giderler için ayrılan bütçe',
      categories: [
        { name: 'Personel Giderleri', budget: 200000, spent: 150000, remaining: 50000 },
        { name: 'Ofis Giderleri', budget: 100000, spent: 80000, remaining: 20000 },
        { name: 'Teknoloji Giderleri', budget: 80000, spent: 50000, remaining: 30000 },
        { name: 'Pazarlama Giderleri', budget: 70000, spent: 25000, remaining: 45000 },
        { name: 'Diğer Giderler', budget: 50000, spent: 15000, remaining: 35000 }
      ],
      manager: 'Ahmet Yılmaz',
      progress: 64
    },
    {
      id: 2,
      name: 'Proje Bütçesi - Eğitim',
      type: 'project',
      totalBudget: 200000,
      spentAmount: 120000,
      remainingAmount: 80000,
      period: '2024',
      status: 'active',
      startDate: '2024-03-01',
      endDate: '2024-08-31',
      description: 'Eğitim projesi için ayrılan özel bütçe',
      categories: [
        { name: 'Eğitim Materyalleri', budget: 80000, spent: 60000, remaining: 20000 },
        { name: 'Eğitmen Ücretleri', budget: 60000, spent: 40000, remaining: 20000 },
        { name: 'Saha Giderleri', budget: 40000, spent: 15000, remaining: 25000 },
        { name: 'Değerlendirme', budget: 20000, spent: 5000, remaining: 15000 }
      ],
      manager: 'Fatma Demir',
      progress: 60
    },
    {
      id: 3,
      name: 'Acil Durum Bütçesi',
      type: 'emergency',
      totalBudget: 100000,
      spentAmount: 75000,
      remainingAmount: 25000,
      period: '2024',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      description: 'Acil durumlar için ayrılan bütçe',
      categories: [
        { name: 'Acil Yardım', budget: 60000, spent: 50000, remaining: 10000 },
        { name: 'Tıbbi Giderler', budget: 30000, spent: 20000, remaining: 10000 },
        { name: 'Lojistik', budget: 10000, spent: 5000, remaining: 5000 }
      ],
      manager: 'Mehmet Kaya',
      progress: 75
    },
    {
      id: 4,
      name: '2023 Yılı Bütçesi',
      type: 'operational',
      totalBudget: 400000,
      spentAmount: 400000,
      remainingAmount: 0,
      period: '2023',
      status: 'completed',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      description: '2023 yılı tamamlanan operasyonel bütçe',
      categories: [
        { name: 'Personel Giderleri', budget: 180000, spent: 180000, remaining: 0 },
        { name: 'Ofis Giderleri', budget: 80000, spent: 80000, remaining: 0 },
        { name: 'Teknoloji Giderleri', budget: 70000, spent: 70000, remaining: 0 },
        { name: 'Pazarlama Giderleri', budget: 50000, spent: 50000, remaining: 0 },
        { name: 'Diğer Giderler', budget: 20000, spent: 20000, remaining: 0 }
      ],
      manager: 'Ayşe Özkan',
      progress: 100
    }
  ];

  const budgetColumns = [
    {
      key: 'name',
      label: 'Bütçe',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
            {item.type === 'operational' ? (
              <DollarSign className="w-5 h-5 text-brand-600" />
            ) : item.type === 'project' ? (
              <Target className="w-5 h-5 text-brand-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-brand-600" />
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
          operational: { label: 'Operasyonel', color: 'brand' },
          project: { label: 'Proje', color: 'info' },
          emergency: { label: 'Acil', color: 'danger' }
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
          <div className="font-medium">₺{item.spentAmount.toLocaleString()}</div>
          <div className="text-sm text-muted-500">
            / ₺{item.totalBudget.toLocaleString()}
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
      key: 'remaining',
      label: 'Kalan',
      render: (item) => (
        <div className="font-medium text-green-600">
          ₺{item.remainingAmount.toLocaleString()}
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
              setSelectedBudget(item);
              setShowBudgetDetailsModal(true);
            }}
          />
          <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} />
          <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} />
        </div>
      )
    }
  ];

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'overview' || 
                      (activeTab === 'active' && budget.status === 'active') ||
                      (activeTab === 'completed' && budget.status === 'completed');
    
    return matchesSearch && matchesTab;
  });

  const stats = [
    {
      title: 'Toplam Bütçe',
      value: `₺${budgets.reduce((sum, budget) => sum + budget.totalBudget, 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'brand'
    },
    {
      title: 'Harcanan',
      value: `₺${budgets.reduce((sum, budget) => sum + budget.spentAmount, 0).toLocaleString()}`,
      icon: TrendingDown,
      color: 'danger'
    },
    {
      title: 'Kalan',
      value: `₺${budgets.reduce((sum, budget) => sum + budget.remainingAmount, 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'success'
    },
    {
      title: 'Aktif Bütçe',
      value: budgets.filter(b => b.status === 'active').length,
      icon: Activity,
      color: 'info'
    }
  ];

  const handleCreateBudget = () => {
    // Mock budget creation
    const newBudget = {
      id: budgets.length + 1,
      name: budgetName,
      type: budgetType,
      totalBudget: parseFloat(budgetAmount) || 0,
      spentAmount: 0,
      remainingAmount: parseFloat(budgetAmount) || 0,
      period: budgetPeriod,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2024-12-31',
      description: budgetDescription,
      categories: [],
      manager: 'Ahmet Yılmaz',
      progress: 0
    };
    
    setShowNewBudgetModal(false);
    // In real app, this would be saved to database
  };

  return (
    <Page
      title="Bütçe Planlama"
      description="Bütçe planlama ve takip sistemi"
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
            onClick={() => setShowNewBudgetModal(true)}
          >
            Yeni Bütçe
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
            <CardTitle>Bütçe Arama</CardTitle>
            <CardDescription>Bütçeleri filtrelemek için arama yapın</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <Label htmlFor="search">Arama</Label>
                <Input
                  id="search"
                  placeholder="Bütçe adı veya yönetici ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Budgets List */}
        <Card>
          <CardHeader>
            <CardTitle>Bütçe Listesi</CardTitle>
            <CardDescription>Toplam {filteredBudgets.length} bütçe</CardDescription>
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
                data={filteredBudgets}
                columns={budgetColumns}
                pagination={true}
                itemsPerPage={10}
              />
            </div>
          </CardContent>
        </Card>

        {/* New Budget Modal */}
        <Modal
          isOpen={showNewBudgetModal}
          onClose={() => setShowNewBudgetModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Yeni Bütçe Oluştur</Modal.Title>
            <Modal.Description>
              Yeni bir bütçe oluşturun ve kategorileri belirleyin
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <FormField>
                <Label htmlFor="name">Bütçe Adı</Label>
                <Input
                  id="name"
                  placeholder="Bütçe adını girin"
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                />
              </FormField>
              
              <FormField>
                <Label htmlFor="type">Bütçe Türü</Label>
                <Select
                  id="type"
                  value={budgetType}
                  onChange={(e) => setBudgetType(e.target.value)}
                  options={[
                    { value: 'operational', label: 'Operasyonel' },
                    { value: 'project', label: 'Proje' },
                    { value: 'emergency', label: 'Acil Durum' }
                  ]}
                />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <Label htmlFor="amount">Toplam Bütçe (₺)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Toplam bütçe miktarı"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                  />
                </FormField>
                
                <FormField>
                  <Label htmlFor="period">Dönem</Label>
                  <Select
                    id="period"
                    value={budgetPeriod}
                    onChange={(e) => setBudgetPeriod(e.target.value)}
                    options={[
                      { value: '2024', label: '2024' },
                      { value: '2025', label: '2025' },
                      { value: '2026', label: '2026' }
                    ]}
                  />
                </FormField>
              </div>
              
              <FormField>
                <Label htmlFor="description">Açıklama</Label>
                <textarea
                  id="description"
                  className="w-full p-3 border rounded-md resize-none"
                  rows={3}
                  placeholder="Bütçe açıklaması"
                  value={budgetDescription}
                  onChange={(e) => setBudgetDescription(e.target.value)}
                />
              </FormField>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowNewBudgetModal(false)}>
              İptal
            </Button>
            <Button variant="primary" onClick={handleCreateBudget}>
              Bütçe Oluştur
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Budget Details Modal */}
        <Modal
          isOpen={showBudgetDetailsModal}
          onClose={() => setShowBudgetDetailsModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>{selectedBudget?.name}</Modal.Title>
            <Modal.Description>
              Bütçe detayları ve kategori dağılımı
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            {selectedBudget && (
              <div className="space-y-6">
                {/* Budget Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Yönetici</Label>
                    <p className="text-sm text-muted-500">{selectedBudget.manager}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Durum</Label>
                    <StatusBadge status={selectedBudget.status} />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Başlangıç</Label>
                    <p className="text-sm text-muted-500">{selectedBudget.startDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Bitiş</Label>
                    <p className="text-sm text-muted-500">{selectedBudget.endDate}</p>
                  </div>
                </div>
                
                {/* Financial Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      ₺{selectedBudget.totalBudget.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-500">Toplam Bütçe</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      ₺{selectedBudget.spentAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-500">Harcanan</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ₺{selectedBudget.remainingAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-500">Kalan</div>
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <Label className="text-sm font-medium">Açıklama</Label>
                  <p className="text-sm text-muted-500 mt-1">{selectedBudget.description}</p>
                </div>
                
                {/* Categories */}
                <div>
                  <Label className="text-sm font-medium">Kategori Dağılımı ({selectedBudget.categories.length})</Label>
                  <div className="mt-2 space-y-2">
                    {selectedBudget.categories.map((category, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{category.name}</span>
                          <div className="text-sm">
                            <span className="text-red-600">₺{category.spent.toLocaleString()}</span>
                            <span className="text-muted-500"> / ₺{category.budget.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-brand-500 h-2 rounded-full" 
                            style={{ width: `${(category.spent / category.budget) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-500 mt-1">
                          <span>Kalan: ₺{category.remaining.toLocaleString()}</span>
                          <span>{Math.round((category.spent / category.budget) * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowBudgetDetailsModal(false)}>
              Kapat
            </Button>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              Kategori Ekle
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Page>
  );
};

export default BudgetPlanningNew;
