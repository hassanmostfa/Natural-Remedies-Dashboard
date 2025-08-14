import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useUploadImageMutation } from 'api/fileUploadSlice';

export const useImageUpload = () => {
  const toast = useToast();
  const [uploadImage] = useUploadImageMutation();
  
  // Main lesson image states
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Content block file states (images and PDFs)
  const [contentImagePreviews, setContentImagePreviews] = useState({});
  const [contentImageUploading, setContentImageUploading] = useState({});
  const [contentImageDragging, setContentImageDragging] = useState({});
  const [contentImageProgress, setContentImageProgress] = useState({});

  const validateImageFile = (file) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select an image file (JPEG, PNG, etc.)',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size should be less than 5MB',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const validatePdfFile = (file) => {
    if (!file.type.includes('pdf')) {
      toast({
        title: 'Error',
        description: 'Please select a PDF file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'PDF size should be less than 10MB',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleMainImageUpload = async (file, onSuccess) => {
    if (!validateImageFile(file)) return;

    try {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setIsUploadingImage(true);
      setUploadProgress(0);

      const response = await uploadImage({
        file,
        onProgress: (percent) => setUploadProgress(percent),
      }).unwrap();

      if (response.success && response.url) {
        onSuccess(response.url);
        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      setImagePreview(null);
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to upload image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploadingImage(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  const handleContentImageUpload = async (file, blockIndex, fieldName, onSuccess) => {
    if (!validateImageFile(file)) return;
    return handleContentFileUpload(file, blockIndex, fieldName, onSuccess, 'image');
  };

  const handleContentPdfUpload = async (file, blockIndex, fieldName, onSuccess) => {
    if (!validatePdfFile(file)) return;
    return handleContentFileUpload(file, blockIndex, fieldName, onSuccess, 'pdf');
  };

  const handleContentFileUpload = async (file, blockIndex, fieldName, onSuccess, fileType = 'image') => {
    const uploadKey = `${blockIndex}-${fieldName}`;
    
    try {
      console.log(`Starting ${fileType} upload for key:`, uploadKey);
      
      // For images, create preview URL; for PDFs, just set a flag
      if (fileType === 'image') {
        const previewUrl = URL.createObjectURL(file);
        setContentImagePreviews(prev => ({
          ...prev,
          [uploadKey]: previewUrl
        }));
      }
      
      // Set uploading state immediately
      setContentImageUploading(prev => ({
        ...prev,
        [uploadKey]: true
      }));
      setContentImageProgress(prev => ({
        ...prev,
        [uploadKey]: 0
      }));

      // Add a small delay to ensure the UI updates before upload starts
      await new Promise(resolve => setTimeout(resolve, 100));

      const uploadStartTime = Date.now();
      const response = await uploadImage({
        file,
        onProgress: (percent) => {
          console.log(`Progress for ${uploadKey}: ${percent}%`);
          setContentImageProgress(prev => ({
            ...prev,
            [uploadKey]: percent,
          }));
        },
      }).unwrap();
      
      // Ensure minimum upload time for better UX
      const uploadTime = Date.now() - uploadStartTime;
      if (uploadTime < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - uploadTime));
      }
      
      if (response.success && response.url) {
        onSuccess(response.url);
        toast({
          title: 'Success',
          description: `${fileType === 'pdf' ? 'PDF' : 'Image'} uploaded successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error(`Failed to upload ${fileType}:`, error);
      
      // Clean up preview for images
      if (fileType === 'image') {
        setContentImagePreviews(prev => {
          const newPreviews = { ...prev };
          delete newPreviews[uploadKey];
          return newPreviews;
        });
      }
      
      toast({
        title: 'Error',
        description: error.data?.message || `Failed to upload ${fileType}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      // Keep progress bar visible for at least 2 seconds after completion
      setTimeout(() => {
        setContentImageUploading(prev => ({
          ...prev,
          [uploadKey]: false
        }));
      }, 2000);
      setTimeout(() => {
        setContentImageProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[uploadKey];
          return newProgress;
        });
      }, 2500);
    }
  };

  const clearMainImage = () => {
    setImagePreview(null);
  };

  const clearContentImage = (blockIndex, fieldName) => {
    const uploadKey = `${blockIndex}-${fieldName}`;
    setContentImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[uploadKey];
      return newPreviews;
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e, onFileSelect) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleContentImageDragOver = (e, blockIndex, fieldName) => {
    e.preventDefault();
    const uploadKey = `${blockIndex}-${fieldName}`;
    setContentImageDragging(prev => ({
      ...prev,
      [uploadKey]: true
    }));
  };

  const handleContentImageDragLeave = (blockIndex, fieldName) => {
    const uploadKey = `${blockIndex}-${fieldName}`;
    setContentImageDragging(prev => ({
      ...prev,
      [uploadKey]: false
    }));
  };

  const handleContentImageDrop = (e, blockIndex, fieldName, onFileSelect) => {
    e.preventDefault();
    const uploadKey = `${blockIndex}-${fieldName}`;
    setContentImageDragging(prev => ({
      ...prev,
      [uploadKey]: false
    }));
    const files = e.dataTransfer.files;
    if (files && files.length > 0 && onFileSelect) {
      onFileSelect(files);
    }
  };

  return {
    // States
    imagePreview,
    setImagePreview,
    isDragging,
    isUploadingImage,
    uploadProgress,
    contentImagePreviews,
    setContentImagePreviews,
    contentImageUploading,
    contentImageDragging,
    contentImageProgress,
    
    // Handlers
    handleMainImageUpload,
    handleContentImageUpload,
    handleContentPdfUpload,
    clearMainImage,
    clearContentImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleContentImageDragOver,
    handleContentImageDragLeave,
    handleContentImageDrop,
  };
};
