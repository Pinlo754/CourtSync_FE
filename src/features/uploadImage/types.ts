export type UploadImageProps = {
  image: string;
  setImage: (image: string) => void;
};
export interface ImageUploaderProps {
  onImageUpload?: (url: string) => void;
  className?: string;
}