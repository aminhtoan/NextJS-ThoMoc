import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface DeleteProductDialogProps {
  open: boolean
  productName: string
  onClose: () => void
  onConfirm: () => void
}

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({ open, productName, onClose, onConfirm }) => {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>{t('Delete product')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('Are you sure you want to delete')} <strong>{productName}</strong>? {t('This action cannot be undone.')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='inherit'>
          {t('Cancel')}
        </Button>
        <Button onClick={onConfirm} color='error' variant='contained'>
          {t('Delete')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteProductDialog
