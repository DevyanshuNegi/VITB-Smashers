import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { verifyPaymentSignature } from "~/lib/razorpay";
import { grantFolderAccess } from "~/lib/google-drive";

export const productRouter = createTRPCRouter({
    // Get all products with pagination and filters
    getAll: publicProcedure
        .input(
            z.object({
                page: z.number().min(1).default(1),
                limit: z.number().min(1).max(100).default(12),
                batchId: z.string().optional(),
                branchId: z.string().optional(),
                semesterId: z.string().optional(),
                typeId: z.string().optional(),
                search: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { page, limit, batchId, branchId, semesterId, typeId, search } = input;
            const skip = (page - 1) * limit;

            const where = {
                isActive: true,
                ...(batchId && { batchId }),
                ...(branchId && { branchId }),
                ...(semesterId && { semesterId }),
                ...(typeId && { typeId }),
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' as const } },
                        { description: { contains: search, mode: 'insensitive' as const } },
                    ],
                }),
            };

            const [products, totalCount] = await Promise.all([
                ctx.db.product.findMany({
                    where,
                    include: {
                        batch: true,
                        branch: true,
                        semester: true,
                        type: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: limit,
                }),
                ctx.db.product.count({ where }),
            ]);

            return {
                products,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
            };
        }),

    // Get single product by ID
    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const product = await ctx.db.product.findUnique({
                where: { id: input.id, isActive: true },
                include: {
                    batch: true,
                    branch: true,
                    semester: true,
                    type: true,
                },
            });

            if (!product) {
                throw new Error("Product not found");
            }

            return product;
        }),

    // Get user's purchased products
    getUserPurchases: protectedProcedure.query(async ({ ctx }) => {
        const purchases = await ctx.db.purchase.findMany({
            where: { userId: ctx.session.user.id },
            include: {
                product: {
                    include: {
                        batch: true,
                        branch: true,
                        semester: true,
                        type: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return purchases;
    }),

    // Check if user has purchased a product
    hasPurchased: protectedProcedure
        .input(z.object({ productId: z.string() }))
        .query(async ({ ctx, input }) => {
            const purchase = await ctx.db.purchase.findFirst({
                where: {
                    userId: ctx.session.user.id,
                    productId: input.productId,
                    status: 'SUCCESS',
                },
            });

            return !!purchase;
        }),

    // Create purchase (this would integrate with payment gateway)
    createPurchase: protectedProcedure
        .input(
            z.object({
                productId: z.string(),
                paymentGatewayId: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // First check if user already purchased this product
            const existingPurchase = await ctx.db.purchase.findFirst({
                where: {
                    userId: ctx.session.user.id,
                    productId: input.productId,
                    status: 'SUCCESS',
                },
            });

            if (existingPurchase) {
                throw new Error("You have already purchased this product");
            }

            // Get product to get the price
            const product = await ctx.db.product.findUnique({
                where: { id: input.productId },
            });

            if (!product?.isActive) {
                throw new Error("Product not found or not available");
            }

            // Create purchase record
            const purchase = await ctx.db.purchase.create({
                data: {
                    userId: ctx.session.user.id,
                    productId: input.productId,
                    amountPaid: product.price,
                    paymentGatewayId: input.paymentGatewayId,
                    status: input.paymentGatewayId ? 'SUCCESS' : 'PENDING',
                },
                include: {
                    product: true,
                },
            });

            return purchase;
        }),

    // Verify and complete Razorpay payment
    verifyRazorpayPayment: protectedProcedure
        .input(
            z.object({
                productId: z.string(),
                razorpayOrderId: z.string(),
                razorpayPaymentId: z.string(),
                razorpaySignature: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Get product to get the price
            const product = await ctx.db.product.findUnique({
                where: { id: input.productId },
            });

            if (!product?.isActive) {
                throw new Error("Product not found or not available");
            }

            // Check if user already purchased this product
            const existingPurchase = await ctx.db.purchase.findFirst({
                where: {
                    userId: ctx.session.user.id,
                    productId: input.productId,
                    status: 'SUCCESS',
                },
            });

            if (existingPurchase) {
                throw new Error("You have already purchased this product");
            }

            // Create or update purchase record with Razorpay details
            const purchase = await ctx.db.purchase.create({
                data: {
                    userId: ctx.session.user.id,
                    productId: input.productId,
                    amountPaid: product.price,
                    paymentGatewayId: input.razorpayPaymentId,
                    status: 'SUCCESS',
                },
                include: {
                    product: {
                        include: {
                            batch: true,
                            branch: true,
                            semester: true,
                            type: true,
                        },
                    },
                },
            });

            // Grant Google Drive folder access to the user
            if (product.googleDriveFolderId && ctx.session.user.email) {
                try {
                    await grantFolderAccess(product.googleDriveFolderId, ctx.session.user.email);
                } catch (error) {
                    console.error('Failed to grant Google Drive access:', error);
                    // Don't fail the purchase if Drive access fails
                }
            }

            return purchase;
        }),
});
