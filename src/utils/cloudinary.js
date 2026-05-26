import imageCompression from 'browser-image-compression';

export const uploadToCloudinary = async (file) => {
  console.log('uploadToCloudinary starting for file:', {
    name: file?.name,
    type: file?.type,
    size: file?.size,
    isInstanceofFile: file instanceof File
  });

  try {
    let fileToUpload = file;

    // 1. Compress the image if it's a standard compressible image
    if (file && file.type && file.type.startsWith('image/') && !file.type.includes('gif')) {
      try {
        const options = {
          maxSizeMB: 1, // Max file size 1MB
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: 'image/webp' // Convert to WebP for better compression
        };
        
        console.log('Compressing image...');
        fileToUpload = await imageCompression(file, options);
        console.log('Compression successful. New size:', fileToUpload?.size);
      } catch (compressionError) {
        console.warn('Image compression failed, uploading original file:', compressionError);
      }
    } else {
      console.log('Skipping compression (non-compressible or non-image type).');
    }

    // 2. Upload to Cloudinary
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    console.log('Sending upload request to Cloudinary...');
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText} - ${errText}`);
    }

    const data = await response.json();
    console.log('Cloudinary upload successful:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    throw error;
  }
};
