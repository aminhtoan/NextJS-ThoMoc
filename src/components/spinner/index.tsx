import { styled, useTheme } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Modal, ModalProps } from '@mui/material'

const CustomModal = styled(Modal)<ModalProps>(({ theme }) => ({
  '&.MuiModal-root': {
    width: '100%',
    height: '100%',
    zIndex: 2800,
    '& .MuiBackdrop-root': {
      backgroundColor: `rgba (${theme.palette.customColors.main}, 0.5)`
    }
  }
}))

const Spinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  const theme = useTheme()

  return (
    <CustomModal open={true}>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    </CustomModal>
  )
}

export default Spinner
