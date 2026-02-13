import React from 'react'
import { useDropzone } from 'react-dropzone'

interface TProps {
  children: React.ReactNode
  uploadFunc: (file: File) => void
  objectAcceptFile?: Record<string, string[]>
}

const WrapperFileUpload = ({ children, uploadFunc, objectAcceptFile }: TProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: objectAcceptFile ?? {},
    onDrop: acceptedFiles => {
      uploadFunc(acceptedFiles[0])
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
