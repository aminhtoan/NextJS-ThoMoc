import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// ** Components
import { CustomSelect, IconifyIcon } from 'src/components'
import WrapperFileUpload from 'src/components/WrapperFileUpload'
import SKUTable, { PendingSKUImage } from './SKUTable'
import VariantSettings, { VariantOption } from './VariantSettings'

// ** Services
import { GetBrand } from 'src/service/brand'
import { GetCartegory } from 'src/service/category'
import { createProduct, getProductDetail, updateProduct } from 'src/service/manage-product'
import { UploadManyMedia } from 'src/service/media'

// ** Config
import { ADMIN_ROUTES } from 'src/configs/route'

// ** Rich Text Editor (react-draft-wysiwyg)
import { EditorState } from 'draft-js'
import dynamic from 'next/dynamic'

import { BrandType } from 'src/types/brand'
import { CategoryType } from 'src/types/category'
import { CreateProductBodyType, ProductFormFields, ProductFormSchema, SKUItem } from 'src/types/product'

const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), {
  ssr: false
})

interface ProductFormProps {
  productId?: number
}

interface PendingImage {
  id: string
  file: File
  preview: string
}

function generateSKUs(variants: VariantOption[]): SKUItem[] {
  if (variants.length === 0) return []
  const options = variants.map(v => v.options)
  if (options.some(o => o.length === 0)) return []

  const combinations = options.reduce<string[]>(
    (acc, curr) => acc.flatMap(x => curr.map(y => `${x}${x ? '-' : ''}${y}`)),
    ['']
  )

  return combinations.map(value => ({
    value,
    price: 0,
    stock: 100,
    image: ''
  }))
}

const ProductForm: React.FC<ProductFormProps> = ({ productId }) => {
  const isEdit = !!productId
  const { t } = useTranslation()
  const router = useRouter()

  // Form management with React Hook Form
  const {
    control,
    handleSubmit: handleRHFSubmit,
    formState: { errors: formErrors },
    setValue,
    watch
  } = useForm<ProductFormFields>({
    defaultValues: {
      name: '',
      basePrice: 0,
      virtualPrice: 0,
      brandId: '',
      categoryIds: [],
      isPublished: true,
      publishedAt: null
    },
    mode: 'onBlur',
    resolver: yupResolver(ProductFormSchema)
  })

  const watchedValues = watch()

  // Local state for complex data
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [images, setImages] = useState<string[]>([])
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([])
  const [variants, setVariants] = useState<VariantOption[]>([])
  const [skus, setSKUs] = useState<SKUItem[]>([])
  const [pendingSKUImages, setPendingSKUImages] = useState<PendingSKUImage[]>([])

  // Options
  const [brandOptions, setBrandOptions] = useState<Array<{ id: string; name: string }>>([])
  const [categoryOptions, setCategoryOptions] = useState<Array<{ id: string; name: string }>>([])

  // Loading
  const [submitting, setSubmitting] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch brands & categories
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          GetBrand({ page: 1, limit: 100, search: '' }),
          GetCartegory({})
        ])
        const brands = brandsRes.data?.data || []
        setBrandOptions(brands.map((b: BrandType) => ({ id: String(b.id), name: b.name })))

        const cats = categoriesRes.data?.data || []
        setCategoryOptions(cats.map((c: CategoryType) => ({ id: String(c.id), name: c.name })))
      } catch (error) {
        console.error('Error fetching options:', error)
      }
    }
    fetchOptions()
  }, [])

  // Fetch product detail in edit mode
  useEffect(() => {
    if (!productId) return
    const fetchDetail = async () => {
      try {
        setLoadingDetail(true)
        const response = await getProductDetail(productId)
        const product = response.data

        setValue('name', product.name || '')
        setValue('basePrice', product.basePrice || 0)
        setValue('virtualPrice', product.virtualPrice || 0)
        setValue('brandId', String(product.brandId || ''))
        setValue('isPublished', !!product.publishedAt)
        setValue('publishedAt', product.publishedAt || null)

        setImages(product.images || [])
        setVariants(product.variants || [])

        const cats = (product.categories || []).map((c: CategoryType) => String(c.id))
        setValue('categoryIds', cats)

        if (product.skus && product.skus.length > 0) {
          setSKUs(
            product.skus.map((sku: SKUItem) => ({
              value: sku.value,
              price: sku.price,
              stock: sku.stock,
              image: sku.image || ''
            }))
          )
        }
      } catch (error) {
        console.error('Error fetching product detail:', error)
        toast.error(t('Failed to load product'))
      } finally {
        setLoadingDetail(false)
      }
    }
    fetchDetail()
  }, [productId, t, setValue])

  // Auto-regenerate SKUs when variants change
  useEffect(() => {
    const validVariants = variants.filter(v => v.value && v.options.length > 0)
    if (validVariants.length === 0) {
      if (!isEdit) setSKUs([])
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.skus

        return newErrors
      })

      return
    }

    const newSKUValues = generateSKUs(validVariants)
    if (newSKUValues.length === 0) {
      setErrors(prev => ({
        ...prev,
        skus: t('Cannot generate SKUs from current variants')
      }))
      setSKUs([])

      return
    }

    setSKUs(prevSKUs => {
      return newSKUValues.map(newSku => {
        const existing = prevSKUs.find(s => s.value === newSku.value)

        return existing || newSku
      })
    })

    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors.skus

      return newErrors
    })
  }, [variants, isEdit, t])

  // Cleanup pending image previews on unmount
  useEffect(() => {
    return () => {
      pendingImages.forEach(img => URL.revokeObjectURL(img.preview))
    }
  }, [pendingImages])

  const handleRemovePendingImage = (id: string) => {
    setPendingImages(prev => {
      const toRemove = prev.find(img => img.id === id)
      if (toRemove) {
        URL.revokeObjectURL(toRemove.preview)
      }

      return prev.filter(img => img.id !== id)
    })
  }

  const handleRemoveUploadedImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const uploadAllPendingImages = async (): Promise<{ productUrls: string[]; skuImageMap: Record<number, string> }> => {
    const skuImageMap: Record<number, string> = {}

    try {
      // Upload product images
      let productUrls: string[] = []
      if (pendingImages.length > 0) {
        const files = pendingImages.map(img => img.file)
        const response = await UploadManyMedia(files, 'products')
        const uploadedData = response.data?.data || response.data || []
        productUrls = uploadedData.map((item: any) => item.url || item.secure_url).filter(Boolean)

        if (productUrls.length !== files.length) {
          throw new Error(t('Some product images failed to upload'))
        }
      }

      // Upload SKU images
      if (pendingSKUImages.length > 0) {
        for (const skuImage of pendingSKUImages) {
          const response = await UploadManyMedia([skuImage.file], 'products')
          const uploadedData = response.data?.data || response.data || []
          const url = uploadedData[0]?.url || uploadedData[0]?.secure_url
          if (url) {
            skuImageMap[skuImage.skuIndex] = url
          } else {
            throw new Error(t('Failed to upload SKU image'))
          }
        }
      }

      return { productUrls, skuImageMap }
    } catch (error) {
      console.error('Failed to upload images:', error)
      throw new Error(t('Failed to upload images'))
    }
  }

  const validateCustom = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (images.length === 0 && pendingImages.length === 0) {
      newErrors.images = t('At least one image is required')
    }

    if (variants.length === 0) {
      newErrors.variants = t('At least one variant is required')
    }

    if (variants.length > 0) {
      const hasEmptyVariantName = variants.some(v => !v.value.trim())
      if (hasEmptyVariantName) {
        newErrors.variants = t('All variant names are required')
      }

      const hasEmptyOptions = variants.some(v => v.options.length === 0)
      if (hasEmptyOptions) {
        newErrors.variants = t('All variants must have at least one option')
      }

      const hasEmptyOptionValue = variants.some(v => v.options.some(option => !option.trim()))
      if (hasEmptyOptionValue) {
        newErrors.variants = t('All option values must be filled')
      }

      if (skus.length === 0) {
        newErrors.skus = t('Please add variant options to generate SKUs')
      }
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (data: ProductFormFields) => {
    if (!validateCustom()) return

    try {
      setSubmitting(true)

      let productUrls: string[] = []
      let skuImageMap: Record<number, string> = {}

      // Upload all pending images (product + SKU)
      if (pendingImages.length > 0 || pendingSKUImages.length > 0) {
        try {
          const uploadResult = await uploadAllPendingImages()
          productUrls = uploadResult.productUrls
          skuImageMap = uploadResult.skuImageMap
        } catch (error) {
          toast.error(t('Failed to upload images'))
          throw error
        }
      }

      const allImages = [...images, ...productUrls]

      // Update SKUs with uploaded images
      const updatedSKUs = skus.map((sku, index) => ({
        ...sku,
        image: skuImageMap[index] || sku.image
      }))

      const body: CreateProductBodyType = {
        name: data.name,
        basePrice: data.basePrice,
        virtualPrice: data.virtualPrice,
        brandId: Number(data.brandId),
        images: allImages,
        variants,
        categories: (data.categoryIds || []).map(Number),
        skus: updatedSKUs.map(s => ({
          value: s.value,
          price: s.price,
          stock: s.stock,
          image: s.image
        })),
        publishedAt: data.isPublished ? data.publishedAt || new Date().toISOString() : null
      }

      if (isEdit && productId) {
        await updateProduct(productId, body)
        toast.success(t('Product updated successfully'))
      } else {
        await createProduct(body)
        toast.success(t('Product created successfully'))
      }

      // Cleanup all pending images
      pendingImages.forEach(img => URL.revokeObjectURL(img.preview))
      pendingSKUImages.forEach(img => URL.revokeObjectURL(img.preview))
      setPendingImages([])
      setPendingSKUImages([])

      router.push(ADMIN_ROUTES.PRODUCTS)
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || t('Something went wrong')
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingDetail) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>{t('Loading...')}</Typography>
      </Box>
    )
  }

  const allImagePreviews = [
    ...images.map((url, idx) => ({ type: 'uploaded' as const, url, index: idx })),
    ...pendingImages.map(pending => ({
      type: 'pending' as const,
      preview: pending.preview,
      id: pending.id
    }))
  ]

  const handleImageSelect = async (file: File) => {
    const preview = URL.createObjectURL(file)
    const newPendingImage: PendingImage = {
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview
    }
    setPendingImages(prev => [...prev, newPendingImage])

    // Clear image error nếu đã có ảnh
    if (errors.images) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.images

        return newErrors
      })
    }
  }

  const handleVariantChange = (newVariants: VariantOption[]) => {
    setVariants(newVariants)

    // Clear error chỉ khi variants thực sự hợp lệ
    if (errors.variants && newVariants.length > 0) {
      const allVariantsHaveName = newVariants.every(v => v.value.trim())
      const allVariantsHaveOptions = newVariants.every(v => v.options.length > 0)
      const allOptionsHaveValue = newVariants.every(v => v.options.every(opt => opt.trim()))

      // Chỉ clear error khi TẤT CẢ các điều kiện đều OK
      if (allVariantsHaveName && allVariantsHaveOptions && allOptionsHaveValue) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.variants

          return newErrors
        })
      }
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {submitting && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <CircularProgress size={60} sx={{ color: 'white' }} />
          <Typography variant='h6' sx={{ color: 'white', mt: 2 }}>
            {pendingImages.length > 0
              ? t('Uploading images and saving product...')
              : isEdit
                ? t('Updating product...')
                : t('Creating product...')}
          </Typography>
        </Box>
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => router.push(ADMIN_ROUTES.PRODUCTS)} disabled={submitting}>
            <IconifyIcon icon='tabler:arrow-left' />
          </IconButton>
          <Typography variant='h5' fontWeight={600}>
            {isEdit ? t('Edit product') : t('Add product')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant='contained'
            onClick={handleRHFSubmit(onSubmit)}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} sx={{ color: 'white' }} /> : null}
          >
            {submitting ? t('Saving...') : isEdit ? t('Update') : t('Save')}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* LEFT COLUMN */}
        <Grid item xs={12} md={8}>
          {/* Title */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant='body2' fontWeight={500} sx={{ mb: 1 }}>
              {t('Name')}
            </Typography>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size='small'
                  placeholder={t('Product name')}
                  error={!!formErrors.name}
                  helperText={formErrors.name?.message}
                  disabled={submitting}
                />
              )}
            />
          </Paper>

          {/* Description */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant='body2' fontWeight={500} sx={{ mb: 1 }}>
              {t('Description')}
            </Typography>
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                minHeight: 200,
                opacity: submitting ? 0.5 : 1,
                pointerEvents: submitting ? 'none' : 'auto',
                '& .rdw-editor-main': {
                  px: 2,
                  minHeight: 150
                },
                '& .rdw-editor-toolbar': {
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'grey.50'
                }
              }}
            >
              <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                toolbar={{
                  options: [
                    'inline',
                    'blockType',
                    'fontSize',
                    'fontFamily',
                    'list',
                    'textAlign',
                    'link',
                    'image',
                    'history'
                  ]
                }}
              />
            </Box>
          </Paper>

          {/* Images */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant='body2' fontWeight={500} sx={{ mb: 2 }}>
              {t('Images')}
              {pendingImages.length > 0 && (
                <Chip label={`${pendingImages.length} ${t('pending')}`} size='small' color='warning' sx={{ ml: 1 }} />
              )}
            </Typography>
            {errors.images && (
              <Typography variant='body2' color='error' sx={{ mb: 1 }}>
                {errors.images}
              </Typography>
            )}
            <Grid container spacing={2}>
              {allImagePreviews.map((item, displayIndex) => (
                <Grid item key={item.type === 'uploaded' ? `uploaded-${item.index}` : `pending-${item.id}`}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: 120,
                      height: 120,
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: displayIndex === 0 ? 'primary.main' : 'divider',
                      opacity: submitting ? 0.5 : 1
                    }}
                  >
                    <img
                      src={item.type === 'uploaded' ? item.url : item.preview}
                      alt={`product-${displayIndex}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <IconButton
                      size='small'
                      onClick={() => {
                        if (item.type === 'uploaded') {
                          handleRemoveUploadedImage(item.index)
                        } else {
                          handleRemovePendingImage(item.id)
                        }
                      }}
                      disabled={submitting}
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: '#fff',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                        width: 24,
                        height: 24
                      }}
                    >
                      <IconifyIcon icon='tabler:x' style={{ fontSize: 14 }} />
                    </IconButton>
                    {displayIndex === 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          bgcolor: 'primary.main',
                          color: '#fff',
                          textAlign: 'center',
                          fontSize: 10,
                          py: 0.25
                        }}
                      >
                        {t('Main')}
                      </Box>
                    )}
                    {item.type === 'pending' && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 2,
                          left: 2,
                          bgcolor: 'warning.main',
                          color: '#fff',
                          fontSize: 9,
                          px: 0.5,
                          py: 0.25,
                          borderRadius: 0.5
                        }}
                      >
                        {t('Pending')}
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
              <Grid item>
                <WrapperFileUpload
                  uploadFunc={handleImageSelect}
                  objectAcceptFile={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                >
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: 1,
                      border: '2px dashed',
                      borderColor: 'divider',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: submitting ? 0.5 : 1,
                      '&:hover': submitting ? {} : { borderColor: 'primary.main', bgcolor: 'action.hover' }
                    }}
                  >
                    <IconifyIcon icon='tabler:upload' style={{ fontSize: 24, marginBottom: 4 }} />
                    <Typography variant='caption' color='text.secondary'>
                      {t('Upload')}
                    </Typography>
                  </Box>
                </WrapperFileUpload>
              </Grid>
            </Grid>
          </Paper>

          {/* Pricing */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant='body2' fontWeight={500} sx={{ mb: 2 }}>
              {t('Pricing')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' fontWeight={500} sx={{ mb: 1 }}>
                  {t('Price')}
                </Typography>
                <Controller
                  name='basePrice'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size='small'
                      type='text'
                      inputMode='numeric'
                      value={field.value === 0 ? '' : String(field.value)}
                      onChange={e => {
                        const value = e.target.value.replace(/^0+/, '')
                        field.onChange(value === '' ? 0 : Number(value))
                      }}
                      placeholder='0'
                      error={!!formErrors.basePrice}
                      helperText={formErrors.basePrice?.message}
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' fontWeight={500} sx={{ mb: 1 }}>
                  {t('Compare at price')}
                </Typography>
                <Controller
                  name='virtualPrice'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size='small'
                      type='text'
                      inputMode='numeric'
                      value={field.value === 0 ? '' : String(field.value)}
                      onChange={e => {
                        const value = e.target.value.replace(/^0+/, '')
                        field.onChange(value === '' ? 0 : Number(value))
                      }}
                      placeholder='0'
                      error={!!formErrors.virtualPrice}
                      helperText={formErrors.virtualPrice?.message}
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Variant Settings */}
          <Box sx={{ mb: 3, opacity: submitting ? 0.5 : 1, pointerEvents: submitting ? 'none' : 'auto' }}>
            <VariantSettings variants={variants} onChange={handleVariantChange} error={errors.variants} />
          </Box>

          {/* SKU Table */}
          {variants.length > 0 && (
            <Box sx={{ mb: 3, opacity: submitting ? 0.5 : 1, pointerEvents: submitting ? 'none' : 'auto' }}>
              {skus.length > 0 ? (
                <SKUTable
                  variants={variants.filter(v => v.value && v.options.length > 0)}
                  skus={skus}
                  onChange={setSKUs}
                  onPendingImagesChange={setPendingSKUImages}
                  pendingImages={pendingSKUImages}
                  error={errors.skus}
                  submitting={submitting}
                />
              ) : (
                <Paper variant='outlined' sx={{ p: 3, textAlign: 'center' }}>
                  <IconifyIcon icon='tabler:box' style={{ fontSize: 48, color: '#ccc', marginBottom: 8 }} />
                  <Typography variant='body1' fontWeight={500} sx={{ mb: 1 }}>
                    {t('No Product Variants')}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {t('Complete variant settings with options to generate SKUs')}
                  </Typography>
                  {errors.skus && (
                    <Typography variant='body2' color='error' sx={{ mt: 2 }}>
                      {errors.skus}
                    </Typography>
                  )}
                </Paper>
              )}
            </Box>
          )}
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} md={4}>
          {/* Visibility */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant='body2' fontWeight={600} sx={{ mb: 2 }}>
              {t('Visibility')}
            </Typography>
            <Controller
              name='isPublished'
              control={control}
              render={({ field }) => (
                <>
                  <RadioGroup
                    value={field.value ? 'published' : 'draft'}
                    onChange={e => field.onChange(e.target.value === 'published')}
                  >
                    <FormControlLabel
                      value='published'
                      control={<Radio size='small' disabled={submitting} />}
                      label={
                        <Box>
                          <Typography variant='body2' fontWeight={500}>
                            {t('Published')}
                          </Typography>
                          {watchedValues.publishedAt && (
                            <Typography variant='caption' color='text.secondary'>
                              {new Date(watchedValues.publishedAt).toLocaleString('vi-VN')}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value='draft'
                      control={<Radio size='small' disabled={submitting} />}
                      label={
                        <Typography variant='body2' fontWeight={500}>
                          {t('Draft')}
                        </Typography>
                      }
                    />
                  </RadioGroup>

                  {field.value && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                        {t('Publish date')}
                      </Typography>
                      <Controller
                        name='publishedAt'
                        control={control}
                        render={({ field: publishField }) => (
                          <TextField
                            fullWidth
                            size='small'
                            type='datetime-local'
                            value={publishField.value ? new Date(publishField.value).toISOString().slice(0, 16) : ''}
                            onChange={e => {
                              const date = e.target.value ? new Date(e.target.value).toISOString() : null
                              publishField.onChange(date)
                            }}
                            inputProps={{
                              min: new Date().toISOString().slice(0, 16)
                            }}
                            disabled={submitting}
                          />
                        )}
                      />
                    </Box>
                  )}
                </>
              )}
            />
          </Paper>

          {/* Brand */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant='body2' fontWeight={600} sx={{ mb: 1 }}>
              {t('Brand')}
            </Typography>
            <Controller
              name='brandId'
              control={control}
              render={({ field }) => (
                <>
                  <CustomSelect
                    placeholder={t('Select brand')}
                    options={brandOptions}
                    value={field.value}
                    onChange={value => field.onChange(value)}
                    disabled={submitting}
                  />
                  {formErrors.brandId && (
                    <Typography variant='caption' color='error' sx={{ mt: 0.5, display: 'block' }}>
                      {formErrors.brandId?.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </Paper>

          {/* Categories */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant='body2' fontWeight={600} sx={{ mb: 1 }}>
              {t('Categories')}
            </Typography>
            <Controller
              name='categoryIds'
              control={control}
              render={({ field }) => (
                <>
                  <CustomSelect
                    placeholder={t('Select categories')}
                    options={categoryOptions}
                    value={field.value}
                    onChange={value => field.onChange(value)}
                    multiple
                    disabled={submitting}
                  />

                  {(watchedValues.categoryIds || []).length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1.5 }}>
                      {(watchedValues.categoryIds || []).map(catId => {
                        const cat = categoryOptions.find(c => c.id === catId)

                        return (
                          <Chip
                            key={catId}
                            label={cat?.name || catId}
                            size='small'
                            onDelete={
                              submitting
                                ? undefined
                                : () => field.onChange((watchedValues.categoryIds || []).filter(id => id !== catId))
                            }
                            color='primary'
                            variant='outlined'
                            disabled={submitting}
                          />
                        )
                      })}
                    </Box>
                  )}
                </>
              )}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProductForm
