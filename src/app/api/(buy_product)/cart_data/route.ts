import { getServerSession } from "next-auth/next";
import { ProductModel } from "../../model/user_product";
import connectDb from "../../route";
import { authOptions } from "../../(auth)/auth/[...nextauth]/options";


export async function GET(request: Request) {
  
  
  try{
  await connectDb();
  const iSsessionActive = await getServerSession(authOptions);
  if (!iSsessionActive) {
    return new Response(JSON.stringify({ error:`Server Session Error ${iSsessionActive}`}), { status: 401 });
  }
  const data = await ProductModel.find({
    $and: [
      { userid: iSsessionActive?.user?._id },
      { iscancelled: false }
    ]
  });

  
  if(!data){
    return Response.json(
      { message: "No products found for this user", success: false },
      { status: 404 }
    );
  }
  return Response.json(
    { message: "Products retrieved successfully", success: true, products: data },
    { status: 200 }
  );
}
catch (error) {
  console.error("Error retrieving products:", error);
  return Response.json(
    { message: "Failed to retrieve products", error: (error as Error).message, success: false },
    { status: 500 }
  );
}
}