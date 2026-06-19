const cron = require("node-cron");
const axios = require("axios");
const { fetchCryptoPrices } = require("../services/fetchData");
const { fetchCryptoNews } = require("../services/sentiment");

console.log("⏳ Cron jobs initialized...");

// Service URLs to keep alive
const SPRING_BOOT_URL = process.env.SPRING_BOOT_URL || "https://cryptonex-backend-jild.onrender.com";
const BOT_URL = process.env.BOT_URL || "https://cryptonex-bot.onrender.com";

// ✅ Keep-alive ping every 14 minutes — prevents Render free-tier from sleeping
// Render spins down services after 15 min of inactivity; this keeps them awake
cron.schedule("*/14 * * * *", async () => {
    try {
        await axios.get(`${SPRING_BOOT_URL}/`, { timeout: 10000 });
        console.log("✅ Keep-alive: Spring Boot backend is awake.");
    } catch (e) {
        console.log("⚠️ Keep-alive: Spring Boot ping failed (may be starting up):", e.message);
    }
    try {
        await axios.get(`${BOT_URL}/`, { timeout: 10000 });
        console.log("✅ Keep-alive: Chatbot is awake.");
    } catch (e) {
        console.log("⚠️ Keep-alive: Bot ping failed:", e.message);
    }
});

// ✅ Fetch crypto prices every 11 minutes
cron.schedule("*/11 * * * *", async () => {
    console.log("⏳ Running crypto price update...");
    await fetchCryptoPrices();
});

// ✅ Fetch crypto news every hour
cron.schedule("0 * * * *", async () => {
    console.log("⏳ Running crypto news update...");
    await fetchCryptoNews();
});

console.log("✅ Cron jobs scheduled.");
