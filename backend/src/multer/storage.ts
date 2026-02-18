import multer from 'multer';

// Memory storage is used for S3/Cloudinary as they require the file buffer
const storage = multer.memoryStorage();

export const uploadSingle = multer({ storage }).single('file');
export const uploadMultiple = multer({ storage }).array('files', 10);
export const uploadAvatar = multer({ storage }).single('file');
