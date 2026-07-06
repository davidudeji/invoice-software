'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import type { ActionState } from '@/types';

const ProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  sku: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  stockQuantity: z.coerce.number().int().min(0, 'Stock must be non-negative').default(0),
  categoryId: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

// ─────────────────────────────────────────────
// CREATE PRODUCT
// ─────────────────────────────────────────────

export async function createProduct(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { message: 'Not authenticated' };

  const validated = ProductSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    sku: formData.get('sku'),
    price: formData.get('price'),
    stockQuantity: formData.get('stockQuantity'),
    categoryId: formData.get('categoryId') || undefined,
    imageUrl: formData.get('imageUrl') || undefined,
    isActive: formData.get('isActive') !== 'false',
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Validation failed.' };
  }

  try {
    const product = await prisma.product.create({
      data: { userId: session.user.id, ...validated.data },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: 'CREATE',
      target: 'PRODUCT',
      targetId: product.id,
      summary: `Created product "${product.name}" (SKU: ${product.sku || 'N/A'}) at price ${product.price}`,
    });
  } catch (error) {
    console.error('createProduct:', error);
    return { message: 'Database error: Failed to create product.' };
  }

  revalidatePath('/inventory');
  redirect('/inventory');
}

// ─────────────────────────────────────────────
// UPDATE PRODUCT
// ─────────────────────────────────────────────

export async function updateProduct(
  id: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { message: 'Not authenticated' };

  const validated = ProductSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    sku: formData.get('sku'),
    price: formData.get('price'),
    stockQuantity: formData.get('stockQuantity'),
    categoryId: formData.get('categoryId') || undefined,
    imageUrl: formData.get('imageUrl') || undefined,
    isActive: formData.get('isActive') !== 'false',
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Validation failed.' };
  }

  try {
    const product = await prisma.product.update({
      where: { id, userId: session.user.id },
      data: validated.data,
    });

    await writeAuditLog({
      userId: session.user.id,
      action: 'UPDATE',
      target: 'PRODUCT',
      targetId: id,
      summary: `Updated product "${product.name}"`,
    });
  } catch (error) {
    console.error('updateProduct:', error);
    return { message: 'Database error: Failed to update product.' };
  }

  revalidatePath('/inventory');
  revalidatePath(`/inventory/${id}/edit`);
  redirect('/inventory');
}

// ─────────────────────────────────────────────
// DELETE PRODUCT
// ─────────────────────────────────────────────

export async function deleteProduct(id: string): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { message: 'Not authenticated' };

  try {
    const product = await prisma.product.findUnique({ where: { id, userId: session.user.id } });
    if (!product) return { message: 'Product not found.' };

    await prisma.product.delete({ where: { id } });

    await writeAuditLog({
      userId: session.user.id,
      action: 'DELETE',
      target: 'PRODUCT',
      targetId: id,
      summary: `Deleted product "${product.name}"`,
    });
  } catch (error) {
    console.error('deleteProduct:', error);
    return { message: 'Database error: Failed to delete product.' };
  }

  revalidatePath('/inventory');
  return { success: true, message: 'Product deleted.' };
}

// ─────────────────────────────────────────────
// GET PRODUCTS (with filters)
// ─────────────────────────────────────────────

export async function getProducts(filters?: {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.product.findMany({
    where: {
      userId: session.user.id,
      ...(filters?.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { sku: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
      ...(filters?.categoryId && { categoryId: filters.categoryId }),
      ...(filters?.minPrice !== undefined && { price: { gte: filters.minPrice } }),
      ...(filters?.maxPrice !== undefined && { price: { lte: filters.maxPrice } }),
      ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
}
