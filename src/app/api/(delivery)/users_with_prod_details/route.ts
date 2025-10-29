import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const users = await prisma.user.findMany();

    const userProducts = await prisma.userProduct.findMany({
        where: {
            userId: { in: users.map((user) => user.id) }
        }
    });

    const matchedData = users.map((user) => {
        const products = userProducts.filter((product) => product.userId && product.userId.toString() === user.id.toString())
        .map((product) => ({
            id: product.id,
            productname: product.product_name,
            productprice: product.user_product_price,
            productaddress: product.address,
            productdeliverystatus: product.product_delivery_status,
            productId: product.productId
        }));

        return {
            username: user.name,
            userphone: user.phone,
            products
        };
    });

    return new Response(JSON.stringify({
        success: true,
        data: matchedData,
        message: "User products fetched successfully"
    }));
}
