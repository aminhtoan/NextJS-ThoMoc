import SmartToyIcon from '@mui/icons-material/SmartToy'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import {
  Avatar,
  Box,
  Card,
  CardMedia,
  CircularProgress,
  Fab,
  IconButton,
  Paper,
  TextField,
  Typography,
  Zoom,
  Badge,
  Tooltip,
  Fade
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import handleAPI from 'src/apis/handleAPI'
import { API_CONFIG } from 'src/configs/api'
import { useRouter } from 'next/router'

interface Product {
  id: number
  name: string
  basePrice: number
  virtualPrice: number
  images: string[]
}

interface ChatMessage {
  role: 'user' | 'model'
  parts: { text: string }[]
  products?: Product[]
}

const GeminiChatBot = () => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  const handleSend = async () => {
    const trimmed = message.trim()
    if (!trimmed || loading) return

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: trimmed }] }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setMessage('')
    setLoading(true)

    try {
      const res = await handleAPI(
        API_CONFIG.AI_CHAT.CHAT,
        {
          message: trimmed,
          history: messages.map(m => ({ role: m.role, parts: m.parts }))
        },
        'post'
      )

      const botMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: res.data.reply }],
        products: res.data.products?.length > 0 ? res.data.products : undefined
      }
      setMessages(prev => [...prev, botMessage])
    } catch {
      const errorMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.' }]
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClearChat = () => {
    setMessages([])
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Bold text
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

      // Bullet points
      const bulletFormatted = formatted.replace(/^\* /, '• ')

      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: bulletFormatted }} />
          {i < text.split('\n').length - 1 && <br />}
        </span>
      )
    })
  }

  return (
    <>
      {/* Floating Action Button */}
      <Zoom in={!open}>
        <Fab
          color='primary'
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1300,
            width: 60,
            height: 60,
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
          }}
        >
          <Badge color='error' variant='dot' invisible={messages.length > 0}>
            <SmartToyIcon sx={{ fontSize: 28 }} />
          </Badge>
        </Fab>
      </Zoom>

      {/* Chat Window */}
      <Fade in={open}>
        <Paper
          elevation={12}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: { xs: 'calc(100vw - 32px)', sm: 400 },
            height: { xs: 'calc(100vh - 100px)', sm: 550 },
            zIndex: 1300,
            display: open ? 'flex' : 'none',
            flexDirection: 'column',
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              px: 2,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  width: 36,
                  height: 36
                }}
              >
                <SmartToyIcon sx={{ fontSize: 22 }} />
              </Avatar>
              <Box>
                <Typography variant='subtitle1' fontWeight={600} lineHeight={1.2}>
                  AI Assistant
                </Typography>
                <Typography variant='caption' sx={{ opacity: 0.85 }}>
                  Powered by Gemini
                </Typography>
              </Box>
            </Box>
            <Box>
              <Tooltip title='Xóa cuộc trò chuyện'>
                <IconButton size='small' sx={{ color: 'white', mr: 0.5 }} onClick={handleClearChat}>
                  <DeleteOutlineIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              <IconButton size='small' sx={{ color: 'white' }} onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              bgcolor: '#f8f9fa',
              '&::-webkit-scrollbar': { width: 6 },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'rgba(0,0,0,0.15)',
                borderRadius: 3
              }
            }}
          >
            {messages.length === 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  opacity: 0.6,
                  gap: 1
                }}
              >
                <SmartToyIcon sx={{ fontSize: 48, color: '#667eea' }} />
                <Typography variant='body2' color='text.secondary' textAlign='center'>
                  Xin chào! Tôi là AI Assistant.
                  <br />
                  Hãy hỏi tôi bất cứ điều gì!
                </Typography>
              </Box>
            )}

            {messages.map((msg, idx) => (
              <Box key={idx}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    gap: 1
                  }}
                >
                  {msg.role === 'model' && (
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: '#667eea',
                        mt: 0.5
                      }}
                    >
                      <SmartToyIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      maxWidth: '80%',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      bgcolor: msg.role === 'user' ? '#667eea' : 'white',
                      color: msg.role === 'user' ? 'white' : 'text.primary',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      wordBreak: 'break-word'
                    }}
                  >
                    <Typography variant='body2' sx={{ lineHeight: 1.6, fontSize: '0.875rem' }}>
                      {msg.role === 'model' ? formatMessage(msg.parts[0].text) : msg.parts[0].text}
                    </Typography>
                  </Paper>
                </Box>

                {/* Product Cards */}
                {msg.products && msg.products.length > 0 && (
                  <Box
                    sx={{
                      ml: 4.5,
                      mt: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1
                    }}
                  >
                    {msg.products.map(product => (
                      <Card
                        key={product.id}
                        sx={{
                          display: 'flex',
                          cursor: 'pointer',
                          borderRadius: 2,
                          overflow: 'hidden',
                          transition: 'box-shadow 0.2s',
                          '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }
                        }}
                        onClick={() => router.push(`/product/${product.id}`)}
                      >
                        <CardMedia
                          component='img'
                          sx={{ width: 70, height: 70, objectFit: 'cover' }}
                          image={product.images?.[0] || '/images/placeholder.png'}
                          alt={product.name}
                        />
                        <Box sx={{ p: 1, flex: 1, minWidth: 0 }}>
                          <Typography variant='body2' fontWeight={600} noWrap sx={{ fontSize: '0.8rem' }}>
                            {product.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <Typography variant='body2' fontWeight={700} color='error' sx={{ fontSize: '0.8rem' }}>
                              {formatPrice(product.basePrice)}
                            </Typography>
                            {product.virtualPrice > product.basePrice && (
                              <Typography
                                variant='caption'
                                sx={{ textDecoration: 'line-through', color: 'text.disabled', fontSize: '0.7rem' }}
                              >
                                {formatPrice(product.virtualPrice)}
                              </Typography>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                            <ShoppingCartIcon sx={{ fontSize: 12, color: '#667eea' }} />
                            <Typography variant='caption' color='text.secondary' sx={{ fontSize: '0.7rem' }}>
                              Xem chi tiết
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
            ))}

            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: '#667eea'
                  }}
                >
                  <SmartToyIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: '16px 16px 16px 4px',
                    bgcolor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <CircularProgress size={16} sx={{ color: '#667eea' }} />
                  <Typography variant='body2' color='text.secondary'>
                    Đang suy nghĩ...
                  </Typography>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: 1.5,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'white',
              display: 'flex',
              gap: 1,
              alignItems: 'flex-end'
            }}
          >
            <TextField
              inputRef={inputRef}
              fullWidth
              multiline
              maxRows={3}
              size='small'
              placeholder='Nhập tin nhắn...'
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  fontSize: '0.875rem'
                }
              }}
            />
            <IconButton
              color='primary'
              onClick={handleSend}
              disabled={!message.trim() || loading}
              sx={{
                bgcolor: message.trim() ? '#667eea' : undefined,
                color: message.trim() ? 'white' : undefined,
                '&:hover': {
                  bgcolor: message.trim() ? '#5a6fd6' : undefined
                },
                width: 40,
                height: 40
              }}
            >
              <SendIcon fontSize='small' />
            </IconButton>
          </Box>
        </Paper>
      </Fade>
    </>
  )
}

export default GeminiChatBot
