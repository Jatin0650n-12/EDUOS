const mongoose = require('mongoose');
const multer = require('multer');
const { Readable } = require('stream');
const path = require('path');
require('dotenv').config();

const ALLOWED_MIMETYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

// simple metadata schema for uploaded files
const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  gridFsId: { type: mongoose.Schema.Types.ObjectId, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now }
});
const UploadedFile = mongoose.models.UploadedFile || mongoose.model('UploadedFile', fileSchema);

// multer memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
  }
}).single('file');

const uploadFile = (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ success: false, message: err.message || 'Upload error' });
      }
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file provided. Use field name "file".' });
      }

      // ensure mongoose connection ready
      const db = mongoose.connection.db;
      if (!db) return res.status(500).json({ success: false, message: 'Database not connected' });

      const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });

      const { originalname, buffer, mimetype, size } = req.file;
      const safeName = originalname.replace(/\s+/g, '_').replace(/[^\w\-.]/g, '');
      const filename = `${Date.now()}_${safeName}${path.extname(originalname) || ''}`;

      // stream buffer into GridFS
      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);

      const uploadStream = bucket.openUploadStream(filename, {
        contentType: mimetype,
        metadata: { originalName: originalname, uploadedBy: req.user ? (req.user.id || req.user.sub || req.user._id) : undefined }
      });

      readable.pipe(uploadStream)
        .on('error', (uploadErr) => {
          return res.status(500).json({ success: false, message: 'Upload to storage failed', error: uploadErr.message });
        })
        .on('finish', async () => {
          try {
            const doc = new UploadedFile({
              originalName: originalname,
              filename: uploadStream.filename,
              gridFsId: uploadStream.id,
              size,
              mimeType: mimetype,
              uploadedBy: req.user ? (req.user.id || req.user.sub || req.user._id) : undefined
            });
            const saved = await doc.save();
            return res.status(201).json({
              success: true,
              message: 'File uploaded to GridFS',
              data: {
                id: saved._id,
                fileId: uploadStream.id,
                filename: uploadStream.filename,
                originalName: saved.originalName,
                mimeType: saved.mimeType,
                size: saved.size,
                uploadedAt: saved.uploadedAt
              }
            });
          } catch (dbErr) {
            // attempt to remove the file from GridFS if metadata save fails
            try { bucket.delete(uploadStream.id); } catch (e) { /* ignore */ }
            return res.status(500).json({ success: false, message: 'Failed to save file metadata', error: dbErr.message });
          }
        });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error during file upload', error: error.message });
    }
  });
};



const getAllFiles = async (req, res) => {
  try {
    const files = await UploadedFile.find().sort({ uploadedAt: -1 });
    if (!files.length) {
      return res.status(404).json({ success: false, message: 'No files found.' });
    }

    return res.status(200).json({
      success: true,
      count: files.length,
      data: files
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching files.',
      error: error.message
    });
  }
};


const downloadFile = async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);

    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });

    const files = await UploadedFile.findOne({ gridFsId: fileId });
    if (!files) {
      return res.status(404).json({ success: false, message: 'File not found.' });
    }

    res.set({
      'Content-Type': files.mimeType,
      'Content-Disposition': `attachment; filename="${files.originalName}"`
    });

    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on('error', (err) => {
      res.status(500).json({ success: false, message: 'Error downloading file', error: err.message });
    });

    downloadStream.pipe(res);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during download',
      error: error.message
    });
  }
};


module.exports = {
  uploadFile,
  getAllFiles,
  downloadFile
};

