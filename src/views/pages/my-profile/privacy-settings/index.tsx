import { Button, Divider, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useTranslation } from 'react-i18next'

const PrivacySettings = () => {
  const { t } = useTranslation()
  
  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography variant='h5' mb={1} sx={{ color: 'black' }}>
          {t('Privacy Settings')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Divider />
      <Grid item xs={6}>
        {t('Account Deletion Request')}
      </Grid>
      <Grid item xs={6} sx={{ textAlign: 'right' }}>
        <Button sx={{ color: 'white', backgroundColor: '#1975D1' }}>{t('Delete Account')}</Button>
      </Grid>
    </Grid>
  )
}

export default PrivacySettings
