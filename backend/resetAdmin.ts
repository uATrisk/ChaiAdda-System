
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const email = "anshtomarnew@gmail.com";
    const password = "1234567890";
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });
        console.log(`Password updated for user: ${user.email}`);
    } catch (error) {
        console.error("Error updating password:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
