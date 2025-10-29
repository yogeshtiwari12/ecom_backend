const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const items = [
        {
            itemid: 'item1',
            name: 'Item 1',
            price: 100,
            description: 'Description for Item 1',
        },
        {
            itemid: 'item2',
            name: 'Item 2',
            price: 200,
            description: 'Description for Item 2',
        },
        // Add more items as needed
    ];

    try {
        const result = await prisma.item.createMany({
            data: items,
            skipDuplicates: true, // Prevents errors if items already exist
        });
        console.log('Data inserted successfully:', result);
    } catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();