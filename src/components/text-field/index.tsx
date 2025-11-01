import { TextFieldProps, TextField } from '@mui/material'

const CustomTextField = (props: TextFieldProps) => {
  const { size = 'small', variant = 'filled', InputLabelProps, ...rests } = props

  return <TextField size={size} variant={variant} InputLabelProps={{ ...InputLabelProps, shrink: true }} {...rests} />
}

export default CustomTextField
