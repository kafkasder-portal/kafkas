// Type definitions for kafportal
// Project: https://github.com/kafkas-dernegi/kafportal

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user' | 'volunteer';
  permissions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  supabaseConnected: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export interface Donation {
  id: string;
  donor_name: string;
  donor_email?: string;
  donor_phone?: string;
  amount: number;
  currency: string;
  payment_method?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Beneficiary {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  family_size: number;
  income_level?: string;
  status: 'active' | 'inactive' | 'archived';
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  assigned_by?: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Volunteer {
  id: string;
  user_id: string;
  skills: string[];
  availability?: string;
  status: 'active' | 'inactive' | 'pending';
  join_date: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
  quantity: number;
  unit?: string;
  status: 'available' | 'low_stock' | 'out_of_stock' | 'discontinued';
  location?: string;
  min_quantity: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  meeting_date: string;
  duration?: number;
  location?: string;
  meeting_type: 'board' | 'committee' | 'general' | 'volunteer';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject?: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  reference?: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  transaction_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: any;
}

export interface ServiceResponse<T> {
  data: T | null;
  error: Error | null;
  loading?: boolean;
}

export interface CacheInfo {
  key: string;
  age: number;
  isValid: boolean;
  expiresAt: number;
  size: number;
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  userAgent: string;
  platform: string;
  orientation: 'landscape' | 'portrait';
  browser: string;
  os: string;
  touchSupport: boolean;
}

export interface NotificationOptions {
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  dismissible?: boolean;
}

export interface FormField {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: (value: any) => string | null;
}

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  border: string;
  success: string;
  error: string;
  warning: string;
  info: string;
}

export interface SecurityConfig {
  maxLoginAttempts: number;
  sessionTimeout: number;
  passwordMinLength: number;
  requireSpecialChars: boolean;
  twoFactorEnabled: boolean;
  ipWhitelist?: string[];
}

export interface PerformanceMetrics {
  renderCount: number;
  totalRenderTime: number;
  averageRenderTime: number;
}

// Environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VITE_PUBLIC_SUPABASE_URL: string;
      VITE_PUBLIC_SUPABASE_ANON_KEY: string;
      VITE_API_URL?: string;
      VITE_ENV?: string;
    }
  }
}

// Utility types
export type Status = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type UserRole = 'admin' | 'manager' | 'user' | 'volunteer';
export type TransactionType = 'income' | 'expense';
export type MeetingType = 'board' | 'committee' | 'general' | 'volunteer';

// React component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PageProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export interface TableProps<T> extends BaseComponentProps {
  data: T[];
  columns: Array<{
    key: keyof T;
    title: string;
    render?: (value: any, record: T) => React.ReactNode;
  }>;
  loading?: boolean;
  pagination?: PaginationParams;
  onRowClick?: (record: T) => void;
}