import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";  
import { getStorageInstance } from "./firebaseConfig"; 

export const UseUploadFirebase = async (file: File, setImgUrl: (urls: string[]) => void) => {
    // Validate file
    if (!file) {
      throw new Error("No file selected for upload.");
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not supported. Please upload an image file.`);
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("File size too large. Please upload a file smaller than 5MB.");
    }

    try {
      // Get storage instance
      const storage = getStorageInstance();
      
      // Check if Firebase is properly configured
      if (!storage) {
        throw new Error('Firebase Storage is not configured. Please check your environment variables.');
      }
      
      // Create a unique file name
      const fileName = `${v4()}-${file.name}`;
      const imgRef = ref(storage, `CourtSync/Images/${fileName}`);
      
      // Upload file
      const snapshot = await uploadBytes(imgRef, file);
      
      // Get download URL
      const url = await getDownloadURL(snapshot.ref);
      
      // Update state with new URL
      setImgUrl([url]);
      
      console.log('File uploaded successfully:', url);
      return url;
    } catch (error) {
      console.error("Error uploading file:", error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('storage/unauthorized')) {
          throw new Error('Upload failed: Unauthorized. Please check your Firebase configuration.');
        } else if (error.message.includes('storage/quota-exceeded')) {
          throw new Error('Upload failed: Storage quota exceeded.');
        } else if (error.message.includes('storage/retry-limit-exceeded')) {
          throw new Error('Upload failed: Network error. Please try again.');
        } else if (error.message.includes('Firebase Storage is not configured')) {
          throw new Error('Upload failed: Firebase is not configured. Please set up your environment variables.');
        } else {
          throw new Error(`Upload failed: ${error.message}`);
        }
      }
      
      throw new Error('Upload failed: Unknown error occurred.');
    }
  };