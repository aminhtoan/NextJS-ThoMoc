// ** MUI Imports
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'

// ** React Imports
import * as React from 'react'

// ** Toast Import
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { deleleDeliveryMethod } from 'src/service/delivery-methods'

// ** Service Import

interface DeleteDeliveryMethodProps {
  open: boolean
  onClose: () => void
  data: {
    id: number
    name: string
  }

  onDeleted?: () => void
}

const DeleteDeliveryMethod = ({ open, onClose, data, onDeleted }: DeleteDeliveryMethodProps) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { t } = useTranslation()

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await deleleDeliveryMethod(data.id)
      toast.success(t('Delete delivery method successfully'))
      onClose()
      if (onDeleted) onDeleted()
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
            borderRadius: 1,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            minWidth: 400
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
          {t('Delete Delivery Method')}
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
            {t('Are you sure you want to delete the delivery method?')}{' '}
            <strong style={{ color: '#dc3545' }}>"{data.name}"</strong>?
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
                {t('Deleting...')}
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

export default DeleteDeliveryMethod
