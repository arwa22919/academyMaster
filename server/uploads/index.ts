import express from 'express';
import path from 'path';

export function setupUploads(app: express.Express) {
  // Serve uploaded files — use Railway volume in production
  const uploadsPath = process.env.UPLOAD_DIR || (
    process.env.NODE_ENV === 'production'
      ? '/data/uploads'
      : path.join(process.cwd(), 'client/public/uploads')
  );
  app.use('/uploads', express.static(uploadsPath));
}
