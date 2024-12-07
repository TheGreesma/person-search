// app/actions.ts
'use server'

import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma'; // Use the externalized Prisma client
import { User, userSchema } from './schemas';

export async function searchUsers(query: string): Promise<User[]> {
  console.log('Searching users with query:', query);
  const users = await prisma.user.findMany({
    where: {
      name: {
        startsWith: query,
        mode: 'insensitive',
      },
    },
  });
  return users;
}

export async function addUser(data: Omit<User, 'id'>): Promise<User> {
  const validatedUser = userSchema.omit({ id: true }).parse(data);
  const newUser = await prisma.user.create({
    data: validatedUser,
  });
  return newUser;
}

export async function editUser(updatedUser: User): Promise<User> {
  const validatedUser = userSchema.parse(updatedUser);
  const existingUser = await prisma.user.findUnique({ where: { id: validatedUser.id } });

  if (!existingUser) {
    throw new Error('User not found');
  }

  const updated = await prisma.user.update({
    where: { id: validatedUser.id },
    data: validatedUser,
  });
  return updated;
}
