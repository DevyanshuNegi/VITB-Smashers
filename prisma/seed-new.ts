import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    // Create Batches
    const batch24 = await prisma.batch.upsert({
        where: { name: "2024 Batch" },
        update: {},
        create: { name: "2024 Batch" },
    });

    const batch23 = await prisma.batch.upsert({
        where: { name: "2023 Batch" },
        update: {},
        create: { name: "2023 Batch" },
    });

    // Create Branches
    const csBranch = await prisma.branch.upsert({
        where: { name: "Computer Science" },
        update: {},
        create: { name: "Computer Science" },
    });

    const eceBranch = await prisma.branch.upsert({
        where: { name: "Electronics & Communication" },
        update: {},
        create: { name: "Electronics & Communication" },
    });

    const mechBranch = await prisma.branch.upsert({
        where: { name: "Mechanical Engineering" },
        update: {},
        create: { name: "Mechanical Engineering" },
    });

    // Create Semesters
    const sem1 = await prisma.semester.upsert({
        where: { name: "Semester 1" },
        update: {},
        create: { name: "Semester 1" },
    });

    const sem2 = await prisma.semester.upsert({
        where: { name: "Semester 2" },
        update: {},
        create: { name: "Semester 2" },
    });

    const sem3 = await prisma.semester.upsert({
        where: { name: "Semester 3" },
        update: {},
        create: { name: "Semester 3" },
    });

    const sem4 = await prisma.semester.upsert({
        where: { name: "Semester 4" },
        update: {},
        create: { name: "Semester 4" },
    });

    // Create Types
    const notesType = await prisma.type.upsert({
        where: { name: "Lecture Notes" },
        update: {},
        create: { name: "Lecture Notes" },
    });

    const assignmentType = await prisma.type.upsert({
        where: { name: "Assignments" },
        update: {},
        create: { name: "Assignments" },
    });

    const examType = await prisma.type.upsert({
        where: { name: "Previous Year Papers" },
        update: {},
        create: { name: "Previous Year Papers" },
    });

    const tutorialType = await prisma.type.upsert({
        where: { name: "Tutorials" },
        update: {},
        create: { name: "Tutorials" },
    });

    // Create sample products
    const products = [
        {
            name: "Data Structures and Algorithms - Complete Notes",
            description: "Comprehensive notes covering all data structures including arrays, linked lists, stacks, queues, trees, graphs, and various algorithms with examples and time complexity analysis.",
            price: 29999, // ₹299.99 in paisa
            googleDriveFolderId: "1O-o0PWMBWp45DAubgA0I_09NPc6vxY8h",
            batchId: batch24.id,
            branchId: csBranch.id,
            semesterId: sem3.id,
            typeId: notesType.id,
        },
        {
            name: "Object Oriented Programming Lab Assignments",
            description: "Complete set of OOP lab assignments with solutions in Java and C++. Includes practical implementations of inheritance, polymorphism, encapsulation, and abstraction.",
            price: 19999, // ₹199.99 in paisa
            googleDriveFolderId: "1GpFyEebUzHgfFdQjTydld9WlYWuobejQ",
            batchId: batch24.id,
            branchId: csBranch.id,
            semesterId: sem2.id,
        typeId: assignmentType.id,
        },
        {
            name: "Database Management Systems - Previous Year Papers",
            description: "Collection of previous year question papers for DBMS with detailed solutions. Covers SQL queries, normalization, transactions, and database design.",
            price: 24999, // ₹249.99 in paisa
            googleDriveFolderId: "1voOtapndf3T3LPPOTeZUpuTXy6S8b0sp",
            batchId: batch23.id,
            branchId: csBranch.id,
            semesterId: sem4.id,
            typeId: examType.id,
        },
        {
            name: "Digital Signal Processing Tutorial Solutions",
            description: "Step-by-step solutions to DSP tutorial problems including Fourier transforms, Z-transforms, filter design, and signal analysis with MATLAB code examples.",
            price: 34999, // ₹349.99 in paisa
            googleDriveFolderId: "1Ed5I4Wqun3HyoyiO8QcycYeNpeXF3VKQ",
            batchId: batch24.id,
            branchId: eceBranch.id,
            semesterId: sem4.id,
            typeId: tutorialType.id,
        },
        {
            name: "Microprocessor and Microcontroller Notes",
            description: "Detailed notes on 8085, 8086 microprocessors and 8051 microcontroller. Includes assembly language programming, interfacing concepts, and practical circuits.",
            price: 27999, // ₹279.99 in paisa
            googleDriveFolderId: "144WrjYgN32VnragawFKlPxkNNFttQeTt",
            batchId: batch24.id,
            branchId: eceBranch.id,
            semesterId: sem3.id,
            typeId: notesType.id,
        },
        {
            name: "Thermodynamics - Complete Study Material",
            description: "Comprehensive thermodynamics notes covering laws of thermodynamics, cycles, heat engines, refrigeration, and air conditioning with solved problems.",
            price: 32999, // ₹329.99 in paisa
            googleDriveFolderId: "1Nla9mMNgM4wcrhkJjjAoiKWIBiqZbhKS",
            batchId: batch24.id,
            branchId: mechBranch.id,
            semesterId: sem2.id,
            typeId: notesType.id,
        },
        {
            name: "Fluid Mechanics Lab Manual",
            description: "Complete lab manual for fluid mechanics experiments including flow measurement, pump characteristics, pipe friction, and flow visualization techniques.",
            price: 22999, // ₹229.99 in paisa
            googleDriveFolderId: "1-LUW0_eGtHrYU9doli0H8PtUBX2TpWYT",
            batchId: batch23.id,
            branchId: mechBranch.id,
            semesterId: sem3.id,
            typeId: assignmentType.id,
        },
        {
            name: "Engineering Mathematics - Previous Papers",
            description: "Previous year question papers for Engineering Mathematics covering differential equations, linear algebra, probability, and statistics with detailed solutions.",
            price: 18999, // ₹189.99 in paisa
            googleDriveFolderId: "11ab3HBfvmbcSg93iMjpGsiGSQjX1BhWv",
            batchId: batch24.id,
            branchId: null, // Common for all branches
            semesterId: sem1.id,
            typeId: examType.id,
        },
        {
            name: "Computer Networks Tutorial Solutions",
            description: "Complete tutorial solutions for computer networks including OSI model, TCP/IP protocols, routing algorithms, and network security concepts.",
            price: 28999, // ₹289.99 in paisa
            googleDriveFolderId: "1nKcVpkb6UxON2Ye4bo4x5Zojd-tvE9u5",
            batchId: batch24.id,
            branchId: csBranch.id,
            semesterId: sem4.id,
            typeId: tutorialType.id,
        },
        {
            name: "Machine Learning Fundamentals",
            description: "Introduction to machine learning algorithms including supervised and unsupervised learning, neural networks, and practical implementations in Python.",
            price: 39999, // ₹399.99 in paisa
            googleDriveFolderId: "1F1c_pfnGQZ61W5npCqjPfqHHNhmwfRov",
            batchId: batch24.id,
            branchId: csBranch.id,
            semesterId: sem4.id,
            typeId: notesType.id,
        },
    ];

    // Create all products
    for (const productData of products) {
        await prisma.product.upsert({
            where: { googleDriveFolderId: productData.googleDriveFolderId },
            update: {},
            create: productData,
        });
    }

    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
