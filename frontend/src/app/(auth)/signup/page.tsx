"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/app/(auth)/signup/signup-form";

export default function SignupPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const userID = localStorage.getItem("userID");
        
        if (token && userID) {
            router.push(`/${userID}/dashboard`);
        }
    }, [router]);

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <SignupForm/>
            </div>
        </div>
    )
}
