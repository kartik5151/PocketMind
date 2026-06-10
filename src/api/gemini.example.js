// rename this file to gemini.js and add your real OpenRouter API key
export const sendMessageToGemini = async (userMessage) => {

    const API_KEY = "your_openrouter_api_key_here";
    const API_URL = "https://openrouter.ai/api/v1/chat/completions";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b:free",
                messages: [
                    {
                        role: "user",
                        content: userMessage,
                    }
                ],
            }),
        });

        const data = await response.json();
        const reply = data.choices[0].message.content;
        return reply;

    } catch (error) {
        console.error("AI error:", error);
        return "Sorry, something went wrong. Please try again.";
    }
};