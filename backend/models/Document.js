import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Document title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  filename: {
    type: String,
    required: true
  },
  filepath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileBuffer: {
    type: Buffer,
    required: false // Optional - only for memory storage
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publicationSites: [{
    name: String,
    url: String,
    status: {
      type: String,
      enum: ['pending', 'submitted', 'accepted', 'rejected'],
      default: 'pending'
    },
    submissionId: String,
    submittedAt: Date,
    responseAt: Date
  }],
  uploadDate: {
    type: Date,
    default: Date.now
  },
  processedDate: {
    type: Date
  },
  errorMessage: {
    type: String
  },
  authors: [{
    name: { type: String, default: 'Unknown Author' },
    email: { type: String, default: '' },
    affiliation: { type: String, default: '' }
  }],
  metadata: {
    uploadedBy: String,
    uploadedAt: Date,
    processingStartedAt: Date,
    processingCompletedAt: Date,
    s3Uri: String,
    isTestFlow: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Index for better query performance
documentSchema.index({ userId: 1, uploadDate: -1 });
documentSchema.index({ status: 1 });

const Document = mongoose.model('Document', documentSchema);

export default Document;
