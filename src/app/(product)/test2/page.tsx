"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'

function Page() {
  const [productData, setProductData] = useState(null);
  const [otp, setOtp] = useState('');
  const [submitOtp, setSubmitOtp] = useState('');
  const [message, setMessage] = useState("");
  const productId = "68b5c6d6157ff99c8487fe62";

  const sendotp = async () => {
    // if (!otp) return;
    try {
      const response = await axios.post(`api/cancel_order_send_otp` );
      setProductData(response.data);
      if (response.data.success) {
        setMessage("OTP sent and verified successfully.");
      } else {
        setMessage(response.data.message || "OTP verification failed.");
      }
    } catch (error) {
      setMessage("OTP verification failed.");
      console.error(error);
    }
  };

  console.log("Product Data:", productData);

  return (
    <div className='bg-white p-8 m-44 flex flex-col gap-6 items-center rounded shadow-lg max-w-md mx-auto'>
      <h2 className='text-3xl text-black font-bold mb-4'>OTP Test</h2>
      <label className='text-lg text-gray-700 mb-2 mt-4' htmlFor='otp-input'>Enter OTP:</label>
      <input
        id='otp-input'
        type="text"
        value={otp}
        onChange={e => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className='border border-gray-300 rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
      />
      <button onClick={sendotp} className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'>Send OTP</button>
      {message && (
        <div className='text-center text-md text-gray-700 mt-4'>{message}</div>
      )}
      {productData && (
        <div className='bg-gray-100 rounded p-4 mt-6 w-full'>
          <pre className='text-sm text-gray-800'>{JSON.stringify(productData, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default Page
