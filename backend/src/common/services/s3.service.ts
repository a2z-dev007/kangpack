import { R2Service } from "./r2.service";

/**
 * Storage Service powered by Cloudflare R2 Object Storage.
 * Retains S3Service alias for complete backwards compatibility across the backend.
 */
export class S3Service extends R2Service {}

export { R2Service };
export default R2Service;
