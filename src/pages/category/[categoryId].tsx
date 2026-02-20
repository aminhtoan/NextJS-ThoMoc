import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import {
  Box,
  Collapse,
  Divider,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
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
import { useState } from 'react'
import { CategoryWithTranslationsType } from 'src/types/category'
import { ProductType } from 'src/types/product'
import ProductCard from 'src/views/pages/home/componets/CustomCard'

interface CategoryPageProps {
  products: ProductType[]
  totalPages: number
  currentPage: number
  category: CategoryWithTranslationsType | null
  allCategories: CategoryWithTranslationsType[]
  sortBy: string
  orderBy: string
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const LIMIT = 12

export default function CategoryPage({
  products,
  totalPages,
  currentPage,
  category,
  allCategories,
  sortBy,
  orderBy
}: CategoryPageProps) {
  const router = useRouter()
  const { categoryId } = router.query
  const [openCategories, setOpenCategories] = useState<Record<number, boolean>>({})

  // Lấy tên category từ translation
  const categoryName =
    category?.categoryTranslations && category.categoryTranslations.length > 0
      ? category.categoryTranslations[0].name
      : category?.name || 'Danh mục'

  // Lọc parent categories
  const parentCategories = allCategories.filter(cat => !cat.parentCategoryId)

  // Lấy subcategories cho một parent
  const getSubCategories = (parentId: number) => allCategories.filter(cat => cat.parentCategoryId === parentId)

  const handleToggleCategory = (catId: number) => {
    setOpenCategories(prev => ({ ...prev, [catId]: !prev[catId] }))
  }

  const handlePageChange = (page: number) => {
    router.push({ pathname: `/category/${categoryId}`, query: { ...router.query, page } }, undefined, { scroll: true })
  }

  const handleCategoryClick = (catId: number) => {
    router.push(`/category/${catId}`)
  }

  const handleSortChange = (newSortBy: string) => {
    router.push({
      pathname: `/category/${categoryId}`,
      query: { ...router.query, sortBy: newSortBy, page: 1 }
    })
  }

  const handleOrderChange = (newOrderBy: string) => {
    router.push({
      pathname: `/category/${categoryId}`,
      query: { ...router.query, orderBy: newOrderBy, page: 1 }
    })
  }

  const getCategoryName = (cat: CategoryWithTranslationsType) => {
    return cat.categoryTranslations && cat.categoryTranslations.length > 0 ? cat.categoryTranslations[0].name : cat.name
  }

  return (
    <>
      <Head>
        <title>{categoryName} - Thổ mộc</title>
        <meta name='description' content={`Sản phẩm thuộc danh mục ${categoryName}`} />
      </Head>

      <Box sx={{ mx: { xs: 2, md: 6 }, py: 4 }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            {/* Category list */}
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '14px',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                ☰ Tất Cả Danh Mục
              </Typography>

              <List component='nav' dense disablePadding>
                {parentCategories.map(cat => {
                  const subCategories = getSubCategories(cat.id)
                  const isOpen = openCategories[cat.id]
                  const isActive = Number(categoryId) === cat.id

                  return (
                    <Box key={cat.id}>
                      <ListItemButton
                        onClick={() => {
                          if (subCategories.length > 0) {
                            handleToggleCategory(cat.id)
                          } else {
                            handleCategoryClick(cat.id)
                          }
                        }}
                        sx={{
                          py: 1,
                          borderRadius: 1,
                          backgroundColor: isActive ? 'rgba(238, 77, 45, 0.08)' : 'transparent',
                          '&:hover': {
                            backgroundColor: 'rgba(238, 77, 45, 0.05)'
                          }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontSize: '13px',
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? '#ee4d2d' : '#333'
                              }}
                            >
                              {getCategoryName(cat)}
                            </Typography>
                          }
                        />
                        {subCategories.length > 0 && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                      </ListItemButton>

                      {subCategories.length > 0 && (
                        <Collapse in={isOpen} timeout='auto' unmountOnExit>
                          <List component='div' disablePadding>
                            {subCategories.map(subCat => {
                              const isSubActive = Number(categoryId) === subCat.id

                              return (
                                <ListItemButton
                                  key={subCat.id}
                                  sx={{ pl: 4, py: 0.5 }}
                                  onClick={() => handleCategoryClick(subCat.id)}
                                >
                                  <ListItemText
                                    primary={
                                      <Typography
                                        sx={{
                                          fontSize: '12px',
                                          fontWeight: isSubActive ? 600 : 400,
                                          color: isSubActive ? '#ee4d2d' : '#666'
                                        }}
                                      >
                                        {getCategoryName(subCat)}
                                      </Typography>
                                    }
                                  />
                                </ListItemButton>
                              )
                            })}
                          </List>
                        </Collapse>
                      )}
                    </Box>
                  )
                })}
              </List>
            </Paper>

            {/* Filter section */}
            <Paper sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 2 }}>BỘ LỌC TÌM KIẾM</Typography>

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
            {/* Header */}
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

            {/* Product list */}
            {products.length === 0 ? (
              <Paper sx={{ p: 8, textAlign: 'center' }}>
                <Typography sx={{ color: '#999' }}>Không có sản phẩm nào trong danh mục này.</Typography>
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
                        backgroundColor: '#ee4d2d',
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

export const getServerSideProps: GetServerSideProps<CategoryPageProps> = async context => {
  const acceptLanguage = context.req.headers['accept-language'] || 'en'
  const baseLang = acceptLanguage.split('-')[0].split(',')[0].toLowerCase()

  const categoryId = Number(context.params?.categoryId) || 0
  const page = Number(context.query.page) || 1
  const sortBy = (context.query.sortBy as string) || 'createdAt'
  const orderBy = (context.query.orderBy as string) || 'desc'

  try {
    const [productResponse, categoryResponse, allCategoriesResponse] = await Promise.all([
      axios.get(`${API_URL}/product`, {
        params: {
          page,
          limit: LIMIT,
          categories: categoryId,
          sortBy,
          orderBy
        },
        headers: {
          'Accept-Language': baseLang
        }
      }),
      axios.get(`${API_URL}/category/${categoryId}`, {
        headers: {
          'Accept-Language': baseLang
        }
      }),
      axios.get(`${API_URL}/category`, {
        headers: {
          'Accept-Language': baseLang
        }
      })
    ])

    const products: ProductType[] = productResponse.data?.data ?? []
    const totalPages: number = productResponse.data?.totalPages ?? 1
    const category: CategoryWithTranslationsType | null = categoryResponse.data ?? null
    const allCategories: CategoryWithTranslationsType[] = allCategoriesResponse.data?.data ?? []

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        totalPages,
        currentPage: page,
        category: JSON.parse(JSON.stringify(category)),
        allCategories: JSON.parse(JSON.stringify(allCategories)),
        sortBy,
        orderBy
      }
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)

    return {
      props: {
        products: [],
        totalPages: 1,
        currentPage: 1,
        category: null,
        allCategories: [],
        sortBy: 'createdAt',
        orderBy: 'desc'
      }
    }
  }
}

CategoryPage.guestGuard = false
CategoryPage.authGuard = false
