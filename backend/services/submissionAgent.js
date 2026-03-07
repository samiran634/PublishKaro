import Document from '../models/Document.js';
import submitterAgent from './agents/submitter.js';
import s3Uploader from './s3Uploader.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pdfParse;
try { pdfParse = require('pdf-parse'); } catch { pdfParse = null; }

/**
 * Submission Agent Service
 * Handles document processing and submission to publication sites
 */

class SubmissionAgent {
  constructor() {
    this.processingQueue = new Map();
  }

  /**
   * Process a document and submit to publication sites
   * @param {string} documentId - Document ID
   * @param {Buffer} fileBuffer - File buffer from memory storage
   * @param {Array} publicationSites - List of publication sites
   */
  async processDocument(documentId, fileBuffer, publicationSites = []) {
    try {
      const document = await Document.findById(documentId);

      if (!document) {
        throw new Error('Document not found');
      }

      // Update status to processing
      document.status = 'processing';
      document.progress = 10;
      document.metadata.processingStartedAt = new Date();
      await document.save();

      console.log(`[Submission Agent] Processing document: ${document.title}`);

      // Stage 1: Validate document (20%)
      await this.validateDocument(document, fileBuffer);
      document.progress = 30;
      await document.save();

      // Stage 2: Upload to S3 (30% → 40%)
      let s3Uri = null;
      if (fileBuffer) {
        try {
          const s3Result = await s3Uploader.upload(
            fileBuffer,
            document.filename,
            document.fileType
          );
          s3Uri = s3Result.s3Uri;
          document.metadata.s3Uri = s3Uri;
          console.log(`[Submission Agent] Document uploaded to S3: ${s3Uri}`);
        } catch (s3Err) {
          console.error('[Submission Agent] S3 upload failed:', s3Err.message);
          throw new Error(`S3 upload failed: ${s3Err.message}`);
        }
      }
      document.progress = 40;
      await document.save();

      // Stage 3: Extract metadata (40% → 50%)
      await this.extractMetadata(document);
      document.progress = 50;
      await document.save();

      // Stage 4: Submit to publication sites using Bedrock Flow (50% → 90%)
      if (publicationSites && publicationSites.length > 0) {
        await this.submitToPublicationsWithBedrock(document, s3Uri, publicationSites);
      }
      document.progress = 90;
      await document.save();

      // Stage 4: Finalize (10%)
      document.status = 'completed';
      document.progress = 100;
      document.processedDate = new Date();
      document.metadata.processingCompletedAt = new Date();
      await document.save();

      console.log(`[Submission Agent] Document processed successfully: ${document.title}`);

      return {
        success: true,
        documentId: document._id,
        status: document.status
      };

    } catch (error) {
      console.error('[Submission Agent] Error processing document:', error);

      // Update document with error
      try {
        const document = await Document.findById(documentId);
        if (document) {
          document.status = 'failed';
          document.errorMessage = error.message;
          await document.save();
        }
      } catch (updateError) {
        console.error('[Submission Agent] Error updating document status:', updateError);
      }

      throw error;
    }
  }

  /**
   * Validate document format and content
   * @param {Object} document - Document object
   * @param {Buffer} fileBuffer - File buffer
   */
  async validateDocument(document, fileBuffer) {
    console.log(`[Submission Agent] Validating document: ${document.filename}`);

    // Simulate validation delay
    await this.delay(1000);

    // Check file type
    const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'];

    if (!allowedTypes.includes(document.fileType)) {
      throw new Error('Invalid file type');
    }

    // Check file size (max 10MB)
    if (document.fileSize > 10 * 1024 * 1024) {
      throw new Error('File size exceeds maximum limit');
    }

    // Validate buffer if provided
    if (fileBuffer && !Buffer.isBuffer(fileBuffer)) {
      throw new Error('Invalid file buffer');
    }

    console.log(`[Submission Agent] Document validated successfully`);
  }

  /**
   * Extract metadata from document
   * @param {Object} document - Document object
   */
  async extractMetadata(document) {
    console.log(`[Submission Agent] Extracting metadata from: ${document.filename}`);

    // Only attempt PDF parsing if we have pdf-parse and a stored buffer
    if (pdfParse && document.fileBuffer && document.fileType === 'application/pdf') {
      try {
        const data = await pdfParse(document.fileBuffer);
        const text = data.text || '';
        const authors = this._parseAuthors(text);
        if (authors.length > 0) {
          document.authors = authors;
          console.log(`[Submission Agent] Extracted ${authors.length} author(s):`, authors.map(a => a.name));
        }
      } catch (parseErr) {
        console.warn('[Submission Agent] PDF parse warning (non-fatal):', parseErr.message);
      }
    } else {
      await this.delay(800); // slight delay for non-PDF flow
    }

    console.log(`[Submission Agent] Metadata extracted successfully`);
  }

  /**
   * Heuristically extract author names from raw PDF text.
   * Looks for Author / By / line patterns within the first 3 000 chars.
   */
  _parseAuthors(text) {
    const snippet = text.slice(0, 3000);
    const authors = [];

    // Pattern 1: "Authors?: Name, Name and Name"
    const authorLine = snippet.match(/[Aa]uthors?[:\s]+([^\n]{4,120})/);
    if (authorLine) {
      authorLine[1].split(/,|\band\b/i).forEach(part => {
        const name = part.trim().replace(/[^a-zA-Z .\-']/g, '').trim();
        if (name.length > 2 && name.split(' ').length >= 2) {
          authors.push({ name, email: '', affiliation: '' });
        }
      });
    }

    // Pattern 2: lines that look like "Firstname Lastname1,2" (common in IEEE/ACM PDFs)
    if (authors.length === 0) {
      const lines = snippet.split('\n');
      for (const line of lines.slice(2, 30)) {
        const clean = line.trim().replace(/[\d,*†‡§]+/g, '').trim();
        if (/^[A-Z][a-z]+ [A-Z][a-z]+/.test(clean) && clean.length < 60) {
          authors.push({ name: clean, email: '', affiliation: '' });
          if (authors.length >= 8) break;
        }
      }
    }

    return authors;
  }

  /**
   * Submit document to publication sites using AWS Bedrock Flow
   * @param {Object} document - Document object
   * @param {string|null} s3Uri - S3 URI of the uploaded document
   * @param {Array} publicationSites - List of publication sites
   */
  async submitToPublicationsWithBedrock(document, s3Uri, publicationSites) {
    console.log(`[Submission Agent] Submitting to ${publicationSites.length} publication site(s) using Bedrock Flow`);

    try {
      // Prepare metadata for the agent
      const metadata = {
        title: document.title,
        description: document.description,
        fileType: document.fileType,
        fileSize: document.fileSize,
        uploadedBy: document.metadata?.uploadedBy,
        s3Uri: s3Uri,
      };

      if (!s3Uri) {
        throw new Error('S3 URI not available — document must be uploaded to S3 first');
      }

      // Call the Bedrock submitter with the S3 URI
      const result = await submitterAgent.submitDocument(
        s3Uri,
        publicationSites,
        metadata
      );

      if (result.success) {
        console.log('[Submission Agent] Bedrock agent submission successful');

        // Update publication sites with submission results
        for (const submittedSite of result.submittedSites) {
          const siteIndex = document.publicationSites.findIndex(
            s => s.name === submittedSite.name
          );

          if (siteIndex !== -1) {
            document.publicationSites[siteIndex].status = submittedSite.status;
            document.publicationSites[siteIndex].submittedAt = new Date();
            document.publicationSites[siteIndex].submissionId = submittedSite.submissionId;
          } else {
            document.publicationSites.push({
              name: submittedSite.name,
              url: submittedSite.url,
              status: submittedSite.status,
              submittedAt: new Date(),
              submissionId: submittedSite.submissionId
            });
          }
        }

        await document.save();
        console.log('[Submission Agent] Document updated with submission results');
      } else {
        throw new Error(result.error || 'Bedrock agent submission failed');
      }

    } catch (error) {
      console.error('[Submission Agent] Bedrock submission error:', error);

      // Mark all sites as failed
      for (const site of publicationSites) {
        const siteIndex = document.publicationSites.findIndex(s => s.name === site.name);
        if (siteIndex !== -1) {
          document.publicationSites[siteIndex].status = 'rejected';
          document.publicationSites[siteIndex].responseAt = new Date();
        }
      }
      await document.save();

      throw error;
    }
  }

  /**
   * Get available publication sites
   */
  getAvailablePublicationSites() {
    return [
      {
        id: 'arxiv',
        name: 'arXiv',
        url: 'https://arxiv.org',
        description: 'Open-access archive for scholarly articles',
        categories: ['Physics', 'Mathematics', 'Computer Science', 'Biology']
      },
      {
        id: 'biorxiv',
        name: 'bioRxiv',
        url: 'https://www.biorxiv.org',
        description: 'Preprint server for biology',
        categories: ['Biology', 'Life Sciences']
      },
      {
        id: 'medrxiv',
        name: 'medRxiv',
        url: 'https://www.medrxiv.org',
        description: 'Preprint server for health sciences',
        categories: ['Medicine', 'Health Sciences']
      },
      {
        id: 'ssrn',
        name: 'SSRN',
        url: 'https://www.ssrn.com',
        description: 'Social Science Research Network',
        categories: ['Social Sciences', 'Economics', 'Law']
      },
      {
        id: 'researchgate',
        name: 'ResearchGate',
        url: 'https://www.researchgate.net',
        description: 'Social networking site for scientists and researchers',
        categories: ['All Disciplines']
      },
      {
        id: 'ojs-testdrive',
        name: 'OJS Testdrive (Demo)',
        url: 'https://demo.publicknowledgeproject.org/ojs3/testdrive/index.php/testdrive-journal',
        description: 'Open Journal Systems demo instance — safe for integration testing',
        categories: ['All Disciplines']
      }
    ];
  }

  /**
   * Utility function to simulate async delay
   * @param {number} ms - Milliseconds to delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
const submissionAgent = new SubmissionAgent();
export default submissionAgent;
