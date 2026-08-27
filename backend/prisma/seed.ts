// Inser initial / basic data into DB automatically when the app is first run

// Load variables from .env file
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

// Create DB adapter
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
});

// Create Prisma client with the adapter
// prisma ibject that can access the DB
const prisma = new PrismaClient({ adapter });

// Define main function that performs the actual seeding of the database
async function main() {

    // Define category data
    const categories = [
        "Face Care",
        "Body Care",
        "Sun Care",
    ];

    // Define product type data
    const productTypes = [
        "Serum",
        "Face Wash",
        "Eye Cream",
        "Moisturizer",
        "Sunscreen",
        "Tanning Oil",
        "Tanning Cream",
        "Body Butter",
    ];


    const brands = [
        "Aichun Beauty",
        "Disaar",
        "Pastil",
        "Rosel",
        "Delta Baharat",
        "Constanta",
        "Roushun",
        "Orchid",
        "Destek",
        "GuanJing",
        "Balen",
        "Fleur's by Hemani",
        "La Roche Posay",
        "Bioxcin",
        "Cire Aseptine",
        "Nitro Canada",
    ];


    // Loop through categories in the array
    // upsert -> update + insert
    // If this record already exists, use it
    // If it doesn't exist, create it
    for (const name of categories) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    // Loop through product types in the array
    for (const name of productTypes) {
        await prisma.productType.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    // Loop through brands in the array
    for (const name of brands) {
        await prisma.brand.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    console.log("Seed completed successfully.");
}

// Up until now we only defined
// Now we run the function
main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

// finally runs whether the seed succeeds / fails