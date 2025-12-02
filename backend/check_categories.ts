import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const items = await prisma.item.findMany();
    console.log("Total items:", items.length);
    items.forEach(item => console.log(JSON.stringify(item.name)));
    const categories = new Set(items.map(i => i.category));
    console.log("Categories in DB:", Array.from(categories));

    // Check specific items
    const snacks = items.filter(i => i.category === "Snacks");
    console.log("Snacks count:", snacks.length);
    if (snacks.length > 0) {
        console.log("Sample Snack:", snacks[0]);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
