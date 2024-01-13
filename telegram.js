require("dotenv").config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendMessageToTelegram(reportData) {
    const { message, page, ipAddress } = reportData;

    const text = `❗ New Report:\n
    💬 Message: ${message}\n
    📄 Page: ${page}\n
    💻 IP Address: ${ipAddress || "N/A"}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const params = new URLSearchParams({
        chat_id: TELEGRAM_CHAT_ID,
        text,
    });
    
    try {
        const response = await fetch(`${url}?${params}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!data.ok) {
            console.error("Failed to send report to Telegram:", data.description);
        }
    } catch (err) {
        console.error("Error sending report to Telegram:", err.message);
    }
}

module.exports = { sendMessageToTelegram };
