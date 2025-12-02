
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const orderId = "c73957e3-885c-4ede-8619-77f8e2108fda";
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true, student: true }
        });
        console.log("Order found:", order);
    } catch (error) {
        console.error("Error finding order:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
