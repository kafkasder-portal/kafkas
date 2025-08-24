import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock WebSocket
global.WebSocket = vi.fn().mockImplementation(() => ({
  send: vi.fn(),
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  readyState: 1,
}));

// Mock fetch
global.fetch = vi.fn();

// Mock DOMPurify
vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn(input => {
      // Remove script tags and dangerous content
      return input
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<style[^>]*>.*?<\/style>/gi, '')
        .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
        .replace(/<object[^>]*>.*?<\/object>/gi, '')
        .replace(/<embed[^>]*>.*?<\/embed>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    }),
  },
}));

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
    input: props => <input {...props} />,
    select: ({ children, ...props }) => <select {...props}>{children}</select>,
    textarea: props => <textarea {...props} />,
    label: ({ children, ...props }) => <label {...props}>{children}</label>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    h4: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
    h5: ({ children, ...props }) => <h5 {...props}>{children}</h5>,
    h6: ({ children, ...props }) => <h6 {...props}>{children}</h6>,
    ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }) => <li {...props}>{children}</li>,
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    header: ({ children, ...props }) => <header {...props}>{children}</header>,
    footer: ({ children, ...props }) => <footer {...props}>{children}</footer>,
    main: ({ children, ...props }) => <main {...props}>{children}</main>,
    section: ({ children, ...props }) => (
      <section {...props}>{children}</section>
    ),
    article: ({ children, ...props }) => (
      <article {...props}>{children}</article>
    ),
    aside: ({ children, ...props }) => <aside {...props}>{children}</aside>,
    table: ({ children, ...props }) => <table {...props}>{children}</table>,
    thead: ({ children, ...props }) => <thead {...props}>{children}</thead>,
    tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
    tr: ({ children, ...props }) => <tr {...props}>{children}</tr>,
    th: ({ children, ...props }) => <th {...props}>{children}</th>,
    td: ({ children, ...props }) => <td {...props}>{children}</td>,
    img: props => <img {...props} />,
    svg: ({ children, ...props }) => <svg {...props}>{children}</svg>,
    path: props => <path {...props} />,
    circle: props => <circle {...props} />,
    rect: props => <rect {...props} />,
    line: props => <line {...props} />,
    polyline: props => <polyline {...props} />,
    polygon: props => <polygon {...props} />,
    ellipse: props => <ellipse {...props} />,
    text: ({ children, ...props }) => <text {...props}>{children}</text>,
    tspan: ({ children, ...props }) => <tspan {...props}>{children}</tspan>,
    g: ({ children, ...props }) => <g {...props}>{children}</g>,
    defs: ({ children, ...props }) => <defs {...props}>{children}</defs>,
    clipPath: ({ children, ...props }) => (
      <clipPath {...props}>{children}</clipPath>
    ),
    linearGradient: ({ children, ...props }) => (
      <linearGradient {...props}>{children}</linearGradient>
    ),
    radialGradient: ({ children, ...props }) => (
      <radialGradient {...props}>{children}</radialGradient>
    ),
    stop: props => <stop {...props} />,
    mask: ({ children, ...props }) => <mask {...props}>{children}</mask>,
    pattern: ({ children, ...props }) => (
      <pattern {...props}>{children}</pattern>
    ),
    symbol: ({ children, ...props }) => <symbol {...props}>{children}</symbol>,
    use: props => <use {...props} />,
    foreignObject: ({ children, ...props }) => (
      <foreignObject {...props}>{children}</foreignObject>
    ),
    animate: ({ children, ...props }) => (
      <animate {...props}>{children}</animate>
    ),
    animateMotion: ({ children, ...props }) => (
      <animateMotion {...props}>{children}</animateMotion>
    ),
    animateTransform: ({ children, ...props }) => (
      <animateTransform {...props}>{children}</animateTransform>
    ),
    mpath: props => <mpath {...props} />,
    set: props => <set {...props} />,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  AnimatePresence: ({ children }) => children,
  useMotionValue: vi.fn(() => ({ get: vi.fn(), set: vi.fn() })),
  useTransform: vi.fn(() => ({ get: vi.fn(), set: vi.fn() })),
  useAnimation: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  })),
  useMotionValueEvent: vi.fn(),
  useInView: vi.fn(() => [vi.fn(), false]),
  useScroll: vi.fn(() => ({
    scrollX: { get: vi.fn(), set: vi.fn() },
    scrollY: { get: vi.fn(), set: vi.fn() },
    scrollXProgress: { get: vi.fn(), set: vi.fn() },
    scrollYProgress: { get: vi.fn(), set: vi.fn() },
  })),
  useSpring: vi.fn(value => ({ get: vi.fn(() => value), set: vi.fn() })),
  useTransform: vi.fn((value, input, output) => ({
    get: vi.fn(() => output[0]),
    set: vi.fn(),
  })),
  useCycle: vi.fn((...args) => [args[0], vi.fn()]),
  useReducedMotion: vi.fn(() => false),
  usePresence: vi.fn(() => [true, vi.fn()]),
  useDragControls: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    block: vi.fn(),
    unblock: vi.fn(),
  })),
  usePanGesture: vi.fn(() => ({
    pan: vi.fn(),
    panStart: vi.fn(),
    panEnd: vi.fn(),
  })),
  useTapGesture: vi.fn(() => ({
    tap: vi.fn(),
    tapStart: vi.fn(),
    tapEnd: vi.fn(),
  })),
  useHoverGesture: vi.fn(() => ({
    hover: vi.fn(),
    hoverStart: vi.fn(),
    hoverEnd: vi.fn(),
  })),
  useFocusGesture: vi.fn(() => ({
    focus: vi.fn(),
    focusStart: vi.fn(),
    focusEnd: vi.fn(),
  })),
  useGesture: vi.fn(() => ({})),
  useMeasure: vi.fn(() => [vi.fn(), { width: 100, height: 100 }]),
  useMotionTemplate: vi.fn(template => template),
}));

// Mock React Router
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: ({ children }) => children,
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
  Outlet: () => <div data-testid='outlet' />,
  Navigate: ({ to }) => <div data-testid='navigate' data-to={to} />,
}));

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key,
    i18n: {
      changeLanguage: vi.fn(),
      language: 'tr',
    },
  }),
  Trans: ({ children }) => children,
}));

// Socket.io-client removed from project

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Home: () => <div data-testid='icon-home' />,
  Users: () => <div data-testid='icon-users' />,
  DollarSign: () => <div data-testid='icon-dollar' />,
  Package: () => <div data-testid='icon-package' />,
  Calendar: () => <div data-testid='icon-calendar' />,
  MessageSquare: () => <div data-testid='icon-message' />,
  Settings: () => <div data-testid='icon-settings' />,
  Shield: () => <div data-testid='icon-shield' />,
  Heart: () => <div data-testid='icon-heart' />,
  GraduationCap: () => <div data-testid='icon-graduation' />,
  PiggyBank: () => <div data-testid='icon-piggy' />,
  Building2: () => <div data-testid='icon-building' />,
  CheckCircle: () => <div data-testid='icon-check' />,
  AlertCircle: () => <div data-testid='icon-alert' />,
  Eye: () => <div data-testid='icon-eye' />,
  EyeOff: () => <div data-testid='icon-eye-off' />,
  Mail: () => <div data-testid='icon-mail' />,
  Lock: () => <div data-testid='icon-lock' />,
  Loader: () => <div data-testid='icon-loader' />,
  Plus: () => <div data-testid='icon-plus' />,
  Edit: () => <div data-testid='icon-edit' />,
  Trash2: () => <div data-testid='icon-trash' />,
  Search: () => <div data-testid='icon-search' />,
  Filter: () => <div data-testid='icon-filter' />,
  Download: () => <div data-testid='icon-download' />,
  Upload: () => <div data-testid='icon-upload' />,
  RefreshCw: () => <div data-testid='icon-refresh' />,
  Activity: () => <div data-testid='icon-activity' />,
  TrendingUp: () => <div data-testid='icon-trending-up' />,
  TrendingDown: () => <div data-testid='icon-trending-down' />,
  Zap: () => <div data-testid='icon-zap' />,
  HardDrive: () => <div data-testid='icon-hard-drive' />,
  Wifi: () => <div data-testid='icon-wifi' />,
  Clock: () => <div data-testid='icon-clock' />,
  Gauge: () => <div data-testid='icon-gauge' />,
  AlertTriangle: () => <div data-testid='icon-alert-triangle' />,
  CheckCircle2: () => <div data-testid='icon-check-circle' />,
  X: () => <div data-testid='icon-x' />,
  ChevronDown: () => <div data-testid='icon-chevron-down' />,
  ChevronUp: () => <div data-testid='icon-chevron-up' />,
  ChevronLeft: () => <div data-testid='icon-chevron-left' />,
  ChevronRight: () => <div data-testid='icon-chevron-right' />,
  Menu: () => <div data-testid='icon-menu' />,
  XCircle: () => <div data-testid='icon-x-circle' />,
  Info: () => <div data-testid='icon-info' />,
  HelpCircle: () => <div data-testid='icon-help' />,
  ExternalLink: () => <div data-testid='icon-external-link' />,
  Copy: () => <div data-testid='icon-copy' />,
  Share: () => <div data-testid='icon-share' />,
  Bookmark: () => <div data-testid='icon-bookmark' />,
  Star: () => <div data-testid='icon-star' />,
  ThumbsUp: () => <div data-testid='icon-thumbs-up' />,
  ThumbsDown: () => <div data-testid='icon-thumbs-down' />,
  Flag: () => <div data-testid='icon-flag' />,
  Bell: () => <div data-testid='icon-bell' />,
  User: () => <div data-testid='icon-user' />,
  LogOut: () => <div data-testid='icon-logout' />,
  LogIn: () => <div data-testid='icon-login' />,
  UserPlus: () => <div data-testid='icon-user-plus' />,
  UserMinus: () => <div data-testid='icon-user-minus' />,
  UserCheck: () => <div data-testid='icon-user-check' />,
  UserX: () => <div data-testid='icon-user-x' />,
  Key: () => <div data-testid='icon-key' />,
  Unlock: () => <div data-testid='icon-unlock' />,
  ShieldCheck: () => <div data-testid='icon-shield-check' />,
  ShieldX: () => <div data-testid='icon-shield-x' />,
  ShieldAlert: () => <div data-testid='icon-shield-alert' />,
  ShieldOff: () => <div data-testid='icon-shield-off' />,
  ShieldPlus: () => <div data-testid='icon-shield-plus' />,
  ShieldMinus: () => <div data-testid='icon-shield-minus' />,
  ShieldQuestion: () => <div data-testid='icon-shield-question' />,
}));

// Mock uuid
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid'),
}));

// Mock dompurify
vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn(input => input),
  },
}));

// Console error suppression for tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Global test utilities
global.testUtils = {
  // Mock user data
  mockUser: {
    id: 'test-user-id',
    email: 'test@kafkasder.org',
    name: 'Test User',
    role: 'admin',
    permissions: ['read', 'write', 'delete', 'admin'],
  },

  // Mock form data
  mockFormData: {
    donation: {
      donor_name: 'Test Donor',
      donor_email: 'donor@test.com',
      amount: 1000,
      type: 'monetary',
      description: 'Test donation',
    },
    beneficiary: {
      first_name: 'John',
      last_name: 'Doe',
      phone: '+90555123456',
      email: 'john.doe@test.com',
      address: 'Test Address',
      region: 'Istanbul',
      category: 'family',
    },
  },

  // Mock API responses
  mockApiResponse: {
    success: { success: true, data: {} },
    error: { success: false, error: 'Test error' },
    list: { success: true, data: [], total: 0 },
  },

  // Test helper functions
  createMockEvent: (value = '') => ({
    target: { value },
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  }),

  createMockFile: (name = 'test.jpg', type = 'image/jpeg') =>
    new File(['test'], name, { type }),

  waitForElement: async (selector, timeout = 1000) => {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  },
};
