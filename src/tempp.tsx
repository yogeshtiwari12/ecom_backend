import { prisma } from "./lib/prisma";
import { createClient } from '@supabase/supabase-js';

// Try direct Supabase connection first to test if your project is accessible
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testConnection = async () => {
    console.log("Testing Supabase connection first...");
    try {
        // Test Supabase connection 
        const { data: versionData, error: versionError } = await supabase.from('pg_version').select('*').limit(1);
        
        if (versionError) {
            console.log("Supabase API error:", versionError);
        } else {
            console.log("Supabase connection successful:", versionData);
        }
        
        console.log("\nNow testing Prisma connection...");
        
        // Test Prisma connection
        await prisma.$connect();
        console.log("Prisma connected successfully");
        
        // Try a simple query to verify connection
        let userCount = await prisma.user.count();
        console.log("Database query successful. User count:", userCount);

        // If no users, create one automatically
        if (userCount === 0) {
            const newUser = await prisma.user.create({
                data: {
                    email: "testuser@example.com",
                    name: "Test User",
                    password: "testpassword",
                },
            });
            console.log("Created new user:", newUser);
            userCount = await prisma.user.count();
            console.log("User count after creation:", userCount);
        }
        return true;
    } catch (err) {
        console.error("Connection failed:", err);
        return false;
    } finally {
        await prisma.$disconnect();
    }
};

testConnection();