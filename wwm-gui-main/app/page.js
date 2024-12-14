"use client";
import { useRouter } from "next/navigation";
import useBackend from "@/backend/useBackend";

export default function Page() {
    const router = useRouter();
    const backend = useBackend();

    if (backend.globals.authToken) {
        if (backend.globals.isAdmin) {
            router.push("/admin/admin-menu");
        } else {
            router.push("/user/homepage");
        }
    } else {
        router.push("/account/log-in");
    }

    return <></>;
}
