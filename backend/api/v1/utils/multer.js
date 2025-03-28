import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "doctors",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
 });

export default upload;
