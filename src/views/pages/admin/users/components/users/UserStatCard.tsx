import { Card, CardContent, Typography, Box, Avatar, Stack } from '@mui/material'

const StatCard = ({ title, value, percent, color, icon, caption, lastWeekValue, weekPercent }: any) => {
  // Format số có dấu phẩy (ví dụ: 4,567)
  const formatNumber = (num: number | string) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return (
    <Card
      sx={{
        borderRadius: 0.5,
        boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
        height: '100%',
        transition: '0.2s',
        '&:hover': { boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)' }
      }}
    >
      <CardContent sx={{ p: 3, height: '100%' }}>
        <Stack spacing={2} sx={{ height: '100%' }}>
          {/* Hàng trên: tiêu đề + icon */}
          <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
            <Box>
              <Typography variant='body2' sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.95rem' }}>
                {title}
              </Typography>
              <Box display='flex' alignItems='baseline' sx={{ mt: 0.5 }}>
                <Typography variant='h4' sx={{ fontWeight: 700, fontSize: '2rem', lineHeight: 1.2 }}>
                  {formatNumber(value)}
                </Typography>
                {percent && (
                  <Typography
                    component='span'
                    sx={{
                      ml: 1.5,
                      color: percent.includes('-') ? 'error.main' : 'success.main',
                      fontSize: '1rem',
                      fontWeight: 600,
                      bgcolor: percent.includes('-') ? 'error.lighter' : 'success.lighter',
                      px: 0.8,
                      py: 0.3,
                      borderRadius: 0.5
                    }}
                  >
                    {percent}
                  </Typography>
                )}
              </Box>
            </Box>
            <Avatar
              sx={{
                bgcolor: color + '14',
                color: color,
                borderRadius: 0.5,
                width: 44,
                height: 44
              }}
            >
              {icon}
            </Avatar>
          </Box>

          {/* Dòng "Last week analytics" – giống ảnh 2 */}
          {(lastWeekValue || weekPercent) && (
            <Box sx={{ mt: 1 }}>
              <Typography
                variant='caption'
                sx={{ color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 0.5 }}
              >
                Last week analytics
              </Typography>
              <Box display='flex' alignItems='center' sx={{ mt: 0.5 }}>
                <Typography variant='body1' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {formatNumber(lastWeekValue)}
                </Typography>
                {weekPercent && (
                  <Typography
                    variant='body2'
                    sx={{
                      ml: 1,
                      color: weekPercent.includes('+') ? 'success.main' : 'error.main',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {weekPercent}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {/* Caption cũ (nếu có) */}
          {caption && (
            <Typography variant='caption' sx={{ color: 'text.secondary', mt: 'auto', pt: 1 }}>
              {caption}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default StatCard
