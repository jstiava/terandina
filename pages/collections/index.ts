// pages/redirect-me.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function RedirectMe() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/products");
    }, [router]);

    return null;
}