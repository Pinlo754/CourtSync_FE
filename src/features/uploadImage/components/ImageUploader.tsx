import React, { useState, useEffect } from 'react';
import { UseUploadFirebase } from '../hooks/useUploadFirebase';
import { ImageUploaderProps } from '../types';

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  className = "" 
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset error state
    setError(null);
    setIsUploading(true);

    try {
      const url = await UseUploadFirebase(file, setUploadedImages);
      if (url && onImageUpload) {
        onImageUpload(url);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      // Clear the input
      event.target.value = '';
    }
  };

  return (
    <div className={`image-uploader ${className}`}>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
        id="image-upload"
      />
      <label 
        htmlFor="image-upload" 
        className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
          'bg-blue-600 hover:bg-blue-700' 
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isUploading ? 'Đang tải lên...' : 'Chọn hình ảnh'}
      </label>

      {/* Error message */}
      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {/* Uploaded images */}
      {uploadedImages.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Hình ảnh đã tải:</h4>
          <div className="flex flex-wrap gap-2">
            {uploadedImages.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  className="w-20 h-20 object-cover rounded border"
                />
                <button
                  onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 