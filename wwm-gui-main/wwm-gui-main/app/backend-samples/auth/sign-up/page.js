"use client";
import useBackend from "@/backend/useBackend";
import { useState } from "react";

export default function () {
    const backend = useBackend();

    const [email, setEmail] = useState("");
    const [surname, setSurname] = useState("");
    const [lastname, setLastname] = useState("");
    const [birthday, setBirthday] = useState("");
    const [favouriteColor, setFavouriteColor] = useState("");
    const [placeOfBirth, setPlaceOfBirth] = useState("");
    const [motherName, setMotherName] = useState("");
    const [password, setPassword] = useState("");

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorId, setErrorId] = useState("");

    async function onSubmit() {
        const result = await backend.signup(surname, lastname, email, password, birthday, favouriteColor, motherName, placeOfBirth);

        if (result.success) {
            // router.push...
            // just in this preview (by default we forward to another page if auth succeeds)
            setErrorId("");
            setErrorMessage("");
            setSuccessMessage("Signed up as as " + (result.username) + "!");
        } else {
            setErrorMessage(result.message);
            setErrorId(result.error_id);
        }
    }

    return <div>
        <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
            Surname
            <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
        </label>
        <label>
            Lastname
            <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} />
        </label>
        <label>
            Birthday
            <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
        </label>
        <label>
            Favourite Color
            <input type="color" value={favouriteColor} onChange={(e) => setFavouriteColor(e.target.value)} />
        </label>
        <label>
            Place of Birth
            <input type="text" value={placeOfBirth} onChange={(e) => setPlaceOfBirth(e.target.value)} />
        </label>
        <label>
            Mother Name
            <input type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} />
        </label>
        <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>



        <button onClick={onSubmit}>Login</button>
        <span>{errorMessage} {errorId && `(${errorId})`}</span>
        <span>{successMessage}</span>
    </div>
}