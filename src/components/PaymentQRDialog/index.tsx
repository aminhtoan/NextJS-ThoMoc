import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Typography
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { io, Socket } from 'socket.io-client'
import { useAuth } from 'src/hooks/useAuth'
import { getPaymentQR } from 'src/service/order'
import { getAccessToken } from 'src/service/token'

const PRIMARY_COLOR = '#1677ff'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8888'

interface PaymentQRData {
  orderId: number
  paymentId: number
  amount: number
  paymentMethod: string
  qrUrl: string
  bankInfo: {
    accountNumber: string
    bankName: string
    accountName: string
  }
  description: string
}

interface PaymentQRDialogProps {
  open: boolean
  onClose: () => void
  orderId: number
  onPaymentSuccess?: () => void
}

export default function PaymentQRDialog({ open, onClose, orderId, onPaymentSuccess }: PaymentQRDialogProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [qrData, setQrData] = useState<PaymentQRData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (open && orderId) {
      fetchQRData()
      setPaymentSuccess(false)
    }

    return () => {
      setQrData(null)
      setError(null)
      setPaymentSuccess(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, orderId])

  // WebSocket connection for real-time payment notification
  useEffect(() => {
    if (!open || !user?.id) return

    const wsUrl = API_BASE_URL.replace('/api', '')
    const accessToken = getAccessToken()

    const socket = io(`${wsUrl}/payment`, {
      transports: ['websocket', 'polling'],
      extraHeaders: {
        authorization: `Bearer ${accessToken}`
      }
    })

    socket.on('connect', () => {
      console.log('[PaymentQR] WebSocket connected')

      // Join the user's room
      socket.emit('join', `room-${user.id}`)
    })

    socket.on('payment', (data: { status: string }) => {
      console.log('[PaymentQR] Payment event received:', data)
      if (data.status === 'success') {
        setPaymentSuccess(true)
        toast.success('Thanh toán thành công!')
        onPaymentSuccess?.()
      }
    })

    socket.on('connect_error', err => {
      console.warn('[PaymentQR] WebSocket connection error:', err.message)
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user?.id])

  const fetchQRData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getPaymentQR(orderId)
      setQrData(res.data)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải mã QR thanh toán')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`Đã sao chép ${label}`)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          backgroundColor: PRIMARY_COLOR,
          color: 'white',
          py: 2
        }}
      >
        <AccountBalanceOutlinedIcon />
        <Typography sx={{ fontWeight: 600, fontSize: '18px' }}>Thanh toán chuyển khoản</Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3, mt: 1 }}>
        {paymentSuccess ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
            <Typography sx={{ fontSize: '20px', fontWeight: 600, color: '#4caf50', mb: 1 }}>
              Thanh toán thành công!
            </Typography>
            <Typography sx={{ fontSize: '14px', color: '#666', mb: 3 }}>
              Đơn hàng của bạn đã được xác nhận thanh toán.
            </Typography>
            <Button variant='contained' onClick={onClose} sx={{ px: 4, backgroundColor: '#4caf50' }}>
              Đóng
            </Button>
          </Box>
        ) : loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{ color: '#f44336', mb: 2 }}>{error}</Typography>
            <Button variant='outlined' onClick={fetchQRData}>
              Thử lại
            </Button>
          </Box>
        ) : qrData ? (
          <Box>
            {/* QR Code Image */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography sx={{ fontSize: '14px', color: '#666', mb: 2 }}>Quét mã QR bên dưới để thanh toán</Typography>
              <Box
                sx={{
                  display: 'inline-block',
                  p: 2,
                  border: '2px solid #e0e0e0',
                  borderRadius: 2,
                  backgroundColor: '#fff'
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrData.qrUrl} alt='Payment QR Code' style={{ width: 250, height: 250, display: 'block' }} />
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Bank Info */}
            <Typography sx={{ fontWeight: 600, fontSize: '15px', mb: 1.5, color: '#333' }}>
              Thông tin chuyển khoản
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {/* Bank Name */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '13px', color: '#888' }}>Ngân hàng</Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{qrData.bankInfo.bankName}</Typography>
              </Box>

              {/* Account Number */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '13px', color: '#888' }}>Số tài khoản</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{qrData.bankInfo.accountNumber}</Typography>
                  <IconButton size='small' onClick={() => handleCopy(qrData.bankInfo.accountNumber, 'số tài khoản')}>
                    <ContentCopyIcon sx={{ fontSize: 16, color: '#888' }} />
                  </IconButton>
                </Box>
              </Box>

              {/* Account Name */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '13px', color: '#888' }}>Chủ tài khoản</Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{qrData.bankInfo.accountName}</Typography>
              </Box>

              {/* Amount */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '13px', color: '#888' }}>Số tiền</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '16px', fontWeight: 600, color: PRIMARY_COLOR }}>
                    {qrData.amount.toLocaleString()}đ
                  </Typography>
                  <IconButton size='small' onClick={() => handleCopy(qrData.amount.toString(), 'số tiền')}>
                    <ContentCopyIcon sx={{ fontSize: 16, color: '#888' }} />
                  </IconButton>
                </Box>
              </Box>

              {/* Transfer Content */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '13px', color: '#888' }}>Nội dung CK</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#f44336' }}>
                    {qrData.description}
                  </Typography>
                  <IconButton size='small' onClick={() => handleCopy(qrData.description, 'nội dung chuyển khoản')}>
                    <ContentCopyIcon sx={{ fontSize: 16, color: '#888' }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Warning */}
            <Box
              sx={{
                mt: 2.5,
                p: 2,
                backgroundColor: '#fff8e1',
                borderRadius: 1,
                border: '1px solid #ffe082'
              }}
            >
              <Typography sx={{ fontSize: '12px', color: '#f57c00', fontWeight: 500 }}>
                ⚠ Vui lòng nhập đúng nội dung chuyển khoản <b style={{ color: '#f44336' }}>{qrData.description}</b> để
                hệ thống tự động xác nhận thanh toán.
              </Typography>
            </Box>

            {/* Close button */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button variant='contained' onClick={onClose} sx={{ px: 4, backgroundColor: PRIMARY_COLOR }}>
                Đóng
              </Button>
            </Box>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
