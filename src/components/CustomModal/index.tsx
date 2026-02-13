import { Box, IconButton, Modal, ModalProps, Paper, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'

interface CustomModalProps extends Omit<ModalProps, 'children'> {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  maxWidth?: number | string
  minWidth?: number | string
  showCloseButton?: boolean
}

/**
 * CustomModal: Reusable modal component with header, close button, and customizable content
 * Usage:
 * <CustomModal open={open} onClose={handleClose} title="Create Role">
 *   <YourContent />
 * </CustomModal>
 */
const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 500,
  minWidth = 300,
  showCloseButton = true,
  ...props
}) => {
  return (
    <Modal
      open={open}
      onClose={reason => {
        if (reason === 'backdropClick') return
        onClose()
      }}
      disableEnforceFocus
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      {...props}
    >
      <Paper
        elevation={6}
        sx={{
          position: 'relative',
          minWidth,
          maxWidth,
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: 1,
          outline: 'none'
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 3,
              py: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.default'
            }}
          >
            <Typography variant='h6' fontWeight={600}>
              {title}
            </Typography>
            {showCloseButton && (
              <IconButton
                onClick={onClose}
                size='small'
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'rgba(220, 53, 69, 0.1)',
                    color: '#dc3545'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        )}

        {/* Content */}
        <Box sx={{ p: 3 }}>{children}</Box>
      </Paper>
    </Modal>
  )
}

export default CustomModal
