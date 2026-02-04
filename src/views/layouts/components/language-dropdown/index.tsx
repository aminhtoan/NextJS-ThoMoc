// ** MUI
import { MenuItem } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import Typography from '@mui/material/Typography'

// ** Next
import * as React from 'react'

// ** Components
import IconifyIcon from 'src/components/Icon'
import i18n, { LANGUAGE_OPTIONS } from 'src/configs/i18n'

const LanguageDropDown = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMouseLeave = () => {
    setAnchorEl(null)
  }

  const handleOnChangeLang = (lang: string) => {
    i18n.changeLanguage(lang)
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton color='inherit' id='language-dropdown' onMouseEnter={handleMouseEnter}>
        <IconifyIcon icon='material-symbols-light:translate' />
      </IconButton>
      <Menu
        id='language-dropdown-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleMouseLeave}
        MenuListProps={{
          onMouseLeave: handleMouseLeave
        }}
        PaperProps={{
          sx: {
            minWidth: '180px'
          }
        }}
      >
        {LANGUAGE_OPTIONS.map((option: { value: string; lang: string }) => {
          const isSelected = i18n.language === option.value

          return (
            <MenuItem
              key={option.value}
              onClick={() => handleOnChangeLang(option.value)}
              sx={{ backgroundColor: 'white !important' }}
            >
              <Typography sx={isSelected ? { color: '#1872CE' } : {}}>{option.lang}</Typography>
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

export default LanguageDropDown
