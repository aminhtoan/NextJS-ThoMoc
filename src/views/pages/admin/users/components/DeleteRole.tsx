import { Box, CircularProgress } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import * as React from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { deleteRole } from 'src/service/role'
import { AppDispatch } from 'src/stores'
import { getAllRolesAsync } from 'src/stores/apps/role/actions'

interface DeleteRoleProps {
  open: boolean
  onClose: () => void
  onDeleted?: () => void
  data: {
    id: number
    name: string
  }
  page: number
  pageSize: number
}

const DeleteRole = ({ open, onClose, onDeleted, data, page, pageSize }: DeleteRoleProps) => {
  const dispatch: AppDispatch = useDispatch()
  const [isLoading, setIsLoading] = React.useState(false)
  const { t } = useTranslation()

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await deleteRole(data.id)
      toast.success(t('Delete role successfully'))
      dispatch(getAllRolesAsync({ params: { page, limit: pageSize } }))
      if (typeof onDeleted === 'function') onDeleted()
      onClose()
    } catch (error: any) {
      onClose()
      toast.error(
        error?.response?.data?.message?.[0]?.error || error?.response?.data?.message || t('An error occurred')
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        keepMounted
        onClose={onClose}
        aria-describedby='alert-dialog-slide-description'
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            minWidth: 400,
            padding: 4
          }
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: 'rgba(234, 84, 85, 0.1)',
            color: 'error.dark',
            fontWeight: 'bold',
            fontSize: 18,
            py: 2,
            borderBottom: '2px solid',
            borderColor: 'error.main'
          }}
        >
          {t('Delete Role')}
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <DialogContentText
            id='alert-dialog-slide-description'
            sx={{
              fontSize: 16,
              color: 'text.secondary',
              mb: 2
            }}
          >
            {t('Are you sure you want to delete the role?')}{' '}
            <strong style={{ color: '#dc3545' }}>"{data.name!}"</strong>?
          </DialogContentText>
          <Box
            sx={{
              bgcolor: 'rgba(255, 193, 7, 0.1)',
              p: 2,
              borderRadius: 1,
              borderLeft: '4px solid',
              borderColor: 'warning.main',
              mt: 2
            }}
          >
            <DialogContentText sx={{ fontSize: 14, color: 'warning.dark', m: 0 }}>
              💡 {t('This action cannot be undone.')}
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            gap: 1,
            justifyContent: 'flex-end',
            borderTop: '1px solid #eee'
          }}
        >
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant='outlined'
            color='inherit'
            sx={{
              borderColor: '#ddd',
              color: 'text.secondary',
              px: 3,
              py: 1,
              '&:hover': {
                bgcolor: 'grey.50',
                borderColor: '#bbb'
              },
              height: '36px'
            }}
          >
            {t('Disagree')}
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isLoading}
            variant='contained'
            color='error'
            sx={{
              px: 3,
              py: 1,
              color: 'white',
              fontWeight: 'bold',
              position: 'relative',
              '&:hover': {
                bgcolor: 'error.dark'
              },
              height: '36px'
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={18} sx={{ color: 'white' }} />
                {t('Deleting')}...
              </Box>
            ) : (
              t('Agree')
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default DeleteRole
