import { StorefrontOutlined } from '@mui/icons-material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
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
import { ProductType } from 'src/types/product'
import ProductCard from 'src/views/pages/home/componets/CustomCard'

interface ShopPageProps {
  products: ProductType[]
  totalPages: number
  currentPage: number
  totalItems: number
  sortBy: string
  orderBy: string
}

const PRIMARY = '#ee4d2d'
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const LIMIT = 20

export default function ShopPage({ products, totalPages, currentPage, totalItems, sortBy, orderBy }: ShopPageProps) {
  const router = useRouter()
  const { brandId } = router.query

  const handlePageChange = (page: number) => {
    router.push({ pathname: `/shop/${brandId}`, query: { ...router.query, page } }, undefined, { scroll: true })
  }

  const handleSortChange = (newSortBy: string) => {
    router.push({
      pathname: `/shop/${brandId}`,
      query: { ...router.query, sortBy: newSortBy, page: 1 }
    })
  }

  const handleOrderChange = (newOrderBy: string) => {
    router.push({
      pathname: `/shop/${brandId}`,
      query: { ...router.query, orderBy: newOrderBy, page: 1 }
    })
  }

  return (
    <>
      <Head>
        <title>Shop - Tất cả sản phẩm</title>
        <meta name='description' content={`Tất cả sản phẩm của shop`} />
      </Head>

      <Box sx={{ mx: { xs: 2, md: 6 }, py: 4 }}>
        {/* Shop Header */}
        {totalItems > 0 && (
          <Paper sx={{ p: 3, mb: 3, borderRadius: '8px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#222' }}>Shop</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <StorefrontOutlined sx={{ fontSize: 16, color: '#757575' }} />
                  <Typography sx={{ fontSize: '13px', color: '#757575' }}>Online vài phút trước</Typography>
                </Box>
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '13px', color: '#757575' }}>Sản Phẩm:</Typography>
                  <Typography sx={{ fontSize: '13px', color: PRIMARY, fontWeight: 500 }}>{totalItems}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Grid container spacing={3}>
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
                      backgroundColor: sortBy === 'sale' ? PRIMARY : 'transparent',
                      color: sortBy === 'sale' ? 'white' : 'inherit',
                      '&:hover': { backgroundColor: sortBy === 'sale' ? PRIMARY : undefined },
                      '&.Mui-selected': { backgroundColor: PRIMARY, color: 'white' }
                    }}
                  >
                    Phổ Biến
                  </ToggleButton>
                  <ToggleButton value='createdAt' sx={{ px: 2, fontSize: '13px' }}>
                    Mới Nhất
                  </ToggleButton>
                  <ToggleButton value='price' sx={{ px: 2, fontSize: '13px' }}>
                    Bán Chạy
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
                <Typography sx={{ fontSize: '13px', color: PRIMARY }}>
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

            {/* Product list */}
            {products.length === 0 ? (
              <Paper sx={{ p: 8, textAlign: 'center' }}>
                <Typography sx={{ color: '#999' }}>Không có sản phẩm nào trong shop này.</Typography>
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
                        backgroundColor: PRIMARY,
                        color: '#fff'
                      }
                    }}
                  />
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<ShopPageProps> = async context => {
  const acceptLanguage = context.req.headers['accept-language'] || 'en'
  const baseLang = acceptLanguage.split('-')[0].split(',')[0].toLowerCase()

  const brandId = Number(context.params?.brandId) || 0
  const page = Number(context.query.page) || 1
  const sortBy = (context.query.sortBy as string) || 'createdAt'
  const orderBy = (context.query.orderBy as string) || 'desc'

  try {
    const productResponse = await axios.get(`${API_URL}/product`, {
      params: {
        page,
        limit: LIMIT,
        brandIds: brandId,
        sortBy,
        orderBy
      },
      headers: {
        'Accept-Language': baseLang
      }
    })

    const products: ProductType[] = productResponse.data?.data ?? []
    const totalPages: number = productResponse.data?.totalPages ?? 1
    const totalItems: number = productResponse.data?.totalItems ?? 0

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        totalPages,
        currentPage: page,
        totalItems,
        sortBy,
        orderBy
      }
    }
  } catch (error) {
    console.error('Failed to fetch shop data:', error)

    return {
      props: {
        products: [],
        totalPages: 1,
        currentPage: 1,
        totalItems: 0,
        sortBy: 'createdAt',
        orderBy: 'desc'
      }
    }
  }
}

ShopPage.guestGuard = false
ShopPage.authGuard = false
