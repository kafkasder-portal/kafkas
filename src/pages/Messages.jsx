import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Users,
  Bell,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Archive,
  Trash2,
  Star,
  Reply,
  Forward,
} from 'lucide-react';
import { messagesService } from '../services/messagesService';
import { toast } from 'sonner';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, unread: 0, activeChats: 0 });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: '',
    type: 'internal',
    priority: 'medium',
  });
  const messagesEndRef = useRef(null);

  // Veri yükleme fonksiyonu
  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagesService.getAll();
      setMessages(data);

      // İstatistikleri hesapla
      if (Array.isArray(data)) {
        const unreadCount = data.filter(msg => msg.unread).length;
        const activeChats = new Set(data.map(msg => msg.sender)).size;
        setStats({
          total: data.length,
          unread: unreadCount,
          activeChats,
        });
      } else {
        setStats({
          total: 0,
          unread: 0,
          activeChats: 0,
        });
      }
    } catch (_err) {
      setError(`Mesajlar yüklenirken hata oluştu: ${_err.message}`);
      toast.error('Mesajlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Mesaj güncelleme fonksiyonu
  const handleUpdateMessage = async (id, updates) => {
    try {
      await messagesService.update(id, updates);
      await loadMessages();
      toast.success('Mesaj güncellendi');
    } catch (_err) {
      toast.error('Mesaj güncellenirken hata oluştu');
    }
  };

  // Mesaj silme fonksiyonu
  const handleDeleteMessage = async id => {
    try {
      await messagesService.delete(id);
      await loadMessages();
      toast.success('Mesaj silindi');
    } catch (_err) {
      toast.error('Mesaj silinirken hata oluştu');
    }
  };

  // Yeni mesaj gönderme
  const handleSendMessage = async () => {
    try {
      await messagesService.sendMessage(newMessage);
      setNewMessage({
        recipient: '',
        subject: '',
        content: '',
        type: 'internal',
        priority: 'medium',
      });
      setShowNewMessageModal(false);
      await loadMessages();
      toast.success('Mesaj gönderildi');
    } catch (_err) {
      toast.error('Mesaj gönderilirken hata oluştu');
    }
  };

  // Filtrelenmiş mesajlar
  const filteredMessages = Array.isArray(messages)
    ? messages.filter(message => {
        const matchesSearch =
          message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.content?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
          filterType === 'all' ||
          (filterType === 'unread' && message.unread) ||
          (filterType === 'internal' && message.type === 'internal') ||
          (filterType === 'announcement' && message.type === 'announcement') ||
          (filterType === 'report' && message.type === 'report');

        return matchesSearch && matchesFilter;
      })
    : [];

  // Component mount edildiğinde veri yükle
  useEffect(() => {
    loadMessages();
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return '#dc2626';
      case 'medium':
        return '#d97706';
      case 'low':
        return '#059669';
      default:
        return '#64748b';
    }
  };

  const getTypeIcon = type => {
    switch (type) {
      case 'internal':
        return <MessageSquare size={16} />;
      case 'announcement':
        return <Bell size={16} />;
      case 'report':
        return <Users size={16} />;
      default:
        return <MessageSquare size={16} />;
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Mesajlaşma
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
            İç iletişim ve mesaj yönetimi
          </p>
        </div>
        <motion.button
          className='btn-primary'
          onClick={() => setShowNewMessageModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} />
          Yeni Mesaj
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <motion.div
          className='card'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          style={{ padding: '1.5rem', textAlign: 'center' }}
        >
          <MessageSquare
            size={32}
            color='var(--primary-color)'
            style={{ margin: '0 auto 0.5rem' }}
          />
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '0.25rem',
              color: 'var(--text-primary)',
            }}
          >
            Toplam Mesaj
          </h3>
          <p
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--primary-color)',
              margin: 0,
            }}
          >
            {stats.total}
          </p>
        </motion.div>

        <motion.div
          className='card'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -5 }}
          style={{ padding: '1.5rem', textAlign: 'center' }}
        >
          <Bell
            size={32}
            color='var(--error-color)'
            style={{ margin: '0 auto 0.5rem' }}
          />
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '0.25rem',
              color: 'var(--text-primary)',
            }}
          >
            Okunmamış
          </h3>
          <p
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--error-color)',
              margin: 0,
            }}
          >
            {stats.unread}
          </p>
        </motion.div>

        <motion.div
          className='card'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5 }}
          style={{ padding: '1.5rem', textAlign: 'center' }}
        >
          <Users
            size={32}
            color='var(--success-color)'
            style={{ margin: '0 auto 0.5rem' }}
          />
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '0.25rem',
              color: 'var(--text-primary)',
            }}
          >
            Aktif Sohbet
          </h3>
          <p
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--success-color)',
              margin: 0,
            }}
          >
            {stats.activeChats}
          </p>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: '300px' }}>
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
              placeholder='Mesajlarda ara...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.875rem',
                backgroundColor: 'var(--background-primary)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            fontSize: '0.875rem',
            backgroundColor: 'var(--background-primary)',
            color: 'var(--text-primary)',
            minWidth: '150px',
          }}
        >
          <option value='all'>Tüm Mesajlar</option>
          <option value='unread'>Okunmamış</option>
          <option value='internal'>İç Mesajlar</option>
          <option value='announcement'>Duyurular</option>
          <option value='report'>Raporlar</option>
        </select>
      </div>

      {/* Messages List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div
              style={{
                display: 'inline-block',
                width: '32px',
                height: '32px',
                border: '3px solid var(--border-color)',
                borderTop: '3px solid var(--primary-color)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            ></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Mesajlar yükleniyor...
            </p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--error-color)', marginBottom: '1rem' }}>
              {error}
            </p>
            <button className='btn-primary' onClick={loadMessages}>
              Tekrar Dene
            </button>
          </div>
        )}

        {!loading && !error && filteredMessages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <MessageSquare
              size={48}
              color='var(--text-muted)'
              style={{ marginBottom: '1rem' }}
            />
            <p style={{ color: 'var(--text-secondary)' }}>Mesaj bulunamadı.</p>
          </div>
        )}

        {!loading && !error && filteredMessages.length > 0 && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message.id}
                className='card'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -2 }}
                style={{
                  borderLeft: message.unread
                    ? '4px solid var(--primary-color)'
                    : '4px solid transparent',
                  backgroundColor: message.unread
                    ? 'var(--background-secondary)'
                    : 'var(--background-primary)',
                  cursor: 'pointer',
                  padding: '1rem',
                }}
                onClick={() => setSelectedMessage(message)}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {getTypeIcon(message.type)}
                      <h3
                        style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)',
                          margin: 0,
                        }}
                      >
                        {message.sender}
                      </h3>
                      {message.unread && (
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary-color)',
                          }}
                        />
                      )}
                      <span
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          backgroundColor: `${getPriorityColor(message.priority)}20`,
                          color: getPriorityColor(message.priority),
                        }}
                      >
                        {message.priority === 'high'
                          ? 'Yüksek'
                          : message.priority === 'medium'
                            ? 'Orta'
                            : 'Düşük'}
                      </span>
                    </div>
                    <p
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {message.subject}
                    </p>
                    <p
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                        margin: 0,
                        lineHeight: '1.4',
                      }}
                    >
                      {message.content.length > 100
                        ? `${message.content.substring(0, 100)}...`
                        : message.content}
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span
                      style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}
                    >
                      {message.time}
                    </span>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleUpdateMessage(message.id, {
                            unread: !message.unread,
                          });
                        }}
                        style={{
                          padding: '0.25rem',
                          backgroundColor: 'rgba(0,0,0,0)',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          color: message.unread
                            ? 'var(--primary-color)'
                            : 'var(--text-muted)',
                        }}
                      >
                        <Bell size={16} />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteMessage(message.id);
                        }}
                        style={{
                          padding: '0.25rem',
                          backgroundColor: 'rgba(0,0,0,0)',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
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
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: 'var(--background-primary)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1.5rem',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      margin: '0 0 0.5rem 0',
                    }}
                  >
                    {selectedMessage.subject}
                  </h2>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Gönderen: {selectedMessage.sender}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {selectedMessage.time}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p
                  style={{
                    color: 'var(--text-primary)',
                    lineHeight: '1.6',
                    margin: 0,
                  }}
                >
                  {selectedMessage.content}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() =>
                    handleUpdateMessage(selectedMessage.id, {
                      unread: !selectedMessage.unread,
                    })
                  }
                  className='btn-secondary'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Bell size={16} />
                  {selectedMessage.unread
                    ? 'Okundu İşaretle'
                    : 'Okunmadı İşaretle'}
                </button>
                <button
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className='btn-error'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Trash2 size={16} />
                  Sil
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Message Modal */}
      <AnimatePresence>
        {showNewMessageModal && (
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
            onClick={() => setShowNewMessageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: 'var(--background-primary)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                maxWidth: '500px',
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
                Yeni Mesaj
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
                  placeholder='Alıcı'
                  value={newMessage.recipient}
                  onChange={e =>
                    setNewMessage({ ...newMessage, recipient: e.target.value })
                  }
                  style={{
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                  }}
                />

                <input
                  type='text'
                  placeholder='Konu'
                  value={newMessage.subject}
                  onChange={e =>
                    setNewMessage({ ...newMessage, subject: e.target.value })
                  }
                  style={{
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                  }}
                />

                <textarea
                  placeholder='Mesaj içeriği'
                  value={newMessage.content}
                  onChange={e =>
                    setNewMessage({ ...newMessage, content: e.target.value })
                  }
                  rows={4}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    resize: 'vertical',
                  }}
                />

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <select
                    value={newMessage.type}
                    onChange={e =>
                      setNewMessage({ ...newMessage, type: e.target.value })
                    }
                    style={{
                      padding: '0.75rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      flex: 1,
                    }}
                  >
                    <option value='internal'>İç Mesaj</option>
                    <option value='announcement'>Duyuru</option>
                    <option value='report'>Rapor</option>
                  </select>

                  <select
                    value={newMessage.priority}
                    onChange={e =>
                      setNewMessage({ ...newMessage, priority: e.target.value })
                    }
                    style={{
                      padding: '0.75rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      flex: 1,
                    }}
                  >
                    <option value='low'>Düşük</option>
                    <option value='medium'>Orta</option>
                    <option value='high'>Yüksek</option>
                  </select>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'flex-end',
                  }}
                >
                  <button
                    onClick={() => setShowNewMessageModal(false)}
                    className='btn-secondary'
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className='btn-primary'
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Send size={16} />
                    Gönder
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
