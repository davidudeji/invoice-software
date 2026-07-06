'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import type { ActionState } from '@/types';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function registerUser(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validated = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Validation failed.',
    };
  }

  const { name, email, password } = validated.data;

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { message: 'An account with this email already exists.' };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Create default settings row automatically
        settings: {
          create: {
            businessName: name,
            currency: 'USD',
            dateFormat: 'MM/DD/YYYY',
            timezone: 'UTC',
            invoicePrefix: 'INV-',
          },
        },
      },
    });

    console.log(`[auth] New user registered: ${user.email}`);
  } catch (error) {
    console.error('registerUser:', error);
    return { message: 'Database error: Failed to create account.' };
  }

  redirect('/login?registered=1');
}
