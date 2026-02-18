"use client";
import {useEffect} from "react";
import initClientLogger from "@/lib/logger";

export default function ClientLogger() {
    useEffect(() => {
        initClientLogger();
    }, []);
    return null;
}
