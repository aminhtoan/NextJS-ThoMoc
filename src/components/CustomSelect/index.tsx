import { FormHelperText, InputLabel } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Theme, useTheme } from '@mui/material/styles'
import * as React from 'react'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

function getStyles(name: string, selectedValues: readonly string[], theme: Theme) {
  return {
    fontWeight: selectedValues.includes(name) ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular
  }
}

interface CustomSelectProps {
  options: Array<{ id?: string | number; name?: string; value?: string | number; label?: string }>
  multiple?: boolean
  displayEmpty?: boolean
  placeholder?: string
  value?: string[] | string
  onChange?: (value: string[] | string) => void
  label?: string
  error?: boolean
  helperText?: string
  fullWidth?: boolean
  disabled?: boolean
}

export default function CustomSelect({
  options = [],
  multiple = false,
  displayEmpty = true,
  placeholder = 'Select an option',
  value = multiple ? [] : '',
  onChange,
  label,
  error = false,
  helperText = '',
  fullWidth = true,
  disabled = false
}: CustomSelectProps) {
  const theme = useTheme()
  const [selectedValue, setSelectedValue] = React.useState<string[] | string>(value)

  React.useEffect(() => {
    setSelectedValue(value)
  }, [value])

  const handleChange = (event: SelectChangeEvent<typeof selectedValue>) => {
    const {
      target: { value: newValue }
    } = event

    const finalValue = typeof newValue === 'string' ? newValue.split(',') : newValue
    setSelectedValue(finalValue)

    if (onChange) {
      onChange(multiple ? finalValue : finalValue[0] || '')
    }
  }

  const getDisplayValue = (val: string[] | string) => {
    if (multiple && Array.isArray(val)) {
      if (val.length === 0) {
        return <em>{placeholder}</em>
      }

      return val
        .map(v => {
          const option = options.find(opt => String(opt.id ?? opt.value ?? opt.name) === String(v))

          return option?.name || option?.label || v
        })
        .join(', ')
    } else if (!multiple && val) {
      const option = options.find(opt => String(opt.id ?? opt.value ?? opt.name) === String(val))

      return option?.name || option?.label || val
    }

    return <em>{placeholder}</em>
  }

  return (
    <FormControl fullWidth={fullWidth} error={error} disabled={disabled}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        sx={{ height: 38.55 }}
        multiple={multiple}
        displayEmpty={displayEmpty}
        value={selectedValue}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={selected => getDisplayValue(selected)}
        MenuProps={MenuProps}
      >
        {displayEmpty && (
          <MenuItem disabled value='' sx={{ display: 'none' }}>
            <em>{placeholder}</em>
          </MenuItem>
        )}

        {options.map(option => {
          const optionValue = option.id || option.value || option.name
          const optionLabel = option.name || option.label || optionValue

          return (
            <MenuItem
              key={optionValue}
              value={optionValue}
              style={getStyles(
                String(optionValue),
                Array.isArray(selectedValue) ? selectedValue.map(String) : [String(selectedValue)],
                theme
              )}
            >
              {optionLabel}
            </MenuItem>
          )
        })}
      </Select>
      {error && helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}
