import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Camera,
  Check,
  CreditCard,
  Download,
  Edit,
  Eye,
  FileText,
  Gift,
  Heart,
  HelpCircle,
  Image,
  Loader,
  MessageCircle,
  Plus,
  Save,
  Shield,
  Trash2,
  Upload,
  User,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BeneficiaryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [beneficiary, setBeneficiary] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('kimlik');
  const [activePanel, setActivePanel] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([
    {
      id: 1,
      iban: 'TR33 0006 1005 1978 6457 8413 26',
      bankName: 'İş Bankası',
      accountHolder: 'Ahmet Yılmaz',
    },
    {
      id: 2,
      iban: 'TR64 0001 2009 4520 0058 0012 34',
      bankName: 'Ziraat Bankası',
      accountHolder: 'Ahmet Yılmaz',
    },
  ]);
  const [newBankAccount, setNewBankAccount] = useState({
    iban: '',
    bankName: '',
    accountHolder: '',
  });
  const [bankFormErrors, setBankFormErrors] = useState({});
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Kimlik Fotokopisi.pdf',
      type: 'pdf',
      size: '2.3 MB',
      uploadDate: '2024-01-15',
      category: 'Kimlik',
    },
    {
      id: 2,
      name: 'İkamet Belgesi.pdf',
      type: 'pdf',
      size: '1.8 MB',
      uploadDate: '2024-01-10',
      category: 'İkamet',
    },
    {
      id: 3,
      name: 'Gelir Belgesi.pdf',
      type: 'pdf',
      size: '1.2 MB',
      uploadDate: '2024-01-08',
      category: 'Gelir',
    },
    {
      id: 4,
      name: 'Sağlık Raporu.pdf',
      type: 'pdf',
      size: '3.1 MB',
      uploadDate: '2024-01-05',
      category: 'Sağlık',
    },
    {
      id: 5,
      name: 'Fotoğraf.jpg',
      type: 'image',
      size: '856 KB',
      uploadDate: '2024-01-03',
      category: 'Fotoğraf',
    },
    {
      id: 6,
      name: 'Başvuru Formu.docx',
      type: 'document',
      size: '945 KB',
      uploadDate: '2024-01-01',
      category: 'Başvuru',
    },
    {
      id: 7,
      name: 'Referans Mektubu.pdf',
      type: 'pdf',
      size: '1.5 MB',
      uploadDate: '2023-12-28',
      category: 'Referans',
    },
    {
      id: 8,
      name: 'Banka Hesap Bilgileri.pdf',
      type: 'pdf',
      size: '678 KB',
      uploadDate: '2023-12-25',
      category: 'Banka',
    },
  ]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploadingDocument, setUploadingDocument] = useState(false);

  // Baktığı Yetimler state'leri
  const [showOrphansModal, setShowOrphansModal] = useState(false);
  const [orphans, setOrphans] = useState([
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      age: 8,
      location: 'Suriye',
      sponsorshipDate: '2023-06-15',
      monthlyAmount: 500,
    },
    {
      id: 2,
      name: 'Fatma Öztürk',
      age: 12,
      location: 'Afganistan',
      sponsorshipDate: '2023-08-20',
      monthlyAmount: 600,
    },
  ]);

  // Baktığı Kişiler state'leri
  const [showPeopleModal, setShowPeopleModal] = useState(false);
  const [people, setPeople] = useState([
    {
      id: 1,
      name: 'Mehmet Ali Demir',
      relation: 'Kardeş',
      tcNo: '12345678901',
      birthDate: '1990-05-15',
      gender: 'Erkek',
    },
    {
      id: 2,
      name: 'Ayşe Kaya',
      relation: 'Anne',
      tcNo: '98765432109',
      birthDate: '1965-08-22',
      gender: 'Kadın',
    },
    {
      id: 3,
      name: 'Hasan Çelik',
      relation: 'Amca',
      tcNo: '11223344556',
      birthDate: '1970-12-10',
      gender: 'Erkek',
    },
  ]);
  const [showAddPersonForm, setShowAddPersonForm] = useState(false);
  const [newPerson, setNewPerson] = useState({
    name: '',
    relation: '',
    tcNo: '',
    birthDate: '',
    gender: '',
  });

  // Rıza Beyanları state'leri
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consents, setConsents] = useState([
    {
      id: 1,
      type: 'Fotoğraf Çekimi',
      status: 'Onaylandı',
      date: '2024-01-15',
      expiryDate: '2025-01-15',
    },
    {
      id: 2,
      type: 'Veri İşleme',
      status: 'Onaylandı',
      date: '2024-01-10',
      expiryDate: '2025-01-10',
    },
    {
      id: 3,
      type: 'İletişim İzni',
      status: 'Beklemede',
      date: '2024-01-20',
      expiryDate: '2025-01-20',
    },
  ]);

  // Mock data - gerçek uygulamada API'den gelecek
  const mockBeneficiary = {
    id: parseInt(id),
    ad: 'Ahmet',
    soyad: 'Yılmaz',
    uyruk: 'TC',
    tcPasaport: '12345678901',
    telefon: '+90 532 123 4567',
    email: 'ahmet.yilmaz@email.com',
    sehir: 'İstanbul',
    ilce: 'Fatih',
    mahalle: 'Aksaray',
    adres: 'Millet Caddesi No: 123 Daire: 5',
    durum: 'AKTIF',
    kategori: 'Mülteci Aile',
    fonBolgesi: 'İstanbul Bölgesi',
    kayitTarihi: '2024-01-15',
    dosyaNo: 'IHT-2024-001',
    bagliYetimSayisi: 2,
    ailedekiKisiSayisi: 5,
    rizaBeyanı: 'Yüklendi',
    profilFoto: null,
    // Kimlik Bilgileri
    babaAdi: 'Mehmet',
    anneAdi: 'Ayşe',
    kimlikBelgesiTuru: 'TC Kimlik Kartı',
    seriNo: 'A12345678',
    gecerlilikTarihi: '2030-12-31',
    oncekiUyruk: '',
    oncekiIsim: '',
    cinsiyet: 'Erkek',
    dogumYeri: 'İstanbul',
    dogumTarihi: '1985-05-15',
    medeniDurum: 'Evli',
    // Pasaport & Vize
    pasaportTuru: 'Umumi Pasaport',
    pasaportNo: 'U12345678',
    pasaportGecerlilik: '2028-05-15',
    vizeGirisTuru: 'Turist Vizesi',
    vizeBitisTarihi: '2025-05-15',
    geriDonusBilgisi: 'Planlanmamış',
    // Kişisel Veriler
    inanc: 'İslam',
    adliSicil: 'Yok',
    yasadigiYer: 'Kira',
    kiraTutari: '3500',
    // İş & Gelir
    isDurumu: 'Çalışıyor',
    calistigiSektor: 'İnşaat',
    meslekGrubu: 'İşçi',
    meslekTanimi: 'İnşaat İşçisi',
    aylikGelir: '8000',
    aylikGider: '6500',
    sosyalGuvence: 'SGK',
    gelirKaynaklari: ['Maaş', 'Basit Ticaret'],
    ilaveAciklamalar: 'Düzenli çalışıyor',
    // Sağlık
    kronikHastaliklar: 'Diyabet',
    engellilikDurumu: 'Yok',
    duzenliIlac: 'Metformin',
    ozelDurumlar: 'Düzenli kontrol gerekiyor',
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBeneficiary(mockBeneficiary);
      setFormData(mockBeneficiary);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getDurumColor = durum => {
    switch (durum) {
      case 'AKTIF':
        return '#10b981';
      case 'PASIF':
        return '#64748b';
      case 'INCELEME':
        return '#f59e0b';
      case 'TASLAK':
        return '#8b5cf6';
      default:
        return '#64748b';
    }
  };

  const getDurumText = durum => {
    switch (durum) {
      case 'AKTIF':
        return 'Aktif';
      case 'PASIF':
        return 'Pasif';
      case 'INCELEME':
        return 'İncelemede';
      case 'TASLAK':
        return 'Taslak';
      default:
        return durum;
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(beneficiary);
    setFormErrors({});
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setBeneficiary(formData);
      setIsEditing(false);
      setToast({
        show: true,
        message: 'Değişiklikler başarıyla kaydedildi!',
        type: 'success',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    } catch {
      setToast({
        show: true,
        message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        type: 'error',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleStatusChange = newStatus => {
    setFormData(prev => ({ ...prev, durum: newStatus }));
    setBeneficiary(prev => ({ ...prev, durum: newStatus }));
    setToast({
      show: true,
      message: `Durum "${getDurumText(newStatus)}" olarak güncellendi!`,
      type: 'success',
    });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Banka hesapları fonksiyonları
  const validateIban = iban => {
    const cleanIban = iban.replace(/\s/g, '');
    const ibanRegex =
      /^TR\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{2}$/;
    return ibanRegex.test(iban);
  };

  const handleBankAccountChange = e => {
    const { name, value } = e.target;
    setNewBankAccount(prev => ({ ...prev, [name]: value }));

    if (bankFormErrors[name]) {
      setBankFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddBankAccount = () => {
    const errors = {};

    if (!newBankAccount.iban.trim()) {
      errors.iban = 'IBAN gereklidir';
    } else if (!validateIban(newBankAccount.iban)) {
      errors.iban = 'Geçerli bir IBAN giriniz (TR ile başlamalı)';
    }

    if (!newBankAccount.bankName.trim()) {
      errors.bankName = 'Banka adı gereklidir';
    }

    if (!newBankAccount.accountHolder.trim()) {
      errors.accountHolder = 'Hesap sahibi gereklidir';
    }

    if (Object.keys(errors).length > 0) {
      setBankFormErrors(errors);
      return;
    }

    const newAccount = {
      id: Date.now(),
      ...newBankAccount,
    };

    setBankAccounts(prev => [...prev, newAccount]);
    setNewBankAccount({ iban: '', bankName: '', accountHolder: '' });
    setBankFormErrors({});
    setToast({
      show: true,
      message: 'Banka hesabı başarıyla eklendi!',
      type: 'success',
    });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleDeleteBankAccount = accountId => {
    setBankAccounts(prev => prev.filter(account => account.id !== accountId));
    setToast({
      show: true,
      message: 'Banka hesabı silindi!',
      type: 'success',
    });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleBankBoxClick = () => {
    setShowBankModal(true);
  };

  // Dokümanlar fonksiyonları
  const handleDocumentBoxClick = () => {
    setShowDocumentModal(true);
  };

  const handleDocumentView = document => {
    setSelectedDocument(document);
    // Gerçek uygulamada doküman görüntüleme işlemi burada yapılacak
    setToast({
      show: true,
      message: `${document.name} görüntüleniyor...`,
      type: 'success',
    });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleDocumentDownload = document => {
    // Gerçek uygulamada doküman indirme işlemi burada yapılacak
    setToast({
      show: true,
      message: `${document.name} indiriliyor...`,
      type: 'success',
    });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleDocumentDelete = documentId => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    setToast({
      show: true,
      message: 'Doküman silindi!',
      type: 'success',
    });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleDocumentUpload = event => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingDocument(true);

    // Simüle edilmiş yükleme işlemi
    setTimeout(() => {
      const newDocument = {
        id: Date.now(),
        name: file.name,
        type: file.type.includes('pdf')
          ? 'pdf'
          : file.type.includes('image')
            ? 'image'
            : 'document',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        category: 'Yeni',
      };

      setDocuments(prev => [newDocument, ...prev]);
      setUploadingDocument(false);
      setToast({
        show: true,
        message: 'Doküman başarıyla yüklendi!',
        type: 'success',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);

      // Input'u temizle
      event.target.value = '';
    }, 2000);
  };

  const getDocumentIcon = type => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'image':
        return Image;
      case 'document':
        return FileText;
      default:
        return FileText;
    }
  };

  // Baktığı Yetimler fonksiyonları
  const handleOrphansBoxClick = () => {
    setShowOrphansModal(true);
  };

  const handleRemoveOrphan = orphanId => {
    setOrphans(prev => prev.filter(orphan => orphan.id !== orphanId));
    setToast({
      show: true,
      message: 'Yetim kaydı kaldırıldı!',
      type: 'success',
    });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Baktığı Kişiler fonksiyonları
  const handlePeopleBoxClick = () => {
    setShowPeopleModal(true);
  };

  const handleRemovePerson = personId => {
    setPeople(prev => prev.filter(person => person.id !== personId));
    setToast({
      show: true,
      message: 'Kişi kaydı kaldırıldı!',
      type: 'success',
    });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleAddPerson = () => {
    if (
      !newPerson.name ||
      !newPerson.relation ||
      !newPerson.tcNo ||
      !newPerson.birthDate ||
      !newPerson.gender
    ) {
      setToast({
        show: true,
        message: 'Lütfen tüm alanları doldurun!',
        type: 'error',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
      return;
    }

    const newId = Math.max(...people.map(p => p.id), 0) + 1;
    const personToAdd = {
      id: newId,
      ...newPerson,
    };

    setPeople(prev => [...prev, personToAdd]);
    setNewPerson({
      name: '',
      relation: '',
      tcNo: '',
      birthDate: '',
      gender: '',
    });
    setShowAddPersonForm(false);
    setToast({
      show: true,
      message: 'Yeni kişi başarıyla eklendi!',
      type: 'success',
    });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleCancelAddPerson = () => {
    setNewPerson({
      name: '',
      relation: '',
      tcNo: '',
      birthDate: '',
      gender: '',
    });
    setShowAddPersonForm(false);
  };

  // Rıza Beyanları fonksiyonları
  const handleConsentBoxClick = () => {
    setShowConsentModal(true);
  };

  const handleUpdateConsentStatus = (consentId, newStatus) => {
    setConsents(prev =>
      prev.map(consent =>
        consent.id === consentId ? { ...consent, status: newStatus } : consent
      )
    );
    setToast({
      show: true,
      message: 'Rıza beyanı durumu güncellendi!',
      type: 'success',
    });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleDeleteConsent = consentId => {
    setConsents(prev => prev.filter(consent => consent.id !== consentId));
    setToast({
      show: true,
      message: 'Rıza beyanı silindi!',
      type: 'success',
    });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const relatedBoxes = [
    {
      id: 'bankalar',
      title: 'Banka Hesapları',
      icon: CreditCard,
      count: bankAccounts.length,
      onClick: handleBankBoxClick,
    },
    {
      id: 'dokumanlar',
      title: 'Dokümanlar',
      icon: FileText,
      count: documents.length,
      onClick: handleDocumentBoxClick,
    },
    { id: 'fotograflar', title: 'Fotoğraflar', icon: Image, count: 5 },
    {
      id: 'yetimler',
      title: 'Baktığı Yetimler',
      icon: Heart,
      count: orphans.length,
      onClick: handleOrphansBoxClick,
    },
    {
      id: 'kisiler',
      title: 'Baktığı Kişiler',
      icon: Users,
      count: people.length,
      onClick: handlePeopleBoxClick,
    },
    { id: 'sponsorlar', title: 'Sponsorlar', icon: Gift, count: 1 },
    { id: 'referanslar', title: 'Referanslar', icon: MessageCircle, count: 4 },
    {
      id: 'gorusmeler',
      title: 'Görüşme Kayıtları',
      icon: MessageCircle,
      count: 12,
    },
    { id: 'seanslar', title: 'Seans Takibi', icon: Calendar, count: 6 },
    { id: 'talepler', title: 'Yardım Talepleri', icon: HelpCircle, count: 3 },
    { id: 'yardimlar', title: 'Yapılan Yardımlar', icon: Gift, count: 15 },
    {
      id: 'rizalar',
      title: 'Rıza Beyanları',
      icon: Shield,
      count: consents.length,
      onClick: handleConsentBoxClick,
    },
  ];

  const tabs = [
    { id: 'kimlik', title: 'Kimlik Bilgileri', icon: User },
    { id: 'pasaport', title: 'Pasaport & Vize', icon: FileText },
    { id: 'kisisel', title: 'Kişisel Veriler', icon: User },
    { id: 'is', title: 'İş & Gelir', icon: CreditCard },
    { id: 'saglik', title: 'Sağlık Durumu', icon: Heart },
  ];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          padding: '2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Loader
            size={48}
            style={{
              animation: 'spin 1s linear infinite',
              color: '#3b82f6',
              marginBottom: '1rem',
            }}
          />
          <p style={{ color: '#64748b', fontSize: '1.125rem' }}>
            Kayıt detayları yükleniyor...
          </p>
        </div>
      </motion.div>
    );
  }

  if (!beneficiary) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ padding: '2rem', textAlign: 'center' }}
      >
        <AlertCircle
          size={64}
          style={{ color: '#ef4444', marginBottom: '1rem' }}
        />
        <h2 style={{ color: '#1a202c', marginBottom: '0.5rem' }}>
          Kayıt Bulunamadı
        </h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          Aradığınız kayıt bulunamadı veya silinmiş olabilir.
        </p>
        <motion.button
          onClick={() => navigate('/yardim/ihtiyac-sahipleri')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
          whileHover={{ backgroundColor: '#2563eb' }}
        >
          Listeye Dön
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}
    >
      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            style={{
              position: 'fixed',
              top: '2rem',
              right: '2rem',
              zIndex: 1000,
              padding: '1rem 1.5rem',
              backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
              color: 'white',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {toast.type === 'success' ? (
              <Check size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className='card' style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <motion.button
              onClick={() => navigate('/yardim/ihtiyac-sahipleri')}
              style={{
                padding: '0.5rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
              whileHover={{ backgroundColor: '#f1f5f9' }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div>
              <h1
                style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#1a202c',
                  margin: 0,
                }}
              >
                {beneficiary.ad} {beneficiary.soyad} – Kayıt Detayı
              </h1>
              <p style={{ color: '#64748b', margin: '0.25rem 0 0 0' }}>
                Dosya No: {beneficiary.dosyaNo}
              </p>
            </div>
          </div>

          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            {/* Durum Değiştir */}
            <select
              value={beneficiary.durum}
              onChange={e => handleStatusChange(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: getDurumColor(beneficiary.durum),
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              <option value='TASLAK'>Taslak</option>
              <option value='INCELEME'>İncelemede</option>
              <option value='AKTIF'>Aktif</option>
              <option value='PASIF'>Pasif</option>
            </select>

            {isEditing ? (
              <>
                <motion.button
                  onClick={handleCancel}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  whileHover={{ backgroundColor: '#f1f5f9' }}
                >
                  <X size={16} />
                  İptal
                </motion.button>
                <motion.button
                  onClick={handleSave}
                  disabled={saveLoading}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: saveLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: saveLoading ? 0.7 : 1,
                  }}
                  whileHover={
                    !saveLoading ? { backgroundColor: '#059669' } : {}
                  }
                >
                  {saveLoading ? (
                    <Loader
                      size={16}
                      style={{ animation: 'spin 1s linear infinite' }}
                    />
                  ) : (
                    <Save size={16} />
                  )}
                  {saveLoading ? 'Kaydediliyor...' : 'Kaydet'}
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={handleEdit}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
                whileHover={{ backgroundColor: '#2563eb' }}
              >
                <Edit size={16} />
                Düzenle
              </motion.button>
            )}
          </div>
        </div>

        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Son güncelleme: {new Date().toLocaleDateString('tr-TR')} -{' '}
          {new Date().toLocaleTimeString('tr-TR')}
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem',
        }}
      >
        {/* Sol Sütun - Profil & Özet */}
        <div>
          {/* Profil Fotoğrafı */}
          <div
            className='card'
            style={{
              padding: '1.5rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                }}
              >
                {beneficiary.profilFoto ? (
                  <img
                    src={beneficiary.profilFoto}
                    alt='Profil'
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <User size={48} style={{ color: '#64748b' }} />
                )}
              </div>
              {isEditing && (
                <motion.button
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    padding: '0.5rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                  }}
                  whileHover={{ backgroundColor: '#2563eb' }}
                >
                  <Camera size={16} />
                </motion.button>
              )}
            </div>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1a202c',
                margin: '0 0 0.5rem 0',
              }}
            >
              {beneficiary.ad} {beneficiary.soyad}
            </h3>
            <p style={{ color: '#64748b', margin: 0 }}>
              {beneficiary.kategori}
            </p>
          </div>

          {/* Kayıt Özeti */}
          <div className='card' style={{ padding: '1.5rem' }}>
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '1rem',
              }}
            >
              Kayıt Özeti
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {[
                {
                  label: 'Ad Soyad',
                  value: `${beneficiary.ad} ${beneficiary.soyad}`,
                },
                { label: 'Uyruk', value: beneficiary.uyruk },
                { label: 'Kimlik No', value: beneficiary.tcPasaport },
                { label: 'Kategori', value: beneficiary.kategori },
                { label: 'Fon Bölgesi', value: beneficiary.fonBolgesi },
                {
                  label: 'Adres',
                  value: `${beneficiary.sehir} / ${beneficiary.ilce} / ${beneficiary.mahalle}`,
                },
                { label: 'Telefon', value: beneficiary.telefon },
                {
                  label: 'E-posta',
                  value: beneficiary.email || 'Belirtilmemiş',
                },
                { label: 'Durum', value: getDurumText(beneficiary.durum) },
                { label: 'Kayıt Tarihi', value: beneficiary.kayitTarihi },
                { label: 'Dosya No', value: beneficiary.dosyaNo },
                {
                  label: 'Bağlı Yetim Sayısı',
                  value: beneficiary.bagliYetimSayisi,
                },
                {
                  label: 'Ailedeki Kişi Sayısı',
                  value: beneficiary.ailedekiKisiSayisi,
                },
                { label: 'Rıza Beyanı', value: beneficiary.rizaBeyanı },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    {item.label}:
                  </span>
                  <span
                    style={{
                      color: '#1a202c',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sağ Sütun - Bağlantılı Kayıt Kutuları */}
        <div>
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '1rem',
            }}
          >
            Bağlantılı Kayıtlar
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
            }}
          >
            {relatedBoxes.map(box => {
              const IconComponent = box.icon;
              return (
                <motion.div
                  key={box.id}
                  className='card'
                  style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border:
                      activePanel === box.id
                        ? '2px solid #3b82f6'
                        : '1px solid #e2e8f0',
                  }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    if (box.onClick) {
                      box.onClick();
                    } else {
                      setActivePanel(activePanel === box.id ? null : box.id);
                    }
                  }}
                >
                  <IconComponent
                    size={32}
                    style={{ color: '#3b82f6', marginBottom: '0.5rem' }}
                  />
                  <h4
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#1a202c',
                      margin: '0 0 0.25rem 0',
                    }}
                  >
                    {box.title}
                  </h4>
                  <p
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#3b82f6',
                      margin: 0,
                    }}
                  >
                    {box.count}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alt Paneller - Sekmeler */}
      <div className='card' style={{ padding: 0 }}>
        {/* Sekme Başlıkları */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor:
                    activeTab === tab.id ? '#f8fafc' : 'rgba(0,0,0,0)',
                  border: 'none',
                  borderBottom:
                    activeTab === tab.id
                      ? '2px solid #3b82f6'
                      : '2px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  color: activeTab === tab.id ? '#3b82f6' : '#64748b',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
                whileHover={{ backgroundColor: '#f8fafc' }}
              >
                <IconComponent size={16} />
                {tab.title}
              </motion.button>
            );
          })}
        </div>

        {/* Sekme İçerikleri */}
        <div style={{ padding: '2rem' }}>
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'kimlik' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1.5rem',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Baba Adı
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        name='babaAdi'
                        value={formData.babaAdi || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.babaAdi}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Anne Adı
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        name='anneAdi'
                        value={formData.anneAdi || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.anneAdi}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Kimlik Belgesi Türü
                    </label>
                    {isEditing ? (
                      <select
                        name='kimlikBelgesiTuru'
                        value={formData.kimlikBelgesiTuru || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      >
                        <option value='TC Kimlik Kartı'>TC Kimlik Kartı</option>
                        <option value='Pasaport'>Pasaport</option>
                        <option value='Geçici Kimlik'>Geçici Kimlik</option>
                      </select>
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.kimlikBelgesiTuru}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Seri No
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        name='seriNo'
                        value={formData.seriNo || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.seriNo}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Geçerlilik Tarihi
                    </label>
                    {isEditing ? (
                      <input
                        type='date'
                        name='gecerlilikTarihi'
                        value={formData.gecerlilikTarihi || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.gecerlilikTarihi}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Cinsiyet
                    </label>
                    {isEditing ? (
                      <select
                        name='cinsiyet'
                        value={formData.cinsiyet || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      >
                        <option value='Erkek'>Erkek</option>
                        <option value='Kadın'>Kadın</option>
                      </select>
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.cinsiyet}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Doğum Yeri
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        name='dogumYeri'
                        value={formData.dogumYeri || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.dogumYeri}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Doğum Tarihi
                    </label>
                    {isEditing ? (
                      <input
                        type='date'
                        name='dogumTarihi'
                        value={formData.dogumTarihi || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.dogumTarihi}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Medeni Durum
                    </label>
                    {isEditing ? (
                      <select
                        name='medeniDurum'
                        value={formData.medeniDurum || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      >
                        <option value='Bekar'>Bekar</option>
                        <option value='Evli'>Evli</option>
                        <option value='Boşanmış'>Boşanmış</option>
                        <option value='Dul'>Dul</option>
                      </select>
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.medeniDurum}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'pasaport' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1.5rem',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Pasaport Türü
                    </label>
                    {isEditing ? (
                      <select
                        name='pasaportTuru'
                        value={formData.pasaportTuru || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      >
                        <option value='Umumi Pasaport'>Umumi Pasaport</option>
                        <option value='Hizmet Pasaportu'>
                          Hizmet Pasaportu
                        </option>
                        <option value='Hususi Pasaport'>Hususi Pasaport</option>
                        <option value='Diplomatik Pasaport'>
                          Diplomatik Pasaport
                        </option>
                      </select>
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.pasaportTuru}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Pasaport No
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        name='pasaportNo'
                        value={formData.pasaportNo || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.pasaportNo}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Pasaport Geçerlilik Tarihi
                    </label>
                    {isEditing ? (
                      <input
                        type='date'
                        name='pasaportGecerlilik'
                        value={formData.pasaportGecerlilik || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.pasaportGecerlilik}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Vize Giriş Türü
                    </label>
                    {isEditing ? (
                      <select
                        name='vizeGirisTuru'
                        value={formData.vizeGirisTuru || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      >
                        <option value='Turist Vizesi'>Turist Vizesi</option>
                        <option value='İş Vizesi'>İş Vizesi</option>
                        <option value='Öğrenci Vizesi'>Öğrenci Vizesi</option>
                        <option value='Geçiş Vizesi'>Geçiş Vizesi</option>
                        <option value='Mülteci'>Mülteci</option>
                      </select>
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.vizeGirisTuru}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Vize Bitiş Tarihi
                    </label>
                    {isEditing ? (
                      <input
                        type='date'
                        name='vizeBitisTarihi'
                        value={formData.vizeBitisTarihi || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.vizeBitisTarihi}
                      </p>
                    )}
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Geri Dönüş Bilgisi
                    </label>
                    {isEditing ? (
                      <textarea
                        name='geriDonusBilgisi'
                        value={formData.geriDonusBilgisi || ''}
                        onChange={handleInputChange}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          resize: 'vertical',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.geriDonusBilgisi}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'kisisel' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1.5rem',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      İnanç
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        name='inanc'
                        value={formData.inanc || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.inanc}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Adli Sicil Kaydı
                    </label>
                    {isEditing ? (
                      <select
                        name='adliSicil'
                        value={formData.adliSicil || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      >
                        <option value='Yok'>Yok</option>
                        <option value='Var'>Var</option>
                      </select>
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.adliSicil}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Yaşadığı Yer
                    </label>
                    {isEditing ? (
                      <select
                        name='yasadigiYer'
                        value={formData.yasadigiYer || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      >
                        <option value='Kira'>Kira</option>
                        <option value='Ev Sahibi'>Ev Sahibi</option>
                        <option value='Diğer'>Diğer</option>
                      </select>
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.yasadigiYer}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Kira Tutarı (₺)
                    </label>
                    {isEditing ? (
                      <input
                        type='number'
                        name='kiraTutari'
                        value={formData.kiraTutari || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.kiraTutari
                          ? `${beneficiary.kiraTutari} ₺`
                          : 'Belirtilmemiş'}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'is' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1.5rem',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      İş Durumu
                    </label>
                    {isEditing ? (
                      <select
                        name='isDurumu'
                        value={formData.isDurumu || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      >
                        <option value='Çalışıyor'>Çalışıyor</option>
                        <option value='Çalışmıyor'>Çalışmıyor</option>
                        <option value='Öğrenci'>Öğrenci</option>
                        <option value='Emekli'>Emekli</option>
                        <option value='Ev Hanımı'>Ev Hanımı</option>
                      </select>
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.isDurumu}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Çalıştığı Sektör
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        name='calistigiSektor'
                        value={formData.calistigiSektor || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.calistigiSektor}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Meslek Grubu
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        name='meslekGrubu'
                        value={formData.meslekGrubu || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.meslekGrubu}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Meslek Tanımı
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        name='meslekTanimi'
                        value={formData.meslekTanimi || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.meslekTanimi}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Aylık Gelir (₺)
                    </label>
                    {isEditing ? (
                      <input
                        type='number'
                        name='aylikGelir'
                        value={formData.aylikGelir || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.aylikGelir
                          ? `${beneficiary.aylikGelir} ₺`
                          : 'Belirtilmemiş'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Aylık Gider (₺)
                    </label>
                    {isEditing ? (
                      <input
                        type='number'
                        name='aylikGider'
                        value={formData.aylikGider || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.aylikGider
                          ? `${beneficiary.aylikGider} ₺`
                          : 'Belirtilmemiş'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Sosyal Güvence
                    </label>
                    {isEditing ? (
                      <select
                        name='sosyalGuvence'
                        value={formData.sosyalGuvence || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      >
                        <option value='Yok'>Yok</option>
                        <option value='SGK'>SGK</option>
                        <option value='Bağ-Kur'>Bağ-Kur</option>
                        <option value='Emekli Sandığı'>Emekli Sandığı</option>
                        <option value='Özel Sigorta'>Özel Sigorta</option>
                      </select>
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.sosyalGuvence}
                      </p>
                    )}
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      İlave Açıklamalar
                    </label>
                    {isEditing ? (
                      <textarea
                        name='ilaveAciklamalar'
                        value={formData.ilaveAciklamalar || ''}
                        onChange={handleInputChange}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          resize: 'vertical',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.ilaveAciklamalar}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'saglik' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1.5rem',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Kronik Hastalıklar
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        name='kronikHastaliklar'
                        value={formData.kronikHastaliklar || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.kronikHastaliklar}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Engellilik Durumu
                    </label>
                    {isEditing ? (
                      <select
                        name='engellilikDurumu'
                        value={formData.engellilikDurumu || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      >
                        <option value='Yok'>Yok</option>
                        <option value='Fiziksel'>Fiziksel</option>
                        <option value='Zihinsel'>Zihinsel</option>
                        <option value='Görme'>Görme</option>
                        <option value='İşitme'>İşitme</option>
                        <option value='Konuşma'>Konuşma</option>
                        <option value='Çoklu'>Çoklu</option>
                      </select>
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.engellilikDurumu}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Düzenli İlaç
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        name='duzenliIlac'
                        value={formData.duzenliIlac || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.duzenliIlac}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      Özel Durumlar
                    </label>
                    {isEditing ? (
                      <textarea
                        name='ozelDurumlar'
                        value={formData.ozelDurumlar || ''}
                        onChange={handleInputChange}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          resize: 'vertical',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {beneficiary.ozelDurumlar}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Aktif Panel İçeriği */}
      <AnimatePresence>
        {activePanel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='card'
            style={{ marginTop: '2rem', padding: '2rem' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1a202c',
                  margin: 0,
                }}
              >
                {relatedBoxes.find(box => box.id === activePanel)?.title}
              </h3>
              <motion.button
                onClick={() => setActivePanel(null)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                whileHover={{ backgroundColor: '#f1f5f9' }}
              >
                <X size={20} />
              </motion.button>
            </div>

            <div
              style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}
            >
              <FileText
                size={48}
                style={{ marginBottom: '1rem', opacity: 0.5 }}
              />
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                Bu bölüm geliştirme aşamasında
              </p>
              <p style={{ fontSize: '0.875rem' }}>
                İlgili kayıtlar burada listelenecek ve yönetilebilecek.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banka Hesapları Modal */}
      <AnimatePresence>
        {showBankModal && (
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
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem',
            }}
            onClick={() => setShowBankModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem',
                }}
              >
                <h2
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#1a202c',
                    margin: 0,
                  }}
                >
                  Banka Hesapları
                </h2>
                <button
                  onClick={() => setShowBankModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={20} style={{ color: '#64748b' }} />
                </button>
              </div>

              {/* Mevcut Banka Hesapları */}
              <div style={{ marginBottom: '2rem' }}>
                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#1a202c',
                    marginBottom: '1rem',
                  }}
                >
                  Mevcut Hesaplar
                </h3>
                {bankAccounts.length > 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    {bankAccounts.map(account => (
                      <div
                        key={account.id}
                        style={{
                          padding: '1rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          backgroundColor: '#f8fafc',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontWeight: '600',
                              color: '#1a202c',
                              margin: '0 0 0.25rem 0',
                            }}
                          >
                            {account.bankName}
                          </p>
                          <p
                            style={{
                              fontSize: '0.875rem',
                              color: '#64748b',
                              margin: '0 0 0.25rem 0',
                            }}
                          >
                            {account.iban}
                          </p>
                          <p
                            style={{
                              fontSize: '0.875rem',
                              color: '#64748b',
                              margin: 0,
                            }}
                          >
                            {account.accountHolder}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteBankAccount(account.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ef4444',
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#64748b', fontStyle: 'italic' }}>
                    Henüz banka hesabı eklenmemiş.
                  </p>
                )}
              </div>

              {/* Yeni Banka Hesabı Ekleme Formu */}
              <div>
                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#1a202c',
                    marginBottom: '1rem',
                  }}
                >
                  Yeni Hesap Ekle
                </h3>
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
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '0.5rem',
                      }}
                    >
                      IBAN
                    </label>
                    <input
                      type='text'
                      name='iban'
                      value={newBankAccount.iban}
                      onChange={handleBankAccountChange}
                      placeholder='TR33 0006 1005 1978 6457 8413 26'
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: bankFormErrors.iban
                          ? '1px solid #ef4444'
                          : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                    />
                    {bankFormErrors.iban && (
                      <p
                        style={{
                          color: '#ef4444',
                          fontSize: '0.75rem',
                          marginTop: '0.25rem',
                        }}
                      >
                        {bankFormErrors.iban}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Banka Adı
                    </label>
                    <input
                      type='text'
                      name='bankName'
                      value={newBankAccount.bankName}
                      onChange={handleBankAccountChange}
                      placeholder='İş Bankası'
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: bankFormErrors.bankName
                          ? '1px solid #ef4444'
                          : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                    />
                    {bankFormErrors.bankName && (
                      <p
                        style={{
                          color: '#ef4444',
                          fontSize: '0.75rem',
                          marginTop: '0.25rem',
                        }}
                      >
                        {bankFormErrors.bankName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Hesap Sahibi
                    </label>
                    <input
                      type='text'
                      name='accountHolder'
                      value={newBankAccount.accountHolder}
                      onChange={handleBankAccountChange}
                      placeholder='Ahmet Yılmaz'
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: bankFormErrors.accountHolder
                          ? '1px solid #ef4444'
                          : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                    />
                    {bankFormErrors.accountHolder && (
                      <p
                        style={{
                          color: '#ef4444',
                          fontSize: '0.75rem',
                          marginTop: '0.25rem',
                        }}
                      >
                        {bankFormErrors.accountHolder}
                      </p>
                    )}
                  </div>

                  <div
                    style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}
                  >
                    <button
                      onClick={() => setShowBankModal(false)}
                      style={{
                        flex: 1,
                        padding: '0.75rem 1.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleAddBankAccount}
                      style={{
                        flex: 1,
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      Hesap Ekle
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dokümanlar Modal */}
      <AnimatePresence>
        {showDocumentModal && (
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
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem',
            }}
            onClick={() => setShowDocumentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem',
                }}
              >
                <h2
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#1a202c',
                    margin: 0,
                  }}
                >
                  Dokümanlar
                </h2>
                <button
                  onClick={() => setShowDocumentModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={20} style={{ color: '#64748b' }} />
                </button>
              </div>

              {/* Doküman Yükleme */}
              <div
                style={{
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <input
                  type='file'
                  id='document-upload'
                  accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
                  onChange={handleDocumentUpload}
                  style={{ display: 'none' }}
                  disabled={uploadingDocument}
                />
                <label
                  htmlFor='document-upload'
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: uploadingDocument ? '#f3f4f6' : '#3b82f6',
                    color: uploadingDocument ? '#6b7280' : 'white',
                    borderRadius: '6px',
                    cursor: uploadingDocument ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                  }}
                >
                  {uploadingDocument ? (
                    <>
                      <Loader
                        size={16}
                        style={{ animation: 'spin 1s linear infinite' }}
                      />
                      Yükleniyor...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Doküman Yükle
                    </>
                  )}
                </label>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginTop: '0.5rem',
                    margin: '0.5rem 0 0 0',
                  }}
                >
                  PDF, DOC, DOCX, JPG, PNG formatları desteklenir
                </p>
              </div>

              {/* Doküman Listesi */}
              <div>
                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#1a202c',
                    marginBottom: '1rem',
                  }}
                >
                  Mevcut Dokümanlar ({documents.length})
                </h3>
                {documents.length > 0 ? (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {documents.map(document => {
                      const IconComponent = getDocumentIcon(document.type);
                      return (
                        <div
                          key={document.id}
                          style={{
                            padding: '1rem',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            backgroundColor: '#f8fafc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1rem',
                              flex: 1,
                            }}
                          >
                            <div
                              style={{
                                padding: '0.75rem',
                                backgroundColor:
                                  document.type === 'pdf'
                                    ? '#ef4444'
                                    : document.type === 'image'
                                      ? '#10b981'
                                      : '#3b82f6',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <IconComponent
                                size={20}
                                style={{ color: 'white' }}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <p
                                style={{
                                  fontWeight: '600',
                                  color: '#1a202c',
                                  margin: '0 0 0.25rem 0',
                                }}
                              >
                                {document.name}
                              </p>
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '1rem',
                                  fontSize: '0.75rem',
                                  color: '#64748b',
                                }}
                              >
                                <span>Kategori: {document.category}</span>
                                <span>Boyut: {document.size}</span>
                                <span>Tarih: {document.uploadDate}</span>
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleDocumentView(document)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#3b82f6',
                              }}
                              title='Görüntüle'
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDocumentDownload(document)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#10b981',
                              }}
                              title='İndir'
                            >
                              <Download size={16} />
                            </button>
                            <button
                              onClick={() => handleDocumentDelete(document.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ef4444',
                              }}
                              title='Sil'
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '3rem',
                      color: '#64748b',
                    }}
                  >
                    <FileText
                      size={48}
                      style={{ marginBottom: '1rem', opacity: 0.5 }}
                    />
                    <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                      Henüz doküman yüklenmemiş
                    </p>
                    <p style={{ fontSize: '0.875rem' }}>
                      Yukarıdaki butonu kullanarak doküman yükleyebilirsiniz.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Baktığı Yetimler Modal */}
      <AnimatePresence>
        {showOrphansModal && (
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
              zIndex: 1000,
              padding: '1rem',
            }}
            onClick={() => setShowOrphansModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '800px',
                maxHeight: '80vh',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div
                style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#1a202c',
                  }}
                >
                  Baktığı Yetimler
                </h3>
                <motion.button
                  onClick={() => setShowOrphansModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div
                style={{
                  padding: '1.5rem',
                  maxHeight: '60vh',
                  overflowY: 'auto',
                }}
              >
                {orphans.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '3rem',
                      color: '#64748b',
                    }}
                  >
                    <Heart
                      size={48}
                      style={{ marginBottom: '1rem', opacity: 0.5 }}
                    />
                    <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                      Henüz yetim kaydı yok
                    </p>
                    <p style={{ fontSize: '0.875rem' }}>
                      Yetim kayıtları burada görüntülenecek.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {orphans.map(orphan => (
                      <div
                        key={orphan.id}
                        style={{
                          padding: '1.5rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          backgroundColor: '#f9fafb',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <h4
                              style={{
                                margin: '0 0 0.5rem 0',
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                color: '#1a202c',
                              }}
                            >
                              {orphan.name}
                            </h4>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '0.5rem',
                                fontSize: '0.875rem',
                                color: '#64748b',
                              }}
                            >
                              <div>
                                <strong>Yaş:</strong> {orphan.age}
                              </div>
                              <div>
                                <strong>Konum:</strong> {orphan.location}
                              </div>
                              <div>
                                <strong>Başlangıç:</strong>{' '}
                                {orphan.sponsorshipDate}
                              </div>
                              <div>
                                <strong>Aylık Tutar:</strong>{' '}
                                {orphan.monthlyAmount} TL
                              </div>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => handleRemoveOrphan(orphan.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0.5rem',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ef4444',
                            }}
                            whileHover={{ backgroundColor: '#fee2e2' }}
                            title='Kaldır'
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Baktığı Kişiler Modal */}
      <AnimatePresence>
        {showPeopleModal && (
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
              zIndex: 1000,
              padding: '1rem',
            }}
            onClick={() => setShowPeopleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '800px',
                maxHeight: '80vh',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div
                style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#1a202c',
                  }}
                >
                  Baktığı Kişiler
                </h3>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                  }}
                >
                  <motion.button
                    onClick={() => setShowAddPersonForm(true)}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                    }}
                    whileHover={{ backgroundColor: '#2563eb' }}
                  >
                    <Plus size={16} />
                    Ekle
                  </motion.button>
                  <motion.button
                    onClick={() => setShowPeopleModal(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              <div
                style={{
                  padding: '1.5rem',
                  maxHeight: '60vh',
                  overflowY: 'auto',
                }}
              >
                {/* Yeni Kişi Ekleme Formu */}
                {showAddPersonForm && (
                  <div
                    style={{
                      padding: '1.5rem',
                      border: '2px solid #3b82f6',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <h4
                      style={{
                        margin: '0 0 1rem 0',
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#1a202c',
                      }}
                    >
                      Yeni Kişi Ekle
                    </h4>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem',
                        marginBottom: '1rem',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                          }}
                        >
                          İsim Soyisim
                        </label>
                        <input
                          type='text'
                          value={newPerson.name}
                          onChange={e =>
                            setNewPerson(prev => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder='Örn: Mehmet Ali Demir'
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            backgroundColor: 'white',
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                          }}
                        >
                          İlişki
                        </label>
                        <select
                          value={newPerson.relation}
                          onChange={e =>
                            setNewPerson(prev => ({
                              ...prev,
                              relation: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            backgroundColor: 'white',
                          }}
                        >
                          <option value=''>Seçiniz</option>
                          <option value='Anne'>Anne</option>
                          <option value='Baba'>Baba</option>
                          <option value='Kardeş'>Kardeş</option>
                          <option value='Amca'>Amca</option>
                          <option value='Teyze'>Teyze</option>
                          <option value='Dayı'>Dayı</option>
                          <option value='Hala'>Hala</option>
                          <option value='Dede'>Dede</option>
                          <option value='Nine'>Nine</option>
                          <option value='Diğer'>Diğer</option>
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                          }}
                        >
                          TC Kimlik No
                        </label>
                        <input
                          type='text'
                          value={newPerson.tcNo}
                          onChange={e =>
                            setNewPerson(prev => ({
                              ...prev,
                              tcNo: e.target.value,
                            }))
                          }
                          placeholder='Örn: 12345678901'
                          maxLength='11'
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            backgroundColor: 'white',
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                          }}
                        >
                          Doğum Tarihi
                        </label>
                        <input
                          type='date'
                          value={newPerson.birthDate}
                          onChange={e =>
                            setNewPerson(prev => ({
                              ...prev,
                              birthDate: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            backgroundColor: 'white',
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                          }}
                        >
                          Cinsiyet
                        </label>
                        <select
                          value={newPerson.gender}
                          onChange={e =>
                            setNewPerson(prev => ({
                              ...prev,
                              gender: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            backgroundColor: 'white',
                          }}
                        >
                          <option value=''>Seçiniz</option>
                          <option value='Erkek'>Erkek</option>
                          <option value='Kadın'>Kadın</option>
                        </select>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <motion.button
                        onClick={handleCancelAddPerson}
                        style={{
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                        }}
                        whileHover={{ backgroundColor: '#4b5563' }}
                      >
                        İptal
                      </motion.button>
                      <motion.button
                        onClick={handleAddPerson}
                        style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                        }}
                        whileHover={{ backgroundColor: '#059669' }}
                      >
                        Kaydet
                      </motion.button>
                    </div>
                  </div>
                )}

                {people.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '3rem',
                      color: '#64748b',
                    }}
                  >
                    <Users
                      size={48}
                      style={{ marginBottom: '1rem', opacity: 0.5 }}
                    />
                    <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                      Henüz kişi kaydı yok
                    </p>
                    <p style={{ fontSize: '0.875rem' }}>
                      Kişi kayıtları burada görüntülenecek.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {people.map(person => (
                      <div
                        key={person.id}
                        style={{
                          padding: '1.5rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          backgroundColor: '#f9fafb',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <h4
                              style={{
                                margin: '0 0 0.5rem 0',
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                color: '#1a202c',
                              }}
                            >
                              {person.name}
                            </h4>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '0.5rem',
                                fontSize: '0.875rem',
                                color: '#64748b',
                              }}
                            >
                              <div>
                                <strong>İlişki:</strong> {person.relation}
                              </div>
                              <div>
                                <strong>TC No:</strong> {person.tcNo}
                              </div>
                              <div>
                                <strong>Doğum Tarihi:</strong>{' '}
                                {person.birthDate}
                              </div>
                              <div>
                                <strong>Cinsiyet:</strong> {person.gender}
                              </div>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => handleRemovePerson(person.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0.5rem',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ef4444',
                            }}
                            whileHover={{ backgroundColor: '#fee2e2' }}
                            title='Kaldır'
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rıza Beyanları Modal */}
      <AnimatePresence>
        {showConsentModal && (
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
              zIndex: 1000,
              padding: '1rem',
            }}
            onClick={() => setShowConsentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '800px',
                maxHeight: '80vh',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div
                style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#1a202c',
                  }}
                >
                  Rıza Beyanları
                </h3>
                <motion.button
                  onClick={() => setShowConsentModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div
                style={{
                  padding: '1.5rem',
                  maxHeight: '60vh',
                  overflowY: 'auto',
                }}
              >
                {consents.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '3rem',
                      color: '#64748b',
                    }}
                  >
                    <Shield
                      size={48}
                      style={{ marginBottom: '1rem', opacity: 0.5 }}
                    />
                    <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                      Henüz rıza beyanı yok
                    </p>
                    <p style={{ fontSize: '0.875rem' }}>
                      Rıza beyanları burada görüntülenecek.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {consents.map(consent => (
                      <div
                        key={consent.id}
                        style={{
                          padding: '1.5rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          backgroundColor: '#f9fafb',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <h4
                              style={{
                                margin: '0 0 0.5rem 0',
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                color: '#1a202c',
                              }}
                            >
                              {consent.type}
                            </h4>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '0.5rem',
                                fontSize: '0.875rem',
                                color: '#64748b',
                                marginBottom: '1rem',
                              }}
                            >
                              <div>
                                <strong>Durum:</strong>
                                <span
                                  style={{
                                    color:
                                      consent.status === 'Onaylandı'
                                        ? '#10b981'
                                        : consent.status === 'Beklemede'
                                          ? '#f59e0b'
                                          : '#ef4444',
                                    fontWeight: '600',
                                    marginLeft: '0.25rem',
                                  }}
                                >
                                  {consent.status}
                                </span>
                              </div>
                              <div>
                                <strong>Tarih:</strong> {consent.date}
                              </div>
                              <div>
                                <strong>Geçerlilik:</strong>{' '}
                                {consent.expiryDate}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <select
                                value={consent.status}
                                onChange={e =>
                                  handleUpdateConsentStatus(
                                    consent.id,
                                    e.target.value
                                  )
                                }
                                style={{
                                  padding: '0.5rem',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '0.875rem',
                                  backgroundColor: 'white',
                                }}
                              >
                                <option value='Beklemede'>Beklemede</option>
                                <option value='Onaylandı'>Onaylandı</option>
                                <option value='Reddedildi'>Reddedildi</option>
                              </select>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => handleDeleteConsent(consent.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0.5rem',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ef4444',
                            }}
                            whileHover={{ backgroundColor: '#fee2e2' }}
                            title='Sil'
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BeneficiaryDetail;
