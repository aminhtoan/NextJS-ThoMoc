import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { getConversation, listMessage } from 'src/service/message'
import { getUserById } from 'src/service/user'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8888/api'

interface Message {
  id: number
  fromUserId: number | string
  toUserId: number | string
  content: string
  readAt: Date | null
  createdAt: Date
}

interface Shop {
  partnerId: number
  content: string
  createdAt: Date
  readAt: Date | null
  isFromMe: boolean
  name?: string
  avatar?: string | null
}

interface ChatListWidgetProps {
  currentUserId?: number
  authToken?: string
  isOpen?: boolean
  toggleChat?: () => void
  targetUserId?: number
}

const ChatListWidget: React.FC<ChatListWidgetProps> = ({
  currentUserId,
  authToken,
  isOpen,
  toggleChat,
  targetUserId
}) => {
  const [currentView, setCurrentView] = useState<'list' | 'chat'>('list')
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [shopss, setShops] = useState<Shop[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [userInfo, setUserInfo] = useState<{ name: string; avatar: string | null } | null>(null)
  const [userInfoMap, setUserInfoMap] = useState<Record<number, { name: string; avatar: string | null }>>({})

  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Theme color - Màu xanh biển
  const primaryColor = '#1976d2'
  const primaryColorHover = '#1565c0'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // ==================== WEBSOCKET fdsaf====================
  useEffect(() => {
    if (!authToken || !currentUserId) {
      return
    }
    const wsUrl = API_BASE_URL.replace('/api', '')

    const socket = io(`${wsUrl}/chat`, {
      transports: ['websocket', 'polling'],
      auth: { authorization: `Bearer ${authToken}` }
    })

    socketRef.current = socket

    // socket.on('connect', () => console.log('✅ Socket connected'))

    socket.on('message:receive', (newMessage: Message) => {
      if (
        selectedShop &&
        (Number(newMessage.fromUserId) === selectedShop.partnerId ||
          Number(newMessage.toUserId) === selectedShop.partnerId)
      ) {
        setMessages(prev => [...prev, newMessage])
        if (Number(newMessage.fromUserId) === selectedShop.partnerId) {
          socket.emit('message:read', { fromUserId: selectedShop.partnerId })
        }
      }
      fetchMessage()
    })

    socket.on('message:seen', (data: any) => {
      setMessages(prev =>
        prev.map(msg =>
          Number(msg.fromUserId) === currentUserId && Number(msg.toUserId) === data.toUserId
            ? { ...msg, readAt: new Date(data.readAt) }
            : msg
        )
      )
    })

    socket.on('message:typing', (data: { fromUserId: number; isTyping: boolean }) => {
      if (selectedShop && Number(data.fromUserId) === selectedShop.partnerId) {
        setIsTyping(data.isTyping)
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [authToken, currentUserId, selectedShop])

  // Auto-open chat with target user when widget opens
  useEffect(() => {
    if (isOpen && currentUserId) {
      fetchMessage()
      if (targetUserId && targetUserId !== currentUserId) {
        const existingShop = shopss.find(s => s.partnerId === targetUserId)
        if (existingShop) {
          handleSelectShop(existingShop)
        } else {
          // No existing conversation — open a new chat view directly
          // Fetch user info
          const cachedUserInfo = userInfoMap[targetUserId]
          if (cachedUserInfo) {
            setUserInfo(cachedUserInfo)
          } else {
            getUserById(targetUserId)
              .then(response => {
                const userData = response?.data
                if (userData) {
                  const newUserInfo = { name: userData.name || userData.email, avatar: userData.avatar || null }
                  setUserInfo(newUserInfo)
                  setUserInfoMap(prev => ({ ...prev, [targetUserId]: newUserInfo }))
                }
              })
              .catch(() => setUserInfo(null))
          }

          const newShop: Shop = {
            partnerId: targetUserId,
            content: '',
            createdAt: new Date(),
            readAt: null,
            isFromMe: false
          }
          setSelectedShop(newShop)
          setCurrentView('chat')
          setMessages([])
          getConversation(targetUserId)
            .then(response => {
              let msgs: Message[] = []
              if (response?.data) {
                if (Array.isArray(response.data)) msgs = response.data
                else if (Array.isArray(response.data.data)) msgs = response.data.data
                else if (Array.isArray(response.data.messages)) msgs = response.data.messages
              }
              setMessages(msgs)
            })
            .catch(() => setMessages([]))
        }
      }
    }
  }, [isOpen, currentUserId, targetUserId])

  const fetchMessage = async () => {
    try {
      const response = await listMessage()
      const data = response?.data?.data || response?.data || []
      const conversations = Array.isArray(data) ? data : []
      setShops(conversations)

      // Fetch user info for all conversation partners
      const userIds = conversations.map(shop => shop.partnerId).filter(id => !userInfoMap[id])
      if (userIds.length > 0) {
        const userInfoPromises = userIds.map(async userId => {
          try {
            const userResponse = await getUserById(userId)
            const userData = userResponse?.data
            if (userData) {
              return {
                id: userId,
                info: { name: userData.name || userData.email, avatar: userData.avatar || null }
              }
            }
          } catch (e) {
            console.error(`Failed to fetch user ${userId}:`, e)
          }

          return null
        })

        const userInfoResults = await Promise.all(userInfoPromises)
        const newUserInfoMap = { ...userInfoMap }
        userInfoResults.forEach(result => {
          if (result) {
            newUserInfoMap[result.id] = result.info
          }
        })
        setUserInfoMap(newUserInfoMap)
      }
    } catch (e) {
      console.error(e)
      setShops([])
    }
  }

  const handleSelectShop = async (shop: Shop) => {
    setSelectedShop(shop)
    setCurrentView('chat')
    setIsLoading(true)
    setMessages([])

    // Set user info from map or fetch if not available
    const cachedUserInfo = userInfoMap[shop.partnerId]
    if (cachedUserInfo) {
      setUserInfo(cachedUserInfo)
    } else {
      // Fetch user info if not in cache
      try {
        const userResponse = await getUserById(shop.partnerId)
        const userData = userResponse?.data
        if (userData) {
          const newUserInfo = { name: userData.name || userData.email, avatar: userData.avatar || null }
          setUserInfo(newUserInfo)
          setUserInfoMap(prev => ({ ...prev, [shop.partnerId]: newUserInfo }))
        }
      } catch (e) {
        console.error('Failed to fetch user info:', e)
      }
    }

    try {
      const response = await getConversation(shop.partnerId)
      let msgs: Message[] = []
      if (response?.data) {
        if (Array.isArray(response.data)) msgs = response.data
        else if (Array.isArray(response.data.data)) msgs = response.data.data
        else if (Array.isArray(response.data.messages)) msgs = response.data.messages
      }
      setMessages(msgs)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToList = () => {
    setCurrentView('list')
    setSelectedShop(null)
    setMessages([])
    setIsTyping(false)
    setUserInfo(null)
    fetchMessage()
  }

  const handleSendMessage = () => {
    if (!message.trim() || !selectedShop || !socketRef.current || !currentUserId) return

    socketRef.current.emit('message:send', {
      toUserId: selectedShop.partnerId,
      content: message.trim()
    })

    const optimisticMessage: Message = {
      id: Date.now(),
      fromUserId: currentUserId,
      toUserId: selectedShop.partnerId,
      content: message.trim(),
      readAt: null,
      createdAt: new Date()
    }

    setMessages(prev => [...prev, optimisticMessage])
    setMessage('')
    fetchMessage()
  }

  const handleTypingStart = () => {
    if (!selectedShop || !socketRef.current) return
    socketRef.current.emit('message:typing', {
      toUserId: selectedShop.partnerId,
      isTyping: true
    })
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('message:typing', { toUserId: selectedShop.partnerId, isTyping: false })
    }, 3000)
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  if (!currentUserId) {
    return (
      <Box sx={{ position: 'fixed', bottom: 100, right: 24, width: 380, height: 500, zIndex: 1001 }}>
        <Paper
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <CircularProgress sx={{ color: primaryColor }} />
          <Typography>Đang tải thông tin người dùng...</Typography>
        </Paper>
      </Box>
    )
  }

  return (
    <>
      {/* Floating Button */}
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
        <IconButton
          onClick={toggleChat}
          sx={{
            width: 60,
            height: 60,
            backgroundColor: primaryColor,
            color: 'white',
            boxShadow: `0 4px 12px ${primaryColor}66`,
            '&:hover': { backgroundColor: primaryColorHover, transform: 'scale(1.05)' }
          }}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </Box>

      {isOpen && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: 300,
            height: 400,
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              p: 2,
              backgroundColor: primaryColor,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            {currentView === 'chat' && selectedShop ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <IconButton size='small' onClick={handleBackToList} sx={{ color: 'white' }}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Avatar
                    sx={{ width: 36, height: 36 }}
                    src={userInfo?.avatar || selectedShop.avatar || undefined}
                    alt={userInfo?.name || selectedShop.name || 'User'}
                  />
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {userInfo?.name || selectedShop.name || `User #${selectedShop.partnerId}`}
                    </Typography>
                    {isTyping && <Typography sx={{ fontSize: '12px', opacity: 0.9 }}>Đang nhập...</Typography>}
                  </Box>
                </Box>
                <IconButton size='small' onClick={toggleChat} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </>
            ) : (
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', justifyContent: 'space-between' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <ChatBubbleOutlineIcon />
                  <Typography sx={{ fontWeight: 600 }}>Chat</Typography>
                </Box>
                <IconButton size='small' onClick={toggleChat} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* CHAT VIEW */}
          {currentView === 'chat' ? (
            <>
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  overflowY: 'auto',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress size={40} sx={{ color: primaryColor }} />
                  </Box>
                ) : (
                  messages.map(msg => {
                    const isFromMe = Number(msg.fromUserId) === Number(currentUserId)

                    return (
                      <Box key={msg.id} sx={{ alignSelf: isFromMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: isFromMe ? primaryColor : 'white',
                            color: isFromMe ? 'white' : '#333',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            borderTopRightRadius: isFromMe ? 0 : 8,
                            borderTopLeftRadius: isFromMe ? 8 : 0
                          }}
                        >
                          {msg.content}
                          <Typography
                            sx={{ fontSize: '11px', opacity: 0.75, mt: 0.5, textAlign: isFromMe ? 'right' : 'left' }}
                          >
                            {formatTime(msg.createdAt)}
                            {isFromMe && msg.readAt && ' ✓✓'}
                          </Typography>
                        </Box>
                      </Box>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* INPUT */}
              <Box sx={{ p: 2, backgroundColor: 'white', borderTop: '1px solid #e0e0e0', display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size='small'
                  placeholder='Nhập tin nhắn...'
                  value={message}
                  onChange={e => {
                    setMessage(e.target.value)
                    handleTypingStart()
                  }}
                  onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: '#f5f5f5' } }}
                />
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  sx={{
                    backgroundColor: primaryColor,
                    color: 'white',
                    '&:hover': { backgroundColor: primaryColorHover }
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box sx={{ flex: 1, overflowY: 'auto', backgroundColor: '#f5f5f5' }}>
              {shopss.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    gap: 2
                  }}
                >
                  <ChatBubbleOutlineIcon sx={{ fontSize: 64, color: '#ccc' }} />
                  <Typography sx={{ color: '#999' }}>Chưa có cuộc trò chuyện nào</Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {shopss.map(shop => {
                    const userInfo = userInfoMap[shop.partnerId]

                    return (
                      <ListItem
                        key={shop.partnerId}
                        onClick={() => handleSelectShop(shop)}
                        sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f9f9f9' } }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={userInfo?.avatar || shop.avatar || undefined}
                            alt={userInfo?.name || shop.name || 'User'}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={userInfo?.name || shop.name || `User #${shop.partnerId}`}
                          secondary={`${shop.isFromMe ? 'Bạn: ' : ''}${shop.content}`}
                        />
                      </ListItem>
                    )
                  })}
                </List>
              )}
            </Box>
          )}
        </Paper>
      )}
    </>
  )
}

export default ChatListWidget
