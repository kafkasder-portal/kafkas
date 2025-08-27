import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Award,
  Heart,
  Shield,
  Activity,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import './Volunteers.css';

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSkills, setFilterSkills] = useState('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load volunteers data
  useEffect(() => {
    const loadVolunteers = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for development
      const mockVolunteers = [
        {
          id: 1,
          name: 'Ahmet Yılmaz',
          email: 'ahmet@example.com',
          phone: '+90 532 123 4567',
          address: 'İstanbul, Türkiye',
          status: 'active',
          skills: ['Sağlık', 'Eğitim', 'Lojistik'],
          experience: '5 yıl',
          totalHours: 1200,
          rating: 4.8,
          joinDate: '2020-03-15',
          lastActivity: '2024-01-20',
          availability: 'Hafta sonu',
          notes: 'Doktor, acil yardım konusunda uzman',
          avatar: null,
        },
        {
          id: 2,
          name: 'Fatma Demir',
          email: 'fatma@example.com',
          phone: '+90 533 234 5678',
          address: 'Ankara, Türkiye',
          status: 'active',
          skills: ['Eğitim', 'Çeviri', 'Organizasyon'],
          experience: '3 yıl',
          totalHours: 850,
          rating: 4.9,
          joinDate: '2021-06-10',
          lastActivity: '2024-01-19',
          availability: 'Hafta içi',
          notes: 'Öğretmen, çok dilli',
          avatar: null,
        },
        {
          id: 3,
          name: 'Mehmet Kaya',
          email: 'mehmet@example.com',
          phone: '+90 534 345 6789',
          address: 'İzmir, Türkiye',
          status: 'inactive',
          skills: ['Teknik', 'IT', 'Ağ'],
          experience: '2 yıl',
          totalHours: 450,
          rating: 4.5,
          joinDate: '2022-01-20',
          lastActivity: '2023-12-15',
          availability: 'Esnek',
          notes: 'Yazılım geliştirici',
          avatar: null,
        },
        {
          id: 4,
          name: 'Ayşe Özkan',
          email: 'ayse@example.com',
          phone: '+90 535 456 7890',
          address: 'Bursa, Türkiye',
          status: 'pending',
          skills: ['Psikoloji', 'Danışmanlık'],
          experience: '1 yıl',
          totalHours: 200,
          rating: 4.7,
          joinDate: '2023-08-05',
          lastActivity: '2024-01-18',
          availability: 'Hafta sonu',
          notes: 'Psikolog, travma sonrası destek',
          avatar: null,
        },
        {
          id: 5,
          name: 'Ali Çelik',
          email: 'ali@example.com',
          phone: '+90 536 567 8901',
          address: 'Antalya, Türkiye',
          status: 'active',
          skills: ['Lojistik', 'Nakliye', 'Depo'],
          experience: '4 yıl',
          totalHours: 950,
          rating: 4.6,
          joinDate: '2020-09-12',
          lastActivity: '2024-01-21',
          availability: 'Tam zamanlı',
          notes: 'Nakliye şirketi sahibi',
          avatar: null,
        },
      ];
      
      setVolunteers(mockVolunteers);
      setLoading(false);
    };

    loadVolunteers();
  }, []);

  // Filter and search volunteers
  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatusFilter = filterStatus === 'all' || volunteer.status === filterStatus;
    const matchesSkillsFilter = filterSkills === 'all' || volunteer.skills.includes(filterSkills);
    
    return matchesSearch && matchesStatusFilter && matchesSkillsFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredVolunteers.length / itemsPerPage);
  const paginatedVolunteers = filteredVolunteers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const activeVolunteers = volunteers.filter(v => v.status === 'active').length;
  const totalHours = volunteers.reduce((sum, v) => sum + v.totalHours, 0);
  const averageRating = volunteers.reduce((sum, v) => sum + v.rating, 0) / volunteers.length;

  // Handle volunteer selection
  const handleVolunteerClick = useCallback((volunteer) => {
    setSelectedVolunteer(volunteer);
    setShowModal(true);
  }, []);

  // Handle status change
  const _handleStatusChange = useCallback((volunteerId, newStatus) => {
    setVolunteers(prev => 
      prev.map(v => v.id === volunteerId ? { ...v, status: newStatus } : v)
    );
  }, []);

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'active':
        return { color: '#10b981', icon: CheckCircle, text: 'Aktif' };
      case 'inactive':
        return { color: '#6b7280', icon: Clock, text: 'Pasif' };
      case 'pending':
        return { color: '#f59e0b', icon: AlertTriangle, text: 'Beklemede' };
      default:
        return { color: '#6b7280', icon: AlertTriangle, text: 'Bilinmiyor' };
    }
  };

  // Get rating stars
  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  // Get skill icon
  const getSkillIcon = (skill) => {
    switch (skill) {
      case 'Sağlık':
        return Heart;
      case 'Eğitim':
        return GraduationCap;
      case 'Teknik':
        return Shield;
      case 'Lojistik':
        return Activity;
      case 'IT':
        return Shield;
      case 'Psikoloji':
        return Heart;
      case 'Çeviri':
        return GraduationCap;
      case 'Organizasyon':
        return Activity;
      case 'Nakliye':
        return Activity;
      case 'Depo':
        return Activity;
      default:
        return Briefcase;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gönüllü Yönetimi</h1>
              <p className="text-gray-600">Toplam {volunteers.length} gönüllü</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Gönüllü
          </motion.button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktif Gönüllüler</p>
                <p className="text-2xl font-bold text-purple-600">{activeVolunteers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Saat</p>
                <p className="text-2xl font-bold text-gray-900">{totalHours.toLocaleString()}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ortalama Puan</p>
                <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Gönüllü ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
            <option value="pending">Beklemede</option>
          </select>
          <select
            value={filterSkills}
            onChange={(e) => setFilterSkills(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tüm Beceriler</option>
            <option value="Sağlık">Sağlık</option>
            <option value="Eğitim">Eğitim</option>
            <option value="Teknik">Teknik</option>
            <option value="Lojistik">Lojistik</option>
            <option value="Psikoloji">Psikoloji</option>
          </select>
        </div>
      </div>

      {/* Volunteers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedVolunteers.map((volunteer) => {
          const statusInfo = getStatusInfo(volunteer.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <motion.div
              key={volunteer.id}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden cursor-pointer"
              onClick={() => handleVolunteerClick(volunteer)}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{volunteer.name}</h3>
                  <div className="volunteer-icons">
                    <Award className="volunteer-icon award" />
                    <StatusIcon className={`volunteer-icon status-${volunteer.status}`} />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {getRatingStars(volunteer.rating)}
                  <span className="text-sm text-gray-600">({volunteer.rating})</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{volunteer.totalHours} saat</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{volunteer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{volunteer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{volunteer.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Katılım: {volunteer.joinDate}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="px-4 pb-3">
                <div className="flex flex-wrap gap-1">
                  {volunteer.skills.slice(0, 3).map((skill, index) => {
                    const SkillIcon = getSkillIcon(skill);
                    return (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                      >
                        <SkillIcon className="w-3 h-3" />
                        {skill}
                      </span>
                    );
                  })}
                  {volunteer.skills.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      +{volunteer.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {volunteer.experience} deneyim
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle edit
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-400 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle delete
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Önceki
          </motion.button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 border rounded-lg ${
                currentPage === page
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </motion.button>
          ))}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sonraki
          </motion.button>
        </div>
      )}

      {/* Detail Modal */}
      {showModal && selectedVolunteer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Gönüllü Detayı</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Ad Soyad</label>
                <p className="text-gray-900">{selectedVolunteer.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">E-posta</label>
                <p className="text-gray-900">{selectedVolunteer.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Telefon</label>
                <p className="text-gray-900">{selectedVolunteer.phone}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Adres</label>
                <p className="text-gray-900">{selectedVolunteer.address}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Durum</label>
                <div className="flex items-center gap-2">
                  {(() => {
                    const statusInfo = getStatusInfo(selectedVolunteer.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <>
                        <StatusIcon className="w-4 h-4" style={{ color: statusInfo.color }} />
                        <span style={{ color: statusInfo.color }}>{statusInfo.text}</span>
                      </>
                    );
                  })()}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Deneyim</label>
                <p className="text-gray-900">{selectedVolunteer.experience}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Toplam Saat</label>
                <p className="text-gray-900">{selectedVolunteer.totalHours} saat</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Puan</label>
                <div className="flex items-center gap-2">
                  {getRatingStars(selectedVolunteer.rating)}
                  <span className="text-gray-900">({selectedVolunteer.rating})</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Beceriler</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedVolunteer.skills.map((skill, index) => {
                    const SkillIcon = getSkillIcon(skill);
                    return (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                      >
                        <SkillIcon className="w-3 h-3" />
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Müsaitlik</label>
                <p className="text-gray-900">{selectedVolunteer.availability}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Son Aktivite</label>
                <p className="text-gray-900">{selectedVolunteer.lastActivity}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Notlar</label>
                <p className="text-gray-900">{selectedVolunteer.notes}</p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Düzenle
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                onClick={() => setShowModal(false)}
              >
                Kapat
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Volunteers;