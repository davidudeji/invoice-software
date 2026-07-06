'use server';

import { auth } from '@/auth';
import { getUploadPresignedUrl, isR2Configured } from '@/lib/r2';
import { z } from 'zod';
import type { ActionState } from '@/types';

const UploadSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().regex(/^image\/(jpeg|jpg|png|webp|gif)$/, 'Only image files are allowed'),
});

export async function getLogoUploadUrl(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState & { uploadUrl?: string; publicUrl?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { message: 'Not authenticated' };

  if (!isR2Configured()) {
    return { message: 'Cloud storage is not configured. Please set R2 environment variables.' };
  }

  const validated = UploadSchema.safeParse({
    fileName: formData.get('fileName'),
    contentType: formData.get('contentType'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Invalid file.' };
  }

  const ext = validated.data.fileName.split('.').pop();
  const key = `logos/${session.user.id}/logo-${Date.now()}.${ext}`;

  try {
    const { uploadUrl, publicUrl } = await getUploadPresignedUrl(key, validated.data.contentType);
    return { success: true, uploadUrl, publicUrl };
  } catch (error) {
    console.error('getLogoUploadUrl:', error);
    return { message: 'Failed to generate upload URL.' };
  }
}
