import { Button, Checkbox, Divider, Grid, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

const EmailPage = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { t } = useTranslation()
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
            <div className='checkbox-container'>
              <label className='custom-checkbox'>
                <input type='checkbox' checked />
                <span className='checkmark'></span>
                <span className='label-text'>
                    
                  Tôi đồng ý với các điều khoản sử dụng và cho phép hệ thống xử lý thông tin tôi cung cấp.
                </span>
              </label>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
//    ;<Grid item xs={6} sx={{ textAlign: 'right' }}>
//      <Button sx={{ color: 'white', backgroundColor: '#1975D1' }}>{t('Delete Account')}</Button>
//    </Grid>
export default EmailPage
