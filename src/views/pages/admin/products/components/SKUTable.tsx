import React, { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { IconifyIcon } from 'src/components'
import { useTranslation } from 'react-i18next'
import WrapperFileUpload from 'src/components/WrapperFileUpload'
import { SKUItem } from 'src/types/product'

interface VariantOption {
  value: string
  options: string[]
}

export interface PendingSKUImage {
  skuValue: string
  skuIndex: number
  file: File
  preview: string
}

interface SKUTableProps {
  variants: VariantOption[]
  skus: SKUItem[]
  onChange: (skus: SKUItem[]) => void
  onPendingImagesChange?: (images: PendingSKUImage[]) => void
  pendingImages?: PendingSKUImage[]
  error?: string
  submitting?: boolean
}

/**
 * Generate the cartesian product of variant options to produce SKU values.
 * Example: [['S','M'], ['Red','Blue']] → ['S-Red','S-Blue','M-Red','M-Blue']
 */
function generateSKUValues(variants: VariantOption[]): string[] {
  if (variants.length === 0) return []
  const options = variants.map(v => v.options)
  if (options.some(o => o.length === 0)) return []

  return options.reduce<string[]>((acc, curr) => acc.flatMap(x => curr.map(y => `${x}${x ? '-' : ''}${y}`)), [''])
}

/**
 * Groups SKUs by the first variant option for collapsible display.
 */
function groupSKUs(
  skus: SKUItem[],
  variants: VariantOption[]
): { groupLabel: string; items: { sku: SKUItem; globalIndex: number }[] }[] {
  if (variants.length <= 1) {
    return [{ groupLabel: '', items: skus.map((sku, i) => ({ sku, globalIndex: i })) }]
  }

  const firstOptions = variants[0]?.options || []
  const groups: { groupLabel: string; items: { sku: SKUItem; globalIndex: number }[] }[] = []

  firstOptions.forEach(opt => {
    const items: { sku: SKUItem; globalIndex: number }[] = []
    skus.forEach((sku, globalIndex) => {
      if (sku.value.startsWith(opt + '-') || sku.value === opt) {
        items.push({ sku, globalIndex })
      }
    })
    if (items.length > 0) {
      groups.push({ groupLabel: opt, items })
    }
  })

  return groups
}

const SKUTable: React.FC<SKUTableProps> = ({
  variants,
  skus,
  onChange,
  error,
  onPendingImagesChange,
  pendingImages = [],
  submitting = false
}) => {
  const { t } = useTranslation()
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [expandAll, setExpandAll] = useState(true)

  // Ensure SKUs match variant combinations
  const expectedValues = useMemo(() => generateSKUValues(variants), [variants])

  const groups = useMemo(() => groupSKUs(skus, variants), [skus, variants])

  const handleFieldChange = (index: number, field: keyof SKUItem, value: string | number) => {
    const updated = [...skus]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const handleUploadImage = (file: File, index: number, skuValue: string) => {
    // Store file as pending, don't upload yet
    const preview = URL.createObjectURL(file)
    const newPendingImage: PendingSKUImage = {
      skuValue,
      skuIndex: index,
      file,
      preview
    }

    const updated = [...pendingImages, newPendingImage]
    onPendingImagesChange?.(updated)
  }

  const handleRemovePendingImage = (skuIndex: number) => {
    const updated = pendingImages.filter(img => img.skuIndex !== skuIndex)
    const removedImg = pendingImages.find(img => img.skuIndex === skuIndex)
    if (removedImg) {
      URL.revokeObjectURL(removedImg.preview)
    }
    onPendingImagesChange?.(updated)
  }

  // Get pending image for specific SKU
  const getPendingImageForSKU = (index: number) => {
    return pendingImages.find(img => img.skuIndex === index)
  }

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [label]: !prev[label]
    }))
  }

  const handleToggleAll = () => {
    const newExpand = !expandAll
    setExpandAll(newExpand)
    const newGroups: Record<string, boolean> = {}
    groups.forEach(g => {
      newGroups[g.groupLabel] = newExpand
    })
    setExpandedGroups(newGroups)
  }

  // Initialize expanded groups
  React.useEffect(() => {
    const initial: Record<string, boolean> = {}
    groups.forEach(g => {
      if (initial[g.groupLabel] === undefined) {
        initial[g.groupLabel] = true
      }
    })
    setExpandedGroups(initial)
  }, [groups.length]) // eslint-disable-line react-hooks/exhaustive-deps

  if (expectedValues.length === 0) {
    return null
  }

  return (
    <Paper variant='outlined' sx={{ overflow: 'hidden' }}>
      {error && (
        <Typography variant='body2' color='error' sx={{ p: 2 }}>
          {error}
        </Typography>
      )}

      <TableContainer>
        <Table size='small'>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600, width: 50 }}>
                {variants.length > 1 && (
                  <Button size='small' onClick={handleToggleAll} sx={{ minWidth: 'auto', p: 0 }}>
                    {expandAll ? t('Collapse All') : t('Expand All')}
                  </Button>
                )}
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{t('Variant')}</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 160 }}>{t('Price')}</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 120 }}>{t('Available')}</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 80 }}>{t('Image')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group, groupIdx) => (
              <React.Fragment key={group.groupLabel || groupIdx}>
                {/* Group header row */}
                {group.groupLabel && (
                  <TableRow
                    sx={{
                      bgcolor: 'grey.100',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'grey.200' }
                    }}
                    onClick={() => toggleGroup(group.groupLabel)}
                  >
                    <TableCell>
                      <IconifyIcon
                        icon={expandedGroups[group.groupLabel] ? 'tabler:chevron-down' : 'tabler:chevron-right'}
                      />
                    </TableCell>
                    <TableCell colSpan={4}>
                      <Typography fontWeight={600}>{group.groupLabel}</Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {group.items.length} {t('variants')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {/* SKU rows */}
                <TableRow>
                  <TableCell colSpan={5} sx={{ p: 0, border: 'none' }}>
                    <Collapse in={!group.groupLabel || expandedGroups[group.groupLabel]} unmountOnExit>
                      <Table size='small'>
                        <TableBody>
                          {group.items.map(({ sku, globalIndex }) => (
                            <TableRow key={sku.value}>
                              <TableCell sx={{ width: 50 }} />
                              <TableCell>
                                <Typography variant='body2'>{sku.value}</Typography>
                              </TableCell>
                              <TableCell sx={{ width: 160 }}>
                                <TextField
                                  size='small'
                                  value={sku.price}
                                  onChange={e => {
                                    const value = e.target.value.replace(/^0+/, '')
                                    if (value === '' || /^\d+$/.test(value)) {
                                      handleFieldChange(globalIndex, 'price', value === '' ? 0 : Number(value))
                                    }
                                  }}
                                  inputProps={{ min: 0 }}
                                  sx={{ width: 140 }}
                                  disabled={submitting}
                                />
                              </TableCell>
                              <TableCell sx={{ width: 120 }}>
                                <TextField
                                  size='small'
                                  value={sku.stock}
                                  onChange={e => {
                                    const value = e.target.value.replace(/^0+/, '')
                                    if (value === '' || /^\d+$/.test(value)) {
                                      handleFieldChange(globalIndex, 'stock', value === '' ? 0 : Number(value))
                                    }
                                  }}
                                  inputProps={{ min: 0 }}
                                  sx={{ width: 100 }}
                                  disabled={submitting}
                                />
                              </TableCell>
                              <TableCell sx={{ width: 80 }}>
                                <WrapperFileUpload
                                  uploadFunc={(file: File) => handleUploadImage(file, globalIndex, sku.value)}
                                  objectAcceptFile={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                                >
                                  {(() => {
                                    const pendingImg = getPendingImageForSKU(globalIndex)
                                    const displayImg = pendingImg?.preview || sku.image
                                    const isPending = !!pendingImg

                                    return displayImg ? (
                                      <Box
                                        sx={{
                                          position: 'relative',
                                          width: 40,
                                          height: 40,
                                          borderRadius: 1,
                                          overflow: 'hidden',
                                          border: '1px solid',
                                          borderColor: isPending ? 'warning.main' : 'divider',
                                          cursor: submitting ? 'not-allowed' : 'pointer',
                                          opacity: submitting ? 0.6 : 1
                                        }}
                                      >
                                        <img
                                          src={displayImg}
                                          alt={sku.value}
                                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        {isPending && (
                                          <IconButton
                                            size='small'
                                            onClick={e => {
                                              e.stopPropagation()
                                              handleRemovePendingImage(globalIndex)
                                            }}
                                            disabled={submitting}
                                            sx={{
                                              position: 'absolute',
                                              top: -8,
                                              right: -8,
                                              width: 20,
                                              height: 20,
                                              bgcolor: 'warning.main',
                                              color: 'white',
                                              '&:hover': { bgcolor: 'warning.dark' }
                                            }}
                                          >
                                            <IconifyIcon icon='tabler:x' style={{ fontSize: 12 }} />
                                          </IconButton>
                                        )}
                                      </Box>
                                    ) : (
                                      <IconButton
                                        size='small'
                                        disabled={submitting}
                                        sx={{ opacity: submitting ? 0.6 : 1 }}
                                      >
                                        <IconifyIcon icon='tabler:photo-plus' />
                                      </IconButton>
                                    )
                                  })()}
                                </WrapperFileUpload>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default SKUTable
