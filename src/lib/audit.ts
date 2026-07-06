import { prisma } from '@/lib/prisma';
import { AuditAction, AuditTarget } from '@prisma/client';

/**
 * Write an audit log entry. Designed to be called inside server actions.
 * This function never throws — failures are silently logged.
 */
export async function writeAuditLog(params: {
  userId: string;
  action: AuditAction;
  target: AuditTarget;
  targetId: string;
  summary: string;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        target: params.target,
        targetId: params.targetId,
        summary: params.summary,
      },
    });
  } catch (err) {
    console.error('[audit] Failed to write audit log:', err);
  }
}
