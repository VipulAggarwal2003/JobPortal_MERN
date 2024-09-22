import multer from "multer";
const storage =  multer.memoryStorage()
export const multipleUpload = multer( { storage:storage}).fields([
    { name: 'file' },
    { name: 'profilePhoto'}
  ]); 

