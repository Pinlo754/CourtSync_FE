import { useState } from 'react';
import { UseUploadFirebase } from './useUploadFirebase';

export const useImageUpload = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File) => {
    if (!file) return null;

    setIsUploading(true);
    try {
      const url = await UseUploadFirebase(file, (newImages) => {
        setImages(prev => [...prev, ...newImages]);
      });
      return url;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setImages([]);
  };

  return {
    images,
    isUploading,
    uploadImage,
    removeImage,
    clearImages,
    setImages
  };
}; 