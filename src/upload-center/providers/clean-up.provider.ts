import { Injectable } from '@nestjs/common';
import { UploadCenterService } from './upload-center.service';
import { Cron, CronExpression } from '@nestjs/schedule';

/**
 * Service for cleaning up pending uploads in the upload center.
 * This service runs periodically to remove files that have not been confirmed.
 */
@Injectable()
export class CleanUpProvider {
  /**
   * Initializes the clean-up provider.
   * Injects the UploadCenterService to access pending uploads.
   *
   * @param uploadCenterService - Service for managing file uploads.
   */
  constructor(private readonly uploadCenterService: UploadCenterService) {}

  /**
   * Cron job that runs every 12 hours to clean up pending uploads.
   * It checks for files that have not been confirmed and removes them.
   */
  @Cron(CronExpression.EVERY_12_HOURS)
  public async handleCron() {
    const pendingUploads = await this.uploadCenterService.pendingUploads();

    for (const fileObj of pendingUploads) {
      try {
        await this.uploadCenterService.removeUpload(fileObj.fileKey);
        console.info(`File ${fileObj.fileKey} has been cleaned up.`);
      } catch (err) {
        console.error(`Error processing file ${fileObj.id}:`, err);
      }
    }
  }
}
