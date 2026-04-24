import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Pagination,
  Paper,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ProductType } from 'src/types/product'
import ProductCard from 'src/views/pages/home/componets/CustomCard'

interface SearchPageProps {
  query: string
  products: ProductType[]
  totalPages: number
  currentPage: number
  sortBy: string
  orderBy: string
  minPrice: number | null
  maxPrice: number | null
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const LIMIT = 12

export default function SearchPage({
  query,
  products,
  totalPages,
  currentPage,
  sortBy,
  orderBy,
  minPrice,
  maxPrice
}: SearchPageProps) {
  const router = useRouter()
  const [localMin, setLocalMin] = useState<string>(minPrice ? String(minPrice) : '')
  const [localMax, setLocalMax] = useState<string>(maxPrice ? String(maxPrice) : '')

  const handlePageChange = (page: number) => {
    router.push({ pathname: '/search', query: { ...router.query, page } }, undefined, { scroll: true })
  }

  // Khi thay đổi sortBy, reset về page 1
  const handleSortChange = (newSortBy: string) => {
    router.push({
      pathname: '/search',
      query: { ...router.query, sortBy: newSortBy, page: 1 }
    })
  }

  // Khi thay đổi orderBy, reset về page 1
  const handleOrderChange = (newOrderBy: string) => {
    router.push({
      pathname: '/search',
      query: { ...router.query, orderBy: newOrderBy, page: 1 }
    })
  }

  const handlePriceApply = () => {
    const q: Record<string, string | number | undefined> = { ...(router.query as Record<string, string>), page: 1 }
    if (localMin !== '') q.minPrice = localMin
    else delete q.minPrice
    if (localMax !== '') q.maxPrice = localMax
    else delete q.maxPrice
    router.push({ pathname: '/search', query: q })
  }

  return (
    <>
      <Head>
        <title>Tìm kiếm: {query} - Thổ Mộc</title>
        <meta name='description' content={`Kết quả tìm kiếm cho "${query}"`} />
      </Head>

      <Box sx={{ mx: { xs: 2, md: 6 }, py: 4 }}>
        {/* Search result header */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: '15px', color: '#555' }}>
            🔍 Kết quả tìm kiếm cho từ khoá{' '}
            <Typography component='span' sx={{ fontWeight: 600, color: '#ee4d2d', fontSize: '15px' }}>
              &apos;{query}&apos;
            </Typography>
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Sidebar filters */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 2 }}>BỘ LỌC TÌM KIẾM</Typography>

              {/* Price range */}
              <Typography sx={{ fontSize: '13px', fontWeight: 500, mb: 1.5 }}>Khoảng Giá</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <OutlinedInput
                  size='small'
                  placeholder='TỪ'
                  value={localMin}
                  onChange={e => setLocalMin(e.target.value.replace(/\D/g, ''))}
                  startAdornment={
                    <InputAdornment position='start'>
                      <Typography sx={{ fontSize: '12px', color: '#555' }}>đ</Typography>
                    </InputAdornment>
                  }
                  sx={{ fontSize: '12px', flex: 1, minWidth: 0 }}
                  inputProps={{ inputMode: 'numeric' }}
                />
                <Typography sx={{ fontSize: '13px', color: '#555' }}>—</Typography>
                <OutlinedInput
                  size='small'
                  placeholder='ĐẾN'
                  value={localMax}
                  onChange={e => setLocalMax(e.target.value.replace(/\D/g, ''))}
                  startAdornment={
                    <InputAdornment position='start'>
                      <Typography sx={{ fontSize: '12px', color: '#555' }}>đ</Typography>
                    </InputAdornment>
                  }
                  sx={{ fontSize: '12px', flex: 1, minWidth: 0 }}
                  inputProps={{ inputMode: 'numeric' }}
                />
              </Box>
              <Button
                fullWidth
                onClick={handlePriceApply}
                sx={{
                  bgcolor: '#ee4d2d',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '13px',
                  mb: 2,
                  '&:hover': { bgcolor: '#d44227' }
                }}
              >
                ÁP DỤNG
              </Button>

              <Divider sx={{ my: 2 }} />

              <Typography sx={{ fontSize: '13px', fontWeight: 500, mb: 1 }}>Sắp xếp theo</Typography>
              <FormControl size='small' fullWidth sx={{ mb: 2 }}>
                <Select value={sortBy} onChange={e => handleSortChange(e.target.value)} sx={{ fontSize: '13px' }}>
                  <MenuItem value='createdAt'>Mới nhất</MenuItem>
                  <MenuItem value='price'>Giá</MenuItem>
                  <MenuItem value='sale'>Bán chạy</MenuItem>
                </Select>
              </FormControl>

              <Typography sx={{ fontSize: '13px', fontWeight: 500, mb: 1 }}>Thứ tự</Typography>
              <ToggleButtonGroup
                value={orderBy}
                exclusive
                onChange={(_, value) => value && handleOrderChange(value)}
                size='small'
                fullWidth
              >
                <ToggleButton value='asc' sx={{ fontSize: '12px' }}>
                  Tăng dần
                </ToggleButton>
                <ToggleButton value='desc' sx={{ fontSize: '12px' }}>
                  Giảm dần
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>
          </Grid>

          {/* Main content */}
          <Grid item xs={12} md={9}>
            {/* Sort bar */}
            <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '14px' }}>Sắp xếp theo</Typography>

                <ToggleButtonGroup
                  value={sortBy}
                  exclusive
                  onChange={(_, value) => value && handleSortChange(value)}
                  size='small'
                >
                  <ToggleButton
                    value='sale'
                    sx={{
                      px: 2,
                      fontSize: '13px',
                      backgroundColor: sortBy === 'sale' ? '#ee4d2d' : 'transparent',
                      color: sortBy === 'sale' ? 'white' : 'inherit',
                      '&:hover': { backgroundColor: sortBy === 'sale' ? '#ee4d2d' : undefined },
                      '&.Mui-selected': { backgroundColor: '#ee4d2d', color: 'white' }
                    }}
                  >
                    Phổ Biến
                  </ToggleButton>
                  <ToggleButton value='createdAt' sx={{ px: 2, fontSize: '13px' }}>
                    Mới Nhất
                  </ToggleButton>
                  <ToggleButton value='price' sx={{ px: 2, fontSize: '13px' }}>
                    Giá
                  </ToggleButton>
                </ToggleButtonGroup>

                <FormControl size='small' sx={{ minWidth: 120 }}>
                  <Select
                    value={`${sortBy}-${orderBy}`}
                    onChange={e => {
                      const [s, o] = e.target.value.split('-')
                      handleSortChange(s)
                      handleOrderChange(o)
                    }}
                    sx={{ fontSize: '13px' }}
                  >
                    <MenuItem value='price-asc'>Giá: Thấp đến Cao</MenuItem>
                    <MenuItem value='price-desc'>Giá: Cao đến Thấp</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '13px', color: '#ee4d2d' }}>
                  {currentPage}/{totalPages}
                </Typography>
                <IconButton size='small' disabled={currentPage <= 1} onClick={() => handlePageChange(currentPage - 1)}>
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  size='small'
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            </Paper>

            {/* Product grid */}
            {products.length === 0 ? (
              <Paper sx={{ p: 8, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '48px', mb: 2 }}>🔍</Typography>
                <Typography sx={{ color: '#999', fontSize: '16px', mb: 1 }}>
                  Không tìm thấy sản phẩm nào cho &quot;{query}&quot;
                </Typography>
                <Typography sx={{ color: '#bbb', fontSize: '13px' }}>Hãy thử tìm kiếm với từ khoá khác</Typography>
              </Paper>
            ) : (
              <>
                <Grid container spacing={2}>
                  {products.map(product => (
                    <Grid item xs={6} sm={4} md={3} key={product.id}>
                      <ProductCard product={product} />
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(_, page) => handlePageChange(page)}
                      color='primary'
                      shape='rounded'
                      showFirstButton
                      showLastButton
                      sx={{
                        '& .MuiPaginationItem-root': {
                          fontSize: '14px'
                        },
                        '& .MuiPaginationItem-root.Mui-selected': {
                          backgroundColor: '#ee4d2d',
                          color: '#fff'
                        }
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

// Server-side data fetching
export const getServerSideProps: GetServerSideProps<SearchPageProps> = async context => {
  // Lấy ngôn ngữ từ header để gửi đến API để lấy các chọn đúng ngôn ngữ để hiện sản phẩm
  const acceptLanguage = context.req.headers['accept-language'] || 'en'
  const baseLang = acceptLanguage.split('-')[0].split(',')[0].toLowerCase()

  const query = (context.query.q as string) || ''
  const page = Number(context.query.page) || 1
  const sortBy = (context.query.sortBy as string) || 'createdAt'
  const orderBy = (context.query.orderBy as string) || 'desc'
  const minPrice = context.query.minPrice ? Number(context.query.minPrice) : null
  const maxPrice = context.query.maxPrice ? Number(context.query.maxPrice) : null

  if (!query) {
    return {
      props: {
        query: '',
        products: [],
        totalPages: 1,
        currentPage: 1,
        sortBy,
        orderBy,
        minPrice: null,
        maxPrice: null
      }
    }
  }

  try {
    const productResponse = await axios.get(`${API_URL}/product`, {
      params: {
        page,
        limit: LIMIT,
        name: query,
        sortBy,
        orderBy,
        ...(minPrice !== null && { minPrice }),
        ...(maxPrice !== null && { maxPrice })
      },

      // dựa vào ngôn ngữ trên header accept-language
      headers: {
        'Accept-Language': baseLang
      }
    })

    const products: ProductType[] = productResponse.data?.data ?? []
    const totalPages: number = productResponse.data?.totalPages ?? 1

    return {
      props: {
        query,
        products: JSON.parse(JSON.stringify(products)),
        totalPages,
        currentPage: page,
        sortBy,
        orderBy,
        minPrice,
        maxPrice
      }
    }
  } catch (error) {
    console.error('Search failed:', error)

    return {
      props: {
        query,
        products: [],
        totalPages: 1,
        currentPage: 1,
        sortBy,
        orderBy,
        minPrice: null,
        maxPrice: null
      }
    }
  }
}

SearchPage.guestGuard = false
SearchPage.authGuard = false
