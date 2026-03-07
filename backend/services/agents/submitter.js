import {
  BedrockAgentRuntimeClient,
  InvokeFlowCommand,
} from '@aws-sdk/client-bedrock-agent-runtime';
import { readFile } from 'fs/promises';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Submission Agent Service
 * Handles document submission to publication sites using AWS Bedrock Flows (InvokeFlow API)
 */

class SubmitterAgent {
  constructor() {
    // Initialize Bedrock Agent Runtime client
    this.client = new BedrockAgentRuntimeClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        ...(process.env.AWS_SESSION_TOKEN && { sessionToken: process.env.AWS_SESSION_TOKEN })
      }
    });

    this.flowId = process.env.BEDROCK_FLOW_ID;
    this.flowAliasId = process.env.BEDROCK_FLOW_ALIAS_ID;
    this.enableTrace = process.env.BEDROCK_ENABLE_TRACE === 'true';
  }

  /**
   * Submit document to publication sites using Bedrock Flow
   * @param {Buffer|string} documentSource - Buffer containing file data or path to the PDF file
   * @param {Array} publicationSites - List of publication sites
   * @param {Object} metadata - Document metadata (title, description, etc.)
   * @returns {Promise<Object>} Submission result
   */
  async submitDocument(documentSource, publicationSites, metadata = {}) {
    const executionId = randomUUID();

    try {
      console.log('[Submitter Agent] Starting document submission via Bedrock Flow...');
      console.log(`[Submitter Agent] Publication Sites: ${publicationSites.map(s => s.name).join(', ')}`);

      // Handle both Buffer (memory storage) and file path (disk storage)
      let documentRef = null;
      try {
        let fileBuffer;
        if (Buffer.isBuffer(documentSource)) {
          // Memory storage - use buffer directly
          fileBuffer = documentSource;
          console.log(`[Submitter Agent] PDF loaded from memory (${fileBuffer.length} bytes)`);
        } else {
          // Disk storage - read from file path
          fileBuffer = await readFile(documentSource);
          console.log(`[Submitter Agent] PDF file loaded from disk (${fileBuffer.length} bytes)`);
        }
        // Use the document path/reference for the flow payload
        // If a string path was provided, use it directly; otherwise use metadata or a generated reference
        documentRef = typeof documentSource === 'string'
          ? documentSource
          : (metadata.s3Uri || `document-${executionId}.pdf`);
      } catch (error) {
        console.error('[Submitter Agent] Error reading PDF:', error);
        throw new Error(`Failed to read PDF: ${error.message}`);
      }

      // Build the flow payload in the required format:
      // { "document": "s3://bucket/file.pdf", "publications": ["SiteA", "SiteB"] }
      const flowPayload = {
        document: documentRef,
        publications: publicationSites.map(s => s.name),
      };

      // Invoke the Bedrock Flow
      console.log('[Submitter Agent] Invoking Bedrock Flow...');
      console.log('[Submitter Agent] Flow payload:', JSON.stringify(flowPayload));
      const response = await this.invokeFlow(flowPayload, executionId);

      console.log('[Submitter Agent] Submission completed successfully');

      return {
        success: true,
        executionId,
        response,
        submittedSites: publicationSites.map(site => ({
          name: site.name,
          url: site.url,
          status: 'submitted',
          submissionId: `SUB-${Date.now()}-${randomUUID().substring(0, 8)}`
        }))
      };

    } catch (error) {
      console.error('[Submitter Agent] Submission failed:', error);
      return {
        success: false,
        error: error.message,
        executionId
      };
    }
  }

  /**
   * Build the flow input payload
   * @param {Object} payload - The payload object { document, publications }
   * @returns {Array} FlowInput array for the InvokeFlowCommand
   */
  buildFlowInputs(payload) {
    return [
      {
        nodeName: 'FlowInputNode',
        nodeInputName: 'document',
        content: {
          document: JSON.stringify(payload),
        },
      },
    ];
  }

  /**
   * Invoke the Bedrock Flow with the given payload
   * @param {Object} payload - The payload { document, publications }
   * @param {string} executionId - Execution ID for tracking
   * @returns {Promise<Object>} Flow response
   */
  async invokeFlow(payload, executionId) {
    const inputs = this.buildFlowInputs(payload);

    const command = new InvokeFlowCommand({
      flowIdentifier: this.flowId,
      flowAliasIdentifier: this.flowAliasId,
      executionId,
      inputs,
      enableTrace: this.enableTrace,
    });

    try {
      const response = await this.client.send(command);
      let completion = '';
      const traces = [];
      let flowExecutionId = response.executionId || executionId;

      // Process the streaming response
      for await (const event of response.responseStream) {
        // Collect flow output
        if (event.flowOutputEvent) {
          const outputContent = event.flowOutputEvent.content;
          if (outputContent?.document) {
            completion += typeof outputContent.document === 'string'
              ? outputContent.document
              : JSON.stringify(outputContent.document);
          }
          console.log(`[Submitter Agent] Flow output from node: ${event.flowOutputEvent.nodeName}`);
        }

        // Detect flow completion
        if (event.flowCompletionEvent) {
          console.log(`[Submitter Agent] Flow completed. Reason: ${event.flowCompletionEvent.completionReason}`);
        }

        // Handle multi-turn input request (if the flow requires additional input)
        if (event.flowMultiTurnInputRequestEvent) {
          console.log(`[Submitter Agent] Flow requesting additional input from node: ${event.flowMultiTurnInputRequestEvent.nodeName}`);
          // For now, log and continue — multi-turn handling can be extended later
        }

        // Collect trace output
        if (event.flowTraceEvent && this.enableTrace) {
          const trace = event.flowTraceEvent.trace;
          traces.push(trace);
          console.log('[Trace]', JSON.stringify(trace, null, 2));
        }
      }

      console.log(`[Submitter Agent] Flow response received (${completion.length} characters)`);

      return {
        completion,
        executionId: flowExecutionId,
        traces: this.enableTrace ? traces : []
      };

    } catch (error) {
      console.error('[Submitter Agent] Error invoking flow:', error);
      throw new Error(`Flow invocation failed: ${error.message}`);
    }
  }

  /**
   * Validate document before submission
   * @param {string} documentPath - Path to the document
   * @returns {Promise<Object>} Validation result
   */
  async validateDocument(documentPath) {
    try {
      const fileBuffer = await readFile(documentPath);

      // Basic validation
      const validations = {
        exists: true,
        size: fileBuffer.length,
        sizeValid: fileBuffer.length > 0 && fileBuffer.length <= 10 * 1024 * 1024, // Max 10MB
        isPDF: documentPath.toLowerCase().endsWith('.pdf'),
      };

      return {
        valid: validations.sizeValid && validations.isPDF,
        validations
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Get submission status by re-invoking the flow with a status query
   * @param {string} executionId - Execution ID
   * @param {string} submissionId - Submission ID
   * @returns {Promise<Object>} Status information
   */
  async getSubmissionStatus(executionId, submissionId) {
    const statusPayload = {
      document: `status-check:${submissionId}`,
      publications: [],
    };

    try {
      const response = await this.invokeFlow(statusPayload, executionId);
      return {
        success: true,
        status: response.completion,
        executionId,
        submissionId
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Health check for the Bedrock Flow
   * @returns {Promise<Object>} Health status
   */
  async healthCheck() {
    const executionId = randomUUID();
    const healthPayload = {
      document: 'health-check',
      publications: [],
    };

    try {
      const startTime = Date.now();
      const response = await this.invokeFlow(healthPayload, executionId);
      const responseTime = Date.now() - startTime;

      return {
        healthy: true,
        flowId: this.flowId,
        flowAliasId: this.flowAliasId,
        responseTime: `${responseTime}ms`,
        response: response.completion
      };
    } catch (error) {
      return {
        healthy: false,
        flowId: this.flowId,
        flowAliasId: this.flowAliasId,
        error: error.message
      };
    }
  }

  /**
   * Test the flow with a default OJS publication site
   * This is a convenience method for quick testing
   * @param {string} documentRef - Document reference (e.g. S3 URI)
   * @returns {Promise<Object>} Test result
   */
  async testFlow(documentRef = 's3://test-bucket/test-manuscript.pdf') {
    const defaultPublications = [
      {
        name: 'Open Journal Systems (OJS)',
        url: 'https://pkp.sfu.ca/software/ojs/',
      },
    ];

    console.log('[Submitter Agent] Running test flow with OJS default publication...');

    const result = await this.submitDocument(
      documentRef,
      defaultPublications,
      {
        title: 'Test Manuscript',
        description: 'Test submission via Bedrock Flow',
        fileType: 'application/pdf',
        s3Uri: documentRef,
      }
    );

    return result;
  }
}

// Export singleton instance
const submitterAgent = new SubmitterAgent();
export default submitterAgent;
