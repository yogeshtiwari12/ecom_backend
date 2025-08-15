"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'

function Page() {
    const [productData, setProductData] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const response = await axios.get('/api/cart_data');
            setProductData(response.data);
        };
        fetchProduct();
    }, []);

    console.log("Product Data:", productData);
  return (
    <div>
      
    </div>
  )
}

export default Page
