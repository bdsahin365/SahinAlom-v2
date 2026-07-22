/**
 * Utility functions for client-side image compression and safe localStorage persistence.
 */

export const compressAndResizeImage = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.78
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If SVG, return directly as DataURL since SVG is vector text
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read SVG file'));
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file from disk'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image element'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio downscaling
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // High quality smooth downsampling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to optimized JPEG Data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const safeLocalStorageSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    console.warn(`localStorage quota warning for key "${key}":`, err);
    try {
      // Emergency cleanup: clear temporary metrics or non-essential cache if full
      localStorage.removeItem('sahin_portfolio_messages');
      localStorage.setItem(key, value);
      return true;
    } catch (fallbackErr) {
      console.error(`localStorage quota exceeded error when saving "${key}":`, fallbackErr);
      return false;
    }
  }
};
