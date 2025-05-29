import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUploadCloud } from 'react-icons/fi' 
import { PageContainer } from "../components/Layout/PageContainer";
import { useNavigate } from 'react-router-dom';

export default function UploadPage() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null)

    if (rejectedFiles.length > 0) {
      setFile(null)
      setError('Only PDF or image files (PNG, JPG, JPEG) are allowed.')
      return
    }

    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0]
      const validTypes = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg']

      if (!validTypes.includes(selectedFile.type)) {
        setFile(null)
        setError('Invalid file type. Only PDF or image files (PNG, JPG, JPEG) are allowed.')
      } else {
        setFile(selectedFile)
        setError(null)
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    maxFiles: 1
  })

  const handleSubmit = async () => {
    if (!file) return

    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      await new Promise(resolve => setTimeout(resolve, 1500)) // 模拟上传

      const imageUrl = URL.createObjectURL(file)

      navigate('/results', { 
          state: { 
            uploadedFileUrl: imageUrl,
            fileType: file.type, // <-- 添加文件类型
          }
      })
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <PageContainer>
      <div className="text-center">
        <p className="mt-1 text-sm font-medium text-gray-500">AI Auto Recognition</p>
        <p className="mt-1 text-sm text-gray-500">
          AI will automatically recognize the building plan and show the meta data result.
        </p>
      </div> 
      <div className="bg-white shadow rounded-lg p-6 mt-8"> 
        <div 
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          <input {...getInputProps()} />
          <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-lg font-medium text-gray-700">
            {isDragActive ? 'Drop the file here' : 'Upload a building plan'}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Click to upload a PDF or image file (PNG, JPG, JPEG)
          </p>
          {file && (
            <p className="mt-2 text-sm text-blue-600">
              Selected file: {file.name}
            </p>
          )}
          {error && (
            <p className="mt-2 text-sm text-red-500">
              {error}
            </p>
          )}
        </div> 
        {file && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Analyze Building Plan'}
            </button>
          </div>
        )} 
      </div>
    </PageContainer>
  )
}
