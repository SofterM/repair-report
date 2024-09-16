const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const streamifier = require('streamifier');

// อัปโหลดไฟล์ไปยัง Cloudinary
function uploadToCloudinary(req) {
  return new Promise((resolve, reject) => {
    let stream = req.cloudinary.uploader.upload_stream(
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
}

// Get a specific report
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report', error: error.message });
  }
});

// Update report (for EditReportForm)
router.patch('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('Updating report:', req.params.id);
    console.log('Request body:', req.body);
    console.log('File:', req.file);

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if the user is the owner of the report or an admin
    if (report.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to edit this report' });
    }

    const updateData = { ...req.body };

    // Handle image update
    if (req.file) {
      // Upload new image to Cloudinary
      const result = await uploadToCloudinary(req);
      updateData.imagePath = result.secure_url;

      // Delete old image from Cloudinary if it exists
      if (report.imagePath) {
        const publicId = report.imagePath.split('/').pop().split('.')[0];
        await req.cloudinary.uploader.destroy(publicId);
        console.log('Old image deleted successfully from Cloudinary');
      }
    }

    console.log('Update data:', updateData);

    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found after update' });
    }

    console.log('Updated report:', updatedReport);

    req.io.emit('updateReport', updatedReport);
    res.json(updatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(400).json({ message: 'Error updating report', error: error.message, stack: error.stack });
  }
});

// Create a new report with image upload
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('Received form data:', req.body);
    console.log('Received file:', req.file);

    const reportData = {
      ...req.body,
      createdBy: req.user._id
    };
    
    if (req.file) {
      const result = await uploadToCloudinary(req);
      reportData.imagePath = result.secure_url;
    }

    const report = new Report(reportData);
    await report.save();
    
    req.io.emit('newReport', report);
    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(400).json({ message: 'Error creating report', error: error.message });
  }
});

// Get all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
});

// Update report status (for admin)
router.patch('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status, note } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, note, updatedAt: Date.now() },
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    req.io.emit('updateReport', report);
    res.json(report);
  } catch (error) {
    res.status(400).json({ message: 'Error updating report', error: error.message });
  }
});

// Delete report
router.delete('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check if the user is the owner of the report or an admin
    if (report.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to delete this report' });
    }

    // Delete image from Cloudinary if it exists
    if (report.imagePath) {
      const publicId = report.imagePath.split('/').pop().split('.')[0];
      await req.cloudinary.uploader.destroy(publicId);
    }

    await Report.findByIdAndDelete(req.params.id);
    req.io.emit('deleteReport', req.params.id);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting report', error: error.message });
  }
});

module.exports = router;