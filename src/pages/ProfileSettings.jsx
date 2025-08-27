import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Clock,
  Save,
  Camera,
  Key,
  Bell,
  Globe,
  Lock,
} from 'lucide-react';

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Admin Kullanıcı',
    email: 'admin@kafportal.com',
    phone: '+90 532 123 4567',
    location: 'İstanbul, Türkiye',
    role: 'admin',
    lastLogin: new Date().toISOString(),
    avatar: null,
    notifications: {
      email: true,
      sms: false,
      push: true,
      system: true,
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: true,
      showPhone: false,
      showLocation: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordChangeRequired: false,
    },
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    // Show success message
    alert('Ayarlar başarıyla kaydedildi!');
  };

  const getRoleName = role => {
    const roleNames = {
      admin: 'Yönetici',
      moderator: 'Moderatör',
      user: 'Kullanıcı',
      volunteer: 'Gönüllü',
    };
    return roleNames[role] || 'Kullanıcı';
  };

  const formatDate = dateString => {
    if (!dateString) return 'Hiç giriş yapılmamış';
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const tabs = [
    { id: 'profile', label: 'Profil Bilgileri', icon: User },
    { id: 'security', label: 'Güvenlik', icon: Shield },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'privacy', label: 'Gizlilik', icon: Lock },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh'
      }}
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '32px',
          padding: '24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          color: 'white'
        }}
      >
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            Profil Ayarları
          </h1>
          <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>Hesap bilgilerinizi ve tercihlerinizi yönetin</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '12px',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          <Save size={16} />
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </motion.button>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            height: 'fit-content'
          }}
        >
          {/* User Info */}
          <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#667eea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600',
              fontSize: '2rem',
              margin: '0 auto 16px auto'
            }}>
              {formData.fullName.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
              {formData.fullName}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 8px 0' }}>
              {formData.email}
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 12px',
              backgroundColor: '#dcfce7',
              color: '#166534',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              <Shield size={12} />
              {getRoleName(formData.role)}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tabs.map((tab, index) => {
              const IconComponent = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: activeTab === tab.id ? '#667eea' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#64748b',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  whileHover={{ backgroundColor: activeTab === tab.id ? '#5a67d8' : '#f8fafc' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <IconComponent size={18} />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}
        >
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 24px 0' }}>
                Profil Bilgileri
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Ad Soyad
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    E-posta
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Telefon
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Konum
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '32px', padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                  Hesap Bilgileri
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Rol</span>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', margin: '4px 0 0 0' }}>
                      {getRoleName(formData.role)}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Son Giriş</span>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', margin: '4px 0 0 0' }}>
                      {formatDate(formData.lastLogin)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 24px 0' }}>
                Güvenlik Ayarları
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                    İki Faktörlü Doğrulama
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 4px 0' }}>
                        Hesabınızı daha güvenli hale getirin
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                        SMS veya uygulama ile doğrulama
                      </p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                      <input
                        type="checkbox"
                        checked={formData.security.twoFactorAuth}
                        onChange={(e) => handleNestedChange('security', 'twoFactorAuth', e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: formData.security.twoFactorAuth ? '#10b981' : '#d1d5db',
                        borderRadius: '24px',
                        transition: '0.3s'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '""',
                          height: '18px',
                          width: '18px',
                          left: '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          transition: '0.3s',
                          transform: formData.security.twoFactorAuth ? 'translateX(24px)' : 'translateX(0)'
                        }} />
                      </span>
                    </label>
                  </div>
                </div>

                <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                    Oturum Zaman Aşımı
                  </h3>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Dakika cinsinden
                    </label>
                    <input
                      type="number"
                      value={formData.security.sessionTimeout}
                      onChange={(e) => handleNestedChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      min="5"
                      max="480"
                      style={{
                        width: '200px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                    Şifre Değişikliği
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 4px 0' }}>
                        Bir sonraki girişte şifre değişikliği zorunlu
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                        Güvenlik için önerilir
                      </p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                      <input
                        type="checkbox"
                        checked={formData.security.passwordChangeRequired}
                        onChange={(e) => handleNestedChange('security', 'passwordChangeRequired', e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: formData.security.passwordChangeRequired ? '#10b981' : '#d1d5db',
                        borderRadius: '24px',
                        transition: '0.3s'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '""',
                          height: '18px',
                          width: '18px',
                          left: '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          transition: '0.3s',
                          transform: formData.security.passwordChangeRequired ? 'translateX(24px)' : 'translateX(0)'
                        }} />
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 24px 0' }}>
                Bildirim Ayarları
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.entries(formData.notifications).map(([key, value]) => (
                  <div key={key} style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                          {key === 'email' ? 'E-posta Bildirimleri' :
                           key === 'sms' ? 'SMS Bildirimleri' :
                           key === 'push' ? 'Push Bildirimleri' :
                           'Sistem Bildirimleri'}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                          {key === 'email' ? 'E-posta ile bildirim al' :
                           key === 'sms' ? 'SMS ile bildirim al' :
                           key === 'push' ? 'Tarayıcı push bildirimleri' :
                           'Sistem güncellemeleri ve uyarılar'}
                        </p>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleNestedChange('notifications', key, e.target.checked)}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: value ? '#10b981' : '#d1d5db',
                          borderRadius: '24px',
                          transition: '0.3s'
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '""',
                            height: '18px',
                            width: '18px',
                            left: '3px',
                            bottom: '3px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            transition: '0.3s',
                            transform: value ? 'translateX(24px)' : 'translateX(0)'
                          }} />
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 24px 0' }}>
                Gizlilik Ayarları
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                    Profil Görünürlüğü
                  </h3>
                  <select
                    value={formData.privacy.profileVisibility}
                    onChange={(e) => handleNestedChange('privacy', 'profileVisibility', e.target.value)}
                    style={{
                      width: '200px',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  >
                    <option value="public">Herkese Açık</option>
                    <option value="private">Gizli</option>
                    <option value="friends">Sadece Arkadaşlar</option>
                  </select>
                </div>

                <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                    Bilgi Görünürlüğü
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {Object.entries(formData.privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', margin: '0 0 4px 0' }}>
                            {key === 'showEmail' ? 'E-posta Adresi' :
                             key === 'showPhone' ? 'Telefon Numarası' :
                             'Konum Bilgisi'}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                            {key === 'showEmail' ? 'E-posta adresinizi göster' :
                             key === 'showPhone' ? 'Telefon numaranızı göster' :
                             'Konum bilginizi göster'}
                          </p>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleNestedChange('privacy', key, e.target.checked)}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: value ? '#10b981' : '#d1d5db',
                            borderRadius: '24px',
                            transition: '0.3s'
                          }}>
                            <span style={{
                              position: 'absolute',
                              content: '""',
                              height: '18px',
                              width: '18px',
                              left: '3px',
                              bottom: '3px',
                              backgroundColor: 'white',
                              borderRadius: '50%',
                              transition: '0.3s',
                              transform: value ? 'translateX(24px)' : 'translateX(0)'
                            }} />
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileSettings;
