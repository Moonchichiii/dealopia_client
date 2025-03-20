export const cloudinaryLoader = ({ src, width, quality = 75 }) => {
  const params = [
    'f_auto',
    'c_limit',
    `w_${width}`,
    `q_${quality}`,
  ];

  // Check if the image is already a Cloudinary URL
  if (src.includes('cloudinary.com')) {
    // Extract the base URL and transformation string
    const [baseUrl, transformString] = src.split('/upload/');
    return `${baseUrl}/upload/${params.join(',')}/${transformString}`;
  }

  // For non-Cloudinary URLs, return as is (will be handled by Django)
  return src;
};

export const generateSrcSet = (src: string) => {
  const widths = [320, 640, 768, 1024, 1280, 1536];
  return widths
    .map((w) => `${cloudinaryLoader({ src, width: w })} ${w}w`)
    .join(', ');
};