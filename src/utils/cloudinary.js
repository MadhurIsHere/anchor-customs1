import imageCompression from 'browser-image-compression';

let heic2anyModule = null;

const getHeic2any = async () => {
  if (!heic2anyModule) {
    console.log('Loading heic2any dynamically...');
    const mod = await import('heic2any');
    heic2anyModule = mod.default || mod;
  }
  return heic2anyModule;
};

const isImageFile = (file) => {
  if (!file) return false;
  if (file.type && file.type.startsWith('image/')) return true;
  const ext = file.name ? file.name.split('.').pop().toLowerCase() : '';
  return ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'bmp'].includes(ext);
};

const compressImageCanvas = (file, maxWidth = 1600, maxHeight = 1600, quality = 0.75) => {
  console.log('Attempting Canvas compression for file:', file.name, file.size);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + "_compressed.jpg", {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              console.log('Canvas compression successful. Size:', compressedFile.size);
              resolve(compressedFile);
            } else {
              reject(new Error('Canvas toBlob returned null'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image in Canvas'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
};

export const uploadToCloudinary = async (file) => {
  console.log('uploadToCloudinary starting for file:', {
    name: file?.name,
    type: file?.type,
    size: file?.size,
    isInstanceofFile: file instanceof File
  });

  try {
    let fileToUpload = file;
    const isHEIC = file && (
      (file.type && (file.type.includes('heic') || file.type.includes('heif'))) ||
      (file.name && (file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')))
    );

    // 1. If it's an HEIC file, convert it to JPEG first
    if (isHEIC) {
      try {
        console.log('Detected HEIC file, starting conversion to JPEG...');
        const heic2any = await getHeic2any();
        
        const conversionResult = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8
        });

        const jpegBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
        const newName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
        
        fileToUpload = new File([jpegBlob], newName, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        
        console.log('HEIC conversion successful. Converted file:', {
          name: fileToUpload.name,
          type: fileToUpload.type,
          size: fileToUpload.size
        });
      } catch (heicError) {
        console.error('HEIC conversion failed:', heicError);
      }
    }

    const isImage = isImageFile(fileToUpload);
    const isGif = fileToUpload?.type?.includes('gif') || fileToUpload?.name?.toLowerCase().endsWith('.gif');

    // 2. Compress the image if it's a standard compressible image
    if (isImage && !isGif) {
      try {
        const options = {
          maxSizeMB: 1, // Max file size 1MB
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: 'image/webp' // Convert to WebP for better compression
        };
        
        console.log('Compressing image using browser-image-compression...');
        const compressed = await imageCompression(fileToUpload, options);
        console.log('Compression successful. New size:', compressed?.size);
        fileToUpload = compressed;
      } catch (compressionError) {
        console.warn('Image compression using library failed, trying canvas fallback:', compressionError);
      }
    }

    // 3. Fallback Canvas Compression if the file is STILL larger than 9.5MB
    if (isImage && !isGif && fileToUpload.size > 9.5 * 1024 * 1024) {
      try {
        console.log('File size still too large for Cloudinary (>9.5MB). Resizing using Canvas...');
        fileToUpload = await compressImageCanvas(fileToUpload);
      } catch (canvasError) {
        console.error('Canvas compression fallback failed:', canvasError);
      }
    }

    // 4. Upload to Cloudinary
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
