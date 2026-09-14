import express from 'express';

export function setupUploads(app: express.Express) {
  // Uploads are now stored in Cloudinary — no local static serving needed.
  // This function is kept for backward compatibility but is a no-op.
}
