
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const items = await prisma.item.findMany();

    console.log(`Found ${items.length} items.`);
    items.forEach(i => {
        console.log(` - [${i.category}] ${i.name} ($${i.price})`);
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
