import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// ** Components
import { CustomSelect } from 'src/components'
import CustomModal from 'src/components/CustomModal'

// ** Services
import { GetLanguage } from 'src/service/language'
import {
  createProductTranslation,
  getProductTranslationDetail,
  updateProductTranslation
} from 'src/service/translation-product'

// ** Types
import { LanguageType } from 'src/types/language'
import { CreateProductTranslationBodySchema, ProductTranslationFormFields } from 'src/types/product-translation'

// ** Rich Text Editor
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), {
  ssr: false
})

interface TranslationFormDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  productId: number
  productName: string
  translationId?: number | null
}

const TranslationFormDialog: React.FC<TranslationFormDialogProps> = ({
  open,
  onClose,
  onSuccess,
  productId,
  productName,
  translationId
}) => {
  const isEdit = !!translationId
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [fetchingDetail, setFetchingDetail] = useState(false)
  const [languageOptions, setLanguageOptions] = useState<Array<{ id: string; name: string }>>([])
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<ProductTranslationFormFields>({
    defaultValues: {
      languageId: '',
      name: '',
      description: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(CreateProductTranslationBodySchema.pick(['languageId', 'name', 'description']))
  })

  // Fetch languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await GetLanguage()
        const languages = response.data?.data || []
        setLanguageOptions(languages.map((lang: LanguageType) => ({ id: lang.id, name: lang.name })))
      } catch (error) {
        console.error('Error fetching languages:', error)
      }
    }
    if (open) {
      fetchLanguages()
    }
  }, [open])

  // Fetch translation detail when editing
  useEffect(() => {
    if (open && translationId) {
      const fetchDetail = async () => {
        try {
          setFetchingDetail(true)
          const response = await getProductTranslationDetail(translationId)
          const data = response.data
          setValue('languageId', data.languageId)
          setValue('name', data.name)
          setValue('description', data.description)

          // Set editor state from HTML description
          if (data.description) {
            try {
              const blocksFromHTML = convertFromHTML(data.description)
              const contentState = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap
              )
              setEditorState(EditorState.createWithContent(contentState))
            } catch {
              setEditorState(EditorState.createEmpty())
            }
          }
        } catch (error) {
          toast.error(t('Failed to load translation detail'))
          onClose()
        } finally {
          setFetchingDetail(false)
        }
      }
      fetchDetail()
    } else if (open && !translationId) {
      reset({ languageId: '', name: '', description: '' })
      setEditorState(EditorState.createEmpty())
    }
  }, [open, translationId, setValue, reset, onClose, t])

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state)
    const rawContent = convertToRaw(state.getCurrentContent())
    const html = draftToHtml(rawContent)
    setValue('description', html)
  }

  const onSubmit = async (formData: ProductTranslationFormFields) => {
    try {
      setLoading(true)
      if (isEdit && translationId) {
        await updateProductTranslation(translationId, {
          name: formData.name,
          description: formData.description,
          languageId: formData.languageId
        })
        toast.success(t('Translation updated successfully'))
      } else {
        await createProductTranslation({
          productId,
          name: formData.name,
          description: formData.description,
          languageId: formData.languageId
        })
        toast.success(t('Translation created successfully'))
      }
      onSuccess()
      onClose()
    } catch (error: any) {
      const message = error?.response?.data?.message || t('An error occurred')
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={isEdit ? t('Edit Translation') : t('Add Translation')}
      maxWidth={700}
    >
      {fetchingDetail ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box component='form' onSubmit={handleSubmit(onSubmit)}>
          {/* Product info */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant='body2' color='text.secondary'>
              {t('Product')}
            </Typography>
            <Typography variant='subtitle1' fontWeight={600}>
              {productName}
            </Typography>
          </Box>

          {/* Language select */}
          <Box sx={{ mb: 3 }}>
            <Typography variant='body2' fontWeight={500} sx={{ mb: 1 }}>
              {t('Language')} *
            </Typography>
            <Controller
              name='languageId'
              control={control}
              render={({ field }) => (
                <CustomSelect
                  placeholder={t('Select language')}
                  options={languageOptions}
                  value={field.value}
                  onChange={value => field.onChange(value)}
                />
              )}
            />
            {errors.languageId && (
              <Typography variant='caption' color='error' sx={{ mt: 0.5 }}>
                {errors.languageId.message}
              </Typography>
            )}
          </Box>

          {/* Translation name */}
          <Box sx={{ mb: 3 }}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t('Translation Name')}
                  placeholder={t('Enter translated product name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Box>

          {/* Description (Rich Text Editor) */}
          <Box sx={{ mb: 3 }}>
            <Typography variant='body2' fontWeight={500} sx={{ mb: 1 }}>
              {t('Description')} *
            </Typography>
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                minHeight: 200,
                '& .rdw-editor-wrapper': {
                  borderRadius: 1
                },
                '& .rdw-editor-toolbar': {
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '4px 4px 0 0',
                  bgcolor: 'background.default'
                },
                '& .rdw-editor-main': {
                  px: 2,
                  minHeight: 150
                }
              }}
            >
              <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                toolbar={{
                  options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'history'],
                  inline: {
                    options: ['bold', 'italic', 'underline', 'strikethrough']
                  }
                }}
              />
            </Box>
            {errors.description && (
              <Typography variant='caption' color='error' sx={{ mt: 0.5 }}>
                {errors.description.message}
              </Typography>
            )}
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button onClick={onClose} color='inherit' disabled={loading}>
              {t('Cancel')}
            </Button>
            <Button
              type='submit'
              variant='contained'
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : undefined}
            >
              {isEdit ? t('Update') : t('Create')}
            </Button>
          </Box>
        </Box>
      )}
    </CustomModal>
  )
}

export default TranslationFormDialog
