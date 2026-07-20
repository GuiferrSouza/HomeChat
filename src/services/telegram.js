const VITE_TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const VITE_TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

const TELEGRAM_API_URL = `https://api.telegram.org/bot${VITE_TELEGRAM_BOT_TOKEN}`;
const TELEGRAM_API_URL_MESSAGE = `${TELEGRAM_API_URL}/sendMessage`;
const APP_NAME = "HomeChat";

export const notifyAccess = async (location) => {
    const locationText = location ? [
        `Latitude: ${location.latitude.toFixed(1)}`,
        `Longitude: ${location.longitude.toFixed(1)}`,
        `Precisão: ${Math.round(location.accuracy)} m`,
    ].join('\n') : 'Localização não informada';

    const message = [
        `🔔 Novo acesso realizado em ${APP_NAME}`,
        '',
        locationText,
    ].join('\n');

    const response = await fetch(
        TELEGRAM_API_URL_MESSAGE,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({
                chat_id: VITE_TELEGRAM_CHAT_ID,
                text: message,
            }),
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Telegram notification error: ${error}`);
    }

    return response.json();
};