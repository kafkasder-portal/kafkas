import { motion } from 'framer-motion';
import { useState } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Design System Components
import { 
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Label,
  FormField,
  HelperText,
  Alert
} from '../ui';
import { iconSize } from '../design-system/design-tokens';

const LoginNew = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-accent-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-4 pb-8">
            {/* Logo/Brand */}
            <div className="mx-auto w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center">
              <LogIn size={iconSize.lg} className="text-white" />
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-brand-900">
                KAFKASDER
              </CardTitle>
              <CardDescription className="text-foreground-secondary">
                Dernek yönetim sistemine giriş yapın
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert
                variant="danger"
                dismissible
                onDismiss={() => setError('')}
              >
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <FormField>
                <Label htmlFor="email" required>
                  E-posta Adresi
                </Label>
                <div className="relative">
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    required
                    disabled={loading}
                    className="pl-10"
                  />
                  <Mail 
                    size={iconSize.sm}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
                  />
                </div>
              </FormField>

              {/* Password Field */}
              <FormField>
                <Label htmlFor="password" required>
                  Şifre
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="pl-10 pr-10"
                  />
                  <Lock 
                    size={iconSize.sm}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff size={iconSize.sm} />
                    ) : (
                      <Eye size={iconSize.sm} />
                    )}
                  </button>
                </div>
                <HelperText>
                  Şifrenizi güvenli bir yerde saklayın
                </HelperText>
              </FormField>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-border text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-foreground-secondary">
                    Beni hatırla
                  </span>
                </label>
                
                <button
                  type="button"
                  className="text-sm text-brand-600 hover:text-brand-700 hover:underline"
                  disabled={loading}
                >
                  Şifremi unuttum
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                loading={loading}
                className="h-12 text-base font-semibold"
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background-primary px-2 text-foreground-muted">
                  veya
                </span>
              </div>
            </div>

            {/* Alternative Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" disabled={loading}>
                Demo Girişi
              </Button>
              <Button variant="outline" disabled={loading}>
                Yardım
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <motion.div 
          className="text-center mt-8 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-sm text-foreground-muted">
            © 2025 KAFKASDER. Tüm hakları saklıdır.
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <button className="text-foreground-muted hover:text-brand-600 transition-colors">
              Gizlilik Politikası
            </button>
            <button className="text-foreground-muted hover:text-brand-600 transition-colors">
              Kullanım Koşulları
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginNew;
