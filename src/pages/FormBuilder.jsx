import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Save,
  Eye,
  Download,
  Trash2,
  Settings,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import DynamicFormBuilder from '../components/DynamicFormBuilder';

const FormBuilder = () => {
  const [activeTab, setActiveTab] = useState('builder');
  const [formTitle, setFormTitle] = useState('Yeni Form');
  const [formDescription, setFormDescription] = useState('');
  const [savedForms, setSavedForms] = useState([
    {
      id: 1,
      title: 'Bağış Başvuru Formu',
      description: 'Bağış yapmak isteyen kişiler için form',
      elements: 8,
      createdAt: '2024-01-15',
      status: 'active',
    },
    {
      id: 2,
      title: 'Gönüllü Kayıt Formu',
      description: 'Gönüllü olmak isteyen kişiler için form',
      elements: 12,
      createdAt: '2024-01-10',
      status: 'draft',
    },
  ]);

  const handleSaveForm = () => {
    toast.success('Form başarıyla kaydedildi!');
  };

  const handleExportForm = () => {
    toast.success('Form dışa aktarıldı!');
  };

  const handleDuplicateForm = formId => {
    toast.success('Form kopyalandı!');
  };

  const handleDeleteForm = formId => {
    setSavedForms(prev => prev.filter(form => form.id !== formId));
    toast.success('Form silindi!');
  };

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Form Oluşturucu
        </h1>
        <p className='text-gray-600'>Drag & drop ile özel formlar oluşturun</p>
      </div>

      {/* Tabs */}
      <div className='flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6'>
        <button
          onClick={() => setActiveTab('builder')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'builder'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Form Oluşturucu
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'templates'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Şablonlar
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'saved'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Kaydedilen Formlar
        </button>
      </div>

      {/* Content */}
      {activeTab === 'builder' && (
        <div className='space-y-6'>
          {/* Form Settings */}
          <div className='bg-white rounded-lg shadow-sm border p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Form Ayarları
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Form Başlığı
                </label>
                <input
                  type='text'
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Form başlığını girin'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Açıklama
                </label>
                <input
                  type='text'
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Form açıklaması'
                />
              </div>
            </div>
          </div>

          {/* Form Builder */}
          <div className='bg-white rounded-lg shadow-sm border'>
            <div className='border-b border-gray-200 p-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Form Tasarımı
                </h3>
                <div className='flex space-x-2'>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveForm}
                    className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                  >
                    <Save className='h-4 w-4 mr-2' />
                    Kaydet
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExportForm}
                    className='flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                  >
                    <Download className='h-4 w-4 mr-2' />
                    Dışa Aktar
                  </motion.button>
                </div>
              </div>
            </div>
            <div className='p-6'>
              <DynamicFormBuilder />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className='bg-white rounded-lg shadow-sm border p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Form Şablonları
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[
              {
                title: 'Bağış Formu',
                description: 'Bağış toplama için hazır şablon',
                icon: '💰',
              },
              {
                title: 'Gönüllü Kayıt',
                description: 'Gönüllü kayıt formu',
                icon: '🤝',
              },
              {
                title: 'Etkinlik Kayıt',
                description: 'Etkinlik katılım formu',
                icon: '📅',
              },
              {
                title: 'İletişim Formu',
                description: 'Genel iletişim formu',
                icon: '📧',
              },
              {
                title: 'Şikayet Formu',
                description: 'Şikayet ve öneri formu',
                icon: '📝',
              },
              {
                title: 'Başvuru Formu',
                description: 'Genel başvuru formu',
                icon: '📋',
              },
            ].map((template, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer'
              >
                <div className='text-3xl mb-3'>{template.icon}</div>
                <h4 className='font-semibold text-gray-900 mb-2'>
                  {template.title}
                </h4>
                <p className='text-sm text-gray-600 mb-3'>
                  {template.description}
                </p>
                <button className='w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'>
                  Kullan
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'saved' && (
        <div className='bg-white rounded-lg shadow-sm border p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Kaydedilen Formlar
          </h3>
          <div className='space-y-4'>
            {savedForms.map(form => (
              <motion.div
                key={form.id}
                whileHover={{ x: 4 }}
                className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <h4 className='font-semibold text-gray-900 mb-1'>
                      {form.title}
                    </h4>
                    <p className='text-sm text-gray-600 mb-2'>
                      {form.description}
                    </p>
                    <div className='flex items-center space-x-4 text-xs text-gray-500'>
                      <span>{form.elements} alan</span>
                      <span>Oluşturulma: {form.createdAt}</span>
                      <span
                        className={`px-2 py-1 rounded-full ${
                          form.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {form.status === 'active' ? 'Aktif' : 'Taslak'}
                      </span>
                    </div>
                  </div>
                  <div className='flex space-x-2'>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDuplicateForm(form.id)}
                      className='p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors'
                      title='Kopyala'
                    >
                      <Copy className='h-4 w-4' />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleExportForm()}
                      className='p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors'
                      title='Dışa Aktar'
                    >
                      <Download className='h-4 w-4' />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteForm(form.id)}
                      className='p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors'
                      title='Sil'
                    >
                      <Trash2 className='h-4 w-4' />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
