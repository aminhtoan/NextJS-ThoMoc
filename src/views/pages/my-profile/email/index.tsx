import { Button, Checkbox, Divider, FormControlLabel, Grid, Typography } from '@mui/material'
import React from 'react'

const EmailPage = () => {
  const [isLoading] = React.useState(false)

  //   const { t } = useTranslation()

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography variant='h5' mb={1} sx={{ color: 'black' }}>
          Thay đổi địa chỉ email
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      {/* Label */}
      <Grid item xs={4}>
        <Typography>Địa chỉ email mới</Typography>
      </Grid>

      {/* Input + helper text */}
      <Grid item xs={6}>
        <Grid container spacing={1} gap={3}>
          <Grid item xs={12}>
            <input
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e0e0e0', // nhạt hơn
                borderRadius: '4px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button sx={{ color: 'white', backgroundColor: '#1975D1' }} disabled={isLoading}>
              Tiếp theo
            </Button>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  sx={{
                    color: '#1975D1 !important',
                    '&.Mui-checked': {
                      color: '#1975D1 !important'
                    }
                  }}
                />
              }
              label={
                <Typography variant='caption' color='text.secondary'>
                  Gửi tôi thông tin xu hướng, chương trình khuyến mãi & cập nhật mới nhất.
                </Typography>
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
export default EmailPage
