import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// ─────────────────────────────────────────────
// R2 Client (Cloudflare, S3-compatible)
//
// NOTE: Cloudflare R2 is currently NOT in use.
// Stack: Vercel (frontend) · Render (backend) · NeonDB (PostgreSQL)
//
// All functions below are guarded by isR2Configured().
// If env vars are absent they return null / throw a descriptive error
// so the app keeps running without file upload support.
// Uncomment the env vars in .env to re-enable.
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// Check if R2 is configured
// ─────────────────────────────────────────────

export function isR2Configured(): boolean {
  return !!(
    process.env.CLOUDFLARE_R2_ENDPOINT &&
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
    process.env.CLOUDFLARE_R2_BUCKET_NAME
  );
}

// Lazily instantiate the client only when configured
function getR2Client(): S3Client {
  if (!isR2Configured()) {
    throw new Error(
      '[R2] Cloudflare R2 is not configured. Set CLOUDFLARE_R2_* env vars to enable file storage.'
    );
  }
  return new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    },
  });
}

const BUCKET = process.env.CLOUDFLARE_R2_BUCKET_NAME ?? '';
const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? '';

// ─────────────────────────────────────────────
// Upload a buffer directly to R2
// Returns null when R2 is not configured.
// ─────────────────────────────────────────────

export async function uploadFileToR2(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string | null> {
  if (!isR2Configured()) return null;

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `${PUBLIC_URL}/${key}`;
}

// ─────────────────────────────────────────────
// Generate a presigned URL for client-side uploads
// Returns null when R2 is not configured.
// ─────────────────────────────────────────────

export async function getUploadPresignedUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 300
): Promise<{ uploadUrl: string; publicUrl: string } | null> {
  if (!isR2Configured()) return null;

  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
  const publicUrl = `${PUBLIC_URL}/${key}`;

  return { uploadUrl, publicUrl };
}

// Suppress unused-import lint warning — GetObjectCommand reserved for future download support
export type { GetObjectCommand };
