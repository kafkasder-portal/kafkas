import { AnimatePresence } from 'framer-motion'
import { MessageCircle, Mic, MicOff, MoreVertical, Phone, PhoneOff, Users, Video, VideoOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const RealTimeCollaboration = ({ roomId = 'general' }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [participants, setParticipants] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isMicOn, setIsMicOn] = useState(false)
  const [isCallActive, setIsCallActive] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const messagesEndRef = useRef(null)

  // Mock participants
  const mockParticipants = [
    { id: 1, name: 'Ahmet Yılmaz', role: 'Admin', status: 'online', avatar: 'AY' },
    { id: 2, name: 'Fatma Demir', role: 'Gönüllü', status: 'online', avatar: 'FD' },
    { id: 3, name: 'Mehmet Kaya', role: 'Koordinatör', status: 'away', avatar: 'MK' },
    { id: 4, name: 'Ayşe Özkan', role: 'Gönüllü', status: 'offline', avatar: 'AÖ' }
  ]

  // Mock messages
  const mockMessages = [
    { id: 1, userId: 1, name: 'Ahmet Yılmaz', message: 'Merhaba! Bugünkü toplantıya hazır mısınız?', timestamp: '10:30' },
    { id: 2, userId: 2, name: 'Fatma Demir', message: 'Evet, hazırım. Gündem maddelerini gözden geçirdim.', timestamp: '10:32' },
    { id: 3, userId: 3, name: 'Mehmet Kaya', message: 'Ben de katılıyorum. Bağış kampanyası hakkında konuşalım.', timestamp: '10:35' }
  ]

  useEffect(() => {
    // Simulate connection
    const connectToRoom = async () => {
      setIsConnected(false)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsConnected(true)
      setParticipants(mockParticipants)
      setMessages(mockMessages)
      toast.success('Odaya bağlandınız!')
    }

    connectToRoom()
  }, [roomId])

  useEffect(() => {
    // Auto scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now(),
      userId: 1, // Current user
      name: 'Siz',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    toast.success('Mesaj gönderildi!')
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
    toast.success(isVideoOn ? 'Video kapatıldı' : 'Video açıldı')
  }

  const toggleMic = () => {
    setIsMicOn(!isMicOn)
    toast.success(isMicOn ? 'Mikrofon kapatıldı' : 'Mikrofon açıldı')
  }

  const toggleCall = () => {
    setIsCallActive(!isCallActive)
    toast.success(isCallActive ? 'Görüşme sonlandırıldı' : 'Görüşme başlatıldı')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border h-96 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <h3 className="font-semibold text-gray-900">Canlı İşbirliği</h3>
            <span className="text-sm text-gray-500">Oda: {roomId}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Users className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.userId === 1 ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.userId === 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                    }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">
                        {message.name}
                      </span>
                      <span className="text-xs opacity-75">
                        {message.timestamp}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Mesajınızı yazın..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Participants Sidebar */}
        <AnimatePresence>
          {showParticipants && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-gray-200 bg-gray-50"
            >
              <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-4">Katılımcılar ({participants.length})</h4>
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {participant.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(participant.status)}`}></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                        <p className="text-xs text-gray-500">{participant.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Bar */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={toggleMic}
            className={`p-3 rounded-full transition-colors ${isMicOn ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
          >
            {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${isVideoOn ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>

          <button
            onClick={toggleCall}
            className={`p-3 rounded-full transition-colors ${isCallActive ? 'bg-red-600 text-white' : 'bg-green-600 text-white hover:bg-green-700'
              }`}
          >
            {isCallActive ? <PhoneOff className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RealTimeCollaboration
