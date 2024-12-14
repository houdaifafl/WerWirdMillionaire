const express = require("express");
const handle = require("./asyncHandler");
const router = express.Router();

const UserController = require("../controllers/UserController");
const asyncHandler = require("./asyncHandler");

router.post(
    "/logout",
    asyncHandler(async (req, res) => {
        await UserController.logout(req.get("auth_token"));

        return res.status(200).send({
            success: true,
        });
    })
);

router.post(
    "/signup",
    asyncHandler(async (req, res) => {
        const { username, auth_token } = await UserController.signup(
            req.body.surname,
            req.body.lastname,
            req.body.email,
            req.body.password,
            req.body.birthday
        );

        res.status(201).send({
            success: true,
            username,
            auth_token,
        });
    })
);

router.delete("/", asyncHandler(async (req, res) => {
    await UserController.deleteAccount(req.get("auth_token"));

    res.status(200).send({
        success: true,
    });
}));

router.post(
    "/login",
    asyncHandler(async (req, res) => {
        const data = await UserController.login(
            req.body.user_identity,
            req.body.password
        );

        return res.status(201).send({
            success: true,
            ...data,
        });
    })
);

router.post(
    "/security-questions",
    asyncHandler(async (req, res) => {
        await UserController.setSecurityQuestions(
            req.get("auth_token"),
            req.body.favourite_color,
            req.body.mother_name,
            req.body.place_of_birth
        );

        res.status(201).send({
            success: true,
        });
    })
);

router.patch(
    "/security-questions",
    asyncHandler(async (req, res) => {
        const reset_password_token =
            await UserController.checkSecurityQuestions(
                req.body.user_identity,
                req.body.favourite_color,
                req.body.mother_name,
                req.body.place_of_birth
            );

        return res.status(200).send({
            success: true,
            reset_password_token,
        });
    })
);

router.post(
    "/reset-password",
    asyncHandler(async (req, res) => {
        const result = await UserController.resetPassword(
            req.get("reset_password_token"),
            req.body.password
        );

        return res.status(200).send({
            success: true,
            ...result,
        });
    })
);

module.exports = router;
