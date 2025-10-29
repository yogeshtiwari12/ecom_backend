import { getServerSession } from "next-auth";
import { authOptions } from "../../(auth)/auth/[...nextauth]/options";
import { User } from "../../model/userModel";
import { ProductModel } from "../../model/user_product";
import connectDb from "../../route";



export async function GET(request: Request) {
    await connectDb();
    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({
            message: "session not found",
            status: 401,
            success: false
        });
    }

    const userData = await User.find({});
    const userIds = userData.map(user => user._id);
    const productData = await ProductModel.find({ userid: userIds });

   const combined = userData.map(user => {
       const userItems = productData.filter(product => product.userid.toString()  === user._id.toString() && product.isOrderConfirmbyUser === true);//you can use !! also 
       const same_user_totalItems = userItems.reduce((sum, product) => sum + (product.user_cart_count || 0), 0);
       return {
           _id: user._id,
           name: user.name,
           email: user.email,
           items:  userItems ,
           same_user_totalItems
       };
   });

   return Response.json({
       message: "success",
       status: 200,
       success: true,
       users: combined
   });
}
