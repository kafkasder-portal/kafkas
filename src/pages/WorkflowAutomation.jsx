import { AnimatePresence } from 'framer-motion'
import {
    Activity,
    AlertCircle,
    Bell,
    Calendar,
    CheckCircle,
    Clock,
    Code,
    Copy,
    Database,
    Edit3,
    Filter,
    Mail,
    Pause,
    Play,
    Plus,
    Settings,
    Square,
    Target,
    Users
} from 'lucide-react'
import { useEffect, useState } from 'react'

const WorkflowAutomation = () => {
  const [workflows, setWorkflows] = useState([])
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [executionHistory, setExecutionHistory] = useState([])

  // Mock data
  const mockWorkflows = [
    {
      id: 1,
      name: 'Bağış Onay Süreci',
      description: 'Yeni bağışları otomatik olarak onaylar ve teşekkür e-postası gönderir',
      status: 'active',
      triggers: ['new_donation'],
      actions: ['verify_donation', 'send_email', 'update_database'],
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
      runCount: 156,
      successRate: 98.7,
      category: 'donations'
    },
    {
      id: 2,
      name: 'Gönüllü Görev Ataması',
      description: 'Uygun gönüllülere otomatik görev ataması yapar',
      status: 'active',
      triggers: ['new_task', 'volunteer_available'],
      actions: ['match_volunteer', 'assign_task', 'send_notification'],
      lastRun: new Date(Date.now() - 30 * 60 * 1000),
      runCount: 89,
      successRate: 94.3,
      category: 'volunteers'
    },
    {
      id: 3,
      name: 'Etkinlik Hatırlatması',
      description: 'Etkinlik öncesi otomatik hatırlatma mesajları gönderir',
      status: 'paused',
      triggers: ['event_reminder'],
      actions: ['send_sms', 'send_email', 'create_notification'],
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
      runCount: 45,
      successRate: 100,
      category: 'events'
    }
  ]

  const mockExecutions = [
    {
      id: 1,
      workflowId: 1,
      status: 'success',
      startTime: new Date(Date.now() - 10 * 60 * 1000),
      endTime: new Date(Date.now() - 9 * 60 * 1000),
      duration: 60000,
      steps: [
        { name: 'Bağış Doğrulama', status: 'success', duration: 2000 },
        { name: 'E-posta Gönderimi', status: 'success', duration: 3000 },
        { name: 'Veritabanı Güncelleme', status: 'success', duration: 1500 }
      ]
    },
    {
      id: 2,
      workflowId: 2,
      status: 'failed',
      startTime: new Date(Date.now() - 25 * 60 * 1000),
      endTime: new Date(Date.now() - 24 * 60 * 1000),
      duration: 45000,
      error: 'Gönüllü eşleşme hatası',
      steps: [
        { name: 'Gönüllü Eşleşme', status: 'failed', duration: 5000, error: 'Uygun gönüllü bulunamadı' },
        { name: 'Görev Atama', status: 'skipped' },
        { name: 'Bildirim Gönderimi', status: 'skipped' }
      ]
    }
  ]

  useEffect(() => {
    setWorkflows(mockWorkflows)
    setExecutionHistory(mockExecutions)
  }, [])

  const WorkflowCard = ({ workflow }) => {
    const getStatusColor = (status) => {
      const colors = {
        active: '#10b981',
        paused: '#f59e0b',
        error: '#ef4444'
      }
      return colors[status] || '#6b7280'
    }

    const getCategoryColor = (category) => {
      const colors = {
        donations: '#10b981',
        volunteers: '#3b82f6',
        events: '#8b5cf6',
        tasks: '#f59e0b'
      }
      return colors[category] || '#6b7280'
    }

    const formatDuration = (date) => {
      const now = new Date()
      const diff = now - date
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (hours > 0) return `${hours}s ${minutes}dk önce`
      return `${minutes}dk önce`
    }

    return (
      <motion.div
        className="card"
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          cursor: 'pointer',
          border: selectedWorkflow?.id === workflow.id ? `2px solid #667eea` : '1px solid #e5e7eb'
        }}
        onClick={() => setSelectedWorkflow(workflow)}
        whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
        layout
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <motion.div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: getStatusColor(workflow.status)
              }}
              animate={{
                scale: workflow.status === 'active' ? [1, 1.2, 1] : [1],
                opacity: workflow.status === 'active' ? [1, 0.7, 1] : [1]
              }}
              transition={{
                duration: 2,
                repeat: workflow.status === 'active' ? Infinity : 0
              }}
            />
            <div
              style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: `${getCategoryColor(workflow.category)}15`,
                color: getCategoryColor(workflow.category),
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}
            >
              {workflow.category}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <motion.button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '4px'
              }}
              whileHover={{ backgroundColor: '#f3f4f6' }}
            >
              <Edit3 size={14} color="#6b7280" />
            </motion.button>
            <motion.button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '4px'
              }}
              whileHover={{ backgroundColor: '#f3f4f6' }}
            >
              <Copy size={14} color="#6b7280" />
            </motion.button>
          </div>
        </div>

        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#1a202c' }}>
          {workflow.name}
        </h3>
        
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1rem 0', lineHeight: '1.4' }}>
          {workflow.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {workflow.triggers.slice(0, 2).map((trigger, index) => (
            <div
              key={index}
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: '#667eea15',
                color: '#667eea',
                borderRadius: '6px',
                fontSize: '0.75rem'
              }}
            >
              {trigger}
            </div>
          ))}
          {workflow.triggers.length > 2 && (
            <div
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                borderRadius: '6px',
                fontSize: '0.75rem'
              }}
            >
              +{workflow.triggers.length - 2}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.75rem' }}>
          <div>
            <span style={{ color: '#6b7280', display: 'block' }}>Son Çalıştırma</span>
            <span style={{ color: '#374151', fontWeight: '500' }}>
              {formatDuration(workflow.lastRun)}
            </span>
          </div>
          <div>
            <span style={{ color: '#6b7280', display: 'block' }}>Toplam Çalışma</span>
            <span style={{ color: '#374151', fontWeight: '500' }}>
              {workflow.runCount}
            </span>
          </div>
          <div>
            <span style={{ color: '#6b7280', display: 'block' }}>Başarı Oranı</span>
            <span style={{ color: '#10b981', fontWeight: '600' }}>
              {workflow.successRate}%
            </span>
          </div>
        </div>
      </motion.div>
    )
  }

  const WorkflowBuilder = () => {
    const [builderStep, setBuilderStep] = useState('trigger')
    const [newWorkflow, setNewWorkflow] = useState({
      name: '',
      description: '',
      triggers: [],
      actions: [],
      conditions: []
    })

    const availableTriggers = [
      { id: 'new_donation', name: 'Yeni Bağış', icon: Target, description: 'Yeni bağış geldiğinde' },
      { id: 'new_volunteer', name: 'Yeni Gönüllü', icon: Users, description: 'Yeni gönüllü kaydında' },
      { id: 'task_completed', name: 'Görev Tamamlandı', icon: CheckCircle, description: 'Görev tamamlandığında' },
      { id: 'event_created', name: 'Etkinlik Oluşturuldu', icon: Calendar, description: 'Yeni etkinlik oluşturulduğunda' },
      { id: 'scheduled', name: 'Zamanlı', icon: Clock, description: 'Belirli zamanlarda' }
    ]

    const availableActions = [
      { id: 'send_email', name: 'E-posta Gönder', icon: Mail, description: 'E-posta gönder' },
      { id: 'send_notification', name: 'Bildirim Gönder', icon: Bell, description: 'Sistem bildirimi gönder' },
      { id: 'update_database', name: 'Veritabanı Güncelle', icon: Database, description: 'Veritabanını güncelle' },
      { id: 'assign_task', name: 'Görev Ata', icon: Target, description: 'Gönüllüye görev ata' },
      { id: 'create_record', name: 'Kayıt Oluştur', icon: Plus, description: 'Yeni kayıt oluştur' },
      { id: 'run_script', name: 'Script Çalıştır', icon: Code, description: 'Özel script çalıştır' }
    ]

    const TriggerSelector = () => (
      <div>
        <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>
          Tetikleyici Seçin
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {availableTriggers.map((trigger) => {
            const Icon = trigger.icon
            const isSelected = newWorkflow.triggers.includes(trigger.id)
            
            return (
              <motion.div
                key={trigger.id}
                style={{
                  padding: '1rem',
                  border: `2px solid ${isSelected ? '#667eea' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#667eea10' : 'white'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setNewWorkflow(prev => ({
                    ...prev,
                    triggers: isSelected 
                      ? prev.triggers.filter(t => t !== trigger.id)
                      : [...prev.triggers, trigger.id]
                  }))
                }}
              >
                <Icon size={20} color={isSelected ? '#667eea' : '#6b7280'} style={{ marginBottom: '0.5rem' }} />
                <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: '600' }}>
                  {trigger.name}
                </h5>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                  {trigger.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    )

    const ActionSelector = () => (
      <div>
        <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>
          Eylemler Seçin
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {availableActions.map((action) => {
            const Icon = action.icon
            const isSelected = newWorkflow.actions.includes(action.id)
            
            return (
              <motion.div
                key={action.id}
                style={{
                  padding: '1rem',
                  border: `2px solid ${isSelected ? '#10b981' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#10b98110' : 'white'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setNewWorkflow(prev => ({
                    ...prev,
                    actions: isSelected 
                      ? prev.actions.filter(a => a !== action.id)
                      : [...prev.actions, action.id]
                  }))
                }}
              >
                <Icon size={20} color={isSelected ? '#10b981' : '#6b7280'} style={{ marginBottom: '0.5rem' }} />
                <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: '600' }}>
                  {action.name}
                </h5>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                  {action.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    )

    return (
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginTop: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
            Yeni Workflow Oluştur
          </h3>
          <motion.button
            onClick={() => setIsCreating(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '4px'
            }}
            whileHover={{ backgroundColor: '#f3f4f6' }}
          >
            <Square size={16} />
          </motion.button>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          {['trigger', 'action', 'review'].map((step, index) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: builderStep === step ? '#667eea' : index < ['trigger', 'action', 'review'].indexOf(builderStep) ? '#10b981' : '#e5e7eb',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}
              >
                {index + 1}
              </div>
              {index < 2 && (
                <div
                  style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: index < ['trigger', 'action', 'review'].indexOf(builderStep) ? '#10b981' : '#e5e7eb',
                    margin: '0 1rem'
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div style={{ marginBottom: '2rem' }}>
          {builderStep === 'trigger' && <TriggerSelector />}
          {builderStep === 'action' && <ActionSelector />}
          {builderStep === 'review' && (
            <div>
              <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>
                Workflow Özeti
              </h4>
              <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Workflow Adı
                  </label>
                  <input
                    type="text"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Workflow adını girin"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Açıklama
                  </label>
                  <textarea
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Workflow açıklamasını girin"
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Tetikleyiciler</span>
                    <div style={{ marginTop: '0.5rem' }}>
                      {newWorkflow.triggers.map(trigger => (
                        <div key={trigger} style={{
                          display: 'inline-block',
                          margin: '0.25rem 0.25rem 0 0',
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#667eea15',
                          color: '#667eea',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}>
                          {trigger}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Eylemler</span>
                    <div style={{ marginTop: '0.5rem' }}>
                      {newWorkflow.actions.map(action => (
                        <div key={action} style={{
                          display: 'inline-block',
                          margin: '0.25rem 0.25rem 0 0',
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#10b98115',
                          color: '#10b981',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}>
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <motion.button
            onClick={() => {
              const steps = ['trigger', 'action', 'review']
              const currentIndex = steps.indexOf(builderStep)
              if (currentIndex > 0) {
                setBuilderStep(steps[currentIndex - 1])
              }
            }}
            disabled={builderStep === 'trigger'}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: builderStep === 'trigger' ? '#e5e7eb' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: builderStep === 'trigger' ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
            whileHover={builderStep !== 'trigger' ? { scale: 1.02 } : {}}
            whileTap={builderStep !== 'trigger' ? { scale: 0.98 } : {}}
          >
            Geri
          </motion.button>
          
          <motion.button
            onClick={() => {
              const steps = ['trigger', 'action', 'review']
              const currentIndex = steps.indexOf(builderStep)
              if (currentIndex < steps.length - 1) {
                setBuilderStep(steps[currentIndex + 1])
              } else {
                // Save workflow
                const newId = workflows.length + 1
                setWorkflows(prev => [...prev, {
                  id: newId,
                  ...newWorkflow,
                  status: 'active',
                  lastRun: new Date(),
                  runCount: 0,
                  successRate: 100,
                  category: 'custom'
                }])
                setIsCreating(false)
                setNewWorkflow({ name: '', description: '', triggers: [], actions: [], conditions: [] })
                setBuilderStep('trigger')
              }
            }}
            disabled={
              (builderStep === 'trigger' && newWorkflow.triggers.length === 0) ||
              (builderStep === 'action' && newWorkflow.actions.length === 0) ||
              (builderStep === 'review' && (!newWorkflow.name || !newWorkflow.description))
            }
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              opacity: (builderStep === 'trigger' && newWorkflow.triggers.length === 0) ||
                      (builderStep === 'action' && newWorkflow.actions.length === 0) ||
                      (builderStep === 'review' && (!newWorkflow.name || !newWorkflow.description)) ? 0.5 : 1
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {builderStep === 'review' ? 'Oluştur' : 'İleri'}
          </motion.button>
        </div>
      </motion.div>
    )
  }

  const ExecutionHistory = () => (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ marginTop: '2rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
          Çalıştırma Geçmişi
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <motion.button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
            whileHover={{ backgroundColor: '#e5e7eb' }}
          >
            <Filter size={14} />
            Filtrele
          </motion.button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>
                Workflow
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>
                Durum
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>
                Süre
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>
                Başlangıç
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>
                Bitiş
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>
                İşlem
              </th>
            </tr>
          </thead>
          <tbody>
            {executionHistory.map((execution) => {
              const workflow = workflows.find(w => w.id === execution.workflowId)
              const statusColor = execution.status === 'success' ? '#10b981' : '#ef4444'
              const StatusIcon = execution.status === 'success' ? CheckCircle : AlertCircle
              
              return (
                <motion.tr
                  key={execution.id}
                  style={{ borderBottom: '1px solid #f3f4f6' }}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                >
                  <td style={{ padding: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                        {workflow?.name || 'Bilinmeyen Workflow'}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        ID: {execution.workflowId}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StatusIcon size={16} color={statusColor} />
                      <span style={{ fontSize: '0.875rem', color: statusColor, fontWeight: '500' }}>
                        {execution.status === 'success' ? 'Başarılı' : 'Hatalı'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      {Math.round(execution.duration / 1000)}s
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      {execution.startTime.toLocaleTimeString()}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      {execution.endTime.toLocaleTimeString()}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <motion.button
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        borderRadius: '4px'
                      }}
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                    >
                      <Activity size={14} color="#6b7280" />
                    </motion.button>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )

  return (
    <div className="page-container">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="page-title">Workflow Otomasyonu</h1>
          <p className="page-subtitle">İş süreçlerinizi otomatikleştirin ve verimliliği artırın</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <motion.button
            onClick={() => setIsCreating(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={16} />
            Yeni Workflow
          </motion.button>
        </div>
      </motion.div>

      {/* Workflow Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <AnimatePresence>
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </AnimatePresence>
      </div>

      {/* Workflow Builder */}
      <AnimatePresence>
        {isCreating && <WorkflowBuilder />}
      </AnimatePresence>

      {/* Execution History */}
      <ExecutionHistory />

      {/* Selected Workflow Details */}
      <AnimatePresence>
        {selectedWorkflow && (
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ 
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '600px',
              zIndex: 1000,
              backgroundColor: 'white',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                {selectedWorkflow.name}
              </h3>
              <motion.button
                onClick={() => setSelectedWorkflow(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '4px'
                }}
                whileHover={{ backgroundColor: '#f3f4f6' }}
              >
                <Square size={16} />
              </motion.button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ color: '#6b7280', lineHeight: '1.5' }}>
                {selectedWorkflow.description}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <motion.button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: selectedWorkflow.status === 'active' ? '#f59e0b' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedWorkflow.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                {selectedWorkflow.status === 'active' ? 'Durdur' : 'Başlat'}
              </motion.button>
              
              <motion.button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings size={16} />
                Ayarlar
              </motion.button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Tetikleyiciler
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedWorkflow.triggers.map((trigger, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#667eea15',
                        color: '#667eea',
                        borderRadius: '4px',
                        fontSize: '0.75rem'
                      }}
                    >
                      {trigger}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Eylemler
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedWorkflow.actions.map((action, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#10b98115',
                        color: '#10b981',
                        borderRadius: '4px',
                        fontSize: '0.75rem'
                      }}
                    >
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {selectedWorkflow && (
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
              zIndex: 999
            }}
            onClick={() => setSelectedWorkflow(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default WorkflowAutomation
