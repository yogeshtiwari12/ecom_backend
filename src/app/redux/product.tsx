import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const users_with_prod_details = createAsyncThunk(
    "product/users_with_prod_details", async () => {
        try {
            const response = await axios.get("api/users_with_prod_details", {
                withCredentials: true,
            });
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.error("Error fetching users with product details:", error);
            throw new Error("Failed to fetch users with product details");
        }
    }
);


export const update_address = createAsyncThunk(
    "product/updateProduct", async ({ orderId, address }: { orderId: string; address: string }) => {
        try {
            const response = await axios.post(`api/updateProduct/${orderId}`, { address }, {
                withCredentials: true,
            });
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.error("Error updating address:", error);
            throw new Error("Failed to update address");
        }
    }
);

export const cancel_order = createAsyncThunk(
    "product/cancel_order", async (id: string) => {
        try {
            const response = await axios.post(`api/cancel_order/${id}`, {}, {
                withCredentials: true,
            });
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            throw new Error("Failed to cancel order");
        }
    }
);

export const increase_cart_count = createAsyncThunk(
    "product/increase_cart_count", async (id: string) => {
        try {
            const response = await axios.post(`api/increase_cart_count/${id}`, {}, {
                withCredentials: true,
            });
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
            throw new Error("Failed to add product to cart");
        }
    }
);


export const addcart_data = createAsyncThunk(
    "product/addcart_data", async (id: string) => {
        try {
            const response = await axios.post(`api/add_cart/${id}`, {}, {
                withCredentials: true,
            });
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
            throw new Error("Failed to add product to cart");
        }
    }
);

export const removecart_data = createAsyncThunk(
    "product/removecart_data", async (id: string) => {
        try {
            const response = await axios.post(`api/remove_cart/${id}`, {}, {
                withCredentials: true,
            });
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.error("Error removing product from cart:", error);
            throw new Error("Failed to remove product from cart");
        }
    }
);



export const getproduct_data  = createAsyncThunk(
    "product/getproduct_data",async()=>{
        try {
            const response = await axios.get("api/products",{
                withCredentials: true,
            });
             if(response.status === 200){
                return response.data;
            } 
            
        } catch (error) {
            console.error("Error fetching product data:", error);
            throw new Error("Failed to fetch product data");
            
        }
    }
);
const product = createAsyncThunk(
    "product/product", async (id) => {
        try {
            const response = await axios.get(`api/product/${id}`, {
                withCredentials: true,
            });
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            throw new Error("Failed to fetch product");
        }
    })

const productSlice = createSlice({
    name: "product",
    initialState: {
        productData: [],
        loading: false,
        error: null as string | null,
        cartdata: [],
        productId: null as string | null,

    
    },

    reducers: {
        setProductId: (state, action) => {
            state.productId = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getproduct_data.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getproduct_data.fulfilled, (state, action) => {
                state.loading = false;
                state.productData = action.payload;
            })
            .addCase(getproduct_data.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to fetch product data";
            })



            .addCase(product.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(product.fulfilled, (state, action) => {
                state.loading = false;
                state.productData = action.payload.product;
            })
            .addCase(product.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to fetch product";
            } )
            
            
            .addCase(addcart_data.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addcart_data.fulfilled, (state, action) => {
                state.loading = false;
                state.cartdata = action.payload;
            })  
            .addCase(addcart_data.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to add product to cart";
            })

            .addCase(removecart_data.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removecart_data.fulfilled, (state, action) => {
                state.loading = false;
                state.cartdata = action.payload;
            })
            .addCase(removecart_data.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to remove product from cart";
            })

            .addCase(increase_cart_count.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(increase_cart_count.fulfilled, (state, action) => {
                state.loading = false;
                state.cartdata = action.payload;
            })
            .addCase(increase_cart_count.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to increase cart count";
            })

            .addCase(update_address.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(update_address.fulfilled, (state, action) => {
                state.loading = false;
                state.cartdata = action.payload;
            })
            .addCase(update_address.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to update address";
            })
            .addCase(users_with_prod_details.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(users_with_prod_details.fulfilled, (state, action) => {
                state.loading = false;
                state.cartdata = action.payload;
            })
            .addCase(users_with_prod_details.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to fetch users with product details";
            })
    },

})

export const productActions = productSlice.actions;
export { product };
export const { setProductId } = productActions;
export default productSlice.reducer;
