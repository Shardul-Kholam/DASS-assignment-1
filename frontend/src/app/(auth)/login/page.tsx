"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/app/(auth)/login/login-form";

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        // If user is already logged in, redirect to dashboard
        const token = localStorage.getItem("authToken");
        const userID = localStorage.getItem("userID");
        
        if (token && userID) {
            router.push(`/${userID}/dashboard`);
        }
    }, [router]);

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm/>
            </div>
        </div>
    )
}
