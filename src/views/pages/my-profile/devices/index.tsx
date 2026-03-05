import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DevicesIcon from '@mui/icons-material/Devices'
import LaptopIcon from '@mui/icons-material/Laptop'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import TabletIcon from '@mui/icons-material/Tablet'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { getDevices, removeDevice } from 'src/service/auth'

interface DeviceItem {
  id: number
  userId: number
  userAgent: string
  ip: string
  lastActive: string
  createdAt: string
  isActive: boolean
  refreshTokenCount: number
}

const parseUserAgent = (ua: string) => {
  let browser = 'Unknown Browser'
  let os = 'Unknown OS'
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'

  // Detect browser
  if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Edg')) browser = 'Microsoft Edge'
  else if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Google Chrome'
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera'

  // Detect OS
  if (ua.includes('Windows NT 10')) os = 'Windows 10/11'
  else if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac OS X')) os = 'macOS'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
  else if (ua.includes('Linux')) os = 'Linux'

  // Detect device type
  if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) deviceType = 'mobile'
  else if (ua.includes('iPad') || ua.includes('Tablet')) deviceType = 'tablet'

  return { browser, os, deviceType }
}

const getDeviceIcon = (deviceType: 'mobile' | 'tablet' | 'desktop') => {
  switch (deviceType) {
    case 'mobile':
      return <PhoneAndroidIcon sx={{ fontSize: 40, color: '#1975D1' }} />
    case 'tablet':
      return <TabletIcon sx={{ fontSize: 40, color: '#1975D1' }} />
    default:
      return <LaptopIcon sx={{ fontSize: 40, color: '#1975D1' }} />
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)

  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const DevicesPage = () => {
  const { t } = useTranslation()
  const [devices, setDevices] = useState<DeviceItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<DeviceItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchDevices = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await getDevices()
      setDevices(response.data?.data || [])
    } catch (error: any) {
      console.error('Error fetching devices:', error)
      toast.error(t('Failed to load devices') || 'Không thể tải danh sách thiết bị')
    } finally {
      setIsLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchDevices()
  }, [fetchDevices])

  const handleOpenDeleteDialog = (device: DeviceItem) => {
    setSelectedDevice(device)
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setSelectedDevice(null)
  }

  const handleConfirmDelete = async () => {
    if (!selectedDevice) return

    setIsDeleting(true)
    try {
      await removeDevice(selectedDevice.id)
      toast.success(t('Device removed successfully') || 'Xóa thiết bị thành công')
      setDevices(prev => prev.filter(d => d.id !== selectedDevice.id))
      handleCloseDeleteDialog()
    } catch (error: any) {
      console.error('Error removing device:', error)
      toast.error(error?.response?.data?.message || t('Failed to remove device') || 'Không thể xóa thiết bị')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DevicesIcon sx={{ color: '#1975D1' }} />
          <Typography variant='h5' sx={{ color: 'black', fontWeight: 600 }}>
            {t('Login Devices') || 'Thiết bị đăng nhập'}
          </Typography>
        </Box>
        <Typography variant='body2' sx={{ color: 'text.secondary', mt: 0.5 }}>
          {t('Manage devices that are logged into your account') ||
            'Quản lý các thiết bị đã đăng nhập vào tài khoản của bạn'}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      {isLoading ? (
        <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </Grid>
      ) : devices.length === 0 ? (
        <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
          <DevicesIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 1 }} />
          <Typography color='text.secondary'>{t('No devices found') || 'Không tìm thấy thiết bị nào'}</Typography>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Typography variant='body2' sx={{ mb: 2, color: 'text.secondary' }}>
            {t('Total devices') || 'Tổng số thiết bị'}: <strong>{devices.length}</strong>
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 280, overflowY: 'auto' }}>
            {devices.map(device => {
              const { browser, os, deviceType } = parseUserAgent(device.userAgent)

              return (
                <Paper
                  key={device.id}
                  elevation={1}
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: device.isActive ? 'primary.light' : 'divider',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 3,
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  {/* Device Icon */}
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: '#e3f2fd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {getDeviceIcon(deviceType)}
                  </Box>

                  {/* Device Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant='subtitle2' fontWeight={600} noWrap>
                        {browser} - {os}
                      </Typography>
                      {device.isActive && (
                        <Chip
                          label={t('Active') || 'Hoạt động'}
                          size='small'
                          color='success'
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                      {device.refreshTokenCount > 0 && (
                        <Chip
                          label={t('Logged in') || 'Đang đăng nhập'}
                          size='small'
                          color='info'
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                    <Typography variant='caption' color='text.secondary' sx={{ display: 'block' }}>
                      IP: {device.ip} &nbsp;|&nbsp; {t('Last active') || 'Hoạt động lần cuối'}:{' '}
                      {formatDate(device.lastActive)}
                    </Typography>
                    <Typography variant='caption' color='text.secondary' sx={{ display: 'block' }}>
                      {t('First login') || 'Đăng nhập lần đầu'}: {formatDate(device.createdAt)}
                    </Typography>
                  </Box>

                  {/* Delete Button */}
                  <Tooltip title={t('Remove device') || 'Xóa thiết bị'}>
                    <IconButton
                      color='error'
                      onClick={() => handleOpenDeleteDialog(device)}
                      sx={{
                        flexShrink: 0,
                        '&:hover': { bgcolor: '#ffebee' }
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Paper>
              )
            })}
          </Box>
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle sx={{ fontWeight: 600, color: '#dc3545' }}>
          {t('Confirm remove device') || 'Xác nhận xóa thiết bị'}
        </DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          {selectedDevice && (
            <>
              <Typography sx={{ color: '#666', mt: 1 }}>
                {t('Are you sure you want to remove this device? This will log out the device immediately.') ||
                  'Bạn có chắc chắn muốn xóa thiết bị này? Thiết bị sẽ bị đăng xuất ngay lập tức.'}
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: '#f5f5f5',
                  borderRadius: 1
                }}
              >
                <Typography variant='body2' fontWeight={600}>
                  {parseUserAgent(selectedDevice.userAgent).browser} - {parseUserAgent(selectedDevice.userAgent).os}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  IP: {selectedDevice.ip}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDeleteDialog} sx={{ color: '#666' }}>
            {t('Cancel') || 'Hủy'}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            sx={{
              color: 'white',
              backgroundColor: '#dc3545',
              '&:hover': { backgroundColor: '#c82333' }
            }}
          >
            {isDeleting ? <CircularProgress size={20} color='inherit' /> : t('Remove') || 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default DevicesPage
