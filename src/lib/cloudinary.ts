// =====================================================
// CLOUDINARY CONFIGURATION
// =====================================================

import { v2 as cloudinary } from 'cloudinary';

// =====================================================
// CONFIGURATION
// =====================================================

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Validate environment variables
if (!cloudName) {
  console.error('Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable');
}

if (!apiKey) {
  console.error('Missing CLOUDINARY_API_KEY environment variable');
}

if (!apiSecret) {
  console.error('Missing CLOUDINARY_API_SECRET environment variable');
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Check if Cloudinary is properly configured
 */
export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret);
}

/**
 * Get Cloudinary cloud name
 */
export function getCloudName(): string | undefined {
  return cloudName;
}

/**
 * Build Cloudinary URL from public ID
 */
export function buildCloudinaryUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string | number;
  format?: string;
}): string {
  const { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = options || {};
  
  let transformation = '';
  
  if (width || height) {
    const parts = [];
    if (width) parts.push(`w_${width}`);
    if (height) parts.push(`h_${height}`);
    parts.push(`c_${crop}`);
    parts.push(`q_${quality}`);
    parts.push(`f_${format}`);
    transformation = parts.join(',') + '/';
  }
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}${publicId}`;
}

// =====================================================
// EXPORT
// =====================================================

export default cloudinary;
