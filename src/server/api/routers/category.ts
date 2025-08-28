import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  // Get all batches
  getBatches: publicProcedure.query(async ({ ctx }) => {
    const batches = await ctx.db.batch.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    });
    return batches;
  }),

  // Get all branches
  getBranches: publicProcedure.query(async ({ ctx }) => {
    const branches = await ctx.db.branch.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    });
    return branches;
  }),

  // Get all semesters
  getSemesters: publicProcedure.query(async ({ ctx }) => {
    const semesters = await ctx.db.semester.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    });
    return semesters;
  }),

  // Get all types
  getTypes: publicProcedure.query(async ({ ctx }) => {
    const types = await ctx.db.type.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    });
    return types;
  }),

  // Get category by ID with products
  getBatchProducts: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const batch = await ctx.db.batch.findUnique({
        where: { id: input.id },
        include: {
          products: {
            where: { isActive: true },
            include: {
              branch: true,
              semester: true,
              type: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
      return batch;
    }),

  getBranchProducts: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const branch = await ctx.db.branch.findUnique({
        where: { id: input.id },
        include: {
          products: {
            where: { isActive: true },
            include: {
              batch: true,
              semester: true,
              type: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
      return branch;
    }),

  getSemesterProducts: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const semester = await ctx.db.semester.findUnique({
        where: { id: input.id },
        include: {
          products: {
            where: { isActive: true },
            include: {
              batch: true,
              branch: true,
              type: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
      return semester;
    }),

  getTypeProducts: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const type = await ctx.db.type.findUnique({
        where: { id: input.id },
        include: {
          products: {
            where: { isActive: true },
            include: {
              batch: true,
              branch: true,
              semester: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
      return type;
    }),
});
