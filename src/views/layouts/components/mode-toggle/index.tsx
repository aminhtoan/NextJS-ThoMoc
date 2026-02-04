// ** MUI
import IconButton from '@mui/material/IconButton'

// ** React

// ** Components
import IconifyIcon from 'src/components/Icon'

// ** Hooks
import { useSettings } from 'src/hooks/useSettings'

// ** Types
import { Mode } from 'src/types/layouts'

const ModeToggle = () => {
  const { settings, saveSettings } = useSettings()

  const handleModeChange = (mode: Mode) => {
    saveSettings({ ...settings, mode })
  }

  const handleToggleMode = () => {
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
