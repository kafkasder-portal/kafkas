import { AnimatePresence, motion } from 'framer-motion';
import {
  Brain,
  Calendar,
  Coins,
  Lightbulb,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const AISuggestions = ({ type = 'general' }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  // Mock AI suggestions based on type
  const mockSuggestions = {
    general: [
      {
        id: 1,
        type: 'donation',
        title: 'Bağış Kampanyası Önerisi',
        description:
          'Son 30 günde bağış oranları %15 düştü. Yeni kampanya başlatmanızı öneriyoruz.',
        priority: 'high',
        action: 'Kampanya Oluştur',
        icon: Coins,
        impact: '+25% bağış artışı bekleniyor',
      },
      {
        id: 2,
        type: 'volunteer',
        title: 'Gönüllü Etkinliği',
        description:
          'Aktif gönüllü sayınız artıyor. Yeni etkinlik planlamanızı öneriyoruz.',
        priority: 'medium',
        action: 'Etkinlik Planla',
        icon: Users,
        impact: '+10 gönüllü katılımı',
      },
      {
        id: 3,
        type: 'finance',
        title: 'Mali Optimizasyon',
        description:
          'Giderleriniz %8 artmış. Maliyet kontrolü için önlem almanızı öneriyoruz.',
        priority: 'high',
        action: 'Rapor İncele',
        icon: TrendingUp,
        impact: '-15% gider azalması',
      },
    ],
    donations: [
      {
        id: 4,
        type: 'campaign',
        title: 'Ramazan Kampanyası',
        description:
          'Ramazan ayı yaklaşıyor. Özel bağış kampanyası başlatmanızı öneriyoruz.',
        priority: 'high',
        action: 'Kampanya Başlat',
        icon: Calendar,
        impact: '+40% bağış artışı',
      },
    ],
    volunteers: [
      {
        id: 5,
        type: 'training',
        title: 'Gönüllü Eğitimi',
        description:
          'Yeni gönüllüler için eğitim programı düzenlemenizi öneriyoruz.',
        priority: 'medium',
        action: 'Eğitim Planla',
        icon: Brain,
        impact: '+30% verimlilik',
      },
    ],
  };

  useEffect(() => {
    // Simulate AI processing
    const loadSuggestions = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuggestions(mockSuggestions[type] || mockSuggestions.general);
      setLoading(false);
    };

    loadSuggestions();
  }, [type]);

  const handleSuggestionAction = suggestion => {
    setSelectedSuggestion(suggestion);
    toast.success(`${suggestion.action} işlemi başlatıldı!`);

    // Simulate action completion
    setTimeout(() => {
      setSelectedSuggestion(null);
      toast.success(`${suggestion.title} başarıyla uygulandı!`);
    }, 2000);
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityIcon = priority => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  if (loading) {
    return (
      <div className='bg-white rounded-lg shadow-sm border p-6'>
        <div className='flex items-center space-x-3 mb-4'>
          <Brain className='h-6 w-6 text-blue-600' />
          <h3 className='text-lg font-semibold text-gray-900'>AI Önerileri</h3>
        </div>
        <div className='space-y-3'>
          {[1, 2, 3].map(i => (
            <div key={i} className='animate-pulse'>
              <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
              <div className='h-3 bg-gray-200 rounded w-1/2'></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-sm border p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center space-x-3'>
          <Brain className='h-6 w-6 text-blue-600' />
          <h3 className='text-lg font-semibold text-gray-900'>AI Önerileri</h3>
        </div>
        <span className='text-sm text-gray-500'>
          {suggestions.length} öneri
        </span>
      </div>

      <AnimatePresence>
        {suggestions.map((suggestion, index) => {
          const IconComponent = suggestion.icon;
          return (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-4 mb-4 transition-all duration-200 hover:shadow-md ${
                selectedSuggestion?.id === suggestion.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <div className='flex items-start justify-between'>
                <div className='flex items-start space-x-3 flex-1'>
                  <div className='flex-shrink-0'>
                    <IconComponent className='h-5 w-5 text-blue-600' />
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <h4 className='font-medium text-gray-900'>
                        {suggestion.title}
                      </h4>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(suggestion.priority)}`}
                      >
                        {getPriorityIcon(suggestion.priority)}{' '}
                        {suggestion.priority}
                      </span>
                    </div>
                    <p className='text-sm text-gray-600 mb-3'>
                      {suggestion.description}
                    </p>
                    <div className='flex items-center space-x-4'>
                      <span className='text-xs text-green-600 font-medium'>
                        💡 {suggestion.impact}
                      </span>
                      <button
                        onClick={() => handleSuggestionAction(suggestion)}
                        disabled={selectedSuggestion?.id === suggestion.id}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                          selectedSuggestion?.id === suggestion.id
                            ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {selectedSuggestion?.id === suggestion.id
                          ? 'Uygulanıyor...'
                          : suggestion.action}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {suggestions.length === 0 && (
        <div className='text-center py-8'>
          <Lightbulb className='h-12 w-12 text-gray-300 mx-auto mb-4' />
          <p className='text-gray-500'>Şu anda öneri bulunmuyor.</p>
        </div>
      )}
    </div>
  );
};

export default AISuggestions;
