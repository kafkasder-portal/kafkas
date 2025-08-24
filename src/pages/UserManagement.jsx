import { AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Check,
  Clock,
  Edit,
  Eye,
  EyeOff,
  Filter,
  Mail,
  Plus,
  Search,
  Shield,
  User,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';

import { useAuth } from '../contexts/AuthContext';
import { useForm } from '../hooks/useForm';
import { useModal } from '../hooks/useModal';
import { toast } from 'sonner';

const UserManagement = () => {
  const { users, addUser, updateUser, deactivateUser, getRoleName, ROLES } =
    useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const modal = useModal();
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);


  // Form validation rules
  const validationRules = {
    username: {
      required: true,
      label: 'Kullanıcı adı',
      validator: value => {
        const existingUser = users.find(
          u =>
            u.username === value?.trim() &&
            (!editingUser || u.id !== editingUser.id)
        );
        if (existingUser) {
          return 'Bu kullanıcı adı zaten kullanılıyor';
        }
        return null;
      },
    },
    password: {
      required: !editingUser,
      label: 'Şifre',
    },
    email: {
      required: true,
      label: 'E-posta',
      email: true,
    },
    fullName: {
      required: true,
      label: 'Ad soyad',
    },
  };

  const form = useForm(
    {
      username: '',
      password: '',
      email: '',
      fullName: '',
      role: ROLES.VIEWER,
    },
    validationRules
  );

  // Filtreleme
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === '' || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  // Form gönderme
  const handleFormSubmit = async values => {
    try {
      if (editingUser) {
        const updateData = { ...values };
        if (!updateData.password) {
          delete updateData.password;
        }
        updateUser(editingUser.id, updateData);
        success('Kullanıcı başarıyla güncellendi!');
      } else {
        addUser(values);
        success('Yeni kullanıcı başarıyla eklendi!');
      }

      modal.close();
      setEditingUser(null);
      form.reset();
    } catch (err) {
      error(err.message || 'Bir hata oluştu!');
      throw err; // Re-throw to keep form in submitting state
    }
  };

  // Kullanıcı düzenleme
  const handleEditUser = user => {
    setEditingUser(user);
    form.setValues({
      username: user.username,
      password: '',
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });
    modal.open();
  };

  // Kullanıcı deaktif etme
  const handleDeactivateUser = async user => {
    if (
      window.confirm(
        `${user.fullName} kullanıcısını deaktif etmek istediğinize emin misiniz?`
      )
    ) {
      try {
        deactivateUser(user.id);
        success('Kullanıcı başarıyla deaktif edildi!');
      } catch (err) {
        error(err.message || 'Bir hata oluştu!');
      }
    }
  };

  // Modal kapatma
  const handleCloseModal = () => {
    modal.close();
    setEditingUser(null);
    form.reset();
  };

  // const getRoleColor = role => {
  //   const colors = {
  //     [ROLES.ADMIN]: '#ef4444',
  //     [ROLES.MANAGER]: '#3b82f6',
  //     [ROLES.COORDINATOR]: '#10b981',
  //     [ROLES.VOLUNTEER]: '#f59e0b',
  //     [ROLES.VIEWER]: '#64748b',
  //   };
  //   return colors[role] || '#64748b';
  // };

  // const formatDate = dateString => {
  //   if (!dateString) return 'Hiç giriş yapılmamış';
  //   return new Date(dateString).toLocaleString('tr-TR');
  // };

  return (
    <ProtectedRoute requiredRole={ROLES.ADMIN}>
      <div style={{ padding: '2rem' }}>
        {/* Toast Bildirimi */}


        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Users size={32} style={{ color: '#3b82f6' }} />
            <h1
              style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}
            >
              Kullanıcı Yönetimi
            </h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={modal.open}
          >
            <Plus size={20} />
            <span>Yeni Kullanıcı</span>
          </motion.button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Search
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    color: '#6b7280',
                  }}
                />
                <input
                  type='text'
                  placeholder='Kullanıcı ara...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            <div style={{ minWidth: '200px' }}>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Filter
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    color: '#6b7280',
                  }}
                />
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    backgroundColor: 'white',
                  }}
                >
                  <option value=''>Tüm Roller</option>
                  {Object.entries(ROLES).map(([_key, value]) => (
                    <option key={value} value={value}>
                      {getRoleName(value)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#4b5563',
                    }}
                  >
                    Kullanıcı
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#4b5563',
                    }}
                  >
                    Rol
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#4b5563',
                    }}
                  >
                    Durum
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#4b5563',
                    }}
                  >
                    Son Giriş
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#4b5563',
                    }}
                  >
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      cursor: 'pointer',
                    }}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                        }}
                      >
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#e0e7ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <User size={20} style={{ color: '#6366f1' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1f2937' }}>
                            {user.fullName}
                          </div>
                          <div
                            style={{ fontSize: '0.875rem', color: '#6b7280' }}
                          >
                            @{user.username}
                          </div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: '#9ca3af',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <Mail size={12} />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor:
                            user.role === ROLES.ADMIN
                              ? '#fee2e2'
                              : user.role === ROLES.MODERATOR
                                ? '#fef3c7'
                                : '#e0e7ff',
                          color:
                            user.role === ROLES.ADMIN
                              ? '#dc2626'
                              : user.role === ROLES.MODERATOR
                                ? '#d97706'
                                : '#6366f1',
                        }}
                      >
                        <Shield
                          size={12}
                          style={{ display: 'inline', marginRight: '0.25rem' }}
                        />
                        {getRoleName(user.role)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: user.isActive
                            ? '#d1fae5'
                            : '#fee2e2',
                          color: user.isActive ? '#059669' : '#dc2626',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        {user.isActive ? <Check size={12} /> : <X size={12} />}
                        {user.isActive ? 'Aktif' : 'Deaktif'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: '#6b7280',
                          fontSize: '0.875rem',
                        }}
                      >
                        <Clock size={14} />
                        {user.lastLogin || 'Henüz giriş yapmadı'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          justifyContent: 'center',
                        }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditUser(user)}
                          style={{
                            padding: '0.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#e0e7ff',
                            color: '#6366f1',
                            cursor: 'pointer',
                          }}
                        >
                          <Edit size={16} />
                        </motion.button>
                        {user.isActive && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeactivateUser(user)}
                            style={{
                              padding: '0.5rem',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              cursor: 'pointer',
                            }}
                          >
                            <EyeOff size={16} />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Add/Edit User Modal */}
        <AnimatePresence>
          {modal.isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 50,
              }}
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '2rem',
                  width: '90%',
                  maxWidth: '500px',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                }}
              >
                <h2
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1.5rem',
                  }}
                >
                  {editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
                </h2>

                <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                        }}
                      >
                        Kullanıcı Adı
                      </label>
                      <input
                        type='text'
                        name='username'
                        value={form.values.username}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border:
                            form.errors.username && form.touched.username
                              ? '1px solid #ef4444'
                              : '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                      />
                      {form.errors.username && form.touched.username && (
                        <div
                          style={{
                            color: '#ef4444',
                            fontSize: '0.75rem',
                            marginTop: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <AlertCircle size={12} />
                          {form.errors.username}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                        }}
                      >
                        Şifre {editingUser && '(Boş bırakırsanız değişmez)'}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name='password'
                          value={form.values.password}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            paddingRight: '2.5rem',
                            border:
                              form.errors.password && form.touched.password
                                ? '1px solid #ef4444'
                                : '1px solid #e5e7eb',
                            borderRadius: '8px',
                          }}
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                          }}
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      {form.errors.password && form.touched.password && (
                        <div
                          style={{
                            color: '#ef4444',
                            fontSize: '0.75rem',
                            marginTop: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <AlertCircle size={12} />
                          {form.errors.password}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                        }}
                      >
                        E-posta
                      </label>
                      <input
                        type='email'
                        name='email'
                        value={form.values.email}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border:
                            form.errors.email && form.touched.email
                              ? '1px solid #ef4444'
                              : '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                      />
                      {form.errors.email && form.touched.email && (
                        <div
                          style={{
                            color: '#ef4444',
                            fontSize: '0.75rem',
                            marginTop: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <AlertCircle size={12} />
                          {form.errors.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                        }}
                      >
                        Ad Soyad
                      </label>
                      <input
                        type='text'
                        name='fullName'
                        value={form.values.fullName}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border:
                            form.errors.fullName && form.touched.fullName
                              ? '1px solid #ef4444'
                              : '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                      />
                      {form.errors.fullName && form.touched.fullName && (
                        <div
                          style={{
                            color: '#ef4444',
                            fontSize: '0.75rem',
                            marginTop: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <AlertCircle size={12} />
                          {form.errors.fullName}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                        }}
                      >
                        Rol
                      </label>
                      <select
                        name='role'
                        value={form.values.role}
                        onChange={form.handleChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                        }}
                      >
                        {Object.entries(ROLES).map(([_key, value]) => (
                          <option key={value} value={value}>
                            {getRoleName(value)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      marginTop: '1.5rem',
                    }}
                  >
                    <motion.button
                      type='submit'
                      disabled={form.isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        backgroundColor: form.isSubmitting
                          ? '#9ca3af'
                          : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: form.isSubmitting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {form.isSubmitting
                        ? 'Kaydediliyor...'
                        : editingUser
                          ? 'Güncelle'
                          : 'Ekle'}
                    </motion.button>
                    <motion.button
                      type='button'
                      onClick={handleCloseModal}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        backgroundColor: '#f3f4f6',
                        color: '#4b5563',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      İptal
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
};

export default UserManagement;
