'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { ActionState } from '@/types';

const CategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color').default('#6366f1'),
});

// ─────────────────────────────────────────────
// CREATE CATEGORY
// ─────────────────────────────────────────────

export async function createCategory(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { message: 'Not authenticated' };

  const validated = CategorySchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    color: formData.get('color') || '#6366f1',
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Validation failed.' };
  }

  try {
    const category = await prisma.category.create({
      data: { userId: session.user.id, ...validated.data },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: 'CREATE',
      target: 'CATEGORY',
      targetId: category.id,
      summary: `Created category "${category.name}"`,
    });

    revalidatePath('/categories');
    revalidatePath('/inventory');
    return { success: true, message: 'Category created.' };
  } catch (error) {
    console.error('createCategory:', error);
    return { message: 'Database error: Failed to create category.' };
  }
}

// ─────────────────────────────────────────────
// UPDATE CATEGORY
// ─────────────────────────────────────────────

export async function updateCategory(
  id: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { message: 'Not authenticated' };

  const validated = CategorySchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    color: formData.get('color') || '#6366f1',
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Validation failed.' };
  }

  try {
    const category = await prisma.category.update({
      where: { id, userId: session.user.id },
      data: validated.data,
    });

    await writeAuditLog({
      userId: session.user.id,
      action: 'UPDATE',
      target: 'CATEGORY',
      targetId: id,
      summary: `Updated category "${category.name}"`,
    });

    revalidatePath('/categories');
    revalidatePath('/inventory');
    return { success: true, message: 'Category updated.' };
  } catch (error) {
    console.error('updateCategory:', error);
    return { message: 'Database error: Failed to update category.' };
  }
}

// ─────────────────────────────────────────────
// DELETE CATEGORY
// ─────────────────────────────────────────────

export async function deleteCategory(id: string): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { message: 'Not authenticated' };

  try {
    const category = await prisma.category.findUnique({ where: { id, userId: session.user.id } });
    if (!category) return { message: 'Category not found.' };

    await prisma.category.delete({ where: { id } });

    await writeAuditLog({
      userId: session.user.id,
      action: 'DELETE',
      target: 'CATEGORY',
      targetId: id,
      summary: `Deleted category "${category.name}"`,
    });

    revalidatePath('/categories');
    revalidatePath('/inventory');
    return { success: true, message: 'Category deleted.' };
  } catch (error) {
    console.error('deleteCategory:', error);
    return { message: 'Database error: Failed to delete category.' };
  }
}

// ─────────────────────────────────────────────
// GET CATEGORIES
// ─────────────────────────────────────────────

export async function getCategories() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.category.findMany({
    where: { userId: session.user.id },
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
}
