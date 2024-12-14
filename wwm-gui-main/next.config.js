const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
});

module.exports = withPWA({
    env: {
        BACKEND_API_URL: "http://localhost:8000",
    },
});
