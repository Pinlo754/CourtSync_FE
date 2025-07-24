import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { UseUploadFirebase } from '../hooks/useUploadFirebase';
import { ImageUploaderProps } from '../types';

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  className = "" 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset error state
    setError(null);
    setIsUploading(true);

    try {
      const url = await UseUploadFirebase(file, (newImages) => {
        // We don't need to manage images state here as we're passing the URL to parent
      });
      
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
        className={`cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-600/50 
          rounded-lg text-white bg-slate-700/50 hover:bg-slate-600/50 transition-colors
          ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-mint-400" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 text-mint-400" />
            <span>Upload Image</span>
          </>
        )}
      </label>

      {/* Error message */}
      {error && (
        <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}; 