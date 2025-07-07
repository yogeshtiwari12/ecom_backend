"use client";
import React from 'react';
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const handleLogout = async () => {
    
    try {
      const res = await axios.post("http://localhost:3000/api/logout");
      console.log("Logout response:", res);
      toast.success("Logout successful");
      if (res.data.status) {
        toast.success("Logout successful");
        console.log("Logout successful");
      }
    } catch (error: any) {
      toast.error(error?.message || "Logout failed");
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">User Profile</h1>
      <div className="bg-white p-4 rounded shadow">
        <p>Welcome, {session?.user?.name || "Guest"}</p>
        <p>Email: {session?.user?.email}</p>
        <pre className="bg-gray-100 p-2 mt-4 rounded overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
        {session ?
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          // disabled={status === "loading"}
        >
          logout
        </button>
        
        :(<button onClick={()=>router.replace("/sign-in")}>signIn</button>)
}
      </div>
    </div>
  );
}

export default Page;
