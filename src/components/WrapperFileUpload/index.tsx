import React from 'react'
import { useDropzone } from 'react-dropzone'

type TProps = {
  children: React.ReactNode
  objectAcceptFile?: Record<string, string[]>
  maxFiles?: number
} & (
  | {
      multiple?: false
      uploadFunc: (file: File) => void
    }
  | {
      multiple: true
      uploadFunc: (files: File[]) => void
    }
)

const WrapperFileUpload = ({ children, uploadFunc, objectAcceptFile, multiple = false, maxFiles }: TProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    multiple,
    maxFiles,
    accept: objectAcceptFile ?? {},
    onDrop: acceptedFiles => {
      if (!acceptedFiles.length) {
        return
      }

      if (multiple) {
        ;(uploadFunc as (files: File[]) => void)(acceptedFiles)

        return
      }

      ;(uploadFunc as (file: File) => void)(acceptedFiles[0])
    }
  })

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      {children}
    </div>
  )
}

export default WrapperFileUpload
