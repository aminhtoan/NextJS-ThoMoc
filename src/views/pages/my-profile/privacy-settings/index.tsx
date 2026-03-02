import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import handleAPI from 'src/apis/handleAPI'
import { useAuth } from 'src/hooks/useAuth'

const PrivacySettings = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
  }

  const handleConfirmDelete = async () => {
    if (!user?.id) return

    setIsDeleting(true)
    try {
      // Update user status to BLOCKED
      await handleAPI('/auth/myProfile', { status: 'BLOCKED' }, 'put')
      toast.success(t('account_blocked_success') || 'Tài khoản đã bị vô hiệu hóa')

      // Logout ngay lập tức
      setTimeout(() => {
        logout()
      }, 500)
    } catch (error: any) {
      console.error('Error blocking account:', error)
      setIsDeleting(false)
      toast.error(error?.message || t('delete_account_error') || 'Lỗi khi xóa tài khoản')
    }
  }

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography variant='h5' mb={1} sx={{ color: 'black' }}>
          {t('Privacy Settings')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Divider />
      <Grid item xs={6}>
        {t('Account Deletion Request')}
      </Grid>
      <Grid item xs={6} sx={{ textAlign: 'right' }}>
        <Button
          sx={{ color: 'white', backgroundColor: '#dc3545', '&:hover': { backgroundColor: '#c82333' } }}
          onClick={handleOpenDeleteDialog}
          disabled={isDeleting}
        >
          {isDeleting ? <CircularProgress size={20} color='inherit' /> : t('Delete Account')}
        </Button>
      </Grid>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle sx={{ fontWeight: 600, color: '#dc3545' }}>
          {t('confirm_delete_account') || 'Xác nhận xóa tài khoản'}
        </DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <Typography sx={{ color: '#666', mt: 2 }}>
            {t('delete_account_warning') ||
              'Tài khoản của bạn sẽ bị vô hiệu hóa vĩnh viễn. Bạn không thể khôi phục tài khoản này nữa. Bạn có chắc chắn muốn tiếp tục không?'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDeleteDialog} sx={{ color: '#666' }}>
            {t('cancel') || 'Hủy'}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            sx={{ color: 'white', backgroundColor: '#dc3545', '&:hover': { backgroundColor: '#c82333' } }}
          >
            {isDeleting ? <CircularProgress size={20} color='inherit' /> : t('confirm_delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default PrivacySettings
