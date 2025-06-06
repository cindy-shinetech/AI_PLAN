/* eslint-disable no-unused-vars */
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUploadCloud } from 'react-icons/fi' 
import { PageContainer } from "../components/Layout/PageContainer";
import { useNavigate } from 'react-router';

// ... import 保持不变

export default function UploadPage() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recognitionType, setRecognitionType] = useState('pdf') //识别类型 pdf / ai

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
      formData.append('mode', recognitionType)  

      const res = await fetch('http://localhost:8000/upload/', {
        method: 'POST',
        body: formData,
      })

      const result = await res.json()
      navigate('/results', {
        state: {
          uploadedFileUrl: URL.createObjectURL(file),
          fileType: file.type,
          resultJson: result,
          recognitionType: recognitionType,  
        }
      })
    } catch (err) {
      console.error("Error during extraction:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <PageContainer>
      <div className="w-full max-w-none px-6 py-8 mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <p className="mt-1 text-sm font-medium text-gray-500">AI Auto Recognition</p>
          <p className="mt-1 text-sm text-gray-500">
            AI will automatically recognize the building plan and show the meta data result.
          </p>
        </div>

        <div className="w-full max-w-4xl bg-white shadow rounded-lg p-8 mt-8 mx-auto">
          {/* 🟡 识别方式切换 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Recognition Mode</label>
            <select
              value={recognitionType}
              onChange={(e) => setRecognitionType(e.target.value)}
              className="block w-60 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="pdf">PDF Line Extraction</option>
              <option value="ai">AI Building Recognition</option>
            </select>
          </div>

          <div 
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input {...getInputProps()} />
            <FiUploadCloud className="mx-auto h-16 w-16 text-gray-400" />
            <p className="mt-4 text-lg font-medium text-gray-700">
              {isDragActive ? 'Drop the file here' : 'Upload a building plan'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Click to upload a PDF or image file (PNG, JPG, JPEG)
            </p>
            {file && (
              <p className="mt-3 text-sm text-blue-600 font-semibold">
                Selected file: {file.name}
              </p>
            )}
            {error && (
              <p className="mt-3 text-sm text-red-500 font-semibold">
                {error}
              </p>
            )}
          </div>

          {file && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
      </div>
    </PageContainer>
  )
}
