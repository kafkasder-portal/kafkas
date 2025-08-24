import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Phone,
  Users,
  Search,
  Plus,
  MoreVertical,
  Paperclip,
  Smile,
  Archive,
  Trash2,
  Star,
  Reply,
  Forward,
  Video,
  Image,
  FileText,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Download,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import whatsappService from '../services/whatsappService';
import WhatsAppLogin from './WhatsAppLogin';

const WhatsApp = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);
  const [whatsAppSession, setWhatsAppSession] = useState(null);
  const messagesEndRef = useRef(null);

  // Mock data for contacts
  const mockContacts = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      phone: '+90 532 123 4567',
      email: 'ahmet@email.com',
      avatar: 'AY',
      lastMessage: 'Yardım paketi ne zaman gelecek?',
      lastMessageTime: '14:30',
      unreadCount: 2,
      status: 'online',
      notes: 'Acil yardım ihtiyacı var',
    },
    {
      id: 2,
      name: 'Fatma Demir',
      phone: '+90 533 234 5678',
      email: 'fatma@email.com',
      avatar: 'FD',
      lastMessage: 'Teşekkürler, çok yardımcı oldunuz',
      lastMessageTime: '12:15',
      unreadCount: 0,
      status: 'offline',
      notes: 'Düzenli bağışçı',
    },
    {
      id: 3,
      name: 'Mehmet Kaya',
      phone: '+90 534 345 6789',
      email: 'mehmet@email.com',
      avatar: 'MK',
      lastMessage: 'Gönüllü olmak istiyorum',
      lastMessageTime: '09:45',
      unreadCount: 1,
      status: 'online',
      notes: 'Yeni gönüllü adayı',
    },
    {
      id: 4,
      name: 'Ayşe Özkan',
      phone: '+90 535 456 7890',
      email: 'ayse@email.com',
      avatar: 'AÖ',
      lastMessage: 'Burs başvurusu hakkında bilgi alabilir miyim?',
      lastMessageTime: 'Dün',
      unreadCount: 0,
      status: 'offline',
      notes: 'Burs başvurusu yapacak',
    },
    {
      id: 5,
      name: 'Hasan Yıldız',
      phone: '+90 536 567 8901',
      email: 'hasan@email.com',
      avatar: 'HY',
      lastMessage: 'Sağlık yardımı için başvuru yapmak istiyorum',
      lastMessageTime: '2 gün önce',
      unreadCount: 0,
      status: 'offline',
      notes: 'Sağlık yardımı ihtiyacı',
    },
  ];

  // Mock messages for selected contact
  const mockMessages = [
    {
      id: 1,
      sender: 'user',
      content: 'Merhaba, yardım paketi ne zaman gelecek?',
      timestamp: '14:30',
      status: 'read',
      type: 'text',
    },
    {
      id: 2,
      sender: 'business',
      content:
        "Merhaba Ahmet Bey, yardım paketiniz yarın saat 10:00'da teslim edilecek.",
      timestamp: '14:32',
      status: 'read',
      type: 'text',
    },
    {
      id: 3,
      sender: 'user',
      content: 'Çok teşekkürler! Adres bilgilerim doğru mu?',
      timestamp: '14:33',
      status: 'read',
      type: 'text',
    },
    {
      id: 4,
      sender: 'business',
      content:
        'Evet, kayıtlı adresiniz: İstanbul, Kadıköy, Atatürk Mahallesi, No: 123',
      timestamp: '14:35',
      status: 'delivered',
      type: 'text',
    },
    {
      id: 5,
      sender: 'user',
      content: 'Mükemmel! Bekliyorum.',
      timestamp: '14:36',
      status: 'sent',
      type: 'text',
    },
  ];

  useEffect(() => {
    setContacts(mockContacts);
  }, []);

  useEffect(() => {
    if (selectedContact) {
      setMessages(mockMessages);
    }
  }, [selectedContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredContacts = contacts.filter(
    contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    const message = {
      id: Date.now(),
      sender: 'business',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sending',
      type: 'text',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    try {
      // Format phone number for WhatsApp API
      const formattedPhone = whatsappService.formatPhoneNumber(
        selectedContact.phone
      );

      // Send message via WhatsApp API
      const response = await whatsappService.sendTextMessage(
        formattedPhone,
        newMessage
      );

      // Update message status to sent
      setMessages(prev =>
        prev.map(msg =>
          msg.id === message.id
            ? { ...msg, status: 'sent', whatsappId: response.messages?.[0]?.id }
            : msg
        )
      );

      toast.success('Mesaj WhatsApp üzerinden gönderildi');

      // Simulate delivery status (in real app, you'd use webhooks)
      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === message.id ? { ...msg, status: 'delivered' } : msg
          )
        );
      }, 2000);
    } catch (error) {
      console.error('WhatsApp message error:', error);

      // Update message status to failed
      setMessages(prev =>
        prev.map(msg =>
          msg.id === message.id ? { ...msg, status: 'failed' } : msg
        )
      );

      toast.error(`Mesaj gönderilemedi: ${error.message}`);
    }
  };

  const handleWhatsAppLogin = sessionData => {
    setIsWhatsAppConnected(true);
    setWhatsAppSession(sessionData);
    toast.success(`WhatsApp bağlandı: ${sessionData.phoneNumber}`);
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('İsim ve telefon numarası gereklidir');
      return;
    }

    const contact = {
      id: Date.now(),
      name: newContact.name,
      phone: newContact.phone,
      email: newContact.email,
      avatar: newContact.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase(),
      lastMessage: '',
      lastMessageTime: 'Şimdi',
      unreadCount: 0,
      status: 'offline',
      notes: newContact.notes,
    };

    setContacts(prev => [contact, ...prev]);
    setNewContact({ name: '', phone: '', email: '', notes: '' });
    setShowNewContactModal(false);
    toast.success('Kişi eklendi');
  };

  const getStatusColor = status => {
    switch (status) {
      case 'online':
        return '#10b981';
      case 'offline':
        return '#64748b';
      default:
        return '#64748b';
    }
  };

  const getMessageStatusIcon = status => {
    switch (status) {
      case 'sending':
        return <Clock size={12} color='#64748b' />;
      case 'sent':
        return <CheckCircle size={12} color='#64748b' />;
      case 'delivered':
        return <CheckCircle size={12} color='#3b82f6' />;
      case 'read':
        return <CheckCircle size={12} color='#10b981' />;
      case 'failed':
        return <AlertCircle size={12} color='#ef4444' />;
      default:
        return null;
    }
  };

  // Show WhatsApp login if not connected
  if (!isWhatsAppConnected) {
    return (
      <WhatsAppLogin
        onLoginSuccess={handleWhatsAppLogin}
        onBack={() => window.history.back()}
      />
    );
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        backgroundColor: 'var(--background-secondary)',
      }}
    >
      {/* Contacts Sidebar */}
      <div
        style={{
          width: '350px',
          backgroundColor: 'var(--background-primary)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                WhatsApp
              </h2>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#25D366',
                  color: 'white',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                  }}
                />
                Bağlı
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'rgba(0,0,0,0)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
              >
                <Settings size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewContactModal(true)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'rgba(0,0,0,0)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
              >
                <Plus size={20} />
              </motion.button>
            </div>
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search
              size={20}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type='text'
              placeholder='Kişi ara...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.875rem',
                backgroundColor: 'var(--background-secondary)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        {/* Contacts List */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {filteredContacts.map(contact => (
            <motion.div
              key={contact.id}
              whileHover={{ backgroundColor: 'var(--background-secondary)' }}
              onClick={() => setSelectedContact(contact)}
              style={{
                padding: '1rem',
                borderBottom: '1px solid var(--border-color)',
                cursor: 'pointer',
                backgroundColor:
                  selectedContact?.id === contact.id
                    ? 'var(--background-secondary)'
                    : 'rgba(0,0,0,0)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: '600',
                    }}
                  >
                    {contact.avatar}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(contact.status),
                      border: '2px solid var(--background-primary)',
                    }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.25rem',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {contact.name}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {contact.lastMessageTime}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {contact.lastMessage || 'Henüz mesaj yok'}
                  </p>
                </div>

                {contact.unreadCount > 0 && (
                  <div
                    style={{
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}
                  >
                    {contact.unreadCount}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div
              style={{
                padding: '1rem',
                borderBottom: '1px solid var(--border-color)',
                backgroundColor: 'var(--background-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                  }}
                >
                  {selectedContact.avatar}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(selectedContact.status),
                    border: '2px solid var(--background-primary)',
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    margin: '0 0 0.25rem 0',
                  }}
                >
                  {selectedContact.name}
                </h3>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    margin: 0,
                  }}
                >
                  {selectedContact.status === 'online'
                    ? 'Çevrimiçi'
                    : 'Çevrimdışı'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Video size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Phone size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <MoreVertical size={20} />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflow: 'auto',
                padding: '1rem',
                backgroundColor: 'var(--background-secondary)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                {messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: 'flex',
                      justifyContent:
                        message.sender === 'business'
                          ? 'flex-end'
                          : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor:
                          message.sender === 'business'
                            ? 'var(--primary-color)'
                            : 'var(--background-primary)',
                        color:
                          message.sender === 'business'
                            ? 'white'
                            : 'var(--text-primary)',
                        position: 'relative',
                      }}
                    >
                      <p
                        style={{
                          margin: '0 0 0.5rem 0',
                          fontSize: '0.875rem',
                          lineHeight: '1.4',
                        }}
                      >
                        {message.content}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                          {message.timestamp}
                        </span>
                        {message.sender === 'business' &&
                          getMessageStatusIcon(message.status)}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div
              style={{
                padding: '1rem',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--background-primary)',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Smile size={20} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Paperclip size={20} />
                </motion.button>

                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type='text'
                    placeholder='Mesaj yazın...'
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: '0.875rem',
                      backgroundColor: 'var(--background-secondary)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: newMessage.trim()
                      ? 'var(--primary-color)'
                      : 'var(--border-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--background-secondary)',
            }}
          >
            <div style={{ textAlign: 'center', maxWidth: '400px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                  fontSize: '2rem',
                }}
              >
                <MessageSquare size={40} />
              </div>
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: '0 0 0.5rem 0',
                }}
              >
                WhatsApp Entegrasyonu
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  margin: '0 0 1.5rem 0',
                  lineHeight: '1.5',
                }}
              >
                Mesajlaşmaya başlamak için sol taraftan bir kişi seçin veya yeni
                kişi ekleyin.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewContactModal(true)}
                className='btn-primary'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0 auto',
                }}
              >
                <Plus size={18} />
                Yeni Kişi Ekle
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* New Contact Modal */}
      <AnimatePresence>
        {showNewContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem',
            }}
            onClick={() => setShowNewContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: 'var(--background-primary)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                maxWidth: '400px',
                width: '100%',
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: '0 0 1.5rem 0',
                }}
              >
                Yeni Kişi Ekle
              </h2>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <input
                  type='text'
                  placeholder='Ad Soyad'
                  value={newContact.name}
                  onChange={e =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                  style={{
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                  }}
                />

                <input
                  type='tel'
                  placeholder='Telefon Numarası'
                  value={newContact.phone}
                  onChange={e =>
                    setNewContact({ ...newContact, phone: e.target.value })
                  }
                  style={{
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                  }}
                />

                <input
                  type='email'
                  placeholder='E-posta (Opsiyonel)'
                  value={newContact.email}
                  onChange={e =>
                    setNewContact({ ...newContact, email: e.target.value })
                  }
                  style={{
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                  }}
                />

                <textarea
                  placeholder='Notlar (Opsiyonel)'
                  value={newContact.notes}
                  onChange={e =>
                    setNewContact({ ...newContact, notes: e.target.value })
                  }
                  rows={3}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    resize: 'vertical',
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'flex-end',
                  }}
                >
                  <button
                    onClick={() => setShowNewContactModal(false)}
                    className='btn-secondary'
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleAddContact}
                    className='btn-primary'
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Plus size={16} />
                    Ekle
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WhatsApp;
