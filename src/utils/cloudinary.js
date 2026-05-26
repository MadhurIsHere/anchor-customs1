import imageCompression from 'browser-image-compression';

export const uploadToCloudinary = async (file) => {
  try {
    // 1. Compress the image
    const options = {
      maxSizeMB: 1, // Max file size 1MB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp' // Convert to WebP for better compression
    };
    
    const compressedFile = await imageCompression(file, options);
    
    // 2. Upload to Cloudinary
    const formData = new FormData();
    formData.append('file', compressedFile);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Cloudinary upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
