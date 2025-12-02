import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const updated = await prisma.item.updateMany({
        where: {
            name: {
                contains: "Masala",
            },
        },
        data: {
            image: "/images/masala-chai.png",
        },
    });
    console.log(`Updated ${updated.count} items with custom image.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
