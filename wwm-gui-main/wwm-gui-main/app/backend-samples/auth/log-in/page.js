"use client";
import useBackend from "@/backend/useBackend";
import { useState } from "react";

export default function () {
    const backend = useBackend();
    const [userIdentity, setUserIdentity] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorId, setErrorId] = useState("");

    const [successMessage, setSuccessMessage] = useState("");

    async function onSubmit() {
        const result = await backend.login(userIdentity, password);

        if (result.success) {
            if (result.is_admin) {
                // router.push...
            } else {
                // router.push...
            }
            // just in this preview (by default we forward to another page if auth succeeds)
            setErrorId("");
            setErrorMessage("");
            setSuccessMessage("Logged in as " + (result.is_admin ? "admin" : "player") + "!")
        } else {
            setErrorMessage(result.message);
            setErrorId(result.error_id);
        }
    }

    return <div>
        <input type="text" value={userIdentity} onChange={(e) => setUserIdentity(e.target.value)} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={onSubmit}>Login</button>
        <span>{errorMessage} {errorId && `(${errorId})`}</span>
        <span>{successMessage}</span>
    </div>
}