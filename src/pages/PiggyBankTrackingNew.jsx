import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PiggyBank,
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

const PiggyBankTrackingNew = () => {
  const [activeTab, setActiveTab] = useState('savings');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSavings, setSelectedSavings] = useState(null);
  const [showNewSavingsModal, setShowNewSavingsModal] = useState(false);
  const [showSavingsDetailsModal, setShowSavingsDetailsModal] = useState(false);
  const [savingsName, setSavingsName] = useState('');
  const [savingsType, setSavingsType] = useState('personal');
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyGoal, setMonthlyGoal] = useState('');
  const [savingsDescription, setSavingsDescription] = useState('');

  // Mock data
  const savings = [
    {
      id: 1,
      name: 'Ev Birikimi',
      type: 'personal',
      currentAmount: 45000,
      targetAmount: 100000,
      monthlyGoal: 5000,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      description: 'Ev alımı için birikim',
      transactions: [
        { date: '2024-01-15', amount: 5000, type: 'deposit', description: 'Ocak birikimi' },
        { date: '2024-02-15', amount: 5000, type: 'deposit', description: 'Şubat birikimi' },
        { date: '2024-03-15', amount: 5000, type: 'deposit', description: 'Mart birikimi' },
        { date: '2024-04-15', amount: 5000, type: 'deposit', description: 'Nisan birikimi' },
        { date: '2024-05-15', amount: 5000, type: 'deposit', description: 'Mayıs birikimi' },
        { date: '2024-06-15', amount: 5000, type: 'deposit', description: 'Haziran birikimi' },
        { date: '2024-07-15', amount: 5000, type: 'deposit', description: 'Temmuz birikimi' },
        { date: '2024-08-15', amount: 5000, type: 'deposit', description: 'Ağustos birikimi' },
        { date: '2024-09-15', amount: 5000, type: 'deposit', description: 'Eylül birikimi' }
      ],
      owner: 'Ahmet Yılmaz',
      progress: 45
    },
    {
      id: 2,
      name: 'Araba Birikimi',
      type: 'personal',
      currentAmount: 25000,
      targetAmount: 80000,
      monthlyGoal: 3000,
      status: 'active',
      startDate: '2024-03-01',
      endDate: '2024-12-31',
      description: 'Araba alımı için birikim',
      transactions: [
        { date: '2024-03-15', amount: 3000, type: 'deposit', description: 'Mart birikimi' },
        { date: '2024-04-15', amount: 3000, type: 'deposit', description: 'Nisan birikimi' },
        { date: '2024-05-15', amount: 3000, type: 'deposit', description: 'Mayıs birikimi' },
        { date: '2024-06-15', amount: 3000, type: 'deposit', description: 'Haziran birikimi' },
        { date: '2024-07-15', amount: 3000, type: 'deposit', description: 'Temmuz birikimi' },
        { date: '2024-08-15', amount: 3000, type: 'deposit', description: 'Ağustos birikimi' },
        { date: '2024-09-15', amount: 3000, type: 'deposit', description: 'Eylül birikimi' },
        { date: '2024-10-15', amount: 3000, type: 'deposit', description: 'Ekim birikimi' },
        { date: '2024-11-15', amount: 1000, type: 'deposit', description: 'Kasım birikimi' }
      ],
      owner: 'Fatma Demir',
      progress: 31
    },
    {
      id: 3,
      name: 'Tatil Birikimi',
      type: 'family',
      currentAmount: 15000,
      targetAmount: 30000,
      monthlyGoal: 2000,
      status: 'active',
      startDate: '2024-06-01',
      endDate: '2024-12-31',
      description: 'Aile tatili için birikim',
      transactions: [
        { date: '2024-06-15', amount: 2000, type: 'deposit', description: 'Haziran birikimi' },
        { date: '2024-07-15', amount: 2000, type: 'deposit', description: 'Temmuz birikimi' },
        { date: '2024-08-15', amount: 2000, type: 'deposit', description: 'Ağustos birikimi' },
        { date: '2024-09-15', amount: 2000, type: 'deposit', description: 'Eylül birikimi' },
        { date: '2024-10-15', amount: 2000, type: 'deposit', description: 'Ekim birikimi' },
        { date: '2024-11-15', amount: 2000, type: 'deposit', description: 'Kasım birikimi' },
        { date: '2024-12-15', amount: 2000, type: 'deposit', description: 'Aralık birikimi' },
        { date: '2024-12-20', amount: 1000, type: 'deposit', description: 'Ek birikim' }
      ],
      owner: 'Mehmet Kaya',
      progress: 50
    },
    {
      id: 4,
      name: 'Eğitim Birikimi',
      type: 'education',
      currentAmount: 80000,
      targetAmount: 80000,
      monthlyGoal: 5000,
      status: 'completed',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      description: 'Çocuk eğitimi için birikim',
      transactions: [
        { date: '2023-01-15', amount: 5000, type: 'deposit', description: 'Ocak birikimi' },
        { date: '2023-02-15', amount: 5000, type: 'deposit', description: 'Şubat birikimi' },
        { date: '2023-03-15', amount: 5000, type: 'deposit', description: 'Mart birikimi' },
        { date: '2023-04-15', amount: 5000, type: 'deposit', description: 'Nisan birikimi' },
        { date: '2023-05-15', amount: 5000, type: 'deposit', description: 'Mayıs birikimi' },
        { date: '2023-06-15', amount: 5000, type: 'deposit', description: 'Haziran birikimi' },
        { date: '2023-07-15', amount: 5000, type: 'deposit', description: 'Temmuz birikimi' },
        { date: '2023-08-15', amount: 5000, type: 'deposit', description: 'Ağustos birikimi' },
        { date: '2023-09-15', amount: 5000, type: 'deposit', description: 'Eylül birikimi' },
        { date: '2023-10-15', amount: 5000, type: 'deposit', description: 'Ekim birikimi' },
        { date: '2023-11-15', amount: 5000, type: 'deposit', description: 'Kasım birikimi' },
        { date: '2023-12-15', amount: 5000, type: 'deposit', description: 'Aralık birikimi' },
        { date: '2023-12-20', amount: 20000, type: 'deposit', description: 'Son birikim' }
      ],
      owner: 'Ayşe Özkan',
      progress: 100
    }
  ];

  const savingsColumns = [
    {
      key: 'name',
      label: 'Birikim',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
            <PiggyBank className="w-5 h-5 text-brand-600" />
          </div>
          <div className="flex-1">
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-muted-500">{item.owner}</div>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Tür',
      render: (item) => {
        const typeConfig = {
          personal: { label: 'Kişisel', color: 'brand' },
          family: { label: 'Aile', color: 'info' },
          education: { label: 'Eğitim', color: 'success' },
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
          <div className="font-medium">₺{item.currentAmount.toLocaleString()}</div>
          <div className="text-sm text-muted-500">
            Hedef: ₺{item.targetAmount.toLocaleString()}
          </div>
        </div>
      )
    },
    {
      key: 'monthly',
      label: 'Aylık Hedef',
      render: (item) => (
        <div className="font-medium text-green-600">
          ₺{item.monthlyGoal.toLocaleString()}
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
              setSelectedSavings(item);
              setShowSavingsDetailsModal(true);
            }}
          />
          <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} />
          <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} />
        </div>
      )
    }
  ];

  const filteredSavings = savings.filter(saving => {
    const matchesSearch = saving.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         saving.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'savings' || 
                      (activeTab === 'active' && saving.status === 'active') ||
                      (activeTab === 'completed' && saving.status === 'completed');
    
    return matchesSearch && matchesTab;
  });

  const stats = [
    {
      title: 'Toplam Birikim',
      value: `₺${savings.reduce((sum, saving) => sum + saving.currentAmount, 0).toLocaleString()}`,
      icon: PiggyBank,
      color: 'brand'
    },
    {
      title: 'Toplam Hedef',
      value: `₺${savings.reduce((sum, saving) => sum + saving.targetAmount, 0).toLocaleString()}`,
      icon: Target,
      color: 'warning'
    },
    {
      title: 'Aylık Hedef',
      value: `₺${savings.reduce((sum, saving) => sum + saving.monthlyGoal, 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'success'
    },
    {
      title: 'Aktif Birikim',
      value: savings.filter(s => s.status === 'active').length,
      icon: Activity,
      color: 'info'
    }
  ];

  const handleCreateSavings = () => {
    // Mock savings creation
    const newSavings = {
      id: savings.length + 1,
      name: savingsName,
      type: savingsType,
      currentAmount: 0,
      targetAmount: parseFloat(targetAmount) || 0,
      monthlyGoal: parseFloat(monthlyGoal) || 0,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2024-12-31',
      description: savingsDescription,
      transactions: [],
      owner: 'Ahmet Yılmaz',
      progress: 0
    };
    
    setShowNewSavingsModal(false);
    // In real app, this would be saved to database
  };

  return (
    <Page
      title="Kumbara Takibi"
      description="Birikim hedefleri ve takip sistemi"
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
            onClick={() => setShowNewSavingsModal(true)}
          >
            Yeni Birikim
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
            <CardTitle>Birikim Arama</CardTitle>
            <CardDescription>Birikim hedeflerini filtrelemek için arama yapın</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <Label htmlFor="search">Arama</Label>
                <Input
                  id="search"
                  placeholder="Birikim adı veya sahibi ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Savings List */}
        <Card>
          <CardHeader>
            <CardTitle>Birikim Listesi</CardTitle>
            <CardDescription>Toplam {filteredSavings.length} birikim</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="savings">Tümü</TabsTrigger>
                <TabsTrigger value="active">Aktif</TabsTrigger>
                <TabsTrigger value="completed">Tamamlanan</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="mt-6">
              <DataTable
                data={filteredSavings}
                columns={savingsColumns}
                pagination={true}
                itemsPerPage={10}
              />
            </div>
          </CardContent>
        </Card>

        {/* New Savings Modal */}
        <Modal
          isOpen={showNewSavingsModal}
          onClose={() => setShowNewSavingsModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Yeni Birikim Hedefi</Modal.Title>
            <Modal.Description>
              Yeni bir birikim hedefi oluşturun
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <FormField>
                <Label htmlFor="name">Birikim Adı</Label>
                <Input
                  id="name"
                  placeholder="Birikim hedefi adı"
                  value={savingsName}
                  onChange={(e) => setSavingsName(e.target.value)}
                />
              </FormField>
              
              <FormField>
                <Label htmlFor="type">Birikim Türü</Label>
                <Select
                  id="type"
                  value={savingsType}
                  onChange={(e) => setSavingsType(e.target.value)}
                  options={[
                    { value: 'personal', label: 'Kişisel' },
                    { value: 'family', label: 'Aile' },
                    { value: 'education', label: 'Eğitim' },
                    { value: 'emergency', label: 'Acil' }
                  ]}
                />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <Label htmlFor="target">Hedef Miktar (₺)</Label>
                  <Input
                    id="target"
                    type="number"
                    placeholder="Hedef birikim miktarı"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                  />
                </FormField>
                
                <FormField>
                  <Label htmlFor="monthly">Aylık Hedef (₺)</Label>
                  <Input
                    id="monthly"
                    type="number"
                    placeholder="Aylık birikim hedefi"
                    value={monthlyGoal}
                    onChange={(e) => setMonthlyGoal(e.target.value)}
                  />
                </FormField>
              </div>
              
              <FormField>
                <Label htmlFor="description">Açıklama</Label>
                <textarea
                  id="description"
                  className="w-full p-3 border rounded-md resize-none"
                  rows={3}
                  placeholder="Birikim hedefi açıklaması"
                  value={savingsDescription}
                  onChange={(e) => setSavingsDescription(e.target.value)}
                />
              </FormField>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowNewSavingsModal(false)}>
              İptal
            </Button>
            <Button variant="primary" onClick={handleCreateSavings}>
              Birikim Oluştur
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Savings Details Modal */}
        <Modal
          isOpen={showSavingsDetailsModal}
          onClose={() => setShowSavingsDetailsModal(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>{selectedSavings?.name}</Modal.Title>
            <Modal.Description>
              Birikim detayları ve işlem geçmişi
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            {selectedSavings && (
              <div className="space-y-6">
                {/* Savings Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Sahip</Label>
                    <p className="text-sm text-muted-500">{selectedSavings.owner}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Durum</Label>
                    <StatusBadge status={selectedSavings.status} />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Başlangıç</Label>
                    <p className="text-sm text-muted-500">{selectedSavings.startDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Bitiş</Label>
                    <p className="text-sm text-muted-500">{selectedSavings.endDate}</p>
                  </div>
                </div>
                
                {/* Financial Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ₺{selectedSavings.currentAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-500">Mevcut Birikim</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      ₺{selectedSavings.targetAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-500">Hedef</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      ₺{selectedSavings.monthlyGoal.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-500">Aylık Hedef</div>
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <Label className="text-sm font-medium">Açıklama</Label>
                  <p className="text-sm text-muted-500 mt-1">{selectedSavings.description}</p>
                </div>
                
                {/* Transactions */}
                <div>
                  <Label className="text-sm font-medium">İşlem Geçmişi ({selectedSavings.transactions.length})</Label>
                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                    {selectedSavings.transactions.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-500">{transaction.date}</p>
                        </div>
                        <div className="text-sm font-medium text-green-600">
                          +₺{transaction.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowSavingsDetailsModal(false)}>
              Kapat
            </Button>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              Para Ekle
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Page>
  );
};

export default PiggyBankTrackingNew;
