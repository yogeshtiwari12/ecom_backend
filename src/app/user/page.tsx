"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react";
import axios from 'axios';


interface ProfileData {
    name?: string;
    email?: string;
    id?: string;
    [key: string]: any; 
}

function UserPage() {
    const { data: session, status } = useSession();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    console.log("Session data:", session);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                setError(null); 

                const response = await axios.get("http://localhost:3000/api/cart_data", {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.data) {
                    throw new Error('No data received from server');
                }

                setProfileData(response.data);
                console.log("Profile data:", response.data);
            } catch (err) {
                const errorMessage = err instanceof Error 
                    ? err.message 
                    : 'An error occurred while fetching profile data';
                setError(errorMessage);
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if user is authenticated
        if (status === "authenticated" && session?.user) {
            fetchProfileData();
        } else {
            setLoading(false); // Stop loading if not authenticated
        }
    }, [status, session]);

    // Show loading state
    if (status === "loading") {
        return (
            <div className="container mx-auto p-4">
                <div className="animate-pulse text-center">Loading...</div>
            </div>
        );
    }

    // Show unauthenticated state
    if (status === "unauthenticated") {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-yellow-700">
                        Please sign in to view your profile.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Profile</h1>
            <div className="bg-white p-4 rounded shadow">
                <div className="mb-4">
                    <p className="text-lg">
                        Status: <span className="font-semibold text-green-600">{status}</span>
                    </p>
                    <p className="text-lg">
                        Welcome, <span className="font-semibold">{session?.user?.name || "Guest"}</span>
                    </p>
                    <p className="text-lg">
                        Email: <span className="font-medium">{session?.user?.email || "Not signed in"}</span>
                    </p>
                </div>

                {loading && (
                    <div className="text-gray-600 animate-pulse">
                        <p>Loading profile data...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                        <p className="text-red-700">Error: {error}</p>
                    </div>
                )}

                {profileData && !loading && (
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold mb-2">Profile Data:</h2>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
                            {JSON.stringify(profileData, null, 2)}
                        </pre>
                    </div>
                )}

                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Session Data:</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
                        {JSON.stringify(session, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    )
}

export default UserPage

