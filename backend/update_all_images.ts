import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const imageMapping: { [key: string]: string } = {
    // Tea & Coffee
    "Masala / Ginger Tea (150 ml)": "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80",
    "Masala / Ginger Tea (250 ml)": "https://images.unsplash.com/photo-1576092768241-dec231847233?auto=format&fit=crop&w=800&q=80", // Different tea
    "Elaichi Tea (150 ml)": "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=800&q=80",
    "Elaichi Tea (250 ml)": "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80",
    "Kulhad Tea (150 ml)": "https://images.unsplash.com/photo-1576092768241-dec231847233?auto=format&fit=crop&w=800&q=80", // Clay cup look
    "Hot Coffee (150 ml)": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    "Hot Coffee (250 ml)": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    "Black Hot Coffee (300 ml)": "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
    "Cold Coffee": "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80",
    "Cold Coffee (300 ml)": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
    "Cold Coffee with Ice Cream": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    "Black Coffee": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",

    // Chocolate & Bournvita
    "Hot Chocolate": "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80",
    "Bournvita": "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=800&q=80",
    "Cold Chocolate (300 ml)": "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80",
    "Hot Bournvita (300 ml)": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
    "Cold Bournvita (300 ml)": "https://images.unsplash.com/photo-1553177595-4de2bb0842b9?auto=format&fit=crop&w=800&q=80",
    "Plain Milk (300 ml)": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",

    // Shakes & Juices
    "Oreo Shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    "KitKat Shake": "https://images.unsplash.com/photo-1553177595-4de2bb0842b9?auto=format&fit=crop&w=800&q=80",
    "Chocolate Shake": "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80",
    "Butterscotch Shake": "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80",
    "Strawberry Shake": "https://images.unsplash.com/photo-1579954115563-e72bf1381629?auto=format&fit=crop&w=800&q=80",
    "Vanilla Shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    "Banana Shake (300 ml)": "https://images.unsplash.com/photo-1588775226864-8f7138b56956?auto=format&fit=crop&w=800&q=80",
    "Oreo Shake (300 ml)": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    "Mosambi Juice (300 ml)": "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
    "Kit-Kat Shake (300 ml)": "https://images.unsplash.com/photo-1553177595-4de2bb0842b9?auto=format&fit=crop&w=800&q=80",
    "Peanut Butter Shake (300 ml)": "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80",
    "Mango Shake (300 ml) (Seasonal)": "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80",
    "Brownie Shake (300 ml)": "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80",

    // Burgers
    "Veg Burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    "Veg Cheese Burger": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    "Aloo Tikki Burger": "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80",
    "Aloo Tikki Burger (ATBC)": "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80",
    "Paneer Burger": "https://images.unsplash.com/photo-1561758033-d8f19662cb23?auto=format&fit=crop&w=800&q=80",
    "Crispy Paneer Burger": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",

    // Sandwiches
    "Aloo Tikki Sandwich": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    "Paneer Sandwich": "https://images.unsplash.com/photo-1554433607-66b5efe9d304?auto=format&fit=crop&w=800&q=80",
    "Veg Sandwich": "https://images.unsplash.com/photo-1592415499556-74fc2d396e65?auto=format&fit=crop&w=800&q=80",
    "Aloo Tikki Paneer Sandwich": "https://images.unsplash.com/photo-1553909489-cd47e3b4430f?auto=format&fit=crop&w=800&q=80",

    // Maggi
    "Veg Maggi": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80",
    "Cheese Maggi": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
    "Chatpati Achaari Maggi": "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80",
    "Cheese Butter Maggi": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    "Plain / Masala Maggi": "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=800&q=80",
    "Makhni Masala Maggi": "https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=800&q=80",

    // Wraps
    "Chilli Garlic Wrap": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",
    "Veg Cheese Wrap": "https://images.unsplash.com/photo-1562059390-a761a084768e?auto=format&fit=crop&w=800&q=80", // Reusing spring roll/wrap look
    "Crispy Paneer Wrap": "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=80",

    // Snacks
    "Crinkle Fries": "https://images.unsplash.com/photo-1630384060421-a431e4c2a14d?auto=format&fit=crop&w=800&q=80",
    "French Fries": "https://images.unsplash.com/photo-1573080496987-a199f8cd4054?auto=format&fit=crop&w=800&q=80",
    "Peri Peri Fries": "https://images.unsplash.com/photo-1585109649139-3668018951a7?auto=format&fit=crop&w=800&q=80",
    "Cheese Fries": "https://images.unsplash.com/photo-1586190848861-99c8a3fb7ea5?auto=format&fit=crop&w=800&q=80",
    "Spring Roll (6 pcs)": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    "Veggie Fingers (6 pcs)": "https://images.unsplash.com/photo-1562059390-a761a084768e?auto=format&fit=crop&w=800&q=80",
    "Smiley Fries (6 pcs)": "https://images.unsplash.com/photo-1630384060421-a431e4c2a14d?auto=format&fit=crop&w=800&q=80",
    "Veg Fried Momo (8 pcs)": "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=800&q=80",
    "Cheese Corn Momo (8 pcs)": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
    "Veg Kurkure Momo": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    "Paneer Momo (8 pcs)": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80",
    "Chilli Garlic Potatoes (15 pcs)": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80",
    "Pizza Pockets (5 pcs)": "https://images.unsplash.com/photo-1562059390-a761a084768e?auto=format&fit=crop&w=800&q=80",
    "Onion Rings (8 pcs)": "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=800&q=80",
    "Cheese Nuggets (8 pcs)": "https://images.unsplash.com/photo-1562059390-a761a084768e?auto=format&fit=crop&w=800&q=80",

    // Extras
    "Extra Dip Charges": "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80",
};

async function main() {
    const allItems = await prisma.item.findMany();

    for (const item of allItems) {
        const imageUrl = imageMapping[item.name];
        if (imageUrl) {
            await prisma.item.update({
                where: { id: item.id },
                data: { image: imageUrl },
            });
            console.log(`Updated "${item.name}"`);
        } else {
            console.log(`MISSING MAPPING FOR: "${item.name}"`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
