import { useRouter } from "next/navigation";
import useGlobals from "./useGlobals";

/**
 * @param {{
 *  requiresUserLoggedIn?: boolean,
 *  requiresAdminLoggedIn?: boolean,
 * requiresUserLoggedOut?: boolean,
 * }} options
 */
export default function ({
    requiresUserLoggedIn,
    requiresAdminLoggedIn,
    requiresUserLoggedOut,
}) {
    const globals = useGlobals();
    const router = useRouter();

    if (requiresUserLoggedIn && !globals.authToken) {
        router.push("/account/log-in");
    } else if (requiresAdminLoggedIn) {
        if (!globals.authToken) router.push("/account/log-in");
        else if (!globals.isAdmin) {
            router.push("/user/homepage");
        }
    } else if (requiresUserLoggedOut && globals.authToken) {
        if (globals.securityQuestionsAnswered === false) {
            router.push("/account/security-questions");
        } else {
            if (globals.isAdmin) router.push("/admin/admin-menu");
            else router.push("/user/homepage");
        }
    } else if (requiresUserLoggedIn && globals.isAdmin) {
        router.push("/admin/admin-menu");
    }
}
