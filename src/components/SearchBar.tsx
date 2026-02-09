import { TextField, InputAdornment, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import React from 'react'

interface SearchBarProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearch?: () => void
  onReset?: () => void
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch, onReset, placeholder }) => (
  <TextField
    size='small'
    variant='outlined'
    value={value}
    onChange={onChange}
    placeholder={placeholder || 'Search...'}
    sx={{ maxWidth: 1000, width: '100%' }}
    InputProps={{
      startAdornment: (
        <InputAdornment position='start'>
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
        </InputAdornment>
      ),
      endAdornment: (
        <InputAdornment position='end'>
          {value && (
            <IconButton onClick={onReset} edge='end' sx={{ mr: 0.5 }} size='small'>
              <ClearIcon />
            </IconButton>
          )}
          <IconButton onClick={onSearch} edge='end' size='small'>
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      )
    }}
  />
)

export default SearchBar
