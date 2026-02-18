import React, { useRef, useState } from 'react'
import { Box, Button, Chip, Collapse, Divider, IconButton, Paper, TextField, Typography } from '@mui/material'
import { IconifyIcon } from 'src/components'
import { useTranslation } from 'react-i18next'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export interface VariantOption {
  value: string
  options: string[]
}

interface VariantSettingsProps {
  variants: VariantOption[]
  onChange: (variants: VariantOption[]) => void
  error?: string
}

interface SortableVariantItemProps {
  variant: VariantOption
  variantIndex: number
  isExpanded: boolean
  toggleExpand: (index: number) => void
  handleVariantNameChange: (index: number, name: string) => void
  handleRemoveOption: (variantIndex: number, optionIndex: number) => void
  handleAddOption: (variantIndex: number) => void
  handleRemoveVariant: (index: number) => void
  newOptionValue: Record<number, string>
  setNewOptionValue: React.Dispatch<React.SetStateAction<Record<number, string>>>
  addOptionRefs: React.MutableRefObject<Record<number, HTMLInputElement | null>>
  onChange: (variants: VariantOption[]) => void
  variants: VariantOption[]
  t: (key: string) => string
}

interface SortableOptionsListProps {
  variantIndex: number
  variant: VariantOption
  handleRemoveOption: (variantIndex: number, optionIndex: number) => void
  onChange: (variants: VariantOption[]) => void
  variants: VariantOption[]
}

interface SortableOptionItemProps {
  id: string
  option: string
  variantIndex: number
  optionIndex: number
  handleRemoveOption: (variantIndex: number, optionIndex: number) => void
  onChange: (variants: VariantOption[]) => void
  variants: VariantOption[]
}

// Sortable Variant Item Component
const SortableVariantItem: React.FC<SortableVariantItemProps> = ({
  variant,
  variantIndex,
  isExpanded,
  toggleExpand,
  handleVariantNameChange,
  handleRemoveOption,
  handleAddOption,
  handleRemoveVariant,
  newOptionValue,
  setNewOptionValue,
  addOptionRefs,
  onChange,
  variants,
  t
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `variant-${variantIndex}`
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddOption(variantIndex)
    }
  }

  return (
    <Box ref={setNodeRef} style={style} sx={{ mb: 2 }}>
      <Paper
        variant='outlined'
        sx={{
          p: 2,
          borderColor: isExpanded ? 'primary.main' : 'divider'
        }}
      >
        {/* Collapsed header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size='small' {...attributes} {...listeners} sx={{ cursor: 'grab', touchAction: 'none' }}>
              <IconifyIcon icon='tabler:grip-vertical' />
            </IconButton>
            <Box onClick={() => toggleExpand(variantIndex)} sx={{ cursor: 'pointer', flex: 1 }}>
              <Typography fontWeight={600}>{variant.value || t('Option name')}</Typography>
              {!isExpanded && variant.options.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                  {variant.options.map((opt: string, i: number) => (
                    <Chip key={i} label={opt} size='small' variant='outlined' />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
          <IconButton size='small' onClick={() => toggleExpand(variantIndex)}>
            <IconifyIcon icon={isExpanded ? 'tabler:chevron-up' : 'tabler:chevron-down'} />
          </IconButton>
        </Box>

        {/* Expanded content */}
        <Collapse in={isExpanded}>
          <Box sx={{ mt: 2 }}>
            {/* Option name */}
            <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
              {t('Option name')}
            </Typography>
            <TextField
              fullWidth
              size='small'
              value={variant.value}
              onChange={e => handleVariantNameChange(variantIndex, e.target.value)}
              placeholder={t('e.g. Color, Size, Material')}
              sx={{ mb: 2 }}
            />

            {/* Option values */}
            <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
              {t('Option values')}
            </Typography>

            <SortableOptionsList
              variantIndex={variantIndex}
              variant={variant}
              handleRemoveOption={handleRemoveOption}
              onChange={onChange}
              variants={variants}
            />

            {/* Add new option input */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box sx={{ width: 32 }} />
              <TextField
                fullWidth
                size='small'
                inputRef={el => {
                  addOptionRefs.current[variantIndex] = el
                }}
                value={newOptionValue[variantIndex] || ''}
                onChange={e =>
                  setNewOptionValue((prev: Record<number, string>) => ({ ...prev, [variantIndex]: e.target.value }))
                }
                onKeyDown={handleKeyDown}
                placeholder={t('Add another value')}
              />
              <IconButton
                size='small'
                color='primary'
                onClick={() => handleAddOption(variantIndex)}
                disabled={!newOptionValue[variantIndex]?.trim()}
              >
                <IconifyIcon icon='tabler:plus' />
              </IconButton>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button size='small' color='error' onClick={() => handleRemoveVariant(variantIndex)}>
                {t('Delete')}
              </Button>
              <Button size='small' variant='contained' onClick={() => toggleExpand(variantIndex)}>
                {t('Done')}
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Paper>
    </Box>
  )
}

// Sortable Options List Component
const SortableOptionsList: React.FC<SortableOptionsListProps> = ({
  variantIndex,
  variant,
  handleRemoveOption,
  onChange,
  variants
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = variant.options.findIndex((_: string, i: number) => `option-${variantIndex}-${i}` === active.id)
      const newIndex = variant.options.findIndex((_: string, i: number) => `option-${variantIndex}-${i}` === over.id)

      const updated = [...variants]
      updated[variantIndex] = {
        ...updated[variantIndex],
        options: arrayMove(variant.options, oldIndex, newIndex)
      }
      onChange(updated)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={variant.options.map((_: string, i: number) => `option-${variantIndex}-${i}`)}
        strategy={verticalListSortingStrategy}
      >
        {variant.options.map((option: string, optionIndex: number) => (
          <SortableOptionItem
            key={`option-${variantIndex}-${optionIndex}`}
            id={`option-${variantIndex}-${optionIndex}`}
            option={option}
            variantIndex={variantIndex}
            optionIndex={optionIndex}
            handleRemoveOption={handleRemoveOption}
            onChange={onChange}
            variants={variants}
          />
        ))}
      </SortableContext>
    </DndContext>
  )
}

// Sortable Option Item Component
const SortableOptionItem: React.FC<SortableOptionItemProps> = ({
  id,
  option,
  variantIndex,
  optionIndex,
  handleRemoveOption,
  onChange,
  variants
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 1
      }}
    >
      <IconButton size='small' {...attributes} {...listeners} sx={{ cursor: 'grab', touchAction: 'none' }}>
        <IconifyIcon icon='tabler:grip-vertical' />
      </IconButton>
      <TextField
        fullWidth
        size='small'
        value={option}
        onChange={e => {
          const updated = [...variants]
          updated[variantIndex].options[optionIndex] = e.target.value
          onChange(updated)
        }}
      />
      <IconButton
        size='small'
        onClick={() => handleRemoveOption(variantIndex, optionIndex)}
        sx={{ color: 'text.secondary' }}
      >
        <IconifyIcon icon='tabler:trash' />
      </IconButton>
    </Box>
  )
}

const VariantSettings: React.FC<VariantSettingsProps> = ({ variants, onChange, error }) => {
  const { t } = useTranslation()
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set())
  const [newOptionValue, setNewOptionValue] = useState<Record<number, string>>({})
  const addOptionRefs = useRef<Record<number, HTMLInputElement | null>>({})

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleAddVariant = () => {
    const updated = [...variants, { value: '', options: [] }]
    onChange(updated)
    const newIndices = new Set(expandedIndices)
    newIndices.add(updated.length - 1)
    setExpandedIndices(newIndices)
  }

  const handleRemoveVariant = (index: number) => {
    const updated = variants.filter((_, i) => i !== index)
    onChange(updated)
    const newIndices = new Set(expandedIndices)
    newIndices.delete(index)
    setExpandedIndices(newIndices)
  }

  const handleVariantNameChange = (index: number, name: string) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], value: name }
    onChange(updated)
  }

  const handleAddOption = (variantIndex: number) => {
    const val = newOptionValue[variantIndex]?.trim()
    if (!val) return
    const updated = [...variants]
    if (updated[variantIndex].options.includes(val)) return
    updated[variantIndex] = {
      ...updated[variantIndex],
      options: [...updated[variantIndex].options, val]
    }
    onChange(updated)
    setNewOptionValue((prev: Record<number, string>) => ({ ...prev, [variantIndex]: '' }))

    setTimeout(() => {
      addOptionRefs.current[variantIndex]?.focus()
    }, 50)
  }

  const handleRemoveOption = (variantIndex: number, optionIndex: number) => {
    const updated = [...variants]
    updated[variantIndex] = {
      ...updated[variantIndex],
      options: updated[variantIndex].options.filter((_, i) => i !== optionIndex)
    }
    onChange(updated)
  }

  const toggleExpand = (index: number) => {
    const newIndices = new Set(expandedIndices)
    if (newIndices.has(index)) {
      newIndices.delete(index)
    } else {
      newIndices.add(index)
    }
    setExpandedIndices(newIndices)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = variants.findIndex((_, i) => `variant-${i}` === active.id)
      const newIndex = variants.findIndex((_, i) => `variant-${i}` === over.id)

      onChange(arrayMove(variants, oldIndex, newIndex))
    }
  }

  return (
    <Paper variant='outlined' sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant='h6' fontWeight={600}>
          {t('Variant Settings')}
        </Typography>
        <Button size='small' startIcon={<IconifyIcon icon='tabler:plus' />} onClick={handleAddVariant}>
          {t('Add Variant')}
        </Button>
      </Box>

      {error && (
        <Typography variant='body2' color='error' sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={variants.map((_, i) => `variant-${i}`)} strategy={verticalListSortingStrategy}>
          {variants.map((variant, variantIndex) => (
            <SortableVariantItem
              key={`variant-${variantIndex}`}
              variant={variant}
              variantIndex={variantIndex}
              isExpanded={expandedIndices.has(variantIndex)}
              toggleExpand={toggleExpand}
              handleVariantNameChange={handleVariantNameChange}
              handleRemoveOption={handleRemoveOption}
              handleAddOption={handleAddOption}
              handleRemoveVariant={handleRemoveVariant}
              newOptionValue={newOptionValue}
              setNewOptionValue={setNewOptionValue}
              addOptionRefs={addOptionRefs}
              onChange={onChange}
              variants={variants}
              t={t}
            />
          ))}
        </SortableContext>
      </DndContext>

      {variants.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            color: 'text.secondary',
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 1
          }}
        >
          <IconifyIcon icon='tabler:tags' style={{ fontSize: 40, marginBottom: 8 }} />
          <Typography variant='body2'>{t('No variants added yet')}</Typography>
          <Button size='small' sx={{ mt: 1 }} startIcon={<IconifyIcon icon='tabler:plus' />} onClick={handleAddVariant}>
            {t('Add another option')}
          </Button>
        </Box>
      )}
    </Paper>
  )
}

export default VariantSettings
