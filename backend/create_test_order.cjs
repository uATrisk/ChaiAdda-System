
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // Find a student
        const student = await prisma.user.findFirst({
            where: { role: 'STUDENT' }
        });

        if (!student) {
            console.log("No student found. Please create a student first.");
            return;
        }

        // Find an item
        const item = await prisma.item.findFirst();
        if (!item) {
            console.log("No item found.");
            return;
        }

        // Create order
        const order = await prisma.order.create({
            data: {
                studentId: student.id,
                amount: item.price,
                utr: "MANUAL_TEST_123",
                items: {
                    create: {
                        itemId: item.id,
                        qty: 1,
                        price: item.price
                    }
                }
            }
        });

        console.log("Created order:", order.id);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
