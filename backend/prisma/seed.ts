import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const categories = {
    "Tea & Coffee": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
    "Chocolate & Bournvita": "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80",
    "Shakes & Juices": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    "Burgers": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    "Sandwiches": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    "Maggi": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80",
    "Wraps": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",
    "Snacks": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
    "Extras": "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80",
};

const menuItems = [
    // Tea & Coffee
    { name: "Masala / Ginger Tea (150 ml)", price: 20, category: "Tea & Coffee" },
    { name: "Kulhad Tea (150 ml)", price: 30, category: "Tea & Coffee" },
    { name: "Hot Coffee (150 ml)", price: 30, category: "Tea & Coffee" },
    { name: "Black Hot Coffee (300 ml)", price: 50, category: "Tea & Coffee" },
    { name: "Cold Coffee (300 ml)", price: 60, category: "Tea & Coffee" },

    // Chocolate & Bournvita
    { name: "Cold Chocolate (300 ml)", price: 60, category: "Chocolate & Bournvita" },
    { name: "Hot Bournvita (300 ml)", price: 70, category: "Chocolate & Bournvita" },
    { name: "Cold Bournvita (300 ml)", price: 60, category: "Chocolate & Bournvita" },

    // Shakes & Juices
    { name: "Plain Milk (300 ml)", price: 30, category: "Shakes & Juices" },
    { name: "Banana Shake (300 ml)", price: 50, category: "Shakes & Juices" },
    { name: "Oreo Shake (300 ml)", price: 70, category: "Shakes & Juices" },
    { name: "Mosambi Juice (300 ml)", price: 60, category: "Shakes & Juices" },
    { name: "Kit-Kat Shake (300 ml)", price: 70, category: "Shakes & Juices" },
    { name: "Peanut Butter Shake (300 ml)", price: 99, category: "Shakes & Juices" },
    { name: "Mango Shake (300 ml) (Seasonal)", price: 70, category: "Shakes & Juices" },
    { name: "Brownie Shake (300 ml)", price: 80, category: "Shakes & Juices" },

    // Burgers
    { name: "Aloo Tikki Burger (ATBC)", price: 60, category: "Burgers" }, // Taking lower bound of 60-70
    { name: "Paneer Burger", price: 70, category: "Burgers" }, // Taking lower bound of 70-80
    { name: "Veg Burger", price: 65, category: "Burgers" }, // Taking lower bound of 65-75
    { name: "Crispy Paneer Burger", price: 99, category: "Burgers" },

    // Sandwiches
    { name: "Aloo Tikki Sandwich", price: 65, category: "Sandwiches" }, // Taking lower bound
    { name: "Paneer Sandwich", price: 70, category: "Sandwiches" }, // Taking lower bound
    { name: "Veg Sandwich", price: 60, category: "Sandwiches" }, // Taking lower bound
    { name: "Aloo Tikki Paneer Sandwich", price: 90, category: "Sandwiches" },

    // Maggi
    { name: "Plain / Masala Maggi", price: 40, category: "Maggi" },
    { name: "Veg Maggi", price: 50, category: "Maggi" },
    { name: "Cheese Maggi", price: 50, category: "Maggi" },
    { name: "Makhni Masala Maggi", price: 60, category: "Maggi" },
    { name: "Chatpati Achaari Maggi", price: 60, category: "Maggi" },
    { name: "Cheese Butter Maggi", price: 70, category: "Maggi" },

    // Wraps
    { name: "Chilli Garlic Wrap", price: 80, category: "Wraps" },
    { name: "Veg Cheese Wrap", price: 90, category: "Wraps" },
    { name: "Crispy Paneer Wrap", price: 99, category: "Wraps" },

    // Snacks
    { name: "Crinkle Fries", price: 90, category: "Snacks" },
    { name: "French Fries", price: 80, category: "Snacks" },
    { name: "Peri Peri Fries", price: 90, category: "Snacks" },
    { name: "Cheese Fries", price: 99, category: "Snacks" },
    { name: "Spring Roll (6 pcs)", price: 80, category: "Snacks" },
    { name: "Veggie Fingers (6 pcs)", price: 80, category: "Snacks" },
    { name: "Smiley Fries (6 pcs)", price: 80, category: "Snacks" },
    { name: "Veg Fried Momo (8 pcs)", price: 80, category: "Snacks" },
    { name: "Cheese Corn Momo (8 pcs)", price: 90, category: "Snacks" },
    { name: "Veg Kurkure Momo", price: 99, category: "Snacks" },
    { name: "Paneer Momo (8 pcs)", price: 99, category: "Snacks" },
    { name: "Chilli Garlic Potatoes (15 pcs)", price: 80, category: "Snacks" },
    { name: "Pizza Pockets (5 pcs)", price: 90, category: "Snacks" },
    { name: "Onion Rings (8 pcs)", price: 99, category: "Snacks" },
    { name: "Cheese Nuggets (8 pcs)", price: 90, category: "Snacks" },

    // Extras
    { name: "Extra Dip Charges", price: 10, category: "Extras" },
];

async function main() {
    console.log("Seeding database...");

    // Create Admin User if not exists
    const adminEmail = "admin@chaiadda.com";
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await prisma.user.create({
            data: {
                name: "Vendor Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "ADMIN",
            },
        });
        console.log("Admin user created.");
    }

    // Clear existing data to avoid foreign key constraints
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.item.deleteMany({});
    console.log("Cleared existing orders and items.");

    // Insert new items
    for (const item of menuItems) {
        await prisma.item.create({
            data: {
                name: item.name,
                price: item.price,
                category: item.category,
                image: categories[item.category as keyof typeof categories],
                available: true,
            },
        });
    }

    console.log(`Seeded ${menuItems.length} items.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
