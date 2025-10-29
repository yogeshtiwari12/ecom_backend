"use client";
import supabase from '@/lib/creds';
import React, { useEffect, useState } from 'react';

export default function Page() {
    const [session, setSession] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function getSession() {
            try {
                setLoading(true);
                const { data, error } = await supabase.auth.getSession();
                if (error) {
                    console.error("Session error:", error);
                    if (mounted) setError(error?.message ?? String(error));
                    return;
                }
                console.log("User Session in SES Page:", data);
                if (mounted) setSession((data as any)?.session ?? null);
            } catch (err) {
                console.error("Unexpected error:", err);
                if (mounted) setError("An unexpected error occurred");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        getSession();
        return () => {
            mounted = false;
        };
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Session</h1>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
    );
}
