import { ProductModel } from "../../model/user_product";
import { User } from "../../model/userModel";

export async function GET(request: Request) {
    const users = await User.find();

    const userProducts = await ProductModel.find({
        userid: { $in: users.map(user => user._id) }
    });

    const matchedData = users.map(user => {
        const products = userProducts.filter(product => product.userid.toString() === user._id.toString())
        .map(product => ({
                productname: product.product_name,
                productprice: product.user_product_price,
                productaddress: product.adress,
                productdeliverystatus: product.product_delivery_status
            }));

        return {
            username: user.name,
            userphone: user.phoneno,
            products
        };
    });

    return Response.json({
        success: true,
        data: matchedData,
        message: "User products fetched successfully"
    });
}
