import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Document from '../models/Document.js';
import { authenticateToken } from '../middleware/auth.js';
import submissionAgent from '../services/submissionAgent.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for file uploads using memory storage to avoid permission issues
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.txt', '.ppt', '.pptx'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, TXT, and PPT files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @route   POST /upload
// @desc    Upload a document and initiate submission process
// @access  Private
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description, publicationSites } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Document title is required' });
    }

    // Parse publication sites if provided
    let sites = [];
    if (publicationSites) {
      try {
        sites = typeof publicationSites === 'string'
          ? JSON.parse(publicationSites)
          : publicationSites;
      } catch (error) {
        return res.status(400).json({ message: 'Invalid publication sites format' });
      }
    }

    // Create document record in database with file buffer
    const document = new Document({
      title: title.trim(),
      description: description?.trim(),
      filename: req.file.originalname,
      filepath: `memory://${req.file.originalname}`, // Virtual path for memory storage
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      fileBuffer: req.file.buffer, // Store buffer in MongoDB
      status: 'pending',
      userId: req.user._id,
      publicationSites: sites,
      metadata: {
        uploadedBy: req.user.email,
        uploadedAt: new Date()
      }
    });

    await document.save();

    // Trigger submission agent asynchronously
    if (sites && sites.length > 0) {
      // Process in background
      submissionAgent.processDocument(document._id.toString(), req.file.buffer, sites)
        .catch(error => {
          console.error('Submission agent error:', error);
        });
    } else {
      // Just simulate processing without submission
      setTimeout(async () => {
        try {
          document.status = 'processing';
          document.progress = 50;
          await document.save();

          setTimeout(async () => {
            document.progress = 100;
            document.status = 'completed';
            document.processedDate = new Date();
            await document.save();
          }, 3000);
        } catch (error) {
          console.error('Error updating document status:', error);
        }
      }, 1000);
    }

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully and queued for processing',
      document: {
        ...document.toObject(),
        fileBuffer: undefined // Don't send buffer back to client
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      message: 'Upload failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /documents
// @desc    Get all documents for authenticated user
// @access  Private
router.get('/documents', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    // Build query
    const query = { userId: req.user._id };
    if (status) {
      query.status = status;
    }

    // Execute query with pagination, excluding fileBuffer
    const documents = await Document.find(query)
      .select('-fileBuffer')
      .sort({ uploadDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Document.countDocuments(query);

    res.json({
      success: true,
      documents,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Documents retrieval error:', error);
    res.status(500).json({
      message: 'Failed to retrieve documents',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /documents/:id
// @desc    Get a specific document
// @access  Private
router.get('/documents/:id', authenticateToken, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).select('-fileBuffer');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      document
    });
  } catch (error) {
    console.error('Document retrieval error:', error);
    res.status(500).json({
      message: 'Failed to retrieve document',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /documents/:id
// @desc    Update document status or metadata
// @access  Private
router.put('/documents/:id', authenticateToken, async (req, res) => {
  try {
    const { status, progress, errorMessage } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (errorMessage) updateData.errorMessage = errorMessage;
    if (status === 'completed') updateData.processedDate = new Date();

    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      message: 'Document updated successfully',
      document
    });
  } catch (error) {
    console.error('Document update error:', error);
    res.status(500).json({
      message: 'Failed to update document',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /documents/:id
// @desc    Delete a document
// @access  Private
router.delete('/documents/:id', authenticateToken, async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // TODO: Delete physical file from filesystem
    // const fs = await import('fs/promises');
    // await fs.unlink(document.filepath);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Document deletion error:', error);
    res.status(500).json({
      message: 'Failed to delete document',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /documents/:id/retry
// @desc    Retry processing a failed document
// @access  Private
router.post('/documents/:id/retry', authenticateToken, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    if (document.status !== 'failed') {
      return res.status(400).json({
        success: false,
        message: 'Only failed documents can be retried'
      });
    }

    if (!document.fileBuffer) {
      return res.status(400).json({
        success: false,
        message: 'Document file buffer not found. Please re-upload the document.'
      });
    }

    // Reset document status
    document.status = 'pending';
    document.progress = 0;
    document.errorMessage = undefined;
    await document.save();

    // Trigger submission agent asynchronously
    const sites = document.publicationSites.map(site => ({
      name: site.name,
      url: site.url
    }));

    if (sites.length > 0) {
      submissionAgent.processDocument(document._id.toString(), document.fileBuffer, sites)
        .catch(error => {
          console.error('Retry submission agent error:', error);
        });
    } else {
      // Just simulate processing without submission
      setTimeout(async () => {
        try {
          document.status = 'processing';
          document.progress = 50;
          await document.save();

          setTimeout(async () => {
            document.progress = 100;
            document.status = 'completed';
            document.processedDate = new Date();
            await document.save();
          }, 3000);
        } catch (error) {
          console.error('Error updating document status:', error);
        }
      }, 1000);
    }

    res.json({
      success: true,
      message: 'Document retry initiated',
      document: {
        ...document.toObject(),
        fileBuffer: undefined
      }
    });
  } catch (error) {
    console.error('Document retry error:', error);
    res.status(500).json({
      message: 'Failed to retry document',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /publication-sites
// @desc    Get available publication sites
// @access  Private
router.get('/publication-sites', authenticateToken, async (req, res) => {
  try {
    const sites = submissionAgent.getAvailablePublicationSites();

    res.json({
      success: true,
      sites
    });
  } catch (error) {
    console.error('Publication sites retrieval error:', error);
    res.status(500).json({
      message: 'Failed to retrieve publication sites',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /test-flow
// @desc    Test the Bedrock Flow with OJS default publication (creates a mock document)
// @access  Private
router.post('/test-flow', authenticateToken, async (req, res) => {
  try {
    // Create a mock document entry for tracking
    const document = new Document({
      title: 'Test Flow – OJS Submission',
      description: 'Automated test using the Bedrock Flow with OJS default publication.',
      filename: 'test-manuscript.pdf',
      filepath: 'memory://test-manuscript.pdf',
      fileSize: 540,
      fileType: 'application/pdf',
      status: 'pending',
      progress: 0,
      userId: req.user._id,
      publicationSites: [
        {
          name: 'Open Journal Systems (OJS)',
          url: 'https://demo.publicknowledgeproject.org/ojs3/testdrive/index.php/testdrive-journal',
          status: 'pending',
        },
      ],
      metadata: {
        uploadedBy: req.user.email,
        uploadedAt: new Date(),
        isTestFlow: true,
      },
    });

    await document.save();

    // Simulate async processing through all stages so the frontend stepper can track
    (async () => {
      try {
        // Stage 1: Validate (10% → 30%)
        document.status = 'processing';
        document.progress = 10;
        await document.save();

        await new Promise(r => setTimeout(r, 2000));
        document.progress = 30;
        await document.save();

        // Stage 2: Extract Metadata (30% → 50%)
        await new Promise(r => setTimeout(r, 2000));
        document.progress = 50;
        await document.save();

        // Stage 3: Submit to Publications (50% → 90%)
        await new Promise(r => setTimeout(r, 3000));
        document.progress = 70;
        document.publicationSites[0].status = 'submitted';
        document.publicationSites[0].submittedAt = new Date();
        document.publicationSites[0].submissionId = `SUB-TEST-${Date.now()}`;
        document.markModified('publicationSites');
        await document.save();

        await new Promise(r => setTimeout(r, 2000));
        document.progress = 90;
        await document.save();

        // Stage 4: Finalize (90% → 100%)
        await new Promise(r => setTimeout(r, 1500));
        document.progress = 100;
        document.status = 'completed';
        document.processedDate = new Date();
        await document.save();

        console.log('[Test Flow] Completed successfully');
      } catch (err) {
        console.error('[Test Flow] Error during processing:', err);
        document.status = 'failed';
        document.errorMessage = err.message;
        await document.save();
      }
    })();

    res.status(201).json({
      success: true,
      message: 'Test flow started. Track progress in the tracking page.',
      document: {
        ...document.toObject(),
        fileBuffer: undefined,
      },
    });
  } catch (error) {
    console.error('Test flow error:', error);
    res.status(500).json({
      message: 'Failed to start test flow',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

export default router;
