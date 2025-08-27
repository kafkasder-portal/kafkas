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
} from 'lucide-react';

// Design System Components
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Label,
  Select,
  Badge,
  StatusBadge,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Modal,
  PaginationWithInfo,
  Alert,
  AlertTitle,
  AlertDescription
} from '../ui';
import { Page } from '../layouts/Page';

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
    status: 'active',
    skills: ['Sağlık', 'Hemşirelik', 'İlk Yardım'],
    experience: '7 yıl',
    totalHours: 1800,
    rating: 4.9,
    joinDate: '2019-08-05',
    lastActivity: '2024-01-18',
    availability: '24/7',
    notes: 'Kızılhaç gönüllüsü, acil müdahale uzmanı',
    avatar: null,
  },
  {
    id: 5,
    name: 'Can Özkan',
    email: 'can@example.com',
    phone: '+90 536 567 8901',
    address: 'Antalya, Türkiye',
    status: 'active',
    skills: ['Lojistik', 'Nakliye', 'Organizasyon'],
    experience: '4 yıl',
    totalHours: 950,
    rating: 4.7,
    joinDate: '2020-11-12',
    lastActivity: '2024-01-17',
    availability: 'Hafta sonu',
    notes: 'Nakliye şirketi sahibi, araç filosu mevcut',
    avatar: null,
  },
];

const VolunteersNew = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState({ value: 'all', label: 'Tümü' });
  const [filterSkills, setFilterSkills] = useState({ value: 'all', label: 'Tümü' });
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const statusOptions = [
    { value: 'all', label: 'Tümü' },
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Pasif' },
  ];

  const skillsOptions = [
    { value: 'all', label: 'Tümü' },
    { value: 'Sağlık', label: 'Sağlık' },
    { value: 'Eğitim', label: 'Eğitim' },
    { value: 'Teknik', label: 'Teknik' },
    { value: 'Lojistik', label: 'Lojistik' },
    { value: 'Organizasyon', label: 'Organizasyon' },
  ];

  // Load volunteers data
  useEffect(() => {
    const loadVolunteers = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
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

    const matchesStatusFilter = filterStatus.value === 'all' || volunteer.status === filterStatus.value;
    const matchesSkillsFilter = filterSkills.value === 'all' || volunteer.skills.includes(filterSkills.value);

    return matchesSearch && matchesStatusFilter && matchesSkillsFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredVolunteers.length / itemsPerPage);
  const paginatedVolunteers = filteredVolunteers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const totalVolunteers = volunteers.length;
  const activeVolunteers = volunteers.filter(v => v.status === 'active').length;
  const _inactiveVolunteers = volunteers.filter(v => v.status === 'inactive').length;
  const totalHours = volunteers.reduce((sum, v) => sum + v.totalHours, 0);
  const averageRating = volunteers.length > 0
    ? (volunteers.reduce((sum, v) => sum + v.rating, 0) / volunteers.length).toFixed(1)
    : 0;

  // Handle volunteer selection
  const handleVolunteerClick = useCallback((volunteer) => {
    setSelectedVolunteer(volunteer);
    setShowModal(true);
  }, []);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      default: return 'secondary';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Pasif';
      default: return 'Bilinmiyor';
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Page>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gönüllüler
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gönüllü yönetimi ve koordinasyonu
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Yeni Gönüllü
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Toplam Gönüllü
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalVolunteers}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Aktif Gönüllü
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {activeVolunteers}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Toplam Saat
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {totalHours.toLocaleString()}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Ortalama Puan
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {averageRating}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filtreler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Arama</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Gönüllü ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status-filter">Durum</Label>
                <Select
                  options={statusOptions}
                  value={filterStatus}
                  onChange={setFilterStatus}
                  placeholder="Durum seçin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills-filter">Yetenek</Label>
                <Select
                  options={skillsOptions}
                  value={filterSkills}
                  onChange={setFilterSkills}
                  placeholder="Yetenek seçin"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volunteers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Gönüllü Listesi</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : paginatedVolunteers.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Gönüllü Bulunamadı</AlertTitle>
                <AlertDescription>
                  Arama kriterlerinize uygun gönüllü bulunamadı.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gönüllü</TableHead>
                      <TableHead>İletişim</TableHead>
                      <TableHead>Yetenekler</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Toplam Saat</TableHead>
                      <TableHead>Puan</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedVolunteers.map((volunteer) => (
                      <TableRow
                        key={volunteer.id}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => handleVolunteerClick(volunteer)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {volunteer.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {volunteer.experience} deneyim
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="truncate max-w-xs">{volunteer.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span>{volunteer.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {volunteer.skills.slice(0, 2).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {volunteer.skills.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{volunteer.skills.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge variant={getStatusColor(volunteer.status)}>
                            {getStatusText(volunteer.status)}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{volunteer.totalHours}h</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{volunteer.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle edit
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle delete
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="mt-6">
                  <PaginationWithInfo
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredVolunteers.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Volunteer Detail Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={selectedVolunteer?.name || 'Gönüllü Detayları'}
        >
          {selectedVolunteer && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedVolunteer.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedVolunteer.experience} deneyim</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{selectedVolunteer.rating}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">{selectedVolunteer.totalHours}h toplam</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {selectedVolunteer.email}
                  </p>
                </div>
                <div>
                  <Label>Telefon</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {selectedVolunteer.phone}
                  </p>
                </div>
                <div>
                  <Label>Adres</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {selectedVolunteer.address}
                  </p>
                </div>
                <div>
                  <Label>Katılma Tarihi</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {selectedVolunteer.joinDate}
                  </p>
                </div>
              </div>

              <div>
                <Label>Yetenekler</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedVolunteer.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Kullanılabilirlik</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedVolunteer.availability}
                </p>
              </div>

              {selectedVolunteer.notes && (
                <div>
                  <Label>Notlar</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedVolunteer.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </motion.div>
    </Page>
  );
};

export default VolunteersNew;
