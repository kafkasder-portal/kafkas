import { apiClient } from './api.js'

// WhatsApp Cloud API Configuration
const WHATSAPP_API_VERSION = 'v17.0'
const WHATSAPP_PHONE_NUMBER_ID = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '1234567890123456'
const WHATSAPP_ACCESS_TOKEN = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || 'your-access-token'

// WhatsApp Cloud API Base URL
const WHATSAPP_API_BASE_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}`

// WhatsApp Service
export const whatsappService = {
  /**
   * Send a text message via WhatsApp Cloud API
   * @param {string} to - Recipient phone number (with country code, no +)
   * @param {string} message - Message content
   * @param {boolean} previewUrl - Enable URL preview
   * @returns {Promise} API response
   */
  async sendTextMessage(to, message, previewUrl = false) {
    try {
      const response = await fetch(`${WHATSAPP_API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'text',
          text: {
            preview_url: previewUrl,
            body: message
          }
        })
      })

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error)
      throw error
    }
  },

  /**
   * Send a template message via WhatsApp Cloud API
   * @param {string} to - Recipient phone number
   * @param {string} templateName - Template name
   * @param {string} languageCode - Language code (e.g., 'tr_TR')
   * @param {Array} components - Template components
   * @returns {Promise} API response
   */
  async sendTemplateMessage(to, templateName, languageCode = 'tr_TR', components = []) {
    try {
      const response = await fetch(`${WHATSAPP_API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: languageCode
            },
            components: components
          }
        })
      })

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to send WhatsApp template message:', error)
      throw error
    }
  },

  /**
   * Send an interactive message with buttons
   * @param {string} to - Recipient phone number
   * @param {string} bodyText - Message body text
   * @param {Array} buttons - Array of button objects
   * @param {string} footerText - Optional footer text
   * @returns {Promise} API response
   */
  async sendInteractiveMessage(to, bodyText, buttons, footerText = null) {
    try {
      const response = await fetch(`${WHATSAPP_API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: {
              text: bodyText
            },
            ...(footerText && { footer: { text: footerText } }),
            action: {
              buttons: buttons
            }
          }
        })
      })

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to send WhatsApp interactive message:', error)
      throw error
    }
  },

  /**
   * Send a media message (image, document, audio, video)
   * @param {string} to - Recipient phone number
   * @param {string} type - Media type (image, document, audio, video)
   * @param {string} url - Media URL
   * @param {string} caption - Optional caption
   * @param {string} filename - Optional filename for documents
   * @returns {Promise} API response
   */
  async sendMediaMessage(to, type, url, caption = null, filename = null) {
    try {
      const mediaPayload = {
        link: url
      }

      if (caption) {
        mediaPayload.caption = caption
      }

      if (filename && type === 'document') {
        mediaPayload.filename = filename
      }

      const response = await fetch(`${WHATSAPP_API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: type,
          [type]: mediaPayload
        })
      })

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to send WhatsApp media message:', error)
      throw error
    }
  },

  /**
   * Send a location message
   * @param {string} to - Recipient phone number
   * @param {number} latitude - Location latitude
   * @param {number} longitude - Location longitude
   * @param {string} name - Optional location name
   * @param {string} address - Optional location address
   * @returns {Promise} API response
   */
  async sendLocationMessage(to, latitude, longitude, name = null, address = null) {
    try {
      const locationPayload = {
        latitude: latitude,
        longitude: longitude
      }

      if (name) {
        locationPayload.name = name
      }

      if (address) {
        locationPayload.address = address
      }

      const response = await fetch(`${WHATSAPP_API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'location',
          location: locationPayload
        })
      })

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to send WhatsApp location message:', error)
      throw error
    }
  },

  /**
   * Get message status
   * @param {string} messageId - WhatsApp message ID
   * @returns {Promise} API response
   */
  async getMessageStatus(messageId) {
    try {
      const response = await fetch(`${WHATSAPP_API_BASE_URL}/messages?ids=${messageId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
        }
      })

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to get WhatsApp message status:', error)
      throw error
    }
  },

  /**
   * Get media URL
   * @param {string} mediaId - WhatsApp media ID
   * @returns {Promise} API response
   */
  async getMediaUrl(mediaId) {
    try {
      const response = await fetch(`https://graph.facebook.com/${WHATSAPP_API_VERSION}/${mediaId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
        }
      })

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to get WhatsApp media URL:', error)
      throw error
    }
  },

  /**
   * Download media file
   * @param {string} mediaId - WhatsApp media ID
   * @returns {Promise} Media blob
   */
  async downloadMedia(mediaId) {
    try {
      const mediaInfo = await this.getMediaUrl(mediaId)
      const response = await fetch(mediaInfo.url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to download media: ${response.status} ${response.statusText}`)
      }

      return await response.blob()
    } catch (error) {
      console.error('Failed to download WhatsApp media:', error)
      throw error
    }
  },

  /**
   * Send bulk messages to multiple recipients
   * @param {Array} recipients - Array of phone numbers
   * @param {string} message - Message content
   * @param {number} delay - Delay between messages in milliseconds
   * @returns {Promise} Array of results
   */
  async sendBulkMessages(recipients, message, delay = 1000) {
    const results = []
    
    for (const recipient of recipients) {
      try {
        const result = await this.sendTextMessage(recipient, message)
        results.push({ recipient, success: true, data: result })
      } catch (error) {
        results.push({ recipient, success: false, error: error.message })
      }
      
      // Add delay between messages to avoid rate limiting
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    return results
  },

  /**
   * Send notification message (using template)
   * @param {string} to - Recipient phone number
   * @param {string} title - Notification title
   * @param {string} body - Notification body
   * @param {string} actionUrl - Optional action URL
   * @returns {Promise} API response
   */
  async sendNotification(to, title, body, actionUrl = null) {
    try {
      const components = [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: title
            },
            {
              type: 'text',
              text: body
            }
          ]
        }
      ]

      if (actionUrl) {
        components.push({
          type: 'button',
          sub_type: 'url',
          index: 0,
          parameters: [
            {
              type: 'text',
              text: actionUrl
            }
          ]
        })
      }

      return await this.sendTemplateMessage(to, 'notification', 'tr_TR', components)
    } catch (error) {
      console.error('Failed to send WhatsApp notification:', error)
      throw error
    }
  },

  /**
   * Send help message with interactive buttons
   * @param {string} to - Recipient phone number
   * @returns {Promise} API response
   */
  async sendHelpMessage(to) {
    const buttons = [
      {
        type: 'reply',
        reply: {
          id: 'help_general',
          title: 'Genel Yardım'
        }
      },
      {
        type: 'reply',
        reply: {
          id: 'help_technical',
          title: 'Teknik Destek'
        }
      },
      {
        type: 'reply',
        reply: {
          id: 'help_contact',
          title: 'İletişim'
        }
      }
    ]

    return await this.sendInteractiveMessage(
      to,
      'Size nasıl yardımcı olabilirim? Lütfen aşağıdaki seçeneklerden birini seçin:',
      buttons,
      'KAF Portal - Yardım Merkezi'
    )
  },

  /**
   * Validate phone number format
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} Is valid
   */
  validatePhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '')
    
    // Check if it's a valid international format (10-15 digits)
    return cleaned.length >= 10 && cleaned.length <= 15
  },

  /**
   * Format phone number for WhatsApp API
   * @param {string} phoneNumber - Phone number to format
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '')
    
    // Remove leading zeros
    return cleaned.replace(/^0+/, '')
  }
}

export default whatsappService
