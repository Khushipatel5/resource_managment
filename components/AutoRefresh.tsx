"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefresh() {
    const router = useRouter();

    useEffect(() => {
        // Refresh the page every 3 seconds (3000 milliseconds)
        const intervalId = setInterval(() => {
            router.refresh();
        }, 3000);

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, [router]);

    return null; // This component does not render any UI
}
