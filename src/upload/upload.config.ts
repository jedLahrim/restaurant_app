// configure the storage for the uploaded files
import multer from 'multer';
// const media_path = process.env.MEDIA_PATH;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/Users/jed/Downloads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
export const upload = multer({ storage });
