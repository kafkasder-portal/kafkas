// Real-time bildirim servisi
export class NotificationService {
  constructor(notificationContext) {
    this.notificationContext = notificationContext
    this.isPolling = false
    this.pollingInterval = null
    this.lastCheckTime = new Date()
    this.taskDeadlineChecker = null
    
    // Mock verileri
    this.mockTasks = [
      {
        id: 1,
        title: 'Bağış raporunu hazırla',
        deadline: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 saat sonra
        priority: 'high',
        status: 'pending',
        assignee: 'Ahmet Yılmaz'
      },
      {
        id: 2,
        title: 'Gönüllü eğitimi düzenle',
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 gün sonra
        priority: 'medium',
        status: 'in-progress',
        assignee: 'Fatma Demir'
      },
      {
        id: 3,
        title: 'Stok sayımı yap',
        deadline: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 saat sonra
        priority: 'low',
        status: 'pending',
        assignee: 'Mehmet Kaya'
      }
    ]
    
    this.mockDonations = [
      {
        id: 1,
        donor: 'Ali Veli',
        amount: '₺1,500',
        time: new Date(),
        type: 'online'
      },
      {
        id: 2,
        donor: 'Ayşe Fatma',
        amount: '₺500',
        time: new Date(),
        type: 'cash'
      }
    ]
    
    this.mockActivities = [
      {
        id: 1,
        type: 'volunteer_registration',
        user: 'Elif Yıldız',
        message: 'Yeni gönüllü kaydı yapıldı',
        time: new Date()
      },
      {
        id: 2,
        type: 'meeting_reminder',
        message: 'Yarın saat 14:00 yönetim kurulu toplantısı',
        time: new Date()
      }
    ]
  }

  // Polling başlat (DEVRE DIŞI)
  startPolling() {
    // Sürekli bildirim gönderme devre dışı bırakıldı
    return
    
    // if (this.isPolling) return
    // 
    // this.isPolling = true
    // 
    // // Ana polling döngüsü (30 saniye)
    // this.pollingInterval = setInterval(() => {
    //   this.checkForNewNotifications()
    // }, 30000)
    // 
    // // Görev deadline kontrolü (5 dakita)
    // this.taskDeadlineChecker = setInterval(() => {
    //   this.checkTaskDeadlines()
    // }, 5 * 60 * 1000)
    // 
    // // İlk kontrolleri hemen yap
    // setTimeout(() => this.checkForNewNotifications(), 2000)
    // setTimeout(() => this.checkTaskDeadlines(), 5000)
    // 
    // // Demo amaçlı rastgele bildirimler
    // this.startDemoNotifications()
  }

  // Polling durdur
  stopPolling() {
    if (!this.isPolling) return
    
    this.isPolling = false
    
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
    }
    
    if (this.taskDeadlineChecker) {
      clearInterval(this.taskDeadlineChecker)
      this.taskDeadlineChecker = null
    }
    
    if (this.demoInterval) {
      clearInterval(this.demoInterval)
      this.demoInterval = null
    }
  }

  // Yeni bildirimler için kontrol et (DEVRE DIŞI)
  async checkForNewNotifications() {
    return
    
    // try {
    //   // Gerçek uygulamada API'den veri çekilecek
    //   // const response = await fetch('/api/notifications/recent')
    //   // const newNotifications = await response.json()
    //   
    //   // Mock: Rastgele sistem güncellemeleri
    //   if (Math.random() > 0.7) {
    //     const updates = [
    //       'Sistem performansı optimizasyonu tamamlandı',
    //       'Yeni güvenlik güncellemesi uygulandı',
    //       'Veritabanı yedeklemesi başarıyla tamamlandı',
    //       'Otomatik raporlama sistemi çalışıyor',
    //       'Kullanıcı oturum süreleri güncellendi'
    //     ]
    //     
    //     const randomUpdate = updates[Math.floor(Math.random() * updates.length)]
    //     
    //     this.notificationContext.notifySystemUpdate({
    //       message: randomUpdate,
    //       timestamp: new Date().toISOString()
    //     })
    //   }
    //   
    //   // Mock: Rastgele kullanıcı aktiviteleri
    //   if (Math.random() > 0.8) {
    //     const activities = this.mockActivities
    //     const randomActivity = activities[Math.floor(Math.random() * activities.length)]
    //     
    //     this.notificationContext.notifyUserActivity({
    //       message: randomActivity.message,
    //       user: randomActivity.user,
    //       type: randomActivity.type
    //     })
    //   }
    //   
    // } catch (error) {
    //   console.error('Bildirim kontrolü hatası:', error)
    // }
  }

  // Görev deadline'larını kontrol et
  checkTaskDeadlines() {
    const now = new Date()
    
    this.mockTasks.forEach(task => {
      const timeUntilDeadline = task.deadline - now
      const hoursUntilDeadline = timeUntilDeadline / (1000 * 60 * 60)
      
      // 24 saat kala uyarı
      if (hoursUntilDeadline <= 24 && hoursUntilDeadline > 23.8) {
        this.notificationContext.notifyTaskDeadline({
          ...task,
          urgencyMessage: '24 saat kaldı!'
        })
      }
      
      // 2 saat kala kritik uyarı
      else if (hoursUntilDeadline <= 2 && hoursUntilDeadline > 1.8) {
        this.notificationContext.addNotification({
          type: this.notificationContext.NOTIFICATION_TYPES.ERROR,
          title: 'Kritik Görev Uyarısı',
          message: `"${task.title}" görevi 2 saat içinde teslim edilmeli!`,
          priority: this.notificationContext.NOTIFICATION_PRIORITY.URGENT,
          category: 'task_deadline_critical',
          data: { taskId: task.id, deadline: task.deadline }
        })
      }
      
      // Geçmişte kalan görevler
      else if (hoursUntilDeadline <= 0) {
        this.notificationContext.addNotification({
          type: this.notificationContext.NOTIFICATION_TYPES.ERROR,
          title: 'Görev Deadline Geçti',
          message: `"${task.title}" görevi teslim tarihi geçti!`,
          priority: this.notificationContext.NOTIFICATION_PRIORITY.URGENT,
          category: 'task_overdue',
          data: { taskId: task.id, deadline: task.deadline }
        })
      }
    })
  }

  // Demo amaçlı rastgele bildirimler (DEVRE DIŞI)
  startDemoNotifications() {
    return
    
    // // Her 2-5 dakikada bir rastgele bildirim
    // this.demoInterval = setInterval(() => {
    //   if (Math.random() > 0.5) {
    //     this.generateRandomNotification()
    //   }
    // }, Math.random() * 180000 + 120000) // 2-5 dakika arası
  }

  generateRandomNotification() {
    const notificationTypes = [
      {
        type: 'donation',
        generator: () => {
          const donors = ['Ali Yılmaz', 'Fatma Kaya', 'Mehmet Özkan', 'Ayşe Demir', 'Hasan Çelik']
          const amounts = ['₺500', '₺1,000', '₺2,500', '₺750', '₺1,500']
          
          const donor = donors[Math.floor(Math.random() * donors.length)]
          const amount = amounts[Math.floor(Math.random() * amounts.length)]
          
          this.notificationContext.notifyNewDonation({
            id: Date.now(),
            donor,
            amount
          })
        }
      },
      {
        type: 'volunteer',
        generator: () => {
          const volunteers = ['Elif Yıldız', 'Can Kılıç', 'Zeynep Aydın', 'Burak Şen', 'Selin Arslan']
          const volunteer = volunteers[Math.floor(Math.random() * volunteers.length)]
          
          this.notificationContext.addNotification({
            type: this.notificationContext.NOTIFICATION_TYPES.SUCCESS,
            title: 'Yeni Gönüllü',
            message: `${volunteer} sisteme gönüllü olarak kaydoldu`,
            priority: this.notificationContext.NOTIFICATION_PRIORITY.MEDIUM,
            category: 'volunteer_registration'
          })
        }
      },
      {
        type: 'meeting',
        generator: () => {
          const meetings = [
            'Proje değerlendirme toplantısı',
            'Bütçe planlama toplantısı',
            'Gönüllü koordinasyon toplantısı',
            'Stratejik planlama toplantısı'
          ]
          
          const meeting = meetings[Math.floor(Math.random() * meetings.length)]
          
          this.notificationContext.addNotification({
            type: this.notificationContext.NOTIFICATION_TYPES.INFO,
            title: 'Toplantı Hatırlatması',
            message: `Yarın ${meeting} planlanmıştır`,
            priority: this.notificationContext.NOTIFICATION_PRIORITY.MEDIUM,
            category: 'meeting_reminder'
          })
        }
      },
      {
        type: 'system',
        generator: () => {
          const systemMessages = [
            'Otomatik veri yedeklemesi tamamlandı',
            'Günlük rapor oluşturuldu',
            'Sistem güvenlik taraması başarılı',
            'Performans optimizasyonu uygulandı'
          ]
          
          const message = systemMessages[Math.floor(Math.random() * systemMessages.length)]
          
          this.notificationContext.addNotification({
            type: this.notificationContext.NOTIFICATION_TYPES.INFO,
            title: 'Sistem Bildirimi',
            message,
            priority: this.notificationContext.NOTIFICATION_PRIORITY.LOW,
            category: 'system_auto',
            showToast: false
          })
        }
      }
    ]
    
    const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
    randomType.generator()
  }

  // Manuel bildirim gönder (test amaçlı)
  sendTestNotification(type = 'info') {
    const testMessages = {
      success: 'Test başarı bildirimi',
      error: 'Test hata bildirimi',
      warning: 'Test uyarı bildirimi',
      info: 'Test bilgi bildirimi'
    }
    
    this.notificationContext.showToast(
      testMessages[type] || testMessages.info,
      this.notificationContext.NOTIFICATION_TYPES[type.toUpperCase()] || this.notificationContext.NOTIFICATION_TYPES.INFO
    )
  }

  // Bildirim istatistikleri
  getStats() {
    return {
      isPolling: this.isPolling,
      lastCheckTime: this.lastCheckTime,
      totalTasks: this.mockTasks.length,
      upcomingDeadlines: this.mockTasks.filter(task => {
        const hoursUntil = (task.deadline - new Date()) / (1000 * 60 * 60)
        return hoursUntil <= 24 && hoursUntil > 0
      }).length
    }
  }
}

// Singleton instance
let notificationServiceInstance = null

export const createNotificationService = (notificationContext) => {
  if (!notificationServiceInstance) {
    notificationServiceInstance = new NotificationService(notificationContext)
  }
  return notificationServiceInstance
}

export const getNotificationService = () => {
  return notificationServiceInstance
}
