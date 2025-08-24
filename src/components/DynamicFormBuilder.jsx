import { AnimatePresence } from 'framer-motion';
import {
  Calendar,
  CheckSquare,
  Edit3,
  Eye,
  FileText,
  Hash,
  Image,
  List,
  Mail,
  MapPin,
  Move,
  Phone,
  Plus,
  Radio,
  Save,
  Settings,
  Star,
  Trash2,
  Type,
} from 'lucide-react';
import { useState } from 'react';

const DynamicFormBuilder = () => {
  const [formElements, setFormElements] = useState([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [formTitle, setFormTitle] = useState('Yeni Form');
  const [formDescription, setFormDescription] = useState('');
  const [selectedElement, setSelectedElement] = useState(null);

  const fieldTypes = [
    { id: 'text', name: 'Metin', icon: Type, color: '#3b82f6' },
    { id: 'email', name: 'Email', icon: Mail, color: '#10b981' },
    { id: 'phone', name: 'Telefon', icon: Phone, color: '#f59e0b' },
    { id: 'number', name: 'Sayı', icon: Hash, color: '#8b5cf6' },
    { id: 'date', name: 'Tarih', icon: Calendar, color: '#ef4444' },
    { id: 'textarea', name: 'Uzun Metin', icon: FileText, color: '#06b6d4' },
    { id: 'select', name: 'Seçim Listesi', icon: List, color: '#84cc16' },
    { id: 'radio', name: 'Tek Seçim', icon: Radio, color: '#f97316' },
    {
      id: 'checkbox',
      name: 'Çoklu Seçim',
      icon: CheckSquare,
      color: '#ec4899',
    },
    { id: 'rating', name: 'Değerlendirme', icon: Star, color: '#fbbf24' },
    { id: 'file', name: 'Dosya', icon: Image, color: '#6b7280' },
    { id: 'address', name: 'Adres', icon: MapPin, color: '#14b8a6' },
  ];

  const addElement = type => {
    const newElement = {
      id: Date.now(),
      type,
      label: `${fieldTypes.find(f => f.id === type)?.name} ${formElements.length + 1}`,
      placeholder: '',
      required: false,
      options:
        type === 'select' || type === 'radio' || type === 'checkbox'
          ? ['Seçenek 1', 'Seçenek 2']
          : [],
      validation: {},
      style: {},
    };
    setFormElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
  };

  const updateElement = (id, updates) => {
    setFormElements(prev =>
      prev.map(element =>
        element.id === id ? { ...element, ...updates } : element
      )
    );
  };

  const deleteElement = id => {
    setFormElements(prev => prev.filter(element => element.id !== id));
    setSelectedElement(null);
  };

  const moveElement = (dragIndex, dropIndex) => {
    const draggedElement = formElements[dragIndex];
    const newElements = [...formElements];
    newElements.splice(dragIndex, 1);
    newElements.splice(dropIndex, 0, draggedElement);
    setFormElements(newElements);
  };

  const renderFieldPreview = element => {
    const commonStyles = {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.875rem',
      outline: 'none',
    };

    switch (element.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <input
            type={element.type}
            placeholder={element.placeholder}
            style={commonStyles}
            required={element.required}
          />
        );

      case 'number':
        return (
          <input
            type='number'
            placeholder={element.placeholder}
            style={commonStyles}
            required={element.required}
          />
        );

      case 'date':
        return (
          <input type='date' style={commonStyles} required={element.required} />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={element.placeholder}
            rows='4'
            style={{ ...commonStyles, resize: 'vertical' }}
            required={element.required}
          />
        );

      case 'select':
        return (
          <select style={commonStyles} required={element.required}>
            <option value=''>Seçim yapın</option>
            {element.options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {element.options.map((option, idx) => (
              <label
                key={idx}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <input
                  type='radio'
                  name={`radio_${element.id}`}
                  value={option}
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {element.options.map((option, idx) => (
              <label
                key={idx}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <input type='checkbox' value={option} />
                {option}
              </label>
            ))}
          </div>
        );

      case 'rating':
        return (
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} size={24} color='#fbbf24' fill='#fbbf24' />
            ))}
          </div>
        );

      case 'file':
        return (
          <input type='file' style={commonStyles} required={element.required} />
        );

      default:
        return (
          <input
            type='text'
            style={commonStyles}
            placeholder={element.placeholder}
          />
        );
    }
  };

  const ElementEditor = ({ element }) => {
    if (!element) return null;

    return (
      <motion.div
        className='card'
        style={{ position: 'sticky', top: '2rem' }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h4
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <Settings size={18} />
          Özellikler
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label
              style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                display: 'block',
              }}
            >
              Etiket
            </label>
            <input
              type='text'
              value={element.label}
              onChange={e =>
                updateElement(element.id, { label: e.target.value })
              }
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                display: 'block',
              }}
            >
              Placeholder
            </label>
            <input
              type='text'
              value={element.placeholder}
              onChange={e =>
                updateElement(element.id, { placeholder: e.target.value })
              }
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                outline: 'none',
              }}
            />
          </div>

          {(element.type === 'select' ||
            element.type === 'radio' ||
            element.type === 'checkbox') && (
            <div>
              <label
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  display: 'block',
                }}
              >
                Seçenekler
              </label>
              {element.options.map((option, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <input
                    type='text'
                    value={option}
                    onChange={e => {
                      const newOptions = [...element.options];
                      newOptions[idx] = e.target.value;
                      updateElement(element.id, { options: newOptions });
                    }}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => {
                      const newOptions = element.options.filter(
                        (_, i) => i !== idx
                      );
                      updateElement(element.id, { options: newOptions });
                    }}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#fee2e2',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={14} color='#dc2626' />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newOptions = [
                    ...element.options,
                    `Seçenek ${element.options.length + 1}`,
                  ];
                  updateElement(element.id, { options: newOptions });
                }}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: '#f3f4f6',
                  border: '1px dashed #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                + Seçenek Ekle
              </button>
            </div>
          )}

          <label
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <input
              type='checkbox'
              checked={element.required}
              onChange={e =>
                updateElement(element.id, { required: e.target.checked })
              }
            />
            <span style={{ fontSize: '0.875rem' }}>Zorunlu alan</span>
          </label>

          <button
            onClick={() => deleteElement(element.id)}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            <Trash2 size={16} style={{ marginRight: '0.5rem' }} />
            Alanı Sil
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className='page-container'>
      <motion.div
        className='page-header'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className='page-title'>Form Oluşturucu</h1>
          <p className='page-subtitle'>
            Dinamik formlar oluşturun ve özelleştirin
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <motion.button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: isPreviewMode ? '#10b981' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isPreviewMode ? <Edit3 size={16} /> : <Eye size={16} />}
            {isPreviewMode ? 'Düzenle' : 'Önizle'}
          </motion.button>
          <motion.button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save size={16} />
            Kaydet
          </motion.button>
        </div>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isPreviewMode ? '1fr' : '1fr 300px',
          gap: '2rem',
        }}
      >
        <div>
          {/* Form Header */}
          <motion.div
            className='card'
            style={{ marginBottom: '1rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {!isPreviewMode ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <input
                  type='text'
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder='Form Başlığı'
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'rgba(0,0,0,0)',
                  }}
                />
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder='Form açıklaması...'
                  rows='2'
                  style={{
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'rgba(0,0,0,0)',
                    resize: 'none',
                    color: '#6b7280',
                  }}
                />
              </div>
            ) : (
              <div>
                <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>
                  {formTitle}
                </h2>
                {formDescription && (
                  <p style={{ margin: 0, color: '#6b7280' }}>
                    {formDescription}
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Field Types Palette */}
          {!isPreviewMode && (
            <motion.div
              className='card'
              style={{ marginBottom: '2rem' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h4 style={{ marginBottom: '1rem' }}>Alan Türleri</h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: '0.5rem',
                }}
              >
                {fieldTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <motion.button
                      key={type.id}
                      onClick={() => addElement(type.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '1rem 0.5rem',
                        backgroundColor: 'rgba(0,0,0,0)',
                        border: `2px dashed ${type.color}40`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        color: type.color,
                      }}
                      whileHover={{
                        backgroundColor: `${type.color}10`,
                        borderColor: type.color,
                        scale: 1.05,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon size={20} />
                      {type.name}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Form Fields */}
          <motion.div
            className='card'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence>
              {formElements.length === 0 ? (
                <motion.div
                  style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: '#6b7280',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Plus size={48} color='#d1d5db' />
                  <p style={{ marginTop: '1rem', fontSize: '1.125rem' }}>
                    {isPreviewMode
                      ? 'Form henüz boş'
                      : 'Form alanları eklemek için yukarıdaki butonları kullanın'}
                  </p>
                </motion.div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                  }}
                >
                  {formElements.map((element, index) => {
                    const fieldType = fieldTypes.find(
                      f => f.id === element.type
                    );
                    const Icon = fieldType?.icon;

                    return (
                      <motion.div
                        key={element.id}
                        style={{
                          position: 'relative',
                          padding: '1rem',
                          border:
                            selectedElement === element.id
                              ? `2px solid ${fieldType?.color}`
                              : '1px solid #e5e7eb',
                          borderRadius: '8px',
                          backgroundColor:
                            selectedElement === element.id
                              ? `${fieldType?.color}05`
                              : 'rgba(0,0,0,0)',
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() =>
                          !isPreviewMode && setSelectedElement(element.id)
                        }
                      >
                        {!isPreviewMode && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '-10px',
                              right: '1rem',
                              display: 'flex',
                              gap: '0.25rem',
                            }}
                          >
                            <motion.button
                              onClick={e => {
                                e.stopPropagation();
                                deleteElement(element.id);
                              }}
                              style={{
                                padding: '0.25rem',
                                backgroundColor: 'white',
                                border: '1px solid #fee2e2',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                              whileHover={{ backgroundColor: '#fee2e2' }}
                            >
                              <Trash2 size={12} color='#dc2626' />
                            </motion.button>
                            <motion.button
                              style={{
                                padding: '0.25rem',
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '4px',
                                cursor: 'move',
                              }}
                            >
                              <Move size={12} />
                            </motion.button>
                          </div>
                        )}

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                          }}
                        >
                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#374151',
                            }}
                          >
                            {!isPreviewMode && (
                              <Icon size={16} color={fieldType?.color} />
                            )}
                            {element.label}
                            {element.required && (
                              <span style={{ color: '#dc2626' }}>*</span>
                            )}
                          </label>
                          {renderFieldPreview(element)}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>

            {formElements.length > 0 && (
              <motion.div
                style={{ marginTop: '2rem', textAlign: 'center' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.button
                  style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                  whileHover={{ scale: 1.02, backgroundColor: '#5a67d8' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Gönder
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Element Editor Sidebar */}
        {!isPreviewMode && (
          <div>
            {selectedElement ? (
              <ElementEditor
                element={formElements.find(e => e.id === selectedElement)}
              />
            ) : (
              <motion.div
                className='card'
                style={{ position: 'sticky', top: '2rem' }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#6b7280',
                  }}
                >
                  <Settings size={48} color='#d1d5db' />
                  <p style={{ marginTop: '1rem' }}>
                    Düzenlemek için bir alan seçin
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicFormBuilder;
