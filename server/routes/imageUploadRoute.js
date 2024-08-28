import express from 'express'
import imageDownloader from "image-downloader";
import multer from "multer";
import fs from "fs";

const router = express.Router()

const _dirname = import.meta.dirname;
const __dirname = _dirname.substring(0, _dirname.lastIndexOf('\\'))

// endpoint to upload place image by link
router.post("/upload-by-link", async (req, res) => {
    const { link } = req.body;
    const newName = "photo" + Date.now() + ".jpg";
    await imageDownloader.image({
      url: link,
      dest: __dirname + "/uploads/" + newName,
    });
    res.json(newName);
  });
  
  //endpoint to upload multiple images from device 
  const photosMiddleware = multer({ dest: "uploads/" });
  router.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname } = req.files[i];
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      uploadedFiles.push(newPath.replace("uploads\\", ""));
    }
    res.json(uploadedFiles);
  });

export default router