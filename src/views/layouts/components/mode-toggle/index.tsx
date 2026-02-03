// ** MUI
import IconButton from '@mui/material/IconButton'

// ** React
import * as React from 'react'

// ** Components
import IconifyIcon from 'src/components/Icon'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useSettings } from 'src/hooks/useSettings'

// ** Types
import { Mode } from 'src/types/layouts'

type TProps = {}
const ModeToggle = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { settings, saveSettings } = useSettings()
  const { user, logout } = useAuth()
  const open = Boolean(anchorEl)
  const handleModeChange = (mode: Mode) => {
    saveSettings({ ...settings, mode })
  }
  const handleToggleMode = (props: TProps) => {
    if (settings.mode === 'light') {
      handleModeChange('dark')
    } else {
      handleModeChange('light')
    }
  }
  return (
    <IconButton color='inherit' sx={{ ml: 1 }} onClick={handleToggleMode}>
      <IconifyIcon icon={settings.mode === 'dark' ? 'mdi:weather-sunny' : 'mdi:weather-night'} width={20} height={20} />
    </IconButton>
  )
}

export default ModeToggle
